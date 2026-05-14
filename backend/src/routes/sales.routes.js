/**
 * SALES ROUTER (sales.routes.js)
 * Defines the URL paths for transaction-related operations.
 * This is the primary interface for the checkout process and sales reporting.
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to ensure the user is authenticated
const {
    getAllSales,
    getSaleById,
    createSale,
} = require('../controllers/sales.controller');

/**
 * @route   GET /api/sales
 * @desc    Retrieves a list of all historical transactions, including item details.
 * @access  Protected (Requires authentication for financial/history data)
 */
router.get('/', auth, getAllSales);

/**
 * @route   GET /api/sales/:id
 * @desc    Retrieves the specific details of a single transaction (receipt view).
 * @access  Protected
 */
router.get('/:id', auth, getSaleById);

/**
 * @route   POST /api/sales
 * @desc    Finalizes a sale. This triggers the checkout logic which 
 *          simultaneously creates a record and reduces stock levels.
 * @access  Protected
 */
router.post('/', auth, createSale);

// Export the router to be registered in the main server.js file
module.exports = router;