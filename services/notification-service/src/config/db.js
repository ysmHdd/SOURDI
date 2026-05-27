const mongoose = require("mongoose");

const connecterBaseDonnees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Notification-service connecté à MongoDB");
  } catch (erreur) {
    console.error("Erreur MongoDB notification-service :", erreur.message);
    process.exit(1);
  }
};

module.exports = connecterBaseDonnees;