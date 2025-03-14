const express = require("express");
const Book = require("../models/Book");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

console.log("📌 bookRoutes.js chargé !"); // 🔥 Ajoute ce log pour voir si le fichier est bien importé

// Route de test pour voir si `bookRoutes.js` fonctionne
router.get("/test", (req, res) => {
  res.json({ message: "Route de test OK !" });
});

// 📌 Récupérer tous les livres
router.get("/", async (req, res) => {
  console.log("📌 Requête GET /books reçue"); // 🔥 Ajoute ce log pour voir si la requête arrive
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 📌 1️⃣ Créer un livre (POST /books)
router.post("/", async (req, res) => {
  console.log("📌 Requête POST /books reçue"); // Ajoute ce log pour voir si la requête arrive

  try {
    const { title, author, description, category, publishedYear, ISBN, copiesAvailable, coverImage } = req.body;
    
    // Vérifier si un livre avec le même ISBN existe déjà
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) return res.status(400).json({ message: "Un livre avec cet ISBN existe déjà." });

    const book = new Book({
      title,
      author,
      description,
      category,
      publishedYear,
      ISBN,
      copiesAvailable,
      coverImage,
    });

    await book.save();
    res.status(201).json({ message: "Livre créé avec succès.", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Récupérer le nombre de copies disponibles pour un livre spécifique
router.get("/:id/stock", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé." });

    res.status(200).json({ title: book.title, copiesAvailable: book.copiesAvailable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Mettre à jour un livre (ADMIN ou SUPERADMIN)
router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), async (req, res) => {
  try {
    const { title, author, description, category, publishedYear, ISBN, copiesAvailable, coverImage } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, category, publishedYear, ISBN, copiesAvailable, coverImage },
      { new: true, runValidators: true }
    );

    if (!updatedBook) return res.status(404).json({ message: "Livre non trouvé." });

    res.status(200).json({ message: "Livre mis à jour avec succès.", book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Supprimer un livre (SUPERADMIN uniquement)
router.delete("/:id", protect, authorizeRoles("superAdmin"), async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) return res.status(404).json({ message: "Livre non trouvé." });

    res.status(200).json({ message: "Livre supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
