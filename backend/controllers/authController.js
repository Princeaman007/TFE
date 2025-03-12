const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/email");

// Ajout d'une alternative à crypto si indisponible
bcrypt.setRandomFallback((len) => {
    const buf = new Uint8Array(len);
    return buf.map(() => Math.floor(Math.random() * 256));
});

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("🔍 Valeurs reçues :", req.body);

  if (!password) {
    return res.status(400).json({ message: "Le mot de passe est requis" });
  }

  try {
    // Générer le sel et hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("✅ Mot de passe haché :", hashedPassword);

    // Vérifier si un rôle a été fourni et restreindre les rôles possibles
    const allowedRoles = ["client"]; // Seul "client" est autorisé par défaut
    const userRole = allowedRoles.includes(role) ? role : "client"; 

    // Création de l'utilisateur avec rôle sécurisé
    let user = new User({ name, email, password: hashedPassword, role: userRole });
    await user.save();

    // Génération du token de vérification
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    console.log("📧 Lien de vérification généré :", verificationLink);

    // Envoi de l'email de vérification
    try {
      await sendEmail(
        email,
        "Vérifiez votre compte",
        `Cliquez sur ce lien: ${verificationLink}`,
        `<h3>Bienvenue ${name}!</h3>
        <p>Merci de vous inscrire. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
        <a href="${verificationLink}">Confirmer votre email</a>`
      );

      console.log("✅ Email envoyé avec succès !");
      res.status(201).json({ message: "Inscription réussie, vérifiez votre email." });
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi de l'email :", emailError);
      res.status(500).json({ message: "Inscription réussie, mais l'email de vérification n'a pas pu être envoyé." });
    }

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("🔍 Token reçu dans le backend :", token);

    if (!token) {
      return res.status(400).json({ message: "Token manquant" });
    }

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("❌ Erreur lors du décodage du token :", error);
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    console.log("✅ Token décodé :", decoded);

    // Vérifier si l'utilisateur existe
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("❌ Utilisateur introuvable avec l'ID :", decoded.id);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.isVerified) {
      console.log("✅ Email déjà vérifié pour :", user.email);
      return res.status(200).json({ message: "Email déjà vérifié, vous pouvez vous connecter.", redirect: "/login" });
    }

    // Marquer l'email comme vérifié
    user.isVerified = true;
    await user.save();
    console.log("✅ Email vérifié avec succès pour :", user.email);

    return res.status(200).json({ message: "Email vérifié avec succès, vous serez redirigé.", redirect: "/login" });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    if (!user.isVerified) return res.status(400).json({ message: "Veuillez vérifier votre email avant de vous connecter" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    res.json({ token, message: "Connexion réussie" });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email non trouvé" });

    // Génération du token de réinitialisation valable 15 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    user.resetToken = token;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    try {
      await sendEmail(
        email,
        "Réinitialisation du mot de passe",
        `Cliquez ici pour réinitialiser votre mot de passe : ${resetLink}`,
        `<a href="${resetLink}">Réinitialisez votre mot de passe</a>`
      );

      res.json({ message: "Email de réinitialisation envoyé" });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      res.status(500).json({ message: "Impossible d'envoyer l'email de réinitialisation" });
    }

  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token ou mot de passe manquant" });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Hacher et mettre à jour le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation :", error);
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};
