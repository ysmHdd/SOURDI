const axios = require("axios");
const Transaction = require("../models/Transaction");
const DerniereConnexion = require("../models/DerniereConnexion");
const SessionTemps = require("../models/SessionTemps");

const ELEVE_URL = process.env.ELEVE_SERVICE_URL;

// Règles de gains
const REGLES = {
  quiz: (score, total) => score * 10,
  lecon: () => 20,
  connexion: (streak) => (streak >= 7 ? 20 : streak >= 3 ? 10 : 5),
  auto_evaluation: () => 15,
  temps: () => 10, // toutes les 30 min
};

// Créditer les coins dans eleve-service
const crediterEleve = async (eleveId, montant, token) => {
  await axios.patch(
    `${ELEVE_URL}/api/eleve/coins/crediter`,
    { montant },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Sauvegarder la transaction
const sauvegarderTransaction = async (
  eleveId,
  type,
  montant,
  description,
  meta = {}
) => {
  return await Transaction.create({
    eleveId,
    type,
    montant,
    description,
    meta,
  });
};

// ── QUIZ ──────────────────────────────────────────────
const recompenseQuiz = async (
  eleveId,
  { score, total, matiere, coursId, quizId },
  token
) => {
  if (quizId) {
    const dejaRecompense = await Transaction.findOne({
      eleveId,
      type: "quiz",
      "meta.quizId": quizId,
    });

    if (dejaRecompense) {
      return {
        montant: 0,
        dejaRecompense: true,
      };
    }
  }

  const montant = REGLES.quiz(score, total);

  if (montant <= 0) {
    return { montant: 0 };
  }

  await crediterEleve(eleveId, montant, token);

  await sauvegarderTransaction(
    eleveId,
    "quiz",
    montant,
    `Quiz ${matiere} : ${score}/${total} bonnes réponses`,
    { matiere, score, total, coursId, quizId }
  );

  return {
    montant,
    dejaRecompense: false,
  };
};

// ── LEÇON ─────────────────────────────────────────────
const recompenseLecon = async (eleveId, { matiere, titre, coursId }, token) => {
  if (coursId) {
    const dejaRecompense = await Transaction.findOne({
      eleveId,
      type: "lecon",
      "meta.coursId": coursId,
    });

    if (dejaRecompense) {
      return {
        montant: 0,
        dejaRecompense: true,
      };
    }
  }

  const montant = REGLES.lecon();

  await crediterEleve(eleveId, montant, token);

  await sauvegarderTransaction(
    eleveId,
    "lecon",
    montant,
    `Leçon complétée : ${titre || matiere}`,
    { matiere, titre, coursId }
  );

  return {
    montant,
    dejaRecompense: false,
  };
};

// ── CONNEXION QUOTIDIENNE ─────────────────────────────
const recompenseConnexion = async (eleveId, token) => {
  const maintenant = new Date();

  const debutJour = new Date();
  debutJour.setHours(0, 0, 0, 0);

  const derniere = await DerniereConnexion.findOne({ eleveId });

  if (derniere && derniere.date >= debutJour) {
    return {
      montant: 0,
      dejaConnecte: true,
      streak: derniere.streak,
      totalConnexions: derniere.totalConnexions || 1,
    };
  }

  const hierDebut = new Date(debutJour);
  hierDebut.setDate(hierDebut.getDate() - 1);

  let streak = 1;

  if (derniere && derniere.date >= hierDebut) {
    streak = (derniere.streak || 1) + 1;
  }

  const totalConnexions = (derniere?.totalConnexions || 0) + 1;

  await DerniereConnexion.findOneAndUpdate(
    { eleveId },
    {
      date: maintenant,
      streak,
      totalConnexions,
    },
    { upsert: true, new: true }
  );

  const montant = REGLES.connexion(streak);

  await crediterEleve(eleveId, montant, token);

  await sauvegarderTransaction(
    eleveId,
    "connexion",
    montant,
    `Connexion quotidienne — Série : ${streak} jour${streak > 1 ? "s" : ""}`,
    { streak, totalConnexions }
  );

  return {
    montant,
    streak,
    totalConnexions,
    dejaConnecte: false,
  };
};

// ── AUTO-ÉVALUATION ───────────────────────────────────
const recompenseAutoEvaluation = async (eleveId, { note }, token) => {
  const montant = REGLES.auto_evaluation();

  await crediterEleve(eleveId, montant, token);

  await sauvegarderTransaction(
    eleveId,
    "auto_evaluation",
    montant,
    `Auto-évaluation soumise : ${note}/10`,
    { note }
  );

  return { montant };
};

// ── TEMPS PASSÉ ───────────────────────────────────────
const recompenseTemps = async (eleveId, { minutes }, token) => {
  const minutesAjoutees = Number(minutes) || 0;

  if (minutesAjoutees <= 0 || minutesAjoutees > 30) {
    return {
      montant: 0,
      message: "Minutes invalides",
    };
  }

  const session = await SessionTemps.findOneAndUpdate(
    { eleveId },
    { $inc: { minutesAccumulees: minutesAjoutees } },
    { upsert: true, new: true }
  );

  const palierActuel = Math.floor(session.minutesAccumulees / 30);
  const paliersNonRecompenses =
    palierActuel - session.dernierPalierRecompense;

  if (paliersNonRecompenses <= 0) {
    return {
      montant: 0,
      minutesAccumulees: session.minutesAccumulees,
      prochainPalierDans: 30 - (session.minutesAccumulees % 30),
    };
  }

  const montant = paliersNonRecompenses * REGLES.temps();

  session.dernierPalierRecompense = palierActuel;
  await session.save();

  await crediterEleve(eleveId, montant, token);

  await sauvegarderTransaction(
    eleveId,
    "temps",
    montant,
    `${session.minutesAccumulees} minutes passées sur la plateforme`,
    {
      minutesAccumulees: session.minutesAccumulees,
      paliers: paliersNonRecompenses,
    }
  );

  return {
    montant,
    minutesAccumulees: session.minutesAccumulees,
    paliersRecompenses: paliersNonRecompenses,
  };
};

// ── HISTORIQUE ────────────────────────────────────────
const getHistorique = async (eleveId) => {
  return await Transaction.find({ eleveId })
    .sort({ createdAt: -1 })
    .limit(50);
};

// ── STATS ─────────────────────────────────────────────
const getStats = async (eleveId) => {
  const transactions = await Transaction.find({ eleveId });

  const totalGagne = transactions
    .filter((t) => t.montant > 0)
    .reduce((acc, t) => acc + t.montant, 0);

  const totalDepense = transactions
    .filter((t) => t.montant < 0)
    .reduce((acc, t) => acc + Math.abs(t.montant), 0);

  const parType = {};

  transactions.forEach((t) => {
    if (!parType[t.type]) parType[t.type] = 0;
    parType[t.type] += t.montant;
  });

  const connexion = await DerniereConnexion.findOne({ eleveId });
  const sessionTemps = await SessionTemps.findOne({ eleveId });

  return {
    totalGagne,
    totalDepense,
    parType,
    streak: connexion?.streak || 0,
    totalConnexions: connexion?.totalConnexions || 0,
    minutesAccumulees: sessionTemps?.minutesAccumulees || 0,
  };
};

module.exports = {
  recompenseQuiz,
  recompenseLecon,
  recompenseConnexion,
  recompenseAutoEvaluation,
  recompenseTemps,
  getHistorique,
  getStats,
};