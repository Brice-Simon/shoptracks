/**
 * DATABASE CONFIGURATION (db.js)
 * This file handles the connection to the PostgreSQL database and 
 * manages initial table creation and data seeding.
 */

const { Pool } = require('pg'); // Imports the PostgreSQL Connection Pool from the 'pg' library
const fs = require('fs');       // Node.js File System module to read SQL files
const path = require('path');   // Node.js Path module to handle file directories

/**
 * DATABASE CONNECTION SETUP
 * Uses environment variables if available (e.g., in production), 
 * otherwise defaults to 'localhost' and standard PostgreSQL settings.
 */
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shoptrack',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
});

/**
 * initDb (Initialization Function)
 * Locates the schema.sql and seed.sql files on the server and executes 
 * them against the database to ensure tables exist and have initial data.
 */
const initDb = async () => {
    // Resolve absolute paths to the SQL files located in the database folder
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

    // Read the content of the SQL files as UTF-8 text strings
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seed = fs.readFileSync(seedPath, 'utf8');

    // Execute the SQL commands in the database
    await pool.query(schema); // Creates tables (e.g., CREATE TABLE IF NOT EXISTS)
    await pool.query(seed);   // Populates tables (e.g., INSERT INTO ... ON CONFLICT)

    console.log('Database initialized successfully.');
};

/**
 * getDb (Access Function)
 * Allows other parts of the application (like repositories) to 
 * access the same database connection pool.
 * @returns {Pool} The shared PostgreSQL connection pool.
 */
const getDb = () => pool;

// Export the functions for use in server.js or elsewhere
module.exports = { initDb, getDb };