import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Marketplace = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [solde, setSolde] = useState(0);
  const [message, setMessage] = useState("");

  const charger = async () => {
    try {
      const [produitsRes, coinsRes] = await Promise.all([
        axios.get("http://localhost:5003/api/eleve/marketplace"),
        axios.get("http://localhost:5003/api/eleve/coins/solde"),
      ]);
      setProduits(produitsRes.data);
      setSolde(coinsRes.data.solde);
    } catch (err) {
      console.error(err);
    }
  };

  const acheter = async (idProduit) => {
    try {
      const res = await axios.post(`http://localhost:5003/api/eleve/marketplace/acheter/${idProduit}`);
      setMessage(`${res.data.message} — Solde restant: ${res.data.soldeRestant} coins`);
      charger();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Erreur lors de l'achat"}`);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        .market-bg {
          min-height: 100vh;
          padding: 32px 24px 50px;
          background: linear-gradient(145deg, #FFF8E1 0%, #FCE4EC 45%, #E8EAF6 100%);
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .market-bg::before,
        .market-bg::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
          animation: floatBlob 7s ease-in-out infinite;
          z-index: 0;
        }

        .market-bg::before {
          width: 320px;
          height: 320px;
          background: #FF80AB;
          top: -80px;
          left: -80px;
        }

        .market-bg::after {
          width: 240px;
          height: 240px;
          background: #82B1FF;
          bottom: -60px;
          right: -60px;
          animation-delay: 3.4s;
        }

        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .star {
          position: absolute;
          font-size: 22px;
          animation: twinkle 3s ease-in-out infinite;
        }

        .market-content {
          position: relative;
          z-index: 2;
          max-width: 1250px;
          margin: 0 auto;
        }

        .market-header {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border: 3px solid rgba(240, 220, 255, 0.85);
          border-radius: 30px;
          padding: 22px 26px;
          box-shadow:
            0 24px 64px rgba(180, 120, 220, 0.16),
            0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 24px;
          animation: popIn 0.55s ease;
        }

        .back-btn {
          padding: 12px 18px;
          background: linear-gradient(135deg, #7C4DFF, #AB47BC);
          color: white;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(124, 77, 255, 0.25);
          transition: 0.2s ease;
        }

        .back-btn:hover {
          transform: translateY(-2px) scale(1.02);
          filter: brightness(1.05);
        }

        .market-title-wrap {
          flex: 1;
          min-width: 220px;
        }

        .market-title {
          margin: 0;
          font-family: 'Fredoka One', cursive;
          font-size: 2rem;
          letter-spacing: 2px;
          background: linear-gradient(90deg, #AB47BC, #EF5350, #FF7043);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .market-subtitle {
          margin: 6px 0 0;
          color: #A188B5;
          font-size: 0.95rem;
          font-weight: 800;
        }

        .coins-badge {
          background: linear-gradient(135deg, #FFF8C4, #FFE082);
          color: #8D5200;
          border: 2px solid #FFD54F;
          border-radius: 18px;
          padding: 12px 18px;
          font-weight: 900;
          font-size: 1rem;
          box-shadow: 0 8px 18px rgba(255, 193, 7, 0.22);
          white-space: nowrap;
        }

        .message-box {
          padding: 16px 18px;
          background: rgba(255, 255, 255, 0.92);
          border: 3px solid rgba(240, 220, 255, 0.85);
          border-radius: 22px;
          margin-bottom: 22px;
          box-shadow:
            0 14px 34px rgba(180, 120, 220, 0.10),
            0 2px 8px rgba(0,0,0,0.05);
          color: #6A1B9A;
          font-weight: 800;
          animation: popIn 0.65s ease;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 22px;
          border: 3px solid rgba(240, 220, 255, 0.85);
          box-shadow:
            0 18px 44px rgba(180, 120, 220, 0.12),
            0 2px 8px rgba(0,0,0,0.05);
          transition: 0.22s ease;
          animation: popIn 0.7s ease;
          position: relative;
          overflow: hidden;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 22px 48px rgba(180, 120, 220, 0.18),
            0 4px 12px rgba(0,0,0,0.06);
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,255,255,0.65), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .product-icon {
          width: 70px;
          height: 70px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 14px;
          background: linear-gradient(135deg, #F3E5F5, #E8EAF6, #FFF8E1);
          box-shadow: 0 8px 18px rgba(171, 71, 188, 0.12);
        }

        .product-title {
          margin: 0 0 8px;
          color: #6A1B9A;
          font-size: 1.2rem;
          font-weight: 900;
        }

        .product-desc {
          margin: 0 0 14px;
          color: #7E7A8A;
          font-size: 0.94rem;
          line-height: 1.5;
          min-height: 64px;
          font-weight: 700;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .product-price {
          color: #5E35B1;
          font-size: 1.15rem;
          font-weight: 900;
        }

        .product-stock {
          color: #8D6E63;
          font-size: 0.92rem;
          font-weight: 800;
        }

        .category-badge {
          display: inline-block;
          padding: 7px 12px;
          background: linear-gradient(135deg, #EDE7F6, #FCE4EC);
          color: #7B4BAA;
          border-radius: 999px;
          font-size: 0.76rem;
          font-weight: 900;
          margin-bottom: 14px;
          border: 2px solid #E9D8F4;
        }

        .buy-btn {
          width: 100%;
          padding: 14px;
          color: white;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          margin-top: 6px;
          font-size: 0.95rem;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          transition: 0.2s ease;
        }

        .buy-btn.active {
          background: linear-gradient(135deg, #AB47BC 0%, #EF5350 100%);
          box-shadow: 0 10px 24px rgba(171, 71, 188, 0.30);
        }

        .buy-btn.active:hover {
          transform: translateY(-3px) scale(1.02);
          filter: brightness(1.05);
        }

        .buy-btn.disabled {
          background: linear-gradient(135deg, #D7D7D7, #BDBDBD);
          cursor: not-allowed;
          box-shadow: none;
        }

        .empty-box {
          background: rgba(255, 255, 255, 0.92);
          border: 3px solid rgba(240, 220, 255, 0.85);
          border-radius: 28px;
          padding: 34px 24px;
          text-align: center;
          color: #9C7DB6;
          font-weight: 800;
          box-shadow:
            0 18px 44px rgba(180, 120, 220, 0.12),
            0 2px 8px rgba(0,0,0,0.05);
        }

        @media (max-width: 700px) {
          .market-bg {
            padding: 20px 14px 36px;
          }

          .market-header,
          .product-card,
          .message-box {
            border-radius: 24px;
          }

          .market-title {
            font-size: 1.6rem;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="market-bg">
        <div className="stars">
          <span className="star" style={{ top: "9%", left: "8%", animationDelay: "0s" }}>⭐</span>
          <span className="star" style={{ top: "15%", right: "12%", animationDelay: "1s" }}>✨</span>
          <span className="star" style={{ top: "35%", left: "4%", animationDelay: "2s" }}>🌟</span>
          <span className="star" style={{ bottom: "18%", right: "7%", animationDelay: "0.8s" }}>⭐</span>
          <span className="star" style={{ bottom: "12%", left: "12%", animationDelay: "2.5s" }}>✨</span>
        </div>

        <div className="market-content">
          <div className="market-header">
            <button className="back-btn" onClick={() => navigate("/eleve")}>
              ← Retour
            </button>

            <div className="market-title-wrap">
              <h2 className="market-title">Marketplace SOURDI</h2>
            </div>

            <span className="coins-badge">🪙 {solde} coins</span>
          </div>

          {message && <p className="message-box">{message}</p>}

          {produits.length > 0 ? (
            <div className="products-grid">
              {produits.map((p) => (
                <div key={p._id} className="product-card">

                  <h3 className="product-title">{p.nom}</h3>
                  <p className="product-desc">{p.description}</p>

                  <div className="product-meta">
                    <p className="product-price">
                      <strong>{p.prixEnCoins}</strong> coins
                    </p>
                    <p className="product-stock">Stock: {p.stock}</p>
                  </div>

                  <span className="category-badge">{p.categorie}</span>

                  <button
                    className={`buy-btn ${solde >= p.prixEnCoins ? "active" : "disabled"}`}
                    onClick={() => acheter(p._id)}
                    disabled={solde < p.prixEnCoins}
                  >
                    {solde >= p.prixEnCoins ? " Acheter" : " Coins insuffisants"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-box">
               Aucun produit disponible pour le moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Marketplace;