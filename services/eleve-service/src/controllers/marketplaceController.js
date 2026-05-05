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
      idProduit
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
    const historique =
      await marketplaceService.obtenirHistoriqueAchats(
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

module.exports = {
  listerProduits,
  acheter,
  historiqueAchats,
};