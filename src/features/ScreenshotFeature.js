/**
 * ScreenshotFeature - Example feature implementation
 * Demonstrates how to create features using the new scalable architecture
 */
import appCore from '../core/AppCore.js';

class ScreenshotFeature {
    constructor() {
        this.enabled = false;
        this.autoCapture = false;
        this.maxScreenshots = 3;
        this.screenshots = [];
        this.eventBus = appCore.getService('eventBus');
    }

    /**
     * Initialize the feature
     */
    async initialize() {
        // Register feature with the feature manager
        appCore.registerFeature('screenshot', {
            name: 'Screenshot Capture',
            description: 'Capture and manage screenshots',
            version: '1.0.0',
            capabilities: ['screenshot', 'image-processing'],
            config: {
                autoCapture: false,
                maxScreenshots: 3,
                quality: 'high'
            },
            handlers: {
                capture: this.capture.bind(this),
                clear: this.clear.bind(this),
                toggle: this.toggle.bind(this)
            },
            hooks: {
                'before-capture': this.beforeCapture.bind(this),
                'after-capture': this.afterCapture.bind(this),
                'screenshot-added': this.onScreenshotAdded.bind(this)
            }
        });

        // Subscribe to events
        this.eventBus.on('screenshot:capture', this.handleCaptureEvent.bind(this));
        this.eventBus.on('screenshot:clear', this.handleClearEvent.bind(this));

        console.log('ScreenshotFeature initialized');
    }

    /**
     * Capture a screenshot
     * @param {Object} options - Capture options
     * @returns {Promise<string>} Base64 screenshot data
     */
    async capture(options = {}) {
        const { quality = 'high', format = 'jpeg' } = options;

        try {
            // Execute before-capture hooks
            await appCore.executeHook('before-capture', { quality, format });

            // Capture screenshot using existing functionality
            const screenshotData = await window.buddy.captureScreenshot();

            if (screenshotData) {
                // Add to internal storage
                this.screenshots.push({
                    id: Date.now().toString(),
                    data: screenshotData,
                    timestamp: Date.now(),
                    quality,
                    format
                });

                // Limit screenshots
                if (this.screenshots.length > this.maxScreenshots) {
                    this.screenshots.shift();
                }

                // Execute after-capture hooks
                await appCore.executeHook('after-capture', { 
                    screenshot: this.screenshots[this.screenshots.length - 1] 
                });

                // Emit event
                this.eventBus.emit('screenshot:captured', {
                    screenshot: this.screenshots[this.screenshots.length - 1],
                    total: this.screenshots.length
                });

                return screenshotData;
            }

        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            this.eventBus.emit('screenshot:error', { error: error.message });
            throw error;
        }
    }

    /**
     * Clear all screenshots
     */
    clear() {
        this.screenshots = [];
        this.eventBus.emit('screenshot:cleared', { count: 0 });
    }

    /**
     * Toggle auto-capture
     * @param {boolean} enabled - Whether to enable auto-capture
     */
    toggle(enabled) {
        this.autoCapture = enabled;
        this.eventBus.emit('screenshot:auto-capture-toggled', { enabled });
    }

    /**
     * Get all screenshots
     * @returns {Array} Array of screenshots
     */
    getScreenshots() {
        return [...this.screenshots];
    }

    /**
     * Remove a specific screenshot
     * @param {string} id - Screenshot ID
     */
    removeScreenshot(id) {
        const index = this.screenshots.findIndex(s => s.id === id);
        if (index !== -1) {
            this.screenshots.splice(index, 1);
            this.eventBus.emit('screenshot:removed', { id, remaining: this.screenshots.length });
        }
    }

    /**
     * Before capture hook
     * @param {Object} data - Hook data
     */
    async beforeCapture(data) {
        console.log('Before capture:', data);
        // Could add validation, permissions check, etc.
    }

    /**
     * After capture hook
     * @param {Object} data - Hook data
     */
    async afterCapture(data) {
        console.log('After capture:', data);
        // Could add processing, compression, etc.
    }

    /**
     * Screenshot added hook
     * @param {Object} data - Hook data
     */
    async onScreenshotAdded(data) {
        console.log('Screenshot added:', data);
    }

    /**
     * Handle capture event
     * @param {Object} data - Event data
     */
    async handleCaptureEvent(data) {
        await this.capture(data.options);
    }

    /**
     * Handle clear event
     * @param {Object} data - Event data
     */
    handleClearEvent(data) {
        this.clear();
    }

    /**
     * Get feature statistics
     * @returns {Object} Feature statistics
     */
    getStats() {
        return {
            enabled: this.enabled,
            autoCapture: this.autoCapture,
            screenshotCount: this.screenshots.length,
            maxScreenshots: this.maxScreenshots
        };
    }

    /**
     * Cleanup the feature
     */
    async cleanup() {
        this.screenshots = [];
        this.eventBus.off('screenshot:capture', this.handleCaptureEvent);
        this.eventBus.off('screenshot:clear', this.handleClearEvent);
        console.log('ScreenshotFeature cleaned up');
    }
}

export default ScreenshotFeature; 