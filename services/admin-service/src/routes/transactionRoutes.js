const express = require("express");
const routeur = express.Router();

const transactionController = require("../controllers/transactionController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authentification");

routeur.get(
  "/",
  verifierToken,
  autoriserRoles("admin"),
  transactionController.listerTransactions
);

routeur.get(
  "/utilisateur/:idUtilisateur",
  verifierToken,
  autoriserRoles("admin"),
  transactionController.transactionsParUtilisateur
);

routeur.patch(
  "/:id/annuler",
  verifierToken,
  autoriserRoles("admin"),
  transactionController.annulerTransaction
);

routeur.delete(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  transactionController.supprimerTransaction
);

routeur.get(
  "/:id",
  verifierToken,
  autoriserRoles("admin"),
  transactionController.obtenirTransaction
);
routeur.patch(
  "/:id/livree",
  verifierToken,
  autoriserRoles("admin"),
  transactionController.marquerTransactionLivree
);

module.exports = routeur;