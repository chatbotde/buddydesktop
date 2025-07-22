/**
 * AudioWindow - Dedicated window for audio features
 * Creates a rectangular window with rounded corners for audio controls and transcription
 */
const { windowManager } = require('../../window.js');
const path = require('path');
const { ipcMain } = require('electron');

class AudioWindow {
    constructor() {
        this.window = null;
        this.windowId = 'audio-window';
        this.isVisible = false;
        this.isExpanded = false;
        this.transcriptionText = '';
    }

    /**
     * Create and show the audio window
     * @param {Object} options - Window creation options
     */
    async create(options = {}) {
        if (this.window && !this.window.isDestroyed()) {
            this.show();
            return this.window;
        }

        const audioWindowOptions = {
            width: 280,
            height: 60,
            frame: false,
            transparent: true,
            hasShadow: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            hiddenInMissionControl: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            closable: true,
            roundedCorners: true,
            vibrancy: 'ultra-dark',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                backgroundThrottling: false,
                webSecurity: true,
                allowRunningInsecureContent: false,
            },
            backgroundColor: '#00000000',
            titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
            ...options
        };

        // Create the window using WindowManager
        this.window = windowManager.createWindow(audioWindowOptions, this.windowId);

        // Load the audio window HTML
        const htmlPath = path.join(__dirname, 'audio-window.html');
        await this.window.loadFile(htmlPath);

        // Set up window event handlers
        this.setupEventHandlers();

        // Position window (default to center-right of screen)
        this.positionWindow();

        this.isVisible = true;
        console.log('Audio window created');

        return this.window;
    }

    /**
     * Set up window event handlers
     */
    setupEventHandlers() {
        if (!this.window) return;

        // Handle window closed
        this.window.on('closed', () => {
            this.window = null;
            this.isVisible = false;
            console.log('Audio window closed');
        });

        // Handle window ready
        this.window.webContents.once('dom-ready', () => {
            console.log('Audio window DOM ready');
        });

        // Set up IPC handlers
        this.setupIpcHandlers();

        // Prevent navigation
        this.window.webContents.on('will-navigate', (event) => {
            event.preventDefault();
        });

        // Handle new window requests
        this.window.webContents.setWindowOpenHandler(() => {
            return { action: 'deny' };
        });
    }

    /**
     * Set up IPC handlers for communication with renderer
     */
    setupIpcHandlers() {
        // Handle start recording
        ipcMain.on('audio-window-start-recording', () => {
            this.startRecording();
        });

        // Handle stop recording
        ipcMain.on('audio-window-stop-recording', () => {
            this.stopRecording();
        });

        // Handle window resize
        ipcMain.on('audio-window-resize', (event, data) => {
            this.handleWindowResize(data);
        });

        // Handle clear transcription
        ipcMain.on('audio-window-clear-transcription', () => {
            this.clearTranscription();
        });

        // Handle window drag events
        ipcMain.on('window-drag-start', (event, offset) => {
            // Handled by WindowManager
        });

        ipcMain.on('window-drag-move', (event, position) => {
            // Handled by WindowManager
        });

        ipcMain.on('window-drag-end', () => {
            // Handled by WindowManager
        });
    }

    /**
     * Handle IPC messages from the renderer process
     * @param {string} channel - IPC channel
     * @param {any} data - Message data
     */
    handleIpcMessage(channel, data) {
        switch (channel) {
            case 'audio-window-toggle-recording':
                this.toggleRecording();
                break;
            case 'audio-window-close':
                this.close();
                break;
            case 'audio-window-minimize':
                this.minimize();
                break;
            default:
                console.log('Unknown IPC message:', channel, data);
        }
    }
    
    /**
     * Handle window resize based on expanded state
     * @param {Object} data - Resize data
     */
    handleWindowResize(data) {
        if (!this.window || this.window.isDestroyed()) return;
        
        this.isExpanded = data.expanded;
        
        if (this.isExpanded) {
            this.window.setSize(280, 300);
        } else {
            this.window.setSize(280, 60);
        }
    }

    /**
     * Position the window on screen
     * @param {Object} position - Position options
     */
    positionWindow(position = {}) {
        if (!this.window) return;

        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

        const x = position.x ?? screenWidth - 70; // 20px from right edge
        const y = position.y ?? 20; // 20px from top

        this.window.setPosition(x, y);
    }

    /**
     * Show the window
     */
    show() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.show();
            this.window.focus();
            this.isVisible = true;
        }
    }

    /**
     * Hide the window
     */
    hide() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.hide();
            this.isVisible = false;
        }
    }

    /**
     * Close the window
     */
    close() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.close();
        }
    }

    /**
     * Minimize the window
     */
    minimize() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.minimize();
        }
    }

    /**
     * Start recording audio
     */
    async startRecording() {
        try {
            // Here you would implement the actual audio recording logic
            // For now, we'll just update the UI state
            
            if (this.window && !this.window.isDestroyed()) {
                this.window.webContents.send('update-recording-state', { isRecording: true });
            }
            
            // Simulate transcription updates (in a real implementation, this would come from speech recognition)
            this.startTranscriptionSimulation();
            
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }
    
    /**
     * Stop recording audio
     */
    async stopRecording() {
        try {
            // Here you would implement the actual audio recording stop logic
            
            if (this.window && !this.window.isDestroyed()) {
                this.window.webContents.send('update-recording-state', { isRecording: false });
            }
            
            // Stop transcription simulation
            this.stopTranscriptionSimulation();
            
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    }
    
    /**
     * Toggle recording state
     */
    async toggleRecording() {
        try {
            // Send message to renderer to handle recording toggle
            if (this.window && !this.window.isDestroyed()) {
                this.window.webContents.send('toggle-recording-state');
            }
        } catch (error) {
            console.error('Failed to toggle recording:', error);
        }
    }

    /**
     * Update window appearance based on recording state
     * @param {boolean} isRecording - Recording state
     */
    updateRecordingState(isRecording) {
        if (this.window && !this.window.isDestroyed()) {
            this.window.webContents.send('update-recording-state', { isRecording });
        }
    }
    
    /**
     * Simulate transcription updates (for demo purposes)
     * In a real implementation, this would be replaced with actual speech recognition
     */
    startTranscriptionSimulation() {
        this.transcriptionInterval = setInterval(() => {
            const phrases = [
                "Hello, I'm testing the audio transcription.",
                "This is a demonstration of the speech-to-text feature.",
                "The audio window now has a scrollable transcription area.",
                "You can see the text appear as you speak.",
                "The window automatically expands to show the transcription.",
                "You can clear the transcription using the clear button.",
                "When you're done recording, press the stop button."
            ];
            
            // Add a random phrase to the transcription
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            this.transcriptionText += this.transcriptionText ? " " + randomPhrase : randomPhrase;
            
            // Send update to renderer
            if (this.window && !this.window.isDestroyed()) {
                this.window.webContents.send('transcription-update', { text: this.transcriptionText });
            }
        }, 2000); // Update every 2 seconds
    }
    
    /**
     * Stop transcription simulation
     */
    stopTranscriptionSimulation() {
        if (this.transcriptionInterval) {
            clearInterval(this.transcriptionInterval);
            this.transcriptionInterval = null;
        }
    }
    
    /**
     * Clear transcription text
     */
    clearTranscription() {
        this.transcriptionText = '';
    }

    /**
     * Set window opacity
     * @param {number} opacity - Opacity value (0-1)
     */
    setOpacity(opacity) {
        if (this.window && !this.window.isDestroyed()) {
            this.window.setOpacity(opacity);
        }
    }

    /**
     * Get window instance
     * @returns {BrowserWindow|null} Window instance
     */
    getWindow() {
        return this.window;
    }

    /**
     * Check if window is visible
     * @returns {boolean} Visibility state
     */
    isWindowVisible() {
        return this.isVisible && this.window && !this.window.isDestroyed() && this.window.isVisible();
    }

    /**
     * Destroy the window
     */
    destroy() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.destroy();
        }
        this.window = null;
        this.isVisible = false;
    }
}

// Create singleton instance
const audioWindow = new AudioWindow();

module.exports = {
    AudioWindow,
    audioWindow,
    
    // Convenience functions
    createAudioWindow: (options) => audioWindow.create(options),
    showAudioWindow: () => audioWindow.show(),
    hideAudioWindow: () => audioWindow.hide(),
    closeAudioWindow: () => audioWindow.close(),
    getAudioWindow: () => audioWindow.getWindow(),
};