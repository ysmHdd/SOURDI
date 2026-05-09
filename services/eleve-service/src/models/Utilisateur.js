const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    motDePasse: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "etudiant"],
      default: "etudiant",
    },
    solde: {
      type: Number,
      default: 0,
    },
    kpi: {
      lessonsCompletes:     { type: Number, default: 0 },
      tempsPasseEnMinutes:  { type: Number, default: 0 },
      nombreConnexions:     { type: Number, default: 0 },
      autoEvaluation:       { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);