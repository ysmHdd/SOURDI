import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Utilisateurs = () => {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/admin/utilisateurs");
      setUtilisateurs(res.data);
    } catch {
      setErreur("Erreur lors du chargement");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`http://localhost:5002/api/admin/utilisateurs/${id}`);
      charger();
    } catch {
      setErreur("Erreur lors de la suppression");
    }
  };

  useEffect(() => { charger(); }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.retour} onClick={() => navigate("/admin")}>← Retour</button>
        <h2 style={styles.titre}>Gestion des Utilisateurs</h2>
      </div>
      {erreur && <p style={styles.erreur}>{erreur}</p>}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Rôle</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((u) => (
            <tr key={u._id} style={styles.tr}>
              <td style={styles.td}>{u.nom}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, backgroundColor: u.role === "admin" ? "#4f46e5" : "#10b981" }}>
                  {u.role}
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.boutonSupp} onClick={() => supprimer(u._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  titre: { color: "#333", margin: 0 },
  retour: { padding: "8px 16px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  erreur: { color: "red" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  thead: { backgroundColor: "#4f46e5" },
  th: { padding: "14px 16px", color: "white", textAlign: "left" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "14px 16px", color: "#333" },
  badge: { padding: "4px 10px", borderRadius: "20px", color: "white", fontSize: "12px" },
  boutonSupp: { padding: "6px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default Utilisateurs;