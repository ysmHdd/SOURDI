import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "../../styles/adminLayout.css";
import axios from "../../api/axios";

const MATIERES = ["francais", "arabe", "maths", "sciences", "histoire"];
const NIVEAUX = [1, 2, 3, 4, 5, 6];

const vide = {
  matiere: "maths",
  niveau: 1,
  sousCat: "",
  question: "",
  options: ["", "", "", ""],
  reponse: 0,
  points: 10,
};

const Exercices = () => {
  const [exercices, setExercices] = useState([]);
  const [form, setForm] = useState(vide);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("maths");
  const [filtreNiveau, setFiltreNiveau] = useState(1);

  const charger = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5004/api/exercices?matiere=${filtreMatiere}&niveau=${filtreNiveau}`
      );
      setExercices(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { charger(); }, [filtreMatiere, filtreNiveau]);

  const handleOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm({ ...form, options: opts });
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:5004/api/exercices/${editId}`, form);
        setMessage("Exercice modifié !");
      } else {
        await axios.post("http://localhost:5004/api/exercices", form);
        setMessage("Exercice ajouté !");
      }
      setForm(vide);
      setEditId(null);
      charger();
    } catch (e) {
      setMessage("Erreur : " + (e.response?.data?.message || e.message));
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer cet exercice ?")) return;
    try {
      await axios.delete(`http://localhost:5004/api/exercices/${id}`);
      charger();
    } catch (e) { console.error(e); }
  };

  const editer = (ex) => {
    setForm({
      matiere: ex.matiere,
      niveau: ex.niveau,
      sousCat: ex.sousCat,
      question: ex.question,
      options: ex.options,
      reponse: ex.reponse,
      points: ex.points,
    });
    setEditId(ex._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">

        <div className="admin-top-card">
          <span className="admin-top-label">Administration</span>
          <h2 className="admin-main-title">Gestion des Exercices</h2>
          <p className="admin-main-subtitle">Ajouter, modifier et supprimer les exercices de la plateforme</p>
        </div>

        {/* Formulaire */}
        <div className="admin-top-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-form-title">{editId ? "Modifier l'exercice" : "Ajouter un exercice"}</h3>
          {message && (
            <div className={`admin-msg ${message.startsWith("Erreur") ? "error" : "success"}`}>
              {message}
            </div>
          )}
          <form onSubmit={soumettre} className="ex-form">
            <div className="ex-form-row">
              <div className="ex-field">
                <label className="ex-label">Matière</label>
                <select className="ex-input ex-select" value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}>
                  {MATIERES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="ex-field">
                <label className="ex-label">Niveau (classe)</label>
                <select className="ex-input ex-select" value={form.niveau} onChange={(e) => setForm({ ...form, niveau: parseInt(e.target.value) })}>
                  {NIVEAUX.map((n) => <option key={n} value={n}>{n}ère/ème année</option>)}
                </select>
              </div>
              <div className="ex-field">
                <label className="ex-label">Sous-catégorie</label>
                <input className="ex-input" placeholder="Ex: addition, alphabet..." value={form.sousCat} onChange={(e) => setForm({ ...form, sousCat: e.target.value })} required />
              </div>
              <div className="ex-field">
                <label className="ex-label">Points</label>
                <input className="ex-input" type="number" min="5" max="50" value={form.points} onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="ex-field" style={{ marginBottom: 16 }}>
              <label className="ex-label">Question</label>
              <input className="ex-input" placeholder="Écris la question ici..." value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
            </div>

            <div className="ex-options-grid">
              {form.options.map((opt, idx) => (
                <div key={idx} className="ex-option-field">
                  <div className={`ex-option-badge ${form.reponse === idx ? "correct" : ""}`}>{["A", "B", "C", "D"][idx]}</div>
                  <input
                    className="ex-input"
                    placeholder={`Option ${["A", "B", "C", "D"][idx]}`}
                    value={opt}
                    onChange={(e) => handleOption(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={`ex-correct-btn ${form.reponse === idx ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, reponse: idx })}
                  >
                    {form.reponse === idx ? "✓ Correcte" : "Correcte ?"}
                  </button>
                </div>
              ))}
            </div>

            <div className="ex-form-actions">
              {editId && (
                <button type="button" className="ex-cancel-btn" onClick={() => { setForm(vide); setEditId(null); }}>
                  Annuler
                </button>
              )}
              <button type="submit" className="ex-submit-btn" disabled={loading}>
                {loading ? "..." : editId ? "Modifier" : "Ajouter l'exercice"}
              </button>
            </div>
          </form>
        </div>

        {/* Filtres */}
        <div className="admin-top-card" style={{ marginBottom: 16 }}>
          <div className="ex-filtres">
            <div className="ex-field" style={{ flex: 1 }}>
              <label className="ex-label">Filtrer par matière</label>
              <select className="ex-input ex-select" value={filtreMatiere} onChange={(e) => setFiltreMatiere(e.target.value)}>
                {MATIERES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="ex-field" style={{ flex: 1 }}>
              <label className="ex-label">Filtrer par niveau</label>
              <select className="ex-input ex-select" value={filtreNiveau} onChange={(e) => setFiltreNiveau(parseInt(e.target.value))}>
                {NIVEAUX.map((n) => <option key={n} value={n}>{n}ère/ème année</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Liste exercices */}
        <div className="ex-list">
          {exercices.length === 0 ? (
            <div className="admin-top-card" style={{ textAlign: "center", color: "#9C8AA5" }}>
              Aucun exercice pour cette sélection.
            </div>
          ) : exercices.map((ex) => (
            <div key={ex._id} className="ex-card">
              <div className="ex-card-head">
                <div className="ex-card-badges">
                  <span className="ex-badge matiere">{ex.matiere}</span>
                  <span className="ex-badge niveau">Niveau {ex.niveau}</span>
                  <span className="ex-badge sousCat">{ex.sousCat}</span>
                </div>
                <span className="ex-points">{ex.points} pts</span>
              </div>
              <p className="ex-question">{ex.question}</p>
              <div className="ex-opts-preview">
                {ex.options.map((opt, idx) => (
                  <span key={idx} className={`ex-opt-chip ${ex.reponse === idx ? "correct" : ""}`}>
                    {["A", "B", "C", "D"][idx]}. {opt}
                  </span>
                ))}
              </div>
              <div className="ex-card-actions">
                <button className="ex-edit-btn" onClick={() => editer(ex)}>Modifier</button>
                <button className="ex-delete-btn" onClick={() => supprimer(ex._id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Exercices;