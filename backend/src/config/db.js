const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shoptrack',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
});

/**
 * Initializes the database by running schema and seed scripts.
 * Safe to call on every startup — uses IF NOT EXISTS and ON CONFLICT.
 */
const initDb = async () => {
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seed = fs.readFileSync(seedPath, 'utf8');

    await pool.query(schema);
    await pool.query(seed);

    console.log('Database initialized successfully.');
};

/**
 * Returns the pg connection pool for use in repositories.
 * @returns {Pool}
 */
const getDb = () => pool;

module.exports = { initDb, getDb };