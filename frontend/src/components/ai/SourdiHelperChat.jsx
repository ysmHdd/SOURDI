import { useRef, useState } from "react";
import { envoyerMessageIA, envoyerDevoirIA } from "../../api/aiApi";

import "./sourdiHelperChat.css";

const messageInitial = {
  sender: "ai",
  text: "مرحبا 😊 أنا Sourdi Helper. اسألني على أي حاجة ما فهمتها في القراية.",
};

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

  const niveau =
    student?.grade || student?.params?.grade || student?.niveau || "primaire";

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
          </div>
        </div>
      )}
    </>
  );
};

export default SourdiHelperChat;