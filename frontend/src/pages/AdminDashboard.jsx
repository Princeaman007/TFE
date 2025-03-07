import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🛠️ Tableau de Bord Administrateur</h2>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>
        Déconnexion
      </button>
    </div>
  );
};

export default AdminDashboard;
