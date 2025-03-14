const express = require("express");
const { protect } = require("../middlewares/authMiddleware"); // ✅ Assurez-vous d'importer protect
const { loanBook, returnBook } = require("../services/loanService");
const Loan = require("../models/Loan");

const router = express.Router();

// 📌 Route pour emprunter un livre
router.post("/borrow", protect, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; // ✅ Récupérer l'ID de l'utilisateur depuis le token JWT

    if (!userId) {
      return res.status(400).json({ error: "Utilisateur non authentifié" });
    }

    const response = await loanBook(userId, bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📌 Route pour rendre un livre
router.post("/return", protect, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; // ✅ Récupérer l'utilisateur connecté

    if (!userId) {
      return res.status(400).json({ error: "Utilisateur non authentifié" });
    }

    const response = await returnBook(userId, bookId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📌 Récupérer tous les livres empruntés par l'utilisateur connecté
router.get("/user", protect, async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Récupérer l'ID de l'utilisateur connecté

    // Rechercher tous les prêts où l'utilisateur est concerné
    const loans = await Loan.find({ user: userId, status: "borrowed" }).populate("book", "title author");

    if (!loans.length) {
      return res.status(404).json({ message: "Aucun livre emprunté trouvé." });
    }

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Récupérer tous les livres empruntés par un utilisateur spécifique (Admin/SuperAdmin)
router.get("/user/:id", protect, async (req, res) => {
  try {
    const userId = req.params.id; // ✅ Récupérer l'ID de l'utilisateur depuis l'URL

    // Rechercher tous les prêts de cet utilisateur
    const loans = await Loan.find({ user: userId, status: "borrowed" })
                            .populate("book", "title author");

    if (!loans.length) {
      return res.status(404).json({ message: "Aucun livre emprunté trouvé pour cet utilisateur." });
    }

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
