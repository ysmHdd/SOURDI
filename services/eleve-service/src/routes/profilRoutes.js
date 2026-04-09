const express = require("express");
const routeur = express.Router();
const profilController = require("../controllers/profilController");
const { verifierToken } = require("../middlewares/authentification");

routeur.get("/", verifierToken, profilController.obtenirProfil);

module.exports = routeur;