import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../../api/axios";
import "./exercices.css";

const API_EX = "http://localhost:5004/api/exercices";

export default function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();

  const dejaSoumisRef = useRef(false);

  const [dark] = useState(() => localStorage.getItem("theme") === "dark");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="ex-loading-full">{t("resultat.soumission")}</div>
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
            {estBon ? t("resultat.bravo") : t("resultat.bienEssaye")}
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
              +{resultat?.pointsGagnes || 0} {t("resultat.coinsGagnes")}
            </span>
          </div>

          {resultat?.dejaComplete && (
            <div className="ex-warning">{t("resultat.dejaComplete")}</div>
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
              {t("resultat.rejouer")}
            </button>

            <button
              className="ex-home-btn"
              onClick={() => navigate("/eleve/exercices")}
            >
              {t("resultat.retour")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}