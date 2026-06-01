const mongoose = require("mongoose");

const autoEvaluationSchema = new mongoose.Schema(
  {
    eleveId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    niveau: {
      type: Number,
      required: true,
    },

    note: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AutoEvaluation",
  autoEvaluationSchema
);