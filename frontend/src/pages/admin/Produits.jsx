import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Produits = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: "", description: "", prixEnCoins: "", stock: "", categorie: "cours" });
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/admin/produits");
      setProduits(res.data);
    } catch {
      setErreur("Erreur chargement produits");
    }
  };

  const creer = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/api/admin/produits", form);
      setForm({ nom: "", description: "", prixEnCoins: "", stock: "", categorie: "cours" });
      charger();
    } catch {
      setErreur("Erreur création produit");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:5002/api/admin/produits/${id}`);
      charger();
    } catch {
      setErreur("Erreur suppression");
    }
  };

  useEffect(() => { charger(); }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.retour} onClick={() => navigate("/admin")}>← Retour</button>
        <h2 style={styles.titre}>Gestion des Produits</h2>
      </div>
      {erreur && <p style={styles.erreur}>{erreur}</p>}

      <div style={styles.formCard}>
        <h3>Ajouter un produit</h3>
        <form onSubmit={creer} style={styles.form}>
          <input style={styles.input} placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
          <input style={styles.input} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input style={styles.input} type="number" placeholder="Prix en Coins" value={form.prixEnCoins} onChange={(e) => setForm({ ...form, prixEnCoins: e.target.value })} required />
          <input style={styles.input} type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <select style={styles.input} value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}>
            <option value="cours">Cours</option>
            <option value="livre">Livre</option>
            <option value="autre">Autre</option>
          </select>
          <button style={styles.bouton} type="submit">Ajouter</button>
        </form>
      </div>

      <div style={styles.grid}>
        {produits.map((p) => (
          <div key={p._id} style={styles.card}>
            <h3 style={styles.cardTitre}>{p.nom}</h3>
            <p style={styles.cardDesc}>{p.description}</p>
            <p>💰 <strong>{p.prixEnCoins}</strong> coins</p>
            <p>📦 Stock: {p.stock}</p>
            <span style={styles.badge}>{p.categorie}</span>
            <button style={styles.boutonSupp} onClick={() => supprimer(p._id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", minHeight: "100vh", backgroundColor: "#f0f2f5" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" },
  titre: { color: "#333", margin: 0 },
  retour: { padding: "8px 16px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  erreur: { color: "red" },
  formCard: { backgroundColor: "white", padding: "24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  form: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" },
  bouton: { padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", gridColumn: "span 2" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" },
  card: { backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  cardTitre: { color: "#4f46e5", margin: "0 0 8px" },
  cardDesc: { color: "#666", fontSize: "14px" },
  badge: { display: "inline-block", padding: "4px 10px", backgroundColor: "#e0e7ff", color: "#4f46e5", borderRadius: "20px", fontSize: "12px", marginRight: "8px" },
  boutonSupp: { padding: "6px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "12px" },
};

export default Produits;