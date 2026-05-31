const exerciceService = require("../services/exerciceService");

const getToken = (req) => req.headers.authorization?.split(" ")[1];

const getMatieres = async (req, res) => {
  try {
    const matieres = await exerciceService.getMatieres();
    res.json(matieres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCours = async (req, res) => {
  try {
    const cours = await exerciceService.getCours(req.utilisateur, req.query);
    res.json(cours);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCoursById = async (req, res) => {
  try {
    const cours = await exerciceService.getCoursById(
      req.utilisateur,
      req.params.id
    );
    res.json(cours);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const creerCours = async (req, res) => {
  try {
    const cours = await exerciceService.creerCours(req.body, req.file);
    res.status(201).json(cours);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const modifierCours = async (req, res) => {
  try {
    const cours = await exerciceService.modifierCours(
      req.params.id,
      req.body,
      req.file
    );
    res.json(cours);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const supprimerCours = async (req, res) => {
  try {
    const resultat = await exerciceService.supprimerCours(req.params.id);
    res.json(resultat);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const completerCours = async (req, res) => {
  try {
    const token = getToken(req);

    const resultat = await exerciceService.completerCours(
      req.utilisateur,
      req.params.id,
      token
    );

    res.json(resultat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getQuizParCours = async (req, res) => {
  try {
    const quiz = await exerciceService.getQuizParCours(
      req.utilisateur,
      req.params.coursId
    );
    res.json(quiz);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

const creerQuiz = async (req, res) => {
  try {
    const quiz = await exerciceService.creerQuiz(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const modifierQuiz = async (req, res) => {
  try {
    const quiz = await exerciceService.modifierQuiz(req.params.id, req.body);
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const supprimerQuiz = async (req, res) => {
  try {
    const resultat = await exerciceService.supprimerQuiz(req.params.id);
    res.json(resultat);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const soumettreQuiz = async (req, res) => {
  try {
    const token = getToken(req);

    const resultat = await exerciceService.soumettreQuiz(
      req.utilisateur,
      req.params.quizId,
      req.body,
      token
    );

    res.json(resultat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const faireAutoEvaluation = async (req, res) => {
  try {
    const token = getToken(req);

    const resultat = await exerciceService.faireAutoEvaluation(
      req.utilisateur,
      req.body,
      token
    );

    res.status(201).json(resultat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getHistorique = async (req, res) => {
  try {
    const historique = await exerciceService.getHistorique(req.utilisateur.id);
    res.json(historique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const supprimerHistorique = async (req, res) => {
  try {
    const resultat = await exerciceService.supprimerHistorique(
      req.utilisateur.id,
      req.params.id
    );

    res.json(resultat);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
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