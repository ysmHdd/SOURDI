const http = require("http");
const Conversation = require("../models/Conversation");
const Utilisateur = require("../models/Utilisateur");
const Signalement = require("../models/Signalement");

const envoyerNotificationEtudiant = (data) => {
  try {
    const body = JSON.stringify(data);

    const req = http.request(
      {
        hostname: "localhost",
        port: 5009,
        path: "/api/notifications/interne",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 2000,
      },
      (res) => {
        res.on("data", () => {});
      }
    );

    req.on("error", (erreur) => {
      console.error("Notification non envoyée :", erreur.message);
    });

    req.on("timeout", () => {
      req.destroy();
    });

    req.write(body);
    req.end();
  } catch (erreur) {
    console.error("Erreur notification :", erreur.message);
  }
};

const creerFichiersDepuisReq = (req) => {
  const fichiers = req.files || [];

  return fichiers.map((file) => ({
    nomOriginal: file.originalname,
    nomFichier: file.filename,
    typeMime: file.mimetype,
    taille: file.size,
    url: `/uploads/messages/${file.filename}`,
  }));
};

const nettoyerContenu = (contenu) => {
  return contenu ? contenu.trim() : "";
};

const obtenirNomUtilisateur = (utilisateur) => {
  if (utilisateur.user_first_name || utilisateur.user_last_name) {
    return `${utilisateur.user_first_name || ""} ${
      utilisateur.user_last_name || ""
    }`.trim();
  }

  return utilisateur.email || "Utilisateur";
};

const enrichirConversationAvecEleve = async (conversation) => {
  const objet = conversation.toObject ? conversation.toObject() : conversation;

  const eleve = await Utilisateur.findById(objet.etudiantId).select(
    "user_first_name user_last_name user_email avatar"
  );

  if (eleve) {
    objet.etudiantNom = `${eleve.user_first_name || ""} ${
      eleve.user_last_name || ""
    }`.trim();

    objet.etudiantEmail = eleve.user_email;
    objet.etudiantAvatar = eleve.avatar;
  }

  return objet;
};

const envoyerMessageEtudiant = async (utilisateur, contenu, req) => {
  const contenuNettoye = nettoyerContenu(contenu);
  const fichiers = creerFichiersDepuisReq(req);

  if (!contenuNettoye && fichiers.length === 0) {
    throw new Error("Message vide");
  }

  let conversation = await Conversation.findOne({
    etudiantId: utilisateur.id,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      etudiantId: utilisateur.id,
      etudiantEmail: utilisateur.email,
      etudiantNom: obtenirNomUtilisateur(utilisateur),
      statut: "nouveau",
      dernierMessage: "",
      dernierMessageDate: new Date(),
      messages: [],
    });
  }

  conversation.messages.push({
    expediteurId: utilisateur.id,
    expediteurRole: "etudiant",
    contenu: contenuNettoye,
    fichiers,
    luParAdmin: false,
    luParEtudiant: true,
    masquePourEtudiant: false,
  });

  conversation.statut = "nouveau";
  conversation.dernierMessage = contenuNettoye || "Fichier envoyé";
  conversation.dernierMessageDate = new Date();

  await conversation.save();

  const conversationActualisee = await Conversation.findById(
    conversation._id
  ).lean();

  return conversationActualisee;
};

const envoyerMessageAdmin = async (admin, conversationId, contenu, req) => {
  const contenuNettoye = nettoyerContenu(contenu);
  const fichiers = creerFichiersDepuisReq(req);

  if (!contenuNettoye && fichiers.length === 0) {
    throw new Error("Message vide");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  conversation.messages.push({
    expediteurId: admin.id,
    expediteurRole: "admin",
    contenu: contenuNettoye,
    fichiers,
    luParAdmin: true,
    luParEtudiant: false,
    masquePourEtudiant: false,
  });

  conversation.statut = "en_cours";
  conversation.adminAssigneId = admin.id;
  conversation.adminAssigneEmail = admin.email;
  conversation.dernierMessage = contenuNettoye || "Fichier envoyé";
  conversation.dernierMessageDate = new Date();

  await conversation.save();

  envoyerNotificationEtudiant({
    utilisateurId: conversation.etudiantId,
    role: "etudiant",
    titre: "Nouveau message",
    message: "L'administrateur vous a envoyé un message.",
    type: "message",
    lien: "#message-box",
    referenceId: `message-${conversation._id}-${Date.now()}`,
  });

  const conversationActualisee = await Conversation.findById(
    conversation._id
  ).lean();

  return conversationActualisee;
};

const obtenirConversationEtudiant = async (
  utilisateur,
  marquerCommeLu = false
) => {
  let conversation = await Conversation.findOne({
    etudiantId: utilisateur.id,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      etudiantId: utilisateur.id,
      etudiantEmail: utilisateur.email,
      etudiantNom: obtenirNomUtilisateur(utilisateur),
      statut: "termine",
      dernierMessage: "",
      dernierMessageDate: new Date(),
      messages: [],
    });
  }

  if (marquerCommeLu) {
    conversation.messages.forEach((message) => {
      if (message.expediteurRole === "admin" && !message.masquePourEtudiant) {
        message.luParEtudiant = true;
      }
    });

    await conversation.save();
  }

  const conversationActualisee = await Conversation.findById(
    conversation._id
  ).lean();

  conversationActualisee.messages = conversationActualisee.messages.filter(
    (message) => !message.masquePourEtudiant
  );

  return conversationActualisee;
};

const supprimerMessagesEtudiant = async (utilisateur) => {
  const conversation = await Conversation.findOne({
    etudiantId: utilisateur.id,
  });

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  conversation.messages.forEach((message) => {
    message.masquePourEtudiant = true;
  });

  await conversation.save();

  const conversationActualisee = await Conversation.findById(
    conversation._id
  ).lean();

  conversationActualisee.messages = [];

  return conversationActualisee;
};

const listerConversationsAdmin = async () => {
  const conversations = await Conversation.find()
    .select("-messages")
    .sort({ dernierMessageDate: -1 });

  const conversationsAvecEleves = await Promise.all(
    conversations.map((conversation) =>
      enrichirConversationAvecEleve(conversation)
    )
  );

  const ordreStatut = {
    nouveau: 0,
    en_cours: 1,
    termine: 2,
  };

  return conversationsAvecEleves.sort((a, b) => {
    const statutA = ordreStatut[a.statut] ?? 3;
    const statutB = ordreStatut[b.statut] ?? 3;

    if (statutA !== statutB) {
      return statutA - statutB;
    }

    return new Date(b.dernierMessageDate) - new Date(a.dernierMessageDate);
  });
};

const obtenirConversationAdmin = async (conversationId, admin) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  conversation.messages.forEach((message) => {
    if (message.expediteurRole === "etudiant") {
      message.luParAdmin = true;
    }
  });

  if (conversation.statut === "nouveau") {
    conversation.statut = "en_cours";
  }

  conversation.adminAssigneId = admin.id;
  conversation.adminAssigneEmail = admin.email;

  await conversation.save();

  const conversationActualisee = await Conversation.findById(
    conversationId
  ).lean();

  return enrichirConversationAvecEleve(conversationActualisee);
};

const terminerConversation = async (conversationId, admin) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  conversation.statut = "termine";
  conversation.adminAssigneId = admin.id;
  conversation.adminAssigneEmail = admin.email;

  await conversation.save();

  const conversationActualisee = await Conversation.findById(
    conversationId
  ).lean();

  return conversationActualisee;
};

const signalerMessageEtudiant = async (
  utilisateur,
  conversationId,
  messageId,
  typeHarcelement,
  details = ""
) => {
  const typesAutorises = [
    "bad_words",
    "harassment",
    "sexual_harassment",
    "bullying",
    "hate_speech",
    "spam",
    "other",
  ];

  if (!typesAutorises.includes(typeHarcelement)) {
    throw new Error("Type de signalement invalide");
  }

  if (typeHarcelement === "other" && !details.trim()) {
    throw new Error("Veuillez expliquer le problème");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    etudiantId: utilisateur.id,
  });

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  const message = conversation.messages.id(messageId);

  if (!message) {
    throw new Error("Message introuvable");
  }

  if (message.expediteurRole !== "admin") {
    throw new Error("Vous pouvez seulement signaler un message admin");
  }

  const signalementExistant = await Signalement.findOne({
    conversationId,
    messageId,
    etudiantId: utilisateur.id,
  });

  if (signalementExistant) {
    throw new Error("Ce message est déjà signalé");
  }

  const eleve = await Utilisateur.findById(utilisateur.id).select(
    "user_first_name user_last_name user_email avatar"
  );

  const etudiantNom = eleve
    ? `${eleve.user_first_name || ""} ${eleve.user_last_name || ""}`.trim()
    : utilisateur.email;

  const signalement = await Signalement.create({
    conversationId,
    messageId,
    etudiantId: utilisateur.id,
    etudiantNom,
    etudiantEmail: eleve?.user_email || utilisateur.email,
    etudiantAvatar: eleve?.avatar || null,
    adminId: message.expediteurId,
    adminEmail: conversation.adminAssigneEmail || "",
    typeHarcelement,
    details: details.trim(),
    messageSignale: message.contenu || "Fichier envoyé",
    fichiersMessage: message.fichiers || [],
    statut: "nouveau",
  });

  return signalement;
};

const listerSignalementsAdmin = async () => {
  return Signalement.find().sort({
    statut: 1,
    createdAt: -1,
  });
};

const traiterSignalementAdmin = async (signalementId, admin) => {
  const signalement = await Signalement.findById(signalementId);

  if (!signalement) {
    throw new Error("Signalement introuvable");
  }

  signalement.statut = "traite";
  signalement.traiteParAdminId = admin.id;
  signalement.traiteParAdminEmail = admin.email;
  signalement.dateTraitement = new Date();

  await signalement.save();

  return signalement;
};

module.exports = {
  envoyerMessageEtudiant,
  envoyerMessageAdmin,
  obtenirConversationEtudiant,
  supprimerMessagesEtudiant,
  listerConversationsAdmin,
  obtenirConversationAdmin,
  terminerConversation,
  signalerMessageEtudiant,
  listerSignalementsAdmin,
  traiterSignalementAdmin,
};