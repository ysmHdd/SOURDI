const utilisateurService = require("../services/utilisateurService");
<<<<<<< HEAD
=======
const Utilisateur = require("../models/Utilisateur");
>>>>>>> origin/notifcalendrier

const listerUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await utilisateurService.obtenirTousLesUtilisateurs();
    res.json(utilisateurs);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const obtenirUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.obtenirUtilisateurParId(
      req.params.id
    );
    res.json(utilisateur);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const creerUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.creerUtilisateurParAdmin(
      req.body
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès. Email envoyé.",
      utilisateur,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const modifierUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.modifierUtilisateur(
      req.params.id,
      req.body
    );

    res.json({
      message:
        "Utilisateur modifié avec succès. Email envoyé si un nouveau mot de passe a été défini.",
      utilisateur,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const supprimerUtilisateur = async (req, res) => {
  try {
    const resultat = await utilisateurService.supprimerUtilisateur(
      req.params.id
    );
    res.json(resultat);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

<<<<<<< HEAD
=======
const accepterAccesEtudiant = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      { statutAcces: "accepte" },
      { new: true }
    ).select("-password -emailToken -emailTokenExpire");

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({
      message: "Demande d'accès acceptée avec succès",
      utilisateur,
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const refuserAccesEtudiant = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      { statutAcces: "refuse" },
      { new: true }
    ).select("-password -emailToken -emailTokenExpire");

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({
      message: "Demande d'accès refusée",
      utilisateur,
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const bannirUtilisateur = async (req, res) => {
  try {
    const { type, duree, unite, raison } = req.body;

    if (!["temporaire", "definitif"].includes(type)) {
      return res.status(400).json({
        message: "Type de bannissement invalide",
      });
    }

    let banExpireLe = null;

    if (type === "temporaire") {
      const dureeNombre = Number(duree);

      if (!dureeNombre || dureeNombre <= 0) {
        return res.status(400).json({
          message: "Durée invalide",
        });
      }

      banExpireLe = new Date();

      if (unite === "jours") {
        banExpireLe.setDate(banExpireLe.getDate() + dureeNombre);
      } else if (unite === "mois") {
        banExpireLe.setMonth(banExpireLe.getMonth() + dureeNombre);
      } else {
        return res.status(400).json({
          message: "Unité invalide. Utilisez jours ou mois.",
        });
      }
    }

    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      {
        banni: true,
        banType: type,
        banRaison: raison || "",
        banExpireLe,
      },
      { new: true }
    ).select("-password -emailToken -emailTokenExpire");

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    res.json({
      message:
        type === "definitif"
          ? "Utilisateur banni définitivement"
          : "Utilisateur banni temporairement",
      utilisateur,
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

const annulerBanissement = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      {
        banni: false,
        banType: null,
        banRaison: "",
        banExpireLe: null,
      },
      { new: true }
    ).select("-password -emailToken -emailTokenExpire");

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    res.json({
      message: "Bannissement annulé avec succès",
      utilisateur,
    });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

>>>>>>> origin/notifcalendrier
module.exports = {
  listerUtilisateurs,
  obtenirUtilisateur,
  creerUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
<<<<<<< HEAD
=======
  accepterAccesEtudiant,
  refuserAccesEtudiant,
  bannirUtilisateur,
  annulerBanissement,
>>>>>>> origin/notifcalendrier
};