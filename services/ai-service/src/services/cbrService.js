const QuestionAnswer = require("../models/QuestionAnswer");

const normaliserQuestion = (question = "") => {
  return question
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF]/g, "")
    .replace(/\s+/g, " ");
};

const rechercherQuestionSimilaire = async (question) => {
  const questionNormalisee = normaliserQuestion(question);

  if (!questionNormalisee || questionNormalisee.length < 3) {
    return null;
  }

  return await QuestionAnswer.findOne({
    questionNormalisee,
  });
};

const sauvegarderQuestionReponse = async ({
  question,
  answer,
  niveau,
  langue,
  type = "text",
}) => {
  const questionNormalisee = normaliserQuestion(question);

  if (!questionNormalisee || !answer) {
    return null;
  }

  const existe = await QuestionAnswer.findOne({
    questionNormalisee,
  });

  if (existe) {
    existe.utilisation += 1;
    await existe.save();
    return existe;
  }

  return await QuestionAnswer.create({
    question,
    questionNormalisee,
    answer,
    niveau,
    langue,
    type,
  });
};

module.exports = {
  rechercherQuestionSimilaire,
  sauvegarderQuestionReponse,
};