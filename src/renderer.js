// renderer.js
const { ipcRenderer } = require('electron');

let mediaStream = null;
let screenshotInterval = null;
let audioContext = null; // Used for Windows loopback audio
let audioProcessor = null; // ScriptProcessorNode (Windows loopback or Linux mic)
let micAudioProcessor = null; // This variable seems to be unused globally, setupLinuxMicProcessing assigns to global audioProcessor
let audioBuffer = []; // This is re-declared in setupLinuxMicProcessing and setupWindowsLoopbackProcessing, consider scope.
const SAMPLE_RATE = 24000;
const AUDIO_CHUNK_DURATION = 0.1; // seconds
const BUFFER_SIZE = 4096; // Increased buffer size for smoother audio

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
    if (apiKey) {
        const success = await ipcRenderer.invoke(
            'initialize-ai',
            provider,
            apiKey,
            localStorage.getItem('customPrompt') || '',
            profile,
            language,
            model // Pass the model to the main process
        );
        if (success) {
            buddy.e().setStatus('Live');
        } else {
            buddy.e().setStatus('error');
        }
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

            // Get screen capture for screenshots
            mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 1,
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
                    frameRate: 1,
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
                    frameRate: 1,
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

        // Start capturing screenshots every second
        if (screenshotInterval) clearInterval(screenshotInterval); // Clear previous interval if any
        screenshotInterval = setInterval(captureScreenshot, 1000);

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
    // The isScreenPaused flag in captureScreenshot is the primary control.
    // Clearing interval is good if we want to fully stop it.
    // if (screenshotInterval) {
    //     clearInterval(screenshotInterval);
    //     screenshotInterval = null;
    // }
    isScreenPaused = true;
    console.log('Screen capture paused');
}

function resumeScreen() {
    if (!isScreenPaused) return;
    // if (!screenshotInterval && mediaStream && mediaStream.getVideoTracks().length > 0) {
    //     screenshotInterval = setInterval(captureScreenshot, 1000);
    //     setTimeout(captureScreenshot, 100); // Immediate capture
    // }
    isScreenPaused = false;
    console.log('Screen capture resumed');
}
// --- End New Pause/Resume Functions ---
