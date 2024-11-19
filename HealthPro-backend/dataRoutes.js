const express = require('express');
const router = express.Router();
const connectToDatabase = require('../db');

// Route to fetch data from the database
router.get('/get-data', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const result = await client.query('SELECT * FROM Doctors');  // Adjust the query to your table
        res.json(result.rows);  // Send the query result as JSON
        client.end();  // Close the connection after the query
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed: ' + err.message });
    }
});

module.exports = router;
