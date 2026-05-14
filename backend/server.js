require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { initDb } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

const itemsRoutes = require('./src/routes/items.routes');
const salesRoutes = require('./src/routes/sales.routes');
const qrRoutes = require('./src/routes/qr.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/qr', qrRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'ShopTrack API is running' });
});

// Global error handler — must be last
app.use(errorHandler);

// Start server
const start = async () => {
    try {
        await initDb();
        app.listen(PORT, () => {
            console.log(`ShopTrack API running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

start();