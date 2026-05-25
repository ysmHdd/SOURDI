import { useEffect, useRef, useState } from "react";
import {
  getConversationEleve,
  envoyerMessageEleve,
  supprimerMessagesEleve,
  signalerMessageEleve,
} from "../../api/messageApi";
import "./EleveMessageBox.css";

const FICHIER_BASE_URL = "http://localhost:5006";

const FichierMessage = ({ fichier }) => {
  const url = `${FICHIER_BASE_URL}${fichier.url}`;
  const isImage = (fichier.typeMime || "").startsWith("image/");

  const telechargerFichier = async () => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur téléchargement");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const lien = document.createElement("a");
      lien.href = blobUrl;
      lien.download = fichier.nomOriginal || "fichier";

      document.body.appendChild(lien);
      lien.click();
      lien.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  return (
    <div className="chat-file-preview">
      {isImage ? (
        <img src={url} alt={fichier.nomOriginal || "Image"} />
      ) : (
        <div className="chat-file-icon">📄</div>
      )}

      <div className="chat-file-info">
        <span>{fichier.nomOriginal || "Fichier"}</span>

        <button type="button" onClick={telechargerFichier}>
          Télécharger
        </button>
      </div>
    </div>
  );
};

const EleveMessageBox = () => {
  const [ouvert, setOuvert] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [contenu, setContenu] = useState("");
  const [fichiers, setFichiers] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [modalSuppression, setModalSuppression] = useState(false);
  const [modalSignalement, setModalSignalement] = useState(false);
  const [messageASignaler, setMessageASignaler] = useState(null);
  const [typeHarcelement, setTypeHarcelement] = useState("bad_words");
  const [detailsSignalement, setDetailsSignalement] = useState("");
  const [signalementEnvoye, setSignalementEnvoye] = useState(false);

  const messagesRef = useRef(null);

  const chargerConversation = async (marquerCommeLu = false) => {
    try {
      const res = await getConversationEleve(marquerCommeLu);
      setConversation(res.data);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  useEffect(() => {
    chargerConversation(false);

    const interval = setInterval(() => {
      chargerConversation(false);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ouvrirDepuisNotification = async () => {
      setOuvert(true);
      await chargerConversation(true);
    };

    window.addEventListener("ouvrir-message-box", ouvrirDepuisNotification);

    return () => {
      window.removeEventListener("ouvrir-message-box", ouvrirDepuisNotification);
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversation, ouvert]);

  const envoyer = async (e) => {
    e.preventDefault();

    if (!contenu.trim() && fichiers.length === 0) {
      return;
    }

    try {
      setChargement(true);

      const formData = new FormData();
      formData.append("contenu", contenu.trim());

      fichiers.forEach((fichier) => {
        formData.append("fichiers", fichier);
      });

      const res = await envoyerMessageEleve(formData);

      setConversation(res.data.conversation);
      setContenu("");
      setFichiers([]);

      const inputFile = document.getElementById("eleve-message-files");

      if (inputFile) {
        inputFile.value = "";
      }
    } catch (erreur) {
      console.error(erreur);
    } finally {
      setChargement(false);
    }
  };

  const supprimerTousLesMessages = async () => {
    try {
      const res = await supprimerMessagesEleve();

      setConversation(res.data.conversation);
      setModalSuppression(false);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const envoyerSignalement = async () => {
    if (!conversation?._id || !messageASignaler?._id) {
      return;
    }

    if (typeHarcelement === "other" && !detailsSignalement.trim()) {
      return;
    }

    try {
      await signalerMessageEleve(
        conversation._id,
        messageASignaler._id,
        typeHarcelement,
        detailsSignalement.trim()
      );

      setModalSignalement(false);
      setMessageASignaler(null);
      setTypeHarcelement("bad_words");
      setDetailsSignalement("");
      setSignalementEnvoye(true);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const ouvrirOuFermerChat = async () => {
    const prochainEtat = !ouvert;

    setOuvert(prochainEtat);

    if (prochainEtat) {
      await chargerConversation(true);
    }
  };

  const messages = conversation?.messages || [];

  const unreadAdminMessages = messages.filter(
    (message) => message.expediteurRole === "admin" && !message.luParEtudiant
  ).length;

  return (
    <div className="eleve-chat-wrapper">
      {ouvert && (
        <div className="eleve-chat-box">
          <div className="eleve-chat-header">
            <div>
              <h3>Support SOURDI</h3>

              <p>
                {conversation?.statut === "termine"
                  ? "Conversation terminée"
                  : "Un admin te répondra bientôt"}
              </p>
            </div>

            <div className="eleve-chat-header-actions">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="eleve-chat-delete-btn"
                  onClick={() => setModalSuppression(true)}
                >
                  🗑
                </button>
              )}

              <button type="button" onClick={() => setOuvert(false)}>
                ×
              </button>
            </div>
          </div>

          <div className="eleve-chat-messages" ref={messagesRef}>
            {messages.length === 0 ? (
              <div className="eleve-chat-empty">Écris ton message ici.</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`eleve-chat-message ${
                    message.expediteurRole === "etudiant" ? "mine" : "admin"
                  }`}
                >
                  <div className="eleve-chat-bubble">
                    {message.contenu && <p>{message.contenu}</p>}

                    {message.fichiers?.length > 0 && (
                      <div className="eleve-chat-files">
                        {message.fichiers.map((fichier, index) => (
                          <FichierMessage key={index} fichier={fichier} />
                        ))}
                      </div>
                    )}

                    {message.expediteurRole === "admin" && (
                      <button
                        type="button"
                        className="eleve-report-icon-btn"
                        title="Signaler ce message"
                        onClick={() => {
                          setMessageASignaler(message);
                          setModalSignalement(true);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="eleve-chat-form" onSubmit={envoyer}>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Écris ton message..."
              rows="2"
            />

            <div className="eleve-chat-actions">
              <label className="eleve-chat-file-btn">
                📎

                <input
                  id="eleve-message-files"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={(e) => setFichiers(Array.from(e.target.files))}
                />
              </label>

              {fichiers.length > 0 && (
                <span className="eleve-chat-file-count">
                  {fichiers.length} fichier(s)
                </span>
              )}

              <button type="submit" disabled={chargement}>
                {chargement ? "..." : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {modalSuppression && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">🗑</div>

            <h3>Supprimer les messages ?</h3>

            <p>Tous les messages seront supprimés de ton espace.</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => setModalSuppression(false)}
              >
                Annuler
              </button>

              <button
                type="button"
                className="delete-modal-confirm"
                onClick={supprimerTousLesMessages}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {modalSignalement && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <div className="report-modal-icon">⚠️</div>

            <h3>Signaler ce message</h3>

            <p>Choisis le type de problème.</p>

            <select
              value={typeHarcelement}
              onChange={(e) => {
                setTypeHarcelement(e.target.value);

                if (e.target.value !== "other") {
                  setDetailsSignalement("");
                }
              }}
            >
              <option value="bad_words">Mauvais mots</option>
              <option value="harassment">Harcèlement</option>
              <option value="sexual_harassment">Harcèlement sexuel</option>
              <option value="bullying">Intimidation</option>
              <option value="hate_speech">Discours haineux</option>
              <option value="spam">Spam</option>
              <option value="other">Autre</option>
            </select>

            {typeHarcelement === "other" && (
              <textarea
                className="report-modal-textarea"
                value={detailsSignalement}
                onChange={(e) => setDetailsSignalement(e.target.value)}
                placeholder="Explique le problème..."
                rows="3"
              />
            )}

            <div className="report-modal-actions">
              <button
                type="button"
                className="report-modal-cancel"
                onClick={() => {
                  setModalSignalement(false);
                  setDetailsSignalement("");
                }}
              >
                Annuler
              </button>

              <button
                type="button"
                className="report-modal-confirm"
                onClick={envoyerSignalement}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {signalementEnvoye && (
        <div className="report-modal-overlay">
          <div className="report-success-modal">
            <div className="report-success-icon">✓</div>

            <h3>Signalement envoyé</h3>

            <p>L'administration va examiner ce message.</p>

            <button type="button" onClick={() => setSignalementEnvoye(false)}>
              D'accord
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="eleve-chat-floating-btn"
        onClick={ouvrirOuFermerChat}
      >
        💬

        {!ouvert && unreadAdminMessages > 0 && (
          <span className="eleve-chat-badge" />
        )}
      </button>
    </div>
  );
};

export default EleveMessageBox;