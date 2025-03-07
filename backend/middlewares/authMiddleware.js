const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans l'Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extraire le token après "Bearer "
  }

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Récupérer l'utilisateur sans le mot de passe
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
