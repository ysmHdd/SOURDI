const axios = require("axios");
const Transaction = require("../models/Transaction");
const DerniereConnexion = require("../models/DerniereConnexion");
const SessionTemps = require("../models/SessionTemps");

const ELEVE_URL = process.env.ELEVE_SERVICE_URL;

const REGLES = {
  quiz: (score, total) => score * 10,
  lecon: () => 20,
  connexion: (streak) => (streak >= 7 ? 20 : streak >= 3 ? 10 : 5),
  auto_evaluation: () => 15,
  temps: () => 10,
};

const crediterEleve = async (eleveId, montant, token) => {
  await axios.patch(
    `${ELEVE_URL}/api/eleve/coins/crediter`,
    { montant },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

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

const recompenseTemps = async (eleveId, { minutes, actions }, token) => {
  const minutesAjoutees = Number(minutes) || 0;
  const actionsEtude = Number(actions) || 0;

  if (minutesAjoutees !== 30) {
    return {
      montant: 0,
      message: "Le temps doit être exactement 30 minutes",
      recompense: false,
    };
  }

  if (actionsEtude < 3) {
    return {
      montant: 0,
      message: "Pas assez d'activité pendant les 30 minutes",
      recompense: false,
      actions: actionsEtude,
    };
  }

  const derniereTransactionTemps = await Transaction.findOne({
    eleveId,
    type: "temps",
  }).sort({ createdAt: -1 });

  if (derniereTransactionTemps) {
    const maintenant = new Date();
    const differenceMs = maintenant - derniereTransactionTemps.createdAt;
    const differenceMinutes = Math.floor(differenceMs / 60000);

    if (differenceMinutes < 30) {
      return {
        montant: 0,
        message: `Attendez encore ${30 - differenceMinutes} minutes`,
        recompense: false,
      };
    }
  }

  const session = await SessionTemps.findOneAndUpdate(
    { eleveId },
    { $inc: { minutesAccumulees: 30 } },
    { upsert: true, new: true }
  );

  const montant = REGLES.temps();

  await crediterEleve(eleveId, montant, token);

  await sauvegarderTransaction(
    eleveId,
    "temps",
    montant,
    "30 minutes actives passées sur la plateforme",
    {
      minutesAccumulees: session.minutesAccumulees,
      actions: actionsEtude,
    }
  );

  return {
    montant,
    minutesAccumulees: session.minutesAccumulees,
    recompense: true,
    actions: actionsEtude,
  };
};

const getHistorique = async (eleveId) => {
  return await Transaction.find({ eleveId })
    .sort({ createdAt: -1 })
    .limit(50);
};

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