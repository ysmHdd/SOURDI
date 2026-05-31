const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    niveau: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },

    matiere: {
      type: String,
      required: true,
      enum: [
        "maths",
        "francais",
        "anglais",
        "arabe",
        "sciences",
        "histoire",
        "education_islamique",
      ],
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    coinsCompletion: {
      type: Number,
      default: 20,
    },

    actif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cours", coursSchema);