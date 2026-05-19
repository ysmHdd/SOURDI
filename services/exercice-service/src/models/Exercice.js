const mongoose = require("mongoose");

const exerciceSchema = new mongoose.Schema({
  matiere: {
    type: String,
    required: true,
    enum: ["francais", "arabe", "maths", "sciences", "histoire"],
  },

  niveau: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },

  sousCat: {
    type: String,
    required: true,
  },

  titre: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  difficulte: {
    type: String,
    enum: ["facile", "moyen", "difficile"],
    default: "facile",
  },

  image: {
    type: String,
    default: "",
  },

  question: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  reponse: {
    type: Number,
    required: true,
  },

  exp: {
    type: Number,
    default: 20,
  },

  dureeEstimee: {
    type: Number,
    default: 5,
  },

  langue: {
    type: String,
    enum: ["fr", "ar"],
    default: "fr",
  },
}, { timestamps: true });

module.exports = mongoose.model("Exercice", exerciceSchema);