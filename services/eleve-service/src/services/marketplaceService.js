const Produit = require("../models/Produit");
const SourdiCoins = require("../models/SourdiCoins");
const Transaction = require("../models/Transaction");

const obtenirProduits = async () => {
  return await Produit.find({
    disponible: true,
    stock: { $gt: 0 },
  }).sort({ createdAt: -1 });
};

const acheterProduit = async (idUtilisateur, idProduit) => {
  const produit = await Produit.findById(idProduit);

  if (!produit) {
    throw new Error("Produit introuvable");
  }

  if (!produit.disponible) {
    throw new Error("Produit non disponible");
  }

  if (produit.stock <= 0) {
    throw new Error("Stock épuisé");
  }

  const coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  if (!coins) {
    throw new Error("Solde introuvable");
  }

  if (coins.solde < produit.prixEnCoins) {
    throw new Error("Solde insuffisant");
  }

  coins.solde -= produit.prixEnCoins;
  produit.stock -= 1;

  if (produit.stock === 0) {
    produit.disponible = false;
  }

  await coins.save();
  await produit.save();

  const transaction = await Transaction.create({
    utilisateur: idUtilisateur,
    produit: idProduit,
    montantEnCoins: produit.prixEnCoins,
    statut: "reussi",
  });

  return {
    message: "Achat réussi",
    transaction,
    soldeRestant: coins.solde,
  };
};

const obtenirHistoriqueAchats = async (idUtilisateur) => {
  return await Transaction.find({ utilisateur: idUtilisateur })
    .populate("produit", "nom description prixEnCoins categorie photo")
    .sort({ createdAt: -1 });
};

module.exports = {
  obtenirProduits,
  acheterProduit,
  obtenirHistoriqueAchats,
};