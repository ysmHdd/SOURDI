import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "../../api/axios";

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/admin/utilisateurs");
      setUtilisateurs(res.data);
      setErreur("");
    } catch {
      setErreur("Erreur lors du chargement");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`http://localhost:5002/api/admin/utilisateurs/${id}`);
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

        * {
          box-sizing: border-box;
        }

        .admin-layout {
          min-height: 100vh;
          display: flex;
          font-family: 'Nunito', sans-serif;
          background: linear-gradient(145deg, #FFF8E1 0%, #FCE4EC 45%, #E8EAF6 100%);
        }

        .admin-main {
          flex: 1;
          padding: 28px;
        }

        .admin-top-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(171, 71, 188, 0.10);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 18px 40px rgba(90, 70, 120, 0.08);
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

        .admin-main-subtitle {
          margin: 10px 0 0;
          color: #7E7A8A;
          font-size: 1rem;
          line-height: 1.6;
          max-width: 700px;
          font-weight: 700;
        }

        .error-box {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(239, 68, 68, 0.18);
          color: #c62828;
          border-radius: 18px;
          padding: 14px 16px;
          margin-bottom: 20px;
          box-shadow: 0 10px 24px rgba(90, 70, 120, 0.05);
          font-weight: 800;
        }

        .table-card {
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(171, 71, 188, 0.10);
          border-radius: 24px;
          box-shadow: 0 16px 34px rgba(90, 70, 120, 0.07);
          overflow: hidden;
        }

        .table-header {
          padding: 22px 24px 14px;
          border-bottom: 1px solid rgba(171, 71, 188, 0.08);
        }

        .section-title {
          margin: 0 0 8px;
          color: #3F3654;
          font-size: 1.15rem;
          font-weight: 900;
        }

        .section-subtitle {
          margin: 0;
          color: #8A8298;
          font-size: 0.94rem;
          font-weight: 700;
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
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
          letter-spacing: 0.4px;
          border-bottom: 1px solid rgba(171, 71, 188, 0.10);
        }

        .users-table td {
          padding: 16px 18px;
          color: #4A4458;
          font-size: 0.94rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(171, 71, 188, 0.07);
          vertical-align: middle;
        }

        .users-table tbody tr {
          transition: background 0.2s ease;
        }

        .users-table tbody tr:hover {
          background: rgba(171, 71, 188, 0.03);
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
          box-shadow: 0 8px 18px rgba(92, 107, 192, 0.16);
        }

        .role-badge.eleve {
          background: linear-gradient(135deg, #43A047, #26A69A);
          color: white;
          box-shadow: 0 8px 18px rgba(38, 166, 154, 0.16);
        }

        .delete-btn {
          border: none;
          border-radius: 14px;
          padding: 10px 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.88rem;
          font-weight: 900;
          color: white;
          background: linear-gradient(135deg, #EF5350, #E53935);
          box-shadow: 0 10px 22px rgba(239, 83, 80, 0.16);
          transition: 0.2s ease;
        }

        .delete-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }

        .empty-state {
          padding: 26px 24px;
          color: #8A8298;
          font-size: 0.95rem;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .admin-layout {
            flex-direction: column;
          }

          .admin-main {
            padding: 18px;
          }

          .admin-top-card {
            padding: 22px;
          }

          .admin-main-title {
            font-size: 1.6rem;
          }
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
                      <th>Rôle</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilisateurs.map((u) => (
                      <tr key={u._id}>
                        <td className="user-name">{u.nom}</td>
                        <td className="user-email">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === "admin" ? "admin" : "eleve"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => supprimer(u._id)}
                          >
                            Supprimer
                          </button>
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