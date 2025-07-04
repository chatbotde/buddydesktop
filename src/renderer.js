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

async function initializeAI(provider = 'google', profile = 'interview', language = 'en-US', model = '') {
    const apiKey = localStorage.getItem(`apiKey_${provider}`)?.trim();
    
    // Always attempt to initialize, even without API key
    // The main process will handle environment variables and fallbacks
    const success = await ipcRenderer.invoke(
        'initialize-ai',
        provider,
        apiKey || '', // Pass empty string if no API key
        localStorage.getItem('customPrompt') || '',
        profile,
        language,
        model // Pass the model to the main process
    );
    
    if (success) {
        buddy.e().setStatus('Live');
        if (!apiKey) {
            console.log('Session started without user-provided API key (using environment or demo mode)');
        }
    } else {
        buddy.e().setStatus('error');
        console.error('Failed to initialize AI session');
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

window.buddy = {
    initializeAI,
    startCapture,
    stopCapture,
    sendTextMessage,
    captureScreenshot,
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
    console.log('Capturing screenshot and auto-sending to AI...');
    
    try {
        // Capture the screenshot
        const screenshotData = await captureScreenshot();
        
        if (!screenshotData) {
            console.error('Failed to capture screenshot');
            return { success: false, error: 'Failed to capture screenshot' };
        }
        
        // Send the screenshot to AI with a comprehensive coding-focused prompt
        const result = await sendTextMessage('🔧 CODE ANALYZER: Analyze this screenshot and provide comprehensive coding solutions.\n\n📋 Requirements:\n1. If you see coding errors/bugs - provide the EXACT corrected code\n2. Show MULTIPLE different approaches/methods to solve the problem\n3. Include well-written, clean, and optimized code examples\n4. Provide alternative solutions (different algorithms, patterns, or techniques)\n5. Add brief explanations for each approach\n6. Include best practices and performance considerations\n\n💻 Format your response with:\n- ✅ Direct fix for immediate problem\n- 🔄 Alternative Method 1 (with code)\n- 🔄 Alternative Method 2 (with code) \n- 🔄 Alternative Method 3 (if applicable)\n- 💡 Best practices & optimization tips\n\nBe comprehensive but concise. Focus on actionable, copy-paste ready code solutions.', [screenshotData]);
        
        if (result.success) {
            console.log('Screenshot sent successfully to AI');
            // Show a brief status message to the user
            const buddy = window.buddy.e();
            if (buddy && buddy.setStatus) {
                buddy.setStatus('Screenshot captured and sent to AI');
            }
        } else {
            console.error('Failed to send screenshot to AI:', result.error);
            const buddy = window.buddy.e();
            if (buddy && buddy.setStatus) {
                buddy.setStatus('Failed to send screenshot to AI');
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
