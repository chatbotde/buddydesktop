/**
 * AudioManager - Coordinates audio features and window
 * Manages the integration between AudioFeature and AudioWindow
 */
const { audioWindow } = require('./AudioWindow.js');

class AudioManager {
    constructor() {
        this.audioFeature = null;
        this.isInitialized = false;
        this.isRecording = false;
        this.eventListeners = new Map();
    }

    /**
     * Initialize the audio manager
     * @param {AudioFeature} audioFeature - Audio feature instance
     */
    async initialize(audioFeature) {
        if (this.isInitialized) {
            console.warn('AudioManager already initialized');
            return;
        }

        this.audioFeature = audioFeature;
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('AudioManager initialized');
    }

    /**
     * Set up event listeners for audio events
     */
    setupEventListeners() {
        if (!this.audioFeature || !this.audioFeature.eventBus) {
            console.error('AudioFeature or EventBus not available');
            return;
        }

        const eventBus = this.audioFeature.eventBus;

        // Listen for audio events
        const listeners = {
            'audio:started': this.handleAudioStarted.bind(this),
            'audio:stopped': this.handleAudioStopped.bind(this),
            'audio:paused': this.handleAudioPaused.bind(this),
            'audio:resumed': this.handleAudioResumed.bind(this),
            'audio:error': this.handleAudioError.bind(this),
            'audio:data': this.handleAudioData.bind(this)
        };

        // Register listeners
        Object.entries(listeners).forEach(([event, handler]) => {
            eventBus.on(event, handler);
            this.eventListeners.set(event, handler);
        });
    }

    /**
     * Create and show the audio window
     * @param {Object} options - Window options
     */
    async createWindow(options = {}) {
        try {
            const window = await audioWindow.create(options);
            
            // Set up IPC handlers for the window
            this.setupWindowIpcHandlers(window);
            
            return window;
        } catch (error) {
            console.error('Failed to create audio window:', error);
            throw error;
        }
    }

    /**
     * Set up IPC handlers for the audio window
     * @param {BrowserWindow} window - Audio window instance
     */
    setupWindowIpcHandlers(window) {
        if (!window || window.isDestroyed()) return;

        // Handle recording toggle from window
        window.webContents.on('ipc-message', async (event, channel, data) => {
            if (channel === 'audio-window-toggle-recording') {
                await this.toggleRecording();
            }
        });
    }

    /**
     * Toggle recording state
     */
    async toggleRecording() {
        try {
            if (this.isRecording) {
                await this.stopRecording();
            } else {
                await this.startRecording();
            }
        } catch (error) {
            console.error('Failed to toggle recording:', error);
            this.handleAudioError({ error: error.message });
        }
    }

    /**
     * Start audio recording
     * @param {Object} options - Recording options
     */
    async startRecording(options = {}) {
        if (!this.audioFeature) {
            throw new Error('AudioFeature not initialized');
        }

        try {
            await this.audioFeature.start(options);
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    }

    /**
     * Stop audio recording
     */
    async stopRecording() {
        if (!this.audioFeature) {
            throw new Error('AudioFeature not initialized');
        }

        try {
            await this.audioFeature.stop();
        } catch (error) {
            console.error('Failed to stop recording:', error);
            throw error;
        }
    }

    /**
     * Pause audio recording
     */
    async pauseRecording() {
        if (!this.audioFeature) {
            throw new Error('AudioFeature not initialized');
        }

        try {
            await this.audioFeature.pause();
        } catch (error) {
            console.error('Failed to pause recording:', error);
            throw error;
        }
    }

    /**
     * Resume audio recording
     */
    async resumeRecording() {
        if (!this.audioFeature) {
            throw new Error('AudioFeature not initialized');
        }

        try {
            await this.audioFeature.resume();
        } catch (error) {
            console.error('Failed to resume recording:', error);
            throw error;
        }
    }

    /**
     * Handle audio started event
     * @param {Object} data - Event data
     */
    handleAudioStarted(data) {
        this.isRecording = true;
        audioWindow.updateRecordingState(true);
        console.log('Audio recording started:', data);
    }

    /**
     * Handle audio stopped event
     * @param {Object} data - Event data
     */
    handleAudioStopped(data) {
        this.isRecording = false;
        audioWindow.updateRecordingState(false);
        console.log('Audio recording stopped:', data);
    }

    /**
     * Handle audio paused event
     * @param {Object} data - Event data
     */
    handleAudioPaused(data) {
        // Could show paused state in window
        console.log('Audio recording paused:', data);
    }

    /**
     * Handle audio resumed event
     * @param {Object} data - Event data
     */
    handleAudioResumed(data) {
        // Could show resumed state in window
        console.log('Audio recording resumed:', data);
    }

    /**
     * Handle audio error event
     * @param {Object} data - Event data
     */
    handleAudioError(data) {
        console.error('Audio error:', data.error);
        
        // Reset recording state on error
        this.isRecording = false;
        audioWindow.updateRecordingState(false);
        
        // Could show error state in window
        // For now, just log the error
    }

    /**
     * Handle audio data event
     * @param {Object} data - Event data
     */
    handleAudioData(data) {
        // In a real implementation, this would process audio data
        // and potentially update transcription based on speech recognition results
        
        // For now, we'll let the AudioWindow handle simulated transcription
        // console.log('Audio data received:', data.data.length, 'samples');
        
        // If there's transcription data in the event, update the window
        if (data.transcription) {
            this.updateTranscription(data.transcription);
        }
    }
    
    /**
     * Update transcription text in the audio window
     * @param {string} text - Transcription text
     */
    updateTranscription(text) {
        if (audioWindow.getWindow() && !audioWindow.getWindow().isDestroyed()) {
            audioWindow.getWindow().webContents.send('transcription-update', { text });
        }
    }

    /**
     * Show the audio window
     */
    showWindow() {
        audioWindow.show();
    }

    /**
     * Hide the audio window
     */
    hideWindow() {
        audioWindow.hide();
    }

    /**
     * Close the audio window
     */
    closeWindow() {
        audioWindow.close();
    }

    /**
     * Get audio statistics
     * @returns {Object} Audio statistics
     */
    getStats() {
        const audioStats = this.audioFeature ? this.audioFeature.getStats() : {};
        
        return {
            ...audioStats,
            isRecording: this.isRecording,
            windowVisible: audioWindow.isWindowVisible(),
            managerInitialized: this.isInitialized
        };
    }

    /**
     * Update window position
     * @param {Object} position - Position coordinates
     */
    updateWindowPosition(position) {
        audioWindow.positionWindow(position);
    }

    /**
     * Set window opacity
     * @param {number} opacity - Opacity value (0-1)
     */
    setWindowOpacity(opacity) {
        audioWindow.setOpacity(opacity);
    }

    /**
     * Cleanup the audio manager
     */
    async cleanup() {
        // Stop recording if active
        if (this.isRecording) {
            await this.stopRecording();
        }

        // Remove event listeners
        if (this.audioFeature && this.audioFeature.eventBus) {
            const eventBus = this.audioFeature.eventBus;
            
            this.eventListeners.forEach((handler, event) => {
                eventBus.off(event, handler);
            });
        }

        // Close window
        audioWindow.destroy();

        // Reset state
        this.eventListeners.clear();
        this.audioFeature = null;
        this.isInitialized = false;
        this.isRecording = false;

        console.log('AudioManager cleaned up');
    }
}

// Create singleton instance
const audioManager = new AudioManager();

module.exports = {
    AudioManager,
    audioManager,
    
    // Convenience functions
    initializeAudioManager: (audioFeature) => audioManager.initialize(audioFeature),
    createAudioWindow: (options) => audioManager.createWindow(options),
    toggleAudioRecording: () => audioManager.toggleRecording(),
    getAudioStats: () => audioManager.getStats(),
};