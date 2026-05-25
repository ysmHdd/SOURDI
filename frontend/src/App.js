import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Inscription from "./pages/auth/Inscription";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Utilisateurs from "./pages/admin/Utilisateurs";
import Produits from "./pages/admin/Produits";
import Exercices from "./pages/admin/Exercices";

import Accueil from "./pages/eleve/Accueil";
import DashboardEleve from "./pages/eleve/DashboardEleve";
import Marketplace from "./pages/eleve/Marketplace";
import Profile from "./pages/eleve/profile";

import Selection from "./pages/eleve/exercices/Selection";
import Quiz from "./pages/eleve/exercices/Quiz";
import Resultat from "./pages/eleve/exercices/Resultat";
import Panier from "./pages/eleve/Panier";
import EmailConfirmed from "./pages/auth/EmailConfirmed";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import SignalementsAdmin from "./pages/admin/SignalementsAdmin";
import Calendrier from "./pages/eleve/Calendrier";
import DemandesAcces from "./pages/admin/DemandesAcces";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/utilisateurs"
            element={
              <ProtectedRoute role="admin">
                <Utilisateurs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/produits"
            element={
              <ProtectedRoute role="admin">
                <Produits />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exercices"
            element={
              <ProtectedRoute role="admin">
                <Exercices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve"
            element={
              <ProtectedRoute role="etudiant">
                <Accueil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/dashboard"
            element={
              <ProtectedRoute role="etudiant">
                <DashboardEleve />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/marketplace"
            element={
              <ProtectedRoute role="etudiant">
                <Marketplace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/profile"
            element={
              <ProtectedRoute role="etudiant">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/exercices"
            element={
              <ProtectedRoute role="etudiant">
                <Selection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/exercices/quiz"
            element={
              <ProtectedRoute role="etudiant">
                <Quiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/exercices/resultat"
            element={
              <ProtectedRoute role="etudiant">
                <Resultat />
              </ProtectedRoute>
            }
          />
          <Route
  path="/eleve/panier"
  element={
    <ProtectedRoute role="etudiant">
      <Panier />
    </ProtectedRoute>
  }
/>
<Route
  path="/email-confirmed"
  element={<EmailConfirmed />}
/>
<Route
  path="/admin/messages"
  element={
    <ProtectedRoute role="admin">
      <MessagesAdmin />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/signalements"
  element={
    <ProtectedRoute role="admin">
      <SignalementsAdmin />
    </ProtectedRoute>
  }
/>
<Route path="/eleve/calendrier" element={<Calendrier />} />
<Route
  path="/admin/demandes"
  element={
    <ProtectedRoute role="admin">
      <DemandesAcces />
    </ProtectedRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;