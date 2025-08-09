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
}

module.exports = WindowService;
