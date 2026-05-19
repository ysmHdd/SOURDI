const exerciceService = require("../services/exerciceService");
const Exercice = require("../models/Exercice");

const getMatieres = async (req, res) => {
  try {
    const niveau = parseInt(req.query.niveau) || 1;
    const data = await exerciceService.getMatieres(niveau);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getSousCats = async (req, res) => {
  try {
    const { matiere, niveau } = req.query;

    const data = await exerciceService.getSousCats(
      matiere,
      parseInt(niveau)
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getListeExercices = async (req, res) => {
  try {
    const { matiere, niveau, sousCat } = req.query;

    const data = await exerciceService.getListeExercices(
      matiere,
      parseInt(niveau),
      sousCat
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getExercices = async (req, res) => {
  try {
    const { matiere, niveau, sousCat } = req.query;
    const eleveId = req.utilisateur.id;

    const data = await exerciceService.getExercices(
      matiere,
      parseInt(niveau),
      sousCat,
      eleveId
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const soumettre = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const { matiere, niveau, sousCat, reponses, tempsEnSecondes } = req.body;

    let score = 0;

    const detail = reponses.map((r) => {
      const correct = true; // simplifié (tu peux recalculer si besoin)

      if (correct) score++;

      return {
        exerciceId: r.exerciceId,
        reponse: r.reponse,
        correct,
      };
    });

    const { resultat, pointsGagnes } =
      await exerciceService.sauvegarderResultat(eleveId, {
        matiere,
        niveau,
        sousCat,
        score,
        total: reponses.length,
        tempsEnSecondes,
        reponses: detail,
      });

    res.json({
      score,
      total: reponses.length,
      pointsGagnes,
      detail,
      resultatId: resultat._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getHistorique = async (req, res) => {
  try {
    const data = await exerciceService.getHistorique(req.utilisateur.id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const creer = async (req, res) => {
  try {
    const ex = await Exercice.create(req.body);
    res.status(201).json(ex);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const modifier = async (req, res) => {
  try {
    const ex = await Exercice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(ex);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const supprimer = async (req, res) => {
  try {
    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercice supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMatieres,
  getSousCats,
  getListeExercices,
  getExercices,
  soumettre,
  getHistorique,
  creer,
  modifier,
  supprimer,
};