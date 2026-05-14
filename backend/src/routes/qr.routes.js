const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/qr.controller');

/**
 * @route   GET /api/qr/:id
 * @desc    Generate a QR code PNG for a given item SKU
 * @access  Public
 */
router.get('/:id', generateQR);

module.exports = router;