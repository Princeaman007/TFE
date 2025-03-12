import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Ajout de useNavigate

function ResetPassword() {
  const { token } = useParams(); // Récupère le token de l'URL
  const navigate = useNavigate(); // ✅ Initialisation de la navigation
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        // ✅ Redirige vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }

    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation :", error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div>
      <h2>Réinitialisation du mot de passe</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ResetPassword;
