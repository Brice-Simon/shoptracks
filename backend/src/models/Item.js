/**
 * Item model.
 * Represents a shop item with a QR code identity.
 */
class Item {
    /**
     * @param {object} data
     * @param {string} data.id
     * @param {string} data.name
     * @param {number} data.price
     * @param {string} data.category
     * @param {number} data.quantity
     * @param {string} data.created_at
     * @param {string} data.updated_at
     */
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        this.quantity = data.quantity;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

module.exports = Item;