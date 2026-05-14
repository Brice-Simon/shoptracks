const itemRepository = require('../repositories/ItemRepository');

/**
 * GET /api/items
 * Returns all items in inventory.
 */
const getAllItems = async (req, res, next) => {
    try {
        const items = await itemRepository.findAll();
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/items/:id
 * Returns a single item by SKU — triggered by QR scan.
 */
const getItemById = async (req, res, next) => {
    try {
        const item = await itemRepository.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/items
 * Creates a new item and returns it with its generated SKU.
 * Body: { name, price, category, quantity }
 */
const createItem = async (req, res, next) => {
    try {
        const { name, price, category, quantity } = req.body;

        if (!name || !price || !category || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'name, price, category and quantity are required',
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'price must be greater than 0',
            });
        }

        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'quantity cannot be negative',
            });
        }

        const item = await itemRepository.create({ name, price, category, quantity });
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/items/:id
 * Updates an existing item (name, price, category, quantity).
 */
const updateItem = async (req, res, next) => {
    try {
        const { name, price, category, quantity } = req.body;

        if (!name || !price || !category || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'name, price, category and quantity are required',
            });
        }

        const item = await itemRepository.update(req.params.id, {
            name,
            price,
            category,
            quantity,
        });

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
 * Removes an item from inventory.
 */
const deleteItem = async (req, res, next) => {
    try {
        const deleted = await itemRepository.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };