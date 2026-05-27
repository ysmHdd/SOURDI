<<<<<<< HEAD
const produitService = require("../services/produitService");

=======
const http = require("http");
const Utilisateur = require("../models/Utilisateur");
const produitService = require("../services/produitService");

const envoyerNotification = (data) => {
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

    req.on("error", () => {});
    req.on("timeout", () => req.destroy());

    req.write(body);
    req.end();
  } catch {}
};

>>>>>>> origin/notifcalendrier
const creerProduit = async (req, res) => {
  try {
    const donnees = {
      ...req.body,
      photo: req.file ? `/uploads/produits/${req.file.filename}` : "",
    };

    const produit = await produitService.creerProduit(donnees);

<<<<<<< HEAD
=======
    try {
      const etudiants = await Utilisateur.find({
        role: "etudiant",
      }).select("_id");

      etudiants.forEach((etudiant) => {
        envoyerNotification({
          utilisateurId: etudiant._id,
          role: "etudiant",
          titre: "Nouveau produit",
          message: `${produit.nom} est disponible dans le marketplace.`,
          type: "marketplace",
          lien: "/eleve/marketplace",
          referenceId: `produit-${produit._id}-${etudiant._id}`,
        });
      });
    } catch (erreur) {
      console.error(
        "Erreur notification marketplace :",
        erreur.message
      );
    }

>>>>>>> origin/notifcalendrier
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