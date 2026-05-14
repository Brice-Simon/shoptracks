const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllSales,
    getSaleById,
    createSale,
} = require('../controllers/sales.controller');

/**
 * @route   GET /api/sales
 * @desc    Get all sales with line items
 * @access  Protected
 */
router.get('/', auth, getAllSales);

/**
 * @route   GET /api/sales/:id
 * @desc    Get a single sale by transaction id
 * @access  Protected
 */
router.get('/:id', auth, getSaleById);

/**
 * @route   POST /api/sales
 * @desc    Record a completed checkout — decrements stock automatically
 * @access  Protected
 */
router.post('/', auth, createSale);

module.exports = router;