import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import axios from "../../api/axios";
import "../../styles/adminLayout.css";

const API = "http://localhost:5002";

const DemandesAcces = () => {
  const [demandes, setDemandes] = useState([]);
  const [erreur, setErreur] = useState("");

  const chargerDemandes = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/utilisateurs`);

      const demandesEnAttente = res.data.filter(
        (u) =>
          u.role === "etudiant" &&
          u.statutAcces === "en_attente"
      );

      setDemandes(demandesEnAttente);
      setErreur("");
    } catch (err) {
      setErreur("Erreur lors du chargement des demandes");
    }
  };

  useEffect(() => {
    chargerDemandes();
  }, []);

  const accepterDemande = async (id) => {
    try {
      await axios.patch(
        `${API}/api/admin/utilisateurs/${id}/accepter-acces`
      );

      chargerDemandes();
    } catch (err) {
      console.error(err);
    }
  };

  const refuserDemande = async (id) => {
    try {
      await axios.patch(
        `${API}/api/admin/utilisateurs/${id}/refuser-acces`
      );

      chargerDemandes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-top-card">
          <span className="admin-top-label">
            Administration
          </span>

          <h2 className="admin-main-title">
            Demandes d'accès
          </h2>

          <p className="admin-main-subtitle">
            Accepter ou refuser les étudiants avant
            l'accès complet à la plateforme.
          </p>
        </div>

        {erreur && (
          <div className="admin-msg error">
            {erreur}
          </div>
        )}

        <section className="table-card">
          <div className="table-header">
            <h3 className="section-title">
              Étudiants en attente
            </h3>

            <p className="section-subtitle">
              Les étudiants peuvent seulement
              utiliser la messagerie admin avant
              validation.
            </p>
          </div>

          <div className="table-wrap">
            {demandes.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Niveau</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {demandes.map((u) => (
                    <tr key={u._id}>
                      <td className="user-name">
                        {u.user_first_name}{" "}
                        {u.user_last_name}
                      </td>

                      <td className="user-email">
                        {u.user_email}
                      </td>

                      <td>{u.user_phone}</td>

                      <td>
                        {u.params?.grade || "-"}
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="secondary-btn"
                            onClick={() =>
                              accepterDemande(u._id)
                            }
                          >
                            Accepter
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              refuserDemande(u._id)
                            }
                          >
                            Refuser
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                Aucune demande en attente.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DemandesAcces;