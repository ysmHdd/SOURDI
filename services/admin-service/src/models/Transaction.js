const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
    },
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
    montantEnCoins: {
      type: Number,
      required: true,
    },
    statut: {
      type: String,
      enum: ["reussi", "echoue", "rembourse"],
      default: "reussi",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);