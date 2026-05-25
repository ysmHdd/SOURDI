const mongoose = require("mongoose");

const calendrierSchema = new mongoose.Schema(
  {
    utilisateurId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    matiere: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    heureDebut: {
      type: String,
      required: true,
    },
    heureFin: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Calendrier", calendrierSchema);