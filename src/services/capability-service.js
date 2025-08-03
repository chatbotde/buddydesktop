/**
 * Capability Service - Manages UI element visibility based on model capabilities
 */

import { getModelById } from './models-service.js';

// Define capability types and their corresponding UI elements
export const CAPABILITY_TYPES = {
    VISION: 'vision',
    AUDIO: 'audio', 
    VIDEO: 'video',
    REALTIME: 'realtime',
    TEXT: 'text',
    CODE: 'code'
};

// Map capabilities to UI features
export const CAPABILITY_UI_MAP = {
    [CAPABILITY_TYPES.VISION]: [
        'screenshot-capture',
        'image-upload', 
        'image-paste',
        'image-drag-drop'
    ],
    [CAPABILITY_TYPES.AUDIO]: [
        'audio-capture',
        'audio-upload',
        'microphone-toggle'
    ],
    [CAPABILITY_TYPES.VIDEO]: [
        'screen-capture',
        'video-upload',
        'camera-capture'
    ],
    [CAPABILITY_TYPES.REALTIME]: [
        'realtime-video-streaming',
        'realtime-audio-streaming'
    ]
};

/**
 * Get model capabilities by model ID
 */
export function getModelCapabilities(modelId) {
    if (!modelId) return [];
    
    const model = getModelById(modelId);
    return model?.capabilities || [];
}

/**
 * Check if a model supports a specific capability
 */
export function hasCapability(modelId, capability) {
    const capabilities = getModelCapabilities(modelId);
    return capabilities.includes(capability);
}

/**
 * Check if a UI feature should be enabled for the current model
 */
export function isUIFeatureEnabled(modelId, uiFeature) {
    const capabilities = getModelCapabilities(modelId);
    
    // Find which capability this UI feature belongs to
    for (const [capability, features] of Object.entries(CAPABILITY_UI_MAP)) {
        if (features.includes(uiFeature)) {
            return capabilities.includes(capability);
        }
    }
    
    return false;
}

/**
 * Get all enabled UI features for a model
 */
export function getEnabledUIFeatures(modelId) {
    const capabilities = getModelCapabilities(modelId);
    const enabledFeatures = [];
    
    capabilities.forEach(capability => {
        const features = CAPABILITY_UI_MAP[capability] || [];
        enabledFeatures.push(...features);
    });
    
    return enabledFeatures;
}

/**
 * Get disabled UI features for a model (for showing user feedback)
 */
export function getDisabledUIFeatures(modelId) {
    const enabledFeatures = getEnabledUIFeatures(modelId);
    const allFeatures = Object.values(CAPABILITY_UI_MAP).flat();
    
    return allFeatures.filter(feature => !enabledFeatures.includes(feature));
}

/**
 * Get capability status for UI display
 */
export function getCapabilityStatus(modelId) {
    const capabilities = getModelCapabilities(modelId);
    const model = getModelById(modelId);
    
    return {
        modelName: model?.name || 'Unknown Model',
        hasVision: capabilities.includes(CAPABILITY_TYPES.VISION),
        hasAudio: capabilities.includes(CAPABILITY_TYPES.AUDIO),
        hasVideo: capabilities.includes(CAPABILITY_TYPES.VIDEO),
        hasRealtime: capabilities.includes(CAPABILITY_TYPES.REALTIME),
        hasText: capabilities.includes(CAPABILITY_TYPES.TEXT),
        hasCode: capabilities.includes(CAPABILITY_TYPES.CODE),
        capabilities,
        enabledFeatures: getEnabledUIFeatures(modelId),
        disabledFeatures: getDisabledUIFeatures(modelId)
    };
}

/**
 * Get user-friendly messages for disabled features
 */
export function getDisabledFeatureMessage(uiFeature, modelName) {
    const messages = {
        'screenshot-capture': `${modelName} doesn't support image analysis. Switch to a vision-capable model to capture screenshots.`,
        'image-upload': `${modelName} doesn't support image analysis. Switch to a vision-capable model to upload images.`,
        'image-paste': `${modelName} doesn't support image analysis. Switch to a vision-capable model to paste images.`,
        'image-drag-drop': `${modelName} doesn't support image analysis. Switch to a vision-capable model to drag & drop images.`,
        'audio-capture': `${modelName} doesn't support audio processing. Switch to an audio-capable model to capture audio.`,
        'audio-upload': `${modelName} doesn't support audio processing. Switch to an audio-capable model to upload audio files.`,
        'microphone-toggle': `${modelName} doesn't support audio processing. Switch to an audio-capable model to use microphone.`,
        'screen-capture': `${modelName} doesn't support video processing. Switch to a video-capable model to capture screen.`,
        'video-upload': `${modelName} doesn't support video processing. Switch to a video-capable model to upload videos.`,
        'camera-capture': `${modelName} doesn't support video processing. Switch to a video-capable model to use camera.`,
        'realtime-video-streaming': `${modelName} doesn't support real-time streaming. Switch to a real-time capable model for live video.`,
        'realtime-audio-streaming': `${modelName} doesn't support real-time streaming. Switch to a real-time capable model for live audio.`
    };
    
    return messages[uiFeature] || `This feature is not supported by ${modelName}.`;
}

/**
 * Get suggested models that support a specific capability
 */
export function getSuggestedModelsForCapability(capability) {
    // This would typically query all models, but for now we'll return some common ones
    const suggestions = {
        [CAPABILITY_TYPES.VISION]: ['gemini-2.5-pro', 'gemini-2.5-flash', 'claude-4-sonnet', 'gpt-4o'],
        [CAPABILITY_TYPES.AUDIO]: ['gemini-2.0-flash-live-001'],
        [CAPABILITY_TYPES.VIDEO]: ['gemini-2.0-flash-live-001'],
        [CAPABILITY_TYPES.REALTIME]: ['gemini-2.0-flash-live-001']
    };
    
    return suggestions[capability] || [];
}