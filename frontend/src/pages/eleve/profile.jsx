import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import "./profile.css";

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

const Profile = () => {
  const { utilisateur, deconnexion, updateUtilisateur } = useAuth();
  const navigate = useNavigate();

  const [dark, setDark] = useState(localStorage.getItem("sourdi_dark") === "true");
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: "",
  });

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

  const chargerProfil = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5003/api/eleve/profil");
      setProfil(res.data);

      if (res.data.avatar) {
        setAvatar({
          gender: res.data.avatar.gender || "female",
          style:
            res.data.avatar.style && res.data.avatar.style.includes("-")
              ? res.data.avatar.style
              : res.data.avatar.gender === "male"
              ? "boy-short"
              : "girl-long",
          seed: res.data.avatar.seed || "default-student",
        });
      }
    } catch (err) {
      setErreur("Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("sourdi_dark", dark);
  }, [dark]);

  useEffect(() => {
    chargerProfil();
  }, []);

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

  const enregistrerAvatar = async () => {
    try {
      setErreur("");
      setMessage("");

      const res = await axios.patch("http://localhost:5003/api/eleve/profil/avatar", {
        avatar: {
          gender: avatar.gender,
          style: avatar.style,
          seed: avatar.seed,
          url: avatarUrl,
        },
      });

      setProfil(res.data);

      if (updateUtilisateur) {
        updateUtilisateur({
          ...utilisateur,
          avatar: {
            gender: avatar.gender,
            style: avatar.style,
            seed: avatar.seed,
            url: avatarUrl,
          },
        });
      }

      setAvatarModalOpen(false);
      setMessage("Avatar modifié avec succès.");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la modification de l'avatar.");
    }
  };

  const modifierMotDePasse = async (e) => {
    e.preventDefault();
    setErreur("");
    setMessage("");

    if (passwordForm.nouveauMotDePasse !== passwordForm.confirmerMotDePasse) {
      setErreur("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.patch("http://localhost:5003/api/eleve/profil/mot-de-passe", {
        ancienMotDePasse: passwordForm.ancienMotDePasse,
        nouveauMotDePasse: passwordForm.nouveauMotDePasse,
      });

      setPasswordForm({
        ancienMotDePasse: "",
        nouveauMotDePasse: "",
        confirmerMotDePasse: "",
      });

      setMessage("Mot de passe modifié avec succès.");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de la modification du mot de passe.");
    }
  };

  if (loading) {
    return (
      <div className={`profile-root ${dark ? "dark" : "light"}`}>
        <div className="profile-loading">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className={`profile-root ${dark ? "dark" : "light"}`}>
      <div className="profile-blob profile-blob-1" />
      <div className="profile-blob profile-blob-2" />

      <header className="profile-header">
        <div className="profile-header-left">
          <Link to="/eleve" className="profile-logo">SOURDI</Link>
          <span className="profile-tagline">Profil élève</span>
        </div>

        <div className="profile-header-right">
          <button className="profile-theme-btn" type="button" onClick={() => setDark(!dark)}>
            {dark ? "Clair" : "Sombre"}
          </button>

          <Link to="/eleve" className="profile-back-btn">
            Accueil
          </Link>

          <button
            className="profile-logout-btn"
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

      <main className="profile-main">
        <section className="profile-hero-card">
          <div className="profile-avatar-big">
            <img src={avatarUrl} alt="Avatar élève" />
          </div>

          <div className="profile-hero-info">
            <span className="profile-small-label">Compte élève</span>
            <h1>{profil?.user_first_name} {profil?.user_last_name}</h1>
            <p>{profil?.user_email}</p>
          </div>

          <button
            className="profile-main-btn"
            type="button"
            onClick={() => setAvatarModalOpen(true)}
          >
            Modifier l'avatar
          </button>
        </section>

        {message && <div className="profile-success">{message}</div>}
        {erreur && <div className="profile-error">{erreur}</div>}

        <section className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-head">
              <h2>Coordonnées de l'élève</h2>
              <p>Informations personnelles et scolaires</p>
            </div>

            <div className="profile-info-list">
              <div className="profile-info-item">
                <span>Prénom</span>
                <strong>{profil?.user_first_name || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Nom</span>
                <strong>{profil?.user_last_name || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Email</span>
                <strong>{profil?.user_email || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Téléphone</span>
                <strong>{profil?.user_phone || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Niveau</span>
                <strong>{profil?.params?.grade || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Gouvernorat</span>
                <strong>{profil?.params?.gouvernorat || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Délégation</span>
                <strong>{profil?.params?.delegation || "-"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Région</span>
                <strong>{profil?.params?.region || "-"}</strong>
              </div>

              <div className="profile-info-item full">
                <span>École</span>
                <strong>{profil?.params?.school_name || "-"}</strong>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-card-head">
              <h2>Modifier le mot de passe</h2>
              <p>Entre ton ancien mot de passe puis le nouveau</p>
            </div>

            <form className="profile-password-form" onSubmit={modifierMotDePasse}>
              <div>
                <label>Ancien mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.ancienMotDePasse}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, ancienMotDePasse: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.nouveauMotDePasse}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, nouveauMotDePasse: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.confirmerMotDePasse}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmerMotDePasse: e.target.value })
                  }
                  required
                />
              </div>

              <button className="profile-main-btn" type="submit">
                Enregistrer le mot de passe
              </button>
            </form>
          </div>
        </section>
      </main>

      {avatarModalOpen && (
        <div className="profile-avatar-modal-overlay">
          <div className="profile-avatar-modal">
            <div className="profile-avatar-modal-header">
              <h3>Personnaliser l'avatar</h3>
              <button type="button" onClick={() => setAvatarModalOpen(false)}>×</button>
            </div>

            <div className="profile-avatar-builder">
              <div className="profile-avatar-preview-box">
                <img src={avatarUrl} alt="Avatar preview" />
              </div>

              <div className="profile-avatar-controls">
                <div className="profile-avatar-row">
                  <label>Genre</label>
                  <div className="profile-avatar-options">
                    {[
                      { value: "female", label: "Girl" },
                      { value: "male", label: "Boy" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={avatar.gender === option.value ? "active" : ""}
                        onClick={() => handleAvatarChange("gender", option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="profile-avatar-row">
                  <label>Style d'avatar</label>
                  <div className="profile-avatar-style-grid">
                    {avatarStylesByGender[avatar.gender].map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        className={avatar.style === style.value ? "active" : ""}
                        onClick={() => handleAvatarChange("style", style.value)}
                      >
                        <img src={getPreviewAvatarUrl(style.value)} alt={style.label} />
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="profile-avatar-row">
                  <label>Nom / code avatar</label>
                  <input
                    type="text"
                    value={avatar.seed}
                    onChange={(e) => handleAvatarChange("seed", e.target.value)}
                    placeholder="avatar-name"
                  />
                </div>

                <button className="profile-secondary-btn" type="button" onClick={generateRandomAvatar}>
                  Avatar aléatoire
                </button>
              </div>
            </div>

            <button className="profile-save-avatar-btn" type="button" onClick={enregistrerAvatar}>
              Enregistrer l'avatar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;