const exerciceService = require("../services/exerciceService");
<<<<<<< HEAD
const Exercice = require("../models/Exercice");
=======
>>>>>>> origin/notifcalendrier

const getMatieres = async (req, res) => {
  try {
    const niveau = parseInt(req.query.niveau) || 1;
<<<<<<< HEAD
    const data = await exerciceService.getMatieres(niveau);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
=======
    res.json(await exerciceService.getMatieres(niveau));
  } catch (err) { res.status(500).json({ message: err.message }); }
>>>>>>> origin/notifcalendrier
};

const getSousCats = async (req, res) => {
  try {
    const { matiere, niveau } = req.query;
<<<<<<< HEAD
    const data = await exerciceService.getSousCats(matiere, parseInt(niveau));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getListeExercices = async (req, res) => {
  try {
    const { matiere, niveau, sousCat } = req.query;
    const data = await exerciceService.getListeExercices(matiere, parseInt(niveau), sousCat);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
=======
    res.json(await exerciceService.getSousCats(matiere, parseInt(niveau)));
  } catch (err) { res.status(500).json({ message: err.message }); }
>>>>>>> origin/notifcalendrier
};

const getExercices = async (req, res) => {
  try {
    const { matiere, niveau, sousCat } = req.query;
<<<<<<< HEAD
    const eleveId = req.utilisateur.id;
    const data = await exerciceService.getExercices(matiere, parseInt(niveau), sousCat, eleveId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
    console.log("eleveId:", eleveId);
console.log("req.utilisateur:", req.utilisateur);
console.log("filtre:", filtre);
console.log("exercices trouvés:", exercices.length);
console.log("faits:", faits.length);
  }
=======
    const exercices = await exerciceService.getExercices(matiere, parseInt(niveau), sousCat);
    const sansReponse = exercices.map(({ reponse, ...rest }) => rest);
    res.json(sansReponse);
  } catch (err) { res.status(500).json({ message: err.message }); }
>>>>>>> origin/notifcalendrier
};

const soumettre = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
<<<<<<< HEAD
    const { matiere, niveau, sousCat, reponses, tempsEnSecondes, exerciceIds } = req.body;

    console.log("exerciceIds reçus:", exerciceIds); // debug temporaire

    let score = 0;
    const detail = reponses.map((r) => {
      const correct = true;
      if (correct) score++;
      return { exerciceId: r.exerciceId, reponse: r.reponse, correct };
    });

    const saves = await Promise.all(
      (exerciceIds || []).map((exerciceId) =>
        exerciceService.sauvegarderResultat(eleveId, {
          matiere,
          niveau,
          sousCat,
          score,
          total: reponses.length,
          tempsEnSecondes,
          reponses: detail,
          exerciceId,
        })
      )
    );

    const pointsGagnes = saves[0]?.pointsGagnes ?? 0;

    res.json({ score, total: reponses.length, pointsGagnes, detail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }

  console.log("body reçu:", req.body);
console.log("exerciceIds:", exerciceIds);
console.log("saves:", saves);
=======
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
>>>>>>> origin/notifcalendrier
};

const getHistorique = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    res.json(await exerciceService.getHistorique(req.utilisateur.id));
  } catch (err) { res.status(500).json({ message: err.message }); }
};


const creer = async (req, res) => {
  try {
    const Exercice = require("../models/Exercice");
    const ex = await Exercice.create(req.body);
    res.status(201).json(ex);
  } catch (err) { res.status(500).json({ message: err.message }); }
>>>>>>> origin/notifcalendrier
};

const modifier = async (req, res) => {
  try {
<<<<<<< HEAD
    const ex = await Exercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ex);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
=======
    const Exercice = require("../models/Exercice");
    const ex = await Exercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ex);
  } catch (err) { res.status(500).json({ message: err.message }); }
>>>>>>> origin/notifcalendrier
};

const supprimer = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const Exercice = require("../models/Exercice");
    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercice supprimé" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMatieres, getSousCats, getExercices, soumettre, getHistorique, creer, modifier, supprimer };
>>>>>>> origin/notifcalendrier
