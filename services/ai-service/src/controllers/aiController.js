const fs = require("fs");
const pdfParse = require("pdf-parse");

const aiService = require("../services/aiService");

const chatWithAssistant = async (req, res) => {
  try {
    const { message, historique, niveau, langue } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message requis",
      });
    }

    const reponse = await aiService.generateAnswer({
      message,
      historique: Array.isArray(historique) ? historique : [],
      niveau,
      langue,
    });

    res.status(200).json({
      success: true,
      reponse,
    });
  } catch (erreur) {
    console.error("Erreur IA Chat :", erreur);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération de la réponse IA",
      detail: erreur.message,
    });
  }
};

const analyzeHomework = async (req, res) => {
  try {
    const { niveau, langue, question } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Fichier requis",
      });
    }

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    }

    if (req.file.mimetype.startsWith("image/")) {
      extractedText =
        "L'élève a envoyé une image d'exercice ou de devoir. L'analyse visuelle complète n'est pas encore activée.";
    }

    const reponse = await aiService.generateHomeworkAnswer({
      extractedText,
      question,
      niveau,
      langue,
    });

    res.status(200).json({
      success: true,
      reponse,
    });
  } catch (erreur) {
    console.error("Erreur analyse devoir :", erreur);

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'analyse du devoir",
      detail: erreur.message,
    });
  }
};

module.exports = {
  chatWithAssistant,
  analyzeHomework,
};