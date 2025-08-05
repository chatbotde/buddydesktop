// renderer-modular.js
const { ipcRenderer } = require('electron');

// Import services
const CaptureService = require('./services/capture-service');
const AICommunicationService = require('./services/ai-communication-service');
const AuthServiceRenderer = require('./services/auth-service-renderer');
const WindowService = require('./services/window-service');

// Initialize services
const captureService = new CaptureService();
const aiCommunicationService = new AICommunicationService();
const authServiceRenderer = new AuthServiceRenderer();
const windowService = new WindowService();

// Utility function to get buddy element
function buddyElement() {
    return document.getElementById('buddy');
}

// Platform detection (kept for compatibility)
const isLinux = process.platform === 'linux';
const isMacOS = process.platform === 'darwin';

// Main window.buddy object with all the functions exposed
window.buddy = {
    // Core functions
    e: buddyElement,
    isLinux: isLinux,
    isMacOS: isMacOS,

    // AI Communication
    initializeAI: (...args) => aiCommunicationService.initializeAI(...args),
    sendTextMessage: (...args) => aiCommunicationService.sendTextMessage(...args),
    stopStreaming: () => aiCommunicationService.stopStreaming(),
    captureAndSendScreenshot: () => aiCommunicationService.captureAndSendScreenshot(),
    checkEnvironmentKey: (provider) => aiCommunicationService.checkEnvironmentKey(provider),
    testEnvironmentKeys: () => aiCommunicationService.testEnvironmentKeys(),
    testModelInitialization: (...args) => aiCommunicationService.testModelInitialization(...args),

    // Capture functions
    startCapture: () => captureService.startCapture(),
    stopCapture: () => captureService.stopCapture(),
    captureScreenshot: () => captureService.captureScreenshot(),

    // Audio control
    pauseAudio: () => captureService.pauseAudio(),
    resumeAudio: () => captureService.resumeAudio(),

    // Screen control
    pauseScreen: () => captureService.pauseScreen(),
    resumeScreen: () => captureService.resumeScreen(),

    // Real-time video streaming
    enableRealtimeVideoStreaming: () => captureService.enableRealtimeVideoStreaming(),
    disableRealtimeVideoStreaming: () => captureService.disableRealtimeVideoStreaming(),

    // Window management
    createImageWindow: (...args) => windowService.createImageWindow(...args),
    createConsistentWindow: (...args) => windowService.createConsistentWindow(...args),
    openExternal: (url) => windowService.openExternal(url),
    testWindowCreation: () => windowService.testWindowCreation(),

    // Authentication
    startGoogleAuth: () => authServiceRenderer.startGoogleAuth(),
    verifyAuthToken: (...args) => authServiceRenderer.verifyAuthToken(...args),
    updateUserPreferences: (...args) => authServiceRenderer.updateUserPreferences(...args),
    saveChatSession: (...args) => authServiceRenderer.saveChatSession(...args),
    getChatHistory: (...args) => authServiceRenderer.getChatHistory(...args),
    deleteChatSession: (...args) => authServiceRenderer.deleteChatSession(...args),
    logout: () => authServiceRenderer.logout(),
    startGuestSession: () => authServiceRenderer.startGuestSession(),

    // Service access (for advanced usage)
    captureService: captureService,
    aiCommunicationService: aiCommunicationService,
    authServiceRenderer: authServiceRenderer,
    windowService: windowService,
    audioService: captureService.getAudioService(),
    videoService: captureService.getVideoService(),
};

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        captureService,
        aiCommunicationService,
        authServiceRenderer,
        windowService,
        buddyElement,
        isLinux,
        isMacOS
    };
}
