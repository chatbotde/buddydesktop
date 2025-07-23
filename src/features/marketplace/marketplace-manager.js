// marketplace-manager.js
// This file integrates the marketplace window with the WindowManager

/**
 * Creates a marketplace window using the WindowManager
 * @param {Array} selectedButtons - Array of currently selected buttons
 * @returns {Promise<Object>} - Result of window creation
 */
export async function createMarketplaceWindow(selectedButtons = []) {
    try {
        // Import the WindowManager
        const { windowManager } = require('../../window.js');
        
        // Create a unique ID for the marketplace window
        const windowId = 'marketplace-' + Date.now();
        
        // Create the window using the WindowManager with preset options
        const marketplaceWindow = windowManager.createPresetWindow('widget', {
            width: 800,
            height: 600,
            title: 'Marketplace',
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        }, windowId, 'standard');
        
        // Load the marketplace HTML file
        await marketplaceWindow.loadFile('src/features/marketplace/marketplace.html');
        
        // Pass the selected buttons to the window
        await marketplaceWindow.webContents.executeJavaScript(`
            window.selectedButtons = ${JSON.stringify(selectedButtons || [])};
        `);
        
        // Set up IPC handlers for window communication
        const { ipcMain } = require('electron');
        
        // Handle window drag events
        ipcMain.on('marketplace-window-drag-start', (event, dragOffset) => {
            if (event.sender === marketplaceWindow.webContents) {
                marketplaceWindow.webContents.send('enable-drag-mode');
            }
        });
        
        // Handle window close
        marketplaceWindow.on('closed', () => {
            ipcMain.removeAllListeners('marketplace-window-drag-start');
            ipcMain.removeAllListeners('marketplace-apply');
            ipcMain.removeAllListeners('marketplace-close');
        });
        
        // Show the window when it's ready
        marketplaceWindow.once('ready-to-show', () => {
            marketplaceWindow.show();
            marketplaceWindow.focus();
        });
        
        return { success: true, windowId };
    } catch (error) {
        console.error('Failed to create marketplace window:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Register IPC handlers for marketplace window
 * @param {Object} ipcMain - Electron IPC main object
 */
export function registerMarketplaceHandlers(ipcMain) {
    // Handle marketplace window creation request
    ipcMain.handle('create-marketplace-window', async (event, options) => {
        return await createMarketplaceWindow(options.selectedButtons);
    });
    
    // Handle marketplace apply event
    ipcMain.on('marketplace-apply', (event, selectedButtons) => {
        // Find the sender window
        const { BrowserWindow } = require('electron');
        const senderWindow = BrowserWindow.fromWebContents(event.sender);
        
        // Find the parent window (main app window)
        const allWindows = BrowserWindow.getAllWindows();
        const mainWindow = allWindows.find(w => w.id !== senderWindow.id);
        
        if (mainWindow) {
            // Send the selected buttons to the main window
            mainWindow.webContents.send('marketplace-buttons-updated', { 
                selectedButtons 
            });
        }
        
        // Close the marketplace window
        senderWindow.close();
    });
}