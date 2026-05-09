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

const syncProfil = async (idUtilisateur, donnees) => {
  try {
    let utilisateur = await Utilisateur.findById(idUtilisateur);
    if (!utilisateur) {
      utilisateur = await Utilisateur.create({
        _id: idUtilisateur,
        nom: donnees.nom,
        email: donnees.email,
        motDePasse: "sync__ok",
        role: donnees.role || "etudiant",
      });
    }
    return utilisateur;
  } catch (err) {
    console.error("ERREUR SYNC:", err.message);
    throw err;
  }
};

module.exports = { obtenirProfil, syncProfil };