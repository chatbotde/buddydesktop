/**
 * Audio Feature Module
 * Exports all audio-related components and utilities
 */

// Core audio components
const AudioFeature = require('./AudioFeature.js');
const { AudioWindow, audioWindow } = require('./AudioWindow.js');
const { AudioManager, audioManager } = require('./AudioManager.js');

// Convenience functions
const {
    createAudioWindow,
    showAudioWindow,
    hideAudioWindow,
    closeAudioWindow,
    getAudioWindow,
} = require('./AudioWindow.js');

const {
    initializeAudioManager,
    toggleAudioRecording,
    getAudioStats,
} = require('./AudioManager.js');

/**
 * Initialize the complete audio system
 * @param {Object} options - Initialization options
 * @returns {Promise<Object>} Initialized audio system components
 */
async function initializeAudioSystem(options = {}) {
    try {
        // Create and initialize audio feature
        const audioFeature = new AudioFeature();
        await audioFeature.initialize();

        // Initialize audio manager with the feature
        await initializeAudioManager(audioFeature);

        // Create audio window if requested
        let window = null;
        if (options.createWindow !== false) {
            window = await createAudioWindow(options.windowOptions);
        }

        console.log('Audio system initialized successfully');

        return {
            audioFeature,
            audioManager,
            audioWindow: window,
            stats: getAudioStats()
        };
    } catch (error) {
        console.error('Failed to initialize audio system:', error);
        throw error;
    }
}

/**
 * Quick start function for audio recording
 * @param {Object} options - Quick start options
 */
async function quickStartAudio(options = {}) {
    const system = await initializeAudioSystem(options);
    
    // Show window if created
    if (system.audioWindow) {
        showAudioWindow();
    }
    
    return system;
}

/**
 * Cleanup the entire audio system
 */
async function cleanupAudioSystem() {
    try {
        await audioManager.cleanup();
        console.log('Audio system cleaned up');
    } catch (error) {
        console.error('Failed to cleanup audio system:', error);
        throw error;
    }
}

// Export everything
module.exports = {
    // Core classes
    AudioFeature,
    AudioWindow,
    AudioManager,
    
    // Singleton instances
    audioWindow,
    audioManager,
    
    // Window functions
    createAudioWindow,
    showAudioWindow,
    hideAudioWindow,
    closeAudioWindow,
    getAudioWindow,
    
    // Manager functions
    initializeAudioManager,
    toggleAudioRecording,
    getAudioStats,
    
    // System functions
    initializeAudioSystem,
    quickStartAudio,
    cleanupAudioSystem,
    
    // Constants
    AUDIO_WINDOW_SIZE: { width: 280, height: 60 },
    AUDIO_WINDOW_SIZE_EXPANDED: { width: 280, height: 300 },
    DEFAULT_SAMPLE_RATE: 24000,
    DEFAULT_CHANNELS: 1,
};