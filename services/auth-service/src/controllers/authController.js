const authService = require("../services/authService");

const inscription = async (req, res) => {
  try {
    const resultat = await authService.inscrireUtilisateur(req.body);

    res.status(201).json({
      message:
        "Compte étudiant créé avec succès. Veuillez confirmer votre email.",
      utilisateur: resultat.utilisateur,
    });
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
  }
};

const creationAdmin = async (req, res) => {
  try {
    const admin = await authService.creerAdmin(req.body);

    res.status(201).json({
      message: "Compte admin créé avec succès",
      utilisateur: admin,
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
      token: resultat.token,
    });
  } catch (erreur) {
    res.status(401).json({ message: erreur.message });
  }
};

const confirmerEmail = async (req, res) => {
  try {
    await authService.confirmerEmail(req.params.token);

    res.send("Email confirmé avec succès. Vous pouvez maintenant vous connecter.");
  } catch (erreur) {
    res.status(400).json({ message: erreur.message });
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
    utilisateur: req.utilisateur,
  });
};

module.exports = {
  inscription,
  creationAdmin,
  connexion,
  confirmerEmail,
  profil,
  tableauDeBordAdmin,
};