const mongoose = require("mongoose");

const kpiSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      unique: true,
    },
    lessonsCompletes: {
      type: Number,
      default: 0,
    },
    tempsPasseEnMinutes: {
      type: Number,
      default: 0,
    },
    nombreConnexions: {
      type: Number,
      default: 0,
    },
    autoEvaluation: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    derniereConnexion: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KPI", kpiSchema);