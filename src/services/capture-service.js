// capture-service.js
const AudioService = require('./audio-service');
const VideoService = require('./video-service');

class CaptureService {
    constructor() {
        this.audioService = new AudioService();
        this.videoService = new VideoService();
        this.isLinux = process.platform === 'linux';
        this.isMacOS = process.platform === 'darwin';
    }

    async startCapture() {
        try {
            // Reset pause states
            this.audioService.isAudioProcessingPaused = false;
            this.videoService.isScreenPaused = false;
            this.audioService.globalWindowsAudioSource = null;
            this.audioService.globalLinuxMicSource = null;
            this.audioService.globalLinuxMicAudioContext = null;

            if (this.isMacOS) {
                // On macOS, use SystemAudioDump for audio and getDisplayMedia for screen
                console.log('Starting macOS capture with SystemAudioDump...');

                // Start macOS audio capture
                await this.audioService.startMacOSAudio();

                // Get screen capture for screenshots with higher frame rate for real-time streaming
                const mediaStream = await this.videoService.getDisplayMedia({
                    audio: false, // Don't use browser audio on macOS
                });

                this.videoService.setMediaStream(mediaStream);
                await this.videoService.initVideoElement(mediaStream);

                console.log('macOS screen capture started - audio handled by SystemAudioDump');
            } else if (this.isLinux) {
                // Linux - use display media for screen capture and getUserMedia for microphone
                const mediaStream = await this.videoService.getDisplayMedia({
                    audio: false, // Don't use system audio loopback on Linux
                });

                this.videoService.setMediaStream(mediaStream);
                await this.videoService.initVideoElement(mediaStream);

                // Get microphone input for Linux
                let micStream = null;
                try {
                    micStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            sampleRate: this.audioService.SAMPLE_RATE,
                            channelCount: 1,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                        },
                        video: false,
                    });

                    console.log('Linux microphone capture started');
                    await this.audioService.setupLinuxMicProcessing(micStream);
                } catch (micError) {
                    console.warn('Failed to get microphone access on Linux:', micError);
                    // Continue without microphone if permission denied
                }

                console.log('Linux screen capture started');
            } else {
                // Windows - use display media with loopback for system audio
                const mediaStream = await this.videoService.getDisplayMedia({
                    audio: {
                        sampleRate: this.audioService.SAMPLE_RATE,
                        channelCount: 1,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                });

                this.videoService.setMediaStream(mediaStream);
                await this.videoService.initVideoElement(mediaStream);

                console.log('Windows capture started with loopback audio');
                this.audioService.setupWindowsLoopbackProcessing(mediaStream);
            }

            const mediaStream = this.videoService.getMediaStream();
            console.log('MediaStream obtained:', {
                hasVideo: mediaStream.getVideoTracks().length > 0,
                hasAudio: mediaStream.getAudioTracks().length > 0,
                videoTrack: mediaStream.getVideoTracks()[0]?.getSettings(),
            });

            // Start capturing screenshots every second for regular models
            this.videoService.startScreenshotInterval();

        } catch (err) {
            console.error('Error starting capture:', err);
            const buddy = document.getElementById('buddy');
            if (buddy && buddy.setStatus) {
                buddy.setStatus('error');
            }
        }
    }

    stopCapture() {
        this.videoService.stopVideo();
        this.audioService.stopAudio();
    }

    // Pause/Resume methods
    async pauseAudio() {
        await this.audioService.pauseAudio();
    }

    async resumeAudio() {
        await this.audioService.resumeAudio();
    }

    pauseScreen() {
        this.videoService.pauseScreen();
    }

    resumeScreen() {
        this.videoService.resumeScreen();
    }

    // Real-time video streaming methods
    enableRealtimeVideoStreaming() {
        this.videoService.enableRealtimeVideoStreaming();
    }

    disableRealtimeVideoStreaming() {
        this.videoService.disableRealtimeVideoStreaming();
    }

    // Real-time live model streaming
    async startLiveStreaming(options = {}) {
        try {
            console.log('🎥 Starting live streaming for real-time model...');
            
            // First start capture if not already started
            await this.startCapture();
            
            // Enable real-time video streaming
            this.enableRealtimeVideoStreaming();
            
            // Enable continuous audio streaming (already handled by startCapture)
            console.log('✅ Live streaming started successfully');
            
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to start live streaming:', error);
            return { success: false, error: error.message };
        }
    }

    async stopLiveStreaming() {
        try {
            console.log('⏹️ Stopping live streaming...');
            
            // Disable real-time video streaming
            this.disableRealtimeVideoStreaming();
            
            // Stop all capture
            this.stopCapture();
            
            console.log('✅ Live streaming stopped successfully');
            
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to stop live streaming:', error);
            return { success: false, error: error.message };
        }
    }

    // Screenshot methods
    async captureScreenshot() {
        try {
            // First try the video service method (if capture is active)
            return await this.videoService.captureManualScreenshot();
        } catch (error) {
            console.warn('Video service screenshot failed, trying native capture:', error);
            
            // Fallback to native Electron screenshot
            try {
                const { ipcRenderer } = require('electron');
                const result = await ipcRenderer.invoke('capture-native-screenshot');
                
                if (result.success) {
                    console.log('Native screenshot captured successfully');
                    return result.data;
                } else {
                    throw new Error(result.error);
                }
            } catch (nativeError) {
                console.error('Native screenshot also failed:', nativeError);
                throw new Error(`All screenshot methods failed. Last error: ${nativeError.message}`);
            }
        }
    }

    // Getters for services
    getAudioService() {
        return this.audioService;
    }

    getVideoService() {
        return this.videoService;
    }

    // Test function for screenshot capture
    async testScreenshotCapture() {
        console.log('Testing screenshot capture methods...');
        
        const results = {
            videoService: null,
            nativeCapture: null,
            finalResult: null
        };

        // Test 1: Video service method
        try {
            console.log('Testing video service screenshot...');
            const videoData = await this.videoService.captureManualScreenshot();
            results.videoService = {
                success: true,
                hasData: !!videoData,
                dataSize: videoData ? `${Math.round(videoData.length / 1000)}KB` : 'N/A'
            };
            console.log('Video service screenshot result:', results.videoService);
        } catch (error) {
            results.videoService = {
                success: false,
                error: error.message
            };
            console.log('Video service screenshot failed:', error.message);
        }

        // Test 2: Native capture method
        try {
            console.log('Testing native screenshot capture...');
            const { ipcRenderer } = require('electron');
            const nativeResult = await ipcRenderer.invoke('capture-native-screenshot');
            results.nativeCapture = {
                success: nativeResult.success,
                hasData: !!nativeResult.data,
                dataSize: nativeResult.data ? `${Math.round(nativeResult.data.length / 1000)}KB` : 'N/A',
                error: nativeResult.error
            };
            console.log('Native screenshot result:', results.nativeCapture);
        } catch (error) {
            results.nativeCapture = {
                success: false,
                error: error.message
            };
            console.log('Native screenshot failed:', error.message);
        }

        // Test 3: Main capture method (with fallback)
        try {
            console.log('Testing main captureScreenshot method...');
            const finalData = await this.captureScreenshot();
            results.finalResult = {
                success: true,
                hasData: !!finalData,
                dataSize: finalData ? `${Math.round(finalData.length / 1000)}KB` : 'N/A'
            };
            console.log('Main capture method result:', results.finalResult);

            // If successful, try to display the screenshot
            if (finalData && window.buddy?.windowService) {
                await window.buddy.windowService.createImageWindow(finalData, 'Screenshot Test');
            }
        } catch (error) {
            results.finalResult = {
                success: false,
                error: error.message
            };
            console.log('Main capture method failed:', error.message);
        }

        console.log('Screenshot test complete. Summary:', results);
        return results;
    }
}

module.exports = CaptureService;
