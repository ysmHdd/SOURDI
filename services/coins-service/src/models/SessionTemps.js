const mongoose = require("mongoose");

const sessionTempsSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    minutesAccumulees: {
      type: Number,
      default: 0,
      min: 0,
    },

    dernierPalierRecompense: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SessionTemps",
  sessionTempsSchema
);