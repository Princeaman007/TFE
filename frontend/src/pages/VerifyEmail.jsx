import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const { token } = useParams(); // Récupérer le token depuis l'URL
  const navigate = useNavigate(); // Pour rediriger après la vérification
  const [message, setMessage] = useState("Vérification en cours...");

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📩 Réponse du serveur :", data);
        setMessage(data.message);

        // ✅ Si l'email est déjà vérifié, on redirige vers la connexion
        if (data.message === "Email déjà vérifié") {
          setMessage("✅ Votre email est déjà vérifié. Vous pouvez vous connecter.");
          setTimeout(() => navigate("/login"), 3000);
        }

        // ❌ Si le lien est invalide ou expiré
        if (data.message === "Lien invalide ou expiré") {
          setMessage("❌ Lien invalide ou expiré. Veuillez demander un nouveau lien.");
        }

        // ✅ Si la vérification est réussie, redirection après 3 secondes
        if (data.message === "Email vérifié avec succès") {
          setTimeout(() => navigate("Login"), 3000);
        }
      })
      .catch(() => setMessage("❌ Erreur lors de la vérification."));
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;
