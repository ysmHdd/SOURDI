const express = require("express");
const routeur = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const { verifierToken } = require("../middlewares/authentification");

routeur.get("/", verifierToken, marketplaceController.listerProduits);
routeur.post("/acheter/:idProduit", verifierToken, marketplaceController.acheter);
routeur.get("/historique", verifierToken, marketplaceController.historiqueAchats);

module.exports = routeur;