const mongoose = require("mongoose");

const panierItemSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },

    quantite: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const panierSchema = new mongoose.Schema(
  {
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
      unique: true,
    },

    produits: {
      type: [panierItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Panier", panierSchema);