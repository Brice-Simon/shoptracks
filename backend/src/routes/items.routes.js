const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
} = require('../controllers/items.controller');

/**
 * @route   GET /api/items
 * @desc    Get all inventory items
 * @access  Public
 */
router.get('/', getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get single item by SKU — called when QR code is scanned
 * @access  Public
 */
router.get('/:id', getItemById);

/**
 * @route   POST /api/items
 * @desc    Add a new item to inventory
 * @access  Protected
 */
router.post('/', auth, createItem);

/**
 * @route   PUT /api/items/:id
 * @desc    Update an existing item
 * @access  Protected
 */
router.put('/:id', auth, updateItem);

/**
 * @route   DELETE /api/items/:id
 * @desc    Remove an item from inventory
 * @access  Protected
 */
router.delete('/:id', auth, deleteItem);

module.exports = router;