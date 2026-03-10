const authService = require("../services/authService");

const inscription = async (req, res) => {
  try {
    const resultat = await authService.inscrireUtilisateur(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      utilisateur: resultat.utilisateur,
      token: resultat.token
    });

  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const resultat = await authService.connecterUtilisateur(email, motDePasse);

    res.json({
      message: "Connexion réussie",
      utilisateur: resultat.utilisateur,
      token: resultat.token
    });

  } catch (erreur) {
    res.status(401).json({ message: erreur.message });
  }
};

const profil = async (req, res) => {
  try {
    const utilisateur = await authService.obtenirProfilUtilisateur(
      req.utilisateur.id
    );

    res.json(utilisateur);

  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const tableauDeBordAdmin = (req, res) => {
  res.json({
    message: "Bienvenue Admin",
    utilisateur: req.utilisateur
  });
};

module.exports = {
  inscription,
  connexion,
  profil,
  tableauDeBordAdmin
};