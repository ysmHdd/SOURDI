const { PDFParse } = require("pdf-parse");
const Tesseract = require("tesseract.js");

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
      const parser = new PDFParse({
        url: req.file.path,
      });

      const pdfData = await parser.getText();

      extractedText = pdfData.text || "PDF vide";

      await parser.destroy();
    }

    if (req.file.mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(req.file.path, "fra+eng", {
        logger: () => {},
      });

      extractedText =
        result.data?.text?.trim() || "Aucun texte lisible dans l'image.";
    }

    console.log("OCR / PDF TEXT:");
    console.log(extractedText);

    const reponse = await aiService.generateHomeworkAnswer({
      extractedText,
      question,
      niveau,
      langue,
    });

    res.status(200).json({
      success: true,
      reponse,
      extractedText,
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