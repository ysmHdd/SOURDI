import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./emailConfirmed.css";

const EmailConfirmed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-logo">SOURDI</div>

        <div className="confirm-icon">✓</div>

        <h1>Email confirmé</h1>

        <p>
          Votre adresse email a été confirmée avec succès.
        </p>

        <span>
          Redirection vers la page de connexion...
        </span>
      </div>
    </div>
  );
};

export default EmailConfirmed;