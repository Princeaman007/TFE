const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["client", "admin", "superAdmin"],
    default: "client"
  },


  isVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date, default: null },


  phone: { type: String, default: null },
  avatar: { type: String, default: "default_avatar.png" },
 
  resetToken: { type: String, default: null },
  borrowedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan"
  }],


}, { timestamps: true });




// 🔑 Hachage du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();


  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


// 🔍 Vérification du mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("User", userSchema);