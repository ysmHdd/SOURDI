const mongoose = require("mongoose");

const adresseLivraisonSchema = new mongoose.Schema(
  {
    adresse: {
      type: String,
      required: true,
      trim: true,
    },
    gouvernorat: {
      type: String,
      required: true,
      trim: true,
    },
    delegation: {
      type: String,
      required: true,
      trim: true,
    },
    codePostal: {
      type: String,
      trim: true,
      default: "",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

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

    quantite: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    montantEnCoins: {
      type: Number,
      required: true,
    },

    client: {
      type: clientSchema,
      required: true,
    },

    adresseLivraison: {
      type: adresseLivraisonSchema,
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