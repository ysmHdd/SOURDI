const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length === 4,
        message: "4 options obligatoires",
      },
    },

    bonneReponse: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    points: {
      type: Number,
      default: 10,
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    coursId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cours",
      required: true,
    },

    titre: {
      type: String,
      required: true,
    },

    questions: [questionSchema],

    actif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);