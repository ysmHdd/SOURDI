import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";

import EleveHeader from "../../components/layout/EleveHeader";
import EleveSidebar from "../../components/layout/EleveSidebar";
import EleveFooter from "../../components/layout/EleveFooter";

import "./accueil.css";
import "./panier.css";

const API_ELEVE = "http://localhost:5003";
const API_ADMIN = "http://localhost:5002";

const Panier = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [lang, setLang] = useState(localStorage.getItem("i18nextLng") || "fr");
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const enregistrerActiviteCoins = () => {};

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
      setErreur(t("panier.chargementErreur"));
    }
  };

  useEffect(() => {
    charger();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("i18nextLng", lang);
  }, [lang]);

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
      setErreur(
        err.response?.data?.message || t("panier.modificationErreur")
      );
    }
  };

  const supprimerProduit = async (idProduit) => {
    try {
      setErreur("");
      setMessage("");

      await axios.delete(
        `${API_ELEVE}/api/eleve/marketplace/panier/supprimer/${idProduit}`
      );

      setMessage(t("panier.produitSupprimeMsg"));
      charger();
    } catch (err) {
      setErreur(
        err.response?.data?.message || t("panier.suppressionErreur")
      );
    }
  };

  const viderPanier = async () => {
    try {
      setErreur("");
      setMessage("");

      await axios.delete(`${API_ELEVE}/api/eleve/marketplace/panier/vider`);

      setMessage(t("panier.panierVideMsg"));
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || t("panier.vidageErreur"));
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

      setMessage(
        `${res.data.message} — Solde restant: ${res.data.soldeRestant} coins`
      );
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || t("panier.validationErreur"));
    }
  };

  const annulerCommande = async (idTransaction) => {
    try {
      setErreur("");
      setMessage("");

      await axios.patch(
        `${API_ELEVE}/api/eleve/marketplace/commandes/${idTransaction}/annuler`
      );

      setMessage(t("panier.commandeAnnuleeMsg"));
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || t("panier.annulationErreur"));
    }
  };

  const supprimerCommande = async (idTransaction) => {
    try {
      setErreur("");
      setMessage("");

      await axios.delete(
        `${API_ELEVE}/api/eleve/marketplace/commandes/${idTransaction}`
      );

      setMessage(t("panier.commandeSupprimeeMsg"));
      charger();
    } catch (err) {
      setErreur(err.response?.data?.message || t("panier.suppressionErreur"));
    }
  };

  const getStatutLabel = (statut) => {
    if (statut === "annulee") return t("panier.annulee");
    if (statut === "livree") return t("panier.livree");
    return t("panier.reussie");
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

      <EleveHeader
        lang={lang}
        setLang={setLang}
        dark={dark}
        setDark={setDark}
        enregistrerActiviteCoins={enregistrerActiviteCoins}
      />

      <div className="acc-layout">
        <EleveSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          enregistrerActiviteCoins={enregistrerActiviteCoins}
        />

        <div className={`acc-page-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          <main className="panier-page">
            <div className="panier-head">
              <h1>{t("panier.titre")}</h1>
              <p>{t("panier.sousTitre")}</p>
            </div>

            {message && <div className="panier-success">{message}</div>}
            {erreur && <div className="panier-error">{erreur}</div>}

            <div className="panier-grid">
              <section className="panier-card">
                <div className="panier-card-head">
                  <h2>{t("panier.produits")}</h2>

                  {produits.length > 0 && (
                    <button
                      type="button"
                      className="panier-clear-btn"
                      onClick={viderPanier}
                    >
                      {t("panier.viderPanier")}
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
                              onChange={(e) =>
                                modifierQuantite(p._id, Number(e.target.value))
                              }
                            />

                            <button
                              type="button"
                              onClick={() => supprimerProduit(p._id)}
                            >
                              {t("panier.supprimer")}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="panier-empty">
                    {t("panier.panierVide")}
                    <Link to="/eleve/marketplace">{t("panier.voirMarketplace")}</Link>
                  </div>
                )}
              </section>

              <section className="panier-card">
                <div className="panier-card-head">
                  <h2>{t("panier.validation")}</h2>
                  <span className="panier-total">{total} coins</span>
                </div>

                <div className="panier-client">
                  <div>
                    <span>{t("panier.nom")}</span>
                    <strong>
                      {profil?.user_first_name} {profil?.user_last_name}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{profil?.user_email}</strong>
                  </div>

                  <div>
                    <span>{t("panier.telephone")}</span>
                    <strong>{profil?.user_phone}</strong>
                  </div>
                </div>

                <form className="panier-form" onSubmit={validerCommande}>
                  <div>
                    <label>{t("panier.adresse")}</label>
                    <input
                      type="text"
                      value={adresseLivraison.adresse}
                      onChange={(e) =>
                        setAdresseLivraison({
                          ...adresseLivraison,
                          adresse: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>{t("panier.gouvernorat")}</label>
                    <input
                      type="text"
                      value={adresseLivraison.gouvernorat}
                      onChange={(e) =>
                        setAdresseLivraison({
                          ...adresseLivraison,
                          gouvernorat: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>{t("panier.delegation")}</label>
                    <input
                      type="text"
                      value={adresseLivraison.delegation}
                      onChange={(e) =>
                        setAdresseLivraison({
                          ...adresseLivraison,
                          delegation: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>{t("panier.codePostal")}</label>
                    <input
                      type="text"
                      required
                      value={adresseLivraison.codePostal}
                      onChange={(e) =>
                        setAdresseLivraison({
                          ...adresseLivraison,
                          codePostal: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="full">
                    <label>{t("panier.note")}</label>
                    <textarea
                      value={adresseLivraison.note}
                      onChange={(e) =>
                        setAdresseLivraison({
                          ...adresseLivraison,
                          note: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" disabled={produits.length === 0}>
                    {t("panier.validerCommande")}
                  </button>
                </form>
              </section>
            </div>

            <section className="panier-card commandes-card">
              <div className="panier-card-head">
                <h2>{t("panier.mesCommandes")}</h2>
                <span className="panier-total">
                  {commandes.length} {t("panier.commande")}
                </span>
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
                        className={`commande-item ${
                          estAnnulee ? "annulee" : ""
                        } ${estLivree ? "livree" : ""}`}
                      >
                        <div className="commande-photo">
                          {produit?.photo ? (
                            <img
                              src={`${API_ADMIN}${produit.photo}`}
                              alt={produit.nom}
                            />
                          ) : (
                            <div className="panier-placeholder" />
                          )}
                        </div>

                        <div className="commande-info">
                          <h3>{produit?.nom || t("panier.produitSupprime")}</h3>
                          <p>{t("panier.quantite")} : {commande.quantite}</p>
                          <p>{t("panier.total")} : {commande.montantEnCoins} coins</p>
                          <p>
                            {t("panier.date")} :{" "}
                            {commande.createdAt
                              ? new Date(commande.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </p>

                          {estAnnulee && (
                            <div className="commande-annulation">
                              <strong>{t("panier.commandeAnnulee")}</strong>
                            </div>
                          )}

                          {estLivree && (
                            <div className="commande-livraison">
                              <strong>{t("panier.commandeLivree")}</strong>
                            </div>
                          )}
                        </div>

                        <div className="commande-actions">
                          <span
                            className={`commande-statut ${getStatutClass(
                              commande.statut
                            )}`}
                          >
                            {getStatutLabel(commande.statut)}
                          </span>

                          {!estAnnulee && !estLivree && (
                            <button
                              type="button"
                              onClick={() => annulerCommande(commande._id)}
                            >
                              {t("panier.annuler")}
                            </button>
                          )}

                          {(estAnnulee || estLivree) && (
                            <button
                              type="button"
                              className="commande-delete-btn"
                              onClick={() => supprimerCommande(commande._id)}
                            >
                              {t("panier.supprimer")}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="panier-empty">
                  {t("panier.pasCommandes")}
                </div>
              )}
            </section>
          </main>

          <EleveFooter />
        </div>
      </div>
    </div>
  );
};

export default Panier;