const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Configuration CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware pour parser le JSON et les requêtes URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookRoutes = require("./routes/bookRoutes");
const loanRoutes = require("./routes/loanRoutes");

// 📌 Vérifier que les routes sont bien enregistrées
console.log("📌 Enregistrement des routes...");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/books", bookRoutes); 
app.use("/loans", loanRoutes);

console.log("📌 Routes chargées : /api/auth, /api/admin, /books, /loans");

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("🚀 Serveur API en ligne !");
});

// 📌 Middleware de gestion des erreurs 404 (À METTRE EN DERNIER)
app.use((req, res) => {
  console.log("❌ Route non trouvée :", req.originalUrl); // Ajoute ce log pour voir quelle route échoue
  res.status(404).json({ message: "Route non trouvée" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));
