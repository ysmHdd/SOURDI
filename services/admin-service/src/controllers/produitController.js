const produitService = require("../services/produitService");

const creerProduit = async (req, res) => {
  try {
    const donnees = {
      ...req.body,
      photo: req.file ? `/uploads/produits/${req.file.filename}` : "",
    };

    const produit = await produitService.creerProduit(donnees);

    res.status(201).json({
      message: "Produit créé avec succès",
      produit,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const listerProduits = async (req, res) => {
  try {
    const produits = await produitService.obtenirTousLesProduits();
    res.json(produits);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const obtenirProduit = async (req, res) => {
  try {
    const produit = await produitService.obtenirProduitParId(req.params.id);
    res.json(produit);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const modifierProduit = async (req, res) => {
  try {
    const donnees = { ...req.body };

    if (req.file) {
      donnees.photo = `/uploads/produits/${req.file.filename}`;
    }

    const produit = await produitService.modifierProduit(req.params.id, donnees);

    res.json({
      message: "Produit modifié avec succès",
      produit,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const supprimerProduit = async (req, res) => {
  try {
    const resultat = await produitService.supprimerProduit(req.params.id);
    res.json(resultat);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

module.exports = {
  creerProduit,
  listerProduits,
  obtenirProduit,
  modifierProduit,
  supprimerProduit,
};