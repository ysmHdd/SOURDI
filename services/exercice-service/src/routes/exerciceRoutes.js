const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authentification");
const adminOnly = require("../middlewares/adminOnly");
const uploadPdf = require("../middlewares/uploadPdf");

const {
  getMatieres,
  getCours,
  getCoursById,
  creerCours,
  modifierCours,
  supprimerCours,
  getQuizParCours,
  creerQuiz,
  modifierQuiz,
  supprimerQuiz,
  soumettreQuiz,
  faireAutoEvaluation,
  getHistorique,
  completerCours,
  supprimerHistorique,
  
} = require("../controllers/exerciceController");

router.get("/matieres", auth, getMatieres);

router.get("/cours", auth, getCours);
router.get("/cours/:id", auth, getCoursById);
router.post("/cours/:id/completer", auth, completerCours);

router.post("/cours", auth, adminOnly, uploadPdf.single("pdf"), creerCours);
router.put("/cours/:id", auth, adminOnly, uploadPdf.single("pdf"), modifierCours);
router.delete("/cours/:id", auth, adminOnly, supprimerCours);

router.get("/cours/:coursId/quiz", auth, getQuizParCours);

router.post("/quiz", auth, adminOnly, creerQuiz);
router.put("/quiz/:id", auth, adminOnly, modifierQuiz);
router.delete("/quiz/:id", auth, adminOnly, supprimerQuiz);

router.post("/quiz/:quizId/soumettre", auth, soumettreQuiz);

router.post("/auto-evaluation", auth, faireAutoEvaluation);

router.get("/historique", auth, getHistorique);
router.delete("/historique/:id", auth, supprimerHistorique);

module.exports = router;