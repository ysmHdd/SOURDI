const express = require("express");
const routeur = express.Router();
const utilisateurController = require("../controllers/utilisateurController");
const { verifierToken, autoriserRoles } = require("../middlewares/authentification");

// Toutes ces routes sont protégées et réservées à l'admin
routeur.get("/", verifierToken, autoriserRoles("admin"), utilisateurController.listerUtilisateurs);
routeur.get("/:id", verifierToken, autoriserRoles("admin"), utilisateurController.obtenirUtilisateur);
routeur.patch("/:id/role", verifierToken, autoriserRoles("admin"), utilisateurController.modifierRole);
routeur.delete("/:id", verifierToken, autoriserRoles("admin"), utilisateurController.supprimerUtilisateur);

module.exports = routeur;