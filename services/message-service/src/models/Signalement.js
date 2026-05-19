const mongoose = require("mongoose");

const signalementSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },

    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    etudiantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    etudiantNom: {
      type: String,
      default: "",
    },

    etudiantEmail: {
      type: String,
      default: "",
    },

    etudiantAvatar: {
      gender: String,
      style: String,
      seed: String,
      url: String,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    adminEmail: {
      type: String,
      default: "",
    },

    typeHarcelement: {
      type: String,
      enum: [
        "bad_words",
        "harassment",
        "sexual_harassment",
        "bullying",
        "hate_speech",
        "spam",
        "other",
      ],
      required: true,
    },

    details: {
      type: String,
      trim: true,
      default: "",
    },

    messageSignale: {
      type: String,
      default: "",
    },

    fichiersMessage: {
      type: Array,
      default: [],
    },

    statut: {
      type: String,
      enum: ["nouveau", "traite"],
      default: "nouveau",
    },

    traiteParAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    traiteParAdminEmail: {
      type: String,
      default: "",
    },

    dateTraitement: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Signalement", signalementSchema);