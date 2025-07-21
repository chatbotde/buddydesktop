const { BrowserWindow } = require('electron');

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.defaultOptions = {
            width: 800,
            height: 600,
            frame: false,
            transparent: true,
            hasShadow: false,
            alwaysOnTop: true,
            skipTaskbar: true,
            hiddenInMissionControl: true,
            roundedCorners: true,
            vibrancy: 'ultra-dark',
            resizable: true,
            minimizable: true,
            maximizable: true,
            closable: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                backgroundThrottling: false,
                webSecurity: true,
                allowRunningInsecureContent: false,
                spellcheck: true,
            },
            backgroundColor: '#00000000',
            titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
        };
    }

    /**
     * Create a new window with consistent properties
     * @param {Object} options - Window options to override defaults
     * @param {string} windowId - Unique identifier for the window
     * @returns {BrowserWindow} - The created window instance
     */
    createWindow(options = {}, windowId = null) {
        const windowOptions = { ...this.defaultOptions, ...options };
        const newWindow = new BrowserWindow(windowOptions);

        // Apply consistent window properties
        this.applyConsistentProperties(newWindow);
        
        // Enable drag functionality
        this.enableDragFunctionality(newWindow);

        // Store window reference if ID provided
        if (windowId) {
            this.windows.set(windowId, newWindow);
            
            // Clean up reference when window is closed
            newWindow.on('closed', () => {
                this.windows.delete(windowId);
            });
        }

        return newWindow;
    }

    /**
     * Apply consistent properties to window
     * @param {BrowserWindow} window - The window to apply properties to
     */
    applyConsistentProperties(window) {
        window.setContentProtection(true);
        window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

        if (process.platform === 'win32') {
            window.setAlwaysOnTop(true, 'screen-saver', 1);
        }
    }

    /**
     * Enable drag functionality for frameless windows
     * @param {BrowserWindow} window - The window to enable dragging for
     */
    enableDragFunctionality(window) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        // Handle drag start
        window.webContents.on('before-input-event', (event, input) => {
            if (input.type === 'mouseDown' && input.button === 'left') {
                const bounds = window.getBounds();
                const cursorPosition = require('electron').screen.getCursorScreenPoint();
                
                dragOffset.x = cursorPosition.x - bounds.x;
                dragOffset.y = cursorPosition.y - bounds.y;
                isDragging = true;
            }
        });

        // Handle drag end
        window.webContents.on('before-input-event', (event, input) => {
            if (input.type === 'mouseUp' && input.button === 'left') {
                isDragging = false;
            }
        });

        // Alternative drag implementation using IPC
        window.webContents.on('ipc-message', (event, channel, data) => {
            if (channel === 'window-drag-start') {
                isDragging = true;
                dragOffset = data;
            } else if (channel === 'window-drag-move' && isDragging) {
                const { x, y } = data;
                window.setPosition(x - dragOffset.x, y - dragOffset.y);
            } else if (channel === 'window-drag-end') {
                isDragging = false;
            }
        });
    }

    /**
     * Get window by ID
     * @param {string} windowId - The window identifier
     * @returns {BrowserWindow|null} - The window instance or null
     */
    getWindow(windowId) {
        return this.windows.get(windowId) || null;
    }

    /**
     * Close window by ID
     * @param {string} windowId - The window identifier
     */
    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window && !window.isDestroyed()) {
            window.close();
        }
    }

    /**
     * Close all managed windows
     */
    closeAllWindows() {
        this.windows.forEach((window, id) => {
            if (!window.isDestroyed()) {
                window.close();
            }
        });
        this.windows.clear();
    }

    /**
     * Create preset window configurations
     */
    presets = {
        // Small overlay window
        overlay: {
            width: 400,
            height: 300,
            alwaysOnTop: true,
            skipTaskbar: true,
        },

        // Main application window
        main: {
            width: 1200,
            height: 800,
            frame: true,
            alwaysOnTop: false,
            skipTaskbar: false,
            center: true,
        },

        // Dialog window
        dialog: {
            width: 500,
            height: 400,
            modal: true,
            resizable: false,
            alwaysOnTop: true,
        },

        // Floating widget
        widget: {
            width: 300,
            height: 200,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            skipTaskbar: true,
        },

        // Full screen window
        fullscreen: {
            fullscreen: true,
            frame: false,
        }
    };

    /**
     * Create window using preset configuration
     * @param {string} presetName - Name of the preset
     * @param {Object} overrides - Options to override preset defaults
     * @param {string} windowId - Unique identifier for the window
     * @returns {BrowserWindow} - The created window instance
     */
    createPresetWindow(presetName, overrides = {}, windowId = null) {
        const preset = this.presets[presetName];
        if (!preset) {
            throw new Error(`Unknown preset: ${presetName}`);
        }

        const options = { ...preset, ...overrides };
        return this.createWindow(options, windowId);
    }

    /**
     * Update default options
     * @param {Object} newDefaults - New default options to merge
     */
    updateDefaults(newDefaults) {
        this.defaultOptions = { ...this.defaultOptions, ...newDefaults };
    }
}

// Create singleton instance
const windowManager = new WindowManager();

module.exports = {
    WindowManager,
    windowManager,
    
    // Convenience functions
    createWindow: (options, windowId) => windowManager.createWindow(options, windowId),
    createPresetWindow: (preset, overrides, windowId) => windowManager.createPresetWindow(preset, overrides, windowId),
    getWindow: (windowId) => windowManager.getWindow(windowId),
    closeWindow: (windowId) => windowManager.closeWindow(windowId),
    closeAllWindows: () => windowManager.closeAllWindows(),
};