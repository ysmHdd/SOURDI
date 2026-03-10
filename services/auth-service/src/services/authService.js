const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/Utilisateur");

const genererToken = (utilisateur) => {
  return jwt.sign(
    {
      id: utilisateur._id,
      email: utilisateur.email,
      role: utilisateur.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const inscrireUtilisateur = async (donnees) => {
  const { nom, email, motDePasse, role } = donnees;

  const utilisateurExistant = await Utilisateur.findOne({ email });

  if (utilisateurExistant) {
    throw new Error("Cet email existe déjà");
  }

  const motDePasseHache = await bcrypt.hash(motDePasse, 10);

  const utilisateur = await Utilisateur.create({
    nom,
    email,
    motDePasse: motDePasseHache,
    role: role || "etudiant"
  });

  const token = genererToken(utilisateur);

  return {
    utilisateur,
    token
  };
};

const connecterUtilisateur = async (email, motDePasse) => {
  const utilisateur = await Utilisateur.findOne({ email });

  if (!utilisateur) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const motDePasseValide = await bcrypt.compare(
    motDePasse,
    utilisateur.motDePasse
  );

  if (!motDePasseValide) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const token = genererToken(utilisateur);

  return {
    utilisateur,
    token
  };
};

const obtenirProfilUtilisateur = async (idUtilisateur) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur).select("-motDePasse");

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  return utilisateur;
};

module.exports = {
  inscrireUtilisateur,
  connecterUtilisateur,
  obtenirProfilUtilisateur
};