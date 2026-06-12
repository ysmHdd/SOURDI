import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";
import "./marketplace.css";

import EleveHeader from "../../components/layout/EleveHeader";
import EleveSidebar from "../../components/layout/EleveSidebar";
import EleveFooter from "../../components/layout/EleveFooter";

const API_ELEVE = "http://localhost:5003";
const API_ADMIN = "http://localhost:5002";

const Marketplace = () => {
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();
  const { t } = useTranslation();

  const [produits, setProduits] = useState([]);
  const [profil, setProfil] = useState(null);
  const [solde, setSolde] = useState(0);
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [lang, setLang] = useState(
    localStorage.getItem("i18nextLng") || "fr"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const enregistrerActiviteCoins = () => {};

  const [recherche, setRecherche] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("tous");
  const [filtreStock, setFiltreStock] = useState("tous");
  const [produitSelectionne, setProduitSelectionne] = useState(null);

  const charger = async () => {
    try {
      const [produitsRes, coinsRes, profilRes] = await Promise.all([
        axios.get(`${API_ELEVE}/api/eleve/marketplace`),
        axios.get(`${API_ELEVE}/api/eleve/coins/solde`),
        axios.get(`${API_ELEVE}/api/eleve/profil`),
      ]);

      setProduits(produitsRes.data);
      setSolde(coinsRes.data.solde);
      setProfil(profilRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const ajouterAuPanier = async (idProduit) => {
    try {
      await axios.post(
        `${API_ELEVE}/api/eleve/marketplace/panier/ajouter/${idProduit}`,
        { quantite: 1 }
      );

      setMessage(t("market.ajoute"));
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || t("market.erreurAjout")
      );
    }
  };

  useEffect(() => {
    charger();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const produitsFiltres = produits.filter((p) => {
    const texte = `${p.nom || ""} ${p.description || ""}`.toLowerCase();

    const matchRecherche = texte.includes(recherche.toLowerCase());

    const matchCategorie =
      filtreCategorie === "tous" || p.categorie === filtreCategorie;

    const matchStock =
      filtreStock === "tous" ||
      (filtreStock === "disponible" && p.stock > 0) ||
      (filtreStock === "rupture" && p.stock <= 0);

    return matchRecherche && matchCategorie && matchStock;
  });

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

        <div
          className={`acc-page-content ${
            sidebarOpen ? "sidebar-open" : ""
          }`}
        >
          <main className="market-page">
        <div className="market-page-head">
          <h1>{t("market.titre")}</h1>
          <p>{t("market.sousTitre")}</p>
        </div>

        <div className="market-filters">
          <input
            className="market-filter-input"
            placeholder={t("market.rechercher")}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />

          <select
            className="market-filter-input"
            value={filtreCategorie}
            onChange={(e) => setFiltreCategorie(e.target.value)}
          >
            <option value="tous">{t("market.toutesCategories")}</option>
            <option value="cours">{t("market.cours")}</option>
            <option value="livre">{t("market.livre")}</option>
            <option value="autre">{t("market.autre")}</option>
          </select>

          <select
            className="market-filter-input"
            value={filtreStock}
            onChange={(e) => setFiltreStock(e.target.value)}
          >
            <option value="tous">{t("market.tousStocks")}</option>
            <option value="disponible">{t("market.disponible")}</option>
            <option value="rupture">{t("market.rupture")}</option>
          </select>
        </div>

        {message && <div className="market-message">{message}</div>}

        {produitsFiltres.length > 0 ? (
          <div className="market-products-grid">
            {produitsFiltres.map((p) => (
              <div
                key={p._id}
                className="market-product-card"
                onClick={() => setProduitSelectionne(p)}
              >
                {p.photo ? (
                  <img
                    src={`${API_ADMIN}${p.photo}`}
                    alt={p.nom}
                    className="market-product-image"
                  />
                ) : (
                  <div className="market-product-placeholder" />
                )}

                <h3>{p.nom}</h3>
                <p>{p.description}</p>

                <div className="market-product-meta">
                  <strong>{p.prixEnCoins} coins</strong>
                  <span>Stock: {p.stock}</span>
                </div>

                <span className="market-category">{p.categorie}</span>

                <button
                  className="market-add-btn"
                  type="button"
                  onClick={() => ajouterAuPanier(p._id)}
                  disabled={p.stock <= 0}
                >
                  {t("market.ajouterPanier")}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="market-empty">{t("market.aucunProduit")}</div>
        )}
      </main>

          {produitSelectionne && (
            <div
              className="market-modal-overlay"
              onClick={() => setProduitSelectionne(null)}
            >
              <div
                className="market-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="market-modal-close"
                  onClick={() => setProduitSelectionne(null)}
                >
                  ✕
                </button>

                {produitSelectionne.photo ? (
                  <img
                    src={`${API_ADMIN}${produitSelectionne.photo}`}
                    alt={produitSelectionne.nom}
                    className="market-modal-image"
                  />
                ) : (
                  <div className="market-modal-image" />
                )}

                <h2>{produitSelectionne.nom}</h2>

                <p>{produitSelectionne.description}</p>

                <div className="market-modal-info">
                  <span>
                    <strong>{t("market.categorie")} :</strong>{" "}
                    {produitSelectionne.categorie}
                  </span>

                  <span>
                    <strong>{t("market.prix")} :</strong>{" "}
                    {produitSelectionne.prixEnCoins} Coins
                  </span>

                  <span>
                    <strong>{t("market.stock")} :</strong>{" "}
                    {produitSelectionne.stock}
                  </span>
                </div>

                <button
                  className="market-add-btn"
                  onClick={() =>
                    ajouterAuPanier(produitSelectionne._id)
                  }
                  disabled={produitSelectionne.stock <= 0}
                >
                  {t("market.ajouterPanier")}
                </button>
              </div>
            </div>
          )}

          <EleveFooter />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;