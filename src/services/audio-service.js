// audio-service.js
const { ipcRenderer } = require('electron');

class AudioService {
    constructor() {
        this.mediaStream = null;
        this.audioContext = null;
        this.audioProcessor = null;
        this.audioBuffer = [];
        this.globalWindowsAudioSource = null;
        this.globalLinuxMicSource = null;
        this.globalLinuxMicAudioContext = null;
        this.isAudioProcessingPaused = false;
        
        // Constants
        this.SAMPLE_RATE = 24000;
        this.AUDIO_CHUNK_DURATION = 0.1; // seconds
        this.BUFFER_SIZE = 4096;
        
        // Platform detection
        this.isLinux = process.platform === 'linux';
        this.isMacOS = process.platform === 'darwin';
    }

    convertFloat32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            // Improved scaling to prevent clipping
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return int16Array;
    }

    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    async startMacOSAudio() {
        console.log('Starting macOS capture with SystemAudioDump...');
        const audioResult = await ipcRenderer.invoke('start-macos-audio');
        if (!audioResult.success) {
            throw new Error('Failed to start macOS audio capture: ' + audioResult.error);
        }
        return audioResult;
    }

    async setupLinuxMicProcessing(micStream) {
        // Setup microphone audio processing for Linux
        if (this.globalLinuxMicAudioContext && this.globalLinuxMicAudioContext.state !== 'closed') {
            this.globalLinuxMicAudioContext.close();
        }
        this.globalLinuxMicAudioContext = new AudioContext({ sampleRate: this.SAMPLE_RATE });
        this.globalLinuxMicSource = this.globalLinuxMicAudioContext.createMediaStreamSource(micStream);
        
        let localAudioBuffer = [];
        const samplesPerChunk = this.SAMPLE_RATE * this.AUDIO_CHUNK_DURATION;

        const processor = this.globalLinuxMicAudioContext.createScriptProcessor(this.BUFFER_SIZE, 1, 1);

        processor.onaudioprocess = async e => {
            if (this.isAudioProcessingPaused) return;
            const inputData = e.inputBuffer.getChannelData(0);
            localAudioBuffer.push(...inputData);

            while (localAudioBuffer.length >= samplesPerChunk) {
                const chunk = localAudioBuffer.splice(0, samplesPerChunk);
                const pcmData16 = this.convertFloat32ToInt16(chunk);
                const base64Data = this.arrayBufferToBase64(pcmData16.buffer);

                await ipcRenderer.invoke('send-audio-content', {
                    data: base64Data,
                    mimeType: 'audio/pcm;rate=24000',
                });
            }
        };

        this.globalLinuxMicSource.connect(processor);
        processor.connect(this.globalLinuxMicAudioContext.destination);

        this.audioProcessor = processor;
        return processor;
    }

    setupWindowsLoopbackProcessing(mediaStream) {
        // Setup audio processing for Windows loopback audio only
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.audioContext = new AudioContext({ sampleRate: this.SAMPLE_RATE });
        this.globalWindowsAudioSource = this.audioContext.createMediaStreamSource(mediaStream);
        
        let localAudioBuffer = [];
        const samplesPerChunk = this.SAMPLE_RATE * this.AUDIO_CHUNK_DURATION;

        this.audioProcessor = this.audioContext.createScriptProcessor(this.BUFFER_SIZE, 1, 1);

        this.audioProcessor.onaudioprocess = async e => {
            if (this.isAudioProcessingPaused) return;
            const inputData = e.inputBuffer.getChannelData(0);
            localAudioBuffer.push(...inputData);

            while (localAudioBuffer.length >= samplesPerChunk) {
                const chunk = localAudioBuffer.splice(0, samplesPerChunk);
                const pcmData16 = this.convertFloat32ToInt16(chunk);
                const base64Data = this.arrayBufferToBase64(pcmData16.buffer);

                await ipcRenderer.invoke('send-audio-content', {
                    data: base64Data,
                    mimeType: 'audio/pcm;rate=24000',
                });
            }
        };

        this.globalWindowsAudioSource.connect(this.audioProcessor);
        this.audioProcessor.connect(this.audioContext.destination);
    }

    async pauseAudio() {
        if (this.isAudioProcessingPaused) return;
        if (this.isMacOS) {
            await ipcRenderer.invoke('pause-macos-audio');
        }
        this.isAudioProcessingPaused = true;
        console.log('Audio processing paused');
    }

    async resumeAudio() {
        if (!this.isAudioProcessingPaused) return;
        if (this.isMacOS) {
            await ipcRenderer.invoke('resume-macos-audio');
        }
        this.isAudioProcessingPaused = false;
        console.log('Audio processing resumed');
    }

    stopAudio() {
        if (this.audioProcessor) {
            this.audioProcessor.disconnect();
            this.audioProcessor = null;
        }

        // Close Windows audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Close Linux audio context
        if (this.globalLinuxMicAudioContext && this.globalLinuxMicAudioContext.state !== 'closed') {
            this.globalLinuxMicAudioContext.close();
            this.globalLinuxMicAudioContext = null;
        }
        
        this.globalWindowsAudioSource = null;
        this.globalLinuxMicSource = null;

        // Stop macOS audio capture if running
        if (this.isMacOS) {
            ipcRenderer.invoke('stop-macos-audio').catch(err => {
                console.error('Error stopping macOS audio:', err);
            });
        }
    }
}

module.exports = AudioService;
