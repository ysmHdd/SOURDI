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

routeur.patch(
  "/:id/accepter-acces",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.accepterAccesEtudiant
);

routeur.patch(
  "/:id/refuser-acces",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.refuserAccesEtudiant
);

routeur.patch(
  "/:id/bannir",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.bannirUtilisateur
);

routeur.patch(
  "/:id/annuler-banissement",
  verifierToken,
  autoriserRoles("admin"),
  utilisateurController.annulerBanissement
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