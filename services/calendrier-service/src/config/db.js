const mongoose = require("mongoose");

const connecterDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté - calendrier-service");
  } catch (erreur) {
    console.error("Erreur MongoDB :", erreur.message);
    process.exit(1);
  }
};

module.exports = connecterDB;