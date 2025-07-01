if (require('electron-squirrel-startup')) {
    process.exit(0);
}

// Load environment variables from .env file
require('dotenv').config();

const { app, BrowserWindow, desktopCapturer, globalShortcut, session, ipcMain, shell, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('os');
const { spawn } = require('child_process');
const { pcmToWav, analyzeAudioBuffer, saveDebugAudio } = require('./audioUtils');
const { getSystemPrompt } = require('./prompts');
const { createAIProvider } = require('./ai-providers');

let geminiSession = null;
let loopbackProc = null;
let systemAudioProc = null;
let audioIntervalTimer = null;
let mouseEventsIgnored = false;
let messageBuffer = '';
let currentAIProvider = null;

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

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 700,
        frame: false,
        transparent: true,
        hasShadow: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        hiddenInMissionControl: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            enableBlinkFeatures: 'GetDisplayMedia',
            webSecurity: true,
            allowRunningInsecureContent: false,
        },
        backgroundColor: '#00000000',
    });

    session.defaultSession.setDisplayMediaRequestHandler(
        (request, callback) => {
            desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
                callback({ video: sources[0], audio: 'loopback' });
            });
        },
        { useSystemPicker: true }
    );

    mainWindow.setContentProtection(true);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    if (process.platform === 'win32') {
        mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    }

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const moveIncrement = Math.floor(Math.min(width, height) * 0.15);

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
            mainWindow.show();
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

    // Add screenshot and auto-send shortcut
    const screenshotShortcut = 'Ctrl+Alt+N';
    globalShortcut.register(screenshotShortcut, async () => {
        console.log('Screenshot and auto-send shortcut triggered');
        try {
            // Send command to renderer to capture screenshot and send it
            const windows = BrowserWindow.getAllWindows();
            if (windows.length > 0) {
                windows[0].webContents.send('capture-and-send-screenshot');
            }
        } catch (error) {
            console.error('Error triggering screenshot capture:', error);
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
}

async function initializeAISession(provider, apiKey, customPrompt = '', profile = 'interview', language = 'en-US', model = '') {
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
        
        currentAIProvider = createAIProvider(provider, apiKey, profile, language, customPrompt, model);
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
        'google': process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
        'openai': process.env.OPENAI_API_KEY,
        'anthropic': process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
        'deepseek': process.env.DEEPSEEK_API_KEY,
        'openrouter': process.env.OPENROUTER_API_KEY
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
            const base64Data = monoChunk.toString('base64');
            sendAudioToAI(base64Data);

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

app.whenReady().then(createWindow);

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
        createWindow();
    }
});

ipcMain.handle('initialize-ai', async (event, provider, apiKey, customPrompt, profile = 'interview', language = 'en-US', model = '') => {
    return await initializeAISession(provider, apiKey, customPrompt, profile, language, model);
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
            screenshotCount: input.screenshots ? input.screenshots.length : 0 
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
        app.quit();
        return { success: true };
    } catch (error) {
        console.error('Error quitting application:', error);
        return { success: false, error: error.message };
    }
});
