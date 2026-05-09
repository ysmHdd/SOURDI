import { createContext, useContext, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(
    JSON.parse(localStorage.getItem("utilisateur")) || null
  );

 const connexion = async (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
  setUtilisateur(data.utilisateur);

  try {
    await axios.post(
      "http://localhost:5003/api/eleve/profil/sync",
      {
        nom: data.utilisateur.user_first_name + " " + data.utilisateur.user_last_name,
        email: data.utilisateur.user_email,
        role: data.utilisateur.role,
      },
      { headers: { Authorization: `Bearer ${data.token}` } }
    );
  } catch (e) {
    console.error("Sync eleve-service échoué:", e);
  }
};

  const deconnexion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);