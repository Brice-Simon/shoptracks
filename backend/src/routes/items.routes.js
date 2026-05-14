/**
 * ITEMS ROUTER (items.routes.js)
 * Defines the URL paths for all inventory-related operations.
 * This file maps "What the user wants to do" (URL) to "Which code should run" (Controller).
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to check if the user is logged in
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
} = require('../controllers/items.controller');

/**
 * @route   GET /api/items
 * @desc    Retrieves the full list of products.
 * @access  Public (Anyone can view the inventory)
 */
router.get('/', getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Retrieves a single product. 
 *          This is the endpoint triggered when a mobile app scans a QR code.
 * @access  Public
 */
router.get('/:id', getItemById);

/**
 * @route   POST /api/items
 * @desc    Adds a new product.
 * @access  Protected (Requires 'auth' middleware to pass)
 */
router.post('/', auth, createItem);

/**
 * @route   PUT /api/items/:id
 * @desc    Updates details (price, stock, name) of an existing product.
 * @access  Protected
 */
router.put('/:id', auth, updateItem);

/**
 * @route   DELETE /api/items/:id
 * @desc    Permanently removes a product from the database.
 * @access  Protected
 */
router.delete('/:id', auth, deleteItem);

// Export the router to be mounted in the main server.js file
module.exports = router;