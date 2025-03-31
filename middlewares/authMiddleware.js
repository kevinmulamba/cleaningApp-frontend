const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⛔ Aucun token ou format incorrect dans l'en-tête Authorization");
    return res.status(401).json({ message: "⛔ Aucun token fourni" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔐 Token reçu :", token); // 🧠 Log du token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On attache l'utilisateur décodé à la requête
    next();
  } catch (err) {
    console.error("❌ Token invalide ou expiré :", err.message);
    return res.status(401).json({ message: "⛔ Token invalide ou expiré", error: err.message });
  }
};

