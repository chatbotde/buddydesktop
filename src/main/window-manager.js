/**
 * Window Management System
 * Handles window creation, shortcuts, and window state management
 */

const { BrowserWindow, globalShortcut, session, desktopCapturer, screen } = require('electron');
const path = require('node:path');
const { getShortcutsConfig, AppState } = require('./app-config');
const AuthService = require('../auth-service');
const AutoUpdateService = require('../auto-updater');

// Import the new window system
const { createWindow: createManagedWindow, windowManager } = require('../window');

/**
 * Utility function to create windows with consistent properties
 */
function createConsistentWindow(options = {}) {
    // Use the new window system with backward compatibility
    return createManagedWindow(options);
}

/**
 * Send message to renderer process
 */
function sendToRenderer(channel, data) {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
        windows[0].webContents.send(channel, data);
    }
}

/**
 * Set up global keyboard shortcuts
 */
function setupGlobalShortcuts(mainWindow) {
    const config = getShortcutsConfig();
    const { shortcuts, moveIncrement } = config;

    // Movement shortcuts
    shortcuts.movement.forEach(accelerator => {
        globalShortcut.register(accelerator, () => {
            const [currentX, currentY] = mainWindow.getPosition();
            let newX = currentX;
            let newY = currentY;

            switch (accelerator) {
                case `${config.modifier}+Up`:
                    newY = Math.max(0, currentY - moveIncrement);
                    break;
                case `${config.modifier}+Down`:
                    newY = currentY + moveIncrement;
                    break;
                case `${config.modifier}+Left`:
                    newX = Math.max(0, currentX - moveIncrement);
                    break;
                case `${config.modifier}+Right`:
                    newX = currentX + moveIncrement;
                    break;
            }

            mainWindow.setPosition(newX, newY);
        });
    });

    // Toggle visibility shortcut
    globalShortcut.register(shortcuts.toggleVisibility, () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.showInactive();
        }
    });

    // Toggle mouse events shortcut
    globalShortcut.register(shortcuts.toggleMouseEvents, () => {
        let mouseEventsIgnored = AppState.get('mouseEventsIgnored');
        mouseEventsIgnored = !mouseEventsIgnored;
        AppState.set('mouseEventsIgnored', mouseEventsIgnored);
        
        if (mouseEventsIgnored) {
            mainWindow.setIgnoreMouseEvents(true, { forward: true });
            console.log('Mouse events ignored');
        } else {
            mainWindow.setIgnoreMouseEvents(false);
            console.log('Mouse events enabled');
        }
    });

    // Next step shortcut
    globalShortcut.register(shortcuts.nextStep, async () => {
        console.log('Next step shortcut triggered');
        try {
            const geminiSession = AppState.get('geminiSession');
            if (geminiSession) {
                await geminiSession.sendMessage('continue');
            } else {
                console.log('No active session to send message to');
            }
        } catch (error) {
            console.error('Error sending next step message:', error);
        }
    });

    // Screenshot analysis shortcut
    globalShortcut.register(shortcuts.screenshot, async () => {
        console.log('Screen analysis shortcut triggered');
        try {
            // Send command to renderer to capture screenshot and analyze it
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                windows[0].webContents.send('capture-and-send-screenshot');
            }
        } catch (error) {
            console.error('Error triggering screen analysis:', error);
        }
    });
}

/**
 * Create the main application window
 */
function createMainWindow() {
    // Initialize authentication service
    AppState.set('authService', new AuthService());

    const mainWindow = createManagedWindow({
        width: 600,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            enableBlinkFeatures: 'GetDisplayMedia',
            webSecurity: true,
            allowRunningInsecureContent: false,
        },
    }, 'main');

    // Set up display media request handler
    session.defaultSession.setDisplayMediaRequestHandler(
        (request, callback) => {
            desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
                callback({ video: sources[0], audio: 'loopback' });
            });
        },
        { useSystemPicker: true }
    );

    mainWindow.loadFile(path.join(__dirname, '../index.html'));

    // Initialize auto-update service
    AppState.set('autoUpdateService', new AutoUpdateService(mainWindow));
    AppState.get('autoUpdateService').start();

    // Set up global shortcuts
    setupGlobalShortcuts(mainWindow);

    // Make sendToRenderer globally accessible
    global.sendToRenderer = sendToRenderer;

    return mainWindow;
}

/**
 * Create image window for displaying screenshots
 */
async function createImageWindow(imageData, title = 'Screenshot') {
    try {
        const imageWindow = createConsistentWindow({
            width: 800,
            height: 600,
            title: title,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        // Create HTML content for the image
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        background: #1a1a1a;
                        color: white;
                        font-family: system-ui;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }
                    img {
                        max-width: 100%;
                        max-height: 80vh;
                        object-fit: contain;
                        border-radius: 8px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                    }
                    .title {
                        margin-bottom: 20px;
                        font-size: 18px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="title">${title}</div>
                <img src="data:image/jpeg;base64,${imageData}" alt="${title}" />
            </body>
            </html>
        `;

        await imageWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

        return { success: true, windowId: imageWindow.id };
    } catch (error) {
        console.error('Failed to create image window:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create audio window
 */
async function createAudioWindow(options = {}) {
    try {
        const windowStates = AppState.get('windowStates');
        
        if (windowStates.audio.window && !windowStates.audio.window.isDestroyed()) {
            windowStates.audio.window.focus();
            return { success: true, windowId: windowStates.audio.window.id };
        }

        const audioWindowOptions = {
            width: options.width || 400,
            height: options.height || 400,
            x: options.x,
            y: options.y,
            title: 'Audio Controls',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        };

        const audioWindow = createConsistentWindow(audioWindowOptions);

        // Load the audio window HTML
        const htmlPath = path.join(__dirname, '../features/audio/audio-window.html');
        await audioWindow.loadFile(htmlPath);

        // Handle window close
        audioWindow.on('closed', () => {
            windowStates.audio.window = null;
            windowStates.audio.isMinimized = false;
            // Notify main window that audio window was closed
            sendToRenderer('audio-window-closed', {});
        });

        windowStates.audio.window = audioWindow;
        windowStates.audio.isMinimized = false;

        console.log('Audio window created successfully');
        return { success: true, windowId: audioWindow.id };
    } catch (error) {
        console.error('Failed to create audio window:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create search window
 */
async function createSearchWindow(options = {}) {
    try {
        const windowStates = AppState.get('windowStates');
        
        if (windowStates.search.window && !windowStates.search.window.isDestroyed()) {
            windowStates.search.window.focus();
            return { success: true, windowId: windowStates.search.window.id };
        }

        const searchWindowOptions = {
            width: options.width || 450,
            height: options.height || 80,
            x: options.x,
            y: options.y,
            title: 'Quick Search',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        };

        const searchWindow = createConsistentWindow(searchWindowOptions);

        // Load the search window HTML
        const htmlPath = path.join(__dirname, '../features/search/search-window.html');
        await searchWindow.loadFile(htmlPath);

        // Handle window close
        searchWindow.on('closed', () => {
            windowStates.search.window = null;
            windowStates.search.isMinimized = false;
            // Notify main window that search window was closed
            sendToRenderer('search-window-closed', {});
        });

        windowStates.search.window = searchWindow;
        windowStates.search.isMinimized = false;

        console.log('Search window created successfully');
        return { success: true, windowId: searchWindow.id };
    } catch (error) {
        console.error('Failed to create search window:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create marketplace window
 */
async function createMarketplaceWindow(options = {}) {
    try {
        const marketplaceWindowOptions = {
            width: options.width || 800,
            height: options.height || 600,
            title: 'Marketplace',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        };

        const marketplaceWindow = createConsistentWindow(marketplaceWindowOptions);

        // Load the marketplace window HTML
        const htmlPath = path.join(__dirname, '../features/marketplace/marketplace.html');
        await marketplaceWindow.loadFile(htmlPath);

        // Pass the selected buttons to the window
        await marketplaceWindow.webContents.executeJavaScript(`
            window.selectedButtons = ${JSON.stringify(options.selectedButtons || [])};
        `);

        console.log('Marketplace window created successfully');
        return { success: true, windowId: marketplaceWindow.id };
    } catch (error) {
        console.error('Failed to create marketplace window:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    createMainWindow,
    createConsistentWindow,
    createImageWindow,
    createAudioWindow,
    createSearchWindow,
    createMarketplaceWindow,
    sendToRenderer,
    setupGlobalShortcuts,
    windowManager
};
