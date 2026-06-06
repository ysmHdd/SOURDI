import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "../../styles/adminLayout.css";
import axios from "../../api/axios";

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const chargerDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5002/api/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Erreur dashboard admin :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDashboard();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Élèves inscrits",
        value: stats?.totalEleves || 0,
        sub: `+${stats?.nouveauxEleves || 0} cette semaine`,
        color: "#7C4DFF",
        bg: "#F3EFFF",
        icon: "students",
        link: "/admin/utilisateurs",
        trend: "+12%",
      },
      {
        label: "Cours disponibles",
        value: stats?.totalCours || 0,
        sub: "Contenu pédagogique",
        color: "#FF7043",
        bg: "#FFF2EE",
        icon: "courses",
        link: "/admin/exercices",
        trend: "+5%",
      },
      {
        label: "Produits Marketplace",
        value: stats?.totalProduits || 0,
        sub: "Produits publiés",
        color: "#EF5350",
        bg: "#FFEEEE",
        icon: "products",
        link: "/admin/produits",
        trend: "+8%",
      },
      {
        label: "Demandes d'accès",
        value: stats?.demandesEnAttente || 0,
        sub: "En attente de validation",
        color: "#26C6DA",
        bg: "#E8FAFB",
        icon: "requests",
        link: "/admin/demandes",
        trend: "En cours",
      },
    ],
    [stats]
  );

  const renderIcon = (type) => {
    const icons = {
      students: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M17 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      courses: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
        </svg>
      ),
      products: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2l1.5 4h9L18 2" />
          <path d="M3 6h18l-1.5 14H4.5L3 6z" />
        </svg>
      ),
      requests: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    };

    return icons[type] || null;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main dash-v2">
        <header className="dash-topbar">
          <div>
            <p className="dash-topbar-breadcrumb">Administration SOURDI</p>
            <h1 className="dash-topbar-title">Tableau de bord</h1>
          </div>

          <button onClick={chargerDashboard} className="dash-refresh-btn">
            Actualiser
          </button>
        </header>

        {loading ? (
          <div className="dash-v2-loading">
            <div className="dash-spinner" />
            <p>Chargement du tableau de bord...</p>
          </div>
        ) : (
          <>
            <section className="dash-v2-cards">
              {cards.map((card, i) => (
                <Link to={card.link} key={i} className="dash-v2-card">
                  <div
                    className="dash-v2-card-icon"
                    style={{ background: card.bg, color: card.color }}
                  >
                    {renderIcon(card.icon)}
                  </div>

                  <div className="dash-v2-card-body">
                    <p className="dash-v2-card-label">{card.label}</p>
                    <h2
                      className="dash-v2-card-value"
                      style={{ color: card.color }}
                    >
                      {Number(card.value).toLocaleString()}
                    </h2>
                    <p className="dash-v2-card-sub">{card.sub}</p>
                  </div>

                  <span
                    className="dash-v2-card-trend"
                    style={{ color: card.color, background: card.bg }}
                  >
                    {card.trend}
                  </span>
                </Link>
              ))}
            </section>

            <section className="dash-v2-grid">
              <div className="dash-v2-panel">
                <div className="dash-v2-panel-header">
                  <div>
                    <h3>Derniers élèves</h3>
                    <p>Nouveaux inscrits récents</p>
                  </div>

                  <Link to="/admin/utilisateurs" className="dash-v2-see-all">
                    Voir tout
                  </Link>
                </div>

                <table className="dash-v2-table">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Email</th>
                      <th>Inscrit le</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats?.derniersUtilisateurs?.length > 0 ? (
                      stats.derniersUtilisateurs.map((user) => {
                        const name = `${user.user_first_name || ""} ${
                          user.user_last_name || ""
                        }`.trim() || "Élève";

                        const initials = name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();

                        return (
                          <tr key={user._id}>
                            <td>
                              <div className="dash-v2-user">
                                <div className="dash-v2-avatar">{initials}</div>
                                <strong>{name}</strong>
                              </div>
                            </td>

                            <td className="dash-v2-muted">
                              {user.user_email || "—"}
                            </td>

                            <td className="dash-v2-muted">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                                : "—"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="dash-v2-empty">
                          Aucun élève récent.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="dash-v2-panel">
                <div className="dash-v2-panel-header">
                  <div>
                    <h3>Derniers produits</h3>
                    <p>Produits marketplace ajoutés</p>
                  </div>

                  <Link to="/admin/produits" className="dash-v2-see-all">
                    Voir tout
                  </Link>
                </div>

                <div className="dash-v2-product-list">
                  {stats?.derniersProduits?.length > 0 ? (
                    stats.derniersProduits.map((produit) => (
                      <div className="dash-v2-product-row" key={produit._id}>
                        <div className="dash-v2-product-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2l1.5 4h9L18 2" />
                            <path d="M3 6h18l-1.5 14H4.5L3 6z" />
                          </svg>
                        </div>

                        <div className="dash-v2-product-info">
                          <strong>
                            {produit.nom || produit.titre || "Produit"}
                          </strong>
                          <span>
                            {produit.description || "Produit marketplace"}
                          </span>
                        </div>

                        <span className="dash-v2-product-date">
                          {produit.createdAt
                            ? new Date(produit.createdAt).toLocaleDateString("fr-FR")
                            : "—"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="dash-v2-empty">Aucun produit récent.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="dash-v2-actions">
              <h3>Actions rapides</h3>

              <div className="dash-v2-action-btns">
                <Link
                  to="/admin/produits"
                  className="dash-v2-action-btn"
                  style={{ background: "#7C4DFF" }}
                >
                  Ajouter un produit
                </Link>

                <Link
                  to="/admin/exercices"
                  className="dash-v2-action-btn"
                  style={{ background: "#FF7043" }}
                >
                  Ajouter un cours
                </Link>

                <Link
                  to="/admin/utilisateurs"
                  className="dash-v2-action-btn"
                  style={{ background: "#26C6DA" }}
                >
                  Gérer les utilisateurs
                </Link>

                <Link
                  to="/admin/demandes"
                  className="dash-v2-action-btn"
                  style={{ background: "#EF5350" }}
                >
                  Voir les demandes
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardAdmin;