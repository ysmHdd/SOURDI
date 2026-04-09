const SourdiCoins = require("../models/SourdiCoins");
const KPI = require("../models/KPI");

const calculerCoins = (kpi) => {
  let total = 0;

  // 10 coins par leçon complétée
  total += kpi.lessonsCompletes * 10;

  // 5 coins par heure passée
  total += Math.floor(kpi.tempsPasseEnMinutes / 60) * 5;

  // 2 coins par connexion
  total += kpi.nombreConnexions * 2;

  // Bonus auto-évaluation
  if (kpi.autoEvaluation >= 8) total += 20;
  else if (kpi.autoEvaluation >= 5) total += 10;

  return total;
};

const mettreAJourKPI = async (idUtilisateur, donnees) => {
  const kpi = await KPI.findOneAndUpdate(
    { utilisateur: idUtilisateur },
    { ...donnees, derniereConnexion: Date.now() },
    { new: true, upsert: true }
  );

  const coinsGagnes = calculerCoins(kpi);

  const coins = await SourdiCoins.findOneAndUpdate(
    { utilisateur: idUtilisateur },
    {
      solde: coinsGagnes,
      $push: {
        historiqueGains: {
          montant: coinsGagnes,
          raison: "Mise à jour KPI",
        },
      },
    },
    { new: true, upsert: true }
  );

  return { kpi, coins };
};

const obtenirSolde = async (idUtilisateur) => {
  let coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });
  if (!coins) {
    coins = await SourdiCoins.create({ utilisateur: idUtilisateur, solde: 0 });
  }
  return coins;
};

module.exports = {
  mettreAJourKPI,
  obtenirSolde,
};