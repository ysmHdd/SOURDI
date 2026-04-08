const Utilisateur = require("../models/Utilisateur");

const obtenirTousLesUtilisateurs = async () => {
  return await Utilisateur.find().select("-motDePasse");
};

const obtenirUtilisateurParId = async (id) => {
  const utilisateur = await Utilisateur.findById(id).select("-motDePasse");
  if (!utilisateur) throw new Error("Utilisateur introuvable");
  return utilisateur;
};

const modifierRoleUtilisateur = async (id, role) => {
  const rolesValides = ["admin", "etudiant"];
  if (!rolesValides.includes(role)) throw new Error("Rôle invalide");

  const utilisateur = await Utilisateur.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  ).select("-motDePasse");

  if (!utilisateur) throw new Error("Utilisateur introuvable");
  return utilisateur;
};

const supprimerUtilisateur = async (id) => {
  const utilisateur = await Utilisateur.findByIdAndDelete(id);
  if (!utilisateur) throw new Error("Utilisateur introuvable");
  return { message: "Utilisateur supprimé avec succès" };
};

module.exports = {
  obtenirTousLesUtilisateurs,
  obtenirUtilisateurParId,
  modifierRoleUtilisateur,
  supprimerUtilisateur,
};