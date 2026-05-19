import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import Accueil from "./pages/Accueil";

import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Utilisateurs from "./pages/admin/Utilisateurs";
import Produits from "./pages/admin/Produits";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import SignalementsAdmin from "./pages/admin/SignalementsAdmin";

import DashboardEleve from "./pages/eleve/DashboardEleve";
import Marketplace from "./pages/eleve/Marketplace";
import Profile from "./pages/eleve/profile";
import Panier from "./pages/eleve/Panier";

import EmailConfirmed from "./pages/auth/EmailConfirmed";

import Selection from "./pages/eleve/exercices/Selection";
import ListeExercices from "./pages/eleve/exercices/ListeExercices";
import Quiz from "./pages/eleve/exercices/Quiz";
import Resultat from "./pages/eleve/exercices/Resultat";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />

          {/* ADMIN */}
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

          {/* ELEVE */}
          <Route
            path="/eleve"
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
            path="/eleve/panier"
            element={
              <ProtectedRoute role="etudiant">
                <Panier />
              </ProtectedRoute>
            }
          />

          {/* EXERCICES */}
          <Route
            path="/eleve/exercices"
            element={
              <ProtectedRoute role="etudiant">
                <Selection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/eleve/exercices/liste"
            element={
              <ProtectedRoute role="etudiant">
                <ListeExercices />
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

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;