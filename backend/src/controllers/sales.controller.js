/**
 * SALES CONTROLLER (sales.controller.js)
 * Manages the checkout process, sales history, and inventory synchronization.
 */

const saleRepository = require('../repositories/SaleRepository'); // Handles database operations for sales
const itemRepository = require('../repositories/ItemRepository'); // Handles database operations for inventory items

/**
 * GET /api/sales
 * Retrieves the complete history of all transactions.
 */
const getAllSales = async (req, res, next) => {
    try {
        // Fetch all sales records including their individual line items
        const sales = await saleRepository.findAll();
        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        // Forward system or database errors to the error-handling middleware
        next(error);
    }
};

/**
 * GET /api/sales/:id
 * Retrieves a specific transaction by its unique database ID.
 */
const getSaleById = async (req, res, next) => {
    try {
        const sale = await saleRepository.findById(req.params.id);
        
        // Return 404 if the transaction ID does not exist
        if (!sale) {
            return res.status(404).json({ success: false, error: 'Sale not found' });
        }
        
        res.status(200).json({ success: true, data: sale });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/sales
 * The Checkout Logic:
 * 1. Validates the incoming cart data.
 * 2. Checks if there is enough stock for every item.
 * 3. Calculates the final price.
 * 4. Saves the sale to the database.
 * 5. Subtracts the purchased quantity from the inventory.
 */
const createSale = async (req, res, next) => {
    try {
        const { items } = req.body; // Array of objects: [{ item_id, quantity, price... }]

        // --- PHASE 1: BASIC VALIDATION ---
        // Ensure the cart is an array and is not empty
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'items array is required and cannot be empty',
            });
        }

        // Validate that every object in the array has the required properties
        for (const item of items) {
            if (!item.item_id || !item.item_name || !item.price || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Each item requires item_id, item_name, price and quantity',
                });
            }
        }

        // --- PHASE 2: STOCK CHECK ---
        // Verify we actually have enough items in stock before taking money/recording sale
        for (const item of items) {
            const existing = await itemRepository.findById(item.item_id);
            
            // Check if item exists in inventory
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    error: `Item ${item.item_id} not found`,
                });
            }
            
            // Compare requested quantity vs available stock
            if (existing.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${existing.name}. Available: ${existing.quantity}`,
                });
            }
        }

        // --- PHASE 3: CALCULATE TOTAL ---
        // Loops through items to calculate the grand total of the sale
        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // --- PHASE 4: RECORD TRANSACTION ---
        // Save the sale header and the line items in the database
        const sale = await saleRepository.create({ total, items });

        // --- PHASE 5: UPDATE INVENTORY ---
        // For every item purchased, decrement (subtract) the quantity from the main inventory
        for (const item of items) {
            await itemRepository.decrementStock(item.item_id, item.quantity);
        }

        // Return 201 Created with the final sale details
        res.status(201).json({ success: true, data: sale });
    } catch (error) {
        next(error);
    }
};

// Export the controller methods
module.exports = { getAllSales, getSaleById, createSale };