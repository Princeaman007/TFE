import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🚫 Accès Refusé</h2>
      <p>Vous n avez pas la permission d accéder à cette page.</p>
      <Link to="/">Retour à l accueil</Link>
    </div>
  );
};

export default Unauthorized;
