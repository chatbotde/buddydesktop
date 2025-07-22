/**
 * Audio Window Example
 * Demonstrates how to use the audio window and features
 */

const { 
    initializeAudioSystem, 
    quickStartAudio, 
    cleanupAudioSystem,
    toggleAudioRecording,
    getAudioStats,
    showAudioWindow,
    hideAudioWindow
} = require('./index.js');

/**
 * Example 1: Basic audio window setup
 */
async function basicExample() {
    console.log('=== Basic Audio Window Example ===');
    
    try {
        // Initialize the audio system with default settings
        const audioSystem = await initializeAudioSystem();
        
        console.log('Audio system initialized:', audioSystem.stats);
        
        // The window should now be visible in the top-right corner
        // Click it to start/stop recording
        
        return audioSystem;
    } catch (error) {
        console.error('Basic example failed:', error);
    }
}

/**
 * Example 2: Quick start with custom options
 */
async function quickStartExample() {
    console.log('=== Quick Start Example ===');
    
    try {
        // Quick start with custom window position
        const audioSystem = await quickStartAudio({
            windowOptions: {
                x: 100,
                y: 100,
                width: 60,
                height: 60
            }
        });
        
        console.log('Quick start completed:', audioSystem.stats);
        
        return audioSystem;
    } catch (error) {
        console.error('Quick start example failed:', error);
    }
}

/**
 * Example 3: Programmatic control
 */
async function programmaticExample() {
    console.log('=== Programmatic Control Example ===');
    
    try {
        // Initialize system
        const audioSystem = await initializeAudioSystem();
        
        // Start recording programmatically
        console.log('Starting recording...');
        await toggleAudioRecording();
        
        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Stop recording
        console.log('Stopping recording...');
        await toggleAudioRecording();
        
        // Show stats
        console.log('Final stats:', getAudioStats());
        
        return audioSystem;
    } catch (error) {
        console.error('Programmatic example failed:', error);
    }
}

/**
 * Example 4: Window visibility control
 */
async function visibilityExample() {
    console.log('=== Window Visibility Example ===');
    
    try {
        // Initialize system
        const audioSystem = await initializeAudioSystem();
        
        console.log('Window visible');
        
        // Hide window after 2 seconds
        setTimeout(() => {
            console.log('Hiding window...');
            hideAudioWindow();
        }, 2000);
        
        // Show window again after 4 seconds
        setTimeout(() => {
            console.log('Showing window...');
            showAudioWindow();
        }, 4000);
        
        return audioSystem;
    } catch (error) {
        console.error('Visibility example failed:', error);
    }
}

/**
 * Example 5: Custom positioned window
 */
async function customPositionExample() {
    console.log('=== Custom Position Example ===');
    
    try {
        // Initialize with custom position (center of screen)
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        
        const audioSystem = await initializeAudioSystem({
            windowOptions: {
                x: Math.floor(screenWidth / 2) - 25,
                y: Math.floor(screenHeight / 2) - 25
            }
        });
        
        console.log('Window positioned at center of screen');
        
        return audioSystem;
    } catch (error) {
        console.error('Custom position example failed:', error);
    }
}

/**
 * Cleanup example
 */
async function cleanupExample() {
    console.log('=== Cleanup Example ===');
    
    try {
        await cleanupAudioSystem();
        console.log('Audio system cleaned up successfully');
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('Running all audio window examples...\n');
    
    // Run basic example
    const system1 = await basicExample();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Cleanup before next example
    await cleanupAudioSystem();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run quick start example
    const system2 = await quickStartExample();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Cleanup before next example
    await cleanupAudioSystem();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run programmatic example
    const system3 = await programmaticExample();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Final cleanup
    await cleanupExample();
    
    console.log('\nAll examples completed!');
}

// Export examples for use
module.exports = {
    basicExample,
    quickStartExample,
    programmaticExample,
    visibilityExample,
    customPositionExample,
    cleanupExample,
    runAllExamples
};

// If run directly, execute basic example
if (require.main === module) {
    basicExample().catch(console.error);
}