const Calendrier = require("../models/Calendrier");

const ajouterSeance = async (utilisateurId, donnees) => {
  const { matiere, date, heureDebut, heureFin } = donnees;

  if (!matiere || !date || !heureDebut || !heureFin) {
    throw new Error("Matière, date, heure début et heure fin sont obligatoires");
  }

  return await Calendrier.create({
    utilisateurId,
    matiere,
    date,
    heureDebut,
    heureFin,
  });
};

const listerSeances = async (utilisateurId) => {
  return await Calendrier.find({ utilisateurId }).sort({
    date: 1,
    heureDebut: 1,
  });
};

const modifierSeance = async (id, utilisateurId, donnees) => {
  const { matiere, date, heureDebut, heureFin } = donnees;

  const seance = await Calendrier.findOneAndUpdate(
    { _id: id, utilisateurId },
    { matiere, date, heureDebut, heureFin },
    { new: true }
  );

  if (!seance) {
    throw new Error("Séance introuvable");
  }

  return seance;
};

const supprimerSeance = async (id, utilisateurId) => {
  const seance = await Calendrier.findOneAndDelete({
    _id: id,
    utilisateurId,
  });

  if (!seance) {
    throw new Error("Séance introuvable");
  }

  return { message: "Séance supprimée avec succès" };
};

module.exports = {
  ajouterSeance,
  listerSeances,
  modifierSeance,
  supprimerSeance,
};