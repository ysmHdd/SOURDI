import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Inscription from "./pages/auth/Inscription";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Utilisateurs from "./pages/admin/Utilisateurs";
import Produits from "./pages/admin/Produits";
import DashboardEleve from "./pages/eleve/DashboardEleve";
import Marketplace from "./pages/eleve/Marketplace";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;