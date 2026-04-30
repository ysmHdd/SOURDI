const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Utilisateur = require("../models/Utilisateur");
const { envoyerEmailConfirmation } = require("./emailService");

const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.+&@!#$%^*_-]).{8,}$/;

const genererToken = (utilisateur) => {
  return jwt.sign(
    {
      id: utilisateur._id,
      email: utilisateur.user_email,
      role: utilisateur.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const validerEmailEtMotDePasse = (email, motDePasse) => {
  if (!emailRegex.test(email)) {
    throw new Error("Email invalide. Exemple accepté : exemple@gmail.com");
  }

  if (!passwordRegex.test(motDePasse)) {
    throw new Error(
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial comme . + & @ !"
    );
  }
};

const inscrireUtilisateur = async (donnees) => {
  const {
    user_first_name,
    user_last_name,
    user_email,
    password,
    user_dob,
    user_phone,
    params,
  } = donnees;

  validerEmailEtMotDePasse(user_email, password);

  const utilisateurExistant = await Utilisateur.findOne({
    user_email,
  });

  if (utilisateurExistant) {
    throw new Error("Cet email existe déjà");
  }

  const motDePasseHache = await bcrypt.hash(password, 10);

  const emailToken = crypto.randomBytes(32).toString("hex");

  const utilisateur = await Utilisateur.create({
    user_first_name,
    user_last_name,
    user_email,
    password: motDePasseHache,
    user_dob,
    user_phone,
    params,
    role: "etudiant",
    emailConfirme: false,
    emailToken,
    emailTokenExpire: Date.now() + 60 * 60 * 1000,
  });

  await envoyerEmailConfirmation(user_email, emailToken);

  return {
    utilisateur: {
      id: utilisateur._id,
      user_first_name: utilisateur.user_first_name,
      user_last_name: utilisateur.user_last_name,
      user_email: utilisateur.user_email,
      role: utilisateur.role,
      emailConfirme: utilisateur.emailConfirme,
    },
  };
};

const creerAdmin = async (donnees) => {
  const {
    user_first_name,
    user_last_name,
    user_email,
    password,
    user_dob,
    user_phone,
  } = donnees;

  validerEmailEtMotDePasse(user_email, password);

  const utilisateurExistant = await Utilisateur.findOne({
    user_email,
  });

  if (utilisateurExistant) {
    throw new Error("Cet email existe déjà");
  }

  const motDePasseHache = await bcrypt.hash(password, 10);

  const admin = await Utilisateur.create({
    user_first_name,
    user_last_name,
    user_email,
    password: motDePasseHache,
    user_dob,
    user_phone,
    role: "admin",
    emailConfirme: true,
  });

  return {
    id: admin._id,
    user_first_name: admin.user_first_name,
    user_last_name: admin.user_last_name,
    user_email: admin.user_email,
    role: admin.role,
  };
};

const connecterUtilisateur = async (email, motDePasse) => {
  if (!emailRegex.test(email)) {
    throw new Error("Email invalide");
  }

  const utilisateur = await Utilisateur.findOne({
    user_email: email,
  });

  if (!utilisateur) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const motDePasseValide = await bcrypt.compare(
    motDePasse,
    utilisateur.password
  );

  if (!motDePasseValide) {
    throw new Error("Email ou mot de passe incorrect");
  }

  if (!utilisateur.emailConfirme) {
    throw new Error("Veuillez confirmer votre email avant de vous connecter");
  }

  const token = genererToken(utilisateur);

  return {
    utilisateur: {
      id: utilisateur._id,
      user_first_name: utilisateur.user_first_name,
      user_last_name: utilisateur.user_last_name,
      user_email: utilisateur.user_email,
      role: utilisateur.role,
    },
    token,
  };
};

const confirmerEmail = async (token) => {
  const utilisateur = await Utilisateur.findOne({
    emailToken: token,
    emailTokenExpire: { $gt: Date.now() },
  });

  if (!utilisateur) {
    throw new Error("Lien invalide ou expiré");
  }

  utilisateur.emailConfirme = true;
  utilisateur.emailToken = undefined;
  utilisateur.emailTokenExpire = undefined;

  await utilisateur.save();

  return utilisateur;
};

const obtenirProfilUtilisateur = async (idUtilisateur) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur).select(
    "-password -emailToken -emailTokenExpire"
  );

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  return utilisateur;
};

module.exports = {
  inscrireUtilisateur,
  creerAdmin,
  connecterUtilisateur,
  confirmerEmail,
  obtenirProfilUtilisateur,
};