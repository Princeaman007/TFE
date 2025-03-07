import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenue</h1>
      <p>Connectez-vous ou créez un compte :</p>
      <Link to="/login">
        <button style={{ margin: "10px", padding: "10px" }}>Se connecter</button>
      </Link>
      <Link to="/register">
        <button style={{ margin: "10px", padding: "10px" }}>Inscription</button>
      </Link>
    </div>
  );
}

export default Home;
