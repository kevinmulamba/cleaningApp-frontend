const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "🔒 Token manquant" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "❌ Utilisateur introuvable" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "⛔ Accès refusé : Administrateur requis" });
    }

    req.user = user; // Injection dans la requête si besoin plus tard
    next();

  } catch (err) {
    console.error("❌ Erreur lors de la vérification admin :", err);
    res.status(401).json({ message: "🔐 Token invalide" });
  }
};

