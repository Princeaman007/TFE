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

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erreur lors de la connexion");
        return;
      }

      // Stocker le token dans localStorage
      localStorage.setItem("token", data.token);

      // Décoder le token pour récupérer le rôle
      const decodedToken = jwtDecode(data.token);

      // Redirection selon le rôle
      if (decodedToken.role === "user") {
        navigate("/dashboard");
      } else if (decodedToken.role === "admin") {
        navigate("/admin-dashboard");
      } else if (decodedToken.role === "superAdmin") {
        navigate("/superadmin-dashboard");
      } else {
        setMessage("Rôle inconnu, veuillez contacter l'administrateur.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      setMessage("Erreur serveur.");
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

      <p>{message}</p>

      <p>Pas encore inscrit ? <Link to="/register">Créer un compte</Link></p>
      <p><Link to="/forgot-password">Mot de passe oublié ?</Link></p>
    </div>
  );
}

export default Login;
