const fs = require("fs");
const path = require("path");
const pdfParseModule = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const aiService = require("../services/aiService");
const cbrService = require("../services/cbrService");

const pdfParse = pdfParseModule.default || pdfParseModule;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const lirePdfAvecGemini = async (filePath, mimeType = "application/pdf") => {
  const buffer = fs.readFileSync(filePath);
  const base64Pdf = buffer.toString("base64");

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
Lis exactement le contenu visible de ce PDF d'exercice scolaire.
Ne change aucun nombre.
Ne devine pas.
Garde l'ordre des questions.
Retourne seulement le texte de l'exercice.
`,
          },
          {
            inlineData: {
              mimeType,
              data: base64Pdf,
            },
          },
        ],
      },
    ],
    config: {
      temperature: 0,
      maxOutputTokens: 1200,
    },
  });

  return response.text?.trim() || "";
};

const lirePdf = async (filePath, mimeType = "application/pdf") => {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text?.trim() || "";
  } catch (err) {
    console.error("pdf-parse failed, using Gemini PDF reader:", err.message);
    return await lirePdfAvecGemini(filePath, mimeType);
  }
};

const lireImageAvecGemini = async (filePath, mimeType) => {
  const buffer = fs.readFileSync(filePath);
  const base64Image = buffer.toString("base64");

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
Lis exactement le contenu visible de cette image d'exercice scolaire.
Ne change aucun nombre.
Ne devine pas.
Garde l'ordre des questions.
Retourne seulement le texte de l'exercice.
`,
          },
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    config: {
      temperature: 0,
      maxOutputTokens: 1000,
    },
  });

  return response.text?.trim() || "";
};

const extraireTexteDepuisFichier = async (file) => {
  if (!file) return "";

  if (file.mimetype === "application/pdf") {
    return await lirePdf(file.path, file.mimetype);
  }

  if (file.mimetype.startsWith("image/")) {
    return await lireImageAvecGemini(file.path, file.mimetype);
  }

  return "";
};

const safeParseHistorique = (historique) => {
  if (!historique) return [];

  if (Array.isArray(historique)) return historique;

  if (typeof historique === "string") {
    try {
      const parsed = JSON.parse(historique);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const chatWithAssistant = async (req, res) => {
  try {
    const { message, historique, niveau, langue } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message requis",
      });
    }

    const isHomeworkContext = message.includes("HOMEWORK CONTENT:");

    if (!isHomeworkContext) {
      const ancienneReponse = await cbrService.rechercherQuestionSimilaire(
        message
      );

      if (ancienneReponse) {
        ancienneReponse.utilisation += 1;
        await ancienneReponse.save();

        return res.status(200).json({
          success: true,
          reponse: ancienneReponse.answer,
          source: "CBR",
        });
      }
    }

    const reponse = await aiService.generateAnswer({
      message,
      historique: safeParseHistorique(historique),
      niveau,
      langue,
    });

    if (!isHomeworkContext) {
      await cbrService.sauvegarderQuestionReponse({
        question: message,
        answer: reponse,
        niveau,
        langue,
        type: "text",
      });
    }

    return res.status(200).json({
      success: true,
      reponse,
      source: "Gemini",
    });
  } catch (erreur) {
    console.error("Erreur IA Chat :", erreur);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la génération de la réponse IA",
      detail: erreur.message,
    });
  }
};

const analyzeHomework = async (req, res) => {
  try {
    const { niveau, langue, question, historique } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Fichier requis",
      });
    }

    const extractedText = await extraireTexteDepuisFichier(req.file);

    console.log("===== TEXT EXTRACTED FROM FILE =====");
    console.log(extractedText);
    console.log("====================================");

    if (!extractedText || extractedText.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Impossible de lire correctement le fichier",
        extractedText,
      });
    }

    const reponse = await aiService.generateHomeworkAnswer({
      extractedText,
      question: question || "Aide-moi à répondre à cet exercice.",
      historique: safeParseHistorique(historique),
      niveau,
      langue,
    });

    await cbrService.sauvegarderQuestionReponse({
      question: `${question || "Analyse devoir"}\n${extractedText}`.slice(
        0,
        1000
      ),
      answer: reponse,
      niveau,
      langue,
      type: req.file.mimetype === "application/pdf" ? "pdf" : "image",
    });

    return res.status(200).json({
      success: true,
      reponse,
      extractedText,
      source: req.file.mimetype === "application/pdf" ? "PDF/Gemini" : "Gemini Vision",
    });
  } catch (erreur) {
    console.error("Erreur analyse devoir :", erreur);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'analyse du devoir",
      detail: erreur.message,
    });
  }
};
const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt image requis",
      });
    }

    const result = await aiService.generateImage({ prompt });
    const description = await aiService.generateImageDescription({ prompt });

    const extension = result.mimeType === "image/jpeg" ? "jpg" : "png";
    const fileName = `generated-${Date.now()}.${extension}`;
    const filePath = path.join(__dirname, "../uploads", fileName);

    fs.writeFileSync(filePath, Buffer.from(result.image, "base64"));

    return res.status(200).json({
      success: true,
      imageUrl: `/uploads/${fileName}`,
      description,
      mimeType: result.mimeType,
      source: "Gemini Image",
    });
  } catch (erreur) {
    console.error("Erreur génération image :", erreur);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la génération de l'image",
      detail: erreur.message,
    });
  }
};

const saveBase64Image = (base64, mimeType = "image/png") => {
  const extension = mimeType === "image/jpeg" ? "jpg" : "png";
  const fileName = `game-${Date.now()}-${Math.round(Math.random() * 99999)}.${extension}`;
  const filePath = path.join(__dirname, "../uploads", fileName);

  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

  return `/uploads/${fileName}`;
};

const generateMemoryGame = async (req, res) => {
  try {
    const { prompt, langue } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt jeu requis",
      });
    }

    const gameData = await aiService.generateGameData({
      prompt,
      type: "memory",
      langue,
    });

    const generatedCards = [];

    for (const card of gameData.cards || []) {
      const imageResult = await aiService.generateImage({
        prompt: card.imagePrompt,
      });

      const imageUrl = saveBase64Image(
        imageResult.image,
        imageResult.mimeType
      );

      generatedCards.push({
        ...card,
        imageUrl,
      });
    }

    return res.status(200).json({
      success: true,
      game: {
        ...gameData,
        cards: generatedCards,
      },
    });
  } catch (erreur) {
    console.error("Erreur génération memory game :", erreur);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du jeu Memory",
      detail: erreur.message,
    });
  }
};

const generateHangmanGame = async (req, res) => {
  try {
    const { prompt, langue } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt jeu requis",
      });
    }

    const gameData = await aiService.generateGameData({
      prompt,
      type: "hangman",
      langue,
    });

    return res.status(200).json({
      success: true,
      game: gameData,
    });
  } catch (erreur) {
    console.error("Erreur génération hangman game :", erreur);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du jeu du pendu",
      detail: erreur.message,
    });
  }
};

const generateSpeedGame = async (req, res) => {
  try {
    const { prompt, langue } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt jeu requis",
      });
    }

    const gameData = await aiService.generateGameData({
      prompt,
      type: "speed",
      langue,
    });

    return res.status(200).json({
      success: true,
      game: gameData,
    });
  } catch (erreur) {
    console.error("Erreur génération speed game :", erreur);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du Speed Challenge",
      detail: erreur.message,
    });
  }
};

module.exports = {
  chatWithAssistant,
  analyzeHomework,
  generateImage,
  generateMemoryGame,
  generateHangmanGame,
  generateSpeedGame,
};