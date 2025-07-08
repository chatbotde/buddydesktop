/**
 * AudioFeature - Audio capture and processing feature
 * Demonstrates feature implementation with real-time capabilities
 */
import appCore from '../core/AppCore.js';

class AudioFeature {
    constructor() {
        this.enabled = false;
        this.isRecording = false;
        this.audioStream = null;
        this.audioContext = null;
        this.processor = null;
        this.sampleRate = 24000;
        this.channels = 1;
        this.eventBus = appCore.getService('eventBus');
    }

    /**
     * Initialize the feature
     */
    async initialize() {
        // Register feature with the feature manager
        appCore.registerFeature('audio', {
            name: 'Audio Capture',
            description: 'Capture and process audio input',
            version: '1.0.0',
            capabilities: ['audio', 'real-time', 'voice-processing'],
            config: {
                sampleRate: 24000,
                channels: 1,
                autoStart: false,
                noiseReduction: true
            },
            handlers: {
                start: this.start.bind(this),
                stop: this.stop.bind(this),
                pause: this.pause.bind(this),
                resume: this.resume.bind(this)
            },
            hooks: {
                'before-audio-start': this.beforeAudioStart.bind(this),
                'after-audio-start': this.afterAudioStart.bind(this),
                'audio-data': this.onAudioData.bind(this),
                'audio-error': this.onAudioError.bind(this)
            }
        });

        // Subscribe to events
        this.eventBus.on('audio:start', this.handleStartEvent.bind(this));
        this.eventBus.on('audio:stop', this.handleStopEvent.bind(this));
        this.eventBus.on('audio:pause', this.handlePauseEvent.bind(this));
        this.eventBus.on('audio:resume', this.handleResumeEvent.bind(this));

        console.log('AudioFeature initialized');
    }

    /**
     * Start audio capture
     * @param {Object} options - Audio options
     */
    async start(options = {}) {
        if (this.isRecording) {
            console.warn('Audio is already recording');
            return;
        }

        try {
            // Execute before-audio-start hooks
            await appCore.executeHook('before-audio-start', options);

            // Get audio stream
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: options.sampleRate || this.sampleRate,
                    channelCount: options.channels || this.channels,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(this.audioStream);

            // Create processor for real-time processing
            this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

            this.processor.onaudioprocess = (event) => {
                const inputBuffer = event.inputBuffer;
                const inputData = inputBuffer.getChannelData(0);

                // Process audio data
                this.processAudioData(inputData);
            };

            // Connect audio nodes
            source.connect(this.processor);
            this.processor.connect(this.audioContext.destination);

            this.isRecording = true;

            // Execute after-audio-start hooks
            await appCore.executeHook('after-audio-start', { 
                sampleRate: this.audioContext.sampleRate,
                channels: this.channels 
            });

            // Emit event
            this.eventBus.emit('audio:started', {
                sampleRate: this.audioContext.sampleRate,
                channels: this.channels
            });

            console.log('Audio capture started');

        } catch (error) {
            console.error('Failed to start audio capture:', error);
            this.eventBus.emit('audio:error', { error: error.message });
            throw error;
        }
    }

    /**
     * Stop audio capture
     */
    async stop() {
        if (!this.isRecording) {
            console.warn('Audio is not recording');
            return;
        }

        try {
            // Stop audio stream
            if (this.audioStream) {
                this.audioStream.getTracks().forEach(track => track.stop());
                this.audioStream = null;
            }

            // Close audio context
            if (this.audioContext) {
                await this.audioContext.close();
                this.audioContext = null;
            }

            this.processor = null;
            this.isRecording = false;

            // Emit event
            this.eventBus.emit('audio:stopped', {});

            console.log('Audio capture stopped');

        } catch (error) {
            console.error('Failed to stop audio capture:', error);
            this.eventBus.emit('audio:error', { error: error.message });
            throw error;
        }
    }

    /**
     * Pause audio capture
     */
    async pause() {
        if (!this.isRecording) return;

        try {
            if (this.audioContext) {
                await this.audioContext.suspend();
            }

            this.eventBus.emit('audio:paused', {});
            console.log('Audio capture paused');

        } catch (error) {
            console.error('Failed to pause audio capture:', error);
            this.eventBus.emit('audio:error', { error: error.message });
        }
    }

    /**
     * Resume audio capture
     */
    async resume() {
        if (!this.isRecording) return;

        try {
            if (this.audioContext) {
                await this.audioContext.resume();
            }

            this.eventBus.emit('audio:resumed', {});
            console.log('Audio capture resumed');

        } catch (error) {
            console.error('Failed to resume audio capture:', error);
            this.eventBus.emit('audio:error', { error: error.message });
        }
    }

    /**
     * Process audio data
     * @param {Float32Array} audioData - Raw audio data
     */
    processAudioData(audioData) {
        try {
            // Convert to Int16 for compatibility
            const int16Data = new Int16Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                int16Data[i] = Math.round(audioData[i] * 32767);
            }

            // Execute audio-data hooks
            appCore.executeHook('audio-data', {
                data: int16Data,
                sampleRate: this.audioContext.sampleRate,
                timestamp: Date.now()
            });

            // Emit processed audio data
            this.eventBus.emit('audio:data', {
                data: int16Data,
                sampleRate: this.audioContext.sampleRate,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error('Failed to process audio data:', error);
            this.eventBus.emit('audio:error', { error: error.message });
        }
    }

    /**
     * Before audio start hook
     * @param {Object} data - Hook data
     */
    async beforeAudioStart(data) {
        console.log('Before audio start:', data);
        // Could add permissions check, device validation, etc.
    }

    /**
     * After audio start hook
     * @param {Object} data - Hook data
     */
    async afterAudioStart(data) {
        console.log('After audio start:', data);
        // Could add audio analysis, quality check, etc.
    }

    /**
     * Audio data hook
     * @param {Object} data - Hook data
     */
    async onAudioData(data) {
        // Could add noise reduction, voice activity detection, etc.
        console.log('Audio data received:', data.data.length, 'samples');
    }

    /**
     * Audio error hook
     * @param {Object} data - Hook data
     */
    async onAudioError(data) {
        console.error('Audio error:', data.error);
    }

    /**
     * Handle start event
     * @param {Object} data - Event data
     */
    async handleStartEvent(data) {
        await this.start(data.options);
    }

    /**
     * Handle stop event
     * @param {Object} data - Event data
     */
    async handleStopEvent(data) {
        await this.stop();
    }

    /**
     * Handle pause event
     * @param {Object} data - Event data
     */
    async handlePauseEvent(data) {
        await this.pause();
    }

    /**
     * Handle resume event
     * @param {Object} data - Event data
     */
    async handleResumeEvent(data) {
        await this.resume();
    }

    /**
     * Get audio statistics
     * @returns {Object} Audio statistics
     */
    getStats() {
        return {
            enabled: this.enabled,
            isRecording: this.isRecording,
            sampleRate: this.audioContext?.sampleRate || this.sampleRate,
            channels: this.channels
        };
    }

    /**
     * Cleanup the feature
     */
    async cleanup() {
        if (this.isRecording) {
            await this.stop();
        }
        
        this.eventBus.off('audio:start', this.handleStartEvent);
        this.eventBus.off('audio:stop', this.handleStopEvent);
        this.eventBus.off('audio:pause', this.handlePauseEvent);
        this.eventBus.off('audio:resume', this.handleResumeEvent);
        
        console.log('AudioFeature cleaned up');
    }
}

export default AudioFeature; 