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

const annulationSchema = new mongoose.Schema(
  {
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
      trim: true,
      default: "",
    },
    dateAnnulation: {
      type: Date,
      default: null,
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
      index: true,
    },

    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
      index: true,
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
      min: 0,
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
      enum: ["reussi", "livree", "echoue", "rembourse", "annulee"],
      default: "reussi",
      index: true,
    },

    dateLivraison: {
      type: Date,
      default: null,
    },

    annulation: {
      type: annulationSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);