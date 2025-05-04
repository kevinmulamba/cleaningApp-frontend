const express = require("express");
const router = express.Router();
const PremiumSubscription = require("../models/PremiumSubscription");
const authMiddleware = require("../middlewares/authMiddleware"); // 🔐 Protection

// ✅ Vérifier si un utilisateur est premium
router.get("/check/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Rechercher un abonnement actif pour cet utilisateur
    const subscription = await PremiumSubscription.findOne({
      user: userId,
      isActive: true
    });

    res.json({ isPremium: !!subscription });
  } catch (error) {
    console.error("❌ Erreur lors de la vérification Premium :", error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification Premium", error });
  }
});

module.exports = router;

