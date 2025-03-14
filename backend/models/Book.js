const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  publishedYear: { type: Number },
  ISBN: { type: String, unique: true, required: true },
  copiesAvailable: { type: Number, default: 1 }, // Nombre d'exemplaires disponibles
  coverImage: { type: String, default: "default_book_cover.png" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Book", bookSchema);
