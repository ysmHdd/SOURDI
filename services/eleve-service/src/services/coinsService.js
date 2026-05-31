const SourdiCoins = require("../models/SourdiCoins");
const KPI = require("../models/KPI");

const mettreAJourKPI = async (idUtilisateur, donnees) => {
  const kpi = await KPI.findOneAndUpdate(
    { utilisateur: idUtilisateur },
    { ...donnees, derniereConnexion: Date.now() },
    { new: true, upsert: true }
  );

  let coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  if (!coins) {
    coins = await SourdiCoins.create({
      utilisateur: idUtilisateur,
      solde: 0,
    });
  }

  return { kpi, coins };
};

const obtenirSolde = async (idUtilisateur) => {
  let coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  if (!coins) {
    coins = await SourdiCoins.create({
      utilisateur: idUtilisateur,
      solde: 0,
    });
  }

  return coins;
};

const crediterCoins = async (idUtilisateur, montant, raison = "Gain de coins") => {
  const valeur = Number(montant);

  if (!Number.isFinite(valeur) || valeur <= 0) {
    throw new Error("Montant invalide");
  }

  const coins = await SourdiCoins.findOneAndUpdate(
    { utilisateur: idUtilisateur },
    {
      $inc: { solde: valeur },
      $push: {
        historiqueGains: {
          montant: valeur,
          raison,
          date: new Date(),
        },
      },
    },
    { new: true, upsert: true }
  );

  return coins;
};

module.exports = {
  mettreAJourKPI,
  obtenirSolde,
  crediterCoins,
};