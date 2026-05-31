const mongoose = require("mongoose");

const derniereConnexionSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      required: true,
    },

    streak: {
      type: Number,
      default: 1,
    },

    totalConnexions: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DerniereConnexion", derniereConnexionSchema);