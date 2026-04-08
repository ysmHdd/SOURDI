const express = require("express");
const routeur = express.Router();
const produitController = require("../controllers/produitController");
const { verifierToken, autoriserRoles } = require("../middlewares/authentification");

routeur.post("/", verifierToken, autoriserRoles("admin"), produitController.creerProduit);
routeur.get("/", verifierToken, autoriserRoles("admin"), produitController.listerProduits);
routeur.get("/:id", verifierToken, autoriserRoles("admin"), produitController.obtenirProduit);
routeur.patch("/:id", verifierToken, autoriserRoles("admin"), produitController.modifierProduit);
routeur.delete("/:id", verifierToken, autoriserRoles("admin"), produitController.supprimerProduit);

module.exports = routeur;