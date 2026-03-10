const express = require("express");
const routeur = express.Router();

const authController = require("../controllers/authController");

const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authentification");

routeur.post("/inscription", authController.inscription);
routeur.post("/connexion", authController.connexion);
routeur.get("/profil", verifierToken, authController.profil);

routeur.get(
  "/admin",
  verifierToken,
  autoriserRoles("admin"),
  authController.tableauDeBordAdmin
);

module.exports = routeur;