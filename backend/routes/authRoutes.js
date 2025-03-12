const express = require("express");
const { register, verifyEmail, login, forgotPassword,resetPassword } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Route protégée : accès uniquement aux utilisateurs connectés
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
