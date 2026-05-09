const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authentification");
const { getMatieres, getSousCats, getExercices, soumettre, getHistorique } = require("../controllers/exerciceController");

router.get("/matieres", auth, getMatieres);
router.get("/souscats", auth, getSousCats);
router.get("/", auth, getExercices);
router.post("/soumettre", auth, soumettre);
router.get("/historique", auth, getHistorique);

module.exports = router;