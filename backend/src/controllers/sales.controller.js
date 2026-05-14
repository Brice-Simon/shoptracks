const saleRepository = require('../repositories/SaleRepository');
const itemRepository = require('../repositories/ItemRepository');

/**
 * GET /api/sales
 * Returns all sales with their line items.
 */
const getAllSales = async (req, res, next) => {
    try {
        const sales = await saleRepository.findAll();
        res.status(200).json({ success: true, data: sales });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/sales/:id
 * Returns a single sale by id.
 */
const getSaleById = async (req, res, next) => {
    try {
        const sale = await saleRepository.findById(req.params.id);
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
 * Records a completed sale.
 * Decrements stock for each item in the cart.
 * Body: { items: [{ item_id, item_name, price, quantity, subtotal }] }
 */
const createSale = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'items array is required and cannot be empty',
            });
        }

        // Validate each line item
        for (const item of items) {
            if (!item.item_id || !item.item_name || !item.price || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: 'Each item requires item_id, item_name, price and quantity',
                });
            }
        }

        // Check stock is sufficient for every item before proceeding
        for (const item of items) {
            const existing = await itemRepository.findById(item.item_id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    error: `Item ${item.item_id} not found`,
                });
            }
            if (existing.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: `Insufficient stock for ${existing.name}. Available: ${existing.quantity}`,
                });
            }
        }

        // Calculate total
        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Record the sale
        const sale = await saleRepository.create({ total, items });

        // Decrement stock for each item
        for (const item of items) {
            await itemRepository.decrementStock(item.item_id, item.quantity);
        }

        res.status(201).json({ success: true, data: sale });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllSales, getSaleById, createSale };