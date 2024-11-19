const { Client } = require('pg');  // Import the PostgreSQL client

// PostgreSQL connection configuration
const config = {
    user: 'AmritjotSingh@healthpro1',  // Azure PostgreSQL Username
    host: 'healthpro1.database.windows.net',  // Azure PostgreSQL server address
    database: 'healthpro',             // Your PostgreSQL database name
    password: 'ammy@Ammy',             // PostgreSQL password
    port: 5432,                        // Default port for PostgreSQL
    ssl: { rejectUnauthorized: false }  // Disable SSL validation (for Azure)
};

// Function to connect to the database
async function connectToDatabase() {
    const client = new Client(config);
    try {
        await client.connect();  // Connect to PostgreSQL
        console.log('Connected to Azure PostgreSQL Database!');
        return client;  // Return the client object to perform queries
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports = connectToDatabase;
