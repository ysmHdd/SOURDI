const mongoose = require("mongoose");

const exerciceSchema = new mongoose.Schema({
  matiere: { type: String, required: true, enum: ["francais", "arabe", "maths", "sciences", "histoire"] },
  niveau: { type: Number, required: true, min: 1, max: 6 },
  sousCat: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  reponse: { type: Number, required: true, min: 0, max: 3 },
  points: { type: Number, default: 10 },
  langue: { type: String, enum: ["fr", "ar"], default: "fr" },
}, { timestamps: true });

module.exports = mongoose.model("Exercice", exerciceSchema);