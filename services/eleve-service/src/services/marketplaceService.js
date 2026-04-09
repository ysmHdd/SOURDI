const Produit = require("../models/Produit");
const SourdiCoins = require("../models/SourdiCoins");
const Transaction = require("../models/Transaction");

const obtenirProduits = async () => {
  return await Produit.find({ disponible: true });
};

const acheterProduit = async (idUtilisateur, idProduit) => {
  const produit = await Produit.findById(idProduit);
  if (!produit) throw new Error("Produit introuvable");
  if (!produit.disponible) throw new Error("Produit non disponible");
  if (produit.stock <= 0) throw new Error("Stock épuisé");

  const coins = await SourdiCoins.findOne({ utilisateur: idUtilisateur });
  if (!coins || coins.solde < produit.prixEnCoins) {
    throw new Error("Solde insuffisant");
  }

  // Déduire les coins
  coins.solde -= produit.prixEnCoins;
  await coins.save();

  // Réduire le stock
  produit.stock -= 1;
  await produit.save();

  // Créer la transaction
  const transaction = await Transaction.create({
    utilisateur: idUtilisateur,
    produit: idProduit,
    montantEnCoins: produit.prixEnCoins,
    statut: "reussi",
  });

  return { message: "Achat réussi", transaction, soldeRestant: coins.solde };
};

const obtenirHistoriqueAchats = async (idUtilisateur) => {
  return await Transaction.find({ utilisateur: idUtilisateur })
    .populate("produit", "nom prixEnCoins categorie");
};

module.exports = {
  obtenirProduits,
  acheterProduit,
  obtenirHistoriqueAchats,
};