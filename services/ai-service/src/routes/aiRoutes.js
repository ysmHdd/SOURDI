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

module.exports = router;