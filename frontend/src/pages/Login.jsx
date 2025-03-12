import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Réinitialise le message d'erreur avant chaque tentative

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "❌ Erreur lors de la connexion");
        return;
      }

      // Vérifier si le token est bien reçu
      if (!data.token) {
        setMessage("❌ Erreur : aucun token reçu");
        return;
      }

      // Stocker le token dans localStorage
      localStorage.setItem("token", data.token);

      // Essayer de décoder le token pour récupérer le rôle
      let decodedToken;
      try {
        decodedToken = jwtDecode(data.token);
      } catch (decodeError) {
        console.error("❌ Erreur lors du décodage du token :", decodeError);
        setMessage("Erreur d'authentification, veuillez réessayer.");
        return;
      }

      console.log("🔍 Token décodé :", decodedToken);

      // Vérification et redirection selon le rôle
      switch (decodedToken.role) {
        case "client":
          navigate("/dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "superAdmin":
          navigate("/superadmin-dashboard");
          break;
        default:
          console.warn("⚠️ Rôle inconnu :", decodedToken.role);
          setMessage("Rôle inconnu, veuillez contacter l'administrateur.");
          break;
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      setMessage("Erreur serveur. Vérifiez votre connexion.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>

      <p style={{ color: "red" }}>{message}</p>

      <p>Pas encore inscrit ? <Link to="/register">Créer un compte</Link></p>
      <p><Link to="/forgot-password">Mot de passe oublié ?</Link></p>
    </div>
  );
}

export default Login;
