const Utilisateur = require("../models/Utilisateur");
const SourdiCoins = require("../models/SourdiCoins");
const KPI = require("../models/KPI");

const obtenirProfil = async (idUtilisateur) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur).select("-motDePasse");
  if (!utilisateur) throw new Error("Utilisateur introuvable");

  let coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });
  if (!coins) {
    coins = await SourdiCoins.create({ utilisateur: idUtilisateur, solde: 0 });
  }

  let kpi = await KPI.findOne({ utilisateur: idUtilisateur });
  if (!kpi) {
    kpi = await KPI.create({ utilisateur: idUtilisateur });
  }

  return {
    utilisateur,
    solde: coins.solde,
    kpi,
  };
};

module.exports = { obtenirProfil };