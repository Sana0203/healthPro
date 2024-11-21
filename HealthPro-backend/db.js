const sql = require('mssql');

// Configuration for the SQL Server connection
const config = {
    user: 'AmritjotSingh', // Replace with your database username
    password: 'ammy@Ammy', // Replace with your database password
    server: 'healthpro1.database.windows.net', // Replace with your SQL Server address
    database: 'healthpro', // Replace with your database name
    options: {
        encrypt: true, // Use true if you're connecting to Azure SQL
        trustServerCertificate: true // Change as needed
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000 // Time (ms) before unused connections are closed
    }
};

// A single pool instance to be reused
let poolPromise = null;

// Function to create and return the connection pool (singleton pattern)
async function createPool() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config).connect()
            .then(pool => {
                console.log('Connected to SQL Server');
                return pool;
            })
            .catch(err => {
                console.error('Database connection failed:', err);
                throw new Error('Database initialization error');
            });
    }
    return poolPromise;
}

// Optional: Test the connection (for debugging)
async function testConnection(pool) {
    try {
        const result = await pool.request().query('SELECT 1 AS test');
        console.log('Test query successful:', result.recordset);
    } catch (err) {
        console.error('Test query failed:', err);
    }
}

// Example function to query data
async function getData() {
    const pool = await createPool();
    await testConnection(pool);

    // Example of querying data
    try {
        const result = await pool.request().query('SELECT * FROM users');
        console.log('Data:', result.recordset);
    } catch (err) {
        console.error('Query failed:', err);
    }
}

// Exporting the necessary components
module.exports = {
    sql,
    createPool,
    testConnection,
    getData
};
