const Loan = require("../models/Loan");
const Book = require("../models/Book");

const loanBook = async (userId, bookId) => {
  try {
    if (!userId || !bookId) throw new Error("ID utilisateur ou ID livre manquant.");

    const book = await Book.findById(bookId);
    if (!book) throw new Error("Livre introuvable.");
    if (book.copiesAvailable <= 0) throw new Error("Aucun exemplaire disponible.");

    // Vérifier si l'utilisateur a déjà emprunté ce livre et ne l'a pas rendu
    const existingLoan = await Loan.findOne({ user: userId, book: bookId, status: "borrowed" });
    if (existingLoan) throw new Error("Vous avez déjà emprunté ce livre et ne l'avez pas encore rendu.");

    // 📌 Créer l'emprunt avec l'utilisateur et le livre
    const loan = new Loan({
      user: userId,
      book: bookId,
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    // Sauvegarder l'emprunt et mettre à jour le stock du livre
    await loan.save();
    book.copiesAvailable -= 1;
    await book.save();

    return { 
      message: "Livre emprunté avec succès.",
      bookTitle: book.title,
      copiesRemaining: book.copiesAvailable
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { loanBook };
