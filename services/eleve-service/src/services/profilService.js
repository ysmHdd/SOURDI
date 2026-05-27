const bcrypt = require("bcryptjs");
const Utilisateur = require("../models/Utilisateur");
const SourdiCoins = require("../models/SourdiCoins");
const axios = require("axios");

const stylesAutorises = [
  "adventurer", "avataaars", "lorelei", "notionists",
  "open-peeps", "micah", "personas",
  "girl-long", "girl-bun", "girl-bob", "girl-curly",
  "boy-short", "boy-flat", "boy-round", "boy-caesar",
];

const genresAutorises = ["male", "female"];

const construireUrlAvatar = (avatar) => {
  if (avatar.url) return avatar.url;
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(avatar.seed)}`;
};

const obtenirProfil = async (idUtilisateur, token) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur).select("-password");
  if (!utilisateur) throw new Error("Profil introuvable");

  let solde = 0;
  try {
    const coinsRes = await axios.get(
      `http://localhost:5003/api/eleve/coins/solde`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    solde = coinsRes.data?.solde ?? 0;
  } catch (e) {
    console.error("Erreur récupération solde:", e.message);
  }

  return { ...utilisateur.toObject(), solde };
};

const syncProfil = async (idUtilisateur, donnees) => {
  const utilisateur = await Utilisateur.findById(idUtilisateur);
  if (!utilisateur) throw new Error("Profil introuvable");

  if (donnees.user_first_name !== undefined) utilisateur.user_first_name = donnees.user_first_name;
  if (donnees.user_last_name  !== undefined) utilisateur.user_last_name  = donnees.user_last_name;
  if (donnees.user_phone      !== undefined) utilisateur.user_phone      = donnees.user_phone;
  if (donnees.params          !== undefined) utilisateur.params = { ...utilisateur.params, ...donnees.params };
  if (donnees.avatar          !== undefined) utilisateur.avatar = { ...utilisateur.avatar, ...donnees.avatar };

  await utilisateur.save();

  const updated = await Utilisateur.findById(idUtilisateur).select("-password");
  const coins   = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  return { ...updated.toObject(), solde: coins?.solde ?? 0 };
};

const modifierMotDePasse = async (idUtilisateur, ancienMotDePasse, nouveauMotDePasse) => {
  if (!ancienMotDePasse || !nouveauMotDePasse) throw new Error("Ancien mot de passe et nouveau mot de passe requis");
  if (nouveauMotDePasse.length < 8) throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères");

  const utilisateur = await Utilisateur.findById(idUtilisateur);
  if (!utilisateur) throw new Error("Profil introuvable");

  const motDePasseValide = await bcrypt.compare(ancienMotDePasse, utilisateur.password);
  if (!motDePasseValide) throw new Error("Ancien mot de passe incorrect");

  const salt = await bcrypt.genSalt(10);
  utilisateur.password = await bcrypt.hash(nouveauMotDePasse, salt);
  await utilisateur.save();

  return { message: "Mot de passe modifié avec succès" };
};

const modifierAvatar = async (idUtilisateur, avatar) => {
  if (!avatar) throw new Error("Avatar requis");
  if (!genresAutorises.includes(avatar.gender)) throw new Error("Genre invalide");
  if (!stylesAutorises.includes(avatar.style))  throw new Error("Style d'avatar invalide");
  if (!avatar.seed || !avatar.seed.trim())       throw new Error("Seed avatar requis");

  const utilisateur = await Utilisateur.findById(idUtilisateur);
  if (!utilisateur) throw new Error("Profil introuvable");

  utilisateur.avatar = {
    gender: avatar.gender,
    style:  avatar.style,
    seed:   avatar.seed.trim(),
    url:    construireUrlAvatar(avatar),
  };

  await utilisateur.save();

  const updated = await Utilisateur.findById(idUtilisateur).select("-password");
  const coins   = await SourdiCoins.findOne({ utilisateur: idUtilisateur });

  return { ...updated.toObject(), solde: coins?.solde ?? 0 };
};

module.exports = {
  obtenirProfil,
  syncProfil,
  modifierMotDePasse,
  modifierAvatar,
};
