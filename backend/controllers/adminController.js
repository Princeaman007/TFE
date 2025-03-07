const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclure le mot de passe
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  };
  