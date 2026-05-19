const utilisateurService = require("../services/utilisateurService");

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

module.exports = {
  listerUtilisateurs,
  obtenirUtilisateur,
  creerUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
};