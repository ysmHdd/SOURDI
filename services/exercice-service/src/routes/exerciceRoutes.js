const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authentification");
const {
  getMatieres,
  getSousCats,
  getExercices,
  soumettre,
  getHistorique,
  creer,
  modifier,
  getListeExercices,
  supprimer,
} = require("../controllers/exerciceController");

router.get("/matieres", auth, getMatieres);
router.get("/souscats", auth, getSousCats);
router.get("/", auth, getExercices);
router.post("/soumettre", auth, soumettre);
router.get("/historique", auth, getHistorique);
router.post("/", auth, creer);
router.put("/:id", auth, modifier);
router.delete("/:id", auth, supprimer);
router.get("/liste", auth, getListeExercices);

module.exports = router;