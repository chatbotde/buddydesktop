// marketplace-integration.js
// This file integrates the marketplace window with the buddy-element.js

/**
 * Register marketplace handlers in the buddy-element.js file
 * @param {Object} buddyElement - The BuddyElement instance
 */
export function registerMarketplaceIntegration(buddyElement) {
    // Add openMarketplaceWindow method to BuddyElement
    buddyElement.openMarketplaceWindow = async function() {
        try {
            // Check if we're in Electron environment
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                
                // Send IPC message to main process to create marketplace window
                const result = await ipcRenderer.invoke('create-marketplace-window', {
                    selectedButtons: this.customMenuButtons || []
                });
                
                if (result.success) {
                    console.log('Marketplace window opened successfully');
                    
                    // Show brief notification
                    this.statusText = 'Marketplace window opened';
                    setTimeout(() => {
                        if (this.statusText === 'Marketplace window opened') {
                            this.statusText = '';
                        }
                    }, 3000);
                } else {
                    console.error('Failed to open marketplace window:', result.error);
                }
            } else {
                // Fallback for non-Electron environments
                console.log('Opening marketplace in browser window');
                
                // Import the marketplace window class
                const MarketplaceWindow = (await import('./marketplace-window.js')).default;
                
                // Open external marketplace window
                const marketplaceWindow = MarketplaceWindow.openExternalWindow(
                    this.customMenuButtons || []
                );
                
                if (marketplaceWindow) {
                    // Listen for messages from the marketplace window
                    const messageHandler = (event) => {
                        if (event.source === marketplaceWindow) {
                            if (event.data.type === 'marketplace-apply') {
                                this._handleMarketplaceButtonsUpdated(event.data.selectedButtons);
                                window.removeEventListener('message', messageHandler);
                            } else if (event.data.type === 'marketplace-close') {
                                window.removeEventListener('message', messageHandler);
                            }
                        }
                    };
                    
                    window.addEventListener('message', messageHandler);
                }
            }
        } catch (error) {
            console.error('Error opening marketplace window:', error);
        }
    };
    
    // Add handler for marketplace buttons updated event
    buddyElement._handleMarketplaceButtonsUpdated = function(selectedButtons) {
        // Update the custom menu buttons
        this.customMenuButtons = selectedButtons;
        
        // Save the configuration
        this.saveUserPreference('customMenuButtons', selectedButtons);
        
        // Notify components that need to update
        this.dispatchEvent(new CustomEvent('marketplace-buttons-updated', { 
            detail: { buttons: selectedButtons }, 
            bubbles: true, 
            composed: true 
        }));
    };
    
    // Add event listener for marketplace window open request
    buddyElement.addEventListener('open-marketplace-window', async () => {
        await buddyElement.openMarketplaceWindow();
    });
    
    // Add event listener for marketplace buttons updated from IPC
    if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.on('marketplace-buttons-updated', (event, data) => {
            buddyElement._handleMarketplaceButtonsUpdated(data.selectedButtons);
        });
    }
}

/**
 * Register marketplace handlers in the main process
 * @param {Object} app - The Electron app instance
 * @param {Object} ipcMain - The Electron ipcMain instance
 */
export function registerMainProcessHandlers(app, ipcMain) {
    // Import the marketplace manager
    const { registerMarketplaceHandlers } = require('./marketplace-manager');
    
    // Register marketplace handlers
    registerMarketplaceHandlers(ipcMain);
}