import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "../../../api/axios";
import "./exercices.css";

const T = {
  fr: {
    titre: "Exercices",
    sousTitre: "Choisis ta matière et commence à apprendre",
    niveau: "Ton niveau",
    choisirSousCat: "Choisir un thème",
<<<<<<< HEAD
    commencer: "Commencer",
=======
    commencer: "Commencer le quiz",
>>>>>>> origin/notifcalendrier
    matieres: {
      francais: "Français",
      arabe: "Arabe",
      maths: "Mathématiques",
      sciences: "Sciences",
      histoire: "Histoire & Géo",
    },
    retour: "← Retour",
  },
  en: {
    titre: "Exercises",
    sousTitre: "Choose your subject and start learning",
    niveau: "Your level",
    choisirSousCat: "Choose a theme",
<<<<<<< HEAD
    commencer: "Start",
=======
    commencer: "Start quiz",
>>>>>>> origin/notifcalendrier
    matieres: {
      francais: "French",
      arabe: "Arabic",
      maths: "Mathematics",
      sciences: "Sciences",
      histoire: "History & Geo",
    },
    retour: "← Back",
  },
};

const MATIERE_CONFIG = {
<<<<<<< HEAD
  francais: { color: "#AB47BC" },
  arabe:    { color: "#EF5350" },
  maths:    { color: "#FF7043" },
  sciences: { color: "#26C6DA" },
  histoire: { color: "#66BB6A" },
=======
  francais: { color: "#AB47BC", icon: "📖" },
  arabe:    { color: "#EF5350", icon: "ع" },
  maths:    { color: "#FF7043", icon: "∑" },
  sciences: { color: "#26C6DA", icon: "🔬" },
  histoire: { color: "#66BB6A", icon: "🗺" },
>>>>>>> origin/notifcalendrier
};

export default function Selection() {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const [lang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [matieres, setMatieres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sousCats, setSousCats] = useState([]);
  const [sousCatSelected, setSousCatSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = T[lang];
<<<<<<< HEAD
  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const niveau = decoded.grade ? parseInt(decoded.grade) : 1;
=======
const token = localStorage.getItem("token");
const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
const niveau = decoded.grade ? parseInt(decoded.grade) : 1;
>>>>>>> origin/notifcalendrier

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/exercices/matieres?niveau=${niveau}`);
        setMatieres(res.data);
      } catch (e) { console.error(e); }
    };
    load();
  }, [niveau]);

  const choisirMatiere = async (matiere) => {
    setSelected(matiere);
    setSousCatSelected(null);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5004/api/exercices/souscats?matiere=${matiere}&niveau=${niveau}`);
      setSousCats(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

<<<<<<< HEAD
  
  const commencer = () => {
    if (!selected || !sousCatSelected) return;
    
    navigate("/eleve/exercices/liste", {
      state: {
        matiere: selected,
        sousCat: sousCatSelected,
        niveau,
      },
=======
  const commencer = () => {
    if (!selected) return;
    navigate("/eleve/exercices/quiz", {
      state: { matiere: selected, sousCat: sousCatSelected, niveau },
>>>>>>> origin/notifcalendrier
    });
  };

  return (
    <div className={`ex-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" /><div className="blob blob-2" />

      <header className="ex-header">
        <button className="ex-back-btn" onClick={() => navigate("/eleve")}>{t.retour}</button>
        <span className="ex-logo">SOURDI</span>
        <span className="ex-niveau">{t.niveau} : <strong>{niveau}</strong></span>
      </header>

      <main className="ex-main">
        <div className="ex-page-title">
          <h1>{t.titre}</h1>
          <p>{t.sousTitre}</p>
        </div>

<<<<<<< HEAD
=======
        {/* Grille des matières */}
>>>>>>> origin/notifcalendrier
        <div className="ex-matieres-grid">
          {matieres.map((m) => {
            const cfg = MATIERE_CONFIG[m] || { color: "#AB47BC", icon: "📚" };
            return (
              <button
                key={m}
                className={`ex-matiere-card ${selected === m ? "active" : ""}`}
                style={{ "--accent": cfg.color }}
                onClick={() => choisirMatiere(m)}
              >
                <span className="ex-matiere-icon">{cfg.icon}</span>
                <span className="ex-matiere-name">{t.matieres[m] || m}</span>
              </button>
            );
          })}
        </div>

<<<<<<< HEAD
    
=======
        {/* Sous-catégories */}
>>>>>>> origin/notifcalendrier
        {selected && (
          <div className="ex-souscats-section">
            <p className="ex-souscats-label">{t.choisirSousCat} :</p>
            <div className="ex-souscats-list">
              {loading ? (
                <span className="ex-loading">...</span>
              ) : sousCats.map((sc) => (
                <button
                  key={sc}
                  className={`ex-sousCat-btn ${sousCatSelected === sc ? "active" : ""}`}
                  style={{ "--accent": MATIERE_CONFIG[selected]?.color || "#AB47BC" }}
                  onClick={() => setSousCatSelected(sc)}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        )}

<<<<<<< HEAD
       
        {selected && sousCatSelected && (
=======
        {/* Bouton commencer */}
        {selected && (
>>>>>>> origin/notifcalendrier
          <button
            className="ex-start-btn"
            style={{ background: `linear-gradient(135deg, ${MATIERE_CONFIG[selected]?.color}, ${MATIERE_CONFIG[selected]?.color}aa)` }}
            onClick={commencer}
          >
            {t.commencer}
          </button>
        )}
      </main>
    </div>
  );
}