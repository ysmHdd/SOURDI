const express = require("express");
const routeur = express.Router();

const marketplaceController = require("../controllers/marketplaceController");
const { verifierToken } = require("../middlewares/authentification");

// Liste des produits
routeur.get("/", verifierToken, marketplaceController.listerProduits);

// Achat produit
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