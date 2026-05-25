const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    utilisateurId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["etudiant", "admin"],
      default: "etudiant",
    },

    titre: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["message", "marketplace", "calendrier", "systeme"],
      required: true,
    },

    lien: {
      type: String,
      default: "",
    },

    lu: {
      type: Boolean,
      default: false,
    },

    referenceId: {
      type: String,
      default: "",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);