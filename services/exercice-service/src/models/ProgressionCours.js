const mongoose = require("mongoose");

const progressionCoursSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    coursId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cours",
      required: true,
      index: true,
    },

    coinsGagnes: {
      type: Number,
      default: 20,
    },
  },
  { timestamps: true }
);

progressionCoursSchema.index({ eleveId: 1, coursId: 1 }, { unique: true });

module.exports = mongoose.model("ProgressionCours", progressionCoursSchema);