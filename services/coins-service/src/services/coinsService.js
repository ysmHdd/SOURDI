const axios = require("axios");
const Transaction = require("../models/Transaction");
const DerniereConnexion = require("../models/DerniereConnexion");

const ELEVE_URL = process.env.ELEVE_SERVICE_URL;

// Règles de gains
const REGLES = {
  quiz:            (score, total) => score * 10,
  lecon:           () => 20,
  connexion:       (streak) => streak >= 7 ? 20 : streak >= 3 ? 10 : 5,
  auto_evaluation: () => 15,
  temps:           () => 10, // toutes les 30 min
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
const sauvegarderTransaction = async (eleveId, type, montant, description, meta = {}) => {
  return await Transaction.create({ eleveId, type, montant, description, meta });
};

// ── QUIZ ──────────────────────────────────────────────
const recompenseQuiz = async (eleveId, { score, total, matiere }, token) => {
  const montant = REGLES.quiz(score, total);
  if (montant <= 0) return { montant: 0 };

  await crediterEleve(eleveId, montant, token);
  await sauvegarderTransaction(
    eleveId, "quiz", montant,
    `Quiz ${matiere} : ${score}/${total} bonnes réponses`,
    { matiere, score, total }
  );
  return { montant };
};

// ── LEÇON ─────────────────────────────────────────────
const recompenseLecon = async (eleveId, { matiere, titre }, token) => {
  const montant = REGLES.lecon();
  await crediterEleve(eleveId, montant, token);
  await sauvegarderTransaction(
    eleveId, "lecon", montant,
    `Leçon complétée : ${titre || matiere}`,
    { matiere, titre }
  );
  return { montant };
};

// ── CONNEXION QUOTIDIENNE ─────────────────────────────
const recompenseConnexion = async (eleveId, token) => {
  const maintenant = new Date();
  const debutJour = new Date(maintenant.setHours(0, 0, 0, 0));

  const derniere = await DerniereConnexion.findOne({ eleveId });

  // Déjà connecté aujourd'hui
  if (derniere && derniere.date >= debutJour) {
    return { montant: 0, dejaConnecte: true };
  }

  // Calculer le streak
  const hierDebut = new Date(debutJour);
  hierDebut.setDate(hierDebut.getDate() - 1);

  let streak = 1;
  if (derniere && derniere.date >= hierDebut) {
    streak = (derniere.streak || 1) + 1;
  }

  // Mettre à jour la dernière connexion
  await DerniereConnexion.findOneAndUpdate(
    { eleveId },
    { date: new Date(), streak },
    { upsert: true, new: true }
  );

  const montant = REGLES.connexion(streak);
  await crediterEleve(eleveId, montant, token);
  await sauvegarderTransaction(
    eleveId, "connexion", montant,
    `Connexion quotidienne — Série : ${streak} jour${streak > 1 ? "s" : ""}`,
    { streak }
  );
  return { montant, streak };
};

// ── AUTO-ÉVALUATION ───────────────────────────────────
const recompenseAutoEvaluation = async (eleveId, { note }, token) => {
  const montant = REGLES.auto_evaluation();
  await crediterEleve(eleveId, montant, token);
  await sauvegarderTransaction(
    eleveId, "auto_evaluation", montant,
    `Auto-évaluation soumise : ${note}/10`,
    { note }
  );
  return { montant };
};

// ── TEMPS PASSÉ ───────────────────────────────────────
const recompenseTemps = async (eleveId, { minutes }, token) => {
  const paliers = Math.floor(minutes / 30);
  if (paliers <= 0) return { montant: 0 };

  const montant = paliers * REGLES.temps();
  await crediterEleve(eleveId, montant, token);
  await sauvegarderTransaction(
    eleveId, "temps", montant,
    `${minutes} minutes passées sur la plateforme`,
    { minutes }
  );
  return { montant };
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

  return { totalGagne, totalDepense, parType, streak: connexion?.streak || 0 };
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