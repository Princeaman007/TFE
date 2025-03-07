import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("❌ Erreur lors de la demande de réinitialisation :", error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div>
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleForgotPassword}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Envoyer un lien de réinitialisation</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ForgotPassword;
