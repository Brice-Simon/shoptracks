/**
 * ITEMS CONTROLLER (items.controller.js)
 * This file contains the logic for handling all inventory-related API requests.
 * It bridges the gap between the Routes (URLs) and the Repository (Database).
 */

const itemRepository = require('../repositories/ItemRepository'); // Import database access methods

/**
 * GET /api/items
 * Fetch all items currently stored in the system.
 */
const getAllItems = async (req, res, next) => {
    try {
        // Calls the repository to get everything from the 'items' table
        const items = await itemRepository.findAll();
        // Returns 200 OK with the array of items
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        // If something breaks, pass the error to the global error handler
        next(error);
    }
};

/**
 * GET /api/items/:id
 * Fetch a specific item using its unique ID (often mapped to a QR code/SKU).
 */
const getItemById = async (req, res, next) => {
    try {
        // Searches for the item using the ID provided in the URL (req.params.id)
        const item = await itemRepository.findById(req.params.id);
        
        // If the database returns nothing, send a 404 Not Found error
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        // Return the specific item data
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/items
 * Adds a new product to the inventory.
 * Expected Body: { name, price, category, quantity }
 */
const createItem = async (req, res, next) => {
    try {
        const { name, price, category, quantity } = req.body;

        // --- VALIDATION SECTION ---
        
        // 1. Check if any required fields are missing
        if (!name || !price || !category || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'name, price, category and quantity are required',
            });
        }

        // 2. Ensure price is a positive number
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'price must be greater than 0',
            });
        }

        // 3. Ensure quantity is not a negative number
        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'quantity cannot be negative',
            });
        }

        // --- DATABASE INSERTION ---
        // Pass the validated data to the repository to save it
        const item = await itemRepository.create({ name, price, category, quantity });
        
        // Return 201 Created status with the newly created item (includes its SKU/ID)
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/items/:id
 * Overwrites existing data for a specific item.
 */
const updateItem = async (req, res, next) => {
    try {
        const { name, price, category, quantity } = req.body;

        // Ensure all fields are provided for the update
        if (!name || !price || !category || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'name, price, category and quantity are required',
            });
        }

        // Send the ID from the URL and the new data from the body to the repository
        const item = await itemRepository.update(req.params.id, {
            name,
            price,
            category,
            quantity,
        });

        // If the item ID didn't exist in the DB
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/items/:id
 * Permanently deletes an item from the database.
 */
const deleteItem = async (req, res, next) => {
    try {
        // Attempt to remove the item via repository
        const deleted = await itemRepository.delete(req.params.id);
        
        // If repository confirms nothing was deleted (ID not found)
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Export all functions so they can be linked to routes in items.routes.js
module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };