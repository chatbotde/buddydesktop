if (require('electron-squirrel-startup')) {
    process.exit(0);
}

// Load environment variables from .env file
require('dotenv').config();

/**
 * Buddy Desktop Application
 *
 * This application provides consistent window properties across all windows:
 * - Frameless windows (frame: false)
 * - Transparent background (transparent: true)
 * - Always on top (alwaysOnTop: true)
 * - Hidden from taskbar (skipTaskbar: true)
 * - Hidden from mission control (hiddenInMissionControl: true)
 * - Content protection enabled
 * - Visible on all workspaces
 *
 * All windows created through createConsistentWindow() or createImageWindow()
 * will inherit these properties automatically.
 */

const { app, BrowserWindow, desktopCapturer, globalShortcut, session, ipcMain, shell, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('os');
const { spawn } = require('child_process');
const { pcmToWav, analyzeAudioBuffer, saveDebugAudio, processRealtimeAudio } = require('./audioUtils');
const { getSystemPrompt } = require('./prompts');
const { createAIProvider } = require('./ai-providers');
const AuthService = require('./auth-service');
const AutoUpdateService = require('./auto-updater');

let geminiSession = null;
let loopbackProc = null;
let systemAudioProc = null;
let audioIntervalTimer = null;
let mouseEventsIgnored = false;
let messageBuffer = '';
let currentAIProvider = null;
let authService = null;
let currentUser = null;
let autoUpdateService = null;

// Make these globally accessible for AI providers
global.sendToRenderer = sendToRenderer;
global.messageBuffer = '';

function ensureDataDirectories() {
    const homeDir = os.homedir();
    const buddyDir = path.join(homeDir, 'buddy');
    const dataDir = path.join(buddyDir, 'data');
    const imageDir = path.join(dataDir, 'image');
    const audioDir = path.join(dataDir, 'audio');

    [buddyDir, dataDir, imageDir, audioDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    return { imageDir, audioDir };
}

// Utility function to create windows with consistent properties
// Import the new window system
const { createWindow: createManagedWindow, windowManager } = require('./window');

function createConsistentWindow(options = {}) {
    // Use the new window system with backward compatibility
    return createManagedWindow(options);
}

function createMainWindow() {
    // Initialize authentication service
    authService = new AuthService();

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

    session.defaultSession.setDisplayMediaRequestHandler(
        (request, callback) => {
            desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
                callback({ video: sources[0], audio: 'loopback' });
            });
        },
        { useSystemPicker: true }
    );

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Initialize auto-update service
    autoUpdateService = new AutoUpdateService(mainWindow);
    autoUpdateService.start();

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const moveIncrement = Math.floor(Math.min(width, height) * 0.1);

    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'Alt' : 'Ctrl';
    const shortcuts = [`${modifier}+Up`, `${modifier}+Down`, `${modifier}+Left`, `${modifier}+Right`];

    shortcuts.forEach(accelerator => {
        globalShortcut.register(accelerator, () => {
            const [currentX, currentY] = mainWindow.getPosition();
            let newX = currentX;
            let newY = currentY;

            switch (accelerator) {
                case `${modifier}+Up`:
                    newY -= moveIncrement;
                    break;
                case `${modifier}+Down`:
                    newY += moveIncrement;
                    break;
                case `${modifier}+Left`:
                    newX -= moveIncrement;
                    break;
                case `${modifier}+Right`:
                    newX += moveIncrement;
                    break;
            }

            mainWindow.setPosition(newX, newY);
        });
    });

    const toggleVisibilityShortcut = isMac ? 'Cmd+\\' : 'Ctrl+\\';
    globalShortcut.register(toggleVisibilityShortcut, () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.showInactive();
        }
    });

    const toggleShortcut = isMac ? 'Cmd+M' : 'Ctrl+M';
    globalShortcut.register(toggleShortcut, () => {
        mouseEventsIgnored = !mouseEventsIgnored;
        if (mouseEventsIgnored) {
            mainWindow.setIgnoreMouseEvents(true, { forward: true });
            console.log('Mouse events ignored');
        } else {
            mainWindow.setIgnoreMouseEvents(false);
            console.log('Mouse events enabled');
        }
    });

    const nextStepShortcut = isMac ? 'Cmd+Enter' : 'Ctrl+Enter';
    globalShortcut.register(nextStepShortcut, async () => {
        console.log('Next step shortcut triggered');
        try {
            if (geminiSession) {
                await geminiSession.sendRealtimeInput({ text: 'What should be the next step here' });
                console.log('Sent "next step" message to Gemini');
            } else {
                console.log('No active Gemini session');
            }
        } catch (error) {
            console.error('Error sending next step message:', error);
        }
    });

    // Add screen analysis shortcut
    const screenshotShortcut = 'Alt+A';
    globalShortcut.register(screenshotShortcut, async () => {
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

    ipcMain.on('view-changed', (event, view) => {
        if (view !== 'assistant') {
            mainWindow.setIgnoreMouseEvents(false);
        }
    });

    ipcMain.handle('window-minimize', () => {
        mainWindow.minimize();
    });

    // IPC handler for creating image windows with consistent properties
    ipcMain.handle('create-image-window', async (event, imageData, title = 'Screenshot') => {
        try {
            const imageWindow = createConsistentWindow({
                width: 400,
                height: 200,
                title: title,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    backgroundThrottling: false,
                    webSecurity: true,
                    allowRunningInsecureContent: false,
                },
            });

            // Create HTML content for the image window
            const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background: #000;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        .image-container {
                            position: relative;
                            max-width: 80%;
                            max-height: 80%;
                        }
                        img {
                            max-width: 80%;
                            max-height: 80%;
                            object-fit: contain;
                            display: block;
                        }
                        .close-btn {
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background: rgba(0, 0, 0, 0.7);
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 30px;
                            height: 30px;
                            cursor: pointer;
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .close-btn:hover {
                            background: rgba(255, 0, 0, 0.8);
                        }
                    </style>
                </head>
                <body>
                    <div class="image-container">
                        <button class="close-btn" onclick="window.close()">×</button>
                        <img src="data:image/jpeg;base64,${imageData}" alt="${title}" />
                    </div>
                </body>
            </html>
        `;

            // Load the HTML content
            imageWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

            // Handle window close
            imageWindow.on('closed', () => {
                // Window will be garbage collected
            });

            return { success: true, windowId: imageWindow.id };
        } catch (error) {
            console.error('Failed to create image window:', error);
            return { success: false, error: error.message };
        }
    });

    // General IPC handler for creating any window with consistent properties
    ipcMain.handle('create-consistent-window', async (event, options = {}) => {
        try {
            const window = createConsistentWindow(options);

            // Handle window close
            window.on('closed', () => {
                // Window will be garbage collected
            });

            return { success: true, windowId: window.id };
        } catch (error) {
            console.error('Failed to create consistent window:', error);
            return { success: false, error: error.message };
        }
    });

    // IPC handler for creating audio window
    ipcMain.handle('create-audio-window', async (event, options = {}) => {
        try {
            const audioWindowOptions = {
                width: 50,
                height: 50,
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

            const audioWindow = createConsistentWindow(audioWindowOptions);

            // Load the audio window HTML
            const htmlPath = path.join(__dirname, 'features', 'audio', 'audio-window.html');
            await audioWindow.loadFile(htmlPath);

            // Position window (default to center-right of screen)
            if (!options.x || !options.y) {
                const primaryDisplay = screen.getPrimaryDisplay();
                const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
                
                const x = options.x ?? screenWidth -400; // 20px from right edge
                const y = options.y ?? 40; // 20px from top
                
                audioWindow.setPosition(x, y);
            }

            // Handle IPC messages from the audio window
            audioWindow.webContents.on('ipc-message', (event, channel, data) => {
                switch (channel) {
                    case 'audio-window-toggle-recording':
                        console.log('Audio window toggle recording requested');
                        // Here you could integrate with your existing audio system
                        // For now, just log the action
                        break;
                    case 'audio-window-close':
                        audioWindow.close();
                        break;
                    default:
                        console.log('Unknown audio window IPC message:', channel, data);
                }
            });

            // Handle window close
            audioWindow.on('closed', () => {
                console.log('Audio window closed');
            });

            console.log('Audio window created successfully');
            return { success: true, windowId: audioWindow.id };
        } catch (error) {
            console.error('Failed to create audio window:', error);
            return { success: false, error: error.message };
        }
    });

    // IPC handler for creating search window
    ipcMain.handle('create-search-window', async (event, options = {}) => {
        try {
            const searchWindowOptions = {
                width: 450,
                height: 80,
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

            const searchWindow = createConsistentWindow(searchWindowOptions);

            // Load the search window HTML
            const htmlPath = path.join(__dirname, 'features', 'search', 'search-window.html');
            await searchWindow.loadFile(htmlPath);

            // Position window (default to center-top of screen)
            if (!options.x || !options.y) {
                const primaryDisplay = screen.getPrimaryDisplay();
                const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
                
                const x = options.x ?? Math.round((screenWidth - searchWindowOptions.width) / 2);
                const y = options.y ?? Math.round(screenHeight * 0.15); // Position in top 15% of screen
                
                searchWindow.setPosition(x, y);
            }

            // Handle IPC messages from the search window
            searchWindow.webContents.on('ipc-message', (event, channel, data) => {
                switch (channel) {
                    case 'search-window-perform-search':
                        console.log('Search window search requested:', data);
                        // Here you could integrate with your search system
                        break;
                    case 'search-window-close':
                        searchWindow.close();
                        break;
                    default:
                        console.log('Unknown search window IPC message:', channel, data);
                }
            });

            // Handle window close
            searchWindow.on('closed', () => {
                console.log('Search window closed');
            });

            console.log('Search window created successfully');
            return { success: true, windowId: searchWindow.id };
        } catch (error) {
            console.error('Failed to create search window:', error);
            return { success: false, error: error.message };
        }
    });

    // IPC handler for creating marketplace window
    ipcMain.handle('create-marketplace-window', async (event, options = {}) => {
        try {
            const marketplaceWindowOptions = {
                width: options.width || 800,
                height: options.height || 600,
                frame: false,
                transparent: true,
                hasShadow: false,
                alwaysOnTop: true,
                skipTaskbar: true,
                hiddenInMissionControl: true,
                roundedCorners: true,
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
                },
                backgroundColor: '#1a1a1a',
                titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
                title: 'Marketplace - Customize Menu'
            };

            const marketplaceWindow = createConsistentWindow(marketplaceWindowOptions);

            // Load the marketplace window HTML
            const htmlPath = path.join(__dirname, 'features', 'marketplace', 'marketplace.html');
            await marketplaceWindow.loadFile(htmlPath);

            // Pass the selected buttons to the window
            await marketplaceWindow.webContents.executeJavaScript(`
                window.selectedButtons = ${JSON.stringify(options.selectedButtons || [])};
            `);

            // Handle IPC messages from the marketplace window
            ipcMain.on('marketplace-apply', (event, selectedButtons) => {
                if (event.sender === marketplaceWindow.webContents) {
                    // Find the main window and send the update
                    const allWindows = BrowserWindow.getAllWindows();
                    const mainWindow = allWindows.find(w => w.id !== marketplaceWindow.id);
                    
                    if (mainWindow) {
                        mainWindow.webContents.send('marketplace-buttons-updated', { 
                            selectedButtons 
                        });
                    }
                    
                    // Close the marketplace window
                    marketplaceWindow.close();
                }
            });

            // Handle marketplace window close request
            ipcMain.on('marketplace-close-window', (event) => {
                if (event.sender === marketplaceWindow.webContents) {
                    marketplaceWindow.close();
                }
            });

            // Handle window close
            marketplaceWindow.on('closed', () => {
                console.log('Marketplace window closed');
                // Clean up IPC listeners
                ipcMain.removeAllListeners('marketplace-apply');
                ipcMain.removeAllListeners('marketplace-close-window');
            });

            console.log('Marketplace window created successfully');
            return { success: true, windowId: marketplaceWindow.id };
        } catch (error) {
            console.error('Failed to create marketplace window:', error);
            return { success: false, error: error.message };
        }
    });
}

async function initializeAISession(provider, apiKey, profile = 'default', language = 'en-US', model = '') {
    try {
        if (!model) {
            throw new Error('Model must be specified');
        }

        // If no API key provided, try to get from environment variables
        if (!apiKey || apiKey.trim() === '') {
            apiKey = getApiKeyFromEnvironment(provider);
            console.log(`Using environment API key for ${provider}:`, apiKey ? 'Found' : 'Not found');
        }

        // Allow session to start even without API key (for demo/testing purposes)
        if (!apiKey || apiKey.trim() === '') {
            console.warn(`No API key found for ${provider}. Session will start in demo mode.`);
            // You can still create the provider but it might fail on actual API calls
        }

        currentAIProvider = createAIProvider(provider, apiKey, profile, language, model);
        const success = await currentAIProvider.initialize();
        return success;
    } catch (error) {
        console.error('Failed to initialize AI session:', error);
        return false;
    }
}

function getApiKeyFromEnvironment(provider) {
    // Map provider names to common environment variable names
    const envKeyMap = {
        google: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
        openai: process.env.OPENAI_API_KEY,
        anthropic: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
        deepseek: process.env.DEEPSEEK_API_KEY,
        openrouter: process.env.OPENROUTER_API_KEY,
    };

    return envKeyMap[provider] || null;
}

function sendToRenderer(channel, data) {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
        windows[0].webContents.send(channel, data);
    }
}

function startMacOSAudioCapture() {
    if (process.platform !== 'darwin') return false;

    console.log('Starting macOS audio capture with SystemAudioDump...');

    let systemAudioPath;
    if (app.isPackaged) {
        systemAudioPath = path.join(process.resourcesPath, 'SystemAudioDump');
    } else {
        systemAudioPath = path.join(__dirname, 'SystemAudioDump');
    }

    console.log('SystemAudioDump path:', systemAudioPath);

    systemAudioProc = spawn(systemAudioPath, [], {
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (!systemAudioProc.pid) {
        console.error('Failed to start SystemAudioDump');
        return false;
    }

    console.log('SystemAudioDump started with PID:', systemAudioProc.pid);

    const CHUNK_DURATION = 0.1;
    const SAMPLE_RATE = 24000;
    const BYTES_PER_SAMPLE = 2;
    const CHANNELS = 2;
    const CHUNK_SIZE = SAMPLE_RATE * BYTES_PER_SAMPLE * CHANNELS * CHUNK_DURATION;

    let audioBuffer = Buffer.alloc(0);

    // Update the audio callback to use the new system
    systemAudioProc.stdout.on('data', data => {
        audioBuffer = Buffer.concat([audioBuffer, data]);

        while (audioBuffer.length >= CHUNK_SIZE) {
            const chunk = audioBuffer.slice(0, CHUNK_SIZE);
            audioBuffer = audioBuffer.slice(CHUNK_SIZE);

            const monoChunk = CHANNELS === 2 ? convertStereoToMono(chunk) : chunk;

            try {
                // Process audio for optimal Gemini 2.0 realtime quality
                const processed = processRealtimeAudio(monoChunk, {
                    enableDebugging: !!process.env.DEBUG_AUDIO,
                });
                const base64Data = processed.buffer.toString('base64');
                sendAudioToAI(base64Data);
            } catch (error) {
                console.error('Error processing audio for realtime:', error);
                // Fallback to original processing
                const base64Data = monoChunk.toString('base64');
                sendAudioToAI(base64Data);
            }

            if (process.env.DEBUG_AUDIO) {
                console.log(`Processed audio chunk: ${chunk.length} bytes`);
                saveDebugAudio(monoChunk, 'system_audio');
            }
        }

        const maxBufferSize = SAMPLE_RATE * BYTES_PER_SAMPLE * 1;
        if (audioBuffer.length > maxBufferSize) {
            audioBuffer = audioBuffer.slice(-maxBufferSize);
        }
    });

    systemAudioProc.stderr.on('data', data => {
        console.error('SystemAudioDump stderr:', data.toString());
    });

    systemAudioProc.on('close', code => {
        console.log('SystemAudioDump process closed with code:', code);
        systemAudioProc = null;
    });

    systemAudioProc.on('error', err => {
        console.error('SystemAudioDump process error:', err);
        systemAudioProc = null;
    });

    return true;
}

function convertStereoToMono(stereoBuffer) {
    const samples = stereoBuffer.length / 4;
    const monoBuffer = Buffer.alloc(samples * 2);

    for (let i = 0; i < samples; i++) {
        const leftSample = stereoBuffer.readInt16LE(i * 4);
        monoBuffer.writeInt16LE(leftSample, i * 2);
    }

    return monoBuffer;
}

function stopMacOSAudioCapture() {
    if (systemAudioProc) {
        console.log('Stopping SystemAudioDump...');
        systemAudioProc.kill('SIGTERM');
        systemAudioProc = null;
    }
}

async function sendAudioToAI(base64Data) {
    if (!currentAIProvider) return;

    try {
        process.stdout.write('.');
        await currentAIProvider.sendRealtimeInput({
            audio: {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            },
        });
    } catch (error) {
        console.error('Error sending audio to AI:', error);
    }
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

ipcMain.handle('initialize-ai', async (event, provider, apiKey, profile = 'default', language = 'en-US', model = '') => {
    return await initializeAISession(provider, apiKey, profile, language, model);
});

ipcMain.handle('check-environment-key', async (event, provider) => {
    const envKey = getApiKeyFromEnvironment(provider);
    return envKey && envKey.trim() !== '';
});

ipcMain.handle('open-external', async (event, url) => {
    try {
        await shell.openExternal(url);
        return { success: true };
    } catch (error) {
        console.error('Failed to open external URL:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('send-audio-content', async (event, { data, mimeType }) => {
    if (!currentAIProvider) return { success: false, error: 'No active AI session' };
    try {
        process.stdout.write('.');
        await currentAIProvider.sendRealtimeInput({
            audio: { data: data, mimeType: mimeType },
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending audio:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('send-image-content', async (event, { data, debug }) => {
    if (!currentAIProvider) return { success: false, error: 'No active AI session' };

    try {
        if (!data || typeof data !== 'string') {
            console.error('Invalid image data received');
            return { success: false, error: 'Invalid image data' };
        }

        const buffer = Buffer.from(data, 'base64');

        if (buffer.length < 1000) {
            console.error(`Image buffer too small: ${buffer.length} bytes`);
            return { success: false, error: 'Image buffer too small' };
        }

        process.stdout.write('!');
        await currentAIProvider.sendRealtimeInput({
            media: { data: data, mimeType: 'image/jpeg' },
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending image:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('send-video-content', async (event, { data, mimeType, isRealtime }) => {
    if (!currentAIProvider) return { success: false, error: 'No active AI session' };

    try {
        if (!data || typeof data !== 'string') {
            console.error('Invalid video data received');
            return { success: false, error: 'Invalid video data' };
        }

        const buffer = Buffer.from(data, 'base64');

        if (buffer.length < 500) {
            console.error(`Video buffer too small: ${buffer.length} bytes`);
            return { success: false, error: 'Video buffer too small' };
        }

        // For real-time video streaming, use a different indicator
        if (isRealtime) {
            process.stdout.write('▶');
        } else {
            process.stdout.write('!');
        }

        await currentAIProvider.sendRealtimeInput({
            media: { data: data, mimeType: mimeType || 'image/jpeg' },
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending video:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('send-text-message', async (event, messageData) => {
    if (!currentAIProvider) return { success: false, error: 'No active AI session' };

    try {
        // Handle both old string format and new object format for backward compatibility
        let text, screenshots;
        if (typeof messageData === 'string') {
            text = messageData;
            screenshots = null;
        } else if (typeof messageData === 'object' && messageData !== null) {
            text = messageData.text;
            screenshots = messageData.screenshots || (messageData.screenshot ? [messageData.screenshot] : null);
        } else {
            return { success: false, error: 'Invalid message format' };
        }

        // Validate that we have either text or screenshots
        if ((!text || text.trim().length === 0) && (!screenshots || screenshots.length === 0)) {
            return { success: false, error: 'Message must contain text or screenshots' };
        }

        const input = {};
        if (text && text.trim().length > 0) {
            input.text = text.trim();
        }
        if (screenshots && Array.isArray(screenshots) && screenshots.length > 0) {
            input.screenshots = screenshots;
        }

        console.log('Sending message:', {
            hasText: !!input.text,
            hasScreenshots: !!input.screenshots,
            screenshotCount: input.screenshots ? input.screenshots.length : 0,
        });
        await currentAIProvider.sendRealtimeInput(input);
        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('start-macos-audio', async event => {
    if (process.platform !== 'darwin') {
        return {
            success: false,
            error: 'macOS audio capture only available on macOS',
        };
    }

    try {
        const success = startMacOSAudioCapture();
        return { success };
    } catch (error) {
        console.error('Error starting macOS audio capture:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('stop-macos-audio', async event => {
    try {
        stopMacOSAudioCapture();
        return { success: true };
    } catch (error) {
        console.error('Error stopping macOS audio capture:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('pause-macos-audio', async event => {
    try {
        if (systemAudioProc) {
            systemAudioProc.kill('SIGSTOP'); // Pause the process
            console.log('macOS audio capture paused');
        }
        return { success: true };
    } catch (error) {
        console.error('Error pausing macOS audio capture:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('resume-macos-audio', async event => {
    try {
        if (systemAudioProc) {
            systemAudioProc.kill('SIGCONT'); // Resume the process
            console.log('macOS audio capture resumed');
        }
        return { success: true };
    } catch (error) {
        console.error('Error resuming macOS audio capture:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('close-session', async event => {
    try {
        stopMacOSAudioCapture();

        // Cleanup any pending resources and stop audio/video capture
        if (currentAIProvider) {
            await currentAIProvider.close();
            currentAIProvider = null;
        }

        return { success: true };
    } catch (error) {
        console.error('Error closing session:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('quit-application', async event => {
    try {
        stopMacOSAudioCapture();
        if (authService) {
            await authService.close();
        }
        app.quit();
        return { success: true };
    } catch (error) {
        console.error('Error quitting application:', error);
        return { success: false, error: error.message };
    }
});

// Authentication handlers
ipcMain.handle('get-google-auth-url', async event => {
    try {
        if (!authService) {
            throw new Error('Authentication service not initialized');
        }
        return { success: true, url: authService.getAuthUrl() };
    } catch (error) {
        console.error('Failed to get Google auth URL:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('handle-google-auth-callback', async (event, code) => {
    try {
        if (!authService) {
            throw new Error('Authentication service not initialized');
        }

        const tokenResult = await authService.exchangeCodeForTokens(code);
        if (!tokenResult.success) {
            return { success: false, error: tokenResult.error };
        }

        const user = await authService.createOrUpdateUser(tokenResult.userInfo);
        const token = authService.generateJWT(user);

        // Store current user
        currentUser = user;

        return {
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
            },
            token,
        };
    } catch (error) {
        console.error('Failed to handle Google auth callback:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('verify-auth-token', async (event, token) => {
    try {
        if (!authService) {
            throw new Error('Authentication service not initialized');
        }

        // Ensure the database connection is established before we try to use it.
        if (!authService.db) {
            try {
                await authService.initializeDatabase?.();
            } catch (dbErr) {
                console.error('Failed to (re)initialize database:', dbErr);
            }
        }

        const decoded = authService.verifyJWT(token);
        if (!decoded) {
            return { success: false, error: 'Invalid token' };
        }

        const user = await authService.getUserById(decoded.userId);
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        currentUser = user;
        return {
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                preferences: user.preferences,
            },
        };
    } catch (error) {
        console.error('Failed to verify auth token:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('update-user-preferences', async (event, preferences) => {
    try {
        if (!authService || !currentUser) {
            return { success: false, error: 'User not authenticated' };
        }

        const success = await authService.updateUserPreferences(currentUser._id, preferences);
        return { success };
    } catch (error) {
        console.error('Failed to update user preferences:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('save-chat-session', async (event, sessionData) => {
    try {
        if (!authService || !currentUser) {
            // If not authenticated, return success but don't save
            return { success: true, message: 'Session not saved (guest mode)' };
        }

        const sessionId = await authService.saveChatSession(currentUser._id, sessionData);
        return { success: true, sessionId };
    } catch (error) {
        console.error('Failed to save chat session:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-chat-history', async (event, limit = 10) => {
    try {
        if (!authService || !currentUser) {
            return { success: true, history: [] };
        }

        const history = await authService.getChatHistory(currentUser._id, limit);
        return { success: true, history };
    } catch (error) {
        console.error('Failed to get chat history:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('delete-chat-session', async (event, sessionId) => {
    try {
        if (!authService || !currentUser) {
            return { success: false, error: 'User not authenticated' };
        }

        const success = await authService.deleteChatSession(currentUser._id, sessionId);
        return { success };
    } catch (error) {
        console.error('Failed to delete chat session:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('logout', async event => {
    try {
        currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('Failed to logout:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('start-guest-session', async event => {
    try {
        // Guest mode - no authentication required
        currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('Failed to start guest session:', error);
        return { success: false, error: error.message };
    }
});

// Visibility control handlers
ipcMain.handle('toggle-content-protection', async (event, enabled) => {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].setContentProtection(enabled);
            console.log(`Content protection ${enabled ? 'enabled' : 'disabled'}`);
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle content protection:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('toggle-workspace-visibility', async (event, enabled) => {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].setVisibleOnAllWorkspaces(enabled, { visibleOnFullScreen: true });
            console.log(`Workspace visibility ${enabled ? 'enabled' : 'disabled'}`);
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle workspace visibility:', error);
        return { success: false, error: error.message };
    }
});

// Opacity control handlers
ipcMain.handle('set-window-opacity', async (event, data) => {
    try {
        const { windowId, opacity } = data;
        if (!windowId || typeof opacity !== 'number') {
            return { success: false, error: 'Invalid parameters' };
        }
        
        const success = windowManager.setWindowOpacity(windowId, opacity);
        return { success };
    } catch (error) {
        console.error('Failed to set window opacity:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-window-opacity', async (event, windowId) => {
    try {
        if (!windowId) {
            return { success: false, error: 'Window ID required' };
        }
        
        const opacity = windowManager.getWindowOpacity(windowId);
        return { success: true, opacity };
    } catch (error) {
        console.error('Failed to get window opacity:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('adjust-window-opacity', async (event, data) => {
    try {
        const { windowId, delta } = data;
        if (!windowId || typeof delta !== 'number') {
            return { success: false, error: 'Invalid parameters' };
        }
        
        const success = windowManager.adjustWindowOpacity(windowId, delta);
        const newOpacity = windowManager.getWindowOpacity(windowId);
        return { success, opacity: newOpacity };
    } catch (error) {
        console.error('Failed to adjust window opacity:', error);
        return { success: false, error: error.message };
    }
});

// Simple theme control handlers
ipcMain.handle('set-simple-window-theme', async (event, data) => {
    try {
        const { windowId, theme } = data;
        console.log('Setting window theme:', { windowId, theme });
        
        if (!windowId || !theme) {
            return { success: false, error: 'Invalid parameters' };
        }
        
        const success = windowManager.setSimpleWindowTheme(windowId, theme);
        console.log('Theme change result:', success);
        return { success };
    } catch (error) {
        console.error('Failed to set simple window theme:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-simple-themes', async (event) => {
    try {
        const themes = windowManager.getSimpleThemes();
        return { success: true, themes };
    } catch (error) {
        console.error('Failed to get simple themes:', error);
        return { success: false, error: error.message };
    }
});
