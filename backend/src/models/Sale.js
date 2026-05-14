/**
 * SALE MODEL (Sale.js)
 * This class represents a single completed transaction in the system.
 * It serves as a blueprint to ensure sales data is consistently formatted.
 */

class Sale {
    /**
     * CONSTRUCTOR
     * Maps database records into a structured JavaScript object for a sale.
     * 
     * @param {object} data - The raw data object from the database row.
     * @param {string} data.id - The unique transaction ID (Primary Key).
     * @param {number} data.total - The final grand total price of the sale.
     * @param {Array}  data.items - An array containing the specific items sold (line items).
     * @param {string} data.created_at - The timestamp of when the sale occurred.
     */
    constructor(data) {
        // Unique identifier for the receipt or transaction record
        this.id = data.id;

        // The overall cost of the purchase after summing all item subtotals
        this.total = data.total;

        // The list of products included in this sale. 
        // Defaults to an empty array if no items are provided to prevent errors.
        this.items = data.items || [];

        // The date and time the transaction was finalized in the database
        this.created_at = data.created_at;
    }
}

// Export the class so SaleRepository can create instances using: new Sale(row)
module.exports = Sale;