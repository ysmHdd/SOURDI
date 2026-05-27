import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import "./exercicesFaits.css";

export default function ExercicesFaits() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { matiere, sousCat, niveau } = state || {};

  const [exercicesFaits, setExercicesFaits] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [erreur, setErreur]                 = useState(null);

  useEffect(() => {
    if (!matiere || !sousCat || !niveau) {
      navigate("/eleve/exercices");
      return;
    }

    const charger = async () => {
      try {
        setLoading(true);
        setErreur(null);

        const url = `http://localhost:5004/api/exercices?matiere=${matiere}&niveau=${niveau}&sousCat=${sousCat}`;
        const reponse = await axios.get(url);

        setExercicesFaits(reponse.data.done || []);
      } catch (err) {
        console.error("Erreur chargement exercices faits:", err);
        setErreur("Impossible de charger les exercices complétés.");
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, [matiere, sousCat, niveau, navigate]);

  /* ── Statistiques rapides ── */
  const totalFaits   = exercicesFaits.length;

  /* ── Affichages intermédiaires ── */
  if (loading) {
    return (
      <div className="ef-root">
        <div className="ef-loading-full">Chargement des exercices complétés…</div>
      </div>
    );
  }

  return (
    <div className="ef-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* ── Header ── */}
      <header className="ef-header">
        <button
          className="ef-back-btn"
          onClick={() => navigate("/eleve/exercices/liste", { state: { matiere, sousCat, niveau } })}
        >
          ← Retour aux exercices
        </button>
        <span className="ef-logo">SOURDI</span>
        <span className="ef-niveau">Niveau : <strong>{niveau}</strong></span>
      </header>

      {/* ── Contenu principal ── */}
      <main className="ef-main">

        {/* Titre */}
        <div className="ef-page-title">
          <h1>{sousCat}</h1>
          <p>Exercices complétés — {matiere?.toUpperCase()}</p>
        </div>

        {/* Bannière stats */}
        <div className="ef-stats">
          <div className="ef-stat-card">
            <div className="ef-stat-number">{totalFaits}</div>
            <div className="ef-stat-label">Exercice{totalFaits > 1 ? "s" : ""} fait{totalFaits > 1 ? "s" : ""}</div>
          </div>
        </div>

        {/* Erreur */}
        {erreur && (
          <p style={{ color: "#f87171", marginBottom: "20px" }}>{erreur}</p>
        )}

        {/* Liste */}
        {exercicesFaits.length === 0 ? (
          <div className="ef-empty">
            <div className="ef-empty-icon">📭</div>
            <p>Aucun exercice complété pour ce thème pour l'instant.</p>
          </div>
        ) : (
          <div className="ef-grid">
            {exercicesFaits.map((ex) => (
              <div key={ex._id} className="ef-card">

                {/* Icône check */}
                <div className="ef-check-icon" aria-hidden="true">✓</div>

                {/* Infos */}
                <div className="ef-card-body">
                  <h3>{ex.titre || "Quiz sans titre"}</h3>
                  <p>{ex.description || "Pas de description."}</p>
                  <span className={`ef-badge ${ex.difficulte}`}>
                    {ex.difficulte || "—"}
                  </span>
                </div>

                {/* Pill "Fait" */}
                <div className="ef-score-pill">
                  <strong>✓</strong>
                  Complété
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
