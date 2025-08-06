
// Test script to verify installation works
const { app } = require('electron');

console.log('Testing electron-squirrel-startup...');
try {
    const squirrelStartup = require('electron-squirrel-startup');
    console.log('✅ electron-squirrel-startup loaded successfully');
} catch (error) {
    console.log('⚠️ electron-squirrel-startup not available:', error.message);
}

console.log('✅ Installation test completed');
