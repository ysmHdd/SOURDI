import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Inscription = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", motDePasse: "" });
  const [erreur, setErreur] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/inscription", form);
      navigate("/login");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titre}>SOURDI</h2>
        <h3 style={styles.sousTitre}>Inscription</h3>
        {erreur && <p style={styles.erreur}>{erreur}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" name="nom" placeholder="Nom complet" value={form.nom} onChange={handleChange} required />
          <input style={styles.input} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} type="password" name="motDePasse" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} required />
          <button style={styles.bouton} type="submit">S'inscrire</button>
        </form>
        <p style={styles.lien}>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "360px" },
  titre: { textAlign: "center", color: "#4f46e5", fontSize: "28px", marginBottom: "4px" },
  sousTitre: { textAlign: "center", color: "#333", marginBottom: "24px" },
  input: { width: "100%", padding: "12px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" },
  bouton: { width: "100%", padding: "12px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  erreur: { color: "red", textAlign: "center", marginBottom: "12px" },
  lien: { textAlign: "center", marginTop: "16px", fontSize: "14px" },
};

export default Inscription;