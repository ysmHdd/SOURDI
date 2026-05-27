const Exercice = require("../models/Exercice");
const Resultat = require("../models/Resultat");

const getMatieres = async (niveau) => {
  return await Exercice.distinct("matiere", { niveau });
};

const getSousCats = async (matiere, niveau) => {
  return await Exercice.distinct("sousCat", { matiere, niveau });
};

const getExercices = async (matiere, niveau, sousCat, eleveId) => {
  const filtre = { matiere, niveau };
  if (sousCat) filtre.sousCat = sousCat;

  const exercices = await Exercice.find(filtre).lean();


  const faits = await Resultat.find({
    eleveId,
    matiere,
    niveau,
    sousCat: sousCat || "general",
  }).lean();


  if (faits.length > 0) {
    return { aFaire: [], done: exercices };
  }

  return { aFaire: exercices, done: [] };
};

const getListeExercices = async (matiere, niveau, sousCat) => {
  return await Exercice.find(
    { matiere, niveau, sousCat },
    {
      titre: 1,
      description: 1,
      difficulte: 1,
      image: 1,
      dureeEstimee: 1,
      matiere: 1,
      niveau: 1,
      sousCat: 1,
    }
  );
};

const sauvegarderResultat = async (eleveId, data) => {
  const { matiere, niveau, sousCat, score, total, tempsEnSecondes, reponses, exerciceId } = data; // ✅

  if (!reponses || reponses.length === 0) throw new Error("Aucune réponse reçue");

  const pointsGagnes = score * 10;

  const resultat = await Resultat.create({
    eleveId,
    exerciceId,
    matiere,
    niveau,
    sousCat: sousCat || "general",
    score,
    total,
    pointsGagnes,
    tempsEnSecondes,
    reponses,
  });

  console.log("SAUVEGARDE:", { eleveId, exerciceId, matiere });
  return { resultat, pointsGagnes };
  
};
const getHistorique = async (eleveId) => {
  return await Resultat.find({ eleveId })
    .sort({ createdAt: -1 })
    .limit(20);
};

module.exports = {
  getMatieres,
  getSousCats,
  getExercices,
  getListeExercices,
  sauvegarderResultat,
  getHistorique,
};