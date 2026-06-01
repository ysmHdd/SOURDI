const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    utilisateurId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
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
      enum: [
        "message",
        "marketplace",
        "calendrier",
        "systeme",
        "quiz",
      ],
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