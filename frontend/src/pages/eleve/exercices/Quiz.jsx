import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

const API_EX = "http://localhost:5004/api/exercices";
const API_COINS = "http://localhost:5005/api/coins";

const T = {
  fr: {
    question: "Question",
    suivant: "Suivant →",
    terminer: "Terminer",
    retour: "← Quitter",
    temps: "Temps",
    chargement: "Chargement...",
    vide: "Quiz introuvable",
  },
  en: {
    question: "Question",
    suivant: "Next →",
    terminer: "Finish",
    retour: "← Quit",
    temps: "Time",
    chargement: "Loading...",
    vide: "Quiz not found",
  },
};

export default function Quiz() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [lang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");

  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [reponses, setReponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [temps, setTemps] = useState(0);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);
  const coinsTimerRef = useRef(null);

  const t = T[lang];
  const { coursId, quizId, coursTitre, quizTitre } = state || {};

  useEffect(() => {
    if (!coursId || !quizId) {
      navigate("/eleve/exercices");
      return;
    }

    const load = async () => {
      try {
        const res = await axios.get(`${API_EX}/cours/${coursId}/quiz`);
        const found = (res.data || []).find((q) => q._id === quizId);

        if (!found) {
          setQuiz(null);
          setQuestions([]);
        } else {
          setQuiz(found);
          setQuestions(found.questions || []);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    load();

    timerRef.current = setInterval(() => {
      setTemps((x) => x + 1);
    }, 1000);

    coinsTimerRef.current = setInterval(() => {
      axios.post(`${API_COINS}/temps`, { minutes: 1 }).catch(() => {});
    }, 60000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(coinsTimerRef.current);
    };
  }, [coursId, quizId, navigate]);

  const choisir = (idx) => {
    if (answered) return;

    setSelected(idx);
    setAnswered(true);
  };

  const suivant = () => {
    const nouvellesReponses = [
      ...reponses,
      {
        questionIndex: current,
        reponse: selected,
      },
    ];

    setReponses(nouvellesReponses);
    setSelected(null);
    setAnswered(false);

    if (current + 1 >= questions.length) {
      clearInterval(timerRef.current);

      navigate("/eleve/exercices/resultat", {
        state: {
          coursId,
          quizId,
          coursTitre,
          quizTitre: quiz?.titre || quizTitre,
          reponses: nouvellesReponses,
          tempsEnSecondes: temps,
        },
      });
    } else {
      setCurrent(current + 1);
    }
  };

  const getOptionClass = (idx) => {
    if (!answered) {
      return selected === idx ? "chosen" : "";
    }

    if (idx === question.bonneReponse) {
      return "correct";
    }

    if (selected === idx && idx !== question.bonneReponse) {
      return "wrong";
    }

    return "";
  };

  const formatTemps = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) {
    return (
      <div className={`ex-root ${dark ? "dark" : "light"}`}>
        <div className="ex-loading-full">{t.chargement}</div>
      </div>
    );
  }

  const question = questions[current];

  if (!question) {
    return (
      <div className={`ex-root ${dark ? "dark" : "light"}`}>
        <div className="ex-loading-full">{t.vide}</div>
      </div>
    );
  }

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <header className="ex-header">
        <button
          className="ex-back-btn"
          onClick={() => navigate("/eleve/exercices")}
        >
          {t.retour}
        </button>
        <span className="ex-logo">SOURDI</span>
        <span className="ex-timer">
          {t.temps} : {formatTemps(temps)}
        </span>
      </header>

      <main className="ex-quiz-main">
        <div className="ex-quiz-title">
          <h2>{quiz?.titre || quizTitre}</h2>
          <p>{coursTitre}</p>
        </div>

        <div className="ex-progress-bar">
          <div className="ex-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="ex-progress-label">
          {t.question} {current + 1} / {questions.length}
        </p>

        <div className="ex-question-card">
          <p className="ex-question-text">{question.question}</p>
        </div>

        <div className="ex-options-grid">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className={`ex-option-btn ${getOptionClass(idx)}`}
              onClick={() => choisir(idx)}
              disabled={answered}
            >
              <span className="ex-option-letter">
                {["A", "B", "C", "D"][idx]}
              </span>
              <span className="ex-option-text">{opt}</span>
            </button>
          ))}
        </div>

        {selected !== null && (
          <button className="ex-next-btn" onClick={suivant}>
            {current + 1 >= questions.length ? t.terminer : t.suivant}
          </button>
        )}
      </main>
    </div>
  );
}