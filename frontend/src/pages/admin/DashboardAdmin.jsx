import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const DashboardAdmin = () => {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexion();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titre}>SOURDI — Admin</h1>
        <div>
          <span style={styles.nom}>👤 {utilisateur?.nom}</span>
          <button style={styles.boutonLogout} onClick={handleDeconnexion}>Déconnexion</button>
        </div>
      </div>
      <div style={styles.grid}>
        <Link to="/admin/utilisateurs" style={styles.card}>
          <div style={styles.icone}>👥</div>
          <h3>Utilisateurs</h3>
          <p>Gérer les comptes</p>
        </Link>
        <Link to="/admin/produits" style={styles.card}>
          <div style={styles.icone}>🛍️</div>
          <h3>Produits</h3>
          <p>Gérer la marketplace</p>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "16px 24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  titre: { color: "#4f46e5", margin: 0 },
  nom: { marginRight: "16px", color: "#333" },
  boutonLogout: { padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
  card: { backgroundColor: "white", padding: "32px", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "transform 0.2s" },
  icone: { fontSize: "48px", marginBottom: "12px" },
};

export default DashboardAdmin;