import { useState } from "react";
import { envoyerMessageIA } from "../../api/aiApi";

import "./sourdiHelperChat.css";

const detecterLangue = (texte) => {
  const message = texte.toLowerCase();

  if (/[\u0600-\u06FF]/.test(message)) return "ar";

  if (
    message.includes("frensh") ||
    message.includes("french") ||
    message.includes("français") ||
    message.includes("francais") ||
    message.includes("traduire") ||
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

const SourdiHelperChat = ({ student }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "مرحبا 😊 أنا Sourdi Helper. اسألني على أي حاجة ما فهمتها في القراية.",
    },
  ]);

  const envoyerMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message.trim();
    const langueDetectee = detecterLangue(currentMessage);

    const historique = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");

    try {
      setLoading(true);

      const response = await envoyerMessageIA({
        message: currentMessage,
        historique,
        niveau:
          student?.grade ||
          student?.params?.grade ||
          student?.niveau ||
          "primaire",
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
        <div className="sourdi-chatbox">
          <div className="sourdi-header">
  <div className="sourdi-header-left">
    <div className="sourdi-avatar">🤖</div>

    <div>
      <h3>Sourdi Helper</h3>
      <p>Assistant scolaire</p>
    </div>
  </div>

  <div className="sourdi-header-actions">
    <button
      className="sourdi-reset-btn"
      type="button"
      onClick={() => {
        setMessages([
          {
            sender: "ai",
            text: "مرحبا 😊 أنا Sourdi Helper. اسألني على أي حاجة ما فهمتها في القراية.",
          },
        ]);
      }}
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
              <div key={index} className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="message-bubble ai typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="sourdi-input-area">
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

            <button onClick={envoyerMessage} disabled={loading} type="button">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SourdiHelperChat;