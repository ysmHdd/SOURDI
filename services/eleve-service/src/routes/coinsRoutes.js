const express = require("express");
const routeur = express.Router();
const coinsController = require("../controllers/coinsController");
const { verifierToken } = require("../middlewares/authentification");

routeur.get("/solde", verifierToken, coinsController.obtenirSolde);
routeur.patch("/kpi", verifierToken, coinsController.mettreAJourKPI);

module.exports = routeur;