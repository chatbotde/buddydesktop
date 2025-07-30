// renderer.js
const { ipcRenderer } = require('electron');

let mediaStream = null;
let screenshotInterval = null;
let videoStreamInterval = null; // New interval for real-time video streaming
let audioContext = null; // Used for Windows loopback audio
let audioProcessor = null; // ScriptProcessorNode (Windows loopback or Linux mic)
let micAudioProcessor = null; // This variable seems to be unused globally, setupLinuxMicProcessing assigns to global audioProcessor
let audioBuffer = []; // This is re-declared in setupLinuxMicProcessing and setupWindowsLoopbackProcessing, consider scope.
const SAMPLE_RATE = 24000;
const AUDIO_CHUNK_DURATION = 0.1; // seconds
const BUFFER_SIZE = 4096; // Increased buffer size for smoother audio

// Real-time video streaming constants
const REALTIME_VIDEO_FPS = 8; // 8 FPS for real-time streaming
const REALTIME_VIDEO_INTERVAL = 1000 / REALTIME_VIDEO_FPS; // ~125ms
const SCREENSHOT_INTERVAL = 1000; // 1 second for regular screenshots

let hiddenVideo = null;
let offscreenCanvas = null;
let offscreenContext = null;

const isLinux = process.platform === 'linux';
const isMacOS = process.platform === 'darwin';

// New global state variables for pause/resume
let globalWindowsAudioSource = null;
let globalLinuxMicSource = null;
let globalLinuxMicAudioContext = null;
let isAudioProcessingPaused = false;
let isScreenPaused = false;
let isRealtimeVideoEnabled = false; // New flag for real-time video streaming

function buddyElement() {
    return document.getElementById('buddy');
}

function convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        // Improved scaling to prevent clipping
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function initializeAI(provider = 'google', profile = 'default', language = 'en-US', model = '') {
    let apiKey = localStorage.getItem(`apiKey_${provider}`)?.trim();
    let baseUrl = null;
    let actualModelId = model;
    let actualProvider = provider;
    
    console.log('🚀 Initializing AI with:', { provider, model, hasApiKey: !!apiKey });
    console.log('🔍 Detailed initialization params:', {
        provider: provider,
        model: model,
        profile: profile,
        language: language,
        apiKeyLength: apiKey ? apiKey.length : 0,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
    });
    
    // Check if this is a custom model
    const customModels = JSON.parse(localStorage.getItem('buddy_custom_models') || '[]');
    const customModel = customModels.find(m => m.id === model);
    
    if (customModel) {
        // Use custom model's API key and settings
        apiKey = customModel.apiKey;
        baseUrl = customModel.baseUrl;
        actualModelId = customModel.modelId; // Use the actual model ID for API calls
        actualProvider = customModel.provider; // Use the custom model's provider
        
        console.log('✅ Using custom model:', {
            name: customModel.name,
            provider: actualProvider,
            modelId: actualModelId,
            hasApiKey: !!apiKey,
            hasBaseUrl: !!baseUrl
        });
    } else {
        console.log('📋 Using built-in model:', { provider, model });
    }
    
    // Validate that we have an API key for custom models
    if (customModel && (!apiKey || apiKey.trim() === '')) {
        console.error('❌ Custom model requires API key but none provided');
        buddy.e().setStatus('Error: Custom model requires API key');
        return;
    }
    
    // Always attempt to initialize, even without API key for built-in models
    // The main process will handle environment variables and fallbacks
    const success = await ipcRenderer.invoke(
        'initialize-ai',
        actualProvider,
        apiKey || '', // Pass custom API key or empty string
        profile,
        language,
        actualModelId, // Pass the actual model ID for API calls
        baseUrl // Pass custom base URL if available
    );
    
    if (success) {
        buddy.e().setStatus('Live');
        console.log('✅ AI session initialized successfully');
        if (!apiKey && !customModel) {
            console.log('ℹ️ Session started without user-provided API key (using environment or demo mode)');
        }
    } else {
        buddy.e().setStatus('Error: Failed to initialize AI session');
        console.error('❌ Failed to initialize AI session');
        console.error('❌ Check console for detailed error messages');
    }
}

// Listen for status updates
ipcRenderer.on('update-status', (event, status) => {
    console.log('Status update:', status);
    buddy.e().setStatus(status);
});

// Listen for responses
ipcRenderer.on('update-response', (event, response) => {
    console.log('Gemini response:', response);
    buddy.e().setResponse(response);
    // You can add UI elements to display the response if needed
});

async function startCapture() {
    try {
        // Reset pause states
        isAudioProcessingPaused = false;
        isScreenPaused = false;
        globalWindowsAudioSource = null;
        globalLinuxMicSource = null;
        if (globalLinuxMicAudioContext && globalLinuxMicAudioContext.state !== 'closed') {
            // Ensure previous Linux context is closed if startCapture is called multiple times
            // This might be aggressive if not handled carefully with session logic
            // For now, let's assume stopCapture cleans it up.
        }
        globalLinuxMicAudioContext = null;


        if (isMacOS) {
            // On macOS, use SystemAudioDump for audio and getDisplayMedia for screen
            console.log('Starting macOS capture with SystemAudioDump...');

            // Start macOS audio capture
            const audioResult = await ipcRenderer.invoke('start-macos-audio');
            if (!audioResult.success) {
                throw new Error('Failed to start macOS audio capture: ' + audioResult.error);
            }

            // Get screen capture for screenshots with higher frame rate for real-time streaming
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: REALTIME_VIDEO_FPS,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false, // Don't use browser audio on macOS
            });

            console.log('macOS screen capture started - audio handled by SystemAudioDump');
        } else if (isLinux) {
            // Linux - use display media for screen capture and getUserMedia for microphone
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: REALTIME_VIDEO_FPS,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false, // Don't use system audio loopback on Linux
            });

            // Get microphone input for Linux
            let micStream = null;
            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: SAMPLE_RATE,
                        channelCount: 1,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                    video: false,
                });

                console.log('Linux microphone capture started');
                setupLinuxMicProcessing(micStream); // Pass micStream
            } catch (micError) {
                console.warn('Failed to get microphone access on Linux:', micError);
                // Continue without microphone if permission denied
            }

            console.log('Linux screen capture started');
        } else {
            // Windows - use display media with loopback for system audio
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: REALTIME_VIDEO_FPS,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: {
                    sampleRate: SAMPLE_RATE,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            console.log('Windows capture started with loopback audio');
            setupWindowsLoopbackProcessing();
        }

        console.log('MediaStream obtained:', {
            hasVideo: mediaStream.getVideoTracks().length > 0,
            hasAudio: mediaStream.getAudioTracks().length > 0,
            videoTrack: mediaStream.getVideoTracks()[0]?.getSettings(),
        });

        // Start capturing screenshots every second for regular models
        if (screenshotInterval) clearInterval(screenshotInterval); // Clear previous interval if any
        screenshotInterval = setInterval(captureScreenshot, SCREENSHOT_INTERVAL);

        // Capture first screenshot immediately
        setTimeout(captureScreenshot, 100);
    } catch (err) {
        console.error('Error starting capture:', err);
        buddy.e().setStatus('error');
    }
}

function setupLinuxMicProcessing(micStream) { // Added micStream parameter
    // Setup microphone audio processing for Linux
    // Ensure previous context is closed if this is called multiple times without a full stopCapture
    if (globalLinuxMicAudioContext && globalLinuxMicAudioContext.state !== 'closed') {
        globalLinuxMicAudioContext.close();
    }
    globalLinuxMicAudioContext = new AudioContext({ sampleRate: SAMPLE_RATE }); // Assign to global
    globalLinuxMicSource = globalLinuxMicAudioContext.createMediaStreamSource(micStream); // Assign to global
    
    // Re-declare audioBuffer locally for this processor's scope
    let localAudioBuffer = []; // Renamed to avoid conflict with global audioBuffer if it's used elsewhere
    const samplesPerChunk = SAMPLE_RATE * AUDIO_CHUNK_DURATION;

    // Use a local processor instance, then assign to global audioProcessor
    const processor = globalLinuxMicAudioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);

    processor.onaudioprocess = async e => {
        if (isAudioProcessingPaused) return; // Check pause state
        const inputData = e.inputBuffer.getChannelData(0);
        localAudioBuffer.push(...inputData);

        while (localAudioBuffer.length >= samplesPerChunk) {
            const chunk = localAudioBuffer.splice(0, samplesPerChunk);
            const pcmData16 = convertFloat32ToInt16(chunk);
            const base64Data = arrayBufferToBase64(pcmData16.buffer);

            await ipcRenderer.invoke('send-audio-content', {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            });
        }
    };

    globalLinuxMicSource.connect(processor);
    processor.connect(globalLinuxMicAudioContext.destination);

    audioProcessor = processor; // Assign to global audioProcessor
}

function setupWindowsLoopbackProcessing() {
    // Setup audio processing for Windows loopback audio only
    // Ensure previous context is closed
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
    audioContext = new AudioContext({ sampleRate: SAMPLE_RATE }); // Global audioContext
    globalWindowsAudioSource = audioContext.createMediaStreamSource(mediaStream); // Assign to global
    
    // Re-declare audioBuffer locally
    let localAudioBuffer = []; // Renamed
    const samplesPerChunk = SAMPLE_RATE * AUDIO_CHUNK_DURATION;

    audioProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1); // Assign to global

    audioProcessor.onaudioprocess = async e => {
        if (isAudioProcessingPaused) return; // Check pause state
        const inputData = e.inputBuffer.getChannelData(0);
        localAudioBuffer.push(...inputData);

        while (localAudioBuffer.length >= samplesPerChunk) {
            const chunk = localAudioBuffer.splice(0, samplesPerChunk);
            const pcmData16 = convertFloat32ToInt16(chunk);
            const base64Data = arrayBufferToBase64(pcmData16.buffer);

            await ipcRenderer.invoke('send-audio-content', {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            });
        }
    };

    globalWindowsAudioSource.connect(audioProcessor);
    audioProcessor.connect(audioContext.destination);
}

// Real-time video streaming for Gemini 2.0 Live models
async function streamVideoFrame() {
    if (isScreenPaused || !isRealtimeVideoEnabled) return; // Check pause state and streaming flag
    if (!mediaStream) return;

    // Lazy init of video element
    if (!hiddenVideo) {
        hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = mediaStream;
        hiddenVideo.muted = true;
        hiddenVideo.playsInline = true;
        await hiddenVideo.play();

        await new Promise(resolve => {
            if (hiddenVideo.readyState >= 2) return resolve();
            hiddenVideo.onloadedmetadata = () => resolve();
        });

        // Lazy init of canvas based on video dimensions
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = hiddenVideo.videoWidth;
        offscreenCanvas.height = hiddenVideo.videoHeight;
        offscreenContext = offscreenCanvas.getContext('2d');
    }

    // Check if video is ready
    if (hiddenVideo.readyState < 2) {
        return; // Skip silently for real-time streaming
    }

    offscreenContext.drawImage(hiddenVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Check if image was drawn properly by sampling a pixel
    const imageData = offscreenContext.getImageData(0, 0, 1, 1);
    const isBlank = imageData.data.every((value, index) => {
        // Check if all pixels are black (0,0,0) or transparent
        return index === 3 ? true : value === 0;
    });

    if (isBlank) {
        return; // Skip silently for real-time streaming
    }

    try {
        // Use lower quality for real-time streaming to reduce bandwidth
        const base64Data = offscreenCanvas.toDataURL('image/jpeg', 0.6).split(',')[1];
        
        // Send video frame to AI provider
        const result = await ipcRenderer.invoke('send-video-content', {
            data: base64Data,
            mimeType: 'image/jpeg',
            isRealtime: true
        });

        if (!result.success && process.env.DEBUG_VIDEO === 'true') {
            console.error('Failed to send video frame:', result.error);
        }
    } catch (error) {
        if (process.env.DEBUG_VIDEO === 'true') {
            console.error('Error processing video frame:', error);
        }
    }
}

async function captureScreenshot() {
    if (isScreenPaused) return; // Check pause state
    console.log('Capturing screenshot...');
    if (!mediaStream) return;

    // Lazy init of video element
    if (!hiddenVideo) {
        hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = mediaStream;
        hiddenVideo.muted = true;
        hiddenVideo.playsInline = true;
        await hiddenVideo.play();

        await new Promise(resolve => {
            if (hiddenVideo.readyState >= 2) return resolve();
            hiddenVideo.onloadedmetadata = () => resolve();
        });

        // Lazy init of canvas based on video dimensions
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = hiddenVideo.videoWidth;
        offscreenCanvas.height = hiddenVideo.videoHeight;
        offscreenContext = offscreenCanvas.getContext('2d');
    }

    // Check if video is ready
    if (hiddenVideo.readyState < 2) {
        console.warn('Video not ready yet, skipping screenshot');
        return;
    }

    offscreenContext.drawImage(hiddenVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Check if image was drawn properly by sampling a pixel
    const imageData = offscreenContext.getImageData(0, 0, 1, 1);
    const isBlank = imageData.data.every((value, index) => {
        // Check if all pixels are black (0,0,0) or transparent
        return index === 3 ? true : value === 0;
    });

    if (isBlank) {
        console.warn('Screenshot appears to be blank/black');
    }

    offscreenCanvas.toBlob(
        async blob => {
            if (!blob) {
                console.error('Failed to create blob from canvas');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];

                // Validate base64 data
                if (!base64data || base64data.length < 100) {
                    console.error('Invalid base64 data generated');
                    return;
                }

                const result = await ipcRenderer.invoke('send-image-content', {
                    data: base64data,
                });

                if (!result.success) {
                    console.error('Failed to send image:', result.error);
                }
            };
            reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.8
    );
}

function stopCapture() {
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
    }
    
    if (videoStreamInterval) {
        clearInterval(videoStreamInterval);
        videoStreamInterval = null;
    }
    
    isRealtimeVideoEnabled = false;

    if (audioProcessor) {
        audioProcessor.disconnect();
        audioProcessor = null;
    }

    // Close Windows audio context
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
    }
    // Close Linux audio context
    if (globalLinuxMicAudioContext && globalLinuxMicAudioContext.state !== 'closed') {
        globalLinuxMicAudioContext.close();
        globalLinuxMicAudioContext = null;
    }
    
    globalWindowsAudioSource = null;
    globalLinuxMicSource = null;


    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }

    // Stop macOS audio capture if running
    if (isMacOS) {
        ipcRenderer.invoke('stop-macos-audio').catch(err => {
            console.error('Error stopping macOS audio:', err);
        });
    }

    // Clean up hidden elements
    if (hiddenVideo) {
        hiddenVideo.pause();
        hiddenVideo.srcObject = null;
        hiddenVideo = null;
    }
    offscreenCanvas = null;
    offscreenContext = null;
}

// Send text message to Gemini
async function sendTextMessage(text, screenshots = null) {
    if ((!text || text.trim().length === 0) && (!screenshots || screenshots.length === 0)) {
        console.warn('Cannot send empty text message without screenshots');
        return { success: false, error: 'Empty message' };
    }

    try {
        const messageData = { text: text || '' };
        
        // Add screenshots if provided
        if (screenshots && Array.isArray(screenshots) && screenshots.length > 0) {
            messageData.screenshots = screenshots;
        }
        
        const result = await ipcRenderer.invoke('send-text-message', messageData);
        if (result.success) {
            console.log('Text message sent successfully');
        } else {
            console.error('Failed to send text message:', result.error);
        }
        return result;
    } catch (error) {
        console.error('Error sending text message:', error);
        return { success: false, error: error.message };
    }
}

// Capture a single screenshot manually
async function captureScreenshot() {
    console.log('Capturing manual screenshot...');
    
    try {
        // If we don't have an active media stream, request one for screenshot
        let screenshotStream = mediaStream;
        let shouldStopStream = false;
        
        if (!screenshotStream) {
            screenshotStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 1,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });
            shouldStopStream = true;
        }

        // Create a temporary video element for the screenshot
        const tempVideo = document.createElement('video');
        tempVideo.srcObject = screenshotStream;
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        
        await tempVideo.play();
        
        // Wait for video to be ready
        await new Promise(resolve => {
            if (tempVideo.readyState >= 2) return resolve();
            tempVideo.onloadedmetadata = () => resolve();
        });

        // Create canvas for screenshot
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth;
        canvas.height = tempVideo.videoHeight;
        const context = canvas.getContext('2d');
        
        // Draw the current frame
        context.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        // Clean up
        tempVideo.pause();
        tempVideo.srcObject = null;
        
        if (shouldStopStream) {
            screenshotStream.getTracks().forEach(track => track.stop());
        }
        
        console.log('Screenshot captured successfully');
        return base64Data;
        
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        throw error;
    }
}

// Function to create image windows with consistent properties
async function createImageWindow(imageData, title = 'Screenshot') {
    try {
        const result = await ipcRenderer.invoke('create-image-window', imageData, title);
        if (result.success) {
            console.log('Image window created successfully');
            return result;
        } else {
            console.error('Failed to create image window:', result.error);
            // Fallback to window.open() if IPC fails
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                    <head><title>${title}</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                        <img src="data:image/jpeg;base64,${imageData}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                    </body>
                </html>
            `);
            return { success: true, fallback: true };
        }
    } catch (error) {
        console.error('Error creating image window:', error);
        // Fallback to window.open() if IPC fails
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>${title}</title></head>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                    <img src="data:image/jpeg;base64,${imageData}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                </body>
            </html>
        `);
        return { success: true, fallback: true };
    }
}

// Function to create any window with consistent properties
// Usage example:
// window.buddy.createConsistentWindow({
//     width: 800,
//     height: 600,
//     title: 'My Window',
//     webPreferences: { nodeIntegration: true }
// }).then(result => {
//     if (result.success) {
//         console.log('Window created with ID:', result.windowId);
//     }
// });
async function createConsistentWindow(options = {}) {
    try {
        const result = await ipcRenderer.invoke('create-consistent-window', options);
        if (result.success) {
            console.log('Consistent window created successfully');
            return result;
        } else {
            console.error('Failed to create consistent window:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Error creating consistent window:', error);
        return { success: false, error: error.message };
    }
}

// Test function to check environment variables
async function testEnvironmentKeys() {
    console.log('🧪 Testing environment key detection...');
    const providers = ['google', 'openai', 'anthropic', 'deepseek', 'openrouter'];
    
    for (const provider of providers) {
        try {
            const hasKey = await ipcRenderer.invoke('check-environment-key', provider);
            console.log(`🔑 ${provider}: ${hasKey ? '✅ Found' : '❌ Not found'}`);
        } catch (error) {
            console.error(`❌ Error checking ${provider}:`, error);
        }
    }
}

// Test function to initialize a specific model
async function testModelInitialization(provider, model) {
    console.log(`🧪 Testing model initialization: ${provider}/${model}`);
    try {
        const success = await initializeAI(provider, 'default', 'en-US', model);
        console.log(`🧪 Result: ${success ? '✅ Success' : '❌ Failed'}`);
        return success;
    } catch (error) {
        console.error(`❌ Error testing model:`, error);
        return false;
    }
}

window.buddy = {
    initializeAI,
    startCapture,
    stopCapture,
    sendTextMessage,
    captureScreenshot,
    testEnvironmentKeys,
    testModelInitialization,
    isLinux: isLinux,
    isMacOS: isMacOS,
    e: buddyElement,
    // Expose new functions
    pauseAudio,
    resumeAudio,
    pauseScreen,
    resumeScreen,
    enableRealtimeVideoStreaming,
    disableRealtimeVideoStreaming,
    createImageWindow, // Add the new function
    createConsistentWindow, // Add the general window creation function
    openExternal: async (url) => {
        try {
            const result = await ipcRenderer.invoke('open-external', url);
            return result;
        } catch (error) {
            console.error('Error opening external URL:', error);
            throw error;
        }
    },
    checkEnvironmentKey: async (provider) => {
        try {
            const result = await ipcRenderer.invoke('check-environment-key', provider);
            return result;
        } catch (error) {
            console.error('Error checking environment key:', error);
            return false;
        }
    },
};

// --- New Pause/Resume Functions ---
async function pauseAudio() {
    if (isAudioProcessingPaused) return;
    if (isMacOS) {
        await ipcRenderer.invoke('pause-macos-audio'); // Assumes 'pause-macos-audio' is implemented in main
    } else if (audioProcessor) {
        // No need to disconnect source from processor, just processor from destination
        // and stop processing via the isAudioProcessingPaused flag in onaudioprocess
        // audioProcessor.disconnect(); // This disconnects it from the destination
    }
    isAudioProcessingPaused = true;
    console.log('Audio processing paused');
}

async function resumeAudio() {
    if (!isAudioProcessingPaused) return;
    if (isMacOS) {
        await ipcRenderer.invoke('resume-macos-audio'); // Assumes 'resume-macos-audio' is implemented in main
    } else if (audioProcessor) {
        // Reconnection is tricky if processor was fully disconnected.
        // The flag isAudioProcessingPaused in onaudioprocess is the primary control.
        // If audioProcessor.disconnect() was called, we'd need to reconnect:
        // if (isLinux && globalLinuxMicSource && globalLinuxMicAudioContext) {
        //     globalLinuxMicSource.connect(audioProcessor);
        //     audioProcessor.connect(globalLinuxMicAudioContext.destination);
        // } else if (!isLinux && globalWindowsAudioSource && audioContext) { // Windows
        //     globalWindowsAudioSource.connect(audioProcessor);
        //     audioProcessor.connect(audioContext.destination);
        // }
    }
    isAudioProcessingPaused = false;
    console.log('Audio processing resumed');
}

function pauseScreen() {
    if (isScreenPaused) return;
    isScreenPaused = true;
    console.log('Screen capture paused');
}

function resumeScreen() {
    if (!isScreenPaused) return;
    isScreenPaused = false;
    console.log('Screen capture resumed');
}

// Enable real-time video streaming for Gemini 2.0 Live models
function enableRealtimeVideoStreaming() {
    if (isRealtimeVideoEnabled) return;
    
    isRealtimeVideoEnabled = true;
    
    // Clear existing screenshot interval and start video streaming
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
    }
    
    // Start real-time video streaming
    if (videoStreamInterval) clearInterval(videoStreamInterval);
    videoStreamInterval = setInterval(streamVideoFrame, REALTIME_VIDEO_INTERVAL);
    
    // Stream first frame immediately
    setTimeout(streamVideoFrame, 100);
    
    console.log(`Real-time video streaming enabled at ${REALTIME_VIDEO_FPS} FPS`);
}

// Disable real-time video streaming and return to regular screenshots
function disableRealtimeVideoStreaming() {
    if (!isRealtimeVideoEnabled) return;
    
    isRealtimeVideoEnabled = false;
    
    // Clear video streaming interval
    if (videoStreamInterval) {
        clearInterval(videoStreamInterval);
        videoStreamInterval = null;
    }
    
    // Restart regular screenshot interval
    if (screenshotInterval) clearInterval(screenshotInterval);
    screenshotInterval = setInterval(captureScreenshot, SCREENSHOT_INTERVAL);
    
    console.log('Real-time video streaming disabled, returning to regular screenshots');
}
// --- End New Pause/Resume Functions ---

// Function to capture screenshot and automatically send it to AI
async function captureAndSendScreenshot() {
    console.log('Capturing screenshot and analyzing with AI...');
    
    // Check if we have a buddy element and basic configuration
    const buddy = window.buddy.e();
    if (!buddy) {
        console.warn('Buddy element not found');
        return { success: false, error: 'Application not ready' };
    }

    // For real-time models, we need an active session
    // For non-realtime models, we just need a configured model
    const isRealTimeModel = buddy.isSelectedModelRealTime;
    
    if (isRealTimeModel && !buddy.sessionActive) {
        console.log('Real-time model requires active session - attempting to start one...');
        if (buddy.setStatus) {
            buddy.setStatus('Starting AI session...');
        }
        
        if (typeof buddy.autoStartSession === 'function') {
            const sessionStarted = await buddy.autoStartSession();
            if (!sessionStarted) {
                console.warn('Failed to start AI session automatically');
                if (buddy.setStatus) {
                    buddy.setStatus('Please configure and start a chat session first');
                }
                return { success: false, error: 'Could not start AI session' };
            }
            console.log('AI session started successfully');
        } else {
            console.warn('Cannot auto-start session');
            if (buddy.setStatus) {
                buddy.setStatus('Please start a chat session first');
            }
            return { success: false, error: 'No active AI session' };
        }
    } else if (!isRealTimeModel) {
        // For non-realtime models, just ensure we have a model selected
        if (!buddy.selectedModel) {
            console.warn('No model selected for screenshot analysis');
            if (buddy.setStatus) {
                buddy.setStatus('Please select a model first');
            }
            return { success: false, error: 'No model selected' };
        }
        
        // If no session is active, auto-initialize for non-realtime models
        if (!buddy.sessionActive) {
            console.log('Auto-initializing session for non-realtime model...');
            if (buddy.setStatus) {
                buddy.setStatus('Initializing AI...');
            }
            
            if (typeof buddy.autoStartSession === 'function') {
                const sessionStarted = await buddy.autoStartSession();
                if (!sessionStarted) {
                    console.warn('Failed to initialize AI for screenshot analysis');
                    if (buddy.setStatus) {
                        buddy.setStatus('Failed to initialize AI - check your configuration');
                    }
                    return { success: false, error: 'Could not initialize AI' };
                }
                console.log('AI initialized successfully for screenshot analysis');
            }
        }
    }
    
    try {
        // Capture the screenshot
        const screenshotData = await captureScreenshot();
        
        if (!screenshotData) {
            console.error('Failed to capture screenshot');
            return { success: false, error: 'Failed to capture screenshot' };
        }
        
        // Send the screenshot to AI with a concise screen analysis prompt
        const result = await sendTextMessage('🔍 **SCREEN ANALYZER**: Analyze this screenshot and provide concise, actionable insights.\n\n📋 **Format**:\n- 🎯 **What I see**: Brief summary\n- 💡 **Key Issue/Opportunity**: Main point\n- 🚀 **Solution**: Specific action to take\n- ⚡ **Next Step**: Immediate action\n\n💡 **Be concise, practical, and immediately actionable.**', [screenshotData]);
        
        if (result.success) {
            console.log('Screenshot analyzed and sent to AI');
            // Show a brief status message to the user
            const buddy = window.buddy.e();
            if (buddy && buddy.setStatus) {
                buddy.setStatus('Screen analyzed and sent to AI');
            }
        } else {
            console.error('Failed to analyze and send screenshot to AI:', result.error);
            const buddy = window.buddy.e();
            if (buddy && buddy.setStatus) {
                buddy.setStatus('Failed to analyze screen');
            }
        }
        
        return result;
        
    } catch (error) {
        console.error('Error in captureAndSendScreenshot:', error);
        const buddy = window.buddy.e();
        if (buddy && buddy.setStatus) {
            buddy.setStatus('Error capturing screenshot');
        }
        return { success: false, error: error.message };
    }
}

// Listen for the screenshot shortcut command from main process
ipcRenderer.on('capture-and-send-screenshot', async () => {
    await captureAndSendScreenshot();
});

// Add the function to the window.buddy object so it can be called from other components
window.buddy.captureAndSendScreenshot = captureAndSendScreenshot;

// Authentication functions
async function startGoogleAuth() {
    try {
        const result = await ipcRenderer.invoke('get-google-auth-url');
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Open the auth URL in the system browser
        await ipcRenderer.invoke('open-external', result.url);
        
        // For now, we'll need to handle the callback manually
        // In a production app, you'd want to set up a local server to handle the callback
        const authCode = await promptForAuthCode();
        
        if (authCode) {
            const authResult = await ipcRenderer.invoke('handle-google-auth-callback', authCode);
            if (authResult.success) {
                // Store the token
                localStorage.setItem('authToken', authResult.token);
                return {
                    success: true,
                    user: authResult.user,
                    token: authResult.token
                };
            } else {
                throw new Error(authResult.error);
            }
        } else {
            throw new Error('Authentication cancelled');
        }
    } catch (error) {
        console.error('Google auth error:', error);
        return { success: false, error: error.message };
    }
}

async function promptForAuthCode() {
    return new Promise((resolve) => {
        // Create a simple dialog to get the auth code
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--main-content-background);
            border: var(--glass-border);
            border-radius: 16px;
            padding: 30px;
            box-shadow: var(--glass-shadow);
            backdrop-filter: blur(20px);
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: var(--text-color); font-size: 18px; margin-bottom: 16px;">
                Complete Google Authentication
            </h3>
            <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 20px; line-height: 1.4;">
                After signing in with Google, you'll be redirected to a page with an authorization code. 
                Copy and paste that code here:
            </p>
            <input 
                type="text" 
                id="authCodeInput" 
                placeholder="Paste authorization code here"
                style="width: 100%; padding: 12px; border: var(--glass-border); border-radius: 8px; background: var(--input-background); color: var(--text-color); margin-bottom: 16px;"
            />
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button 
                    id="cancelAuth" 
                    style="padding: 10px 20px; background: transparent; border: var(--glass-border); border-radius: 8px; color: var(--text-color); cursor: pointer;"
                >
                    Cancel
                </button>
                <button 
                    id="submitAuth" 
                    style="padding: 10px 20px; background: #4285f4; border: none; border-radius: 8px; color: white; cursor: pointer;"
                >
                    Continue
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const input = dialog.querySelector('#authCodeInput');
        const submitBtn = dialog.querySelector('#submitAuth');
        const cancelBtn = dialog.querySelector('#cancelAuth');
        
        input.focus();
        
        submitBtn.addEventListener('click', () => {
            const code = input.value.trim();
            if (code) {
                document.body.removeChild(dialog);
                resolve(code);
            }
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            resolve(null);
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    });
}

async function verifyAuthToken(token) {
    try {
        const result = await ipcRenderer.invoke('verify-auth-token', token);
        return result;
    } catch (error) {
        console.error('Token verification error:', error);
        return { success: false, error: error.message };
    }
}

async function updateUserPreferences(preferences) {
    try {
        const result = await ipcRenderer.invoke('update-user-preferences', preferences);
        return result;
    } catch (error) {
        console.error('Update preferences error:', error);
        return { success: false, error: error.message };
    }
}

async function saveChatSession(sessionData) {
    try {
        const result = await ipcRenderer.invoke('save-chat-session', sessionData);
        return result;
    } catch (error) {
        console.error('Save session error:', error);
        return { success: false, error: error.message };
    }
}

async function getChatHistory(limit = 10) {
    try {
        const result = await ipcRenderer.invoke('get-chat-history', limit);
        return result;
    } catch (error) {
        console.error('Get history error:', error);
        return { success: false, error: error.message };
    }
}

async function deleteChatSession(sessionId) {
    try {
        const result = await ipcRenderer.invoke('delete-chat-session', sessionId);
        return result;
    } catch (error) {
        console.error('Delete session error:', error);
        return { success: false, error: error.message };
    }
}

async function logout() {
    try {
        localStorage.removeItem('authToken');
        const result = await ipcRenderer.invoke('logout');
        return result;
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

async function startGuestSession() {
    try {
        const result = await ipcRenderer.invoke('start-guest-session');
        return result;
    } catch (error) {
        console.error('Guest session error:', error);
        return { success: false, error: error.message };
    }
}

// Add authentication functions to window.buddy
window.buddy.startGoogleAuth = startGoogleAuth;
window.buddy.verifyAuthToken = verifyAuthToken;
window.buddy.updateUserPreferences = updateUserPreferences;
window.buddy.saveChatSession = saveChatSession;
window.buddy.getChatHistory = getChatHistory;
window.buddy.deleteChatSession = deleteChatSession;
window.buddy.logout = logout;
window.buddy.startGuestSession = startGuestSession;

// Test function for window creation (can be called from console)
window.buddy.testWindowCreation = async () => {
    console.log('Testing window creation...');
    
    // Test image window creation
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 transparent pixel
    const imageResult = await window.buddy.createImageWindow(testImageData, 'Test Image Window');
    console.log('Image window result:', imageResult);
    
    // Test consistent window creation
    const windowResult = await window.buddy.createConsistentWindow({
        width: 400,
        height: 300,
        title: 'Test Window'
    });
    console.log('Consistent window result:', windowResult);
    
    return { imageResult, windowResult };
};
