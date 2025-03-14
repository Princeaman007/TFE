const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const User = require("../models/User");


const router = express.Router();

// Route accessible uniquement aux admins et superAdmins
router.get("/admin", protect, authorizeRoles("admin", "superAdmin"), (req, res) => {
  res.json({ message: "Bienvenue, Admin !" });
});

// Route uniquement pour Super Admin
router.get("/super-admin", protect, authorizeRoles("superAdmin"), (req, res) => {
  res.json({ message: "Bienvenue, Super Admin !" });
});

// Route pour voir tous les utilisateurs
router.get("/users", protect, authorizeRoles("admin", "superAdmin"), getAllUsers);

// 📌 Récupérer un utilisateur par son ID (Admin & SuperAdmin)
router.get("/users/:id", protect, authorizeRoles("admin", "superAdmin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Ne pas afficher le mot de passe
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route pour supprimer un utilisateur (Super Admin uniquement)
router.delete("/users/:id", protect, authorizeRoles("superAdmin"), deleteUser);



module.exports = router;
