const { Pool } = require('pg');

// Configuration

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'inventory',
    password: 'admin',
    port: 5432,
});

// Verification
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error accesing the database', err.stack)
    }
    console.log('Connected to the database');
    release();
});

module.exports = pool;