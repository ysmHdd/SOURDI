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
      nom: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      telephone: {
        type: String,
        default: "",
      },
    },

    adresseLivraison: {
      adresse: {
        type: String,
        default: "",
      },

      gouvernorat: {
        type: String,
        default: "",
      },

      delegation: {
        type: String,
        default: "",
      },

      codePostal: {
        type: String,
        default: "",
      },

      note: {
        type: String,
        default: "",
      },
    },

    statut: {
      type: String,
      enum: [
        "reussi",
        "livree",
        "echoue",
        "rembourse",
        "annulee",
      ],
      default: "reussi",
    },

    annulation: {
      annuleePar: {
        type: String,
        enum: ["admin", "eleve", null],
        default: null,
      },

      cause: {
        type: String,
        enum: ["rupture_stock", "autre", ""],
        default: "",
      },

      details: {
        type: String,
        default: "",
      },

      dateAnnulation: {
        type: Date,
        default: null,
      },
    },

    dateLivraison: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);