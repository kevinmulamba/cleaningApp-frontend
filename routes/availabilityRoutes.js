// routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Ajouter ou mettre à jour une disponibilité
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: "⛔ Champs requis manquants." });
    }

    // Vérification des formats simples
    if (
      typeof dayOfWeek !== "string" ||
      typeof startTime !== "string" ||
      typeof endTime !== "string"
    ) {
      return res.status(400).json({ message: "⛔ Format invalide pour une disponibilité." });
    }

    const updated = await Availability.findOneAndUpdate(
      { provider: req.user.id, dayOfWeek },
      { startTime, endTime },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "✅ Disponibilité enregistrée avec succès",
      availability: updated,
    });
  } catch (err) {
    console.error("❌ Erreur sauvegarde disponibilité :", err);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

// ✅ Récupérer les disponibilités du prestataire
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const availabilities = await Availability.find({ provider: req.user.id });

    res.status(200).json(availabilities);
  } catch (err) {
    console.error("❌ Erreur récupération disponibilités :", err);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

module.exports = router;

