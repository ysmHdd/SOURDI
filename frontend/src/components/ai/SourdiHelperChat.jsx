import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  envoyerMessageIA,
  envoyerDevoirIA,
  genererImageIA,
  genererMemoryGameIA,
  genererHangmanGameIA,
  genererSpeedGameIA,
} from "../../api/aiApi";
import { FaRobot } from "react-icons/fa";
import "./sourdiHelperChat.css";

const KEY_ACTIONS = "sourdi_actions_cycle";

const enregistrerActiviteCoins = (nombre = 1) => {
  const current = Number(localStorage.getItem(KEY_ACTIONS) || 0);
  localStorage.setItem(KEY_ACTIONS, String(current + nombre));
};

const createNewChat = (newChatLabel = "Nouveau chat") => ({
  id: Date.now(),
  title: newChatLabel,
  messages: [
    {
      sender: "ai",
      text: "مرحبا 😊 أنا Sourdi Helper. نعاونك كان في القراية والتمارين.",
    },
  ],
  devoirTexte: "",
  questions: [],
  currentQuestionIndex: 0,
  completedQuestions: [],
});

const detecterLangue = (texte = "") => {
  const message = texte.toLowerCase();

  if (/[\u0600-\u06FF]/.test(message)) return "ar";

  const frenchWords = [
    "je veux",
    "crée",
    "cree",
    "créer",
    "creer",
    "génère",
    "genere",
    "dessine",
    "jeu",
    "pendu",
    "mémoire",
    "cartes",
    "sur les",
    "sur le",
    "sur la",
    "animaux",
    "couleurs",
    "école",
    "ecole",
    "français",
    "francais",
  ];

  const englishWords = [
    "i want",
    "create",
    "generate",
    "make",
    "game",
    "hangman",
    "memory",
    "cards",
    "about",
    "animals",
    "colors",
    "school",
    "english",
    "puzzle",
  ];

  const frenchScore = frenchWords.filter((word) =>
    message.includes(word)
  ).length;

  const englishScore = englishWords.filter((word) =>
    message.includes(word)
  ).length;

  if (frenchScore > englishScore) return "fr";
  if (englishScore > frenchScore) return "en";

  return "fr";
};

const estDemandeImage = (texte = "") => {
  const t = texte.toLowerCase();

  return (
    t.includes("generate image") ||
    t.includes("generate an image") ||
    t.includes("generate a poster") ||
    t.includes("generate for me") ||
    t.includes("create image") ||
    t.includes("create an image") ||
    t.includes("make me") ||
    t.includes("draw") ||
    t.includes("photo") ||
    t.includes("picture") ||
    t.includes("image") ||
    t.includes("image of") ||
    t.includes("generate") ||

    t.includes("dessine") ||
    t.includes("dessiner") ||
    t.includes("crée") ||
    t.includes("cree") ||
    t.includes("créer") ||
    t.includes("creer") ||
    t.includes("génère") ||
    t.includes("genere") ||
    t.includes("générer") ||
    t.includes("generer") ||
    t.includes("schéma") ||
    t.includes("schema") ||
    t.includes("illustration") ||
    t.includes("affiche") ||
// العربية
    t.includes("ارسم") ||
    t.includes("صورة") ||
    t.includes("رسم") ||
    t.includes("أنشئ") ||
    t.includes("انشئ") ||
    t.includes("أنشيء") ||
    t.includes("انشيء") ||
    t.includes("ولد صورة") ||
    t.includes("أنشئ صورة") ||
    t.includes("انشئ صورة") ||
    t.includes("صمم") ||
    t.includes("مخطط") ||
    t.includes("ملصق") ||
    t.includes("ملصقة")
  );
};

const extraireQuestionsDepuisTexte = (texte = "") => {
  const lines = texte
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^[a-d]\)\s*\d+\s*[+\-×x*/]\s*\d+\s*=/.test(line)) {
      questions.push(line);
      continue;
    }

    if (/^[a-d]\)\s*\d+(,\s*\d+)+.*___/.test(line)) {
      questions.push(line);
      continue;
    }

    if (/^[a-d]\)\s*Combien/i.test(line)) {
      questions.push(line);
      continue;
    }

    if (/^[a-d]\)\s+/.test(line)) {
      let block = line;

      while (
        i + 1 < lines.length &&
        !/^[a-d]\)\s+/.test(lines[i + 1]) &&
        !/^\d+\./.test(lines[i + 1]) &&
        !/Bon courage/i.test(lines[i + 1])
      ) {
        i++;

        if (!/^Réponse\s*:/i.test(lines[i])) {
          block += " " + lines[i];
        }
      }

      questions.push(block);
    }
  }

  return questions;
};

const creerPreviewFichier = (file) => {
  if (!file) return null;

  return {
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file),
    isImage: file.type.startsWith("image/"),
    isPdf: file.type === "application/pdf",
  };
};

const SourdiHelperChat = ({ student }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [gameModal, setGameModal] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [hangmanWord, setHangmanWord] = useState("SCHOOL");
  const [hangmanLetters, setHangmanLetters] = useState([]);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gamePrompt, setGamePrompt] = useState("");
  const [gameLoading, setGameLoading] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [hangmanHint, setHangmanHint] = useState("");
  const [puzzleImage, setPuzzleImage] = useState("");
  const [puzzleSize, setPuzzleSize] = useState(3);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [selectedPuzzlePiece, setSelectedPuzzlePiece] = useState(null);
  const [hangmanAlphabet, setHangmanAlphabet] = useState([]);
  const [speedQuestions, setSpeedQuestions] = useState([]);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState(30);
  const [speedFinished, setSpeedFinished] = useState(false);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("sourdiChats");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [createNewChat()];
      }
    }

    return [createNewChat()];
  });

  const [activeChatId, setActiveChatId] = useState(chats[0]?.id);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) || chats[0];

  const niveau =
    student?.grade || student?.params?.grade || student?.niveau || "primaire";

  useEffect(() => {
    try {
      const chatsWithoutImages = chats.map((chat) => ({
        ...chat,
        messages: chat.messages.map((msg) => ({
          ...msg,
          image: undefined,
        })),
      }));

      localStorage.setItem("sourdiChats", JSON.stringify(chatsWithoutImages));
    } catch (error) {
      console.warn("Impossible de sauvegarder sourdiChats:", error);
    }
  }, [chats]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto",
        });
      }, 100);
    }
  }, [open, activeChat?.messages.length, loading]);

  useEffect(() => {
    if (activeGame !== "speed" || speedFinished) return;

    if (speedTimeLeft <= 0) {
      setSpeedFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setSpeedTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeGame, speedTimeLeft, speedFinished]);

  const updateCurrentChat = (updater) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        if (typeof updater === "function") return updater(chat);
        return { ...chat, ...updater };
      })
    );
  };

  const addMessage = (msg) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, msg] }
          : chat
      )
    );
  };

  const createChat = () => {
    enregistrerActiviteCoins();

    const newChat = createNewChat(t("chatbot.nouveauChat").replace("+ ", ""));
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessage("");
    setFichier(null);
  };

  const deleteChat = (chatId) => {
    enregistrerActiviteCoins();

    setChats((prev) => {
      const filtered = prev.filter((chat) => chat.id !== chatId);

      if (filtered.length === 0) {
        const newChat = createNewChat();
        setActiveChatId(newChat.id);
        return [newChat];
      }

      if (activeChatId === chatId) {
        setActiveChatId(filtered[0].id);
      }

      return filtered;
    });
  };

  const resetConversation = () => {
    enregistrerActiviteCoins();

    updateCurrentChat({
      title: t("chatbot.nouveauChat").replace("+ ", ""),
      devoirTexte: "",
      questions: [],
      currentQuestionIndex: 0,
      completedQuestions: [],
      messages: createNewChat(t("chatbot.nouveauChat").replace("+ ", "")).messages,
    });

    setMessage("");
    setFichier(null);
  };

  const creerHistorique = () => {
    return (activeChat?.messages || []).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text || "",
    }));
  };

  const choisirFichier = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const typesAutorises = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!typesAutorises.includes(selectedFile.type)) {
      alert(t("chatbot.pdfOnly"));
      return;
    }

    enregistrerActiviteCoins();
    setFichier(selectedFile);
    event.target.value = "";
  };

  const estDemandeSuivante = (texte = "") => {
    const t = texte.toLowerCase().trim();

    return [
      "next",
      "next question",
      "continue",
      "السؤال التالي",
      "السؤال الموالي",
      "اي",
      "نعم",
      "oui",
      "yes",
      "ey",
      "السال التالي",
      "السؤال الجاي",
      "الموالي",
      "التالي",
      "next one",
    ].includes(t);
  };

  const telechargerImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `sourdi-image-${Date.now()}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erreur téléchargement image:", error);
      alert(t("chatbot.imageErreur"));
    }
  };

  const lireMessage = (texte = "") => {
    if (!texte.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texte);

    const langue = detecterLangue(texte);

    if (langue === "ar") utterance.lang = "ar-TN";
    else if (langue === "fr") utterance.lang = "fr-FR";
    else utterance.lang = "en-US";

    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const estDemandeJeu = (texte = "") => {
    const t = texte.toLowerCase();

    return (
      t.includes("game") ||
      t.includes("jeu") ||
      t.includes("لعبة") ||
      t.includes("hangman") ||
      t.includes("pendu") ||
      t.includes("memory") ||
      t.includes("cartes") ||
      t.includes("puzzle") ||
      t.includes("بازل") ||
      t.includes("تركيب")
    );
  };

  const getOpenGameMessage = (prompt = "") => {
    const lang = detecterLangue(prompt);

    if (lang === "ar") {
      return "اختر لعبة تعليمية ذكية. سأقوم بإنشائها بكلمات جديدة.";
    }

    if (lang === "en") {
      return "Choose an intelligent educational game. I will create it with new words.";
    }

    return "Choisis un jeu éducatif intelligent. Je vais le créer avec de nouveaux mots.";
  };

  const ouvrirJeux = (prompt = "") => {
    setGamePrompt(prompt);
    setGameModal(true);
    setActiveGame(null);
    setGameData(null);

    addMessage({
      sender: "ai",
      text: getOpenGameMessage(prompt),
    });
  };

  const startHangman = async () => {
    try {
      setGameLoading(true);

      const langue = detecterLangue(gamePrompt);

      const response = await genererHangmanGameIA({
        prompt: gamePrompt || "educational hangman game for primary school",
        langue,
      });

      const game = response.data?.game;

      setGameData(game);
      setHangmanWord(game?.word || "SCHOOL");
      setHangmanHint(game?.hint || "");
      setHangmanAlphabet(game?.alphabet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
      setHangmanLetters([]);
      setActiveGame("hangman");
    } catch (error) {
      alert(t("chatbot.gameCreationHangman"));
    } finally {
      setGameLoading(false);
    }
  };

  const choisirLettre = (letter) => {
    if (!hangmanLetters.includes(letter)) {
      setHangmanLetters((prev) => [...prev, letter]);
    }
  };

  const getHangmanDisplay = () => {
    return hangmanWord
      .split("")
      .map((letter) => {
        if (letter === " ") return " ";
        return hangmanLetters.includes(letter) ? letter : "_";
      })
      .join(" ");
  };

  const startMemory = async () => {
    try {
      setGameLoading(true);

      const langue = detecterLangue(gamePrompt);

      const response = await genererMemoryGameIA({
        prompt: gamePrompt || "memory game about school vocabulary",
        langue,
      });

      const game = response.data?.game;
      const cards = game?.cards || [];

      const duplicatedCards = cards.flatMap((card, index) => [
        {
          id: `${index}-word`,
          pairId: index,
          type: "word",
          word: card.word,
          imageUrl: card.imageUrl,
        },
        {
          id: `${index}-image`,
          pairId: index,
          type: "image",
          word: card.word,
          imageUrl: `http://localhost:5007${card.imageUrl}`,
        },
      ]);

      const shuffled = duplicatedCards.sort(() => Math.random() - 0.5);

      setGameData(game);
      setMemoryCards(shuffled);
      setFlippedCards([]);
      setMatchedCards([]);
      setActiveGame("memory");
    } catch (error) {
      alert(t("chatbot.gameCreationMemory"));
    } finally {
      setGameLoading(false);
    }
  };

  const flipMemoryCard = (card) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.find((c) => c.id === card.id) ||
      matchedCards.includes(card.pairId)
    ) {
      return;
    }

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      if (newFlipped[0].pairId === newFlipped[1].pairId) {
        setMatchedCards((prev) => [...prev, card.pairId]);
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 800);
    }
  };

  const startSpeed = async () => {
    try {
      setGameLoading(true);

      const langue = detecterLangue(gamePrompt);

      const response = await genererSpeedGameIA({
        prompt: gamePrompt || "speed challenge for primary school",
        langue,
      });

      const game = response.data?.game;
      const questions = game?.questions || [];

      setGameData(game);
      setSpeedQuestions(questions);
      setSpeedIndex(0);
      setSpeedScore(0);
      setSpeedTimeLeft(game?.duration || 30);
      setSpeedFinished(false);
      setActiveGame("speed");
    } catch (error) {
      alert("Impossible de créer le Speed Challenge.");
    } finally {
      setGameLoading(false);
    }
  };

  const answerSpeedQuestion = (choice) => {
    if (speedFinished) return;

    const currentQuestion = speedQuestions[speedIndex];

    if (choice === currentQuestion?.answer) {
      setSpeedScore((prev) => prev + 1);
    }

    if (speedIndex >= speedQuestions.length - 1) {
      setSpeedFinished(true);
    } else {
      setSpeedIndex((prev) => prev + 1);
    }
  };

  const startPuzzle = async () => {
    try {
      setGameLoading(true);

      const enhancedPrompt = `Create a completely new educational illustration for children aged 7 to 12.

Topic: ${gamePrompt || "fun educational puzzle image"}

Requirements:
- Be highly creative.
- Never imitate previous images.
- Use different environments and colors every time.
- Add many cute elements.
- Use cartoon style.
- Make the image rich in details.
- Surprise the student.
- Avoid repetition.`;

      const response = await genererImageIA({
        prompt: enhancedPrompt,
      });

      const imageUrl = `http://localhost:5007${response.data?.imageUrl}`;

      setPuzzleImage(imageUrl);
      createPuzzlePieces(3, imageUrl);
      setActiveGame("puzzle");
    } catch (error) {
      alert("Impossible de créer le puzzle.");
    } finally {
      setGameLoading(false);
    }
  };

  const createPuzzlePieces = (size = 3, imageUrl = puzzleImage) => {
    const total = size * size;

    const pieces = Array.from({ length: total }, (_, index) => ({
      id: index,
      correctIndex: index,
    }));

    const shuffled = [...pieces].sort(() => Math.random() - 0.5);

    setPuzzleSize(size);
    setPuzzlePieces(shuffled);
    setSelectedPuzzlePiece(null);
  };

  const clickPuzzlePiece = (pieceIndex) => {
    if (selectedPuzzlePiece === null) {
      setSelectedPuzzlePiece(pieceIndex);
      return;
    }

    if (selectedPuzzlePiece === pieceIndex) {
      setSelectedPuzzlePiece(null);
      return;
    }

    setPuzzlePieces((prev) => {
      const newPieces = [...prev];

      const temp = newPieces[selectedPuzzlePiece];
      newPieces[selectedPuzzlePiece] = newPieces[pieceIndex];
      newPieces[pieceIndex] = temp;

      return newPieces;
    });

    setSelectedPuzzlePiece(null);
  };

  const puzzleSolved =
    puzzlePieces.length > 0 &&
    puzzlePieces.every((piece, index) => piece.correctIndex === index);

  const getGameLabels = () => {
    const lang = gameData?.language || detecterLangue(gamePrompt);

    if (lang === "ar") {
      return {
        title: "ألعاب تعليمية",
        choose: "اختر لعبة لتتعلم بطريقة ممتعة.",
        memory: "لعبة الذاكرة",
        hangman: "لعبة تخمين الكلمة",
        puzzle: "لعبة تركيب الصورة",
        puzzleInstruction: "ركّب الصورة بتبديل القطع.",
        pieces4: "4 قطع",
        pieces9: "9 قطع",
        pieces16: "16 قطعة",
        successPuzzle: "أحسنت! أنهيت البازل.",
        speed: "تحدي السرعة",
        speedResult: "النتيجة",
        loading: "جاري إنشاء لعبة ذكية...",
        hint: "تلميح",
        successWord: "أحسنت! لقد وجدت الكلمة.",
        successMemory: "أحسنت! وجدت كل البطاقات.",
        back: "العودة إلى الألعاب",
      };
    }

    if (lang === "en") {
      return {
        title: "Educational Games",
        choose: "Choose a game to learn while having fun.",
        memory: "Memory Cards",
        hangman: "Hangman",
        puzzle: "Puzzle Image",
        puzzleInstruction: "Rebuild the image by swapping the pieces.",
        pieces4: "4 pieces",
        pieces9: "9 pieces",
        pieces16: "16 pieces",
        successPuzzle: "Great! Puzzle completed.",
        speed: "Speed Challenge",
        speedResult: "Score",
        loading: "Creating an intelligent game...",
        hint: "Hint",
        successWord: "Great! You found the word.",
        successMemory: "Great! You found all the cards.",
        back: "Back to games",
      };
    }

    return {
      title: "Jeux éducatifs",
      choose: "Choisis un jeu pour apprendre en t'amusant.",
      memory: "Jeu de mémoire",
      hangman: "Jeu du pendu",
      puzzle: "Puzzle d'image",
      puzzleInstruction: "Recompose l'image en échangeant les morceaux.",
      pieces4: "4 pièces",
      pieces9: "9 pièces",
      pieces16: "16 pièces",
      successPuzzle: "Bravo ! Puzzle terminé.",
      speed: "Défi rapide",
      speedResult: "Score",
      loading: "Création du jeu intelligent...",
      hint: "Indice",
      successWord: "Bravo ! Tu as trouvé le mot.",
      successMemory: "Bravo ! Toutes les cartes sont trouvées.",
      back: "Retour aux jeux",
    };
  };

  const envoyerMessage = async () => {
    if ((!message.trim() && !fichier) || loading || !activeChat) return;

    enregistrerActiviteCoins(fichier ? 2 : 1);

    const currentMessage = message.trim();
    const langueDetectee = detecterLangue(currentMessage);
    const fichierAEnvoyer = fichier;
    const attachment = creerPreviewFichier(fichierAEnvoyer);

    addMessage({
      sender: "user",
      text: currentMessage || t("chatbot.expliquerFichier"),
      attachment,
    });

    setMessage("");

    try {
      setLoading(true);

      if (!fichierAEnvoyer && estDemandeJeu(currentMessage)) {
        ouvrirJeux(currentMessage);

        if (activeChat.title === t("chatbot.nouveauChat").replace("+ ", "") && currentMessage) {
          updateCurrentChat({
            title:
              currentMessage.length > 28
                ? `${currentMessage.slice(0, 28)}...`
                : currentMessage,
          });
        }

        return;
      }

      if (!fichierAEnvoyer && estDemandeImage(currentMessage)) {
        const response = await genererImageIA({
          prompt: currentMessage,
        });

        addMessage({
          sender: "ai",
          text: response.data?.description,
          imageUrl: `http://localhost:5007${response.data?.imageUrl}`,
          source: response.data?.source || "Gemini Image",
        });

        if (activeChat.title === t("chatbot.nouveauChat").replace("+ ", "") && currentMessage) {
          updateCurrentChat({
            title:
              currentMessage.length > 28
                ? `${currentMessage.slice(0, 28)}...`
                : currentMessage,
          });
        }

        return;
      }

      if (fichierAEnvoyer) {
        const formData = new FormData();

        formData.append("file", fichierAEnvoyer);
        formData.append(
          "question",
          currentMessage || t("chatbot.expliquerDevoir")
        );
        formData.append("niveau", niveau);
        formData.append("langue", langueDetectee);
        formData.append("historique", JSON.stringify(creerHistorique()));

        const response = await envoyerDevoirIA(formData);

        const extractedText = response.data?.extractedText || "";
        const questions = extraireQuestionsDepuisTexte(extractedText);

        console.log("QUESTIONS EXTRAITES:", questions);

        const aiText =
          response.data?.reponse || t("chatbot.analyseImpossible");

        updateCurrentChat((chat) => ({
          ...chat,
          title: fichierAEnvoyer.name,
          devoirTexte: extractedText,
          questions,
          currentQuestionIndex: 0,
          completedQuestions: [],
          messages: [
            ...chat.messages,
            {
              sender: "ai",
              text: aiText,
              source: response.data?.source || "Gemini",
            },
          ],
        }));

        setFichier(null);
      } else {
        const questions = activeChat.questions || [];
        const currentIndex = activeChat.currentQuestionIndex || 0;
        const currentQuestion = questions[currentIndex] || "";
        const nextQuestion = questions[currentIndex + 1] || "";

        const messagePourIA = activeChat.devoirTexte
          ? `
HOMEWORK CONTENT:
${activeChat.devoirTexte}

CURRENT QUESTION INDEX:
${currentIndex + 1}

CURRENT QUESTION:
${currentQuestion}

NEXT QUESTION:
${nextQuestion || "No next question"}

STUDENT MESSAGE:
${currentMessage}

IMPORTANT:
Answer using ONLY the HOMEWORK CONTENT above.
If the student answered the CURRENT QUESTION correctly, confirm briefly and ask the NEXT QUESTION.
If the student says "next", "next question", "continue", "oui", "yes", "اي", or "نعم", ask the NEXT QUESTION.
Do not repeat the CURRENT QUESTION if it is already answered.
Do not invent another exercise.
`
          : currentMessage;

        const response = await envoyerMessageIA({
          message: messagePourIA,
          historique: creerHistorique(),
          niveau,
          langue: langueDetectee,
        });

        const aiText = response.data?.reponse || t("chatbot.reponseImpossible");

        addMessage({
          sender: "ai",
          text: aiText,
          source: response.data?.source || "Gemini",
        });

        if (activeChat.devoirTexte) {
          const doitAvancer =
            estDemandeSuivante(currentMessage) ||
            /^\d+$/.test(currentMessage) ||
            currentMessage.length <= 10;

          if (doitAvancer && currentIndex < questions.length - 1) {
            enregistrerActiviteCoins();

            updateCurrentChat((chat) => ({
              ...chat,
              currentQuestionIndex: currentIndex + 1,
              completedQuestions: [
                ...(chat.completedQuestions || []),
                currentIndex,
              ],
            }));
          }
        }

        if (activeChat.title === t("chatbot.nouveauChat").replace("+ ", "") && currentMessage) {
          updateCurrentChat({
            title:
              currentMessage.length > 28
                ? `${currentMessage.slice(0, 28)}...`
                : currentMessage,
          });
        }
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        t("chatbot.erreurGenerale");

      addMessage({
        sender: "ai",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const gameLabels = getGameLabels();

  return (
    <>
      <button
        className="sourdi-floating-btn"
        onClick={() => {
          enregistrerActiviteCoins();
          setOpen(!open);
        }}
        type="button"
      >
        <FaRobot />
      </button>

      {open && (
        <div className={`sourdi-chatbox ${fullscreen ? "fullscreen" : ""}`}>
          <div className="sourdi-sidebar">
            <button className="new-chat-btn" type="button" onClick={createChat}>
              {t("chatbot.nouveauChat")}
            </button>

            <div className="chat-history">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-history-card ${
                    chat.id === activeChatId ? "active" : ""
                  }`}
                >
                  <button
                    className="chat-history-item"
                    type="button"
                    onClick={() => {
                      enregistrerActiviteCoins();
                      setActiveChatId(chat.id);
                    }}
                  >
                    {chat.title}
                  </button>

                  <button
                    className="delete-chat-btn"
                    type="button"
                    title={t("chatbot.supprimerChat")}
                    onClick={() => deleteChat(chat.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sourdi-main">
            <div className="sourdi-header">
              <div className="sourdi-header-left">
                <div className="sourdi-avatar">
                  <FaRobot />
                </div>

                <div>
                  <h3>{t("chatbot.assistantTitre")}</h3>
                  <p>{t("chatbot.assistantSousTitre")}</p>
                </div>
              </div>

              <div className="sourdi-header-actions">
                <button
                  className="sourdi-reset-btn"
                  type="button"
                  onClick={resetConversation}
                  title={t("chatbot.viderChat")}
                >
                  🗑️
                </button>

                <button
                  className="sourdi-reset-btn"
                  type="button"
                  onClick={() => {
                    enregistrerActiviteCoins();
                    setFullscreen(!fullscreen);
                  }}
                  title={t("chatbot.agrandir")}
                >
                  {fullscreen ? "🗕" : "🗖"}
                </button>

                <button
                  className="sourdi-close-btn"
                  type="button"
                  onClick={() => {
                    enregistrerActiviteCoins();
                    setOpen(false);
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="sourdi-messages">
              {(activeChat?.messages || []).map((msg, index) => (
                <div key={index} className={`message-row ${msg.sender}`}>
                  {msg.sender === "ai" && (
                    <div className="mini-avatar">
                      <FaRobot />
                    </div>
                  )}

                  <div className={`message-bubble ${msg.sender}`}>
                    {msg.attachment && (
                      <div className="message-file-card">
                        {msg.attachment.isImage ? (
                          <img
                            src={msg.attachment.url}
                            alt={msg.attachment.name}
                          />
                        ) : (
                          <div className="pdf-preview">📄 PDF</div>
                        )}

                        <div className="file-name">{msg.attachment.name}</div>

                        <a
                          href={msg.attachment.url}
                          download={msg.attachment.name}
                          className="file-download-btn"
                          onClick={enregistrerActiviteCoins}
                        >
                          {t("chatbot.telecharger")}
                        </a>
                      </div>
                    )}

                    {msg.text && <div>{msg.text}</div>}

                    {msg.sender === "ai" && msg.text && (
                      <button
                        type="button"
                        className="sourdi-listen-btn"
                        onClick={() => lireMessage(msg.text)}
                      >
                        🔊 {t("chatbot.ecouter")}
                      </button>
                    )}

                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt={t("chatbot.imageGeneree")}
                        className="sourdi-generated-image"
                        onClick={() => setImagePreview(msg.imageUrl)}
                      />
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row ai">
                  <div className="mini-avatar">
                    <FaRobot />
                  </div>

                  <div className="message-bubble ai typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            {fichier && (
              <div className="sourdi-file-preview">
                <span>📎 {fichier.name}</span>

                <button
                  type="button"
                  onClick={() => {
                    enregistrerActiviteCoins();
                    setFichier(null);
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <div className="sourdi-input-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                hidden
                onChange={choisirFichier}
              />

              <button
                className="sourdi-attach-btn"
                type="button"
                disabled={loading}
                onClick={() => {
                  enregistrerActiviteCoins();
                  fileInputRef.current?.click();
                }}
              >
                📎
              </button>

              <input
                type="text"
                placeholder={t("chatbot.placeholderQuestion")}
                value={message}
                disabled={loading}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") envoyerMessage();
                }}
              />

              <button
                className="sourdi-send-btn"
                type="button"
                disabled={loading}
                onClick={envoyerMessage}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="sourdi-image-modal" onClick={() => setImagePreview(null)}>
          <div className="sourdi-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="sourdi-image-close"
              onClick={() => setImagePreview(null)}
            >
              ×
            </button>

            <img src={imagePreview} alt={t("chatbot.imageAgrandie")} />

            <button
              type="button"
              className="sourdi-image-download"
              onClick={() => telechargerImage(imagePreview)}
            >
              {t("chatbot.telecharger")}
            </button>
          </div>
        </div>
      )}

      {gameModal && (
        <div className="sourdi-game-modal" onClick={() => setGameModal(false)}>
          <div
            className="sourdi-game-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sourdi-game-close"
              onClick={() => setGameModal(false)}
            >
              ×
            </button>

            <h2>{gameLabels.title}</h2>
            <p>{gameLabels.choose}</p>

            {gameLoading && (
              <div className="game-loading">
                {gameLabels.loading}
              </div>
            )}

            {!activeGame && (
              <div className="sourdi-game-menu">
                <button type="button" onClick={startHangman}>
                  {gameLabels.hangman}
                </button>

                <button type="button" onClick={startMemory}>
                  {gameLabels.memory}
                </button>

                <button type="button" onClick={startPuzzle}>
                  {gameLabels.puzzle}
                </button>

                <button type="button" onClick={startSpeed}>
                  {gameLabels.speed}
                </button>
              </div>
            )}

            {activeGame === "hangman" && (
              <div className="sourdi-hangman-game">
                <h3>{gameData?.title || "Devine le mot"}</h3>
                <p>{gameData?.instructions}</p>

                {hangmanHint && (
                  <div className="hangman-hint">
                    {gameLabels.hint} : {hangmanHint}
                  </div>
                )}

                <div className="hangman-word">{getHangmanDisplay()}</div>

                <div className="hangman-letters">
                  {hangmanAlphabet.map((letter) => (
                    <button
                      key={letter}
                      type="button"
                      disabled={hangmanLetters.includes(letter)}
                      onClick={() => choisirLettre(letter)}
                    >
                      {letter}
                    </button>
                  ))}
                </div>

                {!getHangmanDisplay().includes("_") && (
                  <div className="game-success">{gameLabels.successWord}</div>
                )}

                <button type="button" className="game-back-btn" onClick={() => setActiveGame(null)}>
                  {gameLabels.back}
                </button>
              </div>
            )}

            {activeGame === "memory" && (
              <div className="sourdi-memory-game">
                <h3>{gameData?.title || "Memory Cards"}</h3>
                <p>{gameData?.instructions}</p>

                <div className="memory-grid intelligent">
                  {memoryCards.map((card) => {
                    const isVisible =
                      flippedCards.find((c) => c.id === card.id) ||
                      matchedCards.includes(card.pairId);

                    return (
                      <button
                        key={card.id}
                        type="button"
                        className={`memory-card smart ${isVisible ? "visible" : ""}`}
                        onClick={() => flipMemoryCard(card)}
                      >
                        {isVisible ? (
                          card.type === "image" ? (
                            <img src={card.imageUrl} alt={card.word} />
                          ) : (
                            <span>{card.word}</span>
                          )
                        ) : (
                          "?"
                        )}
                      </button>
                    );
                  })}
                </div>

                {matchedCards.length === 4 && (
                  <div className="game-success">{gameLabels.successMemory}</div>
                )}

                <button type="button" className="game-back-btn" onClick={() => setActiveGame(null)}>
                  {gameLabels.back}
                </button>
              </div>
            )}

            {activeGame === "puzzle" && (
              <div className="sourdi-puzzle-game">
                <h3>{gameLabels.puzzle}</h3>
                <p>{gameLabels.puzzleInstruction}</p>

                <div className="puzzle-levels">
                  <button type="button" onClick={() => createPuzzlePieces(2)}>
                    {gameLabels.pieces4}
                  </button>
                  <button type="button" onClick={() => createPuzzlePieces(3)}>
                    {gameLabels.pieces9}
                  </button>
                  <button type="button" onClick={() => createPuzzlePieces(4)}>
                    {gameLabels.pieces16}
                  </button>
                </div>

                <div
                  className="puzzle-grid"
                  style={{
                    gridTemplateColumns: `repeat(${puzzleSize}, 1fr)`,
                  }}
                >
                  {puzzlePieces.map((piece, index) => {
                    const row = Math.floor(piece.correctIndex / puzzleSize);
                    const col = piece.correctIndex % puzzleSize;

                    return (
                      <button
                        key={piece.id}
                        type="button"
                        className={`puzzle-piece ${
                          selectedPuzzlePiece === index ? "selected" : ""
                        }`}
                        onClick={() => clickPuzzlePiece(index)}
                        style={{
                          backgroundImage: `url(${puzzleImage})`,
                          backgroundSize: `${puzzleSize * 100}% ${puzzleSize * 100}%`,
                          backgroundPosition: `${(col / (puzzleSize - 1)) * 100}% ${
                            (row / (puzzleSize - 1)) * 100
                          }%`,
                        }}
                      />
                    );
                  })}
                </div>

                {puzzleSolved && (
                  <div className="game-success">{gameLabels.successPuzzle}</div>
                )}

                <button type="button" className="game-back-btn" onClick={() => setActiveGame(null)}>
                  {gameLabels.back}
                </button>
              </div>
            )}

            {activeGame === "speed" && (
              <div className="sourdi-speed-game">
                <h3>{gameData?.title || gameLabels.speed}</h3>
                <p>{gameData?.instructions}</p>

                <div className="speed-topbar">
                  <div>⏱️ {speedTimeLeft}s</div>
                  <div>{gameLabels.speedResult}: {speedScore}/{speedQuestions.length}</div>
                </div>

                {!speedFinished && speedQuestions[speedIndex] && (
                  <>
                    <div className="speed-question">
                      {speedQuestions[speedIndex].question}
                    </div>

                    <div className="speed-choices">
                      {speedQuestions[speedIndex].choices.map((choice, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => answerSpeedQuestion(choice)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {speedFinished && (
                  <div
                    className={`speed-result ${
                      speedScore < 6
                        ? "bad"
                        : speedScore < 9
                        ? "average"
                        : "good"
                    }`}
                  >
                    {gameLabels.speedResult}: {speedScore}/{speedQuestions.length}
                  </div>
                )}

                <button
                  type="button"
                  className="game-back-btn"
                  onClick={() => setActiveGame(null)}
                >
                  {gameLabels.back}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SourdiHelperChat;