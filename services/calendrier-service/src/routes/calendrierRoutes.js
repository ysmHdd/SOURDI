const express = require("express");
const routeur = express.Router();

const calendrierController = require("../controllers/calendrierController");
const { verifierToken } = require("../middlewares/authentification");

routeur.post("/", verifierToken, calendrierController.ajouterSeance);
routeur.get("/", verifierToken, calendrierController.listerSeances);
routeur.put("/:id", verifierToken, calendrierController.modifierSeance);
routeur.delete("/:id", verifierToken, calendrierController.supprimerSeance);

module.exports = routeur;