const adminOnly = (req, res, next) => {
  if (!req.utilisateur || req.utilisateur.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé à l'admin" });
  }

  next();
};

module.exports = adminOnly;