const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();



// Configuration CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Middleware pour parser le JSON et les requêtes URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("🚀 Serveur API en ligne !");
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));
