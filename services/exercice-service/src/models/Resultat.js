const mongoose = require("mongoose");

const resultatSchema = new mongoose.Schema({
  eleveId: { type: mongoose.Schema.Types.ObjectId, required: true },
  matiere: { type: String, required: true },
  niveau: { type: Number, required: true },
  sousCat: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  pointsGagnes: { type: Number, default: 0 },
  tempsEnSecondes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Resultat", resultatSchema);