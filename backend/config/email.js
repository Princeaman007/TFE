require("dotenv").config();
const nodemailer = require("nodemailer");

// Vérification des variables d'environnement
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("⚠️ Erreur : EMAIL_USER ou EMAIL_PASS manquant dans le fichier .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Mon Application" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  };

  console.log("📧 Tentative d'envoi d'email à :", to);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé avec succès :", info.response);
    return info;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    throw error;
  }
};

// 🔥 Assure-toi d'exporter `sendEmail` correctement
module.exports = sendEmail;
