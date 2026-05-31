import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

const API_EX = "http://localhost:5004/api/exercices";

const T = {
  fr: {
    bravo: "Bravo !",
    bienEssaye: "Bien essayé !",
    score: "Ton score",
    coinsGagnes: "Coins gagnés",
    dejaComplete: "Déjà récompensé",
    rejouer: "Rejouer",
    retour: "Retour aux cours",
    soumission: "Calcul du score...",
  },
  en: {
    bravo: "Well done!",
    bienEssaye: "Good try!",
    score: "Your score",
    coinsGagnes: "Coins earned",
    dejaComplete: "Already rewarded",
    rejouer: "Play again",
    retour: "Back to lessons",
    soumission: "Calculating score...",
  },
};

export default function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const dejaSoumisRef = useRef(false);

  const [lang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = T[lang];

  const { coursId, quizId, coursTitre, quizTitre, reponses, tempsEnSecondes } =
    state || {};

  useEffect(() => {
    if (dejaSoumisRef.current) return;
    dejaSoumisRef.current = true;

    if (!quizId || !reponses) {
      navigate("/eleve/exercices");
      return;
    }

    const soumettre = async () => {
      try {
        const res = await axios.post(`${API_EX}/quiz/${quizId}/soumettre`, {
          reponses,
          tempsEnSecondes,
        });

        setResultat(res.data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    soumettre();
  }, [quizId, reponses, tempsEnSecondes, navigate]);

  if (loading) {
    return (
      <div className={`ex-root ${dark ? "dark" : "light"}`}>
        <div className="ex-loading-full">{t.soumission}</div>
      </div>
    );
  }

  const pct = resultat?.pourcentage || 0;
  const estBon = pct >= 60;

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <main className="ex-resultat-main">
        <div className="ex-resultat-card">
          <h1 className="ex-resultat-titre">
            {estBon ? t.bravo : t.bienEssaye}
          </h1>

          <p className="ex-resultat-subtitle">
            {coursTitre} — {quizTitre}
          </p>

          <div className="ex-score-circle">
            <svg viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(171,71,188,0.12)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={estBon ? "#AB47BC" : "#EF5350"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  transition: "stroke-dashoffset 1s ease",
                }}
              />
            </svg>

            <div className="ex-score-inner">
              <span className="ex-score-pct">{pct}%</span>
              <span className="ex-score-detail">
                {resultat?.score}/{resultat?.total}
              </span>
            </div>
          </div>

          <div className="ex-coins-result">
            <span className="ex-coins-dot" />
            <span>
              +{resultat?.pointsGagnes || 0} {t.coinsGagnes}
            </span>
          </div>

          {resultat?.dejaComplete && (
            <div className="ex-warning">{t.dejaComplete}</div>
          )}

          <div className="ex-resultat-btns">
            <button
              className="ex-replay-btn"
              onClick={() =>
                navigate("/eleve/exercices/quiz", {
                  state: { coursId, quizId, coursTitre, quizTitre },
                })
              }
            >
              {t.rejouer}
            </button>

            <button
              className="ex-home-btn"
              onClick={() => navigate("/eleve/exercices")}
            >
              {t.retour}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}