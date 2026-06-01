import { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import {
  getConversationsAdmin,
  getConversationAdmin,
  repondreConversationAdmin,
  terminerConversationAdmin,
} from "../../api/messageApi";
import "../../styles/adminLayout.css";
import "./messagesAdmin.css";

const FICHIER_BASE_URL = "http://localhost:5006";
const CONVERSATIONS_PAR_PAGE = 5;

const FichierMessage = ({ fichier }) => {
  const url = `${FICHIER_BASE_URL}${fichier.url}`;
  const isImage = (fichier.typeMime || "").startsWith("image/");

  const telechargerFichier = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur téléchargement");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const lien = document.createElement("a");
      lien.href = blobUrl;
      lien.download = fichier.nomOriginal || fichier.nomFichier || "fichier";
      document.body.appendChild(lien);
      lien.click();
      lien.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (erreur) {
      console.error(erreur);
      alert("Téléchargement impossible");
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

const MessagesAdmin = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationActive, setConversationActive] = useState(null);
  const [conversationActiveId, setConversationActiveId] = useState(null);
  const [contenu, setContenu] = useState("");
  const [fichiers, setFichiers] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [pageActuelle, setPageActuelle] = useState(1);
  const messagesRef = useRef(null);

  const statutLabel = {
    nouveau: "Nouveau",
    en_cours: "En cours",
    termine: "Terminé",
  };

  const ordreStatut = {
    nouveau: 0,
    en_cours: 1,
    termine: 2,
  };

  const conversationsTriees = [...conversations].sort((a, b) => {
    const statutA = ordreStatut[a.statut] ?? 3;
    const statutB = ordreStatut[b.statut] ?? 3;

    if (statutA !== statutB) return statutA - statutB;

    return new Date(b.dernierMessageDate) - new Date(a.dernierMessageDate);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(conversationsTriees.length / CONVERSATIONS_PAR_PAGE)
  );

  const conversationsPage = conversationsTriees.slice(
    (pageActuelle - 1) * CONVERSATIONS_PAR_PAGE,
    pageActuelle * CONVERSATIONS_PAR_PAGE
  );

  const chargerConversations = async () => {
    try {
      const res = await getConversationsAdmin();
      setConversations(res.data || []);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const ouvrirConversation = async (id) => {
    try {
      setConversationActiveId(id);

      const res = await getConversationAdmin(id);
      setConversationActive({
        ...res.data,
        messages: [...(res.data.messages || [])],
      });

      chargerConversations();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  useEffect(() => {
    chargerConversations();

    const interval = setInterval(chargerConversations, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!conversationActiveId) return;

    const chargerConversationActive = async () => {
      try {
        const res = await getConversationAdmin(conversationActiveId);

        setConversationActive({
          ...res.data,
          messages: [...(res.data.messages || [])],
        });
      } catch (erreur) {
        console.error(erreur);
      }
    };

    chargerConversationActive();

    const interval = setInterval(chargerConversationActive, 1000);

    return () => clearInterval(interval);
  }, [conversationActiveId]);

  useEffect(() => {
    if (pageActuelle > totalPages) {
      setPageActuelle(totalPages);
    }
  }, [pageActuelle, totalPages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversationActive?.messages]);

  const repondre = async (e) => {
    e.preventDefault();

    if (!conversationActiveId) return;
    if (!contenu.trim() && fichiers.length === 0) return;

    try {
      setChargement(true);

      const formData = new FormData();
      formData.append("contenu", contenu.trim());

      fichiers.forEach((fichier) => {
        formData.append("fichiers", fichier);
      });

      const res = await repondreConversationAdmin(conversationActiveId, formData);

      setConversationActive({
        ...res.data.conversation,
        messages: [...(res.data.conversation?.messages || [])],
      });

      setContenu("");
      setFichiers([]);

      const inputFile = document.getElementById("admin-message-files");
      if (inputFile) inputFile.value = "";

      chargerConversations();
    } catch (erreur) {
      console.error(erreur);
      alert(erreur.response?.data?.message || "Erreur d'envoi");
    } finally {
      setChargement(false);
    }
  };

  const gererToucheEntree = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!chargement && (contenu.trim() || fichiers.length > 0)) {
        repondre(e);
      }
    }
  };

  const terminer = async () => {
    if (!conversationActiveId) return;

    try {
      const res = await terminerConversationAdmin(conversationActiveId);

      setConversationActive({
        ...res.data.conversation,
        messages: [...(res.data.conversation?.messages || [])],
      });

      chargerConversations();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-top-card">
          <span className="admin-top-label">Messagerie</span>
          <h2 className="admin-main-title">Messages des élèves</h2>
          <p className="admin-main-subtitle">
            Réponds aux élèves, vois les nouveaux messages en premier, puis
            marque comme terminé.
          </p>
        </div>

        <div className="messages-admin-layout">
          <aside className="messages-admin-list">
            <div className="messages-admin-list-head">
              <h3>Élèves</h3>
              <span>{conversations.length}</span>
            </div>

            {conversations.length === 0 ? (
              <p className="messages-admin-empty">
                Aucun message pour le moment.
              </p>
            ) : (
              <>
                {conversationsPage.map((conv) => (
                  <button
                    key={conv._id}
                    type="button"
                    className={`messages-admin-student ${
                      conversationActiveId === conv._id ? "active" : ""
                    } ${conv.statut}`}
                    onClick={() => ouvrirConversation(conv._id)}
                  >
                    <div className="messages-admin-avatar">
                      {conv.etudiantAvatar?.url ? (
                        <img src={conv.etudiantAvatar.url} alt="Avatar élève" />
                      ) : (
                        (conv.etudiantNom || conv.etudiantEmail || "?")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div className="messages-admin-student-info">
                      <strong>{conv.etudiantNom}</strong>
                      <span>{conv.dernierMessage || "Fichier envoyé"}</span>
                    </div>

                    <small>{statutLabel[conv.statut] || conv.statut}</small>
                  </button>
                ))}

                {totalPages > 1 && (
                  <div className="messages-admin-pagination">
                    <button
                      type="button"
                      disabled={pageActuelle === 1}
                      onClick={() => setPageActuelle((p) => p - 1)}
                    >
                      ←
                    </button>

                    <span>
                      {pageActuelle} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={pageActuelle === totalPages}
                      onClick={() => setPageActuelle((p) => p + 1)}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>

          <section className="messages-admin-chat">
            {!conversationActive ? (
              <div className="messages-admin-placeholder">
                <div>💬</div>
                <h3>Choisis un élève</h3>
                <p>La conversation apparaîtra ici.</p>
              </div>
            ) : (
              <>
                <div className="messages-admin-chat-head">
                  <div>
                    <h3>
                      {conversationActive.etudiantNom ||
                        conversationActive.etudiantEmail}
                    </h3>
                    <p>{conversationActive.etudiantEmail}</p>
                  </div>

                  <button
                    type="button"
                    className="messages-admin-done-btn"
                    onClick={terminer}
                    disabled={conversationActive.statut === "termine"}
                  >
                    {conversationActive.statut === "termine"
                      ? "Terminé"
                      : "Done"}
                  </button>
                </div>

                <div className="messages-admin-messages" ref={messagesRef}>
                  {conversationActive.messages?.map((message) => (
                    <div
                      key={message._id}
                      className={`messages-admin-message ${
                        message.expediteurRole === "admin" ? "admin" : "eleve"
                      }`}
                    >
                      <div className="messages-admin-bubble">
                        {message.contenu && <p>{message.contenu}</p>}

                        {message.fichiers?.length > 0 && (
                          <div className="messages-admin-files">
                            {message.fichiers.map((fichier, index) => (
                              <FichierMessage key={index} fichier={fichier} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form className="messages-admin-form" onSubmit={repondre}>
                  <textarea
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    onKeyDown={gererToucheEntree}
                    placeholder="Répondre à l'élève..."
                    rows="3"
                  />

                  <div className="messages-admin-actions">
                    <label className="messages-admin-file-btn">
                      📎 Ajouter fichier
                      <input
                        id="admin-message-files"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                        onChange={(e) =>
                          setFichiers(Array.from(e.target.files))
                        }
                      />
                    </label>

                    {fichiers.length > 0 && (
                      <span>{fichiers.length} fichier(s)</span>
                    )}

                    <button type="submit" disabled={chargement}>
                      {chargement ? "Envoi..." : "Répondre"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MessagesAdmin;