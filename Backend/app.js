const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for the frontend hosted locally
app.use(cors({ origin: 'http://localhost:3000' })); // Change the port if needed

// Sample API endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Welcome to HealthPro Backend!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`HealthPro backend is running on port ${PORT}`);
});
