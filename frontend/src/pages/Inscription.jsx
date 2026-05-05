import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Inscription = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const [avatar, setAvatar] = useState({
    gender: "female",
    style: "avataaars",
    seed: `female-${Math.floor(Math.random() * 999999)}`,
  });

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

  const avatarUrl = useMemo(() => {
    const cleanSeed = avatar.seed?.trim() || `${avatar.gender}-student`;

    const femaleParams = [
      "top=bigHair,bob,bun,curvy,longButNotTooLong,straight01,straight02,straightAndStrand",
      "topProbability=100",
      "facialHairProbability=0",
      "accessories=round,prescription01,prescription02",
      "accessoriesProbability=35",
      "hairColor=2c1b18,724133,a55728,d6b370,f59797",
      "clothing=shirtScoopNeck,shirtVNeck,overall,hoodie",
      "clothesColor=ff488e,ffafb9,ffffff,65c9ff,c0aede",
      "mouth=smile,twinkle,default",
      "eyes=happy,default,wink",
      "eyebrows=raisedExcited,defaultNatural,upDownNatural",
      "backgroundColor=fbcfe8,f9a8d4,fce7f3,ffd5dc",
      "backgroundType=gradientLinear,solid",
      "radius=50",
    ].join("&");

    const maleParams = [
      "top=shortFlat,shortRound,shortWaved,theCaesar,theCaesarAndSidePart",
      "topProbability=100",
      "facialHairProbability=0",
      "eyes=happy,default,wink",
      "mouth=smile,twinkle,default",
      "eyebrows=raisedExcited,defaultNatural,upDownNatural",
      "hairColor=2c1b18,724133,a55728",
      "clothing=hoodie,shirtCrewNeck,overall",
      "clothesColor=65c9ff,5199e4,25557c,b6e3f4",
      "backgroundColor=b6e3f4,93c5fd,e0f2fe,dbeafe",
      "backgroundType=gradientLinear,solid",
      "radius=50",
    ].join("&");

    const genderParams = avatar.gender === "male" ? maleParams : femaleParams;

    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
      cleanSeed
    )}&${genderParams}`;
  }, [avatar.seed, avatar.gender]);

  const t = {
    fr: {
      title: "Créer un compte étudiant",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmation",
      dob: "Date de naissance",
      phone: "Téléphone",
      grade: "Niveau / Classe",
      gouvernorat: "Gouvernorat",
      delegation: "Délégation",
      region: "Région",
      school: "Nom de l'école",
      gradeOptions: [
        { value: "1ere annee primaire", label: "1ère année primaire" },
        { value: "2eme annee primaire", label: "2ème année primaire" },
        { value: "3eme annee primaire", label: "3ème année primaire" },
        { value: "4eme annee primaire", label: "4ème année primaire" },
        { value: "5eme annee primaire", label: "5ème année primaire" },
        { value: "6eme annee primaire", label: "6ème année primaire" },
      ],
      chooseAvatar: "Choisir mon avatar",
      customizeAvatar: "Personnaliser l'avatar",
      gender: "Genre",
      avatarStyle: "Style d'avatar",
      avatarSeed: "Nom / code avatar",
      randomAvatar: "Avatar aléatoire",
      saveAvatar: "Valider l'avatar",
      button: "Créer mon compte",
      divider: "OU",
      haveAccount: "Déjà un compte ?",
      login: "Se connecter",
      invalidEmail: "Email invalide.",
      invalidPassword:
        "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
      success:
        "Compte créé. Veuillez confirmer votre email avant de vous connecter.",
      error: "Erreur lors de l'inscription",
    },
    en: {
      title: "Create student account",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      dob: "Date of birth",
      phone: "Phone",
      grade: "Grade / Class",
      gouvernorat: "Governorate",
      delegation: "Delegation",
      region: "Region",
      school: "School name",
      gradeOptions: [
        { value: "1ere annee primaire", label: "1st year primary school" },
        { value: "2eme annee primaire", label: "2nd year primary school" },
        { value: "3eme annee primaire", label: "3rd year primary school" },
        { value: "4eme annee primaire", label: "4th year primary school" },
        { value: "5eme annee primaire", label: "5th year primary school" },
        { value: "6eme annee primaire", label: "6th year primary school" },
      ],
      chooseAvatar: "Choose my avatar",
      customizeAvatar: "Customize avatar",
      gender: "Gender",
      avatarStyle: "Avatar style",
      avatarSeed: "Avatar name / code",
      randomAvatar: "Random avatar",
      saveAvatar: "Save avatar",
      button: "Create my account",
      divider: "OR",
      haveAccount: "Already have an account?",
      login: "Login",
      invalidEmail: "Invalid email.",
      invalidPassword:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      passwordMismatch: "Passwords do not match.",
      success: "Account created. Please confirm your email before logging in.",
      error: "Registration error",
    },
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (key, value) => {
    if (key === "gender") {
      setAvatar({
        ...avatar,
        gender: value,
        style: "avataaars",
        seed: `${value}-${Math.random().toString(36).substring(2, 10)}`,
      });
      return;
    }

    setAvatar({ ...avatar, [key]: value });
  };

  const generateRandomAvatar = () => {
    const randomSeed = `${avatar.gender}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    setAvatar({
      ...avatar,
      style: "avataaars",
      seed: randomSeed,
    });
  };

  const validerFormulaire = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|tn|fr|net|org)$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.+&@!#$%^*_-]).{8,}$/;

    if (!emailRegex.test(form.user_email)) return t[lang].invalidEmail;
    if (!passwordRegex.test(form.password)) return t[lang].invalidPassword;
    if (form.password !== form.confirmPassword) return t[lang].passwordMismatch;

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
      avatar: {
        gender: avatar.gender,
        style: avatar.style,
        seed: avatar.seed,
      },
    };

    try {
      const res = await axios.post("/api/auth/inscription", body);

      setSucces(res.data.message || t[lang].success);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setErreur(err.response?.data?.message || t[lang].error);
    }
  };

  const AvatarPreview = ({ small = false }) => (
    <div className={small ? "avatar-preview small" : "avatar-preview"}>
      <img
        className="dicebear-avatar-img"
        src={avatarUrl}
        alt="Avatar DiceBear"
      />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800&display=swap');

        .register-bg.light {
          --bg1: #FFF8E1;
          --bg2: #FCE4EC;
          --bg3: #E8EAF6;
          --card: rgba(255, 255, 255, 0.92);
          --input-bg: #FAFAFA;
          --text: #37474F;
          --muted: #BDBDBD;
          --border: #EDE7F6;
          --card-border: rgba(240, 220, 255, 0.8);
          --divider: #EDE7F6;
        }

        .register-bg.dark {
          --bg1: #151020;
          --bg2: #241133;
          --bg3: #0F172A;
          --card: rgba(31, 24, 44, 0.94);
          --input-bg: #2A2238;
          --text: #F8F5FF;
          --muted: #C8B6D9;
          --border: #5E3A7A;
          --card-border: rgba(130, 90, 170, 0.45);
          --divider: #5E3A7A;
        }

        .register-bg {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, var(--bg1) 0%, var(--bg2) 45%, var(--bg3) 100%);
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
          box-sizing: border-box;
        }

        .register-bg::before,
        .register-bg::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
          animation: floatBlob 7s ease-in-out infinite;
        }

        .register-bg::before {
          width: 320px;
          height: 320px;
          background: #FF80AB;
          top: -80px;
          left: -80px;
        }

        .register-bg::after {
          width: 240px;
          height: 240px;
          background: #82B1FF;
          bottom: -60px;
          right: -60px;
          animation-delay: 3.5s;
        }

        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
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

        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.3); }
        }

        .register-card {
          background: var(--card);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          padding: 28px 38px 22px;
          width: 680px;
          height: 92vh;
          overflow: hidden;
          box-shadow:
            0 24px 64px rgba(180, 120, 220, 0.16),
            0 2px 8px rgba(0,0,0,0.06);
          border: 3px solid var(--card-border);
          position: relative;
          z-index: 2;
          animation: cardPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          box-sizing: border-box;
        }

        .register-form-scroll {
          height: calc(92vh - 345px);
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 8px;
        }

        .register-form-scroll::-webkit-scrollbar {
          width: 7px;
        }

        .register-form-scroll::-webkit-scrollbar-thumb {
          background: rgba(171, 71, 188, 0.45);
          border-radius: 20px;
        }

        .register-form-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.75) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .theme-toggle {
          position: absolute;
          top: 16px;
          right: 16px;
          border: none;
          background: rgba(171, 71, 188, 0.15);
          border-radius: 50%;
          width: 42px;
          height: 42px;
          cursor: pointer;
          font-size: 20px;
          z-index: 5;
        }

        .lang-switch {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          gap: 6px;
          z-index: 5;
        }

        .lang-btn {
          border: none;
          padding: 7px 10px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          background: rgba(171, 71, 188, 0.14);
          color: var(--text);
        }

        .lang-btn.active {
          background: linear-gradient(135deg, #AB47BC, #EF5350);
          color: white;
        }

        .mascot-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 6px;
        }

        .mascot {
          position: relative;
          animation: owlFloat 3s ease-in-out infinite;
          width: 78px;
          height: 84px;
        }

        @keyframes owlFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        .owl-body {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 52px;
          height: 60px;
          background: linear-gradient(160deg, #7C4DFF, #512DA8);
          border-radius: 50% 50% 44% 44% / 55% 55% 45% 45%;
          box-shadow: 0 8px 24px rgba(124, 77, 255, 0.4);
        }

        .owl-tummy {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 34px;
          background: #EDE7F6;
          border-radius: 50%;
        }

        .owl-head {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 44px;
          background: linear-gradient(160deg, #9575CD, #7C4DFF);
          border-radius: 50% 50% 42% 42% / 52% 52% 48% 48%;
        }

        .owl-tuft {
          position: absolute;
          top: -8px;
          width: 12px;
          height: 16px;
          background: #7C4DFF;
          border-radius: 50% 50% 30% 30%;
        }

        .owl-tuft.left {
          left: 6px;
          transform: rotate(-15deg);
        }

        .owl-tuft.right {
          right: 6px;
          transform: rotate(15deg);
        }

        .owl-eyes {
          display: flex;
          justify-content: center;
          gap: 9px;
          padding-top: 13px;
        }

        .owl-eye-ring {
          width: 17px;
          height: 17px;
          background: #FFD740;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 2px #FF6F00;
        }

        .owl-eye-pupil {
          width: 8px;
          height: 8px;
          background: #1A237E;
          border-radius: 50%;
          position: relative;
        }

        .owl-eye-pupil::after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          top: 1px;
          left: 1px;
        }

        .owl-beak {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #FF8F00;
          margin: 4px auto 0;
        }

        .owl-wing {
          position: absolute;
          bottom: 20px;
          width: 16px;
          height: 28px;
          background: linear-gradient(160deg, #9575CD, #512DA8);
          border-radius: 50% 20% 40% 50%;
        }

        .owl-wing.left {
          left: -9px;
          transform: rotate(10deg);
        }

        .owl-wing.right {
          right: -9px;
          transform: rotate(-10deg) scaleX(-1);
        }

        .owl-book {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 25px;
          background: #EF5350;
          border-radius: 3px 6px 6px 3px;
          box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
        }

        .owl-book::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #B71C1C;
          border-radius: 2px;
        }

        .owl-book::after {
          content: '';
          position: absolute;
          left: 10px;
          top: 6px;
          width: 20px;
          height: 2px;
          background: rgba(255,255,255,0.5);
          box-shadow: 0 5px 0 rgba(255,255,255,0.5), 0 10px 0 rgba(255,255,255,0.5);
          border-radius: 1px;
        }

        .owl-cap {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 8px;
          background: #212121;
          border-radius: 3px;
        }

        .owl-cap::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 12px;
          background: #212121;
          border-radius: 3px 3px 0 0;
        }

        .owl-cap::after {
          content: '';
          position: absolute;
          top: -3px;
          right: 4px;
          width: 2px;
          height: 10px;
          background: #FFD740;
          border-radius: 1px;
        }

        .register-title {
          font-family: 'Fredoka One', cursive;
          font-size: 2.45rem;
          text-align: center;
          background: linear-gradient(90deg, #AB47BC, #EF5350, #FF7043);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 3px;
          margin: 4px 0;
        }

        .register-subtitle {
          text-align: center;
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: 0.4px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .full {
          grid-column: 1 / -1;
        }

        .field-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #AB47BC;
          margin-bottom: 7px;
        }

        .register-input {
          width: 100%;
          padding: 13px 15px;
          border: 2.5px solid var(--border);
          border-radius: 16px;
          font-size: 0.95rem;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          color: var(--text);
          background: var(--input-bg);
          transition: border-color 0.22s, box-shadow 0.22s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }

        .register-input:focus {
          border-color: #AB47BC;
          box-shadow: 0 0 0 4px rgba(171, 71, 188, 0.12);
        }

        .register-input::placeholder {
          color: #CE93D8;
          font-weight: 700;
        }

        .register-select {
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, #AB47BC 50%),
            linear-gradient(135deg, #AB47BC 50%, transparent 50%),
            linear-gradient(135deg, rgba(171, 71, 188, 0.12), rgba(239, 83, 80, 0.08));
          background-position:
            calc(100% - 22px) calc(50% + 1px),
            calc(100% - 14px) calc(50% + 1px),
            100% 0;
          background-size:
            8px 8px,
            8px 8px,
            48px 100%;
          background-repeat: no-repeat;
          padding-right: 58px;
        }

        .register-select:hover {
          border-color: rgba(171, 71, 188, 0.65);
          box-shadow: 0 0 0 4px rgba(171, 71, 188, 0.08);
        }

        .register-select option {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          color: #37474F;
          background: #FFFFFF;
        }

        .register-error,
        .register-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 14px;
          padding: 10px 16px;
          font-size: 0.88rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 12px;
        }

        .register-error {
          background: #FFF3F3;
          border: 2px solid #FFCDD2;
          color: #C62828;
        }

        .register-success {
          background: #F1FFF5;
          border: 2px solid #C8E6C9;
          color: #2E7D32;
        }

        .register-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #AB47BC 0%, #EF5350 100%);
          color: white;
          border: none;
          border-radius: 18px;
          font-family: 'Fredoka One', cursive;
          font-size: 1.1rem;
          letter-spacing: 1.2px;
          cursor: pointer;
          margin-top: 18px;
          transition: transform 0.18s, box-shadow 0.18s, filter 0.2s;
          box-shadow: 0 8px 24px rgba(171, 71, 188, 0.4);
          grid-column: 1 / -1;
        }

        .register-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 32px rgba(171, 71, 188, 0.5);
          filter: brightness(1.06);
        }

        .avatar-choice-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 16px;
          border: 2.5px solid rgba(171, 71, 188, 0.25);
          border-radius: 26px;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.85), transparent 34%),
            linear-gradient(135deg, rgba(171, 71, 188, 0.16), rgba(239, 83, 80, 0.12));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 14px 32px rgba(171, 71, 188, 0.16);
        }

        .avatar-choice-info {
          display: flex;
          align-items: center;
          gap: 14px;
          color: var(--text);
          font-weight: 900;
        }

        .avatar-choice-btn,
        .avatar-save-btn,
        .avatar-option-btn {
          border: none;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
        }

        .avatar-choice-btn {
          padding: 12px 17px;
          border-radius: 18px;
          background: linear-gradient(135deg, #7C3AED, #EC4899, #F97316);
          color: white;
          box-shadow: 0 12px 26px rgba(236, 72, 153, 0.32);
          transition: 0.2s;
        }

        .avatar-choice-btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        .avatar-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 12, 28, 0.58);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 18px;
        }

        .avatar-modal {
          width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.9), transparent 34%),
            var(--card);
          border: 3px solid var(--card-border);
          border-radius: 34px;
          padding: 26px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.32);
          animation: cardPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .avatar-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .avatar-modal-title {
          margin: 0;
          font-family: 'Fredoka One', cursive;
          font-size: 1.55rem;
          background: linear-gradient(90deg, #7C3AED, #EC4899, #F97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .avatar-close-btn {
          border: none;
          background: rgba(171, 71, 188, 0.14);
          color: var(--text);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          font-weight: 900;
        }

        .avatar-builder {
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 24px;
          align-items: start;
        }

        .avatar-preview-box {
          background:
            radial-gradient(circle at 25% 20%, rgba(255,255,255,0.96), transparent 24%),
            radial-gradient(circle at 80% 12%, rgba(255,255,255,0.8), transparent 20%),
            linear-gradient(145deg, rgba(255, 216, 240, 0.88), rgba(226, 232, 255, 0.95));
          border-radius: 32px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 305px;
          border: 2px solid rgba(171, 71, 188, 0.16);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 18px 38px rgba(124, 58, 237, 0.12);
          overflow: hidden;
        }

        .avatar-controls {
          display: grid;
          gap: 13px;
        }

        .avatar-row {
          display: grid;
          gap: 8px;
        }

        .avatar-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .avatar-option-btn {
          padding: 8px 12px;
          border-radius: 15px;
          background: rgba(171, 71, 188, 0.12);
          color: var(--text);
          transition: 0.18s;
        }

        .avatar-option-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          background: rgba(171, 71, 188, 0.18);
        }

        .avatar-option-btn.active {
          background: linear-gradient(135deg, #7C3AED, #EC4899);
          color: white;
          box-shadow: 0 8px 18px rgba(236, 72, 153, 0.24);
        }

        .avatar-seed-input {
          width: 100%;
          padding: 11px 13px;
          border: 2.5px solid var(--border);
          border-radius: 15px;
          font-size: 0.9rem;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          color: var(--text);
          background: var(--input-bg);
          outline: none;
          box-sizing: border-box;
        }

        .avatar-preview {
          width: 200px;
          height: 240px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-preview.small {
          width: 64px;
          height: 64px;
          background:
            radial-gradient(circle at 30% 15%, rgba(255,255,255,0.9), transparent 35%),
            linear-gradient(135deg, rgba(236,72,153,0.25), rgba(124,58,237,0.18));
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(171, 71, 188, 0.26);
          box-shadow: 0 8px 18px rgba(124, 58, 237, 0.16);
        }

        .dicebear-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 16px 22px rgba(124, 58, 237, 0.20));
          animation: avatarFloat 3.2s ease-in-out infinite;
        }

        .avatar-preview.small .dicebear-avatar-img {
          padding: 4px;
          box-sizing: border-box;
          filter: none;
          animation: none;
        }

        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .avatar-save-btn {
          width: 100%;
          padding: 18px;
          margin-top: 24px;
          border-radius: 24px;
          border: none;
          font-weight: 900;
          font-size: 1.1rem;
          letter-spacing: 1px;
          cursor: pointer;
          background: linear-gradient(135deg, #7C3AED, #EC4899, #F97316);
          color: white;
          box-shadow:
            0 18px 40px rgba(236, 72, 153, 0.4),
            inset 0 2px 0 rgba(255,255,255,0.3);
          transition: all 0.25s ease;
        }

        .avatar-save-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow:
            0 28px 55px rgba(236, 72, 153, 0.55),
            inset 0 2px 0 rgba(255,255,255,0.4);
        }

        .avatar-save-btn:active {
          transform: scale(0.97);
        }

        .register-footer {
          background: var(--card);
          padding-top: 10px;
        }

        .register-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 10px 0 8px;
        }

        .divider-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--divider), transparent);
          border-radius: 2px;
        }

        .divider-text {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 800;
          letter-spacing: 1px;
        }

        .register-link-area {
          text-align: center;
          font-size: 0.9rem;
          color: var(--muted);
          font-weight: 700;
          margin: 0;
        }

        .register-link-area a {
          font-weight: 800;
          background: linear-gradient(90deg, #AB47BC, #EF5350);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
        }

        @media (max-width: 700px) {
          .register-card {
            width: 100%;
            height: 94vh;
            padding: 28px 24px 20px;
          }

          .register-form-scroll {
            height: calc(94vh - 345px);
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .avatar-builder {
            grid-template-columns: 1fr;
          }

          .avatar-modal {
            width: 100%;
          }

          .avatar-choice-card {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <div className={`register-bg ${theme}`}>
        <div className="stars">
          <span className="star" style={{ top: "12%", left: "8%" }}>⭐</span>
          <span className="star" style={{ top: "8%", right: "12%", animationDelay: "1.1s" }}>✨</span>
          <span className="star" style={{ bottom: "22%", left: "6%", animationDelay: "2.3s" }}>⭐</span>
          <span className="star" style={{ bottom: "16%", right: "8%", animationDelay: "0.7s" }}>✨</span>
          <span className="star" style={{ top: "42%", left: "3%", animationDelay: "1.8s" }}>🌟</span>
          <span className="star" style={{ top: "30%", right: "4%", animationDelay: "3s" }}>🌟</span>
        </div>

        <div className="register-card">
          <div className="lang-switch">
            <button className={`lang-btn ${lang === "fr" ? "active" : ""}`} onClick={() => changeLang("fr")} type="button">FR</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => changeLang("en")} type="button">EN</button>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="mascot-wrap">
            <div className="mascot">
              <div className="owl-body">
                <div className="owl-tummy" />
                <div className="owl-wing left" />
                <div className="owl-wing right" />
                <div className="owl-book" />
              </div>

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

          <h2 className="register-title">SOURDI</h2>
          <p className="register-subtitle">{t[lang].title}</p>

          {erreur && <div className="register-error"><span>😬</span> {erreur}</div>}
          {succes && <div className="register-success"><span>📧</span> {succes}</div>}

          <div className="register-form-scroll">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="full">
                  <div className="avatar-choice-card">
                    <div className="avatar-choice-info">
                      <AvatarPreview small />
                      <span>{t[lang].chooseAvatar}</span>
                    </div>
                    <button
                      className="avatar-choice-btn"
                      type="button"
                      onClick={() => setAvatarModalOpen(true)}
                    >
                      ✨ {t[lang].customizeAvatar}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="field-label">{t[lang].firstName}</label>
                  <input className="register-input" type="text" name="user_first_name" placeholder={t[lang].firstName} value={form.user_first_name} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].lastName}</label>
                  <input className="register-input" type="text" name="user_last_name" placeholder={t[lang].lastName} value={form.user_last_name} onChange={handleChange} required />
                </div>

                <div className="full">
                  <label className="field-label">{t[lang].email}</label>
                  <input className="register-input" type="email" name="user_email" placeholder="email@exemple.com" value={form.user_email} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].password}</label>
                  <input className="register-input" type="password" name="password" placeholder={t[lang].password} value={form.password} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].confirmPassword}</label>
                  <input className="register-input" type="password" name="confirmPassword" placeholder={t[lang].confirmPassword} value={form.confirmPassword} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].dob}</label>
                  <input className="register-input" type="date" name="user_dob" value={form.user_dob} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].phone}</label>
                  <input className="register-input" type="tel" name="user_phone" placeholder={t[lang].phone} value={form.user_phone} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].grade}</label>
                  <select
                    className="register-input register-select"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- {t[lang].grade} --</option>
                    {t[lang].gradeOptions.map((gradeOption) => (
                      <option key={gradeOption.value} value={gradeOption.value}>
                        {gradeOption.label}
                      </option>
                    ))}
                  </select>
                </div>

               <div>
  <label className="field-label">{t[lang].gouvernorat}</label>
  <select
    className="register-input register-select"
    name="gouvernorat"
    value={form.gouvernorat}
    onChange={handleChange}
    required
  >
    <option value="">-- {t[lang].gouvernorat} --</option>
    <option value="Ariana">Ariana</option>
    <option value="Beja">Béja</option>
    <option value="Ben Arous">Ben Arous</option>
    <option value="Bizerte">Bizerte</option>
    <option value="Gabes">Gabès</option>
    <option value="Gafsa">Gafsa</option>
    <option value="Jendouba">Jendouba</option>
    <option value="Kairouan">Kairouan</option>
    <option value="Kasserine">Kasserine</option>
    <option value="Kebili">Kébili</option>
    <option value="Kef">Le Kef</option>
    <option value="Mahdia">Mahdia</option>
    <option value="Manouba">Manouba</option>
    <option value="Medenine">Médenine</option>
    <option value="Monastir">Monastir</option>
    <option value="Nabeul">Nabeul</option>
    <option value="Sfax">Sfax</option>
    <option value="Sidi Bouzid">Sidi Bouzid</option>
    <option value="Siliana">Siliana</option>
    <option value="Sousse">Sousse</option>
    <option value="Tataouine">Tataouine</option>
    <option value="Tozeur">Tozeur</option>
    <option value="Tunis">Tunis</option>
    <option value="Zaghouan">Zaghouan</option>
  </select>
</div>

                <div>
                  <label className="field-label">{t[lang].delegation}</label>
                  <input className="register-input" type="text" name="delegation" placeholder={t[lang].delegation} value={form.delegation} onChange={handleChange} required />
                </div>

                <div>
                  <label className="field-label">{t[lang].region}</label>
                  <input className="register-input" type="text" name="region" placeholder={t[lang].region} value={form.region} onChange={handleChange} required />
                </div>

                <div className="full">
                  <label className="field-label">{t[lang].school}</label>
                  <input className="register-input" type="text" name="school_name" placeholder={t[lang].school} value={form.school_name} onChange={handleChange} required />
                </div>

                <button className="register-btn" type="submit">
                  {t[lang].button}
                </button>
              </div>
            </form>
          </div>

          <div className="register-footer">
            <div className="register-divider">
              <div className="divider-line" />
              <span className="divider-text">{t[lang].divider}</span>
              <div className="divider-line" />
            </div>

            <p className="register-link-area">
              {t[lang].haveAccount} <Link to="/login">{t[lang].login}</Link>
            </p>
          </div>
        </div>

        {avatarModalOpen && (
          <div className="avatar-modal-overlay">
            <div className="avatar-modal">
              <div className="avatar-modal-header">
                <h3 className="avatar-modal-title">✨ {t[lang].customizeAvatar}</h3>
                <button className="avatar-close-btn" type="button" onClick={() => setAvatarModalOpen(false)}>×</button>
              </div>

              <div className="avatar-builder">
                <div className="avatar-preview-box">
                  <AvatarPreview />
                </div>

                <div className="avatar-controls">
                  <div className="avatar-row">
                    <label className="field-label">{t[lang].gender}</label>
                    <div className="avatar-options">
                      {[
                        { value: "female", label: "👧 Girl" },
                        { value: "male", label: "👦 Boy" },
                      ].map((option) => (
                        <button key={option.value} type="button" className={`avatar-option-btn ${avatar.gender === option.value ? "active" : ""}`} onClick={() => handleAvatarChange("gender", option.value)}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="avatar-row">
                    <label className="field-label">{t[lang].avatarStyle}</label>
                    <div className="avatar-options">
                      <button type="button" className="avatar-option-btn active">
                        Cute student mode
                      </button>
                    </div>
                  </div>

                  <div className="avatar-row">
                    <label className="field-label">{t[lang].avatarSeed}</label>
                    <input
                      className="avatar-seed-input"
                      type="text"
                      value={avatar.seed}
                      onChange={(e) => handleAvatarChange("seed", e.target.value)}
                      placeholder="avatar-name"
                    />
                  </div>

                  <div className="avatar-row">
                    <button className="avatar-choice-btn" type="button" onClick={generateRandomAvatar}>
                      🎲 {t[lang].randomAvatar}
                    </button>
                  </div>
                </div>
              </div>

              <button className="avatar-save-btn" type="button" onClick={() => setAvatarModalOpen(false)}>
                ✨ 💜 {t[lang].saveAvatar} 💜 ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Inscription;