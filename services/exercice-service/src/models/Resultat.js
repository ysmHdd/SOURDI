const mongoose = require("mongoose");


const resultatSchema = new mongoose.Schema(
  {
    eleveId: { type: mongoose.Schema.Types.ObjectId, required: true },
    exerciceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercice",
      required: false, 
    },
    matiere: String,
    niveau: Number,
    sousCat: String,
    score: Number,
    total: Number,
    pointsGagnes: Number,
    tempsEnSecondes: Number,

    reponses: [
      {
        exerciceId: { type: mongoose.Schema.Types.ObjectId },
        reponse: mongoose.Schema.Types.Mixed,
        correct: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resultat", resultatSchema);