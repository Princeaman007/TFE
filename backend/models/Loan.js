const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Book", 
    required: true 
  },
  loanDate: { type: Date, default: Date.now },
  returnDate: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ["borrowed", "returned", "overdue"], 
    default: "borrowed" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Loan", loanSchema);
