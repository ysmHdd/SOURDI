const mongoose = require("mongoose");

const connecterDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté — coins-service");
  } catch (err) {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  }
};

module.exports = connecterDB;