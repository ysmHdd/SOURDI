import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Marketplace = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [solde, setSolde] = useState(0);
  const [message, setMessage] = useState("");

  const charger = async () => {
    try {
      const [produitsRes, coinsRes] = await Promise.all([
        axios.get("http://localhost:5003/api/eleve/marketplace"),
        axios.get("http://localhost:5003/api/eleve/coins/solde"),
      ]);
      setProduits(produitsRes.data);
      setSolde(coinsRes.data.solde);
    } catch (err) {
      console.error(err);
    }
  };

  const acheter = async (idProduit) => {
    try {
      const res = await axios.post(`http://localhost:5003/api/eleve/marketplace/acheter/${idProduit}`);
      setMessage(`${res.data.message} — Solde restant: ${res.data.soldeRestant} coins`);
      charger();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Erreur lors de l'achat"}`);
    }
  };

  useEffect(() => { charger(); }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.retour} onClick={() => navigate("/eleve")}>← Retour</button>
        <h2 style={styles.titre}>Marketplace SOURDI</h2>
        <span style={styles.solde}>{solde} coins</span>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.grid}>
        {produits.map((p) => (
          <div key={p._id} style={styles.card}>
            <h3 style={styles.cardTitre}>{p.nom}</h3>
            <p style={styles.cardDesc}>{p.description}</p>
            <p><strong>{p.prixEnCoins}</strong> coins</p>
            <p>Stock: {p.stock}</p>
            <span style={styles.badge}>{p.categorie}</span>
            <button
              style={{ ...styles.bouton, backgroundColor: solde >= p.prixEnCoins ? "#4f46e5" : "#ccc" }}
              onClick={() => acheter(p._id)}
              disabled={solde < p.prixEnCoins}
            >
              {solde >= p.prixEnCoins ? "Acheter" : "Coins insuffisants"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", backgroundColor: "white", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  titre: { color: "#333", margin: 0, flex: 1 },
  retour: { padding: "8px 16px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  solde: { fontWeight: "bold", color: "#4f46e5", fontSize: "18px" },
  message: { padding: "12px", backgroundColor: "white", borderRadius: "8px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" },
  card: { backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  cardTitre: { color: "#4f46e5", margin: "0 0 8px" },
  cardDesc: { color: "#666", fontSize: "14px" },
  badge: { display: "inline-block", padding: "4px 10px", backgroundColor: "#e0e7ff", color: "#4f46e5", borderRadius: "20px", fontSize: "12px", marginRight: "8px" },
  bouton: { width: "100%", padding: "10px", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "12px", fontSize: "14px" },
};

export default Marketplace;