import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";
import "./panier.css";

const API_ELEVE = "http://localhost:5003";
const API_ADMIN = "http://localhost:5002";

const Panier = () => {
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();

  const [dark, setDark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [profil, setProfil] = useState(null);
  const [panier, setPanier] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const [adresseLivraison, setAdresseLivraison] = useState({
    adresse: "",
    gouvernorat: "",
    delegation: "",
    codePostal: "",
    note: "",
  });

  const charger = async () => {
    try {
      const [panierRes, profilRes, commandesRes] = await Promise.all([
        axios.get(`${API_ELEVE}/api/eleve/marketplace/panier`),
        axios.get(`${API_ELEVE}/api/eleve/profil`),
        axios.get(`${API_ELEVE}/api/eleve/marketplace/historique`),
      ]);

      setPanier(panierRes.data.panier);
      setTotal(panierRes.data.total);
      setProfil(profilRes.data);
      setCommandes(commandesRes.data || []);

      setAdresseLivraison((prev) => ({
        ...prev,
        gouvernorat: profilRes.data?.params?.gouvernorat || "",
        delegation: profilRes.data?.params?.delegation || "",
      }));
    } catch (err) {
      setErreur("Erreur lors du chargement.");
    }
  };

  useEffect(() => {
    charger();
  }, []);

  useEffect(() => {
    localStorage.setItem("sourdi_dark", dark);
  }, [dark]);

  const modifierQuantite = async (idProduit, quantite) => {
    try {
      setErreur("");
      setMessage("");

      await axios.patch(
        `${API_ELEVE}/api/eleve/marketplace/panier/modifier/${idProduit}`,
        { quantite }
      );

      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la modification.");
    }
  };

  const supprimerProduit = async (idProduit) => {
    try {
      setErreur("");
      setMessage("");

      await axios.delete(
        `${API_ELEVE}/api/eleve/marketplace/panier/supprimer/${idProduit}`
      );

      setMessage("Produit supprimé du panier.");
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const viderPanier = async () => {
    try {
      setErreur("");
      setMessage("");

      await axios.delete(`${API_ELEVE}/api/eleve/marketplace/panier/vider`);

      setMessage("Panier vidé.");
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors du vidage du panier.");
    }
  };

  const validerCommande = async (e) => {
    e.preventDefault();

    try {
      setErreur("");
      setMessage("");

      const res = await axios.post(
        `${API_ELEVE}/api/eleve/marketplace/panier/valider`,
        { adresseLivraison }
      );

      setMessage(`${res.data.message} — Solde restant: ${res.data.soldeRestant} coins`);
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la validation.");
    }
  };

  const annulerCommande = async (idTransaction) => {
    try {
      setErreur("");
      setMessage("");

      await axios.patch(
        `${API_ELEVE}/api/eleve/marketplace/commandes/${idTransaction}/annuler`
      );

      setMessage("Commande annulée.");
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  };

  const supprimerCommande = async (idTransaction) => {
    try {
      setErreur("");
      setMessage("");

      await axios.delete(
        `${API_ELEVE}/api/eleve/marketplace/commandes/${idTransaction}`
      );

      setMessage("Commande supprimée.");
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const getStatutLabel = (statut) => {
    if (statut === "annulee") return "Annulée";
    if (statut === "livree") return "Livrée";
    return "Réussie";
  };

  const getStatutClass = (statut) => {
    if (statut === "annulee") return "statut-annulee";
    if (statut === "livree") return "statut-livree";
    return "statut-reussi";
  };

  const produits = panier?.produits || [];

  return (
    <div className={`acc-root ${dark ? "dark" : "light"}`}>
      <div className="acc-blob acc-blob-1" />
      <div className="acc-blob acc-blob-2" />

      <header className="acc-header">
        <div className="acc-header-left">
          <span className="acc-logo">SOURDI</span>
          <span className="acc-tagline">Panier</span>
        </div>

        <div className="acc-header-center">
          <button className="acc-theme-btn" onClick={() => setDark(!dark)} type="button">
            {dark ? "Clair" : "Sombre"}
          </button>
        </div>

        <div className="acc-header-right">
          <Link to="/eleve" className="acc-cart-link">Accueil</Link>
          <Link to="/eleve/marketplace" className="acc-cart-link">Marketplace</Link>

          <Link to="/eleve/profile" className="acc-user-badge acc-user-link">
            <span className="acc-user-avatar">
              {profil?.avatar?.url ? (
                <img src={profil.avatar.url} alt="Avatar" />
              ) : (
                (utilisateur?.user_first_name || "?")[0].toUpperCase()
              )}
            </span>
            <span className="acc-user-name">
              {utilisateur?.user_first_name} {utilisateur?.user_last_name}
            </span>
          </Link>

          <button
            className="acc-logout-btn"
            type="button"
            onClick={() => {
              deconnexion();
              navigate("/login");
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="panier-page">
        <div className="panier-head">
          <h1>Mon panier</h1>
          <p>Modifie ton panier, valide ta commande et consulte tes commandes.</p>
        </div>

        {message && <div className="panier-success">{message}</div>}
        {erreur && <div className="panier-error">{erreur}</div>}

        <div className="panier-grid">
          <section className="panier-card">
            <div className="panier-card-head">
              <h2>Produits</h2>
              {produits.length > 0 && (
                <button type="button" className="panier-clear-btn" onClick={viderPanier}>
                  Vider le panier
                </button>
              )}
            </div>

            {produits.length > 0 ? (
              <div className="panier-list">
                {produits.map((item) => {
                  const p = item.produit;
                  if (!p) return null;

                  return (
                    <div key={p._id} className="panier-item">
                      {p.photo ? (
                        <img src={`${API_ADMIN}${p.photo}`} alt={p.nom} />
                      ) : (
                        <div className="panier-placeholder" />
                      )}

                      <div className="panier-item-info">
                        <h3>{p.nom}</h3>
                        <p>{p.description}</p>
                        <strong>{p.prixEnCoins} coins</strong>
                      </div>

                      <div className="panier-actions">
                        <input
                          type="number"
                          min="1"
                          max={p.stock}
                          value={item.quantite}
                          onChange={(e) => modifierQuantite(p._id, Number(e.target.value))}
                        />

                        <button type="button" onClick={() => supprimerProduit(p._id)}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="panier-empty">
                Ton panier est vide.
                <Link to="/eleve/marketplace"> Voir la marketplace</Link>
              </div>
            )}
          </section>

          <section className="panier-card">
            <div className="panier-card-head">
              <h2>Validation</h2>
              <span className="panier-total">{total} coins</span>
            </div>

            <div className="panier-client">
              <div>
                <span>Nom</span>
                <strong>{profil?.user_first_name} {profil?.user_last_name}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{profil?.user_email}</strong>
              </div>

              <div>
                <span>Téléphone</span>
                <strong>{profil?.user_phone}</strong>
              </div>
            </div>

            <form className="panier-form" onSubmit={validerCommande}>
              <div>
                <label>Adresse</label>
                <input
                  type="text"
                  value={adresseLivraison.adresse}
                  onChange={(e) =>
                    setAdresseLivraison({ ...adresseLivraison, adresse: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Gouvernorat</label>
                <input
                  type="text"
                  value={adresseLivraison.gouvernorat}
                  onChange={(e) =>
                    setAdresseLivraison({ ...adresseLivraison, gouvernorat: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Délégation</label>
                <input
                  type="text"
                  value={adresseLivraison.delegation}
                  onChange={(e) =>
                    setAdresseLivraison({ ...adresseLivraison, delegation: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Code postal</label>
                <input
                  type="text"
                  required
                  value={adresseLivraison.codePostal}
                  onChange={(e) =>
                    setAdresseLivraison({ ...adresseLivraison, codePostal: e.target.value })
                  }
                />
              </div>

              <div className="full">
                <label>Note</label>
                <textarea
                  value={adresseLivraison.note}
                  onChange={(e) =>
                    setAdresseLivraison({ ...adresseLivraison, note: e.target.value })
                  }
                />
              </div>

              <button type="submit" disabled={produits.length === 0}>
                Valider la commande
              </button>
            </form>
          </section>
        </div>

        <section className="panier-card commandes-card">
          <div className="panier-card-head">
            <h2>Mes commandes</h2>
            <span className="panier-total">{commandes.length} commande(s)</span>
          </div>

          {commandes.length > 0 ? (
            <div className="commandes-list">
              {commandes.map((commande) => {
                const produit = commande.produit;
                const estAnnulee = commande.statut === "annulee";
                const estLivree = commande.statut === "livree";

                return (
                  <div
                    key={commande._id}
                    className={`commande-item ${estAnnulee ? "annulee" : ""} ${
                      estLivree ? "livree" : ""
                    }`}
                  >
                    <div className="commande-photo">
                      {produit?.photo ? (
                        <img src={`${API_ADMIN}${produit.photo}`} alt={produit.nom} />
                      ) : (
                        <div className="panier-placeholder" />
                      )}
                    </div>

                    <div className="commande-info">
                      <h3>{produit?.nom || "Produit supprimé"}</h3>
                      <p>Quantité : {commande.quantite}</p>
                      <p>Total : {commande.montantEnCoins} coins</p>
                      <p>
                        Date :{" "}
                        {commande.createdAt
                          ? new Date(commande.createdAt).toLocaleDateString("fr-FR")
                          : "-"}
                      </p>

                      {estAnnulee && (
                        <div className="commande-annulation">
                          <strong>Commande annulée</strong>
                        </div>
                      )}

                      {estLivree && (
                        <div className="commande-livraison">
                          <strong>Commande livrée</strong>
                        </div>
                      )}
                    </div>

                    <div className="commande-actions">
                      <span className={`commande-statut ${getStatutClass(commande.statut)}`}>
                        {getStatutLabel(commande.statut)}
                      </span>

                      {!estAnnulee && !estLivree && (
                        <button type="button" onClick={() => annulerCommande(commande._id)}>
                          Annuler
                        </button>
                      )}

                      {(estAnnulee || estLivree) && (
                        <button
                          type="button"
                          className="commande-delete-btn"
                          onClick={() => supprimerCommande(commande._id)}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="panier-empty">Tu n'as pas encore de commandes.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Panier;