/**
 * Application Configuration and Constants
 */

const { app, globalShortcut, screen } = require('electron');
const path = require('node:path');
const os = require('os');

// Global state variables
let geminiSession = null;
let loopbackProc = null;
let systemAudioProc = null;
let audioIntervalTimer = null;
let mouseEventsIgnored = false;
let messageBuffer = '';
let currentAIProvider = null;

// Window state management
const windowStates = {
    search: { window: null, isMinimized: false },
    audio: { window: null, isMinimized: false }
};

let authService = null;
let currentUser = null;
let autoUpdateService = null;

// Make these globally accessible for AI providers
global.sendToRenderer = null; // Will be set from window module
global.messageBuffer = '';

/**
 * Get application configuration
 */
function getAppConfig() {
    return {
        directories: ensureDataDirectories(),
        platform: {
            isMac: process.platform === 'darwin',
            isWindows: process.platform === 'win32',
            isLinux: process.platform === 'linux'
        }
    };
}

/**
 * Ensure required data directories exist
 */
function ensureDataDirectories() {
    const homeDir = os.homedir();
    const buddyDir = path.join(homeDir, 'buddy');
    const dataDir = path.join(buddyDir, 'data');
    const imageDir = path.join(dataDir, 'image');
    const audioDir = path.join(dataDir, 'audio');

    const fs = require('node:fs');
    [buddyDir, dataDir, imageDir, audioDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    return { imageDir, audioDir };
}

/**
 * Get global shortcuts configuration
 */
function getShortcutsConfig() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const moveIncrement = Math.floor(Math.min(width, height) * 0.1);
    const isMac = process.platform === 'darwin';
    
    return {
        moveIncrement,
        modifier: isMac ? 'Alt' : 'Ctrl',
        shortcuts: {
            movement: [`${isMac ? 'Alt' : 'Ctrl'}+Up`, `${isMac ? 'Alt' : 'Ctrl'}+Down`, `${isMac ? 'Alt' : 'Ctrl'}+Left`, `${isMac ? 'Alt' : 'Ctrl'}+Right`],
            toggleVisibility: isMac ? 'Cmd+\\' : 'Ctrl+\\',
            toggleMouseEvents: isMac ? 'Cmd+M' : 'Ctrl+M',
            nextStep: isMac ? 'Cmd+Enter' : 'Ctrl+Enter',
            screenshot: 'Alt+A', // Desktop capture and AI analysis
            clearChat: isMac ? 'Cmd+K' : 'Ctrl+K'
        }
    };
}

/**
 * Get/Set global state
 */
const AppState = {
    get: (key) => {
        const state = {
            geminiSession,
            loopbackProc,
            systemAudioProc,
            audioIntervalTimer,
            mouseEventsIgnored,
            messageBuffer,
            currentAIProvider,
            windowStates,
            authService,
            currentUser,
            autoUpdateService
        };
        return key ? state[key] : state;
    },
    
    set: (key, value) => {
        switch (key) {
            case 'geminiSession': geminiSession = value; break;
            case 'loopbackProc': loopbackProc = value; break;
            case 'systemAudioProc': systemAudioProc = value; break;
            case 'audioIntervalTimer': audioIntervalTimer = value; break;
            case 'mouseEventsIgnored': mouseEventsIgnored = value; break;
            case 'messageBuffer': messageBuffer = value; break;
            case 'currentAIProvider': currentAIProvider = value; break;
            case 'authService': authService = value; break;
            case 'currentUser': currentUser = value; break;
            case 'autoUpdateService': autoUpdateService = value; break;
        }
    }
};

module.exports = {
    getAppConfig,
    ensureDataDirectories,
    getShortcutsConfig,
    AppState
};
