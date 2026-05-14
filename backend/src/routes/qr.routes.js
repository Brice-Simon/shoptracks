/**
 * QR ROUTER (qr.routes.js)
 * Defines the URL path for generating QR code images.
 */

const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/qr.controller');

/**
 * @route   GET /api/qr/:id
 * @desc    Generates a QR code image (as a Base64 string) for a specific item SKU.
 *          This is used by the frontend to display a printable or scannable code.
 * @access  Public (Standard for generating labels)
 */
router.get('/:id', generateQR);

// Export the router to be used in the main application entry point (server.js)
module.exports = router;