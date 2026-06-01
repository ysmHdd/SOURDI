const mongoose = require("mongoose");

const questionAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    questionNormalisee: {
      type: String,
      required: true,
      index: true,
    },

    answer: {
      type: String,
      required: true,
    },

    niveau: {
      type: String,
      default: "primaire",
    },

    langue: {
      type: String,
      default: "auto",
    },

    type: {
      type: String,
      enum: ["text", "homework", "pdf", "image"],
      default: "text",
    },

    utilisation: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

questionAnswerSchema.index({
  questionNormalisee: "text",
  question: "text",
});

module.exports = mongoose.model("QuestionAnswer", questionAnswerSchema);