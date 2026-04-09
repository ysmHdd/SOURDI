const mongoose = require("mongoose");

const sourdiCoinsSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      unique: true,
    },
    solde: {
      type: Number,
      default: 0,
      min: 0,
    },
    historiqueGains: [
      {
        montant: Number,
        raison: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SourdiCoins", sourdiCoinsSchema);