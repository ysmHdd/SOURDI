import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import axios from "../../api/axios";
import "../../styles/adminLayout.css";

const API = "http://localhost:5002";

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [modeEdition, setModeEdition] = useState(null);
  const [erreur, setErreur] = useState("");
  const [form, setForm] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    password: "",
    user_dob: "",
    user_phone: "",
    role: "etudiant",
    grade: "",
    gouvernorat: "",
    delegation: "",
    region: "",
    school_name: "",
  });

  const charger = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/utilisateurs`);
      setUtilisateurs(res.data);
      setErreur("");
    } catch {
      setErreur("Erreur lors du chargement");
    }
  };

  const resetForm = () => {
    setModeEdition(null);
    setForm({
      user_first_name: "",
      user_last_name: "",
      user_email: "",
      password: "",
      user_dob: "",
      user_phone: "",
      role: "etudiant",
      grade: "",
      gouvernorat: "",
      delegation: "",
      region: "",
      school_name: "",
    });
  };

  const envoyerForm = async (e) => {
    e.preventDefault();

    try {
      const body = {
        user_first_name: form.user_first_name,
        user_last_name: form.user_last_name,
        user_email: form.user_email,
        user_dob: form.user_dob,
        user_phone: form.user_phone,
        role: form.role,
        params: {
          grade: form.grade,
          gouvernorat: form.gouvernorat,
          delegation: form.delegation,
          region: form.region,
          school_name: form.school_name,
        },
      };

      if (form.password) {
        body.password = form.password;
      }

      if (modeEdition) {
        await axios.put(`${API}/api/admin/utilisateurs/${modeEdition}`, body);
      } else {
        await axios.post(`${API}/api/admin/utilisateurs`, body);
      }

      resetForm();
      charger();
      setErreur("");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const modifier = (u) => {
    setModeEdition(u._id);
    setForm({
      user_first_name: u.user_first_name || "",
      user_last_name: u.user_last_name || "",
      user_email: u.user_email || "",
      password: "",
      user_dob: u.user_dob ? u.user_dob.substring(0, 10) : "",
      user_phone: u.user_phone || "",
      role: u.role || "etudiant",
      grade: u.params?.grade || "",
      gouvernorat: u.params?.gouvernorat || "",
      delegation: u.params?.delegation || "",
      region: u.params?.region || "",
      school_name: u.params?.school_name || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${API}/api/admin/utilisateurs/${id}`);
      setErreur("");
      charger();
    } catch {
      setErreur("Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    charger();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap');

        * { box-sizing: border-box; }

        .admin-layout {
          min-height: 100vh;
          display: flex;
          font-family: 'Nunito', sans-serif;
          background: linear-gradient(145deg, #FFF8E1 0%, #FCE4EC 45%, #E8EAF6 100%);
        }

        .admin-main { flex: 1; padding: 28px; }

        .admin-top-card, .form-card, .table-card {
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(171, 71, 188, 0.10);
          border-radius: 24px;
          box-shadow: 0 16px 34px rgba(90, 70, 120, 0.07);
        }

        .admin-top-card {
          border-radius: 28px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .admin-top-label {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #F3E5F5, #EDE7F6);
          color: #7B4BAA;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          margin-bottom: 14px;
        }

        .admin-main-title {
          margin: 0;
          font-size: 2rem;
          color: #322B45;
          font-weight: 900;
        }

        .error-box {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(239, 68, 68, 0.18);
          color: #c62828;
          border-radius: 18px;
          padding: 14px 16px;
          margin-bottom: 20px;
          font-weight: 800;
        }

        .form-card {
          padding: 24px;
          margin-bottom: 24px;
        }

        .section-title {
          margin: 0 0 8px;
          color: #3F3654;
          font-size: 1.15rem;
          font-weight: 900;
        }

        .section-subtitle {
          margin: 0 0 18px;
          color: #8A8298;
          font-size: 0.94rem;
          font-weight: 700;
        }

        .user-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .input {
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid #E6DDF2;
          background: #FFFFFF;
          color: #4A4458;
          font-size: 0.94rem;
          font-weight: 700;
          outline: none;
        }

        .input:focus {
          border-color: #AB47BC;
          box-shadow: 0 0 0 4px rgba(171, 71, 188, 0.08);
        }

        .primary-btn, .secondary-btn, .delete-btn {
          border: none;
          border-radius: 14px;
          padding: 11px 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 900;
          color: white;
        }

        .primary-btn {
          background: linear-gradient(135deg, #AB47BC, #7C4DFF);
        }

        .secondary-btn {
          background: linear-gradient(135deg, #26A69A, #43A047);
        }

        .delete-btn {
          background: linear-gradient(135deg, #EF5350, #E53935);
        }

        .table-card { overflow: hidden; }

        .table-header {
          padding: 22px 24px 14px;
          border-bottom: 1px solid rgba(171, 71, 188, 0.08);
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .users-table thead tr {
          background: linear-gradient(135deg, #F7F0FC, #EEF0FF);
        }

        .users-table th {
          padding: 16px 18px;
          text-align: left;
          color: #5E548E;
          font-size: 0.88rem;
          font-weight: 900;
        }

        .users-table td {
          padding: 16px 18px;
          color: #4A4458;
          font-size: 0.94rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(171, 71, 188, 0.07);
        }

        .user-name {
          font-weight: 900;
          color: #3F3654;
        }

        .user-email {
          color: #7E7A8A;
          font-weight: 700;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 900;
          min-width: 88px;
        }

        .role-badge.admin {
          background: linear-gradient(135deg, #7C4DFF, #5C6BC0);
          color: white;
        }

        .role-badge.eleve {
          background: linear-gradient(135deg, #43A047, #26A69A);
          color: white;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .empty-state {
          padding: 26px 24px;
          color: #8A8298;
          font-size: 0.95rem;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .admin-layout { flex-direction: column; }
          .admin-main { padding: 18px; }
          .admin-main-title { font-size: 1.6rem; }
        }
      `}</style>

      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-top-card">
            <span className="admin-top-label">Administration</span>
            <h2 className="admin-main-title">Gestion des Utilisateurs</h2>
          </div>

          {erreur && <div className="error-box">{erreur}</div>}

          <section className="form-card">
            <h3 className="section-title">
              {modeEdition ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            </h3>
            <p className="section-subtitle">
              L’email contenant les identifiants sera envoyé automatiquement si un mot de passe est défini.
            </p>

            <form onSubmit={envoyerForm} className="user-form">
              <input className="input" placeholder="Prénom" value={form.user_first_name} onChange={(e) => setForm({ ...form, user_first_name: e.target.value })} required />
              <input className="input" placeholder="Nom" value={form.user_last_name} onChange={(e) => setForm({ ...form, user_last_name: e.target.value })} required />
              <input className="input" type="email" placeholder="Email" value={form.user_email} onChange={(e) => setForm({ ...form, user_email: e.target.value })} required />
              <input className="input" type="password" placeholder={modeEdition ? "Nouveau mot de passe (optionnel)" : "Mot de passe"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!modeEdition} />
              <input className="input" type="date" value={form.user_dob} onChange={(e) => setForm({ ...form, user_dob: e.target.value })} required />
              <input className="input" placeholder="Téléphone" value={form.user_phone} onChange={(e) => setForm({ ...form, user_phone: e.target.value })} required />

              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="etudiant">Étudiant</option>
                <option value="admin">Admin</option>
              </select>

              <input className="input" placeholder="Niveau / Classe" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
              <input className="input" placeholder="Gouvernorat" value={form.gouvernorat} onChange={(e) => setForm({ ...form, gouvernorat: e.target.value })} />
              <input className="input" placeholder="Délégation" value={form.delegation} onChange={(e) => setForm({ ...form, delegation: e.target.value })} />
              <input className="input" placeholder="Région" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              <input className="input" placeholder="Nom de l’école" value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} />

              <button className="primary-btn" type="submit">
                {modeEdition ? "Modifier" : "Ajouter"}
              </button>

              {modeEdition && (
                <button className="secondary-btn" type="button" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </form>
          </section>

          <section className="table-card">
            <div className="table-header">
              <h3 className="section-title">Liste des utilisateurs</h3>
              <p className="section-subtitle">
                Suivez les utilisateurs enregistrés et supprimez un compte si nécessaire.
              </p>
            </div>

            <div className="table-wrap">
              {utilisateurs.length > 0 ? (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {utilisateurs.map((u) => (
                      <tr key={u._id}>
                        <td className="user-name">
                          {u.user_first_name} {u.user_last_name}
                        </td>
                        <td className="user-email">{u.user_email}</td>
                        <td>{u.user_phone}</td>
                        <td>
                          <span className={`role-badge ${u.role === "admin" ? "admin" : "eleve"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="secondary-btn" onClick={() => modifier(u)}>
                              Modifier
                            </button>
                            <button className="delete-btn" onClick={() => supprimer(u._id)}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">Aucun utilisateur trouvé.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Utilisateurs;