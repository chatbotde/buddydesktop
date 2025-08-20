// window-service.js
const { ipcRenderer } = require('electron');

class WindowService {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for the screenshot shortcut command from main process
        ipcRenderer.on('capture-and-send-screenshot', async () => {
            // This will be handled by the AI communication service
            if (window.buddy?.aiCommunicationService) {
                await window.buddy.aiCommunicationService.captureAndSendScreenshot();
            }
        });

        // Listen for the desktop capture shortcut command from main process
        ipcRenderer.on('capture-desktop-and-send-screenshot', async () => {
            await this.captureDesktopAndSendScreenshot();
        });
    }

    async createImageWindow(imageData, title = 'Screenshot') {
        try {
            const result = await ipcRenderer.invoke('create-image-window', imageData, title);
            if (result.success) {
                console.log('Image window created successfully');
                return result;
            } else {
                console.error('Failed to create image window:', result.error);
                // Fallback to window.open() if IPC fails
                const newWindow = window.open();
                newWindow.document.write(`
                    <html>
                        <head><title>${title}</title></head>
                        <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                            <img src="data:image/jpeg;base64,${imageData}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                        </body>
                    </html>
                `);
                return { success: true, fallback: true };
            }
        } catch (error) {
            console.error('Error creating image window:', error);
            // Fallback to window.open() if IPC fails
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                    <head><title>${title}</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                        <img src="data:image/jpeg;base64,${imageData}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                    </body>
                </html>
            `);
            return { success: true, fallback: true };
        }
    }

    async createConsistentWindow(options = {}) {
        try {
            const result = await ipcRenderer.invoke('create-consistent-window', options);
            if (result.success) {
                console.log('Consistent window created successfully');
                return result;
            } else {
                console.error('Failed to create consistent window:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error creating consistent window:', error);
            return { success: false, error: error.message };
        }
    }

    async openExternal(url) {
        try {
            const result = await ipcRenderer.invoke('open-external', url);
            return result;
        } catch (error) {
            console.error('Error opening external URL:', error);
            throw error;
        }
    }

    // Test function for window creation
    async testWindowCreation() {
        console.log('Testing window creation...');
        
        // Test image window creation
        const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 transparent pixel
        const imageResult = await this.createImageWindow(testImageData, 'Test Image Window');
        console.log('Image window result:', imageResult);
        
        // Test consistent window creation
        const windowResult = await this.createConsistentWindow({
            width: 400,
            height: 300,
            title: 'Test Window'
        });
        console.log('Consistent window result:', windowResult);
        
        return { imageResult, windowResult };
    }

    // Test function for native screenshot capture
    async testNativeScreenshot() {
        console.log('Testing native screenshot capture...');
        
        try {
            const result = await ipcRenderer.invoke('capture-native-screenshot');
            console.log('Native screenshot result:', {
                success: result.success,
                hasData: !!result.data,
                dataSize: result.data ? `${Math.round(result.data.length / 1024)}KB` : 'N/A',
                error: result.error
            });
            
            // If successful, show the screenshot in a new window
            if (result.success && result.data) {
                await this.createImageWindow(result.data, 'Native Screenshot Test');
            }
            
            return result;
        } catch (error) {
            console.error('Error testing native screenshot:', error);
            return { success: false, error: error.message };
        }
    }

    // Desktop capture and send to AI
    async captureDesktopAndSendScreenshot() {
        console.log('Capturing desktop screenshot and analyzing with AI...');
        
        // Check if we have a buddy element and basic configuration
        const buddy = window.buddy?.e ? window.buddy.e() : null;
        if (!buddy) {
            console.warn('Buddy element not found');
            return { success: false, error: 'Application not ready' };
        }

        // For real-time models, we need an active session
        // For non-realtime models, we just need a configured model
        const isRealTimeModel = buddy.isSelectedModelRealTime;
        
        if (isRealTimeModel && !buddy.sessionActive) {
            console.log('Real-time model requires active session - attempting to start one...');
            if (buddy.setStatus) {
                buddy.setStatus('Starting AI session...');
            }
            
            if (typeof buddy.autoStartSession === 'function') {
                const sessionStarted = await buddy.autoStartSession();
                if (!sessionStarted) {
                    console.warn('Failed to start AI session automatically');
                    if (buddy.setStatus) {
                        buddy.setStatus('Please configure and start a chat session first');
                    }
                    return { success: false, error: 'Could not start AI session' };
                }
                console.log('AI session started successfully');
            } else {
                console.warn('Cannot auto-start session');
                if (buddy.setStatus) {
                    buddy.setStatus('Please start a chat session first');
                }
                return { success: false, error: 'No active AI session' };
            }
        } else if (!isRealTimeModel) {
            // For non-realtime models, just ensure we have a model selected
            if (!buddy.selectedModel) {
                console.warn('No model selected for screenshot analysis');
                if (buddy.setStatus) {
                    buddy.setStatus('Please select a model first');
                }
                return { success: false, error: 'No model selected' };
            }
            
            // If no session is active, auto-initialize for non-realtime models
            if (!buddy.sessionActive) {
                console.log('Auto-initializing session for non-realtime model...');
                if (buddy.setStatus) {
                    buddy.setStatus('Initializing AI...');
                }
                
                if (typeof buddy.autoStartSession === 'function') {
                    const sessionStarted = await buddy.autoStartSession();
                    if (!sessionStarted) {
                        console.warn('Failed to initialize AI for screenshot analysis');
                        if (buddy.setStatus) {
                            buddy.setStatus('Failed to initialize AI - check your configuration');
                        }
                        return { success: false, error: 'Could not initialize AI' };
                    }
                    console.log('AI initialized successfully for screenshot analysis');
                }
            }
        }
        
        try {
            // Capture the desktop screenshot using native desktopCapturer
            const screenshotResult = await ipcRenderer.invoke('capture-native-screenshot');
            
            if (!screenshotResult.success || !screenshotResult.data) {
                console.error('Failed to capture desktop screenshot:', screenshotResult.error);
                if (buddy.setStatus) {
                    buddy.setStatus('Failed to capture screen');
                }
                return { success: false, error: 'Failed to capture desktop screenshot' };
            }
            
            const screenshotData = screenshotResult.data;
            console.log('Desktop screenshot captured successfully, sending to AI...');
            
            // Send the screenshot to AI with a concise screen analysis prompt
            const sendTextMessage = window.buddy?.sendTextMessage || window.sendTextMessage;
            if (!sendTextMessage) {
                console.error('sendTextMessage function not available');
                return { success: false, error: 'Unable to send message to AI' };
            }
            
            const result = await sendTextMessage(
                '🔍 **SCREEN ANALYZER**: Analyze this desktop screenshot and provide concise, actionable insights.\n\n📋 **Format**:\n- 🎯 **What I see**: Brief summary\n- 💡 **Key Issue/Opportunity**: Main point\n- 🚀 **Solution**: Specific action to take\n- ⚡ **Next Step**: Immediate action\n\n💡 **Be concise, practical, and immediately actionable.**', 
                [screenshotData]
            );
            
            if (result.success) {
                console.log('Desktop screenshot analyzed and sent to AI');
                // Show a brief status message to the user
                if (buddy.setStatus) {
                    buddy.setStatus('Desktop screen analyzed and sent to AI');
                }
            } else {
                console.error('Failed to analyze and send desktop screenshot to AI:', result.error);
                if (buddy.setStatus) {
                    buddy.setStatus('Failed to analyze desktop screen');
                }
            }
            
            return result;
            
        } catch (error) {
            console.error('Error in captureDesktopAndSendScreenshot:', error);
            if (buddy.setStatus) {
                buddy.setStatus('Error capturing desktop screenshot');
            }
            return { success: false, error: error.message };
        }
    }

    // Test desktop capture functionality
    async testDesktopCapture() {
        console.log('Testing desktop capture functionality...');
        
        try {
            const result = await ipcRenderer.invoke('capture-native-screenshot');
            console.log('Desktop capture test result:', {
                success: result.success,
                hasData: !!result.data,
                dataSize: result.data ? `${Math.round(result.data.length / 1024)}KB` : 'N/A',
                error: result.error
            });
            
            // If successful, show the screenshot in a new window
            if (result.success && result.data) {
                await this.createImageWindow(result.data, 'Desktop Capture Test');
                console.log('✅ Desktop capture working correctly - screenshot displayed in window');
            }
            
            return result;
        } catch (error) {
            console.error('❌ Error testing desktop capture:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = WindowService;
