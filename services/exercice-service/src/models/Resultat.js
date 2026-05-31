const mongoose = require("mongoose");

const resultatSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    coursId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cours",
      required: true,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    niveau: {
      type: Number,
      required: true,
    },

    matiere: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    pourcentage: {
      type: Number,
      default: 0,
    },

    pointsGagnes: {
      type: Number,
      default: 0,
    },

    tempsEnSecondes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resultat", resultatSchema);