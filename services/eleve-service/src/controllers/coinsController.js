const coinsService = require("../services/coinsService");

const obtenirSolde = async (req, res) => {
  try {
    const coins = await coinsService.obtenirSolde(req.utilisateur.id);
    res.json(coins);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const mettreAJourKPI = async (req, res) => {
  try {
    const resultat = await coinsService.mettreAJourKPI(req.utilisateur.id, req.body);
    res.json({ message: "KPI mis à jour", ...resultat });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

module.exports = { obtenirSolde, mettreAJourKPI };