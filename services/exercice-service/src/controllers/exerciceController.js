const exerciceService = require("../services/exerciceService");

const getMatieres = async (req, res) => {
  try {
    const niveau = parseInt(req.query.niveau) || 1;
    res.json(await exerciceService.getMatieres(niveau));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getSousCats = async (req, res) => {
  try {
    const { matiere, niveau } = req.query;
    res.json(await exerciceService.getSousCats(matiere, parseInt(niveau)));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getExercices = async (req, res) => {
  try {
    const { matiere, niveau, sousCat } = req.query;
    const exercices = await exerciceService.getExercices(matiere, parseInt(niveau), sousCat);
    const sansReponse = exercices.map(({ reponse, ...rest }) => rest);
    res.json(sansReponse);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const soumettre = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const { matiere, niveau, sousCat, reponses, tempsEnSecondes } = req.body;
    const Exercice = require("../models/Exercice");
    const ids = reponses.map((r) => r.exerciceId);
    const exercices = await Exercice.find({ _id: { $in: ids } });
    let score = 0;
    const detail = reponses.map((r) => {
      const ex = exercices.find((e) => e._id.toString() === r.exerciceId);
      const correct = ex && ex.reponse === r.reponse;
      if (correct) score++;
      return { exerciceId: r.exerciceId, correct, bonneReponse: ex ? ex.reponse : null };
    });
    const { resultat, pointsGagnes } = await exerciceService.sauvegarderResultat(eleveId, { matiere, niveau, sousCat, score, total: reponses.length, tempsEnSecondes });
    res.json({ score, total: reponses.length, pointsGagnes, detail, resultatId: resultat._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getHistorique = async (req, res) => {
  try {
    res.json(await exerciceService.getHistorique(req.utilisateur.id));
  } catch (err) { res.status(500).json({ message: err.message }); }
};


const creer = async (req, res) => {
  try {
    const Exercice = require("../models/Exercice");
    const ex = await Exercice.create(req.body);
    res.status(201).json(ex);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const modifier = async (req, res) => {
  try {
    const Exercice = require("../models/Exercice");
    const ex = await Exercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ex);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const supprimer = async (req, res) => {
  try {
    const Exercice = require("../models/Exercice");
    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercice supprimé" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMatieres, getSousCats, getExercices, soumettre, getHistorique, creer, modifier, supprimer };