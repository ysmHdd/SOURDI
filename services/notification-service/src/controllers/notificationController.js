const notificationService = require("../services/notificationService");

const creerNotificationInterne = async (req, res) => {
  try {
    const notification = await notificationService.creerNotification(req.body);

    res.status(201).json({
      message: "Notification créée",
      notification,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const listerNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.listerNotifications(
      req.utilisateur
    );

    res.json(notifications);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const compterNonLues = async (req, res) => {
  try {
    const total = await notificationService.compterNonLues(req.utilisateur);
    res.json({ total });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const marquerCommeLue = async (req, res) => {
  try {
    const notification = await notificationService.marquerCommeLue(
      req.utilisateur,
      req.params.id
    );

    res.json(notification);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const toutMarquerCommeLu = async (req, res) => {
  try {
    const resultat = await notificationService.toutMarquerCommeLu(
      req.utilisateur
    );

    res.json(resultat);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const supprimerNotification = async (req, res) => {
  try {
    const resultat = await notificationService.supprimerNotification(
      req.utilisateur,
      req.params.id
    );

    res.json(resultat);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

module.exports = {
  creerNotificationInterne,
  listerNotifications,
  compterNonLues,
  marquerCommeLue,
  toutMarquerCommeLu,
  supprimerNotification,
};