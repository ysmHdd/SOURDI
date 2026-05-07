import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import axios from "../../api/axios";
import "../../styles/adminLayout.css";

const API = "http://localhost:5002";

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [modeEdition, setModeEdition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prixEnCoins: "",
    stock: "",
    categorie: "cours",
    disponible: true,
  });
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/produits`);
      setProduits(res.data);
      setErreur("");
    } catch {
      setErreur("Erreur chargement produits");
    }
  };

  const resetForm = () => {
    setForm({
      nom: "",
      description: "",
      prixEnCoins: "",
      stock: "",
      categorie: "cours",
      disponible: true,
    });
    setPhoto(null);
    setPreview("");
    setModeEdition(null);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const envoyerForm = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("nom", form.nom);
      data.append("description", form.description);
      data.append("prixEnCoins", form.prixEnCoins);
      data.append("stock", form.stock);
      data.append("categorie", form.categorie);
      data.append("disponible", form.disponible);

      if (photo) {
        data.append("photo", photo);
      }

      if (modeEdition) {
        await axios.patch(`${API}/api/admin/produits/${modeEdition}`, data);
      } else {
        await axios.post(`${API}/api/admin/produits`, data);
      }

      resetForm();
      setErreur("");
      charger();
    } catch {
      setErreur(modeEdition ? "Erreur modification produit" : "Erreur création produit");
    }
  };

  const modifier = (produit) => {
    setModeEdition(produit._id);
    setForm({
      nom: produit.nom || "",
      description: produit.description || "",
      prixEnCoins: produit.prixEnCoins || "",
      stock: produit.stock || "",
      categorie: produit.categorie || "cours",
      disponible: produit.disponible ?? true,
    });
    setPhoto(null);
    setPreview(produit.photo ? `${API}${produit.photo}` : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      await axios.delete(`${API}/api/admin/produits/${id}`);
      setErreur("");
      charger();
    } catch {
      setErreur("Erreur suppression");
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

        .admin-top-card, .form-card, .product-card {
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

        .product-form {
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

        .photo-preview {
          width: 100%;
          height: 140px;
          object-fit: cover;
          border-radius: 18px;
          border: 1px solid #E6DDF2;
          margin-top: 10px;
        }

        .primary-btn, .secondary-btn, .danger-btn {
          border: none;
          border-radius: 16px;
          padding: 13px 16px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          font-weight: 900;
          color: white;
        }

        .primary-btn {
          background: linear-gradient(135deg, #AB47BC, #7C4DFF);
          box-shadow: 0 10px 22px rgba(124, 77, 255, 0.18);
        }

        .secondary-btn {
          background: linear-gradient(135deg, #26A69A, #43A047);
        }

        .danger-btn {
          width: 100%;
          background: linear-gradient(135deg, #EF5350, #E53935);
          box-shadow: 0 10px 22px rgba(239, 83, 80, 0.16);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .product-card {
          padding: 22px;
        }

        .product-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 18px;
          margin-bottom: 16px;
          background: #F3E5F5;
        }

        .product-title {
          margin: 0 0 8px;
          color: #3F3654;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .product-desc {
          margin: 0 0 14px;
          color: #8A8298;
          font-size: 0.93rem;
          line-height: 1.55;
          font-weight: 700;
        }

        .product-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
          color: #4A4458;
          font-weight: 800;
          font-size: 0.94rem;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          background: linear-gradient(135deg, #F3E5F5, #EDE7F6);
          color: #7B4BAA;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .admin-layout { flex-direction: column; }
          .admin-main { padding: 18px; }
          .admin-top-card { padding: 22px; }
          .admin-main-title { font-size: 1.6rem; }
        }
      `}</style>

      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-top-card">
            <span className="admin-top-label">Administration</span>
            <h2 className="admin-main-title">Gestion des Produits</h2>
          </div>

          {erreur && <div className="error-box">{erreur}</div>}

          <section className="form-card">
            <h3 className="section-title">
              {modeEdition ? "Modifier le produit" : "Ajouter un produit"}
            </h3>
            <p className="section-subtitle">
              Remplissez les informations du produit avant de l’ajouter à la marketplace.
            </p>

            <form onSubmit={envoyerForm} className="product-form">
              <input className="input" placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
              <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <input className="input" type="number" placeholder="Prix en Coins" value={form.prixEnCoins} onChange={(e) => setForm({ ...form, prixEnCoins: e.target.value })} required />
              <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />

              <select className="input" value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}>
                <option value="cours">Cours</option>
                <option value="livre">Livre</option>
                <option value="autre">Autre</option>
              </select>

              <select className="input" value={form.disponible} onChange={(e) => setForm({ ...form, disponible: e.target.value === "true" })}>
                <option value="true">Disponible</option>
                <option value="false">Non disponible</option>
              </select>

              <input className="input" type="file" accept="image/*" onChange={handlePhoto} />

              {preview && <img src={preview} alt="Aperçu produit" className="photo-preview" />}

              <button type="submit" className="primary-btn">
                {modeEdition ? "Modifier" : "Ajouter"}
              </button>

              {modeEdition && (
                <button type="button" className="secondary-btn" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </form>
          </section>

          <div className="products-grid">
            {produits.map((p) => (
              <div key={p._id} className="product-card">
                {p.photo && (
                  <img
                    src={`${API}${p.photo}`}
                    alt={p.nom}
                    className="product-image"
                  />
                )}

                <h3 className="product-title">{p.nom}</h3>
                <p className="product-desc">{p.description}</p>

                <div className="product-meta">
                  <span>Prix: <strong>{p.prixEnCoins}</strong> coins</span>
                  <span>Stock: {p.stock}</span>
                  <span>{p.disponible ? "Disponible" : "Non disponible"}</span>
                </div>

                <span className="badge">{p.categorie}</span>

                <div className="actions">
                  <button className="secondary-btn" onClick={() => modifier(p)}>
                    Modifier
                  </button>
                  <button className="danger-btn" onClick={() => supprimer(p._id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Produits;