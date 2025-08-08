const { BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.windowThemes = new Map();
        this.windowOpacities = new Map(); // Store opacity values for each window
        this.defaultOptions = {
            width: 800,
            height: 600,
            icon: path.join(__dirname, '../icons/icon.png'), // Custom app icon for all windows
            title: '', // Empty title to avoid showing anything
            frame: false, // Completely frameless
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
            titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined, // Hide title bar completely
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                backgroundThrottling: false,
                webSecurity: true,
                allowRunningInsecureContent: false,
                spellcheck: true,
            },
            backgroundColor: '#00000000',
        };

        // Load theme configuration
        try {
            // Try to dynamically import the theme config
            this.loadThemeConfig();
        } catch (error) {
            console.error('Failed to load theme configuration:', error);
            // Fallback to default themes if import fails
            this.themeConfig = {
                themes: {
                    standard: {
                        name: 'Standard',
                        windowOptions: {
                            transparent: true,
                            backgroundColor: '#00000000',
                            vibrancy: 'ultra-dark',
                        },
                    },
                },
                defaults: {
                    window: 'standard',
                },
            };
        }
    }

    /**
     * Load theme configuration from theme-config.js
     */
    loadThemeConfig() {
        // For CommonJS environment, we need to use require
        try {
            // First try to load from the components directory
            const themeConfigPath = path.join(__dirname, 'components', 'ui', 'theme-config.js');
            if (fs.existsSync(themeConfigPath)) {
                this.themeConfig = require('./components/ui/theme-config.js').ThemeConfig;
            } else {
                // Fallback to default themes
                this.themeConfig = {
                    themes: {
                        standard: {
                            name: 'Standard',
                            windowOptions: {
                                transparent: true,
                                backgroundColor: '#00000000',
                                vibrancy: 'ultra-dark',
                            },
                        },
                    },
                    defaults: {
                        window: 'standard',
                    },
                };
            }
        } catch (error) {
            console.error('Failed to load theme configuration:', error);
            // Fallback to default themes
            this.themeConfig = {
                themes: {
                    standard: {
                        name: 'Standard',
                        windowOptions: {
                            transparent: true,
                            backgroundColor: '#00000000',
                            vibrancy: 'ultra-dark',
                        },
                    },
                },
                defaults: {
                    window: 'standard',
                },
            };
        }
    }

    /**
     * Create a new window with consistent properties
     * @param {Object} options - Window options to override defaults
     * @param {string} windowId - Unique identifier for the window
     * @param {string} theme - Theme name to apply (optional)
     * @returns {BrowserWindow} - The created window instance
     */
    createWindow(options = {}, windowId = null, theme = null) {
        // Get theme options if a theme is specified
        const themeOptions = theme ? this.getThemeOptions(theme) : {};

        // Merge options with priority: defaults < theme < explicit options
        const windowOptions = { ...this.defaultOptions, ...themeOptions, ...options };
        const newWindow = new BrowserWindow(windowOptions);

        // Apply consistent window properties
        this.applyConsistentProperties(newWindow);

        // Enable drag functionality
        this.enableDragFunctionality(newWindow);

        // Store window reference and theme if ID provided
        if (windowId) {
            this.windows.set(windowId, newWindow);

            // Store the current theme
            if (theme) {
                this.windowThemes.set(windowId, theme);
            } else {
                // Use default theme if none specified
                this.windowThemes.set(windowId, this.themeConfig.defaults.window || 'standard');
            }

            // Clean up references when window is closed
            newWindow.on('closed', () => {
                this.windows.delete(windowId);
                this.windowThemes.delete(windowId);
                this.windowOpacities.delete(windowId);
            });
        }

        return newWindow;
    }

    /**
     * Get window options for a specific theme
     * @param {string} themeName - Name of the theme
     * @returns {Object} - Theme-specific window options
     */
    getThemeOptions(themeName) {
        // Get theme from config
        const theme = this.themeConfig.themes[themeName];

        // Return theme options if found, otherwise empty object
        return theme && theme.windowOptions ? theme.windowOptions : {};
    }

    /**
     * Get available window themes
     * @returns {Object} - Available window themes
     */
    getAvailableThemes() {
        // Filter themes suitable for windows
        const windowThemes = {};

        if (this.themeConfig && this.themeConfig.themes) {
            Object.entries(this.themeConfig.themes).forEach(([key, theme]) => {
                if (theme.suitableFor && theme.suitableFor.includes('window')) {
                    windowThemes[key] = {
                        name: theme.name,
                        description: theme.description,
                        category: theme.category,
                    };
                }
            });
        }

        return windowThemes;
    }

    /**
     * Change theme for an existing window
     * @param {string} windowId - ID of the window to update
     * @param {string} themeName - Name of the theme to apply
     * @returns {boolean} - Success status
     */
    changeWindowTheme(windowId, themeName) {
        const window = this.windows.get(windowId);
        if (!window || window.isDestroyed()) {
            return false;
        }

        // Get theme options
        const themeOptions = this.getThemeOptions(themeName);
        if (!themeOptions) {
            return false;
        }

        // Apply theme options to the window
        if (themeOptions.transparent !== undefined) {
            window.setTransparent(themeOptions.transparent);
        }

        if (themeOptions.backgroundColor) {
            window.setBackgroundColor(themeOptions.backgroundColor);
        }

        if (themeOptions.vibrancy !== undefined) {
            if (themeOptions.vibrancy === null) {
                window.setVibrancy(null);
            } else {
                window.setVibrancy(themeOptions.vibrancy);
            }
        }

        // Update stored theme
        this.windowThemes.set(windowId, themeName);

        // Notify the window content about theme change
        window.webContents.send('window-theme-changed', {
            theme: themeName,
            options: themeOptions,
        });

        return true;
    }

    /**
     * Get current theme for a window
     * @param {string} windowId - ID of the window
     * @returns {string|null} - Current theme name or null
     */
    getWindowTheme(windowId) {
        return this.windowThemes.get(windowId) || null;
    }

    /**
     * Set window opacity
     * @param {string} windowId - ID of the window to update
     * @param {number} opacity - Opacity value between 0.1 and 1.0
     * @returns {boolean} - Success status
     */
    setWindowOpacity(windowId, opacity) {
        const window = this.windows.get(windowId);
        if (!window || window.isDestroyed()) {
            return false;
        }

        // Clamp opacity between 0.1 and 1.0
        const clampedOpacity = Math.max(0.1, Math.min(1.0, opacity));
        
        try {
            window.setOpacity(clampedOpacity);
            this.windowOpacities.set(windowId, clampedOpacity);
            
            // Notify the window content about opacity change
            window.webContents.send('window-opacity-changed', {
                opacity: clampedOpacity,
            });
            
            return true;
        } catch (error) {
            console.error('Failed to set window opacity:', error);
            return false;
        }
    }

    /**
     * Get current opacity for a window
     * @param {string} windowId - ID of the window
     * @returns {number} - Current opacity value (default 1.0)
     */
    getWindowOpacity(windowId) {
        return this.windowOpacities.get(windowId) || 1.0;
    }

    /**
     * Adjust window opacity by delta (for scroll wheel)
     * @param {string} windowId - ID of the window to update
     * @param {number} delta - Change in opacity (-0.1 to 0.1)
     * @returns {boolean} - Success status
     */
    adjustWindowOpacity(windowId, delta) {
        const currentOpacity = this.getWindowOpacity(windowId);
        const newOpacity = currentOpacity + delta;
        return this.setWindowOpacity(windowId, newOpacity);
    }

    /**
     * Set simple window theme (black, white, or transparent)
     * @param {string} windowId - ID of the window to update
     * @param {string} theme - Theme name ('black', 'white', or 'transparent')
     * @returns {boolean} - Success status
     */
    setSimpleWindowTheme(windowId, theme) {
        console.log('WindowManager: Looking for window with ID:', windowId);
        console.log('Available window IDs:', Array.from(this.windows.keys()));
        
        const window = this.windows.get(windowId);
        if (!window || window.isDestroyed()) {
            console.error('Window not found or destroyed:', windowId);
            return false;
        }
        
        console.log('Found window, applying theme:', theme);

        try {
            switch (theme) {
                case 'black':
                    // For solid black background
                    window.setBackgroundColor('#000000');
                    if (window.setVibrancy) {
                        window.setVibrancy(null);
                    }
                    console.log('Applied black theme');
                    break;
                case 'transparent':
                default:
                    // For transparent background with blur
                    window.setBackgroundColor('#00000000');
                    if (window.setVibrancy && process.platform === 'darwin') {
                        window.setVibrancy('ultra-dark');
                    }
                    console.log('Applied transparent theme');
                    break;
            }

            // Force a repaint to ensure the theme is applied
            setTimeout(() => {
                const bounds = window.getBounds();
                window.setBounds({
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                });
            }, 10);

            // Notify the window content about theme change
            window.webContents.send('simple-window-theme-changed', {
                theme: theme
            });
            
                        // Apply theme-specific CSS to the window content
            window.webContents.executeJavaScript(`
                document.documentElement.setAttribute('data-window-theme', '${theme}');
                
                // Apply theme-specific styles
                if ('${theme}' === 'black') {
                    // Enhanced dark theme
                    document.documentElement.style.setProperty('--text-color', '#e5e5e7');
                    document.documentElement.style.setProperty('--header-background', 'rgba(0, 0, 0, 0.9)');
                    document.documentElement.style.setProperty('--main-content-background', 'rgba(0, 0, 0, 0.95)');
                    document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
                    document.documentElement.style.setProperty('--button-background', 'rgba(255, 255, 255, 0.1)');
                    document.documentElement.style.setProperty('--button-border', 'rgba(255, 255, 255, 0.2)');
                    document.documentElement.style.setProperty('--input-background', 'rgba(0, 0, 0, 0.6)');
                    document.documentElement.style.setProperty('--placeholder-color', 'rgba(255, 255, 255, 0.4)');
                    document.documentElement.style.setProperty('--scrollbar-thumb', 'rgba(255, 255, 255, 0.3)');
                    document.documentElement.style.setProperty('--hover-background', 'rgba(255, 255, 255, 0.1)');
                } else {
                    // Transparent theme - restore original colors
                    document.documentElement.style.setProperty('--text-color', '#e5e5e7');
                    document.documentElement.style.setProperty('--header-background', 'rgba(0, 0, 0, 0.8)');
                    document.documentElement.style.setProperty('--main-content-background', 'rgba(0, 0, 0, 0.8)');
                    document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
                    document.documentElement.style.setProperty('--button-background', 'rgba(0, 0, 0, 0.5)');
                    document.documentElement.style.setProperty('--button-border', 'rgba(255, 255, 255, 0.1)');
                    document.documentElement.style.setProperty('--input-background', 'rgba(0, 0, 0, 0.3)');
                    document.documentElement.style.setProperty('--placeholder-color', 'rgba(255, 255, 255, 0.4)');
                    document.documentElement.style.setProperty('--scrollbar-thumb', 'rgba(255, 255, 255, 0.2)');
                    document.documentElement.style.setProperty('--hover-background', 'rgba(255, 255, 255, 0.1)');
                }
            `).catch(err => console.error('Error applying theme styles:', err));

            return true;
        } catch (error) {
            console.error('Failed to set simple window theme:', error);
            return false;
        }
    }

    /**
     * Get available simple themes
     * @returns {Object} - Available simple themes
     */
    getSimpleThemes() {
        return {
            transparent: {
                name: 'Transparent',
                description: 'See-through window with blur effects'
            },
            black: {
                name: 'Black',
                description: 'Solid black background'
            }
        };
    }

    /**
     * Apply consistent properties to window
     * @param {BrowserWindow} window - The window to apply properties to
     */
    applyConsistentProperties(window) {
        // Enable content protection to prevent screen capture
        window.setContentProtection(true);
        window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

        if (process.platform === 'win32') {
            window.setAlwaysOnTop(true, 'screen-saver', 1);
            
            // Additional Windows-specific privacy settings
            try {
                const { exec } = require('child_process');
                const windowId = window.getNativeWindowHandle();
                if (windowId) {
                    // Set WDA_EXCLUDEFROMCAPTURE flag to prevent screen capture
                    // This requires Windows 10 version 2004 or later
                    const command = `powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\"user32.dll\")] public static extern bool SetWindowDisplayAffinity(IntPtr hwnd, uint dwAffinity); }'; try { [Win32]::SetWindowDisplayAffinity([IntPtr]${windowId.readBigUInt64LE(0)}, 0x11) } catch { Write-Host 'Display affinity not supported on this system' }"`;
                    exec(command, (error) => {
                        if (error) {
                            console.log('Windows display affinity setting not available on this system');
                        } else {
                            console.log('Window content protection enhanced for Windows');
                        }
                    });
                }
            } catch (error) {
                console.log('Could not apply Windows-specific privacy settings:', error.message);
            }
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
        },
    };

    /**
     * Create window using preset configuration
     * @param {string} presetName - Name of the preset
     * @param {Object} overrides - Options to override preset defaults
     * @param {string} windowId - Unique identifier for the window
     * @param {string} theme - Theme name to apply (optional)
     * @returns {BrowserWindow} - The created window instance
     */
    createPresetWindow(presetName, overrides = {}, windowId = null, theme = null) {
        const preset = this.presets[presetName];
        if (!preset) {
            throw new Error(`Unknown preset: ${presetName}`);
        }

        const options = { ...preset, ...overrides };
        return this.createWindow(options, windowId, theme);
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

// Set up IPC handlers for window theme changes
ipcMain.on('change-window-theme', (event, data) => {
    const { windowId, theme } = data;
    if (windowId && theme) {
        windowManager.changeWindowTheme(windowId, theme);
    }
});

// Handle requests for available window themes
ipcMain.handle('get-window-themes', event => {
    try {
        const themes = windowManager.getAvailableThemes();

        // Get the window ID from the sender
        const webContents = event.sender;
        const window = BrowserWindow.fromWebContents(webContents);

        let currentTheme = 'standard';
        if (window) {
            // Find the window ID in our managed windows
            for (const [id, managedWindow] of windowManager.windows.entries()) {
                if (managedWindow === window) {
                    currentTheme = windowManager.getWindowTheme(id) || 'standard';
                    break;
                }
            }
        }

        return {
            success: true,
            themes: themes,
            currentTheme: currentTheme,
        };
    } catch (error) {
        console.error('Error getting window themes:', error);
        return {
            success: false,
            error: error.message,
        };
    }
});

module.exports = {
    WindowManager,
    windowManager,

    // Convenience functions
    createWindow: (options, windowId, theme) => windowManager.createWindow(options, windowId, theme),
    createPresetWindow: (preset, overrides, windowId, theme) => windowManager.createPresetWindow(preset, overrides, windowId, theme),
    getWindow: windowId => windowManager.getWindow(windowId),
    closeWindow: windowId => windowManager.closeWindow(windowId),
    closeAllWindows: () => windowManager.closeAllWindows(),

    // Theme-related functions
    getAvailableThemes: () => windowManager.getAvailableThemes(),
    changeWindowTheme: (windowId, theme) => windowManager.changeWindowTheme(windowId, theme),
    getWindowTheme: windowId => windowManager.getWindowTheme(windowId),

    // Opacity-related functions
    setWindowOpacity: (windowId, opacity) => windowManager.setWindowOpacity(windowId, opacity),
    getWindowOpacity: windowId => windowManager.getWindowOpacity(windowId),
    adjustWindowOpacity: (windowId, delta) => windowManager.adjustWindowOpacity(windowId, delta),

    // Simple theme-related functions
    setSimpleWindowTheme: (windowId, theme) => windowManager.setSimpleWindowTheme(windowId, theme),
    getSimpleThemes: () => windowManager.getSimpleThemes(),
};
