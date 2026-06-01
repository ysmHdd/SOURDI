const messageService = require("../services/messageService");

const envoyerMessageEtudiant = async (req, res) => {
  try {
    const conversation = await messageService.envoyerMessageEtudiant(
      req.utilisateur,
      req.body.contenu,
      req
    );

    res.status(201).json({
      message: "Message envoyé avec succès",
      conversation,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const obtenirConversationEtudiant = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const marquerCommeLu = req.query.marquerCommeLu === "true";

    const conversation = await messageService.obtenirConversationEtudiant(
      req.utilisateur,
      marquerCommeLu
    );

    res.json(conversation);
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const supprimerMessagesEtudiant = async (req, res) => {
  try {
    const conversation = await messageService.supprimerMessagesEtudiant(
      req.utilisateur
    );

    res.json({
      message: "Messages supprimés avec succès",
      conversation,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const signalerMessageEtudiant = async (req, res) => {
  try {
    const signalement = await messageService.signalerMessageEtudiant(
      req.utilisateur,
      req.params.conversationId,
      req.params.messageId,
      req.body.typeHarcelement,
      req.body.details || ""
    );

    res.status(201).json({
      message: "Message signalé avec succès",
      signalement,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const listerConversationsAdmin = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const conversations = await messageService.listerConversationsAdmin();
    res.json(conversations);
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const obtenirConversationAdmin = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const conversation = await messageService.obtenirConversationAdmin(
      req.params.id,
      req.utilisateur
    );

    res.json(conversation);
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const envoyerMessageAdmin = async (req, res) => {
  try {
    const conversation = await messageService.envoyerMessageAdmin(
      req.utilisateur,
      req.params.id,
      req.body.contenu,
      req
    );

    res.status(201).json({
      message: "Réponse envoyée avec succès",
      conversation,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const terminerConversation = async (req, res) => {
  try {
    const conversation = await messageService.terminerConversation(
      req.params.id,
      req.utilisateur
    );

    res.json({
      message: "Conversation marquée comme terminée",
      conversation,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const listerSignalementsAdmin = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const signalements = await messageService.listerSignalementsAdmin();
    res.json(signalements);
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const traiterSignalementAdmin = async (req, res) => {
  try {
    const signalement = await messageService.traiterSignalementAdmin(
      req.params.id,
      req.utilisateur
    );

    res.json({
      message: "Signalement marqué comme traité",
      signalement,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

module.exports = {
  envoyerMessageEtudiant,
  obtenirConversationEtudiant,
  supprimerMessagesEtudiant,
  signalerMessageEtudiant,
  listerConversationsAdmin,
  obtenirConversationAdmin,
  envoyerMessageAdmin,
  terminerConversation,
  listerSignalementsAdmin,
  traiterSignalementAdmin,
};