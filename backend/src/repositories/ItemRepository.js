/**
 * ITEM REPOSITORY (ItemRepository.js)
 * This class handles all direct communication with the 'items' table in PostgreSQL.
 * It abstracts the SQL queries so the rest of the app doesn't need to know about database syntax.
 */

const { getDb } = require('../config/db'); // Get the connection pool
const Item = require('../models/Item');      // Import the Item model/blueprint
const { v4: uuidv4 } = require('uuid');     // Used to generate unique IDs

class ItemRepository {

    /**
     * SELECT ALL
     * Retrieves all products from the database, newest first.
     * Maps each database row into a JavaScript 'Item' object.
     */
    async findAll() {
        const db = getDb();
        const result = await db.query(
            'SELECT * FROM items ORDER BY created_at DESC'
        );
        // Transform the raw database rows into Item instances
        return result.rows.map((row) => new Item(row));
    }

    /**
     * SELECT BY ID
     * Used for QR scanning or viewing specific product details.
     */
    async findById(id) {
        const db = getDb();
        // $1 is a parameterized query to prevent SQL Injection attacks
        const result = await db.query(
            'SELECT * FROM items WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) return null;
        return new Item(result.rows[0]);
    }

    /**
     * INSERT NEW ITEM
     * Generates a custom SKU (e.g., SKU-A1B2C3) and saves the new product.
     */
    async create(data) {
        const db = getDb();
        // Create a unique SKU by taking the first 6 chars of a UUID
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
     * UPDATE EXISTING ITEM
     * Modifies item details and updates the 'updated_at' timestamp automatically.
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
     * ATOMIC DECREMENT
     * Subtracts a specific amount from the stock. 
     * The "quantity >= $1" check ensures we never accidentally sell more than we have (no negative stock).
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
     * DELETE ITEM
     * Removes the product from the database permanently.
     */
    async delete(id) {
        const db = getDb();
        const result = await db.query(
            'DELETE FROM items WHERE id = $1',
            [id]
        );
        // rowCount > 0 means something was actually deleted
        return result.rowCount > 0;
    }
}

// Export a single instance (Singleton) to be reused across the app
module.exports = new ItemRepository();