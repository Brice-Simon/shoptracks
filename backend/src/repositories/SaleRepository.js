/**
 * SALE REPOSITORY (SaleRepository.js)
 * Manages data persistence for transactions. 
 * This repository handles two tables: 'sales' (the header) and 'sale_items' (the details).
 */

const { getDb } = require('../config/db'); // Database connection pool
const Sale = require('../models/Sale');      // Sale model blueprint
const { v4: uuidv4 } = require('uuid');     // Unique ID generator

class SaleRepository {

    /**
     * SELECT ALL SALES
     * Retrieves every transaction. Since items are in a separate table, 
     * it performs a secondary query for each sale to fetch its line items.
     */
    async findAll() {
        const db = getDb();

        // 1. Fetch all main sale records
        const salesResult = await db.query(
            'SELECT * FROM sales ORDER BY created_at DESC'
        );

        // 2. For every sale found, fetch its associated items from 'sale_items'
        const sales = await Promise.all(
            salesResult.rows.map(async (sale) => {
                const itemsResult = await db.query(
                    'SELECT * FROM sale_items WHERE sale_id = $1',
                    [sale.id]
                );
                // Combine the sale header and item list into a new Sale object
                return new Sale({ ...sale, items: itemsResult.rows });
            })
        );

        return sales;
    }

    /**
     * SELECT BY ID
     * Retrieves one specific transaction and all items associated with it.
     */
    async findById(id) {
        const db = getDb();

        // Fetch the main transaction record
        const saleResult = await db.query(
            'SELECT * FROM sales WHERE id = $1',
            [id]
        );
        if (saleResult.rows.length === 0) return null;

        // Fetch the specific list of items for this transaction
        const itemsResult = await db.query(
            'SELECT * FROM sale_items WHERE sale_id = $1',
            [id]
        );

        return new Sale({ ...saleResult.rows[0], items: itemsResult.rows });
    }

    /**
     * CREATE (Atomic Transaction)
     * This is critical: It uses BEGIN, COMMIT, and ROLLBACK.
     * If the server crashes or an error occurs halfway through inserting items, 
     * the entire transaction is cancelled so we don't have "partial" sales in the DB.
     */
    async create(data) {
        const db = getDb();
        // Generate a custom Transaction ID (e.g., TXN-ABCD1234)
        const saleId = 'TXN' + uuidv4().slice(0, 8).toUpperCase();

        // Acquire a manual client from the pool to manage the transaction state
        const client = await db.connect();

        try {
            // Start the transaction
            await client.query('BEGIN');

            // 1. Insert the "Header" (The overall sale total and ID)
            const saleResult = await client.query(
                `INSERT INTO sales (id, total) VALUES ($1, $2) RETURNING *`,
                [saleId, data.total]
            );

            const insertedItems = [];

            // 2. Loop through every item in the cart and save it to 'sale_items'
            for (const item of data.items) {
                const lineId = uuidv4(); // Unique ID for this specific line on the receipt
                const lineResult = await client.query(
                    `INSERT INTO sale_items (id, sale_id, item_id, item_name, price, quantity, subtotal)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     RETURNING *`,
                    [lineId, saleId, item.item_id, item.item_name, item.price, item.quantity, item.subtotal]
                );
                insertedItems.push(lineResult.rows[0]);
            }

            // 3. If everything worked, save the changes permanently
            await client.query('COMMIT');

            // Return the fully structured Sale object
            return new Sale({ ...saleResult.rows[0], items: insertedItems });

        } catch (error) {
            // If ANY step above failed, undo everything inside this 'try' block
            await client.query('ROLLBACK');
            throw error;
        } finally {
            // Very important: Always release the client back to the pool
            client.release();
        }
    }
}

// Export a singleton instance
module.exports = new SaleRepository();