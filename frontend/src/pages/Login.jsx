import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { connexion } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", motDePasse: "" });
  const [erreur, setErreur] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/connexion", form);
      connexion(res.data);
      if (res.data.utilisateur.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/eleve");
      }
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800&display=swap');

        .login-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #FFF8E1 0%, #FCE4EC 45%, #E8EAF6 100%);
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Decorative floating blobs */
        .login-bg::before,
        .login-bg::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
          animation: floatBlob 7s ease-in-out infinite;
        }
        .login-bg::before {
          width: 320px; height: 320px;
          background: #FF80AB;
          top: -80px; left: -80px;
          animation-delay: 0s;
        }
        .login-bg::after {
          width: 240px; height: 240px;
          background: #82B1FF;
          bottom: -60px; right: -60px;
          animation-delay: 3.5s;
        }

        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }

        .login-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          padding: 48px 40px 40px;
          width: 400px;
          box-shadow:
            0 24px 64px rgba(180, 120, 220, 0.16),
            0 2px 8px rgba(0,0,0,0.06);
          border: 3px solid rgba(240, 220, 255, 0.8);
          position: relative;
          z-index: 2;
          animation: cardPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.75) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Mascot owl */
        .mascot-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        .mascot {
          position: relative;
          animation: owlFloat 3s ease-in-out infinite;
          width: 90px;
          height: 96px;
        }
        @keyframes owlFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        /* Owl body */
        .owl-body {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 58px; height: 68px;
          background: linear-gradient(160deg, #7C4DFF, #512DA8);
          border-radius: 50% 50% 44% 44% / 55% 55% 45% 45%;
          box-shadow: 0 8px 24px rgba(124, 77, 255, 0.4);
        }

        /* Owl tummy */
        .owl-tummy {
          position: absolute;
          bottom: 8px; left: 50%;
          transform: translateX(-50%);
          width: 34px; height: 38px;
          background: #EDE7F6;
          border-radius: 50%;
        }

        /* Owl head */
        .owl-head {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 52px; height: 48px;
          background: linear-gradient(160deg, #9575CD, #7C4DFF);
          border-radius: 50% 50% 42% 42% / 52% 52% 48% 48%;
        }

        /* Ear tufts */
        .owl-tuft {
          position: absolute;
          top: -8px;
          width: 12px; height: 16px;
          background: #7C4DFF;
          border-radius: 50% 50% 30% 30%;
        }
        .owl-tuft.left  { left: 6px;  transform: rotate(-15deg); }
        .owl-tuft.right { right: 6px; transform: rotate(15deg); }

        /* Eyes */
        .owl-eyes {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding-top: 14px;
        }
        .owl-eye-ring {
          width: 18px; height: 18px;
          background: #FFD740;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 2px #FF6F00;
        }
        .owl-eye-pupil {
          width: 9px; height: 9px;
          background: #1A237E;
          border-radius: 50%;
          position: relative;
        }
        .owl-eye-pupil::after {
          content: '';
          position: absolute;
          width: 3px; height: 3px;
          background: white;
          border-radius: 50%;
          top: 1px; left: 1px;
        }

        /* Beak */
        .owl-beak {
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #FF8F00;
          margin: 4px auto 0;
        }

        /* Wings */
        .owl-wing {
          position: absolute;
          bottom: 22px;
          width: 18px; height: 30px;
          background: linear-gradient(160deg, #9575CD, #512DA8);
          border-radius: 50% 20% 40% 50%;
        }
        .owl-wing.left  { left: -10px; transform: rotate(10deg); }
        .owl-wing.right { right: -10px; transform: rotate(-10deg) scaleX(-1); }

        /* Book */
        .owl-book {
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%);
          width: 40px; height: 28px;
          background: #EF5350;
          border-radius: 3px 6px 6px 3px;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
        }
        .owl-book::before {
          content: '';
          position: absolute;
          left: 4px; top: 0; bottom: 0;
          width: 3px;
          background: #B71C1C;
          border-radius: 2px;
        }
        .owl-book::after {
          content: '';
          position: absolute;
          left: 10px; top: 6px;
          width: 22px; height: 2px;
          background: rgba(255,255,255,0.5);
          box-shadow: 0 5px 0 rgba(255,255,255,0.5), 0 10px 0 rgba(255,255,255,0.5);
          border-radius: 1px;
        }

        /* Graduation cap */
        .owl-cap {
          position: absolute;
          top: -14px; left: 50%;
          transform: translateX(-50%);
          width: 44px; height: 8px;
          background: #212121;
          border-radius: 3px;
        }
        .owl-cap::before {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 24px; height: 12px;
          background: #212121;
          border-radius: 3px 3px 0 0;
        }
        .owl-cap::after {
          content: '';
          position: absolute;
          top: -3px; right: 4px;
          width: 2px; height: 10px;
          background: #FFD740;
          border-radius: 1px;
        }

        /* Stars */
        .stars {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 1;
        }
        .star {
          position: absolute;
          font-size: 22px;
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.3); }
        }

        .login-title {
          font-family: 'Fredoka One', cursive;
          font-size: 2.6rem;
          text-align: center;
          background: linear-gradient(90deg, #AB47BC, #EF5350, #FF7043);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 3px;
          margin-bottom: 4px;
        }

        .login-subtitle {
          text-align: center;
          color: #BDBDBD;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 28px;
          letter-spacing: 0.4px;
        }

        .field-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          color: #AB47BC;
          margin-bottom: 7px;
          padding-left: 2px;
        }

        .field-wrap {
          position: relative;
          margin-bottom: 18px;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 17px;
          pointer-events: none;
          z-index: 1;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border: 2.5px solid #EDE7F6;
          border-radius: 16px;
          font-size: 0.97rem;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          color: #37474F;
          background: #FAFAFA;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }

        .login-input:focus {
          border-color: #AB47BC;
          background: #FDFAFF;
          box-shadow: 0 0 0 4px rgba(171, 71, 188, 0.12);
        }

        .login-input::placeholder {
          color: #CE93D8;
          font-weight: 700;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFF3F3;
          border: 2px solid #FFCDD2;
          color: #C62828;
          border-radius: 14px;
          padding: 11px 16px;
          font-size: 0.88rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 16px;
          justify-content: center;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #AB47BC 0%, #EF5350 100%);
          color: white;
          border: none;
          border-radius: 18px;
          font-family: 'Fredoka One', cursive;
          font-size: 1.15rem;
          letter-spacing: 1.5px;
          cursor: pointer;
          margin-top: 6px;
          transition: transform 0.18s, box-shadow 0.18s, filter 0.2s;
          box-shadow: 0 8px 24px rgba(171, 71, 188, 0.4);
          position: relative;
          overflow: hidden;
        }

        .login-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%);
          border-radius: inherit;
          pointer-events: none;
        }

        .login-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 32px rgba(171, 71, 188, 0.5);
          filter: brightness(1.06);
        }

        .login-btn:active {
          transform: scale(0.97);
          box-shadow: 0 4px 12px rgba(171, 71, 188, 0.35);
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 16px;
        }
        .divider-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, #EDE7F6, transparent);
          border-radius: 2px;
        }
        .divider-text {
          font-size: 0.75rem;
          color: #CE93D8;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .login-link-area {
          text-align: center;
          font-size: 0.9rem;
          color: #BDBDBD;
          font-weight: 700;
        }

        .login-link-area a {
          font-weight: 800;
          background: linear-gradient(90deg, #AB47BC, #EF5350);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .login-link-area a:hover { opacity: 0.7; }
      `}</style>

      <div className="login-bg">
        {/* Decorative stars */}
        <div className="stars">
          <span className="star" style={{ top: "12%", left: "8%", animationDelay: "0s" }}>⭐</span>
          <span className="star" style={{ top: "8%", right: "12%", animationDelay: "1.1s" }}>✨</span>
          <span className="star" style={{ bottom: "22%", left: "6%", animationDelay: "2.3s" }}>⭐</span>
          <span className="star" style={{ bottom: "16%", right: "8%", animationDelay: "0.7s" }}>✨</span>
          <span className="star" style={{ top: "42%", left: "3%", animationDelay: "1.8s" }}>🌟</span>
          <span className="star" style={{ top: "30%", right: "4%", animationDelay: "3s" }}>🌟</span>
        </div>

        <div className="login-card">
          {/* Owl mascot with graduation cap and book */}
          <div className="mascot-wrap">
            <div className="mascot">
              {/* Body */}
              <div className="owl-body">
                <div className="owl-tummy" />
                <div className="owl-wing left" />
                <div className="owl-wing right" />
                <div className="owl-book" />
              </div>
              {/* Head */}
              <div className="owl-head">
                <div className="owl-cap" />
                <div className="owl-tuft left" />
                <div className="owl-tuft right" />
                <div className="owl-eyes">
                  <div className="owl-eye-ring"><div className="owl-eye-pupil" /></div>
                  <div className="owl-eye-ring"><div className="owl-eye-pupil" /></div>
                </div>
                <div className="owl-beak" />
              </div>
            </div>
          </div>

          <h2 className="login-title">SOURDI</h2>

          {erreur && (
            <div className="login-error">
              <span>😬</span> {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-wrap">
              <label className="field-label" htmlFor="email">Ton email</label>
              <input
                className="login-input"
                type="email"
                id="email"
                name="email"
                placeholder="exemple@mail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field-wrap">
              <label className="field-label" htmlFor="motDePasse">Mot de passe</label>
              <span className="field-icon"></span>
              <input
                className="login-input"
                type="password"
                id="motDePasse"
                name="motDePasse"
                placeholder="••••••••"
                value={form.motDePasse}
                onChange={handleChange}
                required
              />
            </div>

            <button className="login-btn" type="submit">
              Allons-y !
            </button>
          </form>

          <div className="login-divider">
            <div className="divider-line" />
            <span className="divider-text">OU</span>
            <div className="divider-line" />
          </div>

          <p className="login-link-area">
            Pas de compte ? <Link to="/inscription">S'inscrire</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;