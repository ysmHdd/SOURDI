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
    const transaction = await transactionService.obtenirTransactionParId(req.params.id);
    res.json(transaction);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const transactionsParUtilisateur = async (req, res) => {
  try {
    const transactions = await transactionService.obtenirTransactionsParUtilisateur(req.params.idUtilisateur);
    res.json(transactions);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = {
  listerTransactions,
  obtenirTransaction,
  transactionsParUtilisateur,
};