const calendrierService = require("../services/calendrierService");

const ajouterSeance = async (req, res) => {
  try {
    const seance = await calendrierService.ajouterSeance(
      req.utilisateur.id,
      req.body
    );

    res.status(201).json(seance);
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const listerSeances = async (req, res) => {
  try {
    const seances = await calendrierService.listerSeances(req.utilisateur.id);

    res.json(seances);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const modifierSeance = async (req, res) => {
  try {
    const seance = await calendrierService.modifierSeance(
      req.params.id,
      req.utilisateur.id,
      req.body
    );

    res.json(seance);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const supprimerSeance = async (req, res) => {
  try {
    const resultat = await calendrierService.supprimerSeance(
      req.params.id,
      req.utilisateur.id
    );

    res.json(resultat);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

module.exports = {
  ajouterSeance,
  listerSeances,
  modifierSeance,
  supprimerSeance,
};