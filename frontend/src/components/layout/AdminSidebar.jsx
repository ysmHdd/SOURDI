import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
<<<<<<< HEAD
=======
import axios from "../../api/axios";
>>>>>>> origin/notifcalendrier
import {
  getConversationsAdmin,
  getSignalementsAdmin,
} from "../../api/messageApi";

<<<<<<< HEAD
=======
const API = "http://localhost:5002";

>>>>>>> origin/notifcalendrier
const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();

  const [nouveauxMessages, setNouveauxMessages] = useState(false);
  const [nouveauxSignalements, setNouveauxSignalements] = useState(false);
<<<<<<< HEAD
=======
  const [nouvellesDemandes, setNouvellesDemandes] = useState(false);
>>>>>>> origin/notifcalendrier

  useEffect(() => {
    const chargerNotifications = async () => {
      try {
<<<<<<< HEAD
        const [messagesRes, signalementsRes] = await Promise.all([
          getConversationsAdmin(),
          getSignalementsAdmin(),
        ]);
=======
        const [messagesRes, signalementsRes, utilisateursRes] =
          await Promise.all([
            getConversationsAdmin(),
            getSignalementsAdmin(),
            axios.get(`${API}/api/admin/utilisateurs`),
          ]);
>>>>>>> origin/notifcalendrier

        const existeNouveauMessage = messagesRes.data?.some(
          (conversation) => conversation.statut === "nouveau"
        );

        const existeNouveauSignalement = signalementsRes.data?.some(
          (signalement) => signalement.statut === "nouveau"
        );

<<<<<<< HEAD
        setNouveauxMessages(existeNouveauMessage);
        setNouveauxSignalements(existeNouveauSignalement);
=======
        const existeNouvelleDemande = utilisateursRes.data?.some(
          (utilisateur) =>
            utilisateur.role === "etudiant" &&
            utilisateur.statutAcces === "en_attente"
        );

        setNouveauxMessages(existeNouveauMessage);
        setNouveauxSignalements(existeNouveauSignalement);
        setNouvellesDemandes(existeNouvelleDemande);
>>>>>>> origin/notifcalendrier
      } catch (erreur) {
        console.error(erreur);
      }
    };

    chargerNotifications();
<<<<<<< HEAD
=======

>>>>>>> origin/notifcalendrier
    const interval = setInterval(chargerNotifications, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleDeconnexion = () => {
    deconnexion();
    navigate("/login");
  };

  const menu = [
    {
      label: "Dashboard",
      path: "/admin",
      notification: false,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
        </svg>
      ),
    },
    {
<<<<<<< HEAD
=======
      label: "Demandes",
      path: "/admin/demandes",
      notification: nouvellesDemandes,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
>>>>>>> origin/notifcalendrier
      label: "Utilisateurs",
      path: "/admin/utilisateurs",
      notification: false,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Produits",
      path: "/admin/produits",
      notification: false,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2l1.5 4h9L18 2" />
          <path d="M3 6h18l-1.5 14H4.5L3 6z" />
        </svg>
      ),
    },
    {
      label: "Exercices",
      path: "/admin/exercices",
      notification: false,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      label: "Messages",
      path: "/admin/messages",
      notification: nouveauxMessages,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      ),
    },
    {
      label: "Signalements",
      path: "/admin/signalements",
      notification: nouveauxSignalements,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <h1 className="brand-title">SOURDI Admin</h1>
        </div>

        <div className="profile-box">
          <div className="avatar">
            {(utilisateur?.user_first_name || utilisateur?.nom || "A")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-text">
            <p className="profile-role">Administrator</p>
<<<<<<< HEAD
=======

>>>>>>> origin/notifcalendrier
            <p className="profile-name">
              {utilisateur?.user_first_name
                ? `${utilisateur.user_first_name} ${utilisateur.user_last_name}`
                : utilisateur?.nom || "Admin"}
            </p>
          </div>
        </div>

        <nav className="nav">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
<<<<<<< HEAD
=======

>>>>>>> origin/notifcalendrier
                <span>{item.label}</span>

                {item.notification && <span className="nav-red-dot" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="bottom-actions">
        <button className="logout-btn" onClick={handleDeconnexion}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
<<<<<<< HEAD

=======
>>>>>>> origin/notifcalendrier
export default AdminSidebar;