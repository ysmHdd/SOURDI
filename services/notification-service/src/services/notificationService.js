const Notification = require("../models/Notification");

const creerNotification = async ({
  utilisateurId,
  role = "etudiant",
  titre,
  message,
  type,
  lien = "",
  referenceId = "",
}) => {
  if (!utilisateurId || !titre || !message || !type) {
    throw new Error("Données notification incomplètes");
  }

  if (referenceId) {
    const existe = await Notification.findOne({ utilisateurId, referenceId });
    if (existe) return existe;
  }

  return await Notification.create({
    utilisateurId,
    role,
    titre,
    message,
    type,
    lien,
    referenceId,
  });
};

const listerNotifications = async (utilisateur) => {
  return await Notification.find({
    utilisateurId: utilisateur.id,
  }).sort({ createdAt: -1 });
};

const compterNonLues = async (utilisateur) => {
  return await Notification.countDocuments({
    utilisateurId: utilisateur.id,
    lu: false,
  });
};

const marquerCommeLue = async (utilisateur, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      utilisateurId: utilisateur.id,
    },
    { lu: true },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification introuvable");
  }

  return notification;
};

const toutMarquerCommeLu = async (utilisateur) => {
  await Notification.updateMany(
    {
      utilisateurId: utilisateur.id,
      lu: false,
    },
    { lu: true }
  );

  return { message: "Toutes les notifications sont marquées comme lues" };
};

const supprimerNotification = async (utilisateur, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    utilisateurId: utilisateur.id,
  });

  if (!notification) {
    throw new Error("Notification introuvable");
  }

  return { message: "Notification supprimée" };
};

module.exports = {
  creerNotification,
  listerNotifications,
  compterNonLues,
  marquerCommeLue,
  toutMarquerCommeLu,
  supprimerNotification,
};