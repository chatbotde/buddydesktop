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

    // Screenshot methods
    async captureScreenshot() {
        return await this.videoService.captureManualScreenshot();
    }

    // Getters for services
    getAudioService() {
        return this.audioService;
    }

    getVideoService() {
        return this.videoService;
    }
}

module.exports = CaptureService;
