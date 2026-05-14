/**
 * ITEMS API UNIT TESTS (items.test.js)
 * These tests ensure that the API endpoints respond correctly to valid and invalid requests.
 * We use 'jest.mock' to simulate the database layer so tests remain fast and isolated.
 */

const request = require('supertest'); // Library to simulate HTTP requests
const express = require('express');
const itemsRoutes = require('../src/routes/items.routes');
const itemRepository = require('../src/repositories/ItemRepository');

// --- MOCKING ---
// This prevents the tests from touching the real database. 
// Instead, it replaces 'ItemRepository' methods with "fake" versions we can control.
jest.mock('../src/repositories/ItemRepository');

// --- TEST SETUP ---
// Create a temporary, lightweight Express server just for these tests.
const app = express();
app.use(express.json());
app.use('/api/items', itemsRoutes);

// Add a basic error handler to catch and format errors during testing
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message });
});

describe('Items API', () => {
    // Clear mock history (like 'toHaveBeenCalledTimes') before every single test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TEST: GET /api/items
     * Verifies that the endpoint returns the data provided by the repository.
     */
    it('GET /api/items - should return all items', async () => {
        // Setup: Define what the "fake" database should return
        const mockItems = [{ id: 'SKU123', name: 'Test Item', price: 100, category: 'Food', quantity: 10 }];
        itemRepository.findAll.mockResolvedValue(mockItems);

        // Action: Perform the GET request
        const res = await request(app).get('/api/items');
        
        // Assertions: Did we get 200 OK and the right data?
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockItems);
        // Ensure the code actually asked the repository for data exactly once
        expect(itemRepository.findAll).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST: POST /api/items (Success case)
     * Verifies that valid item data results in a 201 Created status.
     */
    it('POST /api/items - should create a new item', async () => {
        const newItem = { name: 'New Item', price: 200, category: 'Food', quantity: 5 };
        const createdItem = { id: 'SKU456', ...newItem };
        
        // Setup the mock to simulate a successful database insert
        itemRepository.create.mockResolvedValue(createdItem);

        const res = await request(app).post('/api/items').send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(createdItem);
        // Check that the correct data was passed into the create method
        expect(itemRepository.create).toHaveBeenCalledWith(newItem);
    });

    /**
     * TEST: POST /api/items (Validation Failure)
     * Verifies that the controller's validation logic blocks bad data 
     * before it even reaches the repository.
     */
    it('POST /api/items - should fail if name is missing', async () => {
        const invalidItem = { price: 200, category: 'Food', quantity: 5 }; // Missing 'name'
        
        const res = await request(app).post('/api/items').send(invalidItem);

        // Assertions: Should get 400 Bad Request
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        // Crucial: The repository should NOT have been called because validation failed
        expect(itemRepository.create).not.toHaveBeenCalled();
    });
});