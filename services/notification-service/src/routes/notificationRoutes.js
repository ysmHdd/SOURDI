const express = require("express");
const routeur = express.Router();

const notificationController = require("../controllers/notificationController");
const { verifierToken } = require("../middlewares/authentification");

routeur.post("/interne", notificationController.creerNotificationInterne);

routeur.get("/", verifierToken, notificationController.listerNotifications);

routeur.get(
  "/non-lues",
  verifierToken,
  notificationController.compterNonLues
);

routeur.patch(
  "/:id/lue",
  verifierToken,
  notificationController.marquerCommeLue
);

routeur.patch(
  "/tout-lu",
  verifierToken,
  notificationController.toutMarquerCommeLu
);

routeur.delete(
  "/:id",
  verifierToken,
  notificationController.supprimerNotification
);

module.exports = routeur;