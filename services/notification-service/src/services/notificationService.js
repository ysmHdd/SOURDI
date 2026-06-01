const Notification = require("../models/Notification");

const creerNotification = async ({
  utilisateurId = null,
  role = "etudiant",
  titre,
  message,
  type,
  lien = "",
  referenceId = "",
}) => {
  if (!titre || !message || !type) {
    throw new Error("Données notification incomplètes");
  }

  if (referenceId) {
    const existe = await Notification.findOne({ utilisateurId, role, referenceId });
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
    $or: [
      { utilisateurId: utilisateur.id },
      { utilisateurId: null, role: utilisateur.role },
    ],
  }).sort({ createdAt: -1 });
};

const compterNonLues = async (utilisateur) => {
  return await Notification.countDocuments({
    lu: false,
    $or: [
      { utilisateurId: utilisateur.id },
      { utilisateurId: null, role: utilisateur.role },
    ],
  });
};

const marquerCommeLue = async (utilisateur, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      $or: [
        { utilisateurId: utilisateur.id },
        { utilisateurId: null, role: utilisateur.role },
      ],
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
      lu: false,
      $or: [
        { utilisateurId: utilisateur.id },
        { utilisateurId: null, role: utilisateur.role },
      ],
    },
    { lu: true }
  );

  return { message: "Toutes les notifications sont marquées comme lues" };
};

const supprimerNotification = async (utilisateur, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    $or: [
      { utilisateurId: utilisateur.id },
      { utilisateurId: null, role: utilisateur.role },
    ],
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