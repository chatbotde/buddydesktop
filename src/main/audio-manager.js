/**
 * Audio Capture Management
 * Handles macOS audio capture and processing
 */

const { spawn } = require('child_process');
const path = require('node:path');
const { app } = require('electron');
const { pcmToWav, analyzeAudioBuffer, saveDebugAudio, processRealtimeAudio } = require('../audioUtils');
const { AppState } = require('./app-config');
const { sendAudioToAI } = require('./ai-manager');

/**
 * Start macOS audio capture using SystemAudioDump
 */
function startMacOSAudioCapture() {
    if (process.platform !== 'darwin') return false;

    console.log('Starting macOS audio capture with SystemAudioDump...');

    let systemAudioPath;
    if (app.isPackaged) {
        systemAudioPath = path.join(process.resourcesPath, 'SystemAudioDump');
    } else {
        systemAudioPath = path.join(__dirname, '../SystemAudioDump');
    }

    console.log('SystemAudioDump path:', systemAudioPath);

    const systemAudioProc = spawn(systemAudioPath, [], {
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (!systemAudioProc.pid) {
        console.error('Failed to start SystemAudioDump');
        return false;
    }

    console.log('SystemAudioDump started with PID:', systemAudioProc.pid);

    const CHUNK_DURATION = 0.1;
    const SAMPLE_RATE = 24000;
    const BYTES_PER_SAMPLE = 2;
    const CHANNELS = 2;
    const CHUNK_SIZE = SAMPLE_RATE * BYTES_PER_SAMPLE * CHANNELS * CHUNK_DURATION;

    let audioBuffer = Buffer.alloc(0);

    // Update the audio callback to use the new system
    systemAudioProc.stdout.on('data', data => {
        audioBuffer = Buffer.concat([audioBuffer, data]);

        while (audioBuffer.length >= CHUNK_SIZE) {
            const chunk = audioBuffer.slice(0, CHUNK_SIZE);
            audioBuffer = audioBuffer.slice(CHUNK_SIZE);

            const monoChunk = CHANNELS === 2 ? convertStereoToMono(chunk) : chunk;

            try {
                // Process audio for optimal Gemini 2.0 realtime quality
                const processed = processRealtimeAudio(monoChunk, {
                    enableDebugging: !!process.env.DEBUG_AUDIO,
                });
                const base64Data = processed.buffer.toString('base64');
                sendAudioToAI(base64Data);
            } catch (error) {
                console.error('Error processing audio for realtime:', error);
                // Fallback to original processing
                const base64Data = monoChunk.toString('base64');
                sendAudioToAI(base64Data);
            }

            if (process.env.DEBUG_AUDIO) {
                console.log(`Processed audio chunk: ${chunk.length} bytes`);
                saveDebugAudio(monoChunk, 'system_audio');
            }
        }

        const maxBufferSize = SAMPLE_RATE * BYTES_PER_SAMPLE * 1;
        if (audioBuffer.length > maxBufferSize) {
            audioBuffer = audioBuffer.slice(-maxBufferSize);
        }
    });

    systemAudioProc.stderr.on('data', data => {
        console.error('SystemAudioDump stderr:', data.toString());
    });

    systemAudioProc.on('close', code => {
        console.log('SystemAudioDump process closed with code:', code);
        AppState.set('systemAudioProc', null);
    });

    systemAudioProc.on('error', err => {
        console.error('SystemAudioDump process error:', err);
        AppState.set('systemAudioProc', null);
    });

    // Update global state
    AppState.set('systemAudioProc', systemAudioProc);

    return true;
}

/**
 * Convert stereo audio buffer to mono
 */
function convertStereoToMono(stereoBuffer) {
    const samples = stereoBuffer.length / 4;
    const monoBuffer = Buffer.alloc(samples * 2);

    for (let i = 0; i < samples; i++) {
        const leftSample = stereoBuffer.readInt16LE(i * 4);
        monoBuffer.writeInt16LE(leftSample, i * 2);
    }

    return monoBuffer;
}

/**
 * Stop macOS audio capture
 */
function stopMacOSAudioCapture() {
    const systemAudioProc = AppState.get('systemAudioProc');
    if (systemAudioProc) {
        console.log('Stopping SystemAudioDump...');
        systemAudioProc.kill('SIGTERM');
        AppState.set('systemAudioProc', null);
    }
}

/**
 * Pause macOS audio capture
 */
function pauseMacOSAudioCapture() {
    const systemAudioProc = AppState.get('systemAudioProc');
    if (systemAudioProc) {
        systemAudioProc.kill('SIGSTOP'); // Pause the process
        console.log('macOS audio capture paused');
        return true;
    }
    return false;
}

/**
 * Resume macOS audio capture
 */
function resumeMacOSAudioCapture() {
    const systemAudioProc = AppState.get('systemAudioProc');
    if (systemAudioProc) {
        systemAudioProc.kill('SIGCONT'); // Resume the process
        console.log('macOS audio capture resumed');
        return true;
    }
    return false;
}

module.exports = {
    startMacOSAudioCapture,
    stopMacOSAudioCapture,
    pauseMacOSAudioCapture,
    resumeMacOSAudioCapture,
    convertStereoToMono
};
