const axios = require("axios");
const Cours = require("../models/Cours");
const Quiz = require("../models/Quiz");
const Resultat = require("../models/Resultat");
const AutoEvaluation = require("../models/AutoEvaluation");
const ProgressionCours = require("../models/ProgressionCours");

const COINS_URL = process.env.COINS_SERVICE_URL || "http://localhost:5005";

const MATIERES = [
  "maths",
  "francais",
  "anglais",
  "arabe",
  "sciences",
  "histoire",
  "education_islamique",
];

const estAdmin = (utilisateur) => utilisateur.role === "admin";

const getNiveauEleve = (utilisateur) => {
  if (utilisateur.niveau) return Number(utilisateur.niveau);

  const classe = (
    utilisateur.classe ||
    utilisateur.grade ||
    utilisateur.niveauScolaire ||
    ""
  )
    .toLowerCase()
    .trim();

  const map = {
    "1": 1,
    "1ere": 1,
    "1ère": 1,
    "1ere annee primaire": 1,
    "1ère année primaire": 1,
    "1ere primaire": 1,

    "2": 2,
    "2eme": 2,
    "2ème": 2,
    "2eme annee primaire": 2,
    "2ème année primaire": 2,
    "2eme primaire": 2,

    "3": 3,
    "3eme": 3,
    "3ème": 3,
    "3eme annee primaire": 3,
    "3ème année primaire": 3,
    "3eme primaire": 3,

    "4": 4,
    "4eme": 4,
    "4ème": 4,
    "4eme annee primaire": 4,
    "4ème année primaire": 4,
    "4eme primaire": 4,

    "5": 5,
    "5eme": 5,
    "5ème": 5,
    "5eme annee primaire": 5,
    "5ème année primaire": 5,
    "5eme primaire": 5,

    "6": 6,
    "6eme": 6,
    "6ème": 6,
    "6eme annee primaire": 6,
    "6ème année primaire": 6,
    "6eme primaire": 6,
  };

  return map[classe] || null;
};

const getMatieres = async () => {
  return MATIERES;
};

const getCours = async (utilisateur, query) => {
  const filtre = { actif: true };

  if (estAdmin(utilisateur)) {
    if (query.niveau) filtre.niveau = Number(query.niveau);
  } else {
    const niveauEleve = getNiveauEleve(utilisateur) || Number(query.niveau);

    if (!niveauEleve) {
      throw new Error("Niveau de l'élève introuvable");
    }

    filtre.niveau = niveauEleve;
  }

  if (query.matiere) filtre.matiere = query.matiere;

  return await Cours.find(filtre).sort({ matiere: 1, createdAt: -1 });
};

const getCoursById = async (utilisateur, coursId) => {
  const cours = await Cours.findById(coursId);

  if (!cours || !cours.actif) {
    throw new Error("Cours introuvable");
  }

  if (!estAdmin(utilisateur)) {
    const niveauEleve = getNiveauEleve(utilisateur);

    if (!niveauEleve || cours.niveau !== niveauEleve) {
      throw new Error("Accès interdit à ce cours");
    }
  }

  return cours;
};

const creerCours = async (data, file) => {
  if (!file) {
    throw new Error("Le support PDF est obligatoire");
  }

  return await Cours.create({
    titre: data.titre,
    description: data.description || "",
    niveau: Number(data.niveau),
    matiere: data.matiere,
    pdfUrl: `/uploads/cours/${file.filename}`,
    coinsCompletion: Number(data.coinsCompletion) || 20,
  });
};

const modifierCours = async (coursId, data, file) => {
  const update = { ...data };

  if (data.niveau) update.niveau = Number(data.niveau);
  if (data.coinsCompletion) update.coinsCompletion = Number(data.coinsCompletion);
  if (file) update.pdfUrl = `/uploads/cours/${file.filename}`;

  const cours = await Cours.findByIdAndUpdate(coursId, update, { new: true });

  if (!cours) {
    throw new Error("Cours introuvable");
  }

  return cours;
};

const supprimerCours = async (coursId) => {
  const cours = await Cours.findByIdAndUpdate(
    coursId,
    { actif: false },
    { new: true }
  );

  if (!cours) {
    throw new Error("Cours introuvable");
  }

  return { message: "Cours supprimé avec succès" };
};

const completerCours = async (utilisateur, coursId, token) => {
  const eleveId = utilisateur.id;
  const cours = await getCoursById(utilisateur, coursId);

  const dejaComplete = await ProgressionCours.findOne({
    eleveId,
    coursId,
  });

  if (dejaComplete) {
    return {
      message: "Cours déjà complété",
      coinsGagnes: 0,
      dejaComplete: true,
    };
  }

  const coinsGagnes = cours.coinsCompletion || 20;

  const progression = await ProgressionCours.create({
    eleveId,
    coursId,
    coinsGagnes,
  });

  try {
    await axios.post(
      `${COINS_URL}/api/coins/lecon`,
      {
        matiere: cours.matiere,
        titre: cours.titre,
        coursId: cours._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Erreur coins-service leçon:", err.message);
  }

  return {
    message: "Cours complété avec succès",
    coinsGagnes,
    progression,
    dejaComplete: false,
  };
};

const getQuizParCours = async (utilisateur, coursId) => {
  await getCoursById(utilisateur, coursId);

  const quiz = await Quiz.find({ coursId, actif: true }).lean();

  return quiz.map((q) => ({
    ...q,
    questions: q.questions.map(({ bonneReponse, ...question }) => question),
  }));
};

const creerQuiz = async (data) => {
  const cours = await Cours.findById(data.coursId);

  if (!cours) {
    throw new Error("Cours introuvable");
  }

  return await Quiz.create({
    coursId: data.coursId,
    titre: data.titre,
    questions: data.questions,
  });
};

const modifierQuiz = async (quizId, data) => {
  const quiz = await Quiz.findByIdAndUpdate(quizId, data, { new: true });

  if (!quiz) {
    throw new Error("Quiz introuvable");
  }

  return quiz;
};

const supprimerQuiz = async (quizId) => {
  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { actif: false },
    { new: true }
  );

  if (!quiz) {
    throw new Error("Quiz introuvable");
  }

  return { message: "Quiz supprimé avec succès" };
};

const soumettreQuiz = async (utilisateur, quizId, body, token) => {
  const eleveId = utilisateur.id;
  const quiz = await Quiz.findById(quizId);

  if (!quiz || !quiz.actif) {
    throw new Error("Quiz introuvable");
  }

  const cours = await getCoursById(utilisateur, quiz.coursId);

  const dejaComplete = await Resultat.findOne({
    eleveId,
    quizId: quiz._id,
  });

  const reponses = body.reponses || [];
  let score = 0;

  const detail = quiz.questions.map((question, index) => {
    const reponseEleve = reponses.find((r) => Number(r.questionIndex) === index);

    const correct =
      reponseEleve && Number(reponseEleve.reponse) === question.bonneReponse;

    if (correct) score++;

    return {
      questionIndex: index,
      correct,
      bonneReponse: question.bonneReponse,
      reponseEleve: reponseEleve ? reponseEleve.reponse : null,
    };
  });

  const total = quiz.questions.length;
  const pourcentage = total > 0 ? Math.round((score / total) * 100) : 0;

  let pointsGagnes = 0;
  let dejaRecompense = !!dejaComplete;

  if (!dejaComplete && score > 0) {
    try {
      const coinsRes = await axios.post(
        `${COINS_URL}/api/coins/quiz`,
        {
          score,
          total,
          matiere: cours.matiere,
          coursId: cours._id,
          quizId: quiz._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      pointsGagnes = coinsRes.data?.montant || 0;
      dejaRecompense = !!coinsRes.data?.dejaRecompense;
    } catch (err) {
      console.error("Erreur coins-service quiz:", err.message);
      pointsGagnes = 0;
    }
  }

  const resultat = await Resultat.create({
    eleveId,
    coursId: cours._id,
    quizId: quiz._id,
    niveau: cours.niveau,
    matiere: cours.matiere,
    score,
    total,
    pourcentage,
    pointsGagnes,
    tempsEnSecondes: body.tempsEnSecondes || 0,
  });

  return {
    score,
    total,
    pourcentage,
    pointsGagnes,
    dejaComplete: dejaRecompense,
    detail,
    resultatId: resultat._id,
  };
};

const faireAutoEvaluation = async (utilisateur, body, token) => {
  const eleveId = utilisateur.id;
  const niveau = getNiveauEleve(utilisateur) || Number(body.niveau);

  if (!niveau) {
    throw new Error("Niveau de l'élève introuvable");
  }

  const depuis24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const derniere = await AutoEvaluation.findOne({
    eleveId,
    createdAt: { $gte: depuis24h },
  });

  if (derniere) {
    throw new Error("Tu peux faire une seule auto-évaluation chaque 24h");
  }

  const autoEvaluation = await AutoEvaluation.create({
    eleveId,
    niveau,
    note: body.note,
    commentaire: body.commentaire || "",
  });

  try {
    await axios.post(
      `${COINS_URL}/api/coins/auto-evaluation`,
      { note: body.note },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Erreur coins-service auto-évaluation:", err.message);
  }

  return autoEvaluation;
};

const getHistorique = async (eleveId) => {
  return await Resultat.find({ eleveId })
    .populate("coursId", "titre matiere niveau")
    .populate("quizId", "titre")
    .sort({ createdAt: -1 })
    .limit(50);
};

const supprimerHistorique = async (eleveId, resultatId) => {
  const resultat = await Resultat.findOneAndDelete({
    _id: resultatId,
    eleveId,
  });

  if (!resultat) {
    throw new Error("Historique introuvable");
  }

  return { message: "Historique supprimé" };
};

module.exports = {
  getMatieres,
  getCours,
  getCoursById,
  creerCours,
  modifierCours,
  supprimerCours,
  completerCours,
  getQuizParCours,
  creerQuiz,
  modifierQuiz,
  supprimerQuiz,
  soumettreQuiz,
  faireAutoEvaluation,
  getHistorique,
  supprimerHistorique,
};