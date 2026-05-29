const transactionService = require("../services/transactionService");

const listerTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.obtenirToutesLesTransactions();
    res.json(transactions);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const obtenirTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.obtenirTransactionParId(
      req.params.id
    );

    res.json(transaction);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const transactionsParUtilisateur = async (req, res) => {
  try {
    const transactions =
      await transactionService.obtenirTransactionsParUtilisateur(
        req.params.idUtilisateur
      );

    res.json(transactions);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const annulerTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.annulerTransactionParAdmin(
      req.params.id,
      req.body
    );

    res.json({
      message: "Commande annulée avec succès",
      transaction,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const supprimerTransaction = async (req, res) => {
  try {
    await transactionService.supprimerTransaction(req.params.id);

    res.json({
      message: "Commande supprimée avec succès",
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};
const marquerTransactionLivree = async (req, res) => {
  try {
    const transaction = await transactionService.marquerTransactionLivree(
      req.params.id
    );

    res.json({
      message: "Commande marquée comme livrée",
      transaction,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

module.exports = {
  listerTransactions,
  obtenirTransaction,
  transactionsParUtilisateur,
  annulerTransaction,
  supprimerTransaction,
  marquerTransactionLivree,
};