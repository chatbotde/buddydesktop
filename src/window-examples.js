/**
 * Window Creation Examples
 * This file shows various ways to use the new window system
 */

const { createWindow, createPresetWindow, windowManager } = require('./window');
const path = require('path');

// Example 1: Basic window creation
function createBasicWindow() {
    const window = createWindow({
        width: 600,
        height: 400,
        title: 'Basic Window'
    }, 'basic-window');

    window.loadFile(path.join(__dirname, '../index.html'));
    return window;
}

// Example 2: Using presets
function createOverlayWindow() {
    const window = createPresetWindow('overlay', {
        title: 'Overlay Window',
        x: 100,
        y: 100
    }, 'overlay-window');

    window.loadFile(path.join(__dirname, '../overlay.html'));
    return window;
}

// Example 3: Custom configuration
function createCustomWindow() {
    const window = createWindow({
        width: 800,
        height: 600,
        frame: true,
        transparent: false,
        alwaysOnTop: false,
        backgroundColor: '#2d3748',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    }, 'custom-window');

    window.loadFile(path.join(__dirname, '../custom.html'));
    return window;
}

// Example 4: Dialog window
function createDialogWindow(parentWindow) {
    const window = createPresetWindow('dialog', {
        parent: parentWindow,
        title: 'Dialog Window'
    }, 'dialog-window');

    window.loadFile(path.join(__dirname, '../dialog.html'));
    return window;
}

// Example 5: Widget window
function createWidgetWindow() {
    const window = createPresetWindow('widget', {
        x: 50,
        y: 50,
        title: 'Widget'
    }, 'widget-window');

    window.loadFile(path.join(__dirname, '../widget.html'));
    return window;
}

// Example 6: Multiple windows management
function createMultipleWindows() {
    const windows = [];
    
    // Create main window
    const mainWindow = createPresetWindow('main', {
        title: 'Main Application'
    }, 'main-app');
    windows.push(mainWindow);

    // Create floating panels
    for (let i = 0; i < 3; i++) {
        const panel = createPresetWindow('widget', {
            x: 100 + (i * 50),
            y: 100 + (i * 50),
            title: `Panel ${i + 1}`
        }, `panel-${i}`);
        windows.push(panel);
    }

    return windows;
}

// Example 7: Window with custom behavior
function createSmartWindow() {
    const window = createWindow({
        width: 400,
        height: 300,
        show: false, // Don't show initially
        title: 'Smart Window'
    }, 'smart-window');

    // Custom window behavior
    window.once('ready-to-show', () => {
        window.show();
        window.focus();
    });

    // Auto-hide when losing focus
    window.on('blur', () => {
        if (window.isAlwaysOnTop()) {
            window.hide();
        }
    });

    // Show when clicking on tray or hotkey
    window.on('show', () => {
        window.center();
    });

    window.loadFile(path.join(__dirname, '../smart.html'));
    return window;
}

// Example 8: Update window defaults globally
function updateGlobalDefaults() {
    windowManager.updateDefaults({
        backgroundColor: '#1a202c',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: process.env.NODE_ENV === 'development'
        }
    });
}

// Example 9: Window cleanup
function cleanupWindows() {
    // Close specific window
    windowManager.closeWindow('overlay-window');
    
    // Or close all managed windows
    windowManager.closeAllWindows();
}

module.exports = {
    createBasicWindow,
    createOverlayWindow,
    createCustomWindow,
    createDialogWindow,
    createWidgetWindow,
    createMultipleWindows,
    createSmartWindow,
    updateGlobalDefaults,
    cleanupWindows
};