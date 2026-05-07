import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import InscriptionView from "./InscriptionView";
import "./inscription.css";

const avatarStylesByGender = {
  female: [
    { value: "girl-long", label: "Long hair girl" },
    { value: "girl-bun", label: "Bun hair girl" },
    { value: "girl-bob", label: "Bob hair girl" },
    { value: "girl-curly", label: "Curly hair girl" },
  ],
  male: [
    { value: "boy-short", label: "Short hair boy" },
    { value: "boy-flat", label: "Flat hair boy" },
    { value: "boy-round", label: "Round hair boy" },
    { value: "boy-caesar", label: "Caesar hair boy" },
  ],
};

const getAvatarParams = (gender, style) => {
  const base = [
    "facialHairProbability=0",
    "mouth=smile,twinkle,default",
    "eyes=happy,default,wink",
    "eyebrows=raisedExcited,defaultNatural,upDownNatural",
    "radius=50",
  ];

  const femaleStyles = {
    "girl-long": [
      "top=longButNotTooLong,straight01,straight02,straightAndStrand",
      "clothing=shirtScoopNeck,shirtVNeck,overall",
      "clothesColor=ff488e,ffafb9,c0aede,ffffff",
    ],
    "girl-bun": [
      "top=bun",
      "clothing=shirtScoopNeck,shirtVNeck,hoodie",
      "clothesColor=ff488e,f9a8d4,c0aede",
    ],
    "girl-bob": [
      "top=bob",
      "clothing=shirtScoopNeck,overall,shirtVNeck",
      "clothesColor=ffafb9,ffffff,65c9ff",
    ],
    "girl-curly": [
      "top=curvy,bigHair",
      "clothing=shirtScoopNeck,hoodie,overall",
      "clothesColor=f59797,ff488e,c0aede",
    ],
  };

  const maleStyles = {
    "boy-short": [
      "top=shortWaved,shortRound",
      "clothing=hoodie,shirtCrewNeck,overall",
      "clothesColor=65c9ff,5199e4,25557c",
    ],
    "boy-flat": [
      "top=shortFlat",
      "clothing=hoodie,shirtCrewNeck",
      "clothesColor=5199e4,25557c,b6e3f4",
    ],
    "boy-round": [
      "top=shortRound",
      "clothing=overall,shirtCrewNeck",
      "clothesColor=65c9ff,b6e3f4,25557c",
    ],
    "boy-caesar": [
      "top=theCaesar,theCaesarAndSidePart",
      "clothing=hoodie,shirtCrewNeck",
      "clothesColor=25557c,5199e4,65c9ff",
    ],
  };

  if (gender === "male") {
    return [
      ...base,
      "topProbability=100",
      "hairColor=2c1b18,724133,a55728",
      "backgroundColor=b6e3f4,93c5fd,e0f2fe,dbeafe",
      "backgroundType=gradientLinear,solid",
      ...(maleStyles[style] || maleStyles["boy-short"]),
    ].join("&");
  }

  return [
    ...base,
    "topProbability=100",
    "accessories=round,prescription01,prescription02",
    "accessoriesProbability=35",
    "hairColor=2c1b18,724133,a55728,d6b370,f59797",
    "backgroundColor=fbcfe8,f9a8d4,fce7f3,ffd5dc",
    "backgroundType=gradientLinear,solid",
    ...(femaleStyles[style] || femaleStyles["girl-long"]),
  ].join("&");
};

const Inscription = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const [avatar, setAvatar] = useState({
    gender: "female",
    style: "girl-long",
    seed: `female-${Math.floor(Math.random() * 999999)}`,
  });

  const avatarUrl = useMemo(() => {
    const cleanSeed = avatar.seed?.trim() || `${avatar.gender}-student`;

    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
      cleanSeed
    )}&${getAvatarParams(avatar.gender, avatar.style)}`;
  }, [avatar.seed, avatar.gender, avatar.style]);

  const getPreviewAvatarUrl = (style) => {
    const previewSeed =
      avatar.gender === "male"
        ? `boy-${style}-preview`
        : `girl-${style}-preview`;

    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
      previewSeed
    )}&${getAvatarParams(avatar.gender, style)}`;
  };

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
      const defaultStyle = avatarStylesByGender[value][0].value;

      setAvatar({
        ...avatar,
        gender: value,
        style: defaultStyle,
        seed: `${value}-${Math.random().toString(36).substring(2, 10)}`,
      });
      return;
    }

    if (key === "style") {
      setAvatar({
        ...avatar,
        style: value,
        seed: `${avatar.gender}-${Math.random().toString(36).substring(2, 10)}`,
      });
      return;
    }

    setAvatar({ ...avatar, [key]: value });
  };

  const generateRandomAvatar = () => {
    setAvatar({
      ...avatar,
      seed: `${avatar.gender}-${avatar.style}-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
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

  return (
    <InscriptionView
      theme={theme}
      lang={lang}
      t={t}
      form={form}
      erreur={erreur}
      succes={succes}
      avatar={avatar}
      avatarUrl={avatarUrl}
      avatarModalOpen={avatarModalOpen}
      avatarStylesByGender={avatarStylesByGender}
      getPreviewAvatarUrl={getPreviewAvatarUrl}
      setAvatarModalOpen={setAvatarModalOpen}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      toggleTheme={toggleTheme}
      changeLang={changeLang}
      handleAvatarChange={handleAvatarChange}
      generateRandomAvatar={generateRandomAvatar}
    />
  );
};

export default Inscription;