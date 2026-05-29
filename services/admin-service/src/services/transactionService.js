const axios = require("axios");
const Transaction = require("../models/Transaction");
const SourdiCoins = require("../models/SourdiCoins");
const Produit = require("../models/Produit");

const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5009";

const obtenirToutesLesTransactions = async () => {
  return await Transaction.find()
    .populate(
      "utilisateur",
      "user_first_name user_last_name user_email user_phone"
    )
    .populate("produit", "nom prixEnCoins photo categorie")
    .sort({ createdAt: -1 });
};

const obtenirTransactionParId = async (id) => {
  const transaction = await Transaction.findById(id)
    .populate(
      "utilisateur",
      "user_first_name user_last_name user_email user_phone"
    )
    .populate("produit", "nom prixEnCoins photo categorie");

  if (!transaction) {
    throw new Error("Transaction introuvable");
  }

  return transaction;
};

const obtenirTransactionsParUtilisateur = async (idUtilisateur) => {
  return await Transaction.find({ utilisateur: idUtilisateur })
    .populate("produit", "nom prixEnCoins photo categorie")
    .sort({ createdAt: -1 });
};

const envoyerNotificationAnnulation = async (transaction, cause, details) => {
  try {
    const raison =
      cause === "rupture_stock"
        ? "Rupture de stock"
        : details?.trim() || "Autre";

    const titre = transaction.produit?.nom
      ? `Commande "${transaction.produit.nom}" annulée`
      : "Commande annulée";

    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/interne`, {
      utilisateurId: transaction.utilisateur,
      role: "etudiant",
      titre,
      message: `Raison : ${raison}. Vos ${transaction.montantEnCoins} coins ont été remboursés.`,
      type: "marketplace",
      lien: "/eleve/panier",
      referenceId: `commande-annulee-${transaction._id}-${Date.now()}`,
    });
  } catch (erreur) {
    console.error(
      "Erreur notification annulation commande:",
      erreur.response?.data || erreur.message
    );
  }
};

const envoyerNotificationLivraison = async (transaction) => {
  try {
    const titre = transaction.produit?.nom
      ? `Commande "${transaction.produit.nom}" livrée`
      : "Commande livrée";

    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/interne`, {
      utilisateurId: transaction.utilisateur,
      role: "etudiant",
      titre,
      message:
        "Votre commande a été marquée comme livrée. Elle ne peut plus être annulée.",
      type: "marketplace",
      lien: "/eleve/panier",
      referenceId: `commande-livree-${transaction._id}-${Date.now()}`,
    });
  } catch (erreur) {
    console.error(
      "Erreur notification livraison commande:",
      erreur.response?.data || erreur.message
    );
  }
};

const annulerTransactionParAdmin = async (idTransaction, donnees) => {
  const transaction = await Transaction.findById(idTransaction).populate(
    "produit",
    "nom"
  );

  if (!transaction) {
    throw new Error("Transaction introuvable");
  }

  if (transaction.statut === "livree") {
    throw new Error(
      "Impossible d'annuler cette commande car elle a déjà été livrée"
    );
  }

  if (transaction.statut === "annulee" || transaction.statut === "rembourse") {
    throw new Error("Cette commande est déjà annulée ou remboursée");
  }

  const cause = donnees.cause || "autre";

  if (!["rupture_stock", "autre"].includes(cause)) {
    throw new Error("Cause d'annulation invalide");
  }

  const details =
    cause === "rupture_stock"
      ? "Rupture de stock"
      : donnees.details?.trim() || "Autre";

  const coins = await SourdiCoins.findOne({
    utilisateur: transaction.utilisateur,
  });

  if (!coins) {
    throw new Error("Solde de l'élève introuvable");
  }

  coins.solde += transaction.montantEnCoins;
  await coins.save();

  const produit = await Produit.findById(transaction.produit?._id || transaction.produit);

  if (produit) {
    produit.stock += transaction.quantite || 1;
    produit.disponible = true;
    await produit.save();
  }

  transaction.statut = "annulee";
  transaction.annulation = {
    annuleePar: "admin",
    cause,
    details,
    dateAnnulation: new Date(),
  };

  await transaction.save();

  await envoyerNotificationAnnulation(transaction, cause, details);

  return await obtenirTransactionParId(idTransaction);
};

const marquerTransactionLivree = async (idTransaction) => {
  const transaction = await Transaction.findById(idTransaction).populate(
    "produit",
    "nom"
  );

  if (!transaction) {
    throw new Error("Transaction introuvable");
  }

  if (transaction.statut === "annulee") {
    throw new Error("Une commande annulée ne peut pas être marquée comme livrée");
  }

  if (transaction.statut === "livree") {
    throw new Error("Cette commande est déjà livrée");
  }

  transaction.statut = "livree";
  transaction.dateLivraison = new Date();

  await transaction.save();

  await envoyerNotificationLivraison(transaction);

  return await obtenirTransactionParId(idTransaction);
};

const supprimerTransaction = async (idTransaction) => {
  const transaction = await Transaction.findById(idTransaction);

  if (!transaction) {
    throw new Error("Transaction introuvable");
  }

  await Transaction.findByIdAndDelete(idTransaction);

  return true;
};

module.exports = {
  obtenirToutesLesTransactions,
  obtenirTransactionParId,
  obtenirTransactionsParUtilisateur,
  annulerTransactionParAdmin,
  marquerTransactionLivree,
  supprimerTransaction,
};