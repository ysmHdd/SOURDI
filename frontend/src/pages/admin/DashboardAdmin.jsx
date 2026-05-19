import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "../../styles/adminLayout.css";
import axios from "../../api/axios";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    eleves: 0,
    produits: 0,
    exercices: 0,
    transactions: 0,
  });

  useEffect(() => {
    const charger = async () => {
      try {
        const [u, p, e] = await Promise.all([
          axios.get("http://localhost:5002/api/admin/utilisateurs"),
          axios.get("http://localhost:5002/api/admin/produits"),
          axios.get("http://localhost:5004/api/exercices?niveau=1&matiere=maths"),
        ]);
        setStats({
          eleves: u.data?.length || 0,
          produits: p.data?.length || 0,
          exercices: "—",
          transactions: "—",
        });
      } catch (e) { console.error(e); }
    };
    charger();
  }, []);

  const cards = [
    {
      label: "Élèves inscrits",
      value: stats.eleves,
      color: "#AB47BC",
      bg: "linear-gradient(135deg, #F3E5F5, #EDE7F6)",
      link: "/admin/utilisateurs",
      linkLabel: "Gérer les élèves →",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: "Produits Marketplace",
      value: stats.produits,
      color: "#EF5350",
      bg: "linear-gradient(135deg, #FFEBEE, #FCE4EC)",
      link: "/admin/produits",
      linkLabel: "Gérer les produits →",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2l1.5 4h9L18 2"/>
          <path d="M3 6h18l-1.5 14H4.5L3 6z"/>
        </svg>
      ),
    },
    {
      label: "Exercices disponibles",
      value: stats.exercices,
      color: "#FF7043",
      bg: "linear-gradient(135deg, #FBE9E7, #FFF3E0)",
      link: "/admin/exercices",
      linkLabel: "Gérer les exercices →",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
    },
    {
      label: "Transactions coins",
      value: stats.transactions,
      color: "#26C6DA",
      bg: "linear-gradient(135deg, #E0F7FA, #E8EAF6)",
      link: "/admin/utilisateurs",
      linkLabel: "Voir les élèves →",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">

        <div className="admin-top-card">
          <span className="admin-top-label">Administration</span>
          <h2 className="admin-main-title">Tableau de bord</h2>
          <p className="admin-main-subtitle">Vue d'ensemble de la plateforme SOURDI</p>
        </div>

        {/* Stats grid */}
        <div className="admin-stats-grid">
          {cards.map((c, i) => (
            <div key={i} className="admin-stat-card" style={{ "--accent": c.color }}>
              <div className="admin-stat-icon" style={{ background: c.bg, color: c.color }}>
                {c.icon}
              </div>
              <div className="admin-stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="admin-stat-label">{c.label}</div>
              <Link to={c.link} className="admin-stat-link" style={{ color: c.color }}>{c.linkLabel}</Link>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="admin-top-card" style={{ marginTop: 24 }}>
          <h3 style={{ margin: "0 0 18px", color: "#322B45", fontWeight: 900 }}>Actions rapides</h3>
          <div className="admin-quick-actions">
            <Link to="/admin/produits" className="admin-quick-btn" style={{ background: "linear-gradient(135deg, #AB47BC, #EF5350)" }}>
              Ajouter un produit
            </Link>
            <Link to="/admin/exercices" className="admin-quick-btn" style={{ background: "linear-gradient(135deg, #FF7043, #FFB300)" }}>
              Ajouter un exercice
            </Link>
            <Link to="/admin/utilisateurs" className="admin-quick-btn" style={{ background: "linear-gradient(135deg, #26C6DA, #7C4DFF)" }}>
              Voir les élèves
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardAdmin;