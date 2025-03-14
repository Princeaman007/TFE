const bcrypt = require("bcryptjs");

const passwordEntered = "12345"; // Mets le mot de passe en clair
const passwordInDB = "$2b$10$w9CtZh8kHygFOh77TieV9.t10f4h0b2UoNu8.bTKloJn97W8KK/b."; // Mets ton hash exact

bcrypt.compare(passwordEntered, passwordInDB, (err, result) => {
  if (err) {
    console.error("❌ Erreur bcrypt :", err);
  } else {
    console.log("✅ bcrypt.compare() :", result ? "Mot de passe correct" : "Mot de passe incorrect");
  }
});
