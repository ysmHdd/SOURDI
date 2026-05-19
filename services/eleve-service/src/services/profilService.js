const bcrypt = require("bcryptjs");
const Utilisateur = require("../models/Utilisateur");

const stylesAutorises = [
  "adventurer",
  "avataaars",
  "lorelei",
  "notionists",
  "open-peeps",
  "micah",
  "personas",

  "girl-long",
  "girl-bun",
  "girl-bob",
  "girl-curly",
  "boy-short",
  "boy-flat",
  "boy-round",
  "boy-caesar",
];

const genresAutorises = ["male", "female"];

const construireUrlAvatar = (avatar) => {
  if (avatar.url) {
    return avatar.url;
  }

  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    avatar.seed
  )}`;
};

const obtenirProfil = async (idUtilisateur) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur).select("-password");

  if (!utilisateur) {
    throw new Error("Profil introuvable");
  }

  return utilisateur;
};

const syncProfil = async (idUtilisateur, donnees) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur);

  if (!utilisateur) {
    throw new Error("Profil introuvable");
  }

  if (donnees.user_first_name !== undefined) {
    utilisateur.user_first_name = donnees.user_first_name;
  }

  if (donnees.user_last_name !== undefined) {
    utilisateur.user_last_name = donnees.user_last_name;
  }

  if (donnees.user_phone !== undefined) {
    utilisateur.user_phone = donnees.user_phone;
  }

  if (donnees.params !== undefined) {
    utilisateur.params = {
      ...utilisateur.params,
      ...donnees.params,
    };
  }

  if (donnees.avatar !== undefined) {
    utilisateur.avatar = {
      ...utilisateur.avatar,
      ...donnees.avatar,
    };
  }

  await utilisateur.save();

  return await Utilisateur.findById(idUtilisateur).select("-password");
};

const modifierMotDePasse = async (
  idUtilisateur,
  ancienMotDePasse,
  nouveauMotDePasse
) => {
  if (!ancienMotDePasse || !nouveauMotDePasse) {
    throw new Error("Ancien mot de passe et nouveau mot de passe requis");
  }

  if (nouveauMotDePasse.length < 8) {
    throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères");
  }

  const utilisateur = await Utilisateur.findById(idUtilisateur);

  if (!utilisateur) {
    throw new Error("Profil introuvable");
  }

  const motDePasseValide = await bcrypt.compare(
    ancienMotDePasse,
    utilisateur.password
  );

  if (!motDePasseValide) {
    throw new Error("Ancien mot de passe incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  utilisateur.password = await bcrypt.hash(nouveauMotDePasse, salt);

  await utilisateur.save();

  return {
    message: "Mot de passe modifié avec succès",
  };
};

const modifierAvatar = async (idUtilisateur, avatar) => {
  if (!avatar) {
    throw new Error("Avatar requis");
  }

  if (!genresAutorises.includes(avatar.gender)) {
    throw new Error("Genre invalide");
  }

  if (!stylesAutorises.includes(avatar.style)) {
    throw new Error("Style d'avatar invalide");
  }

  if (!avatar.seed || !avatar.seed.trim()) {
    throw new Error("Seed avatar requis");
  }

  const utilisateur = await Utilisateur.findById(idUtilisateur);

  if (!utilisateur) {
    throw new Error("Profil introuvable");
  }

  const nouvelAvatar = {
    gender: avatar.gender,
    style: avatar.style,
    seed: avatar.seed.trim(),
    url: construireUrlAvatar(avatar),
  };

  utilisateur.avatar = nouvelAvatar;

  await utilisateur.save();

  return await Utilisateur.findById(idUtilisateur).select("-password");
};

module.exports = {
  obtenirProfil,
  syncProfil,
  modifierMotDePasse,
  modifierAvatar,
};