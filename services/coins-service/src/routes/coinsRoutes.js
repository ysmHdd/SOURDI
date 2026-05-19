const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authentification");
const {
  recompenseQuiz,
  recompenseLecon,
  recompenseConnexion,
  recompenseAutoEvaluation,
  recompenseTemps,
  getHistorique,
  getStats,
} = require("../controllers/coinsController");

router.post("/quiz",            auth, recompenseQuiz);
router.post("/lecon",           auth, recompenseLecon);
router.post("/connexion",       auth, recompenseConnexion);
router.post("/auto-evaluation", auth, recompenseAutoEvaluation);
router.post("/temps",           auth, recompenseTemps);
router.get("/historique",       auth, getHistorique);
router.get("/stats",            auth, getStats);

module.exports = router;