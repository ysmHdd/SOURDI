const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema(
  {
    user_first_name: {
      type: String,
      required: true,
      trim: true,
    },

    user_last_name: {
      type: String,
      required: true,
      trim: true,
    },

    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    user_dob: {
      type: Date,
      required: true,
    },

    user_phone: {
      type: String,
      required: true,
      trim: true,
    },

    params: {
      grade: String,
      gouvernorat: String,
      delegation: String,
      region: String,
      school_name: String,
    },

    role: {
      type: String,
      enum: ["admin", "etudiant"],
      default: "etudiant",
    },

    emailConfirme: {
      type: Boolean,
      default: false,
    },

    emailToken: {
      type: String,
    },

    emailTokenExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);