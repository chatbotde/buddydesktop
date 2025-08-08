/**
 * Simple Server for User Access Tracking
 * Run this with: node server/simple-server.js
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
app.use(express.static(path.join(__dirname, '..')));

// Import user access API
const userAccessAPI = require('./user-access-api');

// Mount the user access API
app.use('/api', userAccessAPI);

// Serve the dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../user-stats-dashboard.html'));
});

// Simple route to check if server is running
app.get('/', (req, res) => {
    res.json({
        message: 'User Access Tracking Server is running!',
        endpoints: {
            dashboard: '/dashboard',
            stats: '/api/user-stats',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 User Access Tracking Server Started!');
    console.log('=====================================');
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`📈 API Stats: http://localhost:${PORT}/api/user-stats`);
    console.log(`💾 MongoDB: ${process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/buddy'}`);
    console.log('=====================================');
    console.log('🔐 Access Code: Anupchand-Yadav');
    console.log('');
    console.log('Now users can install your app and enter "Anupchand-Yadav" to access it.');
    console.log('Each unique user will be counted in your MongoDB database.');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
});

module.exports = app;
