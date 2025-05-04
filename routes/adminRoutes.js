const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken'); // ✅ Ajouté pour sécuriser toutes les routes

// ✅ Statistiques générales admin
router.get('/stats', verifyToken, isAdmin, adminController.getStats);

// ✅ Revenus mensuels pour le graphique
router.get('/revenue', verifyToken, isAdmin, adminController.getRevenue);

// ✅ Classement des prestataires les + actifs
router.get('/top-providers', verifyToken, isAdmin, adminController.getTopProviders);

// ✅ Rapport complet (via reportService)
router.get('/report', verifyToken, isAdmin, adminController.getAdminReport);

module.exports = router;

