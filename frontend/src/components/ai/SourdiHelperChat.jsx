import { useEffect, useRef, useState } from "react";
import { envoyerMessageIA, envoyerDevoirIA } from "../../api/aiApi";
import "./sourdiHelperChat.css";

const createNewChat = () => ({
  id: Date.now(),
  title: "Nouveau chat",
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

  if (
    message.includes("frensh") ||
    message.includes("french") ||
    message.includes("français") ||
    message.includes("francais") ||
    message.includes("bonjour") ||
    message.includes("salut") ||
    message.includes("merci")
  ) {
    return "fr";
  }

  if (
    message.includes("english") ||
    message.includes("anglais") ||
    message.includes("aglai") ||
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("translate")
  ) {
    return "en";
  }

  return "auto";
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

const SourdiHelperChat = ({ student }) => {
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);

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
    localStorage.setItem("sourdiChats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, loading]);

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
    const newChat = createNewChat();
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessage("");
    setFichier(null);
  };

  const deleteChat = (chatId) => {
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
    updateCurrentChat({
      title: "Nouveau chat",
      devoirTexte: "",
      questions: [],
      currentQuestionIndex: 0,
      completedQuestions: [],
      messages: createNewChat().messages,
    });

    setMessage("");
    setFichier(null);
  };

  const creerHistorique = () => {
    return (activeChat?.messages || []).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
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
      alert("Tu peux envoyer seulement PDF ou image.");
      return;
    }

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

  const envoyerMessage = async () => {
    if ((!message.trim() && !fichier) || loading || !activeChat) return;

    const currentMessage = message.trim();
    const langueDetectee = detecterLangue(currentMessage);

    const userText = fichier
      ? `${currentMessage || "Explique ce fichier"}\n📎 ${fichier.name}`
      : currentMessage;

    addMessage({
      sender: "user",
      text: userText,
    });

    setMessage("");

    try {
      setLoading(true);

      if (fichier) {
        const formData = new FormData();

        formData.append("file", fichier);
        formData.append(
          "question",
          currentMessage || "Explique ce devoir simplement"
        );
        formData.append("niveau", niveau);
        formData.append("langue", langueDetectee);
        formData.append("historique", JSON.stringify(creerHistorique()));

        const response = await envoyerDevoirIA(formData);

        const extractedText = response.data?.extractedText || "";
        const questions = extraireQuestionsDepuisTexte(extractedText);

        console.log("QUESTIONS EXTRAITES:", questions);

        const aiText =
          response.data?.reponse || "Je n'ai pas pu analyser ce fichier.";

        updateCurrentChat((chat) => ({
          ...chat,
          title: fichier.name,
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

        const aiText = response.data?.reponse || "Je n'ai pas pu répondre.";

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

        if (activeChat.title === "Nouveau chat" && currentMessage) {
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

      addMessage({
        sender: "ai",
        text: "⚠️ Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="sourdi-floating-btn"
        onClick={() => setOpen(!open)}
        type="button"
      >
        🤖
      </button>

      {open && (
        <div className={`sourdi-chatbox ${fullscreen ? "fullscreen" : ""}`}>
          <div className="sourdi-sidebar">
            <button className="new-chat-btn" type="button" onClick={createChat}>
              + Nouveau chat
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
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    {chat.title}
                  </button>

                  <button
                    className="delete-chat-btn"
                    type="button"
                    title="Supprimer ce chat"
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
                <div className="sourdi-avatar">🤖</div>

                <div>
                  <h3>Sourdi Helper</h3>
                  <p>Assistant scolaire intelligent</p>
                </div>
              </div>

              <div className="sourdi-header-actions">
                <button
                  className="sourdi-reset-btn"
                  type="button"
                  onClick={resetConversation}
                  title="Vider ce chat"
                >
                  🗑️
                </button>

                <button
                  className="sourdi-reset-btn"
                  type="button"
                  onClick={() => setFullscreen(!fullscreen)}
                  title="Agrandir"
                >
                  {fullscreen ? "🗕" : "🗖"}
                </button>

                <button
                  className="sourdi-close-btn"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="sourdi-messages">
              {(activeChat?.messages || []).map((msg, index) => (
                <div key={index} className={`message-row ${msg.sender}`}>
                  {msg.sender === "ai" && <div className="mini-avatar">🤖</div>}

                  <div className={`message-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row ai">
                  <div className="mini-avatar">🤖</div>

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

                <button type="button" onClick={() => setFichier(null)}>
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
                onClick={() => fileInputRef.current?.click()}
              >
                📎
              </button>

              <input
                type="text"
                placeholder="Pose ta question de cours ou de devoir..."
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
    </>
  );
};

export default SourdiHelperChat;