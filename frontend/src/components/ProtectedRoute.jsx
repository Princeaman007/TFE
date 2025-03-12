import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ Aucun token trouvé, redirection vers /login");
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log("🔍 Token décodé :", decodedToken);

    // Vérifier si le token est expiré
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      console.warn("⚠️ Token expiré, suppression et redirection vers /login");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    console.log("🔍 Rôle détecté :", decodedToken.role);

    // Vérifier si le rôle est autorisé
    if (!allowedRoles.includes(decodedToken.role)) {
      console.warn("⚠️ Accès refusé pour le rôle :", decodedToken.role);
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />; // Affiche la page si le rôle est autorisé
  } catch (error) {
    console.error("❌ Erreur lors du décodage du token :", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
