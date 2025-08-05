/**
 * AI Provider Management
 * Handles AI session initialization, model mapping, and API key management
 */

const { createAIProvider } = require('../ai-providers');
const { AppState } = require('./app-config');

/**
 * Initialize AI session with provider and model
 */
async function initializeAISession(provider, apiKey, profile = 'default', language = 'en-US', model = '') {
    try {
        if (!model) {
            throw new Error('Model must be specified');
        }

        // If no API key provided, try to get from environment variables
        if (!apiKey || apiKey.trim() === '') {
            apiKey = getApiKeyFromEnvironment(provider);
            console.log(`🔑 Using environment API key for ${provider}:`, apiKey ? 'Found' : 'Not found');
            if (apiKey) {
                console.log(`🔑 Environment key found for ${provider}, length: ${apiKey.length} characters`);
            }
        } else {
            console.log(`🔑 Using provided API key for ${provider}, length: ${apiKey.length} characters`);
        }

        // Validate API key exists
        if (!apiKey || apiKey.trim() === '') {
            console.error(`❌ No API key found for ${provider}. Cannot initialize session.`);
            throw new Error(`No API key found for provider: ${provider}`);
        }

        // Map model IDs to actual API model names if needed
        const actualModelId = mapModelIdToApiModel(provider, model);
        console.log(`🔄 Model mapping: ${model} -> ${actualModelId}`);

        const currentAIProvider = createAIProvider(provider, apiKey, profile, language, actualModelId);
        const success = await currentAIProvider.initialize();
        
        // Update global state
        AppState.set('currentAIProvider', currentAIProvider);
        
        return success;
    } catch (error) {
        console.error('Failed to initialize AI session:', error);
        return false;
    }
}

/**
 * Get API key from environment variables
 */
function getApiKeyFromEnvironment(provider) {
    // Map provider names to common environment variable names
    const envKeyMap = {
        google: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
        openai: process.env.OPENAI_API_KEY,
        anthropic: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
        deepseek: process.env.DEEPSEEK_API_KEY,
        openrouter: process.env.OPENROUTER_API_KEY,
    };

    const apiKey = envKeyMap[provider] || null;
    console.log(`🔍 Environment check for ${provider}:`, {
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.substring(0, 10)}...` : 'Not set',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'Not set',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...` : 'Not set',
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? `${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...` : 'Not set',
        CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? `${process.env.CLAUDE_API_KEY.substring(0, 10)}...` : 'Not set',
        DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? `${process.env.DEEPSEEK_API_KEY.substring(0, 10)}...` : 'Not set',
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? `${process.env.OPENROUTER_API_KEY.substring(0, 10)}...` : 'Not set',
        selectedKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'None'
    });

    return apiKey;
}

/**
 * Map internal model IDs to actual API model names
 */
function mapModelIdToApiModel(provider, modelId) {
    // Map internal model IDs to actual API model names
    const modelMappings = {
        anthropic: {
            'claude-4-sonnet': 'claude-3-5-sonnet-20241022',
            'claude-4-opus': 'claude-3-opus-20240229',
            'claude-3.5-sonnet': 'claude-3-5-sonnet-20241022',
            'claude-sonnet-4-20250514': 'claude-3-5-sonnet-20241022',
            'claude-opus-4-20250514': 'claude-3-opus-20240229',
            'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022' // Already correct
        },
        google: {
            'gemini-2.5-pro': 'gemini-1.5-pro',
            'gemini-2.5-flash': 'gemini-1.5-flash',
            'gemini-2.5-flash-lite-preview-06-17': 'gemini-1.5-flash',
            'gemini-2.0-flash-live-001': 'gemini-2.0-flash-exp'
        },
        openai: {
            'gpt-4.1-2025-04-14': 'gpt-4o',
            'o4-mini-2025-04-16': 'gpt-4o-mini',
            'o3-2025-04-16': 'gpt-4o',
            'o3': 'gpt-4o',
            'gpt-4o': 'gpt-4o' // Already correct
        },
        deepseek: {
            'deepseek-chat': 'deepseek-chat',
            'deepseek-v3': 'deepseek-chat'
        },
        openrouter: {
            // OpenRouter models use their full path format
            'anthropic/claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
            'deepseek/deepseek-chat-v3-0324:free': 'deepseek/deepseek-chat-v3-0324:free',
            'openrouter/cypher-alpha:free': 'openrouter/cypher-alpha:free'
        }
    };

    const providerMappings = modelMappings[provider];
    if (providerMappings && providerMappings[modelId]) {
        return providerMappings[modelId];
    }

    // Return original model ID if no mapping found
    return modelId;
}

/**
 * Send audio data to AI provider
 */
async function sendAudioToAI(base64Data) {
    const currentAIProvider = AppState.get('currentAIProvider');
    if (!currentAIProvider) return;

    try {
        process.stdout.write('.');
        await currentAIProvider.sendRealtimeInput({
            audio: {
                data: base64Data,
                mimeType: 'audio/pcm;rate=24000',
            },
        });
    } catch (error) {
        console.error('Error sending audio to AI:', error);
    }
}

module.exports = {
    initializeAISession,
    getApiKeyFromEnvironment,
    mapModelIdToApiModel,
    sendAudioToAI
};
