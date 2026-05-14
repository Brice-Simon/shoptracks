const request = require('supertest');
const express = require('express');
const salesRoutes = require('../src/routes/sales.routes');
const saleRepository = require('../src/repositories/SaleRepository');
const itemRepository = require('../src/repositories/ItemRepository');

// Mock both repositories
jest.mock('../src/repositories/SaleRepository');
jest.mock('../src/repositories/ItemRepository');

// Setup minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/sales', salesRoutes);
app.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message });
});

describe('Sales API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/sales - should return all sales', async () => {
        const mockSales = [{ id: '1', total: 500, created_at: new Date().toISOString() }];
        saleRepository.findAll.mockResolvedValue(mockSales);

        const res = await request(app).get('/api/sales');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockSales);
    });

    it('POST /api/sales - should create a sale and decrement stock', async () => {
        const saleRequest = {
            items: [
                { item_id: 'SKU123', item_name: 'Test', price: 100, quantity: 2, subtotal: 200 }
            ]
        };

        const mockItem = { id: 'SKU123', name: 'Test', price: 100, quantity: 10 };
        const mockSale = { id: 'SALE1', total: 200, items: saleRequest.items };

        itemRepository.findById.mockResolvedValue(mockItem);
        saleRepository.create.mockResolvedValue(mockSale);
        itemRepository.decrementStock.mockResolvedValue(true);

        const res = await request(app).post('/api/sales').send(saleRequest);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockSale);
        expect(itemRepository.findById).toHaveBeenCalledWith('SKU123');
        expect(saleRepository.create).toHaveBeenCalledWith({ total: 200, items: saleRequest.items });
        expect(itemRepository.decrementStock).toHaveBeenCalledWith('SKU123', 2);
    });

    it('POST /api/sales - should fail if insufficient stock', async () => {
        const saleRequest = {
            items: [
                { item_id: 'SKU123', item_name: 'Test', price: 100, quantity: 20, subtotal: 2000 }
            ]
        };

        const mockItem = { id: 'SKU123', name: 'Test', price: 100, quantity: 10 }; // Only 10 in stock
        itemRepository.findById.mockResolvedValue(mockItem);

        const res = await request(app).post('/api/sales').send(saleRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/Insufficient stock/);
        expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('POST /api/sales - should fail if items array is empty', async () => {
        const saleRequest = { items: [] };

        const res = await request(app).post('/api/sales').send(saleRequest);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/items array is required/);
    });
});
