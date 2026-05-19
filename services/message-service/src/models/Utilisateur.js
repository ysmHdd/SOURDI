const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema(
  {
    gender: String,
    style: String,
    seed: String,
    url: String,
  },
  { _id: false }
);

const utilisateurSchema = new mongoose.Schema(
  {
    user_first_name: String,
    user_last_name: String,
    user_email: String,
    avatar: avatarSchema,
    role: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema);