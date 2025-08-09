// video-service.js
const { ipcRenderer } = require('electron');

class VideoService {
    constructor() {
        this.mediaStream = null;
        this.screenshotInterval = null;
        this.videoStreamInterval = null;
        this.hiddenVideo = null;
        this.offscreenCanvas = null;
        this.offscreenContext = null;
        this.isScreenPaused = false;
        this.isRealtimeVideoEnabled = false;
        
        // Constants
        this.REALTIME_VIDEO_FPS = 8;
        this.REALTIME_VIDEO_INTERVAL = 1000 / this.REALTIME_VIDEO_FPS; // ~125ms
        this.SCREENSHOT_INTERVAL = 1000; // 1 second for regular screenshots
    }

    async getDisplayMedia(options = {}) {
        const defaultOptions = {
            video: {
                frameRate: this.REALTIME_VIDEO_FPS,
                width: { ideal: 1920 },
                height: { ideal: 1080 },
            },
            audio: false,
            ...options
        };

        return await navigator.mediaDevices.getDisplayMedia(defaultOptions);
    }

    async initVideoElement(mediaStream) {
        if (!this.hiddenVideo) {
            this.hiddenVideo = document.createElement('video');
            this.hiddenVideo.srcObject = mediaStream;
            this.hiddenVideo.muted = true;
            this.hiddenVideo.playsInline = true;
            await this.hiddenVideo.play();

            await new Promise(resolve => {
                if (this.hiddenVideo.readyState >= 2) return resolve();
                this.hiddenVideo.onloadedmetadata = () => resolve();
            });

            // Initialize canvas based on video dimensions
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCanvas.width = this.hiddenVideo.videoWidth;
            this.offscreenCanvas.height = this.hiddenVideo.videoHeight;
            this.offscreenContext = this.offscreenCanvas.getContext('2d');
        }
    }

    isVideoReady() {
        return this.hiddenVideo && this.hiddenVideo.readyState >= 2;
    }

    isImageBlank(imageData) {
        return imageData.data.every((value, index) => {
            // Check if all pixels are black (0,0,0) or transparent
            return index === 3 ? true : value === 0;
        });
    }

    async streamVideoFrame() {
        if (this.isScreenPaused || !this.isRealtimeVideoEnabled) return;
        if (!this.mediaStream || !this.isVideoReady()) return;

        this.offscreenContext.drawImage(this.hiddenVideo, 0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

        // Check if image was drawn properly by sampling a pixel
        const imageData = this.offscreenContext.getImageData(0, 0, 1, 1);
        if (this.isImageBlank(imageData)) {
            return; // Skip silently for real-time streaming
        }

        try {
            // Use lower quality for real-time streaming to reduce bandwidth
            const base64Data = this.offscreenCanvas.toDataURL('image/jpeg', 0.6).split(',')[1];
            
            // Send video frame to AI provider using the live streaming IPC
            const result = await ipcRenderer.invoke('send-video-frame', {
                data: base64Data,
                timestamp: Date.now()
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

    async captureScreenshot() {
        if (this.isScreenPaused) return;
        console.log('Capturing screenshot...');
        
        if (!this.mediaStream || !this.isVideoReady()) {
            console.warn('Video not ready yet, skipping screenshot');
            return;
        }

        this.offscreenContext.drawImage(this.hiddenVideo, 0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

        // Check if image was drawn properly
        const imageData = this.offscreenContext.getImageData(0, 0, 1, 1);
        if (this.isImageBlank(imageData)) {
            console.warn('Screenshot appears to be blank/black');
        }

        return new Promise((resolve, reject) => {
            this.offscreenCanvas.toBlob(
                async blob => {
                    if (!blob) {
                        console.error('Failed to create blob from canvas');
                        reject(new Error('Failed to create blob from canvas'));
                        return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const base64data = reader.result.split(',')[1];

                        // Validate base64 data
                        if (!base64data || base64data.length < 100) {
                            console.error('Invalid base64 data generated');
                            reject(new Error('Invalid base64 data generated'));
                            return;
                        }

                        const result = await ipcRenderer.invoke('send-image-content', {
                            data: base64data,
                        });

                        if (!result.success) {
                            console.error('Failed to send image:', result.error);
                            reject(new Error(result.error));
                        } else {
                            resolve(result);
                        }
                    };
                    reader.readAsDataURL(blob);
                },
                'image/jpeg',
                0.8
            );
        });
    }

    async captureManualScreenshot() {
        console.log('Capturing manual screenshot...');
        
        try {
            // If we have an active media stream and video element, use it directly
            if (this.mediaStream && this.isVideoReady()) {
                console.log('Using existing media stream for screenshot');
                
                // Draw current frame to canvas
                this.offscreenContext.drawImage(this.hiddenVideo, 0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
                
                // Check if image was drawn properly
                const imageData = this.offscreenContext.getImageData(0, 0, 1, 1);
                if (this.isImageBlank(imageData)) {
                    console.warn('Screenshot appears to be blank/black, trying with new stream');
                } else {
                    // Convert to base64 and return
                    const base64Data = this.offscreenCanvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                    console.log('Screenshot captured successfully from existing stream');
                    return base64Data;
                }
            }

            // If no active stream or blank image, request a new one for screenshot
            console.log('Requesting new display media for screenshot');
            const screenshotStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 1,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

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
            screenshotStream.getTracks().forEach(track => track.stop());
            
            console.log('Screenshot captured successfully from new stream');
            return base64Data;
            
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            
            // If user cancels or permission denied, provide helpful error
            if (error.name === 'NotAllowedError') {
                throw new Error('Screen capture permission denied. Please allow screen sharing.');
            } else if (error.name === 'AbortError') {
                throw new Error('Screen capture was cancelled.');
            } else {
                throw new Error(`Failed to capture screenshot: ${error.message}`);
            }
        }
    }

    startScreenshotInterval() {
        if (this.screenshotInterval) clearInterval(this.screenshotInterval);
        this.screenshotInterval = setInterval(() => this.captureScreenshot(), this.SCREENSHOT_INTERVAL);
        
        // Capture first screenshot immediately
        setTimeout(() => this.captureScreenshot(), 100);
    }

    enableRealtimeVideoStreaming() {
        if (this.isRealtimeVideoEnabled) return;
        
        this.isRealtimeVideoEnabled = true;
        
        // Clear existing screenshot interval and start video streaming
        if (this.screenshotInterval) {
            clearInterval(this.screenshotInterval);
            this.screenshotInterval = null;
        }
        
        // Start real-time video streaming
        if (this.videoStreamInterval) clearInterval(this.videoStreamInterval);
        this.videoStreamInterval = setInterval(() => this.streamVideoFrame(), this.REALTIME_VIDEO_INTERVAL);
        
        // Stream first frame immediately
        setTimeout(() => this.streamVideoFrame(), 100);
        
        console.log(`Real-time video streaming enabled at ${this.REALTIME_VIDEO_FPS} FPS`);
    }

    disableRealtimeVideoStreaming() {
        if (!this.isRealtimeVideoEnabled) return;
        
        this.isRealtimeVideoEnabled = false;
        
        // Clear video streaming interval
        if (this.videoStreamInterval) {
            clearInterval(this.videoStreamInterval);
            this.videoStreamInterval = null;
        }
        
        // Restart regular screenshot interval
        this.startScreenshotInterval();
        
        console.log('Real-time video streaming disabled, returning to regular screenshots');
    }


    pauseScreen() {
        if (this.isScreenPaused) return;
        this.isScreenPaused = true;
        console.log('Screen capture paused');
    }

    resumeScreen() {
        if (!this.isScreenPaused) return;
        this.isScreenPaused = false;
        console.log('Screen capture resumed');
    }

    stopVideo() {
        if (this.screenshotInterval) {
            clearInterval(this.screenshotInterval);
            this.screenshotInterval = null;
        }
        
        if (this.videoStreamInterval) {
            clearInterval(this.videoStreamInterval);
            this.videoStreamInterval = null;
        }
        
        this.isRealtimeVideoEnabled = false;

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        // Clean up hidden elements
        if (this.hiddenVideo) {
            this.hiddenVideo.pause();
            this.hiddenVideo.srcObject = null;
            this.hiddenVideo = null;
        }
        this.offscreenCanvas = null;
        this.offscreenContext = null;
    }

    setMediaStream(stream) {
        this.mediaStream = stream;
    }

    getMediaStream() {
        return this.mediaStream;
    }
}

module.exports = VideoService;
