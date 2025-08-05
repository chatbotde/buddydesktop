/**
 * AI-related IPC Handlers
 * Handles all AI provider communication and session management
 */

const { ipcMain, shell } = require('electron');
const { initializeAISession, getApiKeyFromEnvironment } = require('../ai-manager');
const { AppState } = require('../app-config');
const { sendToRenderer } = require('../window-manager');

/**
 * Register all AI-related IPC handlers
 */
function registerAIHandlers() {
    // Initialize AI session
    ipcMain.handle('initialize-ai', async (event, provider, apiKey, profile = 'default', language = 'en-US', model = '') => {
        return await initializeAISession(provider, apiKey, profile, language, model);
    });

    // Check environment API key
    ipcMain.handle('check-environment-key', async (event, provider) => {
        const envKey = getApiKeyFromEnvironment(provider);
        return envKey && envKey.trim() !== '';
    });

    // Open external URL
    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Failed to open external URL:', error);
            return { success: false, error: error.message };
        }
    });

    // Send audio content to AI
    ipcMain.handle('send-audio-content', async (event, { data, mimeType }) => {
        const currentAIProvider = AppState.get('currentAIProvider');
        if (!currentAIProvider) return { success: false, error: 'No active AI session' };
        
        try {
            process.stdout.write('.');
            await currentAIProvider.sendRealtimeInput({
                audio: { data: data, mimeType: mimeType },
            });
            return { success: true };
        } catch (error) {
            console.error('Error sending audio:', error);
            return { success: false, error: error.message };
        }
    });

    // Send image content to AI
    ipcMain.handle('send-image-content', async (event, { data, debug }) => {
        const currentAIProvider = AppState.get('currentAIProvider');
        if (!currentAIProvider) return { success: false, error: 'No active AI session' };

        try {
            if (!data || typeof data !== 'string') {
                console.error('Invalid image data received');
                return { success: false, error: 'Invalid image data' };
            }

            const buffer = Buffer.from(data, 'base64');

            if (buffer.length < 1000) {
                console.error(`Image buffer too small: ${buffer.length} bytes`);
                return { success: false, error: 'Image buffer too small' };
            }

            process.stdout.write('!');
            await currentAIProvider.sendRealtimeInput({
                media: { data: data, mimeType: 'image/jpeg' },
            });

            return { success: true };
        } catch (error) {
            console.error('Error sending image:', error);
            return { success: false, error: error.message };
        }
    });

    // Send video content to AI
    ipcMain.handle('send-video-content', async (event, { data, mimeType, isRealtime }) => {
        const currentAIProvider = AppState.get('currentAIProvider');
        if (!currentAIProvider) return { success: false, error: 'No active AI session' };

        try {
            if (!data || typeof data !== 'string') {
                console.error('Invalid video data received');
                return { success: false, error: 'Invalid video data' };
            }

            const buffer = Buffer.from(data, 'base64');

            if (buffer.length < 500) {
                console.error(`Video buffer too small: ${buffer.length} bytes`);
                return { success: false, error: 'Video buffer too small' };
            }

            // For real-time video streaming, use a different indicator
            if (isRealtime) {
                process.stdout.write('▶');
            } else {
                process.stdout.write('!');
            }

            await currentAIProvider.sendRealtimeInput({
                media: { data: data, mimeType: mimeType || 'image/jpeg' },
            });

            return { success: true };
        } catch (error) {
            console.error('Error sending video:', error);
            return { success: false, error: error.message };
        }
    });

    // Send text message to AI
    ipcMain.handle('send-text-message', async (event, messageData) => {
        const currentAIProvider = AppState.get('currentAIProvider');
        if (!currentAIProvider) return { success: false, error: 'No active AI session' };

        try {
            // Handle both old string format and new object format for backward compatibility
            let text, screenshots;
            if (typeof messageData === 'string') {
                text = messageData;
                screenshots = null;
            } else if (typeof messageData === 'object' && messageData !== null) {
                text = messageData.text;
                screenshots = messageData.screenshots || (messageData.screenshot ? [messageData.screenshot] : null);
            } else {
                return { success: false, error: 'Invalid message format' };
            }

            // Validate that we have either text or screenshots
            if ((!text || text.trim().length === 0) && (!screenshots || screenshots.length === 0)) {
                return { success: false, error: 'Message must contain text or screenshots' };
            }

            const input = {};
            if (text && text.trim().length > 0) {
                input.text = text.trim();
            }
            if (screenshots && Array.isArray(screenshots) && screenshots.length > 0) {
                input.screenshots = screenshots;
            }

            console.log('Sending message:', {
                hasText: !!input.text,
                hasScreenshots: !!input.screenshots,
                screenshotCount: input.screenshots ? input.screenshots.length : 0,
            });
            await currentAIProvider.sendRealtimeInput(input);
            return { success: true };
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, error: error.message };
        }
    });

    // Stop streaming
    ipcMain.handle('stop-streaming', async (event) => {
        try {
            console.log('🛑 Stop streaming requested');
            
            const currentAIProvider = AppState.get('currentAIProvider');
            if (!currentAIProvider) {
                return { success: false, error: 'No active AI session' };
            }

            // Call the AI provider's stop method if it exists
            if (typeof currentAIProvider.stopStreaming === 'function') {
                await currentAIProvider.stopStreaming();
                console.log('✅ AI provider streaming stopped');
            } else if (typeof currentAIProvider.stop === 'function') {
                await currentAIProvider.stop();
                console.log('✅ AI provider stopped');
            } else {
                console.log('⚠️ AI provider does not support stopping, will reset session');
            }

            // Send stop signal to renderer
            sendToRenderer('streaming-stopped', { success: true });
            
            return { success: true };
        } catch (error) {
            console.error('❌ Error stopping streaming:', error);
            sendToRenderer('streaming-stopped', { success: false, error: error.message });
            return { success: false, error: error.message };
        }
    });

    // Close AI session
    ipcMain.handle('close-session', async (event) => {
        try {
            const { stopMacOSAudioCapture } = require('../audio-manager');
            stopMacOSAudioCapture();

            // Cleanup any pending resources and stop audio/video capture
            const currentAIProvider = AppState.get('currentAIProvider');
            if (currentAIProvider) {
                await currentAIProvider.close();
                AppState.set('currentAIProvider', null);
            }

            return { success: true };
        } catch (error) {
            console.error('Error closing session:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    registerAIHandlers
};
