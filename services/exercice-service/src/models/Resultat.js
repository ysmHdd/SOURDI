const mongoose = require("mongoose");

<<<<<<< HEAD

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
=======
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
>>>>>>> origin/notifcalendrier

module.exports = mongoose.model("Resultat", resultatSchema);