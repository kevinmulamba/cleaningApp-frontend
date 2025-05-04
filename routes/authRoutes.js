const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

// ✅ Route test API
router.get("/", (req, res) => {
  res.status(200).json({ message: "API Auth accessible" });
});

// ✅ Inscription
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "❌ Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "✅ Utilisateur créé avec succès" });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ Connexion
router.post("/login", authController.login);

// ✅ Vérification du code 2FA
router.post("/verify-2fa", authController.verify2FA);

// ✅ Récupération du profil connecté
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ Route générique de profil (alternative Frontend)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ 🔥 TEMPORAIRE : route sans filtrage de rôle pour tester
router.get("/provider-profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Utilisateur non trouvé" });

    res.json(user); // ⛔️ Pas de vérification du rôle ici
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// 🚀 Route d’initiation Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 📥 Callback Google après connexion
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth?error=google",
    session: false, // Important si tu utilises JWT
  }),
  (req, res) => {
    const jwt = require("jsonwebtoken");

    // 🧠 Vérifie que req.user existe bien
    if (!req.user || !req.user._id || !req.user.role) {
      console.error("❌ Données utilisateur manquantes après Google Auth");
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=missing-user`);
    }

    // ✅ Créer le token JWT
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Rediriger vers le frontend avec le token et le rôle
    const redirectUrl = `${process.env.FRONTEND_URL}/auth-success?token=${token}&role=${req.user.role}`;
    console.log("🔁 Redirection avec :", redirectUrl);
    return res.redirect(redirectUrl);
  }
);

module.exports = router;

