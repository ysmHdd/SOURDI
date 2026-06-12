const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");
const upload = require("../middleware/uploadMiddleware");

router.post("/chat", aiController.chatWithAssistant);

router.post(
  "/homework",
  upload.single("file"),
  aiController.analyzeHomework
);
router.post("/generate-image", aiController.generateImage);
router.post("/game/memory", aiController.generateMemoryGame);
router.post("/game/hangman", aiController.generateHangmanGame);
router.post("/game/speed", aiController.generateSpeedGame);

module.exports = router;