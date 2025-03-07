import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Vérifier si un token existe
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            // Simuler une récupération d'utilisateur
            setUser({ name: "Utilisateur" });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Mon Dashboard</h1>
                <nav>
                    <ul className="flex gap-4">
                        <li><a href="/" className="hover:underline">Accueil</a></li>
                        <li><a href="/profile" className="hover:underline">Profil</a></li>
                        <li><a href="/settings" className="hover:underline">Paramètres</a></li>
                    </ul>
                </nav>
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Déconnexion
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h2 className="text-xl font-semibold mb-4">Bienvenue {user?.name} !</h2>
                <p>Voici ton tableau de bord. Ajoute ici tes fonctionnalités.</p>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-4">
                <p>&copy; 2024 Mon Dashboard. Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default Dashboard;
