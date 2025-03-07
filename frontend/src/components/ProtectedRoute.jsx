import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Décoder le token pour récupérer les infos de l'utilisateur
    const decodedToken = jwtDecode(token);

    // Vérifier si l'utilisateur a le bon rôle
    if (!allowedRoles.includes(decodedToken.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
