/**
 * ITEM MODEL (Item.js)
 * This class represents a single product in the inventory.
 * It serves as a "Data Transfer Object" (DTO) to ensure consistent data structure.
 */

class Item {
    /**
     * CONSTRUCTOR
     * Maps raw database rows into a structured JavaScript object.
     * 
     * @param {object} data - The raw data object (usually from a Postgres row)
     * @param {string} data.id - Unique identifier (SKU), often encoded in the QR code
     * @param {string} data.name - The display name of the product
     * @param {number} data.price - Unit price of the item
     * @param {string} data.category - The group the item belongs to (e.g., 'Beverages')
     * @param {number} data.quantity - Current stock level in the warehouse/shop
     * @param {string} data.created_at - Timestamp of when the item was first added
     * @param {string} data.updated_at - Timestamp of the last time details were modified
     */
    constructor(data) {
        // Unique ID or SKU for scanning
        this.id = data.id;
        
        // Basic item details
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        
        // Inventory tracking
        this.quantity = data.quantity;
        
        // Audit timestamps
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

// Export the class so repositories can instantiate it using: new Item(row)
module.exports = Item;