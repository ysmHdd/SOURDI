const Utilisateur = require("../models/Utilisateur");
const Produit = require("../models/Produit");

const getDashboardStats = async (req, res) => {
  try {
    const debutSemaine = new Date();
    debutSemaine.setDate(debutSemaine.getDate() - 7);

    let totalCours = 0;

    try {
      const token = req.headers.authorization || "";

      const coursResponse = await fetch(
        "http://localhost:5004/api/exercices/cours",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (coursResponse.ok) {
        const coursData = await coursResponse.json();

        if (Array.isArray(coursData)) {
          totalCours = coursData.length;
        } else if (Array.isArray(coursData.cours)) {
          totalCours = coursData.cours.length;
        } else if (Array.isArray(coursData.data)) {
          totalCours = coursData.data.length;
        }
      } else {
        console.log(
          "Impossible de charger les cours :",
          coursResponse.status,
          coursResponse.statusText
        );
      }
    } catch (error) {
      console.log("Impossible de charger les cours :", error.message);
    }

    const [
      totalEleves,
      totalProduits,
      demandesEnAttente,
      nouveauxEleves,
      derniersUtilisateurs,
      derniersProduits,
    ] = await Promise.all([
      Utilisateur.countDocuments({
        role: "etudiant",
      }),

      Produit.countDocuments(),

      Utilisateur.countDocuments({
        role: "etudiant",
        statutAcces: "en_attente",
      }),

      Utilisateur.countDocuments({
        role: "etudiant",
        createdAt: { $gte: debutSemaine },
      }),

      Utilisateur.find({
        role: "etudiant",
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password"),

      Produit.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      totalEleves,
      totalProduits,
      totalCours,
      demandesEnAttente,
      nouveauxEleves,
      derniersUtilisateurs,
      derniersProduits,
    });
  } catch (error) {
    console.error("Erreur dashboard admin :", error);

    res.status(500).json({
      message: "Erreur serveur dashboard admin",
    });
  }
};

module.exports = {
  getDashboardStats,
};