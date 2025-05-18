// src/index.ts
import express from 'express';
import { Pool } from 'pg';

const app = express();

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'qrunchy_db',
    user: process.env.DB_USER || 'qrunchy',
    password: process.env.DB_PASSWORD || 'qrunchy_password',
});

// test server
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Qrunchy API!' });
});

// test db connection
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'success',
            message: 'Database connection successful',
            timestamp: result.rows[0].now
        });
    } catch (error: any) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});