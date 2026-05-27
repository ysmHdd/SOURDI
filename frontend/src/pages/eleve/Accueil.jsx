import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";
import EleveMessageBox from "../../components/messages/EleveMessageBox";
import SourdiHelperChat from "../../components/ai/SourdiHelperChat";
import { useLocation } from "react-router-dom";
const T = {
  fr: {
    tagline: "Plateforme d'apprentissage",
    logout: "Déconnexion",
    coins: "Sourdi Coins",
    marketTitle: "Marketplace",
    marketSub: "Dépense tes coins pour des récompenses",
    seeAll: "Voir tout",
    coursesTitle: "Exercices disponibles",
    coursesSub: "Continue ton apprentissage en langue des signes",
    start: "Commencer",
    statsTitle: "Ma progression",
    lessons: "Leçons complétées",
    time: "Temps passé",
    timeUnit: "min",
    connections: "Jours de connexion",
    selfEval: "Auto-évaluation",
    footerText: "Plateforme éducative pour la langue des signes",
    noProducts: "Aucun produit disponible",
    noExercices: "Aucun exercice disponible pour ton niveau.",
    coins_unit: "coins",
    session: "Session en cours",
    streak: "jours de suite",
    nextGoal: "Prochain objectif",
    niveau: "Niveau",
    niveaux: ["Débutant", "Apprenti", "Intermédiaire", "Avancé", "Expert"],
    bonjour: (h) =>
      h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir",
  },
  en: {
    tagline: "Learning Platform",
    logout: "Logout",
    coins: "Sourdi Coins",
    marketTitle: "Marketplace",
    marketSub: "Spend your coins to get rewards",
    seeAll: "See all",
    coursesTitle: "Available Exercises",
    coursesSub: "Continue your sign language learning",
    start: "Start",
    statsTitle: "My Progress",
    lessons: "Completed Lessons",
    time: "Time Spent",
    timeUnit: "min",
    connections: "Login streak",
    selfEval: "Self-Evaluation",
    footerText: "Educational platform for sign language",
    noProducts: "No products available",
    noExercices: "No exercises available for your level.",
    coins_unit: "coins",
    session: "Current session",
    streak: "days in a row",
    nextGoal: "Next goal",
    niveau: "Level",
    niveaux: ["Beginner", "Apprentice", "Intermediate", "Advanced", "Expert"],
    bonjour: (h) =>
      h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening",
  },
};


const COULEURS = ["#7C4DFF", "#E040FB", "#00BCD4", "#FF6D00", "#4CAF50", "#F44336"];

const getNiveau = (solde) => {
  if (solde >= 500) return 4;
  if (solde >= 200) return 3;
  if (solde >= 100) return 2;
  if (solde >= 50) return 1;
  return 0;
};

const getNextGoalCoins = (solde) => {
  if (solde < 50) return 50;
  if (solde < 100) return 100;
  if (solde < 200) return 200;
  if (solde < 500) return 500;
  return null;
};

const ProgressCircle = ({ value, max, color, size = 64 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  const dash = pct * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.2,0.64,1)" }}
      />
    </svg>
  );
};

export default function Accueil() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [lang, setLang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark, setDark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [profil, setProfil] = useState(null);
  const [produits, setProduits] = useState([]);
  const [streak, setStreak] = useState(0);
  const [tempsSession, setTempsSession] = useState(0);
  const [apercuExercices, setApercuExercices] = useState([]);
  

  const timerRef = useRef(null);
  const minutesEnvoyeesRef = useRef(0);


  const t = T[lang];
  const heure = new Date().getHours();

  useEffect(() => { localStorage.setItem("sourdi_lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("sourdi_dark", dark); }, [dark]);

  useEffect(() => {
  const load = async () => {
    try {
      const [p, m] = await Promise.all([
        axios.get("http://localhost:5003/api/eleve/profil"),
        axios.get("http://localhost:5003/api/eleve/marketplace"),
      ]);

      console.log("profil complet:", p.data); 
      console.log("solde reçu:", p.data.solde);

      setProfil(p.data);
      setProduits(m.data.slice(0, 3));
    } catch (e) {
      console.error(e);
    }
  };
  load();
}, [location]);


  useEffect(() => {
    const loadStreak = async () => {
      try {
        const res = await axios.get("http://localhost:5005/api/coins/stats");
        setStreak(res.data.streak || 0);
      } catch (e) {
        console.error(e);
      }
    };
    loadStreak();
  }, []);


  useEffect(() => {
    if (!profil) return;
    const loadExercices = async () => {
      try {
        const niveau = profil?.niveau ?? 1;
        const res = await axios.get(
          `http://localhost:5004/api/exercices/matieres?niveau=${niveau}`
        );
        setApercuExercices(res.data || []);
      } catch (e) {
        console.error("Erreur chargement matières:", e);
      }
    };
    loadExercices();
  }, [profil]);

  useEffect(() => {
  const recharger = async () => {
    try {
      const p = await axios.get("http://localhost:5003/api/eleve/profil");
      setProfil(p.data);
    } catch (e) { console.error(e); }
  };


  window.addEventListener("focus", recharger);
  return () => window.removeEventListener("focus", recharger);
}, []);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTempsSession((prev) => {
        const nouvelles = prev + 1;
        if (nouvelles % 30 === 0 && nouvelles > minutesEnvoyeesRef.current) {
          minutesEnvoyeesRef.current = nouvelles;
          axios.post("http://localhost:5005/api/coins/temps", { minutes: 30 })
            .then(() => axios.get("http://localhost:5003/api/eleve/profil")
              .then((r) => setProfil(r.data)))
            .catch(() => {});
          axios.patch("http://localhost:5003/api/eleve/coins/kpi", { tempsPasseEnMinutes: nouvelles })
            .catch(() => {});
        }
        return nouvelles;
      });
    }, 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const kpi = profil?.kpi || {};
  const solde = profil?.solde ?? 0;
  const niveauIdx = getNiveau(solde);
  const nextGoal = getNextGoalCoins(solde);
  const niveauPct = nextGoal ? Math.round((solde / nextGoal) * 100) : 100;

  const stats = [
    { key: "lessons",     label: t.lessons,     value: kpi.lessonsCompletes ?? 0,     max: 20,  color: "#7C4DFF", unit: ""        },
    { key: "time",        label: t.time,         value: kpi.tempsPasseEnMinutes ?? 0,  max: 300, color: "#E040FB", unit: t.timeUnit },
    { key: "connections", label: t.connections,  value: streak,                        max: 30,  color: "#FF6D00", unit: ""        },
    { key: "selfEval",    label: t.selfEval,     value: kpi.autoEvaluation ?? 0,       max: 10,  color: "#00BCD4", unit: "/10"     },
  ];

  return (
    <div className={`acc-root ${dark ? "dark" : "light"}`}>
      <div className="acc-blob acc-blob-1" />
      <div className="acc-blob acc-blob-2" />

      {/* ── Header ── */}
      <header className="acc-header">
        <div className="acc-header-left">
          <span className="acc-logo">SOURDI</span>
          <span className="acc-tagline">{t.tagline}</span>
        </div>

        <div className="acc-header-center">
          <button className={`acc-lang-btn ${lang === "fr" ? "active" : ""}`} onClick={() => setLang("fr")} type="button">FR</button>
          <button className={`acc-lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")} type="button">EN</button>
          <div className="acc-h-sep" />
          <button className="acc-theme-btn" onClick={() => setDark(!dark)} type="button">
            {dark ? "Clair" : "Sombre"}
          </button>
        </div>

        <div className="acc-header-right">
          {streak > 1 && (
            <div className="acc-streak-badge">{streak} {t.streak}</div>
          )}
          <div className="acc-coins-badge">
            <span className="acc-coins-val">{solde}</span>
            <span className="acc-coins-label">{t.coins}</span>
          </div>
          <Link to="/eleve/panier" className="acc-cart-link">Panier</Link>
          <Link to="/eleve/profile" className="acc-user-badge acc-user-link">
            <span className="acc-user-avatar">
              {profil?.avatar?.url ? (
                <img src={profil.avatar.url} alt="Avatar" />
              ) : (
                (utilisateur?.user_first_name || "?")[0].toUpperCase()
              )}
            </span>
            <span className="acc-user-name">
              {utilisateur?.user_first_name} {utilisateur?.user_last_name}
            </span>
          </Link>
          <button className="acc-logout-btn" type="button" onClick={() => { deconnexion(); navigate("/login"); }}>
            {t.logout}
          </button>
        </div>
      </header>

      {/* ── Welcome bar ── */}
      <div className="acc-welcome-bar">
        <div className="acc-welcome-left">
          <span className="acc-welcome-greet">
            {t.bonjour(heure)}, {utilisateur?.user_first_name} —
          </span>
          <span className="acc-welcome-niveau">
            {t.niveau} : <strong>{t.niveaux[niveauIdx]}</strong>
          </span>
        </div>

        {nextGoal && (
          <div className="acc-level-bar">
            <div className="acc-level-bar-track">
              <div className="acc-level-bar-fill" style={{ width: `${niveauPct}%` }} />
            </div>
            <span className="acc-level-bar-label">{solde} / {nextGoal} coins</span>
          </div>
        )}

        {tempsSession > 0 && (
          <div className="acc-session-badge">
            {t.session} : {tempsSession} {t.timeUnit}
          </div>
        )}
      </div>

      {/* ── Main ── */}
      <main className="acc-main">

        {/* Marketplace */}
        <section className="acc-panel">
          <div className="acc-panel-head">
            <h2 className="acc-panel-title">{t.marketTitle}</h2>
            <p className="acc-panel-sub">{t.marketSub}</p>
          </div>
          <div className="acc-panel-body">
            {produits.length > 0 ? (
              produits.map((p) => (
                <div key={p._id} className="acc-mp-item">
                  <div className="acc-mp-thumb">
                    {p.photo ? (
                      <img src={`http://localhost:5002${p.photo}`} alt={p.nom} />
                    ) : (
                      <div className="acc-mp-placeholder" />
                    )}
                  </div>
                  <div className="acc-mp-info">
                    <span className="acc-mp-name">{p.nom}</span>
                    <span className="acc-mp-price"><strong>{p.prixEnCoins}</strong> {t.coins_unit}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="acc-empty">{t.noProducts}</p>
            )}
          </div>
          <div className="acc-panel-footer">
            <Link to="/eleve/marketplace" className="acc-see-all">{t.seeAll}</Link>
          </div>
        </section>

        {/* ── Exercices réels ── */}
        <section className="acc-panel">
          <div className="acc-panel-head">
            <h2 className="acc-panel-title">{t.coursesTitle}</h2>
            <p className="acc-panel-sub">{t.coursesSub}</p>
          </div>

          <div className="acc-courses-list">
            {apercuExercices.length === 0 ? (
              <p className="acc-empty">{t.noExercices}</p>
            ) : (
              apercuExercices.map((matiere, i) => {
                const couleur = COULEURS[i % COULEURS.length];
                return (
                  <div key={matiere} className="acc-course-item">
                    <div className="acc-course-stripe" style={{ background: couleur }} />
                    <div className="acc-course-info">
                      <span className="acc-course-title" style={{ textTransform: "capitalize" }}>
                        {matiere}
                      </span>
                      <span className="acc-course-desc">
                        {lang === "fr"
                          ? `Exercices de ${matiere} — niveau ${profil?.niveau ?? 1}`
                          : `${matiere} exercises — level ${profil?.niveau ?? 1}`}
                      </span>
                      <div className="acc-course-meta">
                        <span
                          className="acc-course-tag"
                          style={{ color: couleur, background: `${couleur}18`, border: `1px solid ${couleur}30` }}
                        >
                          {t.niveaux[niveauIdx]}
                        </span>
                      </div>
                    </div>
                    <button
                      className="acc-course-btn"
                      style={{ background: couleur }}
                      onClick={() => navigate("/eleve/exercices")}
                      type="button"
                    >
                      {t.start}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Stats */}
        <aside className="acc-dashboard">
          <div className="acc-dashboard-head">
            <h2 className="acc-panel-title">{t.statsTitle}</h2>
          </div>

          {stats.map((s) => {
            const pct = s.max ? Math.min(100, Math.round((s.value / s.max) * 100)) : 0;
            return (
              <div key={s.key} className="acc-stat-row">
                <div className="acc-stat-circle">
                  <ProgressCircle value={s.value} max={s.max} color={s.color} size={56} />
                  <span className="acc-stat-circle-val" style={{ color: s.color }}>{pct}%</span>
                </div>
                <div className="acc-stat-info">
                  <span className="acc-stat-label">{s.label}</span>
                  <span className="acc-stat-value">{s.value}<span className="acc-stat-unit">{s.unit}</span></span>
                  <div className="acc-stat-bar">
                    <div className="acc-stat-bar-fill" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            );
          })}

          {nextGoal && (
            <div className="acc-next-goal">
              <span className="acc-next-goal-label">{t.nextGoal}</span>
              <span className="acc-next-goal-val">{nextGoal - solde} coins restants</span>
              <div className="acc-next-goal-bar">
                <div className="acc-next-goal-fill" style={{ width: `${niveauPct}%` }} />
              </div>
              <span className="acc-next-goal-niveau">{t.niveaux[niveauIdx + 1] || t.niveaux[4]}</span>
            </div>
          )}
        </aside>
      </main>

      <footer className="acc-footer">
        <span className="acc-footer-logo">SOURDI</span>
        <span className="acc-footer-text">{t.footerText} · © 2025</span>
      </footer>

      <EleveMessageBox />
      <SourdiHelperChat student={utilisateur} />
    </div>
  );
}