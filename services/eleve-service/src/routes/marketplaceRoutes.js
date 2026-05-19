const express = require("express");
const routeur = express.Router();

const marketplaceController = require("../controllers/marketplaceController");
const { verifierToken } = require("../middlewares/authentification");

// Liste des produits
routeur.get("/", verifierToken, marketplaceController.listerProduits);

// Panier
routeur.get("/panier", verifierToken, marketplaceController.obtenirPanier);

routeur.post(
  "/panier/ajouter/:idProduit",
  verifierToken,
  marketplaceController.ajouterAuPanier
);

routeur.patch(
  "/panier/modifier/:idProduit",
  verifierToken,
  marketplaceController.modifierQuantitePanier
);

routeur.delete(
  "/panier/supprimer/:idProduit",
  verifierToken,
  marketplaceController.supprimerDuPanier
);

routeur.delete(
  "/panier/vider",
  verifierToken,
  marketplaceController.viderPanier
);

routeur.post(
  "/panier/valider",
  verifierToken,
  marketplaceController.validerPanier
);

// Achat direct produit
routeur.post(
  "/acheter/:idProduit",
  verifierToken,
  marketplaceController.acheter
);

// Historique des achats
routeur.get(
  "/historique",
  verifierToken,
  marketplaceController.historiqueAchats
);

module.exports = routeur;