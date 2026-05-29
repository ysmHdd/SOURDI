const marketplaceService = require("../services/marketplaceService");

const listerProduits = async (req, res) => {
  try {
    const produits = await marketplaceService.obtenirProduits();
    res.status(200).json(produits);
  } catch (erreur) {
    res.status(500).json({
      message: "Erreur lors du chargement des produits",
      erreur: erreur.message,
    });
  }
};

const acheter = async (req, res) => {
  try {
    const { idProduit } = req.params;

    const resultat = await marketplaceService.acheterProduit(
      req.utilisateur.id,
      idProduit,
      req.body.adresseLivraison
    );

    res.status(200).json(resultat);
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};

const historiqueAchats = async (req, res) => {
  try {
    const historique = await marketplaceService.obtenirHistoriqueAchats(
      req.utilisateur.id
    );

    res.status(200).json(historique);
  } catch (erreur) {
    res.status(500).json({
      message: "Erreur lors du chargement de l'historique",
      erreur: erreur.message,
    });
  }
};

const obtenirPanier = async (req, res) => {
  try {
    const panier = await marketplaceService.obtenirPanier(req.utilisateur.id);
    res.status(200).json(panier);
  } catch (erreur) {
    res.status(500).json({
      message: "Erreur lors du chargement du panier",
      erreur: erreur.message,
    });
  }
};

const ajouterAuPanier = async (req, res) => {
  try {
    const { idProduit } = req.params;
    const { quantite } = req.body;

    const panier = await marketplaceService.ajouterAuPanier(
      req.utilisateur.id,
      idProduit,
      quantite
    );

    res.status(200).json({
      message: "Produit ajouté au panier",
      ...panier,
    });
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};

const modifierQuantitePanier = async (req, res) => {
  try {
    const { idProduit } = req.params;
    const { quantite } = req.body;

    const panier = await marketplaceService.modifierQuantitePanier(
      req.utilisateur.id,
      idProduit,
      quantite
    );

    res.status(200).json({
      message: "Quantité modifiée",
      ...panier,
    });
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};

const supprimerDuPanier = async (req, res) => {
  try {
    const { idProduit } = req.params;

    const panier = await marketplaceService.supprimerDuPanier(
      req.utilisateur.id,
      idProduit
    );

    res.status(200).json({
      message: "Produit supprimé du panier",
      ...panier,
    });
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};

const viderPanier = async (req, res) => {
  try {
    const panier = await marketplaceService.viderPanier(req.utilisateur.id);

    res.status(200).json({
      message: "Panier vidé",
      ...panier,
    });
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};

const validerPanier = async (req, res) => {
  try {
    const resultat = await marketplaceService.validerPanier(
      req.utilisateur.id,
      req.body.adresseLivraison
    );

    res.status(200).json(resultat);
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};
const annulerCommande = async (req, res) => {
  try {
    const resultat = await marketplaceService.annulerCommandeEleve(
      req.utilisateur.id,
      req.params.idTransaction
    );

    res.status(200).json({
      message: "Commande annulée avec succès. Coins remboursés.",
      ...resultat,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};
const supprimerCommande = async (req, res) => {
  try {
    await marketplaceService.supprimerCommande(
      req.utilisateur.id,
      req.params.idTransaction
    );

    res.status(200).json({
      message: "Commande supprimée avec succès",
    });
  } catch (erreur) {
    res.status(400).json({
      message: erreur.message,
    });
  }
};

module.exports = {
  listerProduits,
  acheter,
  historiqueAchats,
  obtenirPanier,
  ajouterAuPanier,
  modifierQuantitePanier,
  supprimerDuPanier,
  viderPanier,
  validerPanier,
  annulerCommande,
  supprimerCommande,
};