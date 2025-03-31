const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');

router.get('/stats', isAdmin, adminController.getStats);

module.exports = router;

