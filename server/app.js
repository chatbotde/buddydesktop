/**
 * Simple Express Server for Usage Tracking
 * Run this with: node server/app.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import usage tracking API
const usageTrackingAPI = require('./usage-tracking-api');

// Mount the usage tracking API
app.use('/api', usageTrackingAPI);

// Simple route to serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Usage tracking API available at http://localhost:${PORT}/api/usage-tracking`);
});

module.exports = app;
