const Transaction = require("../models/Transaction");

const obtenirToutesLesTransactions = async () => {
  return await Transaction.find()
    .populate("utilisateur", "nom email")
    .populate("produit", "nom prixEnCoins");
};

const obtenirTransactionParId = async (id) => {
  const transaction = await Transaction.findById(id)
    .populate("utilisateur", "nom email")
    .populate("produit", "nom prixEnCoins");
  if (!transaction) throw new Error("Transaction introuvable");
  return transaction;
};

const obtenirTransactionsParUtilisateur = async (idUtilisateur) => {
  return await Transaction.find({ utilisateur: idUtilisateur })
    .populate("produit", "nom prixEnCoins");
};

module.exports = {
  obtenirToutesLesTransactions,
  obtenirTransactionParId,
  obtenirTransactionsParUtilisateur,
};