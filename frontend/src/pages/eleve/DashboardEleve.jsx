import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

const DashboardEleve = () => {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const [profil, setProfil] = useState(null);
  const [kpi, setKpi] = useState({ lessonsCompletes: 0, tempsPasseEnMinutes: 0, nombreConnexions: 0, autoEvaluation: 0 });

  const charger = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/eleve/profil");
      setProfil(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const mettreAJourKPI = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:5003/api/eleve/coins/kpi", kpi);
      charger();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { charger(); }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titre}>SOURDI — Élève</h1>
        <div>
          <span style={styles.nom}>👤 {utilisateur?.nom}</span>
          <button style={styles.boutonLogout} onClick={() => { deconnexion(); navigate("/login"); }}>Déconnexion</button>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Solde Sourdi Coins</h3>
          <p style={styles.solde}>{profil?.solde ?? 0} coins</p>
        </div>
        <div style={styles.card}>
          <h3>Mes KPI</h3>
          <p>Leçons: {profil?.kpi?.lessonsCompletes ?? 0}</p>
          <p>Temps: {profil?.kpi?.tempsPasseEnMinutes ?? 0} min</p>
          <p>Connexions: {profil?.kpi?.nombreConnexions ?? 0}</p>
          <p>Auto-éval: {profil?.kpi?.autoEvaluation ?? 0}/10</p>
        </div>
      </div>

      <div style={styles.formCard}>
        <h3>Mettre à jour mes KPI</h3>
        <form onSubmit={mettreAJourKPI} style={styles.form}>
          <input style={styles.input} type="number" placeholder="Leçons complétées" value={kpi.lessonsCompletes} onChange={(e) => setKpi({ ...kpi, lessonsCompletes: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Temps (minutes)" value={kpi.tempsPasseEnMinutes} onChange={(e) => setKpi({ ...kpi, tempsPasseEnMinutes: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Connexions" value={kpi.nombreConnexions} onChange={(e) => setKpi({ ...kpi, nombreConnexions: e.target.value })} />
          <input style={styles.input} type="number" min="0" max="10" placeholder="Auto-évaluation (0-10)" value={kpi.autoEvaluation} onChange={(e) => setKpi({ ...kpi, autoEvaluation: e.target.value })} />
          <button style={styles.bouton} type="submit">Mettre à jour</button>
        </form>
      </div>

      <Link to="/eleve/marketplace" style={styles.lienMarket}>🛍️ Aller à la Marketplace</Link>
    </div>
  );
};

const styles = {
  container: { padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "16px 24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  titre: { color: "#4f46e5", margin: 0 },
  nom: { marginRight: "16px" },
  boutonLogout: { padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" },
  card: { backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  solde: { fontSize: "36px", fontWeight: "bold", color: "#4f46e5" },
  formCard: { backgroundColor: "white", padding: "24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  form: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" },
  bouton: { padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", gridColumn: "span 2" },
  lienMarket: { display: "inline-block", padding: "14px 24px", backgroundColor: "#10b981", color: "white", borderRadius: "12px", textDecoration: "none", fontSize: "16px" },
};

export default DashboardEleve;