const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3000; // Or any other port you prefer

// Allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Proxy endpoint to handle API requests
app.get('/api/exchange-rate', async(req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const apiKey = process.env.API_KEY;
    const endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exchange rate' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});