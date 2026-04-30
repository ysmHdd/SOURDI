import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Inscription = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    password: "",
    confirmPassword: "",
    user_dob: "",
    user_phone: "",
    grade: "",
    gouvernorat: "",
    delegation: "",
    region: "",
    school_name: "",
  });

  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validerFormulaire = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|tn|fr|net|org)$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.+&@!#$%^*_-]).{8,}$/;

    if (!emailRegex.test(form.user_email)) {
      return "Email invalide.";
    }

    if (!passwordRegex.test(form.password)) {
      return "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }

    if (form.password !== form.confirmPassword) {
      return "Les mots de passe ne correspondent pas.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setSucces("");

    const erreurValidation = validerFormulaire();

    if (erreurValidation) {
      setErreur(erreurValidation);
      return;
    }

    const body = {
      user_first_name: form.user_first_name,
      user_last_name: form.user_last_name,
      user_email: form.user_email,
      password: form.password,
      user_dob: form.user_dob,
      user_phone: form.user_phone,
      params: {
        grade: form.grade,
        gouvernorat: form.gouvernorat,
        delegation: form.delegation,
        region: form.region,
        school_name: form.school_name,
      },
    };

    try {
      const res = await axios.post("/api/auth/inscription", body);

      setSucces(
        res.data.message ||
          "Compte créé. Veuillez confirmer votre email avant de vous connecter."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titre}>SOURDI</h2>
        <h3 style={styles.sousTitre}>Inscription étudiant</h3>

        {erreur && <p style={styles.erreur}>{erreur}</p>}
        {succes && <p style={styles.succes}>{succes}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              style={styles.input}
              type="text"
              name="user_first_name"
              placeholder="Prénom"
              value={form.user_first_name}
              onChange={handleChange}
              required
            />

            <input
              style={styles.input}
              type="text"
              name="user_last_name"
              placeholder="Nom"
              value={form.user_last_name}
              onChange={handleChange}
              required
            />
          </div>

          <input
            style={styles.input}
            type="email"
            name="user_email"
            placeholder="Email"
            value={form.user_email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="date"
            name="user_dob"
            value={form.user_dob}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="tel"
            name="user_phone"
            placeholder="Téléphone"
            value={form.user_phone}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="grade"
            placeholder="Niveau / Classe"
            value={form.grade}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="gouvernorat"
            placeholder="Gouvernorat"
            value={form.gouvernorat}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="delegation"
            placeholder="Délégation"
            value={form.delegation}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="region"
            placeholder="Région"
            value={form.region}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="school_name"
            placeholder="Nom de l’école"
            value={form.school_name}
            onChange={handleChange}
            required
          />

          <button style={styles.bouton} type="submit">
            S'inscrire
          </button>
        </form>

        <p style={styles.lien}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "30px",
  },
  card: {
    backgroundColor: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "520px",
  },
  titre: {
    textAlign: "center",
    color: "#4f46e5",
    fontSize: "28px",
    marginBottom: "4px",
  },
  sousTitre: {
    textAlign: "center",
    color: "#333",
    marginBottom: "24px",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  bouton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  erreur: {
    color: "red",
    textAlign: "center",
    marginBottom: "12px",
  },
  succes: {
    color: "green",
    textAlign: "center",
    marginBottom: "12px",
  },
  lien: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
  },
};

export default Inscription;