const request = require('supertest');
const express = require('express');
const itemsRoutes = require('../src/routes/items.routes');
const itemRepository = require('../src/repositories/ItemRepository');

// Mock the repository
jest.mock('../src/repositories/ItemRepository');

// Setup a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/items', itemsRoutes);
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message });
});

describe('Items API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/items - should return all items', async () => {
        const mockItems = [{ id: 'SKU123', name: 'Test Item', price: 100, category: 'Food', quantity: 10 }];
        itemRepository.findAll.mockResolvedValue(mockItems);

        const res = await request(app).get('/api/items');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockItems);
        expect(itemRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('POST /api/items - should create a new item', async () => {
        const newItem = { name: 'New Item', price: 200, category: 'Food', quantity: 5 };
        const createdItem = { id: 'SKU456', ...newItem };
        itemRepository.create.mockResolvedValue(createdItem);

        const res = await request(app).post('/api/items').send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(createdItem);
        expect(itemRepository.create).toHaveBeenCalledWith(newItem);
    });

    it('POST /api/items - should fail if name is missing', async () => {
        const invalidItem = { price: 200, category: 'Food', quantity: 5 }; // Missing name
        
        const res = await request(app).post('/api/items').send(invalidItem);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(itemRepository.create).not.toHaveBeenCalled();
    });
});
