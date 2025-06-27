const models = [
    // Google Models
    {
        id: 'gemini-2.0-pro',
        name: 'Gemini 2.0 Pro',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Gemini 2.0 Pro is a large language model developed by Google with text and image capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.0-pro',
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Gemini 2.5 Pro is a large language model developed by Google with text and image capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.5-pro',
    },
    {
        id: 'gemini-2.5-pro-preview-05-06',
        name: 'Gemini 2.5 Pro Preview 05-06',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Gemini 2.5 Pro Preview with enhanced capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.5-pro-preview-05-06',
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Gemini 2.0 Flash is a fast, efficient model with text and image capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.0-flash',
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Gemini 2.5 Flash is a fast, efficient model with text and image capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.5-flash',
    },
    {
        id: 'gemini-2.5-flash-preview-04-17',
        name: 'Gemini 2.5 Flash Preview 04-17',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Gemini 2.5 Flash Preview with text and image capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.5-flash-preview-04-17',
    },
    {
        id: 'gemini-2.5-flash-lite-preview-06-17',
        name: 'Gemini 2.5 Flash Lite Preview 06-17',
        provider: 'google',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Lightweight Gemini model with text and image capabilities.',
        url: 'https://gemini.google.com/models/gemini-2.5-flash-lite-preview-06-17',
    },
    {
        id: 'gemini-2.0-flash-live-001',
        name: 'Gemini 2.0 Flash Live 001',
        provider: 'google',
        type: 'llm',
        live: true,
        capabilities: {
            text: true,
            image: true,
            audio: true,
            video: true,
            realtime: true
        },
        description: 'Gemini 2.0 Flash with live streaming capabilities for real-time audio and video.',
        url: 'https://gemini.google.com/models/gemini-2.0-flash-live-001',
    },

    // OpenAI Models
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'GPT-4 is OpenAI\'s most capable model with text and image understanding.',
        url: 'https://openai.com/models/gpt-4',
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'GPT-4 Turbo is a faster, more efficient version of GPT-4 with text and image capabilities.',
        url: 'https://openai.com/models/gpt-4-turbo',
    },

    // Anthropic Models
    {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Claude 3.5 Sonnet is Anthropic\'s most capable model with text and image understanding.',
        url: 'https://anthropic.com/models/claude-3-5-sonnet-20241022',
    },

    // DeepSeek Models
    {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: false,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'DeepSeek Chat is a text-only language model optimized for conversational AI.',
        url: 'https://deepseek.com/models/deepseek-chat',
    },

    // OpenRouter Models
    {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet (OpenRouter)',
        provider: 'openrouter',
        type: 'llm',
        live: false,
        capabilities: {
            text: true,
            image: true,
            audio: false,
            video: false,
            realtime: false
        },
        description: 'Claude 3.5 Sonnet via OpenRouter with text and image understanding.',
        url: 'https://openrouter.ai/models/anthropic/claude-3.5-sonnet',
    },
];

// Helper functions
export function getModelById(id) {
    return models.find(m => m.id === id);
}

export function getModelsByProvider(provider) {
    return models.filter(m => m.provider === provider);
}

export function getModelsWithCapability(capability) {
    return models.filter(m => m.capabilities && m.capabilities[capability]);
}

// Export models organized by provider for easy access
export const google = models.filter(m => m.provider === 'google').map(m => m.id);
export const openai = models.filter(m => m.provider === 'openai').map(m => m.id);
export const anthropic = models.filter(m => m.provider === 'anthropic').map(m => m.id);
export const deepseek = models.filter(m => m.provider === 'deepseek').map(m => m.id);
export const openrouter = models.filter(m => m.provider === 'openrouter').map(m => m.id);

// Default export
export default models;