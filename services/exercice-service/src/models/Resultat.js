const mongoose = require("mongoose");

const resultatSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // 🔥 on garde aussi l'exercice global
    exerciceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercice",
      required: true,
    },

    matiere: String,
    niveau: Number,
    sousCat: String,

    score: Number,
    total: Number,
    pointsGagnes: Number,
    tempsEnSecondes: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resultat", resultatSchema);