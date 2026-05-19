const mongoose = require("mongoose");

const fichierSchema = new mongoose.Schema(
  {
    nomOriginal: String,
    nomFichier: String,
    typeMime: String,
    taille: Number,
    url: String,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    expediteurId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    expediteurRole: {
      type: String,
      enum: ["admin", "etudiant"],
      required: true,
    },

    contenu: {
      type: String,
      trim: true,
      default: "",
    },

    fichiers: {
      type: [fichierSchema],
      default: [],
    },

    luParAdmin: {
      type: Boolean,
      default: false,
    },

    luParEtudiant: {
      type: Boolean,
      default: false,
    },

    masquePourEtudiant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    etudiantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    etudiantNom: {
      type: String,
      default: "",
    },

    etudiantEmail: {
      type: String,
      default: "",
    },

    statut: {
      type: String,
      enum: ["nouveau", "en_cours", "termine"],
      default: "nouveau",
    },

    adminAssigneId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    adminAssigneEmail: {
      type: String,
      default: "",
    },

    dernierMessage: {
      type: String,
      default: "",
    },

    dernierMessageDate: {
      type: Date,
      default: Date.now,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);