const express = require('express');
const router = express.Router();
const PremiumSubscription = require('../models/PremiumSubscription');

// ✅ Vérifier si un utilisateur est premium
router.get('/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await PremiumSubscription.findOne({ user: userId, isActive: true });
    res.json({ isPremium: !!subscription });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification Premium', error });
  }
});

module.exports = router;

