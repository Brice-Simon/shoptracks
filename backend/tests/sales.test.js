/**
 * SALES API UNIT TESTS (sales.test.js)
 * These tests focus on the checkout flow, ensuring that inventory and 
 * sales records stay synchronized without touching a real database.
 */

const request = require('supertest'); // Library to simulate HTTP requests
const express = require('express');
const salesRoutes = require('../src/routes/sales.routes');
const saleRepository = require('../src/repositories/SaleRepository');
const itemRepository = require('../src/repositories/ItemRepository');

// --- MOCKING ---
// We mock both repositories because a 'Sale' depends on checking 'Items' stock.
jest.mock('../src/repositories/SaleRepository');
jest.mock('../src/repositories/ItemRepository');

// --- TEST SETUP ---
const app = express();
app.use(express.json());
app.use('/api/sales', salesRoutes);

// Global error handler for the test environment
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message });
});

describe('Sales API', () => {
    // Reset mocks between tests to ensure a clean slate (e.g., call counts)
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TEST: GET /api/sales
     * Ensures the API correctly returns the list of sales history.
     */
    it('GET /api/sales - should return all sales', async () => {
        const mockSales = [{ id: '1', total: 500, created_at: new Date().toISOString() }];
        saleRepository.findAll.mockResolvedValue(mockSales);

        const res = await request(app).get('/api/sales');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockSales);
    });

    /**
     * TEST: POST /api/sales (The Happy Path)
     * This test checks the complex coordination:
     * 1. Check stock (itemRepository)
     * 2. Save transaction (saleRepository)
     * 3. Reduce inventory (itemRepository)
     */
    it('POST /api/sales - should create a sale and decrement stock', async () => {
        const saleRequest = {
            items: [
                { item_id: 'SKU123', item_name: 'Test', price: 100, quantity: 2, subtotal: 200 }
            ]
        };

        const mockItem = { id: 'SKU123', name: 'Test', price: 100, quantity: 10 };
        const mockSale = { id: 'SALE1', total: 200, items: saleRequest.items };

        // Define mock behaviors for the chain of events
        itemRepository.findById.mockResolvedValue(mockItem);
        saleRepository.create.mockResolvedValue(mockSale);
        itemRepository.decrementStock.mockResolvedValue(true);

        const res = await request(app).post('/api/sales').send(saleRequest);

        // Verification
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockSale);
        
        // Ensure the flow happened in order:
        expect(itemRepository.findById).toHaveBeenCalledWith('SKU123');
        expect(saleRepository.create).toHaveBeenCalledWith({ total: 200, items: saleRequest.items });
        expect(itemRepository.decrementStock).toHaveBeenCalledWith('SKU123', 2);
    });

    /**
     * TEST: POST /api/sales (Insufficient Stock)
     * Crucial safety check: Does the API block a sale if the quantity 
     * requested is higher than what is in the database?
     */
    it('POST /api/sales - should fail if insufficient stock', async () => {
        const saleRequest = {
            items: [
                { item_id: 'SKU123', item_name: 'Test', price: 100, quantity: 20, subtotal: 2000 }
            ]
        };

        const mockItem = { id: 'SKU123', name: 'Test', price: 100, quantity: 10 }; // Only 10 in stock
        itemRepository.findById.mockResolvedValue(mockItem);

        const res = await request(app).post('/api/sales').send(saleRequest);

        // Assertions
        expect(res.statusCode).toBe(400); // Bad Request
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Insufficient stock/);
        
        // Safety: If stock is low, the sale should NEVER be created in the DB
        expect(saleRepository.create).not.toHaveBeenCalled();
    });

    /**
     * TEST: POST /api/sales (Empty Cart)
     * Prevents the creation of "empty" transactions.
     */
    it('POST /api/sales - should fail if items array is empty', async () => {
        const saleRequest = { items: [] };

        const res = await request(app).post('/api/sales').send(saleRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/items array is required/);
    });
});