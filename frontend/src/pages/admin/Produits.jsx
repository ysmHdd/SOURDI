import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "../../api/axios";

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prixEnCoins: "",
    stock: "",
    categorie: "cours",
  });
  const [erreur, setErreur] = useState("");

  const charger = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/admin/produits");
      setProduits(res.data);
      setErreur("");
    } catch {
      setErreur("Erreur chargement produits");
    }
  };

  const creer = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/api/admin/produits", form);
      setForm({
        nom: "",
        description: "",
        prixEnCoins: "",
        stock: "",
        categorie: "cours",
      });
      setErreur("");
      charger();
    } catch {
      setErreur("Erreur création produit");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://localhost:5002/api/admin/produits/${id}`);
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

        .form-card {
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(171, 71, 188, 0.10);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 16px 34px rgba(90, 70, 120, 0.07);
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

        .primary-btn {
          border: none;
          border-radius: 16px;
          padding: 13px 16px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          font-weight: 900;
          color: white;
          background: linear-gradient(135deg, #AB47BC, #7C4DFF);
          box-shadow: 0 10px 22px rgba(124, 77, 255, 0.18);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(171, 71, 188, 0.10);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 16px 34px rgba(90, 70, 120, 0.07);
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

        .danger-btn {
          width: 100%;
          border: none;
          border-radius: 14px;
          padding: 11px 14px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 0.92rem;
          font-weight: 900;
          color: white;
          background: linear-gradient(135deg, #EF5350, #E53935);
          box-shadow: 0 10px 22px rgba(239, 83, 80, 0.16);
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
            <h2 className="admin-main-title">Gestion des Produits</h2>
           
          </div>

          {erreur && <div className="error-box">{erreur}</div>}

          <section className="form-card">
            <h3 className="section-title">Ajouter un produit</h3>
            <p className="section-subtitle">
              Remplissez les informations du produit avant de l’ajouter à la marketplace.
            </p>

            <form onSubmit={creer} className="product-form">
              <input
                className="input"
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
              />

              <input
                className="input"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />

              <input
                className="input"
                type="number"
                placeholder="Prix en Coins"
                value={form.prixEnCoins}
                onChange={(e) => setForm({ ...form, prixEnCoins: e.target.value })}
                required
              />

              <input
                className="input"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />

              <select
                className="input"
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
              >
                <option value="cours">Cours</option>
                <option value="livre">Livre</option>
                <option value="autre">Autre</option>
              </select>

              <button type="submit" className="primary-btn">
                Ajouter
              </button>
            </form>
          </section>

          <div className="products-grid">
            {produits.map((p) => (
              <div key={p._id} className="product-card">
                <h3 className="product-title">{p.nom}</h3>

                <p className="product-desc">{p.description}</p>

                <div className="product-meta">
                  <span>
                    Prix: <strong>{p.prixEnCoins}</strong> coins
                  </span>
                  <span>Stock: {p.stock}</span>
                </div>

                <span className="badge">{p.categorie}</span>

                <button
                  onClick={() => supprimer(p._id)}
                  className="danger-btn"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Produits;