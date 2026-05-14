const { getDb } = require('../config/db');
const Item = require('../models/Item');
const { v4: uuidv4 } = require('uuid');

/**
 * ItemRepository — all database access for items.
 * Implements the Repository Pattern.
 */
class ItemRepository {

    /**
     * Returns all items.
     * @returns {Promise<Item[]>}
     */
    async findAll() {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM items ORDER BY created_at DESC'
        );
        return result.rows.map((row) => new Item(row));
    }

    /**
     * Finds a single item by its SKU id.
     * @param {string} id
     * @returns {Promise<Item|null>}
     */
    async findById(id) {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM items WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) return null;
        return new Item(result.rows[0]);
    }

    /**
     * Creates a new item and returns it.
     * @param {object} data
     * @param {string} data.name
     * @param {number} data.price
     * @param {string} data.category
     * @param {number} data.quantity
     * @returns {Promise<Item>}
     */
    async create(data) {
        const db = getDb();
        const id = 'SKU' + uuidv4().slice(0, 6).toUpperCase();
        const result = await db.query(
            `INSERT INTO items (id, name, price, category, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [id, data.name, data.price, data.category, data.quantity]
        );
        return new Item(result.rows[0]);
    }

    /**
     * Updates an existing item and returns it.
     * @param {string} id
     * @param {object} data
     * @returns {Promise<Item|null>}
     */
    async update(id, data) {
        const db = getDb();
        const result = await db.query(
            `UPDATE items
       SET name = $1, price = $2, category = $3, quantity = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
            [data.name, data.price, data.category, data.quantity, id]
        );
        if (result.rows.length === 0) return null;
        return new Item(result.rows[0]);
    }

    /**
     * Decrements stock quantity after a sale.
     * @param {string} id
     * @param {number} quantity
     * @returns {Promise<Item|null>}
     */
    async decrementStock(id, quantity) {
        const db = getDb();
        const result = await db.query(
            `UPDATE items
       SET quantity = quantity - $1, updated_at = NOW()
       WHERE id = $2 AND quantity >= $1
       RETURNING *`,
            [quantity, id]
        );
        if (result.rows.length === 0) return null;
        return new Item(result.rows[0]);
    }

    /**
     * Deletes an item by id.
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const db = getDb();
        const result = await db.query(
            'DELETE FROM items WHERE id = $1',
            [id]
        );
        return result.rowCount > 0;
    }
}

module.exports = new ItemRepository();