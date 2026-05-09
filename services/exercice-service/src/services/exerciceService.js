const Exercice = require("../models/Exercice");
const Resultat = require("../models/Resultat");

const getMatieres = async (niveau) => {
  return await Exercice.distinct("matiere", { niveau });
};

const getSousCats = async (matiere, niveau) => {
  return await Exercice.distinct("sousCat", { matiere, niveau });
};

const getExercices = async (matiere, niveau, sousCat) => {
  const filtre = { matiere, niveau };
  if (sousCat) filtre.sousCat = sousCat;
  const exercices = await Exercice.find(filtre).lean();
  return exercices.sort(() => Math.random() - 0.5).slice(0, 10);
};

const sauvegarderResultat = async (eleveId, data) => {
  const { matiere, niveau, sousCat, score, total, tempsEnSecondes } = data;
  const pointsGagnes = score * 10;
  const resultat = await Resultat.create({ eleveId, matiere, niveau, sousCat: sousCat || "general", score, total, pointsGagnes, tempsEnSecondes });
  return { resultat, pointsGagnes };
};

const getHistorique = async (eleveId) => {
  return await Resultat.find({ eleveId }).sort({ createdAt: -1 }).limit(20);
};

module.exports = { getMatieres, getSousCats, getExercices, sauvegarderResultat, getHistorique };