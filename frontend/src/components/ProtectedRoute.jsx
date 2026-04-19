import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { utilisateur } = useAuth();

  if (!utilisateur) return <Navigate to="/login" />;
  if (role && utilisateur.role !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;