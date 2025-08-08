/**
 * Window-related IPC Handlers
 * Handles window creation, management, and controls
 */

const { ipcMain, BrowserWindow } = require('electron');
const { 
    createImageWindow, 
    createAudioWindow, 
    createSearchWindow, 
    createMarketplaceWindow,
    createConsistentWindow,
    windowManager,
    updateShortcutState
} = require('../window-manager');
const { AppState } = require('../app-config');

/**
 * Register all window-related IPC handlers
 */
function registerWindowHandlers() {
    // Window minimize
    ipcMain.handle('window-minimize', () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].minimize();
        }
    });

    // Window close
    ipcMain.handle('window-close', async () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].close();
        }
    });

    // Quit application
    ipcMain.handle('quit-application', async (event) => {
        try {
            const { stopMacOSAudioCapture } = require('../audio-manager');
            stopMacOSAudioCapture();
            
            const authService = AppState.get('authService');
            if (authService) {
                await authService.close();
            }
            
            const { app } = require('electron');
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

    // IPC handler for creating image windows with consistent properties
    ipcMain.handle('create-image-window', async (event, imageData, title = 'Screenshot') => {
        try {
            return await createImageWindow(imageData, title);
        } catch (error) {
            console.error('Failed to create image window:', error);
            return { success: false, error: error.message };
        }
    });

    // General IPC handler for creating any window with consistent properties
    ipcMain.handle('create-consistent-window', async (event, options = {}) => {
        try {
            const window = createConsistentWindow(options);
            return { success: true, windowId: window.id };
        } catch (error) {
            console.error('Failed to create consistent window:', error);
            return { success: false, error: error.message };
        }
    });

    // IPC handler for creating audio window
    ipcMain.handle('create-audio-window', async (event, options = {}) => {
        return await createAudioWindow(options);
    });

    // IPC handler for creating search window
    ipcMain.handle('create-search-window', async (event, options = {}) => {
        return await createSearchWindow(options);
    });

    // IPC handler for creating marketplace window
    ipcMain.handle('create-marketplace-window', async (event, options = {}) => {
        return await createMarketplaceWindow(options);
    });

    // Enhanced privacy protection handlers
    ipcMain.handle('toggle-content-protection', async (event, enabled) => {
        try {
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                windows[0].setContentProtection(enabled);
                console.log(`Content protection ${enabled ? 'enabled' : 'disabled'}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle content protection:', error);
            return { success: false, error: error.message };
        }
    });

    // Complete window hiding (makes window completely invisible)
    ipcMain.handle('toggle-complete-window-hiding', async (event, enabled) => {
        try {
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                const window = windows[0];
                if (enabled) {
                    // Hide window completely
                    window.hide();
                    // Also set skip taskbar to remove from taskbar
                    window.setSkipTaskbar(true);
                } else {
                    // Show window and restore to taskbar
                    window.setSkipTaskbar(false);
                    window.show();
                }
                console.log(`Complete window hiding ${enabled ? 'enabled' : 'disabled'}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle complete window hiding:', error);
            return { success: false, error: error.message };
        }
    });

    // Window opacity based hiding (makes window nearly transparent)
    ipcMain.handle('toggle-opacity-hiding', async (event, enabled) => {
        try {
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                const window = windows[0];
                if (enabled) {
                    // Make window nearly invisible (but still functional)
                    window.setOpacity(0.05);
                    // Also enable click-through
                    window.setIgnoreMouseEvents(true, { forward: true });
                } else {
                    // Restore normal opacity and mouse events
                    window.setOpacity(1.0);
                    window.setIgnoreMouseEvents(false);
                }
                console.log(`Opacity hiding ${enabled ? 'enabled' : 'disabled'}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle opacity hiding:', error);
            return { success: false, error: error.message };
        }
    });

    // Advanced privacy mode (combines multiple protection methods)
    ipcMain.handle('toggle-advanced-privacy', async (event, enabled) => {
        try {
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                const window = windows[0];
                if (enabled) {
                    // Enable all protection methods
                    window.setContentProtection(true);
                    window.setSkipTaskbar(true);
                    window.setOpacity(0.1);
                    window.setAlwaysOnTop(false); // Remove from top to be less noticeable
                    // Make window non-focusable in privacy mode
                    window.setFocusable(false);
                } else {
                    // Disable all protection methods
                    window.setContentProtection(false);
                    window.setSkipTaskbar(false);
                    window.setOpacity(1.0);
                    window.setFocusable(true);
                }
                console.log(`Advanced privacy mode ${enabled ? 'enabled' : 'disabled'}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle advanced privacy:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('toggle-workspace-visibility', async (event, enabled) => {
        try {
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                windows[0].setVisibleOnAllWorkspaces(enabled, { visibleOnFullScreen: true });
                console.log(`Workspace visibility ${enabled ? 'enabled' : 'disabled'}`);
            }
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle workspace visibility:', error);
            return { success: false, error: error.message };
        }
    });

    // Opacity control handlers
    ipcMain.handle('set-window-opacity', async (event, data) => {
        try {
            const { windowId, opacity } = data;
            if (!windowId || typeof opacity !== 'number') {
                return { success: false, error: 'Invalid parameters' };
            }
            
            const success = windowManager.setWindowOpacity(windowId, opacity);
            return { success };
        } catch (error) {
            console.error('Failed to set window opacity:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-window-opacity', async (event, windowId) => {
        try {
            if (!windowId) {
                return { success: false, error: 'Window ID required' };
            }
            
            const opacity = windowManager.getWindowOpacity(windowId);
            return { success: true, opacity };
        } catch (error) {
            console.error('Failed to get window opacity:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('adjust-window-opacity', async (event, data) => {
        try {
            const { windowId, delta } = data;
            if (!windowId || typeof delta !== 'number') {
                return { success: false, error: 'Invalid parameters' };
            }
            
            const success = windowManager.adjustWindowOpacity(windowId, delta);
            const newOpacity = windowManager.getWindowOpacity(windowId);
            return { success, opacity: newOpacity };
        } catch (error) {
            console.error('Failed to adjust window opacity:', error);
            return { success: false, error: error.message };
        }
    });

    // Simple theme control handlers
    ipcMain.handle('set-simple-window-theme', async (event, data) => {
        try {
            const { windowId, theme } = data;
            console.log('Setting window theme:', { windowId, theme });
            
            if (!windowId || !theme) {
                return { success: false, error: 'Invalid parameters' };
            }
            
            const success = windowManager.setSimpleWindowTheme(windowId, theme);
            console.log('Theme change result:', success);
            return { success };
        } catch (error) {
            console.error('Failed to set simple window theme:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-simple-themes', async (event) => {
        try {
            const themes = windowManager.getSimpleThemes();
            return { success: true, themes };
        } catch (error) {
            console.error('Failed to get simple themes:', error);
            return { success: false, error: error.message };
        }
    });

    // Shortcut state update handler
    ipcMain.on('update-shortcut-state', (event, data) => {
        const { shortcutId, enabled } = data;
        console.log(`Updating shortcut state: ${shortcutId} = ${enabled}`);
        
        try {
            // Get the main window
            const windows = BrowserWindow.getAllWindows();
            const mainWindow = windows.length > 0 ? windows[0] : null;
            
            if (mainWindow) {
                // Call the updateShortcutState function
                updateShortcutState(shortcutId, enabled, mainWindow);
                
                // Send confirmation back to renderer
                event.reply('shortcut-state-updated', { shortcutId, enabled, success: true });
            } else {
                console.error('No main window found for shortcut state update');
                event.reply('shortcut-state-updated', { shortcutId, enabled, success: false, error: 'No main window found' });
            }
        } catch (error) {
            console.error('Error updating shortcut state:', error);
            event.reply('shortcut-state-updated', { shortcutId, enabled, success: false, error: error.message });
        }
    });

    // View change notification
    ipcMain.on('view-changed', (event, view) => {
        if (view !== 'assistant') {
            // Handle view change logic if needed
        }
    });
}

module.exports = {
    registerWindowHandlers
};
