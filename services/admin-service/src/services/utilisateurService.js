const bcrypt = require("bcryptjs");
const Utilisateur = require("../models/Utilisateur");
const { envoyerEmailIdentifiants } = require("./emailService");

const obtenirTousLesUtilisateurs = async () => {
  return await Utilisateur.find().select("-password");
};

const obtenirUtilisateurParId = async (id) => {
  const utilisateur = await Utilisateur.findById(id).select("-password");

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  return utilisateur;
};

const creerUtilisateurParAdmin = async (donnees) => {
  const utilisateurExistant = await Utilisateur.findOne({
    user_email: donnees.user_email,
  });

  if (utilisateurExistant) {
    throw new Error("Cet email existe déjà");
  }

  const rolesValides = ["admin", "etudiant"];

  if (!rolesValides.includes(donnees.role)) {
    throw new Error("Rôle invalide");
  }

  const passwordHache = await bcrypt.hash(donnees.password, 10);

  const utilisateur = await Utilisateur.create({
    user_first_name: donnees.user_first_name,
    user_last_name: donnees.user_last_name,
    user_email: donnees.user_email,
    password: passwordHache,
    user_dob: donnees.user_dob,
    user_phone: donnees.user_phone,
    params: donnees.params || {},
    role: donnees.role,
    emailConfirme: true,
  });

  await envoyerEmailIdentifiants(
    utilisateur.user_email,
    utilisateur.user_email,
    donnees.password
  );

  const utilisateurSansPassword = utilisateur.toObject();
  delete utilisateurSansPassword.password;

  return utilisateurSansPassword;
};

const modifierUtilisateur = async (id, donnees) => {
  const utilisateur = await Utilisateur.findById(id);

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  utilisateur.user_first_name =
    donnees.user_first_name || utilisateur.user_first_name;
  utilisateur.user_last_name =
    donnees.user_last_name || utilisateur.user_last_name;
  utilisateur.user_email = donnees.user_email || utilisateur.user_email;
  utilisateur.user_dob = donnees.user_dob || utilisateur.user_dob;
  utilisateur.user_phone = donnees.user_phone || utilisateur.user_phone;
  utilisateur.params = donnees.params || utilisateur.params;

  if (donnees.role) {
    const rolesValides = ["admin", "etudiant"];

    if (!rolesValides.includes(donnees.role)) {
      throw new Error("Rôle invalide");
    }

    utilisateur.role = donnees.role;
  }

  if (donnees.password) {
    utilisateur.password = await bcrypt.hash(donnees.password, 10);
  }

  await utilisateur.save();

  if (donnees.password) {
    await envoyerEmailIdentifiants(
      utilisateur.user_email,
      utilisateur.user_email,
      donnees.password
    );
  }

  const utilisateurSansPassword = utilisateur.toObject();
  delete utilisateurSansPassword.password;

  return utilisateurSansPassword;
};

const supprimerUtilisateur = async (id) => {
  const utilisateur = await Utilisateur.findByIdAndDelete(id);

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  return { message: "Utilisateur supprimé avec succès" };
};

module.exports = {
  obtenirTousLesUtilisateurs,
  obtenirUtilisateurParId,
  creerUtilisateurParAdmin,
  modifierUtilisateur,
  supprimerUtilisateur,
};