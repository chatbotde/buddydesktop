/**
 * Audio-related IPC Handlers
 * Handles audio capture control and audio-related operations
 */

const { ipcMain } = require('electron');
const { 
    startMacOSAudioCapture, 
    stopMacOSAudioCapture, 
    pauseMacOSAudioCapture, 
    resumeMacOSAudioCapture 
} = require('../audio-manager');

/**
 * Register all audio-related IPC handlers
 */
function registerAudioHandlers() {
    // Start macOS audio capture
    ipcMain.handle('start-macos-audio', async (event) => {
        if (process.platform !== 'darwin') {
            return {
                success: false,
                error: 'macOS audio capture only available on macOS',
            };
        }

        try {
            const success = startMacOSAudioCapture();
            return { success };
        } catch (error) {
            console.error('Error starting macOS audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    // Stop macOS audio capture
    ipcMain.handle('stop-macos-audio', async (event) => {
        try {
            stopMacOSAudioCapture();
            return { success: true };
        } catch (error) {
            console.error('Error stopping macOS audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    // Pause macOS audio capture
    ipcMain.handle('pause-macos-audio', async (event) => {
        try {
            const success = pauseMacOSAudioCapture();
            return { success };
        } catch (error) {
            console.error('Error pausing macOS audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    // Resume macOS audio capture
    ipcMain.handle('resume-macos-audio', async (event) => {
        try {
            const success = resumeMacOSAudioCapture();
            return { success };
        } catch (error) {
            console.error('Error resuming macOS audio capture:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    registerAudioHandlers
};
