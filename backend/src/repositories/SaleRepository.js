const { getDb } = require('../config/db');
const Sale = require('../models/Sale');
const { v4: uuidv4 } = require('uuid');

/**
 * SaleRepository — all database access for sales.
 * Implements the Repository Pattern.
 */
class SaleRepository {

    /**
     * Returns all sales with their line items.
     * @returns {Promise<Sale[]>}
     */
    async findAll() {
        const db = getDb();

        const salesResult = await db.query(
            'SELECT * FROM sales ORDER BY created_at DESC'
        );

        const sales = await Promise.all(
            salesResult.rows.map(async (sale) => {
                const itemsResult = await db.query(
                    'SELECT * FROM sale_items WHERE sale_id = $1',
                    [sale.id]
                );
                return new Sale({ ...sale, items: itemsResult.rows });
            })
        );

        return sales;
    }

    /**
     * Finds a single sale by id including its line items.
     * @param {string} id
     * @returns {Promise<Sale|null>}
     */
    async findById(id) {
        const db = getDb();

        const saleResult = await db.query(
            'SELECT * FROM sales WHERE id = $1',
            [id]
        );
        if (saleResult.rows.length === 0) return null;

        const itemsResult = await db.query(
            'SELECT * FROM sale_items WHERE sale_id = $1',
            [id]
        );

        return new Sale({ ...saleResult.rows[0], items: itemsResult.rows });
    }

    /**
     * Records a completed sale and its line items in a transaction.
     * @param {object} data
     * @param {number} data.total
     * @param {Array}  data.items  - [{ item_id, item_name, price, quantity, subtotal }]
     * @returns {Promise<Sale>}
     */
    async create(data) {
        const db = getDb();
        const saleId = 'TXN' + uuidv4().slice(0, 8).toUpperCase();

        const client = await db.connect();

        try {
            await client.query('BEGIN');

            const saleResult = await client.query(
                `INSERT INTO sales (id, total) VALUES ($1, $2) RETURNING *`,
                [saleId, data.total]
            );

            const insertedItems = [];

            for (const item of data.items) {
                const lineId = uuidv4();
                const lineResult = await client.query(
                    `INSERT INTO sale_items (id, sale_id, item_id, item_name, price, quantity, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
                    [lineId, saleId, item.item_id, item.item_name, item.price, item.quantity, item.subtotal]
                );
                insertedItems.push(lineResult.rows[0]);
            }

            await client.query('COMMIT');

            return new Sale({ ...saleResult.rows[0], items: insertedItems });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new SaleRepository();