import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

const API_EX = "http://localhost:5004/api/exercices";
const API_COINS = "http://localhost:5005/api/coins";

const T = {
  fr: {
    titre: "Cours & Quiz",
    sousTitre: "Choisis une matière, lis ton cours PDF puis fais le quiz",
    retour: "← Retour",
    niveau: "Ton niveau",
    cours: "Cours disponibles",
    voirPdf: "Voir PDF",
    completer: "Cours terminé",
    quiz: "Quiz",
    commencer: "Commencer",
    historique: "Historique des quiz",
    autoEval: "Auto-évaluation",
    envoyer: "Envoyer",
    note: "Note /100",
    supprimer: "Supprimer",
    aucunCours: "Aucun cours pour cette matière.",
    aucunQuiz: "Aucun quiz pour ce cours.",
    terminerQuizAvantCours:
      "Termine tous les quiz avant de compléter le cours",
    matieres: {
      maths: "Mathématiques",
      francais: "Français",
      anglais: "Anglais",
      arabe: "Arabe",
      sciences: "Sciences",
      histoire: "Histoire",
      education_islamique: "Éducation islamique",
    },
  },
  en: {
    titre: "Lessons & Quizzes",
    sousTitre: "Choose a subject, read the PDF lesson, then take the quiz",
    retour: "← Back",
    niveau: "Your level",
    cours: "Available lessons",
    voirPdf: "Open PDF",
    completer: "Complete lesson",
    quiz: "Quiz",
    commencer: "Start",
    historique: "Quiz history",
    autoEval: "Self-evaluation",
    envoyer: "Send",
    note: "Score /100",
    supprimer: "Delete",
    aucunCours: "No lessons for this subject.",
    aucunQuiz: "No quiz for this lesson.",
    terminerQuizAvantCours:
      "Finish all quizzes before completing the lesson",
    matieres: {
      maths: "Mathematics",
      francais: "French",
      anglais: "English",
      arabe: "Arabic",
      sciences: "Science",
      histoire: "History",
      education_islamique: "Islamic education",
    },
  },
};

const MATIERE_CONFIG = {
  maths: { color: "#FF7043", icon: "∑" },
  francais: { color: "#AB47BC", icon: "📖" },
  anglais: { color: "#5C6BC0", icon: "ABC" },
  arabe: { color: "#EF5350", icon: "ع" },
  sciences: { color: "#26C6DA", icon: "🔬" },
  histoire: { color: "#66BB6A", icon: "🗺" },
  education_islamique: { color: "#FFA726", icon: "☪" },
};

const getNiveauFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return 1;

    const decoded = JSON.parse(atob(token.split(".")[1]));

    const raw =
      decoded.niveau ||
      decoded.grade ||
      decoded.classe ||
      decoded.niveauScolaire ||
      1;

    if (typeof raw === "number") return raw;

    const text = String(raw).toLowerCase().trim();

    if (text.includes("1")) return 1;
    if (text.includes("2")) return 2;
    if (text.includes("3")) return 3;
    if (text.includes("4")) return 4;
    if (text.includes("5")) return 5;
    if (text.includes("6")) return 6;

    return 1;
  } catch {
    return 1;
  }
};

export default function Selection() {
  const navigate = useNavigate();
  const [lang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");

  const [matieres, setMatieres] = useState([]);
  const [matiereSelected, setMatiereSelected] = useState("maths");
  const [cours, setCours] = useState([]);
  const [quizParCours, setQuizParCours] = useState({});
  const [historique, setHistorique] = useState([]);

  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loadingCours, setLoadingCours] = useState(false);

  const t = T[lang];
  const niveau = getNiveauFromToken();

  const afficherMessage = (txt) => {
    setMessage(txt);
    setTimeout(() => setMessage(""), 3500);
  };

  const chargerMatieres = async () => {
    try {
      const res = await axios.get(`${API_EX}/matieres`);
      setMatieres(res.data || []);
      if (res.data?.length > 0) setMatiereSelected(res.data[0]);
    } catch (err) {
      console.error(err);
      afficherMessage("Erreur chargement matières");
    }
  };

  const chargerCours = async (matiere) => {
    if (!matiere) return;
    setLoadingCours(true);

    try {
      const res = await axios.get(
        `${API_EX}/cours?matiere=${matiere}&niveau=${niveau}`
      );
      setCours(res.data || []);

      const map = {};
      for (const c of res.data || []) {
        try {
          const qRes = await axios.get(`${API_EX}/cours/${c._id}/quiz`);
          map[c._id] = qRes.data || [];
        } catch {
          map[c._id] = [];
        }
      }
      setQuizParCours(map);
    } catch (err) {
      console.error(err);
      setCours([]);
      afficherMessage("Erreur chargement cours");
    }

    setLoadingCours(false);
  };

  const chargerHistorique = async () => {
    try {
      const res = await axios.get(`${API_EX}/historique`);
      setHistorique(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const supprimerHistorique = async (id) => {
    if (!window.confirm("Supprimer ce résultat de l'historique ?")) return;

    try {
      await axios.delete(`${API_EX}/historique/${id}`);
      setHistorique((prev) => prev.filter((h) => h._id !== id));
      afficherMessage("Historique supprimé");
    } catch (err) {
      afficherMessage(
        err.response?.data?.message || "Erreur suppression historique"
      );
    }
  };

  const coursQuizTermines = (coursId) => {
    const quizDuCours = quizParCours[coursId] || [];

    if (quizDuCours.length === 0) return false;

    return quizDuCours.every((q) =>
      historique.some(
        (h) =>
          h.quizId?._id === q._id ||
          h.quizId === q._id ||
          String(h.quizId?._id) === String(q._id) ||
          String(h.quizId) === String(q._id)
      )
    );
  };

  const completerCours = async (coursId) => {
    if (!coursQuizTermines(coursId)) {
      afficherMessage(t.terminerQuizAvantCours);
      return;
    }

    try {
      const res = await axios.post(`${API_EX}/cours/${coursId}/completer`);
      afficherMessage(
        res.data?.dejaComplete
          ? "Cours déjà complété"
          : `Cours complété ! +${res.data?.coinsGagnes || 0} coins`
      );
    } catch (err) {
      afficherMessage(err.response?.data?.message || "Erreur cours terminé");
    }
  };

  const faireAutoEvaluation = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_EX}/auto-evaluation`, {
        note: Number(note),
        niveau,
      });

      setNote("");
      afficherMessage("Auto-évaluation enregistrée !");
    } catch (err) {
      afficherMessage(err.response?.data?.message || "Erreur auto-évaluation");
    }
  };

  useEffect(() => {
    chargerMatieres();
    chargerHistorique();

    const interval = setInterval(() => {
      axios.post(`${API_COINS}/temps`, { minutes: 1 }).catch(() => {});
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chargerCours(matiereSelected);
  }, [matiereSelected]);

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <header className="ex-header">
        <button className="ex-back-btn" onClick={() => navigate("/eleve")}>
          {t.retour}
        </button>
        <span className="ex-logo">SOURDI</span>
        <span className="ex-niveau">
          {t.niveau} : <strong>{niveau}</strong>
        </span>
      </header>

      <main className="ex-main">
        <section className="ex-page-title">
          <h1>{t.titre}</h1>
          <p>{t.sousTitre}</p>
        </section>

        {message && <div className="ex-message">{message}</div>}

        <section className="ex-matieres-grid">
          {matieres.map((m) => {
            const cfg = MATIERE_CONFIG[m] || { color: "#AB47BC", icon: "📚" };
            return (
              <button
                key={m}
                className={`ex-matiere-card ${
                  matiereSelected === m ? "active" : ""
                }`}
                style={{ "--accent": cfg.color }}
                onClick={() => setMatiereSelected(m)}
              >
                <span className="ex-matiere-icon">{cfg.icon}</span>
                <span className="ex-matiere-name">{t.matieres[m] || m}</span>
              </button>
            );
          })}
        </section>

        <section className="ex-section">
          <h2>{t.cours}</h2>

          {loadingCours ? (
            <div className="ex-loading">Chargement...</div>
          ) : cours.length === 0 ? (
            <div className="ex-empty">{t.aucunCours}</div>
          ) : (
            <div className="ex-cours-grid">
              {cours.map((c) => {
                const quizTermines = coursQuizTermines(c._id);

                return (
                  <article key={c._id} className="ex-cours-card">
                    <div className="ex-cours-top">
                      <span className="ex-cours-badge">
                        {t.matieres[c.matiere] || c.matiere}
                      </span>
                      <span className="ex-cours-coins">
                        +{c.coinsCompletion || 20} coins
                      </span>
                    </div>

                    <h3>{c.titre}</h3>
                    <p>{c.description || "Aucune description"}</p>

                    <div className="ex-cours-actions">
                      {c.pdfUrl && (
                        <a
                          className="ex-small-btn pdf"
                          href={`http://localhost:5004${c.pdfUrl}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.voirPdf}
                        </a>
                      )}

                      <button
                        className={`ex-small-btn done ${
                          !quizTermines ? "disabled" : ""
                        }`}
                        disabled={!quizTermines}
                        onClick={() => completerCours(c._id)}
                        title={!quizTermines ? t.terminerQuizAvantCours : ""}
                      >
                        {t.completer}
                      </button>
                    </div>

                    <div className="ex-quiz-list">
                      <h4>{t.quiz}</h4>

                      {(quizParCours[c._id] || []).length === 0 ? (
                        <p className="ex-mini-empty">{t.aucunQuiz}</p>
                      ) : (
                        (quizParCours[c._id] || []).map((q) => (
                          <div key={q._id} className="ex-quiz-row">
                            <span>{q.titre}</span>
                            <button
                              onClick={() =>
                                navigate("/eleve/exercices/quiz", {
                                  state: {
                                    coursId: c._id,
                                    quizId: q._id,
                                    coursTitre: c.titre,
                                    quizTitre: q.titre,
                                  },
                                })
                              }
                            >
                              {t.commencer}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="ex-section ex-two-cols">
          <div className="ex-panel">
            <h2>{t.autoEval}</h2>

            <form onSubmit={faireAutoEvaluation} className="ex-auto-form">
              <label>{t.note}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              />

              <button>{t.envoyer}</button>
            </form>
          </div>

          <div className="ex-panel">
            <h2>{t.historique}</h2>

            {historique.length === 0 ? (
              <p className="ex-mini-empty">Aucun résultat.</p>
            ) : (
              <div className="ex-history-list">
                {historique.map((h) => (
                  <div key={h._id} className="ex-history-item">
                    <div>
                      <strong>{h.quizId?.titre || "Quiz"}</strong>
                      <span>{h.coursId?.titre || h.matiere}</span>
                    </div>

                    <div>
                      <b>
                        {h.score}/{h.total}
                      </b>
                      <span>+{h.pointsGagnes || 0} coins</span>
                    </div>

                    <button
                      type="button"
                      className="ex-history-delete"
                      onClick={() => supprimerHistorique(h._id)}
                    >
                      {t.supprimer}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}