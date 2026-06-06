import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

const API_EX = "http://localhost:5004/api/exercices";
const API_COINS = "http://localhost:5005/api/coins";

const CYCLE_SECONDS = 30 * 60;
const KEY_CYCLE_SECONDS = "sourdi_cycle_seconds";
const KEY_SESSION_SECONDS = "sourdi_session_seconds";
const KEY_ACTIONS = "sourdi_actions_cycle";
const KEY_LAST_TICK = "sourdi_last_tick";

const getNumberStorage = (key) => Number(localStorage.getItem(key) || 0);

const setNumberStorage = (key, value) => {
  localStorage.setItem(key, String(value));
};

const T = {
  fr: {
    question: "Question",
    suivant: "Suivant →",
    terminer: "Terminer",
    retour: "← Quitter",
    temps: "Temps",
    cycleCoins: "Cycle coins",
    actions: "actions",
    chargement: "Chargement...",
    vide: "Quiz introuvable",
  },
  en: {
    question: "Question",
    suivant: "Next →",
    terminer: "Finish",
    retour: "← Quit",
    temps: "Time",
    cycleCoins: "Coins cycle",
    actions: "actions",
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
  const [tempsQuiz, setTempsQuiz] = useState(0);
  const [tempsCycleCoins, setTempsCycleCoins] = useState(
    getNumberStorage(KEY_CYCLE_SECONDS)
  );
  const [actionsCycle, setActionsCycle] = useState(
    getNumberStorage(KEY_ACTIONS)
  );
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);
  const rewardRunningRef = useRef(false);

  const t = T[lang];
  const { coursId, quizId, coursTitre, quizTitre } = state || {};

  const formatTemps = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const enregistrerActivite = (nombre = 1) => {
    const currentActions = getNumberStorage(KEY_ACTIONS);
    const nextActions = currentActions + nombre;

    setNumberStorage(KEY_ACTIONS, nextActions);
    setActionsCycle(nextActions);
  };

  const resetActions = () => {
    setNumberStorage(KEY_ACTIONS, 0);
    setActionsCycle(0);
  };

  const verifierRecompenseTemps = async () => {
    if (rewardRunningRef.current) return;

    rewardRunningRef.current = true;

    const actions = getNumberStorage(KEY_ACTIONS);

    try {
      const res = await axios.post(`${API_COINS}/temps`, {
        minutes: 30,
        actions,
      });

      if (res.data?.recompense) {
        window.dispatchEvent(new Event("coins-updated"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      resetActions();
      rewardRunningRef.current = false;
    }
  };

  const avancerCompteurGlobal = () => {
    const now = Date.now();
    const lastTick = Number(localStorage.getItem(KEY_LAST_TICK) || now);

    let elapsedSeconds = Math.floor((now - lastTick) / 1000);

    if (elapsedSeconds < 1) return;

    if (elapsedSeconds > 10) elapsedSeconds = 1;

    const nextSession = getNumberStorage(KEY_SESSION_SECONDS) + elapsedSeconds;
    let nextCycle = getNumberStorage(KEY_CYCLE_SECONDS) + elapsedSeconds;

    setNumberStorage(KEY_SESSION_SECONDS, nextSession);

    if (nextCycle >= CYCLE_SECONDS) {
      nextCycle = 0;
      verifierRecompenseTemps();
    }

    setNumberStorage(KEY_CYCLE_SECONDS, nextCycle);
    localStorage.setItem(KEY_LAST_TICK, String(now));

    setTempsCycleCoins(nextCycle);
    setActionsCycle(getNumberStorage(KEY_ACTIONS));
  };

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

    if (!localStorage.getItem(KEY_LAST_TICK)) {
      localStorage.setItem(KEY_LAST_TICK, String(Date.now()));
    }

    load();

    timerRef.current = setInterval(() => {
      setTempsQuiz((x) => x + 1);
      avancerCompteurGlobal();
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [coursId, quizId, navigate]);

  const choisir = (idx) => {
    if (answered) return;

    enregistrerActivite(1);
    setSelected(idx);
    setAnswered(true);
  };

  const suivant = () => {
    enregistrerActivite(1);

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
      enregistrerActivite(3);
      clearInterval(timerRef.current);

      navigate("/eleve/exercices/resultat", {
        state: {
          coursId,
          quizId,
          coursTitre,
          quizTitre: quiz?.titre || quizTitre,
          reponses: nouvellesReponses,
          tempsEnSecondes: tempsQuiz,
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
          type="button"
        >
          {t.retour}
        </button>

        <span className="ex-logo">SOURDI</span>

        <span className="ex-timer">
          {t.temps} : {formatTemps(tempsQuiz)}
        </span>

        <span className="ex-timer">
          {t.cycleCoins} : {formatTemps(tempsCycleCoins)} / 30:00 ·{" "}
          {actionsCycle} {t.actions}
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
              type="button"
            >
              <span className="ex-option-letter">
                {["A", "B", "C", "D"][idx]}
              </span>
              <span className="ex-option-text">{opt}</span>
            </button>
          ))}
        </div>

        {selected !== null && (
          <button className="ex-next-btn" onClick={suivant} type="button">
            {current + 1 >= questions.length ? t.terminer : t.suivant}
          </button>
        )}
      </main>
    </div>
  );
}