import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";

const DashboardEleve = () => {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const [profil, setProfil] = useState(null);
  const [kpi, setKpi] = useState({
    lessonsCompletes: 0,
    tempsPasseEnMinutes: 0,
    nombreConnexions: 0,
    autoEvaluation: 0,
  });

  const charger = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/eleve/profil");
      setProfil(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const mettreAJourKPI = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:5003/api/eleve/coins/kpi", kpi);
      charger();
    } catch (err) {
      console.error(err);
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

        body {
          margin: 0;
          padding: 0;
        }

        .dashboard-bg {
          min-height: 100vh;
          padding: 32px 24px 50px;
          background: linear-gradient(145deg, #FFF8E1 0%, #FCE4EC 45%, #E8EAF6 100%);
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .dashboard-bg::before,
        .dashboard-bg::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
          animation: floatBlob 7s ease-in-out infinite;
          z-index: 0;
        }

        .dashboard-bg::before {
          width: 320px;
          height: 320px;
          background: #FF80AB;
          top: -90px;
          left: -90px;
        }

        .dashboard-bg::after {
          width: 240px;
          height: 240px;
          background: #82B1FF;
          bottom: -70px;
          right: -70px;
          animation-delay: 3s;
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

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border: 3px solid rgba(240, 220, 255, 0.85);
          border-radius: 30px;
          padding: 24px 28px;
          box-shadow:
            0 24px 64px rgba(180, 120, 220, 0.16),
            0 2px 8px rgba(0,0,0,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 28px;
          animation: popIn 0.55s ease;
        }

        .title-wrap h1 {
          margin: 0;
          font-family: 'Fredoka One', cursive;
          font-size: 2.2rem;
          letter-spacing: 2px;
          background: linear-gradient(90deg, #AB47BC, #EF5350, #FF7043);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-right {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.85);
          padding: 10px 14px;
          border-radius: 22px;
          border: 2px solid #EDE7F6;
          box-shadow: 0 8px 20px rgba(171, 71, 188, 0.08);
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #F3E5F5, #E8EAF6);
          color: #5E548E;
          border: 2px solid #E1BEE7;
          padding: 12px 18px;
          border-radius: 18px;
          font-weight: 800;
          box-shadow: 0 6px 18px rgba(171, 71, 188, 0.12);
        }

        .logout-btn {
          border: none;
          border-radius: 18px;
          padding: 12px 18px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #EC407A, #EF5350);
          box-shadow: 0 8px 20px rgba(239, 83, 80, 0.28);
          transition: 0.2s ease;
          white-space: nowrap;
        }

        .logout-btn:hover {
          transform: translateY(-2px) scale(1.02);
          filter: brightness(1.05);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-bottom: 26px;
        }

        .card {
          background: rgba(255, 255, 255, 0.93);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 26px;
          border: 3px solid rgba(240, 220, 255, 0.8);
          box-shadow:
            0 18px 44px rgba(180, 120, 220, 0.12),
            0 2px 8px rgba(0,0,0,0.05);
          animation: popIn 0.6s ease;
        }

        .card h3 {
          margin: 0 0 14px;
          color: #7B4BAA;
          font-size: 1.2rem;
          font-weight: 800;
        }

        .coins-box {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .coin-icon {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: radial-gradient(circle at 30% 30%, #FFF59D, #FFD54F, #FFB300);
          box-shadow: 0 10px 26px rgba(255, 193, 7, 0.35);
        }

        .coin-value {
          font-size: 2.2rem;
          font-weight: 900;
          color: #5E35B1;
          margin: 0;
        }

        .coin-label {
          margin: 4px 0 0;
          color: #A1887F;
          font-weight: 700;
          font-size: 0.92rem;
        }

        .kpi-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }

        .kpi-item {
          background: linear-gradient(135deg, #FAF7FF, #FDF2F8);
          border: 2px solid #EEE3F8;
          border-radius: 18px;
          padding: 14px;
        }

        .kpi-item span {
          display: block;
        }

        .kpi-label {
          color: #9C7DB6;
          font-size: 0.82rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .kpi-value {
          color: #5E35B1;
          font-size: 1.2rem;
          font-weight: 900;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          padding: 28px;
          border: 3px solid rgba(240, 220, 255, 0.85);
          box-shadow:
            0 18px 44px rgba(180, 120, 220, 0.12),
            0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 26px;
          animation: popIn 0.7s ease;
        }

        .form-card h3 {
          margin: 0 0 8px;
          color: #7B4BAA;
          font-size: 1.35rem;
          font-weight: 800;
        }

        .kpi-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
        }

        .field-label {
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #AB47BC;
          margin-bottom: 7px;
          padding-left: 2px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 2.5px solid #EDE7F6;
          border-radius: 16px;
          font-size: 0.98rem;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          color: #37474F;
          background: #FAFAFA;
          outline: none;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.2s;
        }

        .input:focus {
          border-color: #AB47BC;
          background: #FDFAFF;
          box-shadow: 0 0 0 4px rgba(171, 71, 188, 0.12);
        }

        .input::placeholder {
          color: #CE93D8;
          font-weight: 700;
        }

        .submit-btn {
          grid-column: span 2;
          border: none;
          border-radius: 18px;
          padding: 16px;
          font-family: 'Fredoka One', cursive;
          font-size: 1.05rem;
          letter-spacing: 1px;
          cursor: pointer;
          color: white;
          background: linear-gradient(135deg, #AB47BC 0%, #EF5350 100%);
          box-shadow: 0 10px 24px rgba(171, 71, 188, 0.35);
          transition: 0.2s ease;
        }

        .submit-btn:hover {
          transform: translateY(-3px) scale(1.02);
          filter: brightness(1.05);
        }

        .market-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 26px;
          border-radius: 18px;
          text-decoration: none;
          color: white;
          font-weight: 900;
          font-size: 1rem;
          background: linear-gradient(135deg, #43A047, #26C6DA);
          box-shadow: 0 10px 24px rgba(38, 198, 218, 0.24);
          transition: 0.2s ease;
          animation: popIn 0.8s ease;
        }

        .market-link:hover {
          transform: translateY(-3px) scale(1.02);
          filter: brightness(1.05);
        }

        @media (max-width: 900px) {
          .dashboard-grid,
          .kpi-form,
          .kpi-list {
            grid-template-columns: 1fr;
          }

          .submit-btn {
            grid-column: span 1;
          }
        }

        @media (max-width: 700px) {
          .user-section {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 600px) {
          .dashboard-bg {
            padding: 20px 14px 36px;
          }

          .dashboard-header,
          .card,
          .form-card {
            padding: 20px;
            border-radius: 24px;
          }

          .title-wrap h1 {
            font-size: 1.7rem;
          }

          .coin-value {
            font-size: 1.8rem;
          }

          .user-section {
            flex-direction: column;
            align-items: stretch;
          }

          .logout-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="dashboard-bg">
        <div className="stars">
          <span className="star" style={{ top: "8%", left: "8%", animationDelay: "0s" }}>⭐</span>
          <span className="star" style={{ top: "12%", right: "10%", animationDelay: "1s" }}>✨</span>
          <span className="star" style={{ top: "40%", left: "4%", animationDelay: "2.2s" }}>🌟</span>
          <span className="star" style={{ bottom: "20%", right: "6%", animationDelay: "0.6s" }}>⭐</span>
          <span className="star" style={{ bottom: "12%", left: "10%", animationDelay: "2.8s" }}>✨</span>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="title-wrap">
              <h1>SOURDI — Élève</h1>
            </div>

            <div className="header-right">
              <div className="user-section">
                <div className="user-badge">👤 {utilisateur?.nom}</div>
                <button
                  className="logout-btn"
                  onClick={() => {
                    deconnexion();
                    navigate("/login");
                  }}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h3>🌟 Mes Sourdi Coins</h3>
              <div className="coins-box">
                <div className="coin-icon">🪙</div>
                <div>
                  <p className="coin-value">{profil?.solde ?? 0} coins</p>
                  <p className="coin-label">Bravo, continue à apprendre pour en gagner plus !</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Mes KPI</h3>
              <div className="kpi-list">
                <div className="kpi-item">
                  <span className="kpi-label">Leçons complétées</span>
                  <span className="kpi-value">{profil?.kpi?.lessonsCompletes ?? 0}</span>
                </div>

                <div className="kpi-item">
                  <span className="kpi-label">Temps passé</span>
                  <span className="kpi-value">{profil?.kpi?.tempsPasseEnMinutes ?? 0} min</span>
                </div>

                <div className="kpi-item">
                  <span className="kpi-label">Connexions</span>
                  <span className="kpi-value">{profil?.kpi?.nombreConnexions ?? 0}</span>
                </div>

                <div className="kpi-item">
                  <span className="kpi-label">Auto-évaluation</span>
                  <span className="kpi-value">{profil?.kpi?.autoEvaluation ?? 0}/10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3>Mettre à jour mes KPI</h3>

            <form onSubmit={mettreAJourKPI} className="kpi-form">
              <div className="field-group">
                <label className="field-label">Leçons complétées</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Ex: 5"
                  value={kpi.lessonsCompletes}
                  onChange={(e) =>
                    setKpi({ ...kpi, lessonsCompletes: e.target.value })
                  }
                />
              </div>

              <div className="field-group">
                <label className="field-label">Temps passé (minutes)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Ex: 60"
                  value={kpi.tempsPasseEnMinutes}
                  onChange={(e) =>
                    setKpi({ ...kpi, tempsPasseEnMinutes: e.target.value })
                  }
                />
              </div>

              <div className="field-group">
                <label className="field-label">Nombre de connexions</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Ex: 3"
                  value={kpi.nombreConnexions}
                  onChange={(e) =>
                    setKpi({ ...kpi, nombreConnexions: e.target.value })
                  }
                />
              </div>

              <div className="field-group">
                <label className="field-label">Auto-évaluation (0-10)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Ex: 8"
                  value={kpi.autoEvaluation}
                  onChange={(e) =>
                    setKpi({ ...kpi, autoEvaluation: e.target.value })
                  }
                />
              </div>

              <button className="submit-btn" type="submit">
                Mettre à jour
              </button>
            </form>
          </div>

          <Link to="/eleve/marketplace" className="market-link">
            Aller à la Marketplace
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardEleve;