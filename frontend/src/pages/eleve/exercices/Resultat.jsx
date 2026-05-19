import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

export default function Resultat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  const { reponses, matiere, sousCat, niveau, tempsEnSecondes } = state || {};

  useEffect(() => {
    const soumettre = async () => {
      try {
        if (!reponses || reponses.length === 0) {
          navigate("/eleve/exercices");
          return;
        }

        const res = await axios.post(
          "http://localhost:5004/api/exercices/soumettre",
          {
            matiere,
            niveau,
            sousCat,
            reponses,
            tempsEnSecondes,
          }
        );

        // 🔥 sécurisation totale
        setResultat(res?.data || null);
      } catch (err) {
        console.error("Erreur soumission:", err);
        setResultat(null);
      } finally {
        setLoading(false);
      }
    };

    soumettre();
  }, []);

  // 🔥 loading safe
  if (loading) {
    return (
      <div className="ex-root">
        <div className="ex-loading-full">
          Calcul du résultat...
        </div>
      </div>
    );
  }

  // 🔥 si backend a fail
  if (!resultat) {
    return (
      <div className="ex-root">
        <div className="ex-resultat-card">
          <h1>Erreur</h1>
          <p>Impossible de calculer le résultat</p>

          <button onClick={() => navigate("/eleve/exercices")}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  // 🔥 SAFE VALUES
  const score = resultat?.score ?? 0;
  const total = resultat?.total ?? 0;
  const coins = resultat?.pointsGagnes ?? 0;

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
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

          {/* SCORE */}
          <div className="ex-score-circle">
            <div className="ex-score-inner">
              <span className="ex-score-pct">{pct}%</span>
              <span className="ex-score-detail">
                {score} / {total}
              </span>
            </div>
          </div>

          {/* COINS */}
          <div className="ex-coins-result">
            +{coins} coins
          </div>

          {/* BUTTONS */}
          <div className="ex-resultat-btns">
            <button onClick={() => navigate("/eleve/exercices")}>
              Retour exercices
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}