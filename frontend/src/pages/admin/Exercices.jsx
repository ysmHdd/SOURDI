import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "../../styles/adminLayout.css";
import axios from "../../api/axios";

<<<<<<< HEAD
const MATIERES   = ["francais", "arabe", "maths", "sciences", "histoire"];
const NIVEAUX    = [1, 2, 3, 4, 5, 6];
const DIFFICULTES = ["facile", "moyen", "difficile"];
const LANGUES    = ["fr", "ar"];

const vide = {
  matiere:      "maths",
  niveau:       1,
  sousCat:      "",
  titre:        "",
  description:  "",
  difficulte:   "facile",
  dureeEstimee: 5,
  langue:       "fr",
  question:     "",
  options:      ["", "", "", ""],
  reponse:      0,
  exp:          20,
};

const Exercices = () => {
  const [exercices, setExercices]       = useState([]);
  const [form, setForm]                 = useState(vide);
  const [editId, setEditId]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState("");
  const [filtreMatiere, setFiltreMatiere] = useState("maths");
  const [filtreNiveau, setFiltreNiveau]   = useState(1);
=======
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
>>>>>>> origin/notifcalendrier

  const charger = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5004/api/exercices?matiere=${filtreMatiere}&niveau=${filtreNiveau}`
      );
<<<<<<< HEAD
      const data = res.data;
      if (Array.isArray(data)) {
        setExercices(data);
      } else {
        setExercices([...(data.aFaire || []), ...(data.done || [])]);
      }
=======
      setExercices(res.data);
>>>>>>> origin/notifcalendrier
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
<<<<<<< HEAD
      matiere:      ex.matiere,
      niveau:       ex.niveau,
      sousCat:      ex.sousCat,
      titre:        ex.titre,
      description:  ex.description || "",
      difficulte:   ex.difficulte  || "facile",
      dureeEstimee: ex.dureeEstimee || 5,
      langue:       ex.langue      || "fr",
      question:     ex.question,
      options:      ex.options,
      reponse:      ex.reponse,
      exp:          ex.exp         || 20,
=======
      matiere: ex.matiere,
      niveau: ex.niveau,
      sousCat: ex.sousCat,
      question: ex.question,
      options: ex.options,
      reponse: ex.reponse,
      points: ex.points,
>>>>>>> origin/notifcalendrier
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

<<<<<<< HEAD
        {/* ── Formulaire ── */}
        <div className="admin-top-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-form-title">{editId ? "Modifier l'exercice" : "Ajouter un exercice"}</h3>

=======
        {/* Formulaire */}
        <div className="admin-top-card" style={{ marginBottom: 24 }}>
          <h3 className="admin-form-title">{editId ? "Modifier l'exercice" : "Ajouter un exercice"}</h3>
>>>>>>> origin/notifcalendrier
          {message && (
            <div className={`admin-msg ${message.startsWith("Erreur") ? "error" : "success"}`}>
              {message}
            </div>
          )}
<<<<<<< HEAD

          <form onSubmit={soumettre} className="ex-form">

            {/* Ligne 1 — matière / niveau / sousCat / difficulté */}
=======
          <form onSubmit={soumettre} className="ex-form">
>>>>>>> origin/notifcalendrier
            <div className="ex-form-row">
              <div className="ex-field">
                <label className="ex-label">Matière</label>
                <select className="ex-input ex-select" value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}>
                  {MATIERES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
<<<<<<< HEAD

=======
>>>>>>> origin/notifcalendrier
              <div className="ex-field">
                <label className="ex-label">Niveau (classe)</label>
                <select className="ex-input ex-select" value={form.niveau} onChange={(e) => setForm({ ...form, niveau: parseInt(e.target.value) })}>
                  {NIVEAUX.map((n) => <option key={n} value={n}>{n}ère/ème année</option>)}
                </select>
              </div>
<<<<<<< HEAD

=======
>>>>>>> origin/notifcalendrier
              <div className="ex-field">
                <label className="ex-label">Sous-catégorie</label>
                <input className="ex-input" placeholder="Ex: addition, alphabet..." value={form.sousCat} onChange={(e) => setForm({ ...form, sousCat: e.target.value })} required />
              </div>
<<<<<<< HEAD

              <div className="ex-field">
                <label className="ex-label">Difficulté</label>
                <select className="ex-input ex-select" value={form.difficulte} onChange={(e) => setForm({ ...form, difficulte: e.target.value })}>
                  {DIFFICULTES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Ligne 2 — titre / description */}
            <div className="ex-form-row">
              <div className="ex-field" style={{ flex: 2 }}>
                <label className="ex-label">Titre <span style={{ color: "#f87171" }}>*</span></label>
                <input className="ex-input" placeholder="Ex: Les additions simples" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
              </div>

              <div className="ex-field" style={{ flex: 1 }}>
                <label className="ex-label">Langue</label>
                <select className="ex-input ex-select" value={form.langue} onChange={(e) => setForm({ ...form, langue: e.target.value })}>
                  {LANGUES.map((l) => <option key={l} value={l}>{l === "fr" ? "Français" : "Arabe"}</option>)}
                </select>
              </div>

              <div className="ex-field" style={{ flex: 1 }}>
                <label className="ex-label">Durée estimée (min)</label>
                <input className="ex-input" type="number" min="1" max="60" value={form.dureeEstimee} onChange={(e) => setForm({ ...form, dureeEstimee: parseInt(e.target.value) })} />
              </div>

              <div className="ex-field" style={{ flex: 1 }}>
                <label className="ex-label">XP gagné</label>
                <input className="ex-input" type="number" min="5" max="100" value={form.exp} onChange={(e) => setForm({ ...form, exp: parseInt(e.target.value) })} />
              </div>
            </div>

            {/* Description */}
            <div className="ex-field" style={{ marginBottom: 16 }}>
              <label className="ex-label">Description</label>
              <input className="ex-input" placeholder="Courte description de l'exercice..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Question */}
            <div className="ex-field" style={{ marginBottom: 16 }}>
              <label className="ex-label">Question <span style={{ color: "#f87171" }}>*</span></label>
              <input className="ex-input" placeholder="Écris la question ici..." value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
            </div>

            {/* Options */}
            <div className="ex-options-grid">
              {form.options.map((opt, idx) => (
                <div key={idx} className="ex-option-field">
                  <div className={`ex-option-badge ${form.reponse === idx ? "correct" : ""}`}>
                    {["A", "B", "C", "D"][idx]}
                  </div>
=======
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
>>>>>>> origin/notifcalendrier
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
<<<<<<< HEAD

          </form>
        </div>

        {/* ── Filtres ── */}
=======
          </form>
        </div>

        {/* Filtres */}
>>>>>>> origin/notifcalendrier
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

<<<<<<< HEAD
        {/* ── Liste ── */}
=======
        {/* Liste exercices */}
>>>>>>> origin/notifcalendrier
        <div className="ex-list">
          {exercices.length === 0 ? (
            <div className="admin-top-card" style={{ textAlign: "center", color: "#9C8AA5" }}>
              Aucun exercice pour cette sélection.
            </div>
<<<<<<< HEAD
          ) : (
            exercices.map((ex) => (
              <div key={ex._id} className="ex-card">
                <div className="ex-card-head">
                  <div className="ex-card-badges">
                    <span className="ex-badge matiere">{ex.matiere}</span>
                    <span className="ex-badge niveau">Niveau {ex.niveau}</span>
                    <span className="ex-badge sousCat">{ex.sousCat}</span>
                    <span className="ex-badge" style={{ background: ex.difficulte === "facile" ? "rgba(74,222,128,0.15)" : ex.difficulte === "moyen" ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)", color: ex.difficulte === "facile" ? "#4ade80" : ex.difficulte === "moyen" ? "#fbbf24" : "#f87171" }}>
                      {ex.difficulte}
                    </span>
                  </div>
                  <span className="ex-points">{ex.exp} XP — {ex.dureeEstimee} min</span>
                </div>

                <p className="ex-question"><strong>{ex.titre}</strong> — {ex.question}</p>

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
            ))
          )}
=======
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
>>>>>>> origin/notifcalendrier
        </div>

      </main>
    </div>
  );
};

export default Exercices;