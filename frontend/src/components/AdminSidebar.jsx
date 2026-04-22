import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();

  const handleDeconnexion = () => {
    deconnexion();
    navigate("/login");
  };

  const menu = [
    {
      label: "Dashboard",
      path: "/admin",
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
      label: "Utilisateurs",
      path: "/admin/utilisateurs",
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
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2l1.5 4h9L18 2" />
          <path d="M3 6h18l-1.5 14H4.5L3 6z" />
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
            {utilisateur?.nom?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="profile-text">
            <p className="profile-role">Administrator</p>
            <p className="profile-name">{utilisateur?.nom}</p>
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
                <span>{item.label}</span>
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

export default AdminSidebar;