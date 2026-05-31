import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import "../../styles/adminLayout.css";
import axios from "../../api/axios";

const API_URL = "http://localhost:5004/api/exercices";

const MATIERES = [
  "maths",
  "francais",
  "anglais",
  "arabe",
  "sciences",
  "histoire",
  "education_islamique",
];

const NIVEAUX = [1, 2, 3, 4, 5, 6];

const coursVide = {
  titre: "",
  description: "",
  matiere: "maths",
  niveau: 1,
  coinsCompletion: 20,
  pdf: null,
};

const quizVide = {
  coursId: "",
  titre: "",
  questions: [
    {
      question: "",
      options: ["", "", "", ""],
      bonneReponse: 0,
      points: 10,
    },
  ],
};

const Exercices = () => {
  const [cours, setCours] = useState([]);
  const [quiz, setQuiz] = useState([]);

  const [formCours, setFormCours] = useState(coursVide);
  const [formQuiz, setFormQuiz] = useState(quizVide);

  const [editCoursId, setEditCoursId] = useState(null);
  const [editQuizId, setEditQuizId] = useState(null);

  const [filtreMatiere, setFiltreMatiere] = useState("maths");
  const [filtreNiveau, setFiltreNiveau] = useState(1);
  const [coursSelectionne, setCoursSelectionne] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const afficherMessage = (txt) => {
    setMessage(txt);
    setTimeout(() => setMessage(""), 3000);
  };

  const chargerCours = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/cours?matiere=${filtreMatiere}&niveau=${filtreNiveau}`
      );

      setCours(res.data || []);

      if (res.data?.length > 0 && !coursSelectionne) {
        setCoursSelectionne(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
      afficherMessage("Erreur chargement cours");
    }
  };

  const chargerQuiz = async (coursId) => {
    if (!coursId) {
      setQuiz([]);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/cours/${coursId}/quiz`);
      setQuiz(res.data || []);
    } catch (err) {
      console.error(err);
      setQuiz([]);
    }
  };

  useEffect(() => {
    chargerCours();
  }, [filtreMatiere, filtreNiveau]);

  useEffect(() => {
    chargerQuiz(coursSelectionne);
  }, [coursSelectionne]);

  const resetCours = () => {
    setFormCours(coursVide);
    setEditCoursId(null);
  };

  const resetQuiz = () => {
    setFormQuiz({
      ...quizVide,
      coursId: coursSelectionne || "",
    });
    setEditQuizId(null);
  };

  const soumettreCours = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("titre", formCours.titre);
      data.append("description", formCours.description);
      data.append("matiere", formCours.matiere);
      data.append("niveau", formCours.niveau);
      data.append("coinsCompletion", formCours.coinsCompletion);

      if (formCours.pdf) {
        data.append("pdf", formCours.pdf);
      }

      if (editCoursId) {
        await axios.put(`${API_URL}/cours/${editCoursId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        afficherMessage("Cours modifié avec succès");
      } else {
        await axios.post(`${API_URL}/cours`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        afficherMessage("Cours ajouté avec succès");
      }

      resetCours();
      chargerCours();
    } catch (err) {
      afficherMessage(err.response?.data?.message || "Erreur cours");
    }

    setLoading(false);
  };

  const editerCours = (c) => {
    setFormCours({
      titre: c.titre || "",
      description: c.description || "",
      matiere: c.matiere || "maths",
      niveau: c.niveau || 1,
      coinsCompletion: c.coinsCompletion || 20,
      pdf: null,
    });

    setEditCoursId(c._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const supprimerCours = async (id) => {
    if (!window.confirm("Supprimer ce cours ?")) return;

    try {
      await axios.delete(`${API_URL}/cours/${id}`);
      afficherMessage("Cours supprimé");
      chargerCours();

      if (coursSelectionne === id) {
        setCoursSelectionne("");
        setQuiz([]);
      }
    } catch (err) {
      afficherMessage(err.response?.data?.message || "Erreur suppression cours");
    }
  };

  const ajouterQuestion = () => {
    setFormQuiz({
      ...formQuiz,
      questions: [
        ...formQuiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          bonneReponse: 0,
          points: 10,
        },
      ],
    });
  };

  const supprimerQuestion = (index) => {
    if (formQuiz.questions.length === 1) return;

    const questions = formQuiz.questions.filter((_, i) => i !== index);
    setFormQuiz({ ...formQuiz, questions });
  };

  const changerQuestion = (index, field, value) => {
    const questions = [...formQuiz.questions];
    questions[index][field] = value;
    setFormQuiz({ ...formQuiz, questions });
  };

  const changerOption = (qIndex, optIndex, value) => {
    const questions = [...formQuiz.questions];
    questions[qIndex].options[optIndex] = value;
    setFormQuiz({ ...formQuiz, questions });
  };

  const soumettreQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formQuiz,
        coursId: formQuiz.coursId || coursSelectionne,
      };

      if (editQuizId) {
        await axios.put(`${API_URL}/quiz/${editQuizId}`, payload);
        afficherMessage("Quiz modifié avec succès");
      } else {
        await axios.post(`${API_URL}/quiz`, payload);
        afficherMessage("Quiz ajouté avec succès");
      }

      resetQuiz();
      chargerQuiz(coursSelectionne);
    } catch (err) {
      afficherMessage(err.response?.data?.message || "Erreur quiz");
    }

    setLoading(false);
  };

  const editerQuiz = (q) => {
    setFormQuiz({
      coursId: q.coursId || coursSelectionne,
      titre: q.titre || "",
      questions: q.questions.map((question) => ({
        question: question.question || "",
        options: question.options || ["", "", "", ""],
        bonneReponse: question.bonneReponse ?? 0,
        points: question.points || 10,
      })),
    });

    setEditQuizId(q._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const supprimerQuiz = async (id) => {
    if (!window.confirm("Supprimer ce quiz ?")) return;

    try {
      await axios.delete(`${API_URL}/quiz/${id}`);
      afficherMessage("Quiz supprimé");
      chargerQuiz(coursSelectionne);
    } catch (err) {
      afficherMessage(err.response?.data?.message || "Erreur suppression quiz");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-top-card">
          <span className="admin-top-label">Administration</span>
          <h2 className="admin-main-title">Gestion des cours et quiz</h2>
          <p className="admin-main-subtitle">
            Ajouter les supports PDF, organiser les cours par niveau/matière et créer les quiz.
          </p>
        </div>

        {message && (
          <div
            className={`admin-msg ${
              message.toLowerCase().includes("erreur") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}

        <div className="admin-top-card">
          <h3 className="admin-form-title">
            {editCoursId ? "Modifier le cours" : "Ajouter un cours"}
          </h3>

          <form onSubmit={soumettreCours} className="ex-form">
            <div className="ex-form-row">
              <div className="ex-field">
                <label className="ex-label">Titre</label>
                <input
                  className="ex-input"
                  value={formCours.titre}
                  onChange={(e) =>
                    setFormCours({ ...formCours, titre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="ex-field">
                <label className="ex-label">Matière</label>
                <select
                  className="ex-input ex-select"
                  value={formCours.matiere}
                  onChange={(e) =>
                    setFormCours({ ...formCours, matiere: e.target.value })
                  }
                >
                  {MATIERES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ex-field">
                <label className="ex-label">Niveau</label>
                <select
                  className="ex-input ex-select"
                  value={formCours.niveau}
                  onChange={(e) =>
                    setFormCours({
                      ...formCours,
                      niveau: Number(e.target.value),
                    })
                  }
                >
                  {NIVEAUX.map((n) => (
                    <option key={n} value={n}>
                      {n}ème année primaire
                    </option>
                  ))}
                </select>
              </div>

              <div className="ex-field">
                <label className="ex-label">Coins cours</label>
                <input
                  className="ex-input"
                  type="number"
                  min="0"
                  value={formCours.coinsCompletion}
                  onChange={(e) =>
                    setFormCours({
                      ...formCours,
                      coinsCompletion: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="ex-field" style={{ marginBottom: 16 }}>
              <label className="ex-label">Description</label>
              <textarea
                className="ex-input"
                rows="3"
                value={formCours.description}
                onChange={(e) =>
                  setFormCours({ ...formCours, description: e.target.value })
                }
              />
            </div>

            <div className="ex-field" style={{ marginBottom: 16 }}>
              <label className="ex-label">Support PDF</label>
              <input
                className="ex-input"
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFormCours({ ...formCours, pdf: e.target.files[0] })
                }
                required={!editCoursId}
              />
            </div>

            <div className="ex-form-actions">
              {editCoursId && (
                <button type="button" className="ex-cancel-btn" onClick={resetCours}>
                  Annuler
                </button>
              )}

              <button type="submit" className="ex-submit-btn" disabled={loading}>
                {loading ? "..." : editCoursId ? "Modifier le cours" : "Ajouter le cours"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-top-card">
          <h3 className="admin-form-title">Filtres</h3>

          <div className="ex-filtres">
            <div className="ex-field" style={{ flex: 1 }}>
              <label className="ex-label">Matière</label>
              <select
                className="ex-input ex-select"
                value={filtreMatiere}
                onChange={(e) => setFiltreMatiere(e.target.value)}
              >
                {MATIERES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="ex-field" style={{ flex: 1 }}>
              <label className="ex-label">Niveau</label>
              <select
                className="ex-input ex-select"
                value={filtreNiveau}
                onChange={(e) => setFiltreNiveau(Number(e.target.value))}
              >
                {NIVEAUX.map((n) => (
                  <option key={n} value={n}>
                    {n}ème année primaire
                  </option>
                ))}
              </select>
            </div>

            <div className="ex-field" style={{ flex: 1 }}>
              <label className="ex-label">Cours sélectionné</label>
              <select
                className="ex-input ex-select"
                value={coursSelectionne}
                onChange={(e) => setCoursSelectionne(e.target.value)}
              >
                <option value="">Choisir un cours</option>
                {cours.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.titre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="admin-top-card">
          <h3 className="admin-form-title">
            {editQuizId ? "Modifier le quiz" : "Ajouter un quiz"}
          </h3>

          <form onSubmit={soumettreQuiz} className="ex-form">
            <div className="ex-form-row">
              <div className="ex-field">
                <label className="ex-label">Cours</label>
                <select
                  className="ex-input ex-select"
                  value={formQuiz.coursId || coursSelectionne}
                  onChange={(e) =>
                    setFormQuiz({ ...formQuiz, coursId: e.target.value })
                  }
                  required
                >
                  <option value="">Choisir un cours</option>
                  {cours.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ex-field">
                <label className="ex-label">Titre du quiz</label>
                <input
                  className="ex-input"
                  value={formQuiz.titre}
                  onChange={(e) =>
                    setFormQuiz({ ...formQuiz, titre: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {formQuiz.questions.map((q, qIndex) => (
              <div key={qIndex} className="ex-card" style={{ marginBottom: 16 }}>
                <div className="ex-card-head">
                  <h4 className="ex-question">Question {qIndex + 1}</h4>

                  <button
                    type="button"
                    className="ex-delete-btn"
                    onClick={() => supprimerQuestion(qIndex)}
                  >
                    Supprimer
                  </button>
                </div>

                <div className="ex-field" style={{ marginBottom: 12 }}>
                  <label className="ex-label">Question</label>
                  <input
                    className="ex-input"
                    value={q.question}
                    onChange={(e) =>
                      changerQuestion(qIndex, "question", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="ex-options-grid">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="ex-option-field">
                      <div
                        className={`ex-option-badge ${
                          q.bonneReponse === optIndex ? "correct" : ""
                        }`}
                      >
                        {["A", "B", "C", "D"][optIndex]}
                      </div>

                      <input
                        className="ex-input"
                        value={opt}
                        onChange={(e) =>
                          changerOption(qIndex, optIndex, e.target.value)
                        }
                        required
                      />

                      <button
                        type="button"
                        className={`ex-correct-btn ${
                          q.bonneReponse === optIndex ? "selected" : ""
                        }`}
                        onClick={() =>
                          changerQuestion(qIndex, "bonneReponse", optIndex)
                        }
                      >
                        {q.bonneReponse === optIndex ? "✓ Correcte" : "Correcte ?"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="ex-form-actions">
              <button type="button" className="ex-cancel-btn" onClick={ajouterQuestion}>
                + Ajouter question
              </button>

              {editQuizId && (
                <button type="button" className="ex-cancel-btn" onClick={resetQuiz}>
                  Annuler
                </button>
              )}

              <button type="submit" className="ex-submit-btn" disabled={loading}>
                {loading ? "..." : editQuizId ? "Modifier le quiz" : "Ajouter le quiz"}
              </button>
            </div>
          </form>
        </div>

        <div className="ex-list">
          {cours.length === 0 ? (
            <div className="admin-top-card" style={{ textAlign: "center" }}>
              Aucun cours pour cette sélection.
            </div>
          ) : (
            cours.map((c) => (
              <div key={c._id} className="ex-card">
                <div className="ex-card-head">
                  <div className="ex-card-badges">
                    <span className="ex-badge matiere">{c.matiere}</span>
                    <span className="ex-badge niveau">Niveau {c.niveau}</span>
                    <span className="ex-badge sousCat">{c.titre}</span>
                  </div>

                  <span className="ex-points">{c.coinsCompletion || 20} coins</span>
                </div>

                <p className="ex-question">{c.description || "Sans description"}</p>

                {c.pdfUrl && (
                  <a
                    href={`http://localhost:5004${c.pdfUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ex-submit-btn"
                    style={{ display: "inline-block", textDecoration: "none" }}
                  >
                    Voir PDF
                  </a>
                )}

                <div className="ex-card-actions" style={{ marginTop: 14 }}>
                  <button className="ex-edit-btn" onClick={() => editerCours(c)}>
                    Modifier
                  </button>
                  <button className="ex-delete-btn" onClick={() => supprimerCours(c._id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-top-card" style={{ marginTop: 24 }}>
          <h3 className="admin-form-title">Quiz du cours sélectionné</h3>

          {quiz.length === 0 ? (
            <p className="section-subtitle">Aucun quiz pour ce cours.</p>
          ) : (
            <div className="ex-list">
              {quiz.map((q) => (
                <div key={q._id} className="ex-card">
                  <div className="ex-card-head">
                    <p className="ex-question">{q.titre}</p>
                    <span className="ex-points">
                      {q.questions?.length || 0} question(s)
                    </span>
                  </div>

                  <div className="ex-card-actions">
                    <button className="ex-edit-btn" onClick={() => editerQuiz(q)}>
                      Modifier
                    </button>
                    <button className="ex-delete-btn" onClick={() => supprimerQuiz(q._id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Exercices;