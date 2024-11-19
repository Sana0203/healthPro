const express = require('express');
const { Client } = require('pg'); // PostgreSQL client for Node.js

const app = express();
const PORT = process.env.PORT || 3000;

// Set up PostgreSQL client
const client = new Client({
  user: 'AmritjotSingh',
  host: 'yourDatabaseHost', // Private IP or hostname of the database
  database: 'yourDatabaseName',
  password: 'yourPassword',
  port: 5432, // PostgreSQL default port
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database', err));

// API endpoint to fetch data from the database
app.get('/api/getData', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM your_table');
    res.json(result.rows); // Send the data from the database to the frontend
  } catch (err) {
    console.error('Error fetching data from database', err);
    res.status(500).send('Error fetching data');
  }
});

// Serve static HTML frontend (optional)
app.use(express.static('public')); // Assuming your HTML files are in the "public" folder

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
