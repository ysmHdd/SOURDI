import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";

const T = {
  fr: {
    tagline: "Plateforme d'apprentissage",
    logout: "Déconnexion",
    coins: "Sourdi Coins",
    marketTitle: "Marketplace",
    marketSub: "Dépense tes coins pour des récompenses",
    seeAll: "Voir tout →",
    coursesTitle: "Cours disponibles",
    coursesSub: "Continue ton apprentissage",
    start: "Commencer",
    statsTitle: "Mes statistiques",
    lessons: "Leçons complétées",
    time: "Temps passé",
    timeUnit: "min",
    connections: "Jours de connexion",
    selfEval: "Auto-évaluation",
    footerText: "Plateforme éducative pour la langue des signes",
    noProducts: "Aucun produit disponible",
    coins_unit: "coins",
    streakMsg: (s) => s > 1 ? `🔥 ${s} jours de suite !` : "Connecte-toi chaque jour pour des bonus !",
  },
  en: {
    tagline: "Learning Platform",
    logout: "Logout",
    coins: "Sourdi Coins",
    marketTitle: "Marketplace",
    marketSub: "Spend your coins to get rewards",
    seeAll: "See all →",
    coursesTitle: "Available Courses",
    coursesSub: "Continue your learning",
    start: "Start",
    statsTitle: "My Statistics",
    lessons: "Completed Lessons",
    time: "Time Spent",
    timeUnit: "min",
    connections: "Login streak",
    selfEval: "Self-Evaluation",
    footerText: "Educational platform for sign language",
    noProducts: "No products available",
    coins_unit: "coins",
    streakMsg: (s) => s > 1 ? `🔥 ${s} days in a row!` : "Log in every day for bonuses!",
  },
};

const COURSES = [
  { id: 1, title: { fr: "L'alphabet LSF", en: "LSF Alphabet" }, desc: { fr: "Bases de la langue des signes", en: "Basics of sign language" }, level: { fr: "Débutant", en: "Beginner" }, duration: "15 min", color: "#AB47BC" },
  { id: 2, title: { fr: "Salutations", en: "Greetings" }, desc: { fr: "Bonjour, merci, au revoir...", en: "Hello, thank you, goodbye..." }, level: { fr: "Débutant", en: "Beginner" }, duration: "20 min", color: "#EF5350" },
  { id: 3, title: { fr: "Les chiffres", en: "Numbers" }, desc: { fr: "Compter de 1 à 20 en LSF", en: "Count from 1 to 20 in LSF" }, level: { fr: "Intermédiaire", en: "Intermediate" }, duration: "25 min", color: "#FF7043" },
  { id: 4, title: { fr: "Les couleurs", en: "Colors" }, desc: { fr: "Rouge, bleu, vert et plus", en: "Red, blue, green and more" }, level: { fr: "Débutant", en: "Beginner" }, duration: "18 min", color: "#26C6DA" },
];

export default function Accueil() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark, setDark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [profil, setProfil] = useState(null);
  const [produits, setProduits] = useState([]);
  const [streak, setStreak] = useState(0);
  const [tempsSession, setTempsSession] = useState(0); // en minutes
  const timerRef = useRef(null);
  const minutesEnvoyeesRef = useRef(0);

  const t = T[lang];

  useEffect(() => { localStorage.setItem("sourdi_lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("sourdi_dark", dark); }, [dark]);

  // Charger profil et marketplace
  useEffect(() => {
    const load = async () => {
      try {
        const [p, m] = await Promise.all([
          axios.get("http://localhost:5003/api/eleve/profil"),
          axios.get("http://localhost:5003/api/eleve/marketplace"),
        ]);
        setProfil(p.data);
        setProduits(m.data.slice(0, 3));
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  // Récupérer le streak depuis coins-service
  useEffect(() => {
    const loadStreak = async () => {
      try {
        const res = await axios.get("http://localhost:5005/api/coins/stats");
        setStreak(res.data.streak || 0);
      } catch (e) { console.error(e); }
    };
    loadStreak();
  }, []);

  // Timer automatique — compte le temps et envoie coins toutes les 30 min
  useEffect(() => {
    timerRef.current = setInterval(async () => {
      setTempsSession((prev) => {
        const nouvelles = prev + 1;

        // Envoyer les coins toutes les 30 minutes
        if (nouvelles > 0 && nouvelles % 30 === 0 && nouvelles > minutesEnvoyeesRef.current) {
          minutesEnvoyeesRef.current = nouvelles;
          axios.post("http://localhost:5005/api/coins/temps", { minutes: 30 })
            .then(() => {
              // Recharger le solde après gain
              axios.get("http://localhost:5003/api/eleve/profil")
                .then((res) => setProfil(res.data))
                .catch(() => {});
            })
            .catch(() => {});

          // Mettre à jour le temps dans eleve-service
          axios.patch("http://localhost:5003/api/eleve/coins/kpi", {
            tempsPasseEnMinutes: nouvelles,
          }).catch(() => {});
        }

        return nouvelles;
      });
    }, 60 * 1000); // toutes les minutes

    return () => clearInterval(timerRef.current);
  }, []);

  const kpi = profil?.kpi || {};
  const solde = profil?.solde ?? 0;

  const stats = [
    { label: t.lessons,     value: kpi.lessonsCompletes ?? 0,    max: 20,  color: "#AB47BC" },
    { label: t.time,        value: kpi.tempsPasseEnMinutes ?? 0, max: 300, color: "#EF5350", suffix: t.timeUnit },
    { label: t.connections, value: streak,                        max: 30,  color: "#FF7043" },
    { label: t.selfEval,    value: kpi.autoEvaluation ?? 0,      max: 10,  color: "#26C6DA" },
  ];

  return (
    <div className={`accueil-root ${dark ? "dark" : "light"}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="stars" aria-hidden>
        {[["8%","7%","0s"],["14%","88%","1.2s"],["55%","3%","2.1s"],["78%","92%","0.7s"],["35%","96%","1.8s"]].map(([top,left,delay],i) => (
          <span key={i} className="star" style={{ top, left, animationDelay: delay }}>✦</span>
        ))}
      </div>

      {/* HEADER */}
      <header className="acc-header">
        <div className="acc-header-left">
          <span className="acc-logo">SOURDI</span>
          <span className="acc-tagline">{t.tagline}</span>
        </div>

        <div className="acc-header-center">
          <button className={`acc-lang ${lang === "fr" ? "active" : ""}`} onClick={() => setLang("fr")}>FR</button>
          <button className={`acc-lang ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
          <div className="acc-hdivider" />
          <button className="acc-theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="acc-header-right">
          {streak > 0 && (
            <div className="acc-streak-chip">
              🔥 {streak}j
            </div>
          )}
          <div className="acc-coins-chip">
            <span className="acc-coins-dot" />
            <span className="acc-coins-val">{solde}</span>
            <span className="acc-coins-sep" />
            <span className="acc-coins-lbl">{t.coins}</span>
          </div>
          <div className="acc-user-chip">
            <span className="acc-avatar-mini">{(utilisateur?.user_first_name || "?")[0].toUpperCase()}</span>
            <span className="acc-user-name">{utilisateur?.user_first_name} {utilisateur?.user_last_name}</span>
          </div>
          <button className="acc-logout-btn" onClick={() => { deconnexion(); navigate("/login"); }}>
            {t.logout}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="acc-main">

        {/* Streak banner */}
        {streak > 0 && (
          <div className="acc-streak-banner">
            {t.streakMsg(streak)}
          </div>
        )}

        {/* COLONNE GAUCHE : Marketplace */}
        <section className="acc-card acc-market">
          <div className="acc-card-head">
            <h2 className="acc-card-title">{t.marketTitle}</h2>
            <p className="acc-card-sub">{t.marketSub}</p>
          </div>
          <div className="acc-card-body">
            {produits.length > 0 ? produits.map((p) => (
              <div key={p._id} className="mp-row">
                <div className="mp-thumb">
                  {p.photo
                    ? <img src={`http://localhost:5002${p.photo}`} alt={p.nom} />
                    : <div className="mp-thumb-placeholder" />}
                </div>
                <div className="mp-info">
                  <span className="mp-name">{p.nom}</span>
                  <span className="mp-price"><strong>{p.prixEnCoins}</strong> {t.coins_unit}</span>
                </div>
              </div>
            )) : (
              <p className="acc-empty">{t.noProducts}</p>
            )}
          </div>
          <div className="acc-card-footer">
            <Link to="/eleve/marketplace" className="acc-see-all-btn">{t.seeAll}</Link>
          </div>
        </section>

        {/* COLONNE CENTRE : Cours */}
        <section className="acc-card acc-courses">
          <div className="acc-card-head">
            <h2 className="acc-card-title">{t.coursesTitle}</h2>
            <p className="acc-card-sub">{t.coursesSub}</p>
          </div>
          <div className="acc-card-body acc-courses-body">
            {COURSES.map((c) => (
              <div key={c.id} className="course-row">
                <div className="course-stripe" style={{ background: c.color }} />
                <div className="course-info">
                  <span className="course-title">{c.title[lang]}</span>
                  <span className="course-desc">{c.desc[lang]}</span>
                  <div className="course-meta">
                    <span className="course-badge" style={{ color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}33` }}>{c.level[lang]}</span>
                    <span className="course-dur">{c.duration}</span>
                  </div>
                </div>
                <button className="course-start-btn" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)` }} onClick={() => navigate("/eleve/exercices")}>
                  {t.start}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* COLONNE DROITE : Stats */}
        <aside className="acc-stats">
          <div className="acc-stats-head">
            <h2 className="acc-card-title">{t.statsTitle}</h2>
          </div>
          {stats.map((s, i) => {
            const pct = s.max ? Math.min(100, Math.round((s.value / s.max) * 100)) : 0;
            return (
              <div key={i} className="stat-block">
                <div className="stat-top">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value">
                    {s.value}
                    {s.max === 10 && <span className="stat-max">/10</span>}
                    {s.suffix && <span className="stat-max"> {s.suffix}</span>}
                  </span>
                </div>
                <div className="stat-track">
                  <div className="stat-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }} />
                </div>
              </div>
            );
          })}
          {tempsSession > 0 && (
            <div className="acc-session-timer">
              Session : {tempsSession} min
            </div>
          )}
        </aside>

      </main>

      {/* FOOTER */}
      <footer className="acc-footer">
        <span className="acc-footer-logo">SOURDI</span>
        <span className="acc-footer-text">{t.footerText} · © 2025</span>
      </footer>
    </div>
  );
}