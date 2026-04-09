const marketplaceService = require("../services/marketplaceService");

const listerProduits = async (req, res) => {
  try {
    const produits = await marketplaceService.obtenirProduits();
    res.json(produits);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const acheter = async (req, res) => {
  try {
    const resultat = await marketplaceService.acheterProduit(
      req.utilisateur.id,
      req.params.idProduit
    );
    res.json(resultat);
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const historiqueAchats = async (req, res) => {
  try {
    const historique = await marketplaceService.obtenirHistoriqueAchats(req.utilisateur.id);
    res.json(historique);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = { listerProduits, acheter, historiqueAchats };