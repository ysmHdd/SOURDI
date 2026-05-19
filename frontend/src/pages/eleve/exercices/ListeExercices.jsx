import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios"; // Utilise ton instance axios configurée
import "./listeExercices.css";

const ListeExercices = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");
  
  // États pour stocker uniquement les exercices
  const [exercices, setExercices] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // Récupération sécurisée des choix de l'élève depuis le state du routeur
  const { matiere, sousCat, niveau } = state || {};

  useEffect(() => {
    // Si l'élève force l'URL sans passer par la page Sélection, on le renvoie au départ
    if (!matiere || !sousCat || !niveau) {
      navigate("/eleve/exercices");
      return;
    }

    const chargerExercicesDuTheme = async () => {
      try {
        setChargement(true);
        setErreur(null);

        // Appel de ta route d'exercices filtrée par niveau, matière et sous-catégorie (thème)
        const url = `http://localhost:5004/api/exercices?matiere=${matiere}&niveau=${niveau}&sousCat=${sousCat}`;
        const reponse = await axios.get(url);

        // Ton backend renvoie { aFaire, done }, on prend la liste "aFaire"
        setExercices(reponse.data.aFaire || []);
      } catch (err) {
        console.error("Erreur lors du chargement des exercices:", err);
        setErreur("Impossible de récupérer la liste des exercices pour ce thème.");
      } finally {
        setChargement(false);
      }
    };

    chargerExercicesDuTheme();
  }, [matiere, sousCat, niveau, navigate]);

  // Redirection vers le composant Quiz au clic sur un exercice précis
  const lancerQuiz = (exercice) => {
    navigate("/eleve/exercices/quiz", {
      state: {
        matiere,
        sousCat,
        niveau,
        exerciceUnique: exercice // Optionnel si ton composant Quiz peut isoler une seule question
      },
    });
  };

  if (chargement) return <div className="ex-loading-full">Chargement des exercices en cours...</div>;

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" /><div className="blob blob-2" />

      <header className="ex-header">
        <button className="ex-back-btn" onClick={() => navigate("/eleve/exercices")}>
          ← Retour aux thèmes
        </button>
        <span className="ex-logo">SOURDI</span>
        <span className="ex-niveau">Niveau : <strong>{niveau}</strong></span>
      </header>

      <main className="ex-main">
        <div className="ex-page-title">
          <h1 style={{ textTransform: "capitalize" }}>{sousCat}</h1>
          <p style={{ opacity: 0.8 }}>Matière : {matiere?.toUpperCase()}</p>
        </div>

        {erreur && <div className="message-erreur" style={{ color: "#FF5350", marginTop: "20px" }}>{erreur}</div>}

        <div className="ex-liste-exercices-grid" style={{ display: "grid", gap: "20px", marginTop: "30px" }}>
          {exercices.length === 0 ? (
            <div className="ex-question-card" style={{ textAlign: "center", padding: "30px" }}>
              <p className="ex-question-text">Bravo ! Tous les exercices de ce thème ont été complétés ou aucun quiz n'est disponible.</p>
            </div>
          ) : (
            exercices.map((ex) => (
              <div 
                key={ex._id} 
                className="ex-question-card" 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "20px", 
                  borderRadius: "16px", 
                  background: "rgba(255, 255, 255, 0.05)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)" 
                }}
              >
                <div style={{ flex: 1, textAlign: "left" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#FFF" }}>{ex.titre || "Quiz Sans Titre"}</h3>
                  <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>{ex.description || "Pas de description fournie."}</p>
                  <span 
                    className={`badge-difficulte ${ex.difficulte}`}
                    style={{ 
                      display: "inline-block", 
                      marginTop: "10px", 
                      fontSize: "0.8rem", 
                      padding: "4px 10px", 
                      borderRadius: "20px", 
                      background: ex.difficulte === "facile" ? "#4CAF50" : ex.difficulte === "moyen" ? "#FF9800" : "#F44336" 
                    }}
                  >
                    Difficulté : {ex.difficulte}
                  </span>
                </div>
                
                <button 
                  className="ex-sousCat-btn active" 
                  style={{ margin: 0, padding: "10px 20px", height: "fit-content", whiteSpace: "nowrap" }}
                  onClick={() => lancerQuiz(ex)}
                >
                  Faire le Quiz 🚀
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ListeExercices;