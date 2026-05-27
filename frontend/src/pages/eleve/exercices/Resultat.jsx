import { useEffect, useState, useRef  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercices.css";

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

        </div>
      </main>
    </div>
  );
}