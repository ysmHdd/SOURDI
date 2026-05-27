import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
<<<<<<< HEAD
=======
import { useAuth } from "../../../context/AuthContext";
>>>>>>> origin/notifcalendrier
import axios from "../../../api/axios";
import "./exercices.css";

const T = {
  fr: { question: "Question", suivant: "Suivant →", terminer: "Terminer", retour: "← Quitter", temps: "Temps" },
<<<<<<< HEAD
  en: { question: "Question", suivant: "Next →",    terminer: "Finish",   retour: "← Quit",    temps: "Time"  },
};

export default function Quiz() {
=======
  en: { question: "Question", suivant: "Next →", terminer: "Finish", retour: "← Quit", temps: "Time" },
};

export default function Quiz() {
  const { utilisateur } = useAuth();
>>>>>>> origin/notifcalendrier
  const navigate = useNavigate();
  const { state } = useLocation();
  const [lang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [exercices, setExercices] = useState([]);
<<<<<<< HEAD
  const [current, setCurrent]     = useState(0);
  const [reponses, setReponses]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [temps, setTemps]         = useState(0);
  const [loading, setLoading]     = useState(true);
=======
  const [current, setCurrent] = useState(0);
  const [reponses, setReponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [temps, setTemps] = useState(0);
  const [loading, setLoading] = useState(true);
>>>>>>> origin/notifcalendrier
  const timerRef = useRef(null);

  const t = T[lang];
  const { matiere, sousCat, niveau } = state || {};

  useEffect(() => {
<<<<<<< HEAD
    if (!matiere) {
      navigate("/eleve/exercices");
      return;
    }

=======
    if (!matiere) { navigate("/eleve/exercices"); return; }
>>>>>>> origin/notifcalendrier
    const load = async () => {
      try {
        const url = `http://localhost:5004/api/exercices?matiere=${matiere}&niveau=${niveau}${sousCat ? `&sousCat=${sousCat}` : ""}`;
        const res = await axios.get(url);
<<<<<<< HEAD
        setExercices(res.data.aFaire || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    load();
    timerRef.current = setInterval(() => setTemps((prev) => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
=======
        setExercices(res.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
    timerRef.current = setInterval(() => setTemps((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);
>>>>>>> origin/notifcalendrier

  const choisir = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const suivant = () => {
<<<<<<< HEAD
    const nouvellesReponses = [
      ...reponses,
      { exerciceId: exercices[current]._id, reponse: selected },
    ];
=======
    const nouvellesReponses = [...reponses, { exerciceId: exercices[current]._id, reponse: selected }];
>>>>>>> origin/notifcalendrier
    setReponses(nouvellesReponses);
    setSelected(null);

    if (current + 1 >= exercices.length) {
      clearInterval(timerRef.current);
      navigate("/eleve/exercices/resultat", {
<<<<<<< HEAD
        state: {
          reponses:        nouvellesReponses,
          matiere,
          sousCat,
          niveau,
          tempsEnSecondes: temps,
          exerciceIds:     exercices.map((ex) => ex._id), // ✅ tous les ids
        },
=======
        state: { reponses: nouvellesReponses, matiere, sousCat, niveau, tempsEnSecondes: temps },
>>>>>>> origin/notifcalendrier
      });
    } else {
      setCurrent(current + 1);
    }
  };

<<<<<<< HEAD
  const formatTemps = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) {
    return (
      <div className={`ex-root ${dark ? "dark" : "light"}`}>
        <div className="ex-loading-full">Chargement...</div>
      </div>
    );
  }

  const ex = exercices[current];

  if (!ex) {
    return (
      <div className={`ex-root ${dark ? "dark" : "light"}`}>
        <div className="ex-loading-full">
          <p>Bravo ! Tu as déjà validé tous les exercices de ce thème.</p>
          <button
            className="ex-back-btn"
            style={{ marginTop: "20px", position: "static" }}
            onClick={() => navigate("/eleve/exercices")}
          >
            {t.retour}
          </button>
        </div>
      </div>
    );
  }

  const progress = (current / exercices.length) * 100;

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <header className="ex-header">
        <button className="ex-back-btn" onClick={() => navigate("/eleve/exercices")}>
          {t.retour}
        </button>
=======
  const formatTemps = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) return <div className={`ex-root ${dark ? "dark" : "light"}`}><div className="ex-loading-full">Chargement...</div></div>;

  const ex = exercices[current];
  if (!ex) return null;

  const progress = ((current) / exercices.length) * 100;

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" /><div className="blob blob-2" />

      <header className="ex-header">
        <button className="ex-back-btn" onClick={() => navigate("/eleve/exercices")}>{t.retour}</button>
>>>>>>> origin/notifcalendrier
        <span className="ex-logo">SOURDI</span>
        <span className="ex-timer">{t.temps} : {formatTemps(temps)}</span>
      </header>

      <main className="ex-quiz-main">
<<<<<<< HEAD
        <div className="ex-progress-bar">
          <div className="ex-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="ex-progress-label">
          {t.question} {current + 1} / {exercices.length}
        </p>

=======
        {/* Barre de progression */}
        <div className="ex-progress-bar">
          <div className="ex-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="ex-progress-label">{t.question} {current + 1} / {exercices.length}</p>

        {/* Carte question */}
>>>>>>> origin/notifcalendrier
        <div className="ex-question-card">
          <p className="ex-question-text">{ex.question}</p>
        </div>

<<<<<<< HEAD
=======
        {/* Options */}
>>>>>>> origin/notifcalendrier
        <div className="ex-options-grid">
          {ex.options.map((opt, idx) => (
            <button
              key={idx}
<<<<<<< HEAD
              className={`ex-option-btn ${selected === idx ? "chosen" : ""}`}
=======
              className={`ex-option-btn ${selected === idx ? "chosen" : ""} ${selected !== null && idx === selected ? "chosen" : ""}`}
>>>>>>> origin/notifcalendrier
              onClick={() => choisir(idx)}
            >
              <span className="ex-option-letter">{["A", "B", "C", "D"][idx]}</span>
              <span className="ex-option-text">{opt}</span>
            </button>
          ))}
        </div>

<<<<<<< HEAD
=======
        {/* Suivant */}
>>>>>>> origin/notifcalendrier
        {selected !== null && (
          <button className="ex-next-btn" onClick={suivant}>
            {current + 1 >= exercices.length ? t.terminer : t.suivant}
          </button>
        )}
      </main>
    </div>
  );
}