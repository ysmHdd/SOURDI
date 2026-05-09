const profilService = require("../services/profilService");

const obtenirProfil = async (req, res) => {
  try {
    const profil = await profilService.obtenirProfil(req.utilisateur.id);
    res.json(profil);
  } catch (erreur) {
    res.status(404).json({ message: erreur.message });
  }
};

const syncProfil = async (req, res) => {
  try {
    const profil = await profilService.syncProfil(req.utilisateur.id, req.body);
    res.json(profil);
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
};

module.exports = { obtenirProfil, syncProfil };