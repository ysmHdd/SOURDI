import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import axios from "../../api/axios";
import "../../styles/adminLayout.css";
import "./commandesAdmin.css";

const API_ADMIN = "http://localhost:5002";

const CommandesAdmin = () => {
  const [commandes, setCommandes] = useState([]);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [commandeDetails, setCommandeDetails] = useState(null);

  const [annulation, setAnnulation] = useState({
    id: "",
    cause: "rupture_stock",
    details: "",
  });

  const chargerCommandes = async () => {
    try {
      setErreur("");
      const res = await axios.get(`${API_ADMIN}/api/admin/transactions`);
      setCommandes(res.data || []);
    } catch (err) {
      setErreur("Erreur lors du chargement des commandes.");
    }
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  const ouvrirAnnulation = (e, commande) => {
    e.stopPropagation();
    setAnnulation({
      id: commande._id,
      cause: "rupture_stock",
      details: "",
    });
  };

  const fermerAnnulation = () => {
    setAnnulation({
      id: "",
      cause: "rupture_stock",
      details: "",
    });
  };

  const annulerCommande = async (e) => {
    e.preventDefault();

    try {
      setErreur("");
      setMessage("");

      await axios.patch(
        `${API_ADMIN}/api/admin/transactions/${annulation.id}/annuler`,
        {
          cause: annulation.cause,
          details:
            annulation.cause === "rupture_stock"
              ? "Rupture de stock"
              : annulation.details || "Autre",
        }
      );

      setMessage("Commande annulée avec succès.");
      fermerAnnulation();
      chargerCommandes();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  };

  const marquerLivree = async (e, idCommande) => {
    e.stopPropagation();

    try {
      setErreur("");
      setMessage("");

      await axios.patch(`${API_ADMIN}/api/admin/transactions/${idCommande}/livree`);

      setMessage("Commande marquée comme livrée.");
      chargerCommandes();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors du changement de statut.");
    }
  };

  const supprimerCommande = async (e, idCommande) => {
    e.stopPropagation();

    try {
      setErreur("");
      setMessage("");

      await axios.delete(`${API_ADMIN}/api/admin/transactions/${idCommande}`);

      setMessage("Commande supprimée avec succès.");
      chargerCommandes();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const getStatutLabel = (statut) => {
    if (statut === "annulee") return "Annulée";
    if (statut === "livree") return "Livrée";
    return "Réussie";
  };

  const getBadgeClass = (statut) => {
    if (statut === "annulee") return "badge-annulee";
    if (statut === "livree") return "badge-livree";
    return "badge-reussi";
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="commandes-top-card">
          <span className="commandes-label">Administration</span>
          <h1 className="commandes-main-title">Liste des commandes</h1>
          <p className="commandes-main-subtitle">
            Cliquer sur une commande pour voir tous les détails.
          </p>
        </div>

        {message && <div className="commandes-success">{message}</div>}
        {erreur && <div className="commandes-error">{erreur}</div>}

        <section className="commandes-table-card">
          <div className="commandes-table-header">
            <h2 className="commandes-section-title">Commandes des élèves</h2>
            <p className="commandes-section-subtitle">
              Adresse complète, statut et raison d'annulation visibles dans la fenêtre de détails.
            </p>
          </div>

          {commandes.length > 0 ? (
            <div className="commandes-table-wrap">
              <table className="commandes-table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Total</th>
                    <th>Adresse</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {commandes.map((commande) => {
                    const eleve = commande.utilisateur;
                    const produit = commande.produit;
                    const estAnnulee = commande.statut === "annulee";
                    const estLivree = commande.statut === "livree";

                    return (
                      <tr
                        key={commande._id}
                        className="commande-row-clickable"
                        onClick={() => setCommandeDetails(commande)}
                      >
                        <td>
                          <strong>
                            {eleve?.user_first_name || commande.client?.nom || ""}{" "}
                            {eleve?.user_last_name || ""}
                          </strong>
                          <span>{eleve?.user_email || commande.client?.email || "-"}</span>
                        </td>

                        <td>{produit?.nom || "Produit supprimé"}</td>
                        <td>{commande.quantite || 1}</td>
                        <td>{commande.montantEnCoins} coins</td>

                        <td>
                          {commande.adresseLivraison?.adresse || "-"}
                          <span>
                            {commande.adresseLivraison?.gouvernorat || ""}{" "}
                            {commande.adresseLivraison?.delegation || ""}
                          </span>
                        </td>

                        <td>
                          <span className={`commande-badge ${getBadgeClass(commande.statut)}`}>
                            {getStatutLabel(commande.statut)}
                          </span>
                        </td>

                        <td>
                          <div className="commande-actions">
                            {!estAnnulee && !estLivree && (
                              <>
                                <button
                                  type="button"
                                  className="commande-livree-btn"
                                  onClick={(e) => marquerLivree(e, commande._id)}
                                >
                                  Livrée
                                </button>

                                <button
                                  type="button"
                                  className="commande-annuler-btn"
                                  onClick={(e) => ouvrirAnnulation(e, commande)}
                                >
                                  Annuler
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              className="commande-supprimer-btn"
                              onClick={(e) => supprimerCommande(e, commande._id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="commandes-empty">Aucune commande trouvée.</div>
          )}
        </section>

        {commandeDetails && (
          <div className="commande-modal-overlay">
            <div className="commande-details-modal">
              <div className="commande-details-head">
                <h2>Détails de la commande</h2>
                <button type="button" onClick={() => setCommandeDetails(null)}>
                  ×
                </button>
              </div>

              <div className="commande-details-grid">
                <div>
                  <span>Élève</span>
                  <strong>
                    {commandeDetails.utilisateur?.user_first_name ||
                      commandeDetails.client?.nom ||
                      "-"}{" "}
                    {commandeDetails.utilisateur?.user_last_name || ""}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {commandeDetails.utilisateur?.user_email ||
                      commandeDetails.client?.email ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Produit</span>
                  <strong>{commandeDetails.produit?.nom || "Produit supprimé"}</strong>
                </div>

                <div>
                  <span>Statut</span>
                  <strong>{getStatutLabel(commandeDetails.statut)}</strong>
                </div>

                <div>
                  <span>Adresse</span>
                  <strong>{commandeDetails.adresseLivraison?.adresse || "-"}</strong>
                </div>

                <div>
                  <span>Gouvernorat</span>
                  <strong>{commandeDetails.adresseLivraison?.gouvernorat || "-"}</strong>
                </div>

                <div>
                  <span>Délégation</span>
                  <strong>{commandeDetails.adresseLivraison?.delegation || "-"}</strong>
                </div>

                <div>
                  <span>Code postal</span>
                  <strong>{commandeDetails.adresseLivraison?.codePostal || "-"}</strong>
                </div>

                <div>
                  <span>Quantité</span>
                  <strong>{commandeDetails.quantite || 1}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>{commandeDetails.montantEnCoins} coins</strong>
                </div>
              </div>

              {commandeDetails.adresseLivraison?.note && (
                <div className="commande-details-note">
                  <span>Note</span>
                  <p>{commandeDetails.adresseLivraison.note}</p>
                </div>
              )}

              {commandeDetails.statut === "annulee" && (
                <div className="commande-details-annulation">
                  <h3>Annulation</h3>
                  <p>
                    <strong>Par :</strong>{" "}
                    {commandeDetails.annulation?.annuleePar === "admin"
                      ? "Admin"
                      : "Élève"}
                  </p>
                  <p>
                    <strong>Raison :</strong>{" "}
                    {commandeDetails.annulation?.cause === "rupture_stock"
                      ? "Rupture de stock"
                      : commandeDetails.annulation?.details || "Autre"}
                  </p>
                  {commandeDetails.annulation?.dateAnnulation && (
                    <p>
                      <strong>Date :</strong>{" "}
                      {new Date(
                        commandeDetails.annulation.dateAnnulation
                      ).toLocaleString("fr-FR")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {annulation.id && (
          <div className="commande-modal-overlay">
            <form className="commande-modal" onSubmit={annulerCommande}>
              <h2>Annuler la commande</h2>

              <label>Raison</label>
              <select
                value={annulation.cause}
                onChange={(e) =>
                  setAnnulation({
                    ...annulation,
                    cause: e.target.value,
                  })
                }
              >
                <option value="rupture_stock">Rupture de stock</option>
                <option value="autre">Autre</option>
              </select>

              {annulation.cause === "autre" && (
                <>
                  <label>Détails</label>
                  <textarea
                    value={annulation.details}
                    onChange={(e) =>
                      setAnnulation({
                        ...annulation,
                        details: e.target.value,
                      })
                    }
                    placeholder="Écrire la raison..."
                  />
                </>
              )}

              <div className="commande-modal-actions">
                <button
                  type="button"
                  className="commande-close-btn"
                  onClick={fermerAnnulation}
                >
                  Fermer
                </button>

                <button type="submit" className="commande-confirm-btn">
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommandesAdmin;