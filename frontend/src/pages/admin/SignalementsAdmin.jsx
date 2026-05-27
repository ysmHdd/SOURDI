import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
<<<<<<< HEAD
=======
import { useAuth } from "../../context/AuthContext";
>>>>>>> origin/notifcalendrier
import {
  getSignalementsAdmin,
  traiterSignalementAdmin,
} from "../../api/messageApi";
import "../../styles/adminLayout.css";
import "./signalementsAdmin.css";

const typeLabels = {
  bad_words: "Mauvais mots",
  harassment: "Harcèlement",
  sexual_harassment: "Harcèlement sexuel",
  bullying: "Intimidation",
  hate_speech: "Discours haineux",
  spam: "Spam",
  other: "Autre",
};

const SignalementsAdmin = () => {
<<<<<<< HEAD
=======
  const { utilisateur } = useAuth();
>>>>>>> origin/notifcalendrier
  const [signalements, setSignalements] = useState([]);

  const chargerSignalements = async () => {
    try {
      const res = await getSignalementsAdmin();
      setSignalements(res.data || []);
    } catch (erreur) {
      console.error(erreur);
    }
  };

  useEffect(() => {
    chargerSignalements();

    const interval = setInterval(chargerSignalements, 8000);

    return () => clearInterval(interval);
  }, []);

  const marquerTraite = async (id) => {
    try {
      await traiterSignalementAdmin(id);
      chargerSignalements();
    } catch (erreur) {
      console.error(erreur);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-top-card">
          <span className="admin-top-label">Sécurité</span>
          <h2 className="admin-main-title">Signalements</h2>
          <p className="admin-main-subtitle">
            Liste des messages signalés par les élèves. Ces signalements ne
            sont pas supprimables.
          </p>
        </div>

        <div className="reports-grid">
          {signalements.length === 0 ? (
            <div className="reports-empty">
              Aucun signalement pour le moment.
            </div>
          ) : (
<<<<<<< HEAD
            signalements.map((report) => (
              <div key={report._id} className={`report-card ${report.statut}`}>
                <div className="report-head">
                  <div className="report-avatar">
                    {report.etudiantAvatar?.url ? (
                      <img
                        src={report.etudiantAvatar.url}
                        alt="Avatar élève"
                      />
                    ) : (
                      (report.etudiantNom || report.etudiantEmail || "?")
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div>
                    <h3>{report.etudiantNom || "Élève"}</h3>
                    <p>{report.etudiantEmail}</p>
                  </div>

                  <span className="report-status">
                    {report.statut === "traite" ? "Traité" : "Nouveau"}
                  </span>
                </div>

                <div className="report-info">
                  <span>Type</span>
                  <strong>
                    {typeLabels[report.typeHarcelement] || "Autre"}
                  </strong>
                </div>

                <div className="report-info">
                  <span>Admin concerné</span>
                  <strong>{report.adminEmail || "Admin inconnu"}</strong>
                </div>

                <div className="report-message">
                  <span>Message signalé</span>
                  <p>{report.messageSignale}</p>
                </div>

                {report.typeHarcelement === "other" && report.details && (
                  <div className="report-message">
                    <span>Détails</span>
                    <p>{report.details}</p>
                  </div>
                )}

                <div className="report-footer">
                  <small>{new Date(report.createdAt).toLocaleString()}</small>

                  {report.statut !== "traite" && (
                    <button
                      type="button"
                      onClick={() => marquerTraite(report._id)}
                    >
                      Marquer traité
                    </button>
                  )}
                </div>
              </div>
            ))
=======
            signalements.map((report) => {
              const adminConnecteEmail = utilisateur?.user_email || utilisateur?.email;
              const estAdminConcerne =
                report.adminEmail &&
                adminConnecteEmail &&
                report.adminEmail.toLowerCase() ===
                  adminConnecteEmail.toLowerCase();

              return (
                <div key={report._id} className={`report-card ${report.statut}`}>
                  <div className="report-head">
                    <div className="report-avatar">
                      {report.etudiantAvatar?.url ? (
                        <img
                          src={report.etudiantAvatar.url}
                          alt="Avatar élève"
                        />
                      ) : (
                        (report.etudiantNom || report.etudiantEmail || "?")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div>
                      <h3>{report.etudiantNom || "Élève"}</h3>
                      <p>{report.etudiantEmail}</p>
                    </div>

                    <span className="report-status">
                      {report.statut === "traite" ? "Traité" : "Nouveau"}
                    </span>
                  </div>

                  <div className="report-info">
                    <span>Type</span>
                    <strong>
                      {typeLabels[report.typeHarcelement] || "Autre"}
                    </strong>
                  </div>

                  <div className="report-info">
                    <span>Admin concerné</span>
                    <strong>{report.adminEmail || "Admin inconnu"}</strong>
                  </div>

                  <div className="report-message">
                    <span>Message signalé</span>
                    <p>{report.messageSignale}</p>
                  </div>

                  {report.typeHarcelement === "other" && report.details && (
                    <div className="report-message">
                      <span>Détails</span>
                      <p>{report.details}</p>
                    </div>
                  )}

                  <div className="report-footer">
                    <small>{new Date(report.createdAt).toLocaleString()}</small>

                    {report.statut !== "traite" && !estAdminConcerne && (
                      <button
                        type="button"
                        onClick={() => marquerTraite(report._id)}
                      >
                        Marquer traité
                      </button>
                    )}

                    {report.statut !== "traite" && estAdminConcerne && (
                      <span className="report-locked-action">
                        Admin concerné
                      </span>
                    )}
                  </div>
                </div>
              );
            })
>>>>>>> origin/notifcalendrier
          )}
        </div>
      </main>
    </div>
  );
};

export default SignalementsAdmin;