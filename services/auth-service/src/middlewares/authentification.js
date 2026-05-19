const jwt = require("jsonwebtoken");

const verifierToken = (req, res, next) => {
  try {
    const enTeteAutorisation = req.headers.authorization;

    if (!enTeteAutorisation || !enTeteAutorisation.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Accès refusé, token manquant",
      });
    }

    const token = enTeteAutorisation.split(" ")[1];
    const donneesDecodees = jwt.verify(token, process.env.JWT_SECRET);

    req.utilisateur = donneesDecodees;
    next();
  } catch (erreur) {
    return res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
};

const autoriserRoles = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.utilisateur.role)) {
      return res.status(403).json({
        message: "Accès interdit : rôle insuffisant",
      });
    }

    next();
  };
};

module.exports = {
  verifierToken,
  autoriserRoles,
};