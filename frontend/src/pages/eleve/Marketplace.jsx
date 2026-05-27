import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./accueil.css";
import "./marketplace.css";

const API_ELEVE = "http://localhost:5003";
const API_ADMIN = "http://localhost:5002";

const Marketplace = () => {
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();

  const [produits, setProduits] = useState([]);
  const [profil, setProfil] = useState(null);
  const [solde, setSolde] = useState(0);
  const [message, setMessage] = useState("");
<<<<<<< HEAD
  const [dark, setDark] = useState(localStorage.getItem("sourdi_dark") === "true");
=======
  const [dark, setDark] = useState(
    localStorage.getItem("sourdi_dark") === "true"
  );

  const [recherche, setRecherche] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("tous");
  const [filtreStock, setFiltreStock] = useState("tous");
>>>>>>> origin/notifcalendrier

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

      setMessage("Produit ajouté au panier.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
<<<<<<< HEAD
      setMessage(err.response?.data?.message || "Erreur lors de l'ajout au panier.");
=======
      setMessage(
        err.response?.data?.message || "Erreur lors de l'ajout au panier."
      );
>>>>>>> origin/notifcalendrier
    }
  };

  useEffect(() => {
    charger();
  }, []);

  useEffect(() => {
    localStorage.setItem("sourdi_dark", dark);
  }, [dark]);

<<<<<<< HEAD
=======
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

>>>>>>> origin/notifcalendrier
  return (
    <div className={`acc-root ${dark ? "dark" : "light"}`}>
      <div className="acc-blob acc-blob-1" />
      <div className="acc-blob acc-blob-2" />

      <header className="acc-header">
        <div className="acc-header-left">
          <span className="acc-logo">SOURDI</span>
          <span className="acc-tagline">Marketplace</span>
        </div>

        <div className="acc-header-center">
<<<<<<< HEAD
          <button className="acc-theme-btn" onClick={() => setDark(!dark)} type="button">
=======
          <button
            className="acc-theme-btn"
            onClick={() => setDark(!dark)}
            type="button"
          >
>>>>>>> origin/notifcalendrier
            {dark ? "Clair" : "Sombre"}
          </button>
        </div>

        <div className="acc-header-right">
          <div className="acc-coins-badge">
            <span className="acc-coins-val">{solde}</span>
            <span className="acc-coins-label">Sourdi Coins</span>
          </div>

<<<<<<< HEAD
          <Link to="/eleve" className="acc-cart-link">Accueil</Link>
          <Link to="/eleve/panier" className="acc-cart-link">Panier</Link>
=======
          <Link to="/eleve" className="acc-cart-link">
            Accueil
          </Link>

          <Link to="/eleve/panier" className="acc-cart-link">
            Panier
          </Link>
>>>>>>> origin/notifcalendrier

          <Link to="/eleve/profile" className="acc-user-badge acc-user-link">
            <span className="acc-user-avatar">
              {profil?.avatar?.url ? (
                <img src={profil.avatar.url} alt="Avatar" />
              ) : (
                (utilisateur?.user_first_name || "?")[0].toUpperCase()
              )}
            </span>
<<<<<<< HEAD
=======

>>>>>>> origin/notifcalendrier
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

      <main className="market-page">
        <div className="market-page-head">
          <h1>Marketplace SOURDI</h1>
          <p>Ajoute des produits à ton panier puis valide ta commande.</p>
        </div>

<<<<<<< HEAD
        {message && <div className="market-message">{message}</div>}

        {produits.length > 0 ? (
          <div className="market-products-grid">
            {produits.map((p) => (
              <div key={p._id} className="market-product-card">
                {p.photo ? (
                  <img src={`${API_ADMIN}${p.photo}`} alt={p.nom} className="market-product-image" />
=======
        <div className="market-filters">
          <input
            className="market-filter-input"
            placeholder="Rechercher un produit..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />

          <select
            className="market-filter-input"
            value={filtreCategorie}
            onChange={(e) => setFiltreCategorie(e.target.value)}
          >
            <option value="tous">Toutes catégories</option>
            <option value="cours">Cours</option>
            <option value="livre">Livre</option>
            <option value="autre">Autre</option>
          </select>

          <select
            className="market-filter-input"
            value={filtreStock}
            onChange={(e) => setFiltreStock(e.target.value)}
          >
            <option value="tous">Tous les stocks</option>
            <option value="disponible">Disponible</option>
            <option value="rupture">Rupture de stock</option>
          </select>
        </div>

        {message && <div className="market-message">{message}</div>}

        {produitsFiltres.length > 0 ? (
          <div className="market-products-grid">
            {produitsFiltres.map((p) => (
              <div key={p._id} className="market-product-card">
                {p.photo ? (
                  <img
                    src={`${API_ADMIN}${p.photo}`}
                    alt={p.nom}
                    className="market-product-image"
                  />
>>>>>>> origin/notifcalendrier
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
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        ) : (
<<<<<<< HEAD
          <div className="market-empty">Aucun produit disponible pour le moment.</div>
=======
          <div className="market-empty">Aucun produit trouvé.</div>
>>>>>>> origin/notifcalendrier
        )}
      </main>
    </div>
  );
};

export default Marketplace;