const express = require("express");
const routeur = express.Router();

const messageController = require("../controllers/messageController");
const uploadMessage = require("../middlewares/uploadMessage");

const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authentification");

routeur.get(
  "/eleve/conversation",
  verifierToken,
  autoriserRoles("etudiant"),
  messageController.obtenirConversationEtudiant
);

routeur.post(
  "/eleve/envoyer",
  verifierToken,
  autoriserRoles("etudiant"),
  uploadMessage.array("fichiers", 5),
  messageController.envoyerMessageEtudiant
);

routeur.delete(
  "/eleve/conversation/messages",
  verifierToken,
  autoriserRoles("etudiant"),
  messageController.supprimerMessagesEtudiant
);

routeur.post(
  "/eleve/signaler/:conversationId/:messageId",
  verifierToken,
  autoriserRoles("etudiant"),
  messageController.signalerMessageEtudiant
);

routeur.get(
  "/admin/conversations",
  verifierToken,
  autoriserRoles("admin"),
  messageController.listerConversationsAdmin
);

routeur.get(
  "/admin/conversations/:id",
  verifierToken,
  autoriserRoles("admin"),
  messageController.obtenirConversationAdmin
);

routeur.post(
  "/admin/conversations/:id/repondre",
  verifierToken,
  autoriserRoles("admin"),
  uploadMessage.array("fichiers", 5),
  messageController.envoyerMessageAdmin
);

routeur.patch(
  "/admin/conversations/:id/terminer",
  verifierToken,
  autoriserRoles("admin"),
  messageController.terminerConversation
);

routeur.get(
  "/admin/signalements",
  verifierToken,
  autoriserRoles("admin"),
  messageController.listerSignalementsAdmin
);

routeur.patch(
  "/admin/signalements/:id/traiter",
  verifierToken,
  autoriserRoles("admin"),
  messageController.traiterSignalementAdmin
);

module.exports = routeur;