const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "quiz",           // Quiz terminé
        "lecon",          // Leçon complétée
        "connexion",      // Connexion quotidienne
        "auto_evaluation",// Auto-évaluation soumise
        "temps",          // Temps passé (30 min)
        "achat",          // Achat marketplace (négatif)
      ],
    },
    montant: {
      type: Number,
      required: true, // positif = gain, négatif = dépense
    },
    description: {
      type: String,
      required: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // ex: { matiere: "maths", score: 8, total: 10 }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);