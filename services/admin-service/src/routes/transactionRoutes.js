const express = require("express");
const routeur = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifierToken, autoriserRoles } = require("../middlewares/authentification");

routeur.get("/", verifierToken, autoriserRoles("admin"), transactionController.listerTransactions);
routeur.get("/:id", verifierToken, autoriserRoles("admin"), transactionController.obtenirTransaction);
routeur.get("/utilisateur/:idUtilisateur", verifierToken, autoriserRoles("admin"), transactionController.transactionsParUtilisateur);

module.exports = routeur;