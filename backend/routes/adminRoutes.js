const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { getAllUsers, deleteUser } = require("../controllers/adminController");

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

// Route pour supprimer un utilisateur (Super Admin uniquement)
router.delete("/users/:id", protect, authorizeRoles("superAdmin"), deleteUser);

module.exports = router;
