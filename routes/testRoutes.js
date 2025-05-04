const express = require('express');
const router = express.Router();

// 🔐 Middlewares de sécurité
const verifyToken = require('../middlewares/verifyToken');
const checkRoleAndAdmin = require('../middlewares/checkRoleAndAdmin');

// ✅ Route de test publique (sans auth)
router.get('/', (req, res) => {
  res.json({ success: true, message: "✅ Route test OK depuis testRoutes.js" });
});

// ✅ Route : Admin Client seulement
router.get(
  '/admin/clients',
  verifyToken,
  checkRoleAndAdmin({ requiredRole: 'user', adminOnly: true }),
  (req, res) => {
    res.json({ message: "Bienvenue Admin Client 👑" });
  }
);

// ✅ Route : Prestataire Normal
router.get(
  '/dashboard-prestataire',
  verifyToken,
  checkRoleAndAdmin({ requiredRole: 'prestataire' }),
  (req, res) => {
    res.json({ message: "Bienvenue Prestataire 🧑‍🔧" });
  }
);

// ✅ Route : Admin Prestataire seulement
router.get(
  '/admin/prestataires',
  verifyToken,
  checkRoleAndAdmin({ requiredRole: 'prestataire', adminOnly: true }),
  (req, res) => {
    res.json({ message: "Bienvenue Admin Prestataire 🥂" });
  }
);

module.exports = router;

