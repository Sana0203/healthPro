const express = require('express');
const app = express();
const dataRoutes = require('./routes/dataRoutes'); // Import your routes file
const { poolPromise } = require('./db'); // Import and verify the database connection
require('dotenv').config(); // Use environment variables
const cors = require('cors'); // Import CORS package
const logger = require('morgan'); // Importing logging middleware (optional)
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Use morgan for HTTP request logging in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

// Function to verify the database connection
async function verifyDatabaseConnection() {
    try {
        const pool = await poolPromise; // Wait for the database pool to initialize
        console.log('Database connection verified.');
    } catch (err) {
        console.error('Failed to connect to the database on startup:', err);
        process.exit(1); // Exit if the database connection fails
    }
}

// Verify database connection on startup
verifyDatabaseConnection();

// Root route for testing the server
app.get('/', (req, res) => {
    res.send('Welcome to the HealthPro Backend API!');
});

// Use the data routes
app.use('/api', dataRoutes); // All routes will be under /api

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'An internal server error occurred.' });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Start the server
const PORT = process.env.PORT || 5501; // Use the environment variable or default to 5501
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown: Listen for SIGINT (Ctrl+C) and close the server and DB connection gracefully
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    try {
        await poolPromise.then(pool => pool.close()); // Close the database pool
        console.log('Database connection closed.');
    } catch (err) {
        console.error('Error closing database connection:', err);
    }
    process.exit(0); // Exit the process
});
