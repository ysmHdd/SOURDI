const Produit = require("../models/Produit");

const creerProduit = async (donnees) => {
  return await Produit.create(donnees);
};

const obtenirTousLesProduits = async () => {
  return await Produit.find();
};

const obtenirProduitParId = async (id) => {
  const produit = await Produit.findById(id);
  if (!produit) throw new Error("Produit introuvable");
  return produit;
};

const modifierProduit = async (id, donnees) => {
  const produit = await Produit.findByIdAndUpdate(id, donnees, { new: true });
  if (!produit) throw new Error("Produit introuvable");
  return produit;
};

const supprimerProduit = async (id) => {
  const produit = await Produit.findByIdAndDelete(id);
  if (!produit) throw new Error("Produit introuvable");
  return { message: "Produit supprimé avec succès" };
};

module.exports = {
  creerProduit,
  obtenirTousLesProduits,
  obtenirProduitParId,
  modifierProduit,
  supprimerProduit,
};