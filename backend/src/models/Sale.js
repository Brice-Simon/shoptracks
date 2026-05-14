/**
 * Sale model.
 * Represents a completed checkout transaction.
 */
class Sale {
    /**
     * @param {object} data
     * @param {string} data.id
     * @param {number} data.total
     * @param {Array}  data.items
     * @param {string} data.created_at
     */
    constructor(data) {
        this.id = data.id;
        this.total = data.total;
        this.items = data.items || [];
        this.created_at = data.created_at;
    }
}

module.exports = Sale;