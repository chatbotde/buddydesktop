/**
 * Buddy Desktop Application - Main Entry Point
 * Modular architecture with organized file structure
 */

// Check for Squirrel startup and exit early if needed
if (require('electron-squirrel-startup')) {
    process.exit(0);
}

// Load environment variables from .env file
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Debug: Log current working directory and .env file path
console.log('🔧 Current working directory:', process.cwd());
console.log('🔧 .env file path:', require('path').join(__dirname, '../.env'));
console.log('🔧 Environment variables loaded:', {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Not set',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set'
});

const { app } = require('electron');

// Import configuration and managers
const { getAppConfig } = require('./main/app-config');
const { createMainWindow } = require('./main/window-manager');
const { stopMacOSAudioCapture } = require('./main/audio-manager');

// Import all IPC handlers
const { registerAIHandlers } = require('./main/handlers/ai-handlers');
const { registerAudioHandlers } = require('./main/handlers/audio-handlers');
const { registerAuthHandlers } = require('./main/handlers/auth-handlers');
const { registerWindowHandlers } = require('./main/handlers/window-handlers');
const { registerMarketplaceHandlers } = require('./main/handlers/marketplace-handlers');

/**
 * Initialize the application
 */
function initializeApp() {
    // Get app configuration
    const config = getAppConfig();
    console.log('🚀 Buddy Desktop starting...', {
        platform: config.platform,
        directories: config.directories
    });

    // Register all IPC handlers
    registerAIHandlers();
    registerAudioHandlers();
    registerAuthHandlers();
    registerWindowHandlers();
    registerMarketplaceHandlers();

    console.log('✅ All IPC handlers registered');
}

/**
 * Application event handlers
 */
app.whenReady().then(() => {
    initializeApp();
    createMainWindow();
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    const { BrowserWindow } = require('electron');
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

/**
 * Application Documentation:
 *
 * This application provides consistent window properties across all windows:
 * - Frameless windows (frame: false)
 * - Transparent background (transparent: true)
 * - Always on top (alwaysOnTop: true)
 * - Hidden from taskbar (skipTaskbar: true)
 * - Hidden from mission control (hiddenInMissionControl: true)
 * - Content protection enabled
 * - Visible on all workspaces
 *
 * All windows created through createConsistentWindow() or createImageWindow()
 * will inherit these properties automatically.
 *
 * File Structure:
 * - main/app-config.js: Application configuration and global state
 * - main/ai-manager.js: AI provider management and session handling
 * - main/audio-manager.js: Audio capture and processing
 * - main/window-manager.js: Window creation and management
 * - main/handlers/: All IPC handlers organized by functionality
 */
