const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Azure Backend!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
