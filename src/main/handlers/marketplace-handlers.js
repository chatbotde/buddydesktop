/**
 * Marketplace-related IPC Handlers
 * Handles marketplace communication and events
 */

const { ipcMain } = require('electron');
const { sendToRenderer } = require('../window-manager');

/**
 * Register all marketplace-related IPC handlers
 */
function registerMarketplaceHandlers() {
    // Handle marketplace apply event
    ipcMain.on('marketplace-apply', (event, selectedButtons) => {
        console.log('Marketplace buttons selected:', selectedButtons);
        
        // Notify main window about the marketplace changes
        sendToRenderer('marketplace-buttons-updated', { selectedButtons });
        
        // Close the marketplace window
        const senderWindow = event.sender.getOwnerBrowserWindow();
        if (senderWindow) {
            senderWindow.close();
        }
    });

    // Handle marketplace instant update event (for real-time dropdown updates)
    ipcMain.on('marketplace-instant-update', (event, selectedButtons) => {
        console.log('Marketplace instant update:', selectedButtons);
        
        // Notify main window about the instant changes
        sendToRenderer('marketplace-instant-update', { selectedButtons });
    });

    // Handle marketplace window close request
    ipcMain.on('marketplace-close-window', (event) => {
        const senderWindow = event.sender.getOwnerBrowserWindow();
        if (senderWindow) {
            senderWindow.close();
        }
    });
}

module.exports = {
    registerMarketplaceHandlers
};
