const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Configure database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

app.use(express.json());

// Use CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/addRecord', async (req, res) => {
try {
    const { date, contributors, moneyEach } = req.body;
    const result = await pool.query(
    'INSERT INTO records(date, contributors, money_each) VALUES($1, $2, $3) RETURNING *',
    [date, JSON.stringify(contributors), moneyEach]
    );
    res.status(201).json(result.rows[0]);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// Endpoint to get all records
app.get('/getRecords', async (req, res) => {
try {
    const result = await pool.query('SELECT * FROM records ORDER BY date DESC');
    res.status(200).json(result.rows);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});