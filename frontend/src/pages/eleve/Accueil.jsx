import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";
import EleveMessageBox from "../../components/messages/EleveMessageBox";
import SourdiHelperChat from "../../components/ai/SourdiHelperChat";
import EleveHeader from "../../components/layout/EleveHeader";
import EleveSidebar from "../../components/layout/EleveSidebar";
import EleveFooter from "../../components/layout/EleveFooter";


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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const nextGoal = getNextGoalCoins(solde);
  const niveauPct = nextGoal ? Math.round((solde / nextGoal) * 100) : 100;

  const notificationsAffichees =
    notifFiltre === "non-lu"
      ? notifications.filter((n) => !n.lu)
      : notifications;


  return (
    <div className={`acc-root ${dark ? "dark" : "light"}`}>
      <div className="acc-blob acc-blob-1" />
      <div className="acc-blob acc-blob-2" />

      <div className={accesBloque ? "acc-blurred-content" : ""}>
        <EleveHeader
          t={t}
          lang={lang}
          setLang={setLang}
          dark={dark}
          setDark={setDark}
          solde={solde}
          streak={streak}
          profil={profil}
          utilisateur={utilisateur}
          notifRef={notifRef}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          notifNonLues={notifNonLues}
          notifFiltre={notifFiltre}
          setNotifFiltre={setNotifFiltre}
          notificationsAffichees={notificationsAffichees}
          enregistrerActiviteCoins={enregistrerActiviteCoins}
          ouvrirNotification={ouvrirNotification}
          toutMarquerLu={toutMarquerLu}
          supprimerNotification={supprimerNotification}
          getAvatarUrl={getAvatarUrl}
          getNotificationIcon={getNotificationIcon}
          deconnexion={deconnexion}
          navigate={navigate}
        />

        <div className="acc-layout">
          <EleveSidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            enregistrerActiviteCoins={enregistrerActiviteCoins}
          />

          <div className={`acc-page-content ${sidebarOpen ? "sidebar-open" : ""}`}>
            <div className="acc-welcome-bar">
          <div className="acc-welcome-left">
            <span className="acc-welcome-greet">
              {getBonjour(heure)}, {utilisateur?.user_first_name} —
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
                        <img src={`http://localhost:5002${p.photo}`} alt={p.nom} />
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
                      onClick={() => navigate("/eleve/exercices")}
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
        </main>

            <EleveFooter />
          </div>
        </div>
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