const express = require("express");
const routeur = express.Router();

const utilisateurController = require("../controllers/utilisateurController");

const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authentification");

routeur.get(
  "/",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.listerUtilisateurs
);

routeur.get(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.obtenirUtilisateur
);

routeur.post(
  "/",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.creerUtilisateur
);

routeur.put(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.modifierUtilisateur
);

routeur.delete(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.supprimerUtilisateur
);

module.exports = routeur;