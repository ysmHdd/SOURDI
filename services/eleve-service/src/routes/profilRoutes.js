const express = require("express");
const routeur = express.Router();
const profilController = require("../controllers/profilController");
const { verifierToken } = require("../middlewares/authentification");

routeur.post("/sync", verifierToken, profilController.syncProfil);
routeur.get("/", verifierToken, profilController.obtenirProfil);

module.exports = routeur;