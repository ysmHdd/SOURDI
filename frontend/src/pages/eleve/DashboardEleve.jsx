import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";
import EleveMessageBox from "../../components/messages/EleveMessageBox";
import SourdiHelperChat from "../../components/ai/SourdiHelperChat";

const API_EX = "http://localhost:5004/api/exercices";
const API_COINS = "http://localhost:5005/api/coins";
const API_ELEVE = "http://localhost:5003/api/eleve";

const CYCLE_SECONDS = 30 * 60;
const KEY_CYCLE_SECONDS = "sourdi_cycle_seconds";
const KEY_ACTIONS = "sourdi_actions_cycle";
const KEY_LAST_TICK = "sourdi_last_tick";

const getNumberStorage = (key) => Number(localStorage.getItem(key) || 0);

const setNumberStorage = (key, value) => {
  localStorage.setItem(key, String(value));
};

const getAvatarParams = (gender, style) => {
  const base = [
    "facialHairProbability=0",
    "mouth=smile,twinkle,default",
    "eyes=happy,default,wink",
    "eyebrows=raisedExcited,defaultNatural,upDownNatural",
    "radius=50",
  ];

  const femaleStyles = {
    "girl-long": [
      "top=longButNotTooLong,straight01,straight02,straightAndStrand",
      "clothing=shirtScoopNeck,shirtVNeck,overall",
      "clothesColor=ff488e,ffafb9,c0aede,ffffff",
    ],
    "girl-bun": [
      "top=bun",
      "clothing=shirtScoopNeck,shirtVNeck,hoodie",
      "clothesColor=ff488e,f9a8d4,c0aede",
    ],
    "girl-bob": [
      "top=bob",
      "clothing=shirtScoopNeck,overall,shirtVNeck",
      "clothesColor=ffafb9,ffffff,65c9ff",
    ],
    "girl-curly": [
      "top=curvy,bigHair",
      "clothing=shirtScoopNeck,hoodie,overall",
      "clothesColor=f59797,ff488e,c0aede",
    ],
  };

  const maleStyles = {
    "boy-short": [
      "top=shortWaved,shortRound",
      "clothing=hoodie,shirtCrewNeck,overall",
      "clothesColor=65c9ff,5199e4,25557c",
    ],
    "boy-flat": [
      "top=shortFlat",
      "clothing=hoodie,shirtCrewNeck",
      "clothesColor=5199e4,25557c,b6e3f4",
    ],
    "boy-round": [
      "top=shortRound",
      "clothing=overall,shirtCrewNeck",
      "clothesColor=65c9ff,b6e3f4,25557c",
    ],
    "boy-caesar": [
      "top=theCaesar,theCaesarAndSidePart",
      "clothing=hoodie,shirtCrewNeck",
      "clothesColor=25557c,5199e4,65c9ff",
    ],
  };

  if (gender === "male") {
    return [
      ...base,
      "topProbability=100",
      "hairColor=2c1b18,724133,a55728",
      "backgroundColor=b6e3f4,93c5fd,e0f2fe,dbeafe",
      "backgroundType=gradientLinear,solid",
      ...(maleStyles[style] || maleStyles["boy-short"]),
    ].join("&");
  }

  return [
    ...base,
    "topProbability=100",
    "accessories=round,prescription01,prescription02",
    "accessoriesProbability=35",
    "hairColor=2c1b18,724133,a55728,d6b370,f59797",
    "backgroundColor=fbcfe8,f9a8d4,fce7f3,ffd5dc",
    "backgroundType=gradientLinear,solid",
    ...(femaleStyles[style] || femaleStyles["girl-long"]),
  ].join("&");
};

const getAvatarUrl = (avatar) => {
  if (!avatar) return "";

  const gender = avatar.gender || "female";
  const style =
    avatar.style && avatar.style.includes("-")
      ? avatar.style
      : gender === "male"
      ? "boy-short"
      : "girl-long";
  const seed = avatar.seed || "default-student";

  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    seed
  )}&${getAvatarParams(gender, style)}`;
};

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

const formatTemps = (minutes) => {
  const total = Number(minutes) || 0;
  const h = Math.floor(total / 60);
  const m = total % 60;

  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
};

const formatSecondes = (secondes) => {
  const total = Number(secondes) || 0;
  const m = Math.floor(total / 60);
  const s = total % 60;

  return `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

const getNotificationIcon = (type) => {
  if (type === "message") return "💬";
  if (type === "marketplace") return "🛒";
  if (type === "calendrier") return "📅";
  if (type === "quiz") return "📝";
  return "🔔";
};

const ProgressCircle = ({ value, max, color, size = 64 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  const dash = pct * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="6"
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{
          transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      />
    </svg>
  );
};

export default function Accueil() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [lang, setLang] = useState(localStorage.getItem("sourdi_lang") || "fr");
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [profil, setProfil] = useState(null);
  const [produits, setProduits] = useState([]);
  const [solde, setSolde] = useState(0);
  const [streak, setStreak] = useState(0);

  const [tempsCycleCoins, setTempsCycleCoins] = useState(
    getNumberStorage(KEY_CYCLE_SECONDS)
  );
  const [actionsCycle, setActionsCycle] = useState(
    getNumberStorage(KEY_ACTIONS)
  );

  const [coursAccueil, setCoursAccueil] = useState([]);
  const [coinsStats, setCoinsStats] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifNonLues, setNotifNonLues] = useState(0);
  const [notifFiltre, setNotifFiltre] = useState("tout");

  const timerRef = useRef(null);
  const rewardRunningRef = useRef(false);
  const notifRef = useRef(null);

  const heure = new Date().getHours();

  const getBonjour = (h) => {
    if (h < 12) return t("accueil.bonjour");
    if (h < 18) return t("accueil.bonApresMidi");
    return t("accueil.bonsoir");
  };

  const accesBloque =
    utilisateur?.statutAcces === "en_attente" ||
    utilisateur?.statutAcces === "refuse";

  const syncCountersFromStorage = () => {
    setTempsCycleCoins(getNumberStorage(KEY_CYCLE_SECONDS));
    setActionsCycle(getNumberStorage(KEY_ACTIONS));
  };

  const enregistrerActiviteCoins = (nombre = 1) => {
    const current = getNumberStorage(KEY_ACTIONS);
    const next = current + nombre;

    setNumberStorage(KEY_ACTIONS, next);
    setActionsCycle(next);

    window.dispatchEvent(new Event("coins-actions-updated"));
  };

  const resetActionsCoins = () => {
    setNumberStorage(KEY_ACTIONS, 0);
    setActionsCycle(0);

    window.dispatchEvent(new Event("coins-actions-updated"));
  };

  const chargerSolde = async () => {
    const res = await axios.get(`${API_ELEVE}/coins/solde`);
    setSolde(res.data?.solde || 0);
    return res.data?.solde || 0;
  };

  const chargerProfil = async () => {
    const res = await axios.get(`${API_ELEVE}/profil`);
    setProfil(res.data);
    return res.data;
  };

  const chargerCoursEtCoins = async () => {
    try {
      const [coursRes, statsRes] = await Promise.all([
        axios.get(`${API_EX}/cours`),
        axios.get(`${API_COINS}/stats`),
      ]);

      setCoursAccueil((coursRes.data || []).slice(0, 4));
      setCoinsStats(statsRes.data || null);
      setStreak(statsRes.data?.streak || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const chargerDonneesAccueil = async () => {
    try {
      const [profilRes, produitsRes] = await Promise.all([
        chargerProfil(),
        axios.get(`${API_ELEVE}/marketplace`),
        chargerSolde(),
      ]);

      setProfil(profilRes);
      setProduits((produitsRes.data || []).slice(0, 3));
      await chargerCoursEtCoins();
    } catch (e) {
      console.error(e);
    }
  };

  const chargerNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        axios.get("http://localhost:5009/api/notifications"),
        axios.get("http://localhost:5009/api/notifications/non-lues"),
      ]);

      setNotifications(notifRes.data || []);
      setNotifNonLues(countRes.data.total || 0);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const verifierRecompenseTemps = async () => {
    if (rewardRunningRef.current) return;

    rewardRunningRef.current = true;

    const actions = getNumberStorage(KEY_ACTIONS);

    try {
      const res = await axios.post(`${API_COINS}/temps`, {
        minutes: 30,
        actions,
      });

      if (res.data?.recompense) {
        window.dispatchEvent(new Event("coins-updated"));

        await Promise.all([
          chargerSolde(),
          chargerProfil(),
          chargerCoursEtCoins(),
        ]);
      }
    } catch (erreur) {
      console.error(erreur);
    } finally {
      resetActionsCoins();
      rewardRunningRef.current = false;
    }
  };

  const avancerCompteurGlobal = () => {
    const now = Date.now();
    const lastTick = Number(localStorage.getItem(KEY_LAST_TICK) || now);

    let elapsedSeconds = Math.floor((now - lastTick) / 1000);

    if (elapsedSeconds < 1) return;

    if (elapsedSeconds > 10) elapsedSeconds = 1;

    let nextCycle = getNumberStorage(KEY_CYCLE_SECONDS) + elapsedSeconds;

    if (nextCycle >= CYCLE_SECONDS) {
      nextCycle = 0;
      verifierRecompenseTemps();
    }

    setNumberStorage(KEY_CYCLE_SECONDS, nextCycle);
    localStorage.setItem(KEY_LAST_TICK, String(now));

    setTempsCycleCoins(nextCycle);
    setActionsCycle(getNumberStorage(KEY_ACTIONS));
  };

  const ouvrirNotification = async (notification) => {
    try {
      enregistrerActiviteCoins();

      if (!notification.lu) {
        await axios.patch(
          `http://localhost:5009/api/notifications/${notification._id}/lue`
        );
      }

      setNotifOpen(false);
      await chargerNotifications();

      if (notification.lien === "#message-box") {
        window.dispatchEvent(new Event("ouvrir-message-box"));
      } else if (notification.lien) {
        navigate(notification.lien);
      }
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const toutMarquerLu = async () => {
    try {
      enregistrerActiviteCoins();
      await axios.patch("http://localhost:5009/api/notifications/tout-lu");
      await chargerNotifications();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const supprimerNotification = async (e, id) => {
    e.stopPropagation();

    try {
      enregistrerActiviteCoins();
      await axios.delete(`http://localhost:5009/api/notifications/${id}`);
      await chargerNotifications();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  useEffect(() => {
    localStorage.setItem("sourdi_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!localStorage.getItem(KEY_LAST_TICK)) {
      localStorage.setItem(KEY_LAST_TICK, String(Date.now()));
    }

    chargerDonneesAccueil();
    syncCountersFromStorage();
  }, []);

  useEffect(() => {
    const refresh = () => {
      chargerSolde().catch(() => {});
      chargerProfil().catch(() => {});
      chargerCoursEtCoins();
      syncCountersFromStorage();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("coins-updated", refresh);
    window.addEventListener("coins-actions-updated", syncCountersFromStorage);
    window.addEventListener("storage", syncCountersFromStorage);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("coins-updated", refresh);
      window.removeEventListener(
        "coins-actions-updated",
        syncCountersFromStorage
      );
      window.removeEventListener("storage", syncCountersFromStorage);
    };
  }, []);

  useEffect(() => {
    chargerNotifications();

    const interval = setInterval(chargerNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fermer = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", fermer);

    return () => document.removeEventListener("mousedown", fermer);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(avancerCompteurGlobal, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const niveauIdx = getNiveau(solde);
  const nextGoal = getNextGoalCoins(solde);
  const niveauPct = nextGoal ? Math.round((solde / nextGoal) * 100) : 100;

  const lessonsCompletes = Math.floor((coinsStats?.parType?.lecon || 0) / 20);
  const tempsPasse = coinsStats?.minutesAccumulees || 0;
  const totalConnexions = streak;
  const autoEvaluation = Math.floor(
    (coinsStats?.parType?.auto_evaluation || 0) / 15
  );

  const notificationsAffichees =
    notifFiltre === "non-lu"
      ? notifications.filter((n) => !n.lu)
      : notifications;

  const stats = [
    {
      key: "lessons",
      label: t("accueil.lessons"),
      value: lessonsCompletes,
      max: 20,
      color: "#7C4DFF",
      unit: "",
    },
    {
      key: "time",
      label: t("accueil.time"),
      value: tempsPasse,
      max: 300,
      color: "#E040FB",
      unit: "",
    },
    {
      key: "connections",
      label: t("accueil.connections"),
      value: totalConnexions,
      max: 30,
      color: "#FF6D00",
      unit: "",
    },
    {
      key: "selfEval",
      label: t("accueil.selfEval"),
      value: autoEvaluation,
      max: 10,
      color: "#00BCD4",
      unit: "/10",
    },
  ];

  return (
    <div className={`acc-root ${dark ? "dark" : "light"}`}>
      <div className="acc-blob acc-blob-1" />
      <div className="acc-blob acc-blob-2" />

      <div className={accesBloque ? "acc-blurred-content" : ""}>
        <header className="acc-header">
          <div className="acc-header-left">
            <span className="acc-logo">SOURDI</span>
            <span className="acc-tagline">{t("header.tagline")}</span>
          </div>

          <div className="acc-header-center">
            <button
              className={`acc-lang-btn ${lang === "fr" ? "active" : ""}`}
              onClick={() => {
                enregistrerActiviteCoins();
                setLang("fr");
              }}
              type="button"
            >
              FR
            </button>

            <button
              className={`acc-lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => {
                enregistrerActiviteCoins();
                setLang("en");
              }}
              type="button"
            >
              EN
            </button>

            <div className="acc-h-sep" />

            <button
              className="acc-theme-btn"
              onClick={() => {
                enregistrerActiviteCoins();
                setDark(!dark);
              }}
              type="button"
            >
              {dark ? "Clair" : "Sombre"}
            </button>
          </div>

          <div className="acc-header-right">
            {streak > 1 && (
              <div className="acc-streak-badge">
                {streak} {t("header.streak")}
              </div>
            )}

            <div className="acc-coins-badge">
              <span className="acc-coins-val">{solde}</span>
              <span className="acc-coins-label">{t("header.coins")}</span>
            </div>

            <div className="acc-header-actions">
              <Link
                to="/eleve/panier"
                className="acc-cart-link"
                onClick={() => enregistrerActiviteCoins()}
              >
                Panier
              </Link>

              <Link
                to="/eleve/calendrier"
                className="acc-calendar-link"
                onClick={() => enregistrerActiviteCoins()}
              >
                Calendrier
              </Link>
            </div>

            <div className="fb-notif-wrapper" ref={notifRef}>
              <button
                className={`fb-notif-btn ${notifOpen ? "active" : ""}`}
                type="button"
                onClick={() => {
                  enregistrerActiviteCoins();
                  setNotifOpen(!notifOpen);
                }}
              >
                🔔
                {notifNonLues > 0 && (
                  <span className="fb-notif-count">
                    {notifNonLues > 9 ? "9+" : notifNonLues}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fb-notif-panel">
                  <div className="fb-notif-head">
                    <h2>Notifications</h2>

                    <button type="button" onClick={toutMarquerLu}>
                      Tout lire
                    </button>
                  </div>

                  <div className="fb-notif-tabs">
                    <button
                      type="button"
                      className={notifFiltre === "tout" ? "active" : ""}
                      onClick={() => {
                        enregistrerActiviteCoins();
                        setNotifFiltre("tout");
                      }}
                    >
                      Tout
                    </button>

                    <button
                      type="button"
                      className={notifFiltre === "non-lu" ? "active" : ""}
                      onClick={() => {
                        enregistrerActiviteCoins();
                        setNotifFiltre("non-lu");
                      }}
                    >
                      Non lu
                    </button>
                  </div>

                  <div className="fb-notif-list">
                    {notificationsAffichees.length > 0 ? (
                      notificationsAffichees.map((n) => (
                        <div
                          key={n._id}
                          className={`fb-notif-item ${!n.lu ? "unread" : ""} ${
                            n.type === "marketplace"
                              ? "marketplace-notif"
                              : n.type === "quiz"
                              ? "quiz-notif"
                              : ""
                          }`}
                          role="button"
                          tabIndex={0}
                          onClick={() => ouvrirNotification(n)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") ouvrirNotification(n);
                          }}
                        >
                          <div className={`fb-notif-icon ${n.type}`}>
                            {getNotificationIcon(n.type)}
                          </div>

                          <div className="fb-notif-content">
                            <p>
                              <strong>{n.titre}</strong>
                            </p>

                            <p className="fb-notif-message">{n.message}</p>

                            <span>
                              {new Date(n.createdAt).toLocaleString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="fb-notif-delete"
                            onClick={(e) => supprimerNotification(e, n._id)}
                          >
                            ×
                          </button>

                          {!n.lu && <span className="fb-notif-dot" />}
                        </div>
                      ))
                    ) : (
                      <div className="fb-notif-empty">
                        {notifFiltre === "non-lu"
                          ? "Aucune notification non lue"
                          : "Aucune notification"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/eleve/profile"
              className="acc-user-badge acc-user-link"
              onClick={() => enregistrerActiviteCoins()}
            >
              <span className="acc-user-avatar">
                {profil?.avatar || utilisateur?.avatar ? (
                  <img
                    src={getAvatarUrl(profil?.avatar || utilisateur?.avatar)}
                    alt="Avatar"
                  />
                ) : (
                  (utilisateur?.user_first_name || "?")[0].toUpperCase()
                )}
              </span>

              <span className="acc-user-name">
                {utilisateur?.user_first_name} {utilisateur?.user_last_name}
              </span>
            </Link>

            <button
              className="acc-logout-btn"
              type="button"
              onClick={() => {
                deconnexion();
                navigate("/login");
              }}
            >
              {t("header.logout")}
            </button>
          </div>
        </header>

        <div className="acc-welcome-bar">
          <div className="acc-welcome-left">
            <span className="acc-welcome-greet">
              {getBonjour(heure)}, {utilisateur?.user_first_name} —
            </span>

            <span className="acc-welcome-niveau">
              {t("accueil.niveau")} : <strong>{t("accueil.niveaux")[niveauIdx]}</strong>
            </span>
          </div>

          {nextGoal && (
            <div className="acc-level-bar">
              <div className="acc-level-bar-track">
                <div
                  className="acc-level-bar-fill"
                  style={{ width: `${niveauPct}%` }}
                />
              </div>

              <span className="acc-level-bar-label">
                {solde} / {nextGoal} coins
              </span>
            </div>
          )}

          <div className="acc-session-badge">
            {t("accueil.cycleCoins")} : {formatSecondes(tempsCycleCoins)} / 30:00 ·{" "}
            {actionsCycle} {t("accueil.actions")}
          </div>
        </div>

        <main className="acc-main">
          <section className="acc-panel">
            <div className="acc-panel-head">
              <h2 className="acc-panel-title">{t("accueil.marketTitle")}</h2>
              <p className="acc-panel-sub">{t("accueil.marketSub")}</p>
            </div>

            <div className="acc-panel-body">
              {produits.length > 0 ? (
                produits.map((p) => (
                  <div key={p._id} className="acc-mp-item">
                    <div className="acc-mp-thumb">
                      {p.photo ? (
                        <img
                          src={`http://localhost:5002${p.photo}`}
                          alt={p.nom}
                        />
                      ) : (
                        <div className="acc-mp-placeholder" />
                      )}
                    </div>

                    <div className="acc-mp-info">
                      <span className="acc-mp-name">{p.nom}</span>
                      <span className="acc-mp-price">
                        <strong>{p.prixEnCoins}</strong> {t("accueil.coinsUnit")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="acc-empty">{t("accueil.noProducts")}</p>
              )}
            </div>

            <div className="acc-panel-footer">
              <Link
                to="/eleve/marketplace"
                className="acc-see-all"
                onClick={() => enregistrerActiviteCoins()}
              >
                {t("accueil.seeAll")}
              </Link>
            </div>
          </section>

          <section className="acc-panel">
            <div className="acc-panel-head">
              <h2 className="acc-panel-title">{t("accueil.coursesTitle")}</h2>
              <p className="acc-panel-sub">{t("accueil.coursesSub")}</p>
            </div>

            <div className="acc-courses-list">
              {coursAccueil.length > 0 ? (
                coursAccueil.map((c) => (
                  <div key={c._id} className="acc-course-item">
                    <div
                      className="acc-course-stripe"
                      style={{ background: "#7C4DFF" }}
                    />

                    <div className="acc-course-info">
                      <span className="acc-course-title">{c.titre}</span>
                      <span className="acc-course-desc">
                        {c.description || c.matiere}
                      </span>

                      <div className="acc-course-meta">
                        <span
                          className="acc-course-tag"
                          style={{
                            color: "#7C4DFF",
                            background: "rgba(124,77,255,0.10)",
                            border: "1px solid rgba(124,77,255,0.25)",
                          }}
                        >
                          Niveau {c.niveau}
                        </span>

                        <span className="acc-course-dur">
                          +{c.coinsCompletion || 20} coins
                        </span>
                      </div>
                    </div>

                    <button
                      className="acc-course-btn"
                      style={{ background: "#7C4DFF" }}
                      onClick={() => {
                        enregistrerActiviteCoins(2);
                        navigate("/eleve/exercices");
                      }}
                      type="button"
                    >
                      {t("accueil.start")}
                    </button>
                  </div>
                ))
              ) : (
                <p className="acc-empty">Aucun cours disponible</p>
              )}
            </div>
          </section>

          <aside className="acc-dashboard">
            <div className="acc-dashboard-head">
              <h2 className="acc-panel-title">{t("accueil.statsTitle")}</h2>
            </div>

            {stats.map((s) => {
              const pct = s.max
                ? Math.min(100, Math.round((s.value / s.max) * 100))
                : 0;

              return (
                <div key={s.key} className="acc-stat-row">
                  <div className="acc-stat-circle">
                    <ProgressCircle
                      value={s.value}
                      max={s.max}
                      color={s.color}
                      size={56}
                    />

                    <span
                      className="acc-stat-circle-val"
                      style={{ color: s.color }}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="acc-stat-info">
                    <span className="acc-stat-label">{s.label}</span>

                    <span className="acc-stat-value">
                      {s.key === "time" ? formatTemps(s.value) : s.value}
                      <span className="acc-stat-unit">
                        {s.key === "time" ? "" : s.unit}
                      </span>
                    </span>

                    <div className="acc-stat-bar">
                      <div
                        className="acc-stat-bar-fill"
                        style={{ width: `${pct}%`, background: s.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {nextGoal && (
              <div className="acc-next-goal">
                <span className="acc-next-goal-label">{t("accueil.nextGoal")}</span>

                <span className="acc-next-goal-val">
                  {nextGoal - solde} coins restants
                </span>

                <div className="acc-next-goal-bar">
                  <div
                    className="acc-next-goal-fill"
                    style={{ width: `${niveauPct}%` }}
                  />
                </div>

                <span className="acc-next-goal-niveau">
                  {t("accueil.niveaux")[niveauIdx + 1] || t("accueil.niveaux")[4]}
                </span>
              </div>
            )}
          </aside>
        </main>

        <footer className="acc-footer">
          <span className="acc-footer-logo">SOURDI</span>
          <span className="acc-footer-text">{t("accueil.footerText")} · © 2025</span>
        </footer>
      </div>

      {accesBloque && (
        <div className="acc-access-overlay">
          <div className="acc-access-card">
            <div className="acc-access-icon">🔒</div>

            <h2>
              {utilisateur?.statutAcces === "refuse"
                ? "Demande refusée"
                : "Accès en attente"}
            </h2>

            <p>
              {utilisateur?.statutAcces === "refuse"
                ? "Votre demande d'accès a été refusée par l'administrateur."
                : "Votre compte a été validé par email mais doit encore être accepté par un administrateur."}
            </p>

            <div className="acc-access-info">
              Vous pouvez toujours utiliser la messagerie pour contacter
              l'administration.
            </div>

            <button
              className="acc-access-logout"
              type="button"
              onClick={() => {
                deconnexion();
                navigate("/login");
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}

      <EleveMessageBox />

      {!accesBloque && <SourdiHelperChat student={utilisateur} />}
    </div>
  );
}