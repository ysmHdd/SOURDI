const mongoose = require("mongoose");

const connecterBaseDeDonnees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Base de données connectée avec succès");
  } catch (erreur) {
    console.error("Erreur de connexion à MongoDB :", erreur.message);
    process.exit(1);
  }
};

module.exports = connecterBaseDeDonnees;