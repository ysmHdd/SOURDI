import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import { useTranslation } from "react-i18next";
import {
  FaBell,
  FaComments,
  FaShoppingCart,
  FaCalendarAlt,
  FaClipboardCheck,
  FaCog,
} from "react-icons/fa";
import "./eleveHeader.css";

const API_ELEVE = "http://localhost:5003/api/eleve";
const API_COINS = "http://localhost:5005/api/coins";
const API_NOTIF = "http://localhost:5009/api/notifications";

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

const getNotificationIcon = (type) => {
  switch (type) {
    case "message":
      return <FaComments />;

    case "marketplace":
      return <FaShoppingCart />;

    case "calendrier":
      return <FaCalendarAlt />;

    case "quiz":
      return <FaClipboardCheck />;

    case "systeme":
      return <FaCog />;

    default:
      return <FaBell />;
  }
};

export default function EleveHeader({
  lang,
  setLang,
  dark,
  setDark,
  enregistrerActiviteCoins = () => {},
}) {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const [profil, setProfil] = useState(null);
  const [solde, setSolde] = useState(0);
  const [streak, setStreak] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifNonLues, setNotifNonLues] = useState(0);
  const [notifFiltre, setNotifFiltre] = useState("tout");

  const { t, i18n } = useTranslation();

  const changeLanguage = (newLang) => {
    enregistrerActiviteCoins();

    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);

    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    if (setLang) {
      setLang(newLang);
    }
  };

  const chargerHeader = async () => {
    try {
      const [profilRes, soldeRes, statsRes, notifRes, countRes] =
        await Promise.all([
          axios.get(`${API_ELEVE}/profil`).catch(() => ({ data: null })),
          axios.get(`${API_ELEVE}/coins/solde`).catch(() => ({ data: null })),
          axios.get(`${API_COINS}/stats`).catch(() => ({ data: null })),
          axios.get(API_NOTIF).catch(() => ({ data: [] })),
          axios.get(`${API_NOTIF}/non-lues`).catch(() => ({ data: null })),
        ]);

      setProfil(profilRes.data);
      setSolde(soldeRes.data?.solde || 0);
      setStreak(statsRes.data?.streak || 0);
      setNotifications(notifRes.data || []);
      setNotifNonLues(countRes.data?.total || 0);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const ouvrirNotification = async (notification) => {
    try {
      enregistrerActiviteCoins();

      if (!notification.lu) {
        await axios.patch(`${API_NOTIF}/${notification._id}/lue`);
      }

      setNotifOpen(false);
      await chargerHeader();

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
      await axios.patch(`${API_NOTIF}/tout-lu`);
      await chargerHeader();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  const supprimerNotification = async (e, id) => {
    e.stopPropagation();

    try {
      enregistrerActiviteCoins();
      await axios.delete(`${API_NOTIF}/${id}`);
      await chargerHeader();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  useEffect(() => {
    chargerHeader();

    const interval = setInterval(chargerHeader, 10000);

    window.addEventListener("focus", chargerHeader);
    window.addEventListener("coins-updated", chargerHeader);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", chargerHeader);
      window.removeEventListener("coins-updated", chargerHeader);
    };
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

  const notificationsAffichees =
    notifFiltre === "non-lu"
      ? notifications.filter((n) => !n.lu)
      : notifications;

  return (
    <header className="acc-header">
      <div className="acc-header-left">
        <span className="acc-logo">SOURDI</span>
        <span className="acc-tagline">{t("header.tagline")}</span>
      </div>

      <div className="acc-header-center">
        <button
          className={`acc-lang-btn ${i18n.language === "fr" ? "active" : ""}`}
          onClick={() => changeLanguage("fr")}
          type="button"
        >
          FR
        </button>

        <button
          className={`acc-lang-btn ${i18n.language === "en" ? "active" : ""}`}
          onClick={() => changeLanguage("en")}
          type="button"
        >
          EN
        </button>

        <button
          className={`acc-lang-btn ${i18n.language === "ar" ? "active" : ""}`}
          onClick={() => changeLanguage("ar")}
          type="button"
        >
          AR
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
          {dark ? t("header.light") : t("header.dark")}
        </button>
      </div>

      <div className="acc-header-right">
        <div className="acc-streak-badge">
          {streak || 0} {t("header.streak")}
        </div>

        <div className="acc-coins-badge">
          <span className="acc-coins-val">{solde}</span>
          <span className="acc-coins-label">{t("header.coins")}</span>
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
            <FaBell />
            {notifNonLues > 0 && (
              <span className="fb-notif-count">
                {notifNonLues > 9 ? "9+" : notifNonLues}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="fb-notif-panel">
              <div className="fb-notif-head">
                <h2>{t("notifications.title")}</h2>

                <button type="button" onClick={toutMarquerLu}>
                  {t("notifications.markAllRead")}
                </button>
              </div>

              <div className="fb-notif-tabs">
                <button
                  type="button"
                  className={notifFiltre === "tout" ? "active" : ""}
                  onClick={() => setNotifFiltre("tout")}
                >
                  {t("notifications.all")}
                </button>

                <button
                  type="button"
                  className={notifFiltre === "non-lu" ? "active" : ""}
                  onClick={() => setNotifFiltre("non-lu")}
                >
                  {t("notifications.unread")}
                </button>
              </div>

              <div className="fb-notif-list">
                {notificationsAffichees.length > 0 ? (
                  notificationsAffichees.map((n) => (
                    <div
                      key={n._id}
                      className={`fb-notif-item ${!n.lu ? "unread" : ""}`}
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
                      ? t("notifications.noUnread")
                      : t("notifications.empty")}
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
  );
}