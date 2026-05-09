const coinsService = require("../services/coinsService");
const SourdiCoins = require("../models/SourdiCoins");

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

const crediter = async (req, res) => {
  try {
    const { montant } = req.body;
    const eleveId = req.utilisateur.id;

    const coins = await SourdiCoins.findOneAndUpdate(
      { utilisateur: eleveId },
      {
        $inc: { solde: montant },
        $push: {
          historiqueGains: {
            montant,
            raison: "Quiz complété",
          },
        },
      },
      { new: true, upsert: true }
    );

    res.json({ solde: coins.solde });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { obtenirSolde, mettreAJourKPI, crediter };

