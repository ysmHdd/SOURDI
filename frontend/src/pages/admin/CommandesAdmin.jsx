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

  const ouvrirAnnulation = (commande) => {
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

  const marquerLivree = async (idCommande) => {
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

  const supprimerCommande = async (idCommande) => {
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

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="commandes-top-card">
          <span className="commandes-label">Administration</span>
          <h1 className="commandes-main-title">Liste des commandes</h1>
          <p className="commandes-main-subtitle">
            Consulter les commandes des élèves, annuler avant livraison ou marquer une commande comme livrée.
          </p>
        </div>

        {message && <div className="commandes-success">{message}</div>}
        {erreur && <div className="commandes-error">{erreur}</div>}

        <section className="commandes-table-card">
          <div className="commandes-table-header">
            <h2 className="commandes-section-title">Commandes des élèves</h2>
            <p className="commandes-section-subtitle">
              Si la commande est livrée, elle ne peut plus être annulée.
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
                      <tr key={commande._id}>
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
                          <span
                            className={`commande-badge ${
                              estAnnulee
                                ? "badge-annulee"
                                : estLivree
                                ? "badge-livree"
                                : "badge-reussi"
                            }`}
                          >
                            {estAnnulee ? "Annulée" : estLivree ? "Livrée" : "Réussie"}
                          </span>
                        </td>

                        <td>
                          <div className="commande-actions">
                            {!estAnnulee && !estLivree && (
                              <>
                                <button
                                  type="button"
                                  className="commande-livree-btn"
                                  onClick={() => marquerLivree(commande._id)}
                                >
                                  Livrée
                                </button>

                                <button
                                  type="button"
                                  className="commande-annuler-btn"
                                  onClick={() => ouvrirAnnulation(commande)}
                                >
                                  Annuler
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              className="commande-supprimer-btn"
                              onClick={() => supprimerCommande(commande._id)}
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