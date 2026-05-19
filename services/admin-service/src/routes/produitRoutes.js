const express = require("express");
const routeur = express.Router();

const produitController = require("../controllers/produitController");
const uploadProduit = require("../middlewares/uploadProduit");

const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authentification");

routeur.post(
  "/",
  verifierToken,
  autoriserRoles("admin"),
  uploadProduit.single("photo"),
  produitController.creerProduit
);

routeur.get(
  "/",
  verifierToken,
  autoriserRoles("admin"),
  produitController.listerProduits
);

routeur.get(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  produitController.obtenirProduit
);

routeur.patch(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  uploadProduit.single("photo"),
  produitController.modifierProduit
);

routeur.delete(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  produitController.supprimerProduit
);

module.exports = routeur;