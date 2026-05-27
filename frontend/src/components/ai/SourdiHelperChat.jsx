<<<<<<< HEAD
import { useRef, useState } from "react";
=======
import { useEffect, useRef, useState } from "react";
>>>>>>> origin/notifcalendrier
import { envoyerMessageIA, envoyerDevoirIA } from "../../api/aiApi";

import "./sourdiHelperChat.css";

<<<<<<< HEAD
const messageInitial = {
  sender: "ai",
  text: "مرحبا 😊 أنا Sourdi Helper. اسألني على أي حاجة ما فهمتها في القراية.",
};
=======
const createNewChat = () => ({
  id: Date.now(),
  title: "Nouveau chat",
  messages: [
    {
      sender: "ai",
      text: "مرحبا 😊 أنا Sourdi Helper. اسألني على أي حاجة ما فهمتها في القراية.",
    },
  ],
  devoirTexte: "",
});
>>>>>>> origin/notifcalendrier

const detecterLangue = (texte) => {
  const message = texte.toLowerCase();

  if (/[\u0600-\u06FF]/.test(message)) return "ar";

  if (
    message.includes("frensh") ||
    message.includes("french") ||
    message.includes("français") ||
    message.includes("francais") ||
<<<<<<< HEAD
    message.includes("traduire") ||
=======
>>>>>>> origin/notifcalendrier
    message.includes("bonjour") ||
    message.includes("salut") ||
    message.includes("merci")
  ) {
    return "fr";
  }

  if (
    message.includes("english") ||
    message.includes("anglais") ||
<<<<<<< HEAD
    message.includes("aglai") ||
=======
>>>>>>> origin/notifcalendrier
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("translate")
  ) {
    return "en";
  }

  return "auto";
};

<<<<<<< HEAD
const creerHistorique = (messages) => {
  return messages
    .filter((msg) => !msg.hidden)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));
};

const SourdiHelperChat = ({ student }) => {
  const fileInputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [devoirTexte, setDevoirTexte] = useState("");

  const [messages, setMessages] = useState([messageInitial]);
=======
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
>>>>>>> origin/notifcalendrier

  const niveau =
    student?.grade || student?.params?.grade || student?.niveau || "primaire";

<<<<<<< HEAD
  const resetConversation = () => {
    setMessages([messageInitial]);
    setMessage("");
    setFichier(null);
    setDevoirTexte("");
  };

  const envoyerMessage = async () => {
    if ((!message.trim() && !fichier) || loading) return;

    const currentMessage = message.trim();
    const langueDetectee = detecterLangue(currentMessage);
    const historique = creerHistorique(messages);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: fichier
          ? `${currentMessage || "Explique ce fichier"}\n📎 ${fichier.name}`
          : currentMessage,
      },
    ]);

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

        const response = await envoyerDevoirIA(formData);
        const extractedText = response.data?.extractedText || "";

        setDevoirTexte(extractedText);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              response.data?.reponse ||
              "Désolé, je n'ai pas pu répondre maintenant.",
          },
        ]);

        setFichier(null);
      } else {
        const messagePourIA = devoirTexte
          ? `
HOMEWORK CONTENT:
${devoirTexte}

STUDENT MESSAGE:
${currentMessage}

IMPORTANT:
Answer using ONLY the HOMEWORK CONTENT above.
Do not invent another exercise.
If the student says "oui", continue with question 1 from the homework.
If the student says "q2", answer question 2 from the homework.
If the student gives an answer, check it against the current homework question.
`
          : currentMessage;

        const response = await envoyerMessageIA({
          message: messagePourIA,
          historique,
          niveau,
          langue: langueDetectee,
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              response.data?.reponse ||
              "Désolé, je n'ai pas pu répondre maintenant.",
          },
        ]);
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Une erreur est survenue. Réessaie encore une fois.",
        },
      ]);
    } finally {
      setLoading(false);
    }
=======
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

        return {
          ...chat,
          ...updater,
        };
      })
    );
  };

  const addMessage = (msg) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, msg],
            }
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
>>>>>>> origin/notifcalendrier
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

<<<<<<< HEAD
=======
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

        const response = await envoyerDevoirIA(formData);

        const extractedText = response.data?.extractedText || "";
        const aiText =
          response.data?.reponse || "Je n'ai pas pu analyser ce fichier.";

        updateCurrentChat((chat) => ({
          ...chat,
          title: fichier.name,
          devoirTexte: extractedText,
          messages: [
            ...chat.messages,
            {
              sender: "ai",
              text: aiText,
            },
          ],
        }));

        setFichier(null);
      } else {
        const messagePourIA = activeChat.devoirTexte
          ? `
HOMEWORK CONTENT:
${activeChat.devoirTexte}

STUDENT MESSAGE:
${currentMessage}

IMPORTANT:
Answer using ONLY the HOMEWORK CONTENT above.
Do not invent another exercise.
`
          : currentMessage;

        const response = await envoyerMessageIA({
          message: messagePourIA,
          historique: creerHistorique(),
          niveau,
          langue: langueDetectee,
        });

        addMessage({
          sender: "ai",
          text: response.data?.reponse || "Je n'ai pas pu répondre.",
        });

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

>>>>>>> origin/notifcalendrier
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
<<<<<<< HEAD
        <div className="sourdi-chatbox">
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
                title="Supprimer la conversation"
              >
                🗑️
              </button>

              <button
                className="sourdi-close-btn"
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
          </div>

          <div className="sourdi-messages">
            {messages.map((msg, index) => (
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
              onClick={() => fileInputRef.current.click()}
            >
              📎
            </button>

            <input
              type="text"
              placeholder="Pose ta question ou envoie un devoir..."
              value={message}
              disabled={loading}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") envoyerMessage();
              }}
            />

            <button
              className="sourdi-send-btn"
              onClick={envoyerMessage}
              disabled={loading}
              type="button"
            >
              ➤
            </button>
=======
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
                placeholder="Pose ta question..."
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
>>>>>>> origin/notifcalendrier
          </div>
        </div>
      )}
    </>
  );
};

export default SourdiHelperChat;