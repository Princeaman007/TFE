import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const { token } = useParams(); // Récupérer le token depuis l'URL
  const navigate = useNavigate(); // Pour rediriger après la vérification
  const [message, setMessage] = useState("Vérification en cours...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la requête");
        }

        const data = await response.json();
        console.log("📩 Réponse du serveur :", data);

        setMessage(data.message);

        // ✅ Si l'email est déjà vérifié, on redirige vers la connexion
        if (data.message.includes("déjà vérifié")) {
          setMessage("✅ Votre email est déjà vérifié. Vous serez redirigé vers la connexion...");
          setTimeout(() => navigate("/login"), 3000);
        }

        // ❌ Si le lien est invalide ou expiré
        else if (data.message.includes("invalide") || data.message.includes("expiré")) {
          setMessage("❌ Lien invalide ou expiré. Veuillez demander un nouveau lien.");
        }

        // ✅ Si la vérification est réussie, redirection après 3 secondes
        else if (data.message.includes("succès")) {
          setTimeout(() => navigate("/login"), 3000); // ✅ Correction ici
        }
      } catch (error) {
        console.error("❌ Erreur lors de la vérification :", error);
        setMessage("❌ Erreur lors de la vérification. Veuillez réessayer.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;
