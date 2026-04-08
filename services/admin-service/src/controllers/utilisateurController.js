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
    const utilisateur = await utilisateurService.obtenirUtilisateurParId(req.params.id);
    res.json(utilisateur);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const modifierRole = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.modifierRoleUtilisateur(
      req.params.id,
      req.body.role
    );
    res.json({ message: "Rôle mis à jour", utilisateur });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const supprimerUtilisateur = async (req, res) => {
  try {
    const resultat = await utilisateurService.supprimerUtilisateur(req.params.id);
    res.json(resultat);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

module.exports = {
  listerUtilisateurs,
  obtenirUtilisateur,
  modifierRole,
  supprimerUtilisateur,
};