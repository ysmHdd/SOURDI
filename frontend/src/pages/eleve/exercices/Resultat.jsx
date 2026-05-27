<<<<<<< HEAD
import { useEffect, useState, useRef  } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> origin/notifcalendrier
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

<<<<<<< HEAD
export default function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  const { reponses, matiere, sousCat, niveau, tempsEnSecondes, exerciceIds } = state || {};
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
  submitted.current = true;

  const soumettre = async () => {
    try {
      if (!reponses || reponses.length === 0) {
        navigate("/eleve/exercices");
        return;
      }

      const res = await axios.post(
        "http://localhost:5004/api/exercices/soumettre",
        { matiere, niveau, sousCat, reponses, tempsEnSecondes, exerciceIds }
      );

      console.log("Réponse soumission:", res.data);
console.log("pointsGagnes:", res.data?.pointsGagnes);
      // ✅ Créditer les coins après soumission réussie
      const pointsGagnes = res.data?.pointsGagnes ?? 0;
      if (pointsGagnes > 0) {
       try {
    const creditRes = await axios.patch("http://localhost:5003/api/eleve/coins/crediter", {
      montant: pointsGagnes,
    });
    console.log("Crédit coins OK:", creditRes.data);
  } catch (creditErr) {
    console.error("Erreur crédit coins:", creditErr.response?.data || creditErr.message);
  }
}

      setResultat(res?.data || null);
    } catch (err) {
      console.error("Erreur soumission:", err);
      setResultat(null);
    } finally {
      setLoading(false);
    }
  };

  console.log("state reçu:", state);
console.log("exerciceIds:", exerciceIds);

  soumettre();
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="ex-root">
        <div className="ex-loading-full">Calcul du résultat...</div>
      </div>
    );
  }

  if (!resultat) {
    return (
      <div className="ex-root">
        <div className="ex-resultat-card">
          <h1>Erreur</h1>
          <p>Impossible de calculer le résultat</p>
          <button onClick={() => navigate("/eleve/exercices/liste")}>Retour</button>
        </div>
      </div>
    );
  }

  const score  = resultat?.score ?? 0;
  const total  = resultat?.total ?? 0;
  const coins  = resultat?.pointsGagnes ?? 0;
  const pct    = total > 0 ? Math.round((score / total) * 100) : 0;
  const estBon = pct >= 60;

  return (
    <div className="ex-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <main className="ex-resultat-main">
        <div className="ex-resultat-card">

          <h1 className="ex-resultat-titre">
            {estBon ? "Bravo !" : "Bien essayé"}
          </h1>

          <div className="ex-score-circle">
            <div className="ex-score-inner">
              <span className="ex-score-pct">{pct}%</span>
              <span className="ex-score-detail">{score} / {total}</span>
            </div>
          </div>

          <div className="ex-coins-result">+{coins} coins</div>

          <div className="ex-resultat-btns">
            <button onClick={() => navigate("/eleve/exercices/liste")}>
              Retour exercices
            </button>
          </div>

=======
const T = {
  fr: {
    titre: "Résultat",
    bravo: "Bravo !",
    bienEssaye: "Bien essayé !",
    score: "Ton score",
    coinsGagnes: "Coins gagnés",
    rejouer: "Rejouer",
    accueil: "Retour à l'accueil",
    soumission: "Calcul du score...",
  },
  en: {
    titre: "Result",
    bravo: "Well done!",
    bienEssaye: "Good try!",
    score: "Your score",
    coinsGagnes: "Coins earned",
    rejouer: "Play again",
    accueil: "Back to home",
    soumission: "Calculating score...",
  },
};

export default function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [lang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = T[lang];
  const { reponses, matiere, sousCat, niveau, tempsEnSecondes } = state || {};

  useEffect(() => {
  if (!reponses) { navigate("/eleve/exercices"); return; }
  const soumettre = async () => {
    try {
 
      const res = await axios.post("http://localhost:5004/api/exercices/soumettre", {
        matiere, niveau, sousCat, reponses, tempsEnSecondes,
      });
      setResultat(res.data);


      await axios.post("http://localhost:5005/api/coins/quiz", {
        score: res.data.score,
        total: res.data.total,
        matiere,
      });

    } catch (e) { console.error(e); }
    setLoading(false);
  };
  soumettre();
}, []);

  if (loading) return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="ex-loading-full">{t.soumission}</div>
    </div>
  );

  const pct = resultat ? Math.round((resultat.score / resultat.total) * 100) : 0;
  const estBon = pct >= 60;

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" /><div className="blob blob-2" />

      <main className="ex-resultat-main">
        <div className="ex-resultat-card">
          {/* Titre */}
          <h1 className="ex-resultat-titre">{estBon ? t.bravo : t.bienEssaye}</h1>

          {/* Score circulaire */}
          <div className="ex-score-circle" style={{ "--pct": pct, "--color": estBon ? "#AB47BC" : "#EF5350" }}>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(171,71,188,0.12)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={estBon ? "#AB47BC" : "#EF5350"} strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="ex-score-inner">
              <span className="ex-score-pct">{pct}%</span>
              <span className="ex-score-detail">{resultat?.score}/{resultat?.total}</span>
            </div>
          </div>

          {/* Coins */}
          <div className="ex-coins-result">
            <span className="ex-coins-dot" />
            <span>+{resultat?.pointsGagnes} {t.coinsGagnes}</span>
          </div>

          {/* Boutons */}
          <div className="ex-resultat-btns">
            <button className="ex-replay-btn" onClick={() => navigate("/eleve/exercices/quiz", { state: { matiere, sousCat, niveau } })}>
              {t.rejouer}
            </button>
            <button className="ex-home-btn" onClick={() => navigate("/eleve")}>
              {t.accueil}
            </button>
          </div>
>>>>>>> origin/notifcalendrier
        </div>
      </main>
    </div>
  );
}