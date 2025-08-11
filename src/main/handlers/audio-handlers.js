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
const { enhancedAudioManager } = require('../enhanced-audio-manager');

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

    // Enhanced system audio capabilities check
    ipcMain.handle('check-system-audio-capabilities', async (event) => {
        try {
            const capabilities = await enhancedAudioManager.checkCapabilities();
            return capabilities;
        } catch (error) {
            console.error('Error checking system audio capabilities:', error);
            return {
                supported: false,
                error: error.message,
                platform: process.platform
            };
        }
    });

    // Start enhanced system audio capture
    ipcMain.handle('start-enhanced-system-audio', async (event, options) => {
        try {
            // Set up audio callback to send data to AI
            enhancedAudioManager.setAudioCallback(async (audioData) => {
                try {
                    // Convert Buffer to base64
                    const base64Data = audioData.data.toString('base64');
                    
                    // Send to AI handler using existing interface
                    const { ipcMain } = require('electron');
                    const { AppState } = require('../app-config');
                    
                    const currentAIProvider = AppState.get('currentAIProvider');
                    if (currentAIProvider) {
                        await currentAIProvider.sendRealtimeInput({
                            audio: { 
                                data: base64Data, 
                                mimeType: `audio/pcm;rate=${audioData.sampleRate}` 
                            },
                        });
                        process.stdout.write('🎵'); // Audio indicator
                    }
                } catch (error) {
                    console.error('Error processing enhanced audio data:', error);
                }
            });
            
            const result = await enhancedAudioManager.startCapture(options);
            return result;
        } catch (error) {
            console.error('Error starting enhanced system audio:', error);
            return { success: false, error: error.message };
        }
    });

    // Stop enhanced system audio capture
    ipcMain.handle('stop-enhanced-system-audio', async (event) => {
        try {
            const result = await enhancedAudioManager.stopCapture();
            return result;
        } catch (error) {
            console.error('Error stopping enhanced system audio:', error);
            return { success: false, error: error.message };
        }
    });

    // Pause enhanced system audio capture
    ipcMain.handle('pause-enhanced-system-audio', async (event) => {
        try {
            const result = await enhancedAudioManager.pauseCapture();
            return result;
        } catch (error) {
            console.error('Error pausing enhanced system audio:', error);
            return { success: false, error: error.message };
        }
    });

    // Resume enhanced system audio capture
    ipcMain.handle('resume-enhanced-system-audio', async (event) => {
        try {
            const result = await enhancedAudioManager.resumeCapture();
            return result;
        } catch (error) {
            console.error('Error resuming enhanced system audio:', error);
            return { success: false, error: error.message };
        }
    });

    // Get enhanced audio status
    ipcMain.handle('get-enhanced-audio-status', async (event) => {
        try {
            const status = enhancedAudioManager.getStatus();
            return { success: true, status };
        } catch (error) {
            console.error('Error getting enhanced audio status:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    registerAudioHandlers
};
