// Centralized models configuration with provider mapping
export const MODELS_CONFIG = [
    // Google Models
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        apiKeyEnv: 'GOOGLE_API_KEY',
        apiKeyEnvAlt: 'GEMINI_API_KEY',
        icon: '🤖',
        description: 'Gemini 2.5 Pro Preview with enhanced capabilities.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 1000000,
        maxTokens: 8192,
        live: false,
        url: 'https://gemini.google.com/models/gemini-2.5-pro-preview-05-06',
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        apiKeyEnv: 'GOOGLE_API_KEY',
        apiKeyEnvAlt: 'GEMINI_API_KEY',
        icon: '⚡',
        description: 'Gemini 2.5 Flash is a fast, efficient model with text and image capabilities.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 1000000,
        maxTokens: 8192,
        live: false,
        url: 'https://gemini.google.com/models/gemini-2.5-flash',
    },
    {
        id: 'gemini-2.5-flash-lite-preview-06-17',
        name: 'Gemini 2.5 Flash Lite Preview',
        provider: 'google',
        apiKeyEnv: 'GOOGLE_API_KEY',
        apiKeyEnvAlt: 'GEMINI_API_KEY',
        icon: '⚡',
        badge: 'Preview',
        description: 'Lightweight Gemini model with text and image capabilities.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 1000000,
        maxTokens: 8192,
        live: false,
        url: 'https://gemini.google.com/models/gemini-2.5-flash-lite-preview-06-17',
    },
    {
        id: 'gemini-2.0-flash-live-001',
        name: 'Gemini 2.0 Flash Live',
        provider: 'google',
        apiKeyEnv: 'GOOGLE_API_KEY',
        apiKeyEnvAlt: 'GEMINI_API_KEY',
        icon: '🔴',
        badge: 'LIVE',
        description: 'Gemini 2.0 Flash Live 001 is a fast, efficient model with text and image capabilities.',
        capabilities: ['text', 'vision', 'code', 'audio', 'video', 'realtime'],
        contextWindow: 1000000,
        maxTokens: 8192,
        live: true,
        url: 'https://gemini.google.com/models/gemini-2.0-flash-live-001',
    },

    // OpenAI Models
    {
        id: 'gpt-4.1-2025-04-14',
        name: 'GPT-4.1',
        provider: 'openai',
        apiKeyEnv: 'OPENAI_API_KEY',
        icon: '🤖',
        description: 'GPT-4.1 is OpenAI\'s most capable model with text and image understanding.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
        url: 'https://openai.com/models/gpt-4.1-2025-04-14',
    },
    {
        id: 'o4-mini-2025-04-16',
        name: 'O4 Mini',
        provider: 'openai',
        apiKeyEnv: 'OPENAI_API_KEY',
        icon: '⚡',
        description: 'O4 Mini is a faster, more efficient version of GPT-4 with text and image capabilities.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
        url: 'https://openai.com/models/o4-mini-2025-04-16',
    },
    {
        id: 'o3-2025-04-16',
        name: 'O3',
        provider: 'openai',
        apiKeyEnv: 'OPENAI_API_KEY',
        icon: '🤖',
        description: 'O3 is a faster, more efficient version of GPT-4 with text and image capabilities.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
        url: 'https://openai.com/models/o3-2025-04-16',
    },

    // Anthropic Models
    {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        apiKeyEnvAlt: 'CLAUDE_API_KEY',
        icon: '🤖',
        description: 'Claude 3.5 Sonnet is Anthropic\'s most capable model with text and image understanding.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
        url: 'https://anthropic.com/models/claude-3-5-sonnet-20241022',
    },
    {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        apiKeyEnvAlt: 'CLAUDE_API_KEY',
        icon: '🤖',
        description: 'Claude Sonnet 4 is Anthropic\'s most capable model with text and image understanding.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
        url: 'https://anthropic.com/models/claude-sonnet-4-20250514',
    },
    {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        apiKeyEnvAlt: 'CLAUDE_API_KEY',
        icon: '🤖',
        badge: 'Premium',
        description: 'Claude Opus 4 is Anthropic\'s most capable model with text and image understanding.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        premium: true,
        live: false,
        url: 'https://anthropic.com/models/claude-opus-4-20250514',
    },

    // DeepSeek Models
    {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        apiKeyEnv: 'DEEPSEEK_API_KEY',
        icon: '🤖',
        description: 'DeepSeek Chat is a text-only language model optimized for conversational AI.',
        capabilities: ['text', 'code'],
        contextWindow: 64000,
        maxTokens: 4096,
        live: false,
        url: 'https://deepseek.com/models/deepseek-chat',
    },

    // OpenRouter Models
    {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet (OpenRouter)',
        provider: 'openrouter',
        apiKeyEnv: 'OPENROUTER_API_KEY',
        icon: '🤖',
        description: 'Claude 3.5 Sonnet via OpenRouter with text and image understanding.',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
        url: 'https://openrouter.ai/models/anthropic/claude-3.5-sonnet',
    },
    {
        id: 'deepseek/deepseek-chat-v3-0324:free',
        name: 'DeepSeek Chat V3 (OpenRouter)',
        provider: 'openrouter',
        apiKeyEnv: 'OPENROUTER_API_KEY',
        icon: '🤖',
        badge: 'Free',
        description: 'DeepSeek Chat V3 via OpenRouter with text understanding.',
        capabilities: ['text', 'code'],
        contextWindow: 64000,
        maxTokens: 4096,
        live: false,
        url: 'https://openrouter.ai/models/deepseek/deepseek-chat-v3-0324:free',
    },
    {
        id: 'openrouter/cypher-alpha:free',
        name: 'Cypher Alpha (OpenRouter)',
        provider: 'openrouter',
        apiKeyEnv: 'OPENROUTER_API_KEY',
        icon: '🤖',
        badge: 'Free',
        description: 'Cypher Alpha via OpenRouter with text understanding.',
        capabilities: ['text', 'code'],
        contextWindow: 64000,
        maxTokens: 4096,
        live: false,
        url: 'https://openrouter.ai/models/openrouter/cypher-alpha:free',
    },

    // Additional models from the original models-service.js
    {
        id: 'claude-4-sonnet',
        name: 'Claude 4 Sonnet',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        apiKeyEnvAlt: 'CLAUDE_API_KEY',
        icon: '🤖',
        description: 'Most capable Claude model for complex tasks',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
    },
    {
        id: 'claude-4-opus',
        name: 'Claude 4 Opus',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        apiKeyEnvAlt: 'CLAUDE_API_KEY',
        icon: '🤖',
        badge: 'MAX Only',
        description: 'Premium Claude model with maximum capabilities',
        capabilities: ['text', 'vision', 'code', 'analysis'],
        contextWindow: 200000,
        maxTokens: 4096,
        premium: true,
        live: false,
    },
    {
        id: 'claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        apiKeyEnvAlt: 'CLAUDE_API_KEY',
        icon: null,
        description: 'Fast and efficient Claude model',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
    },
    {
        id: 'o3',
        name: 'O3',
        provider: 'openai',
        apiKeyEnv: 'OPENAI_API_KEY',
        icon: '🤖',
        description: 'Latest OpenAI reasoning model',
        capabilities: ['text', 'code', 'reasoning'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        apiKeyEnv: 'OPENAI_API_KEY',
        icon: '🤖',
        description: 'OpenAI multimodal model',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
    },
    {
        id: 'deepseek-v3',
        name: 'DeepSeek V3',
        provider: 'deepseek',
        apiKeyEnv: 'DEEPSEEK_API_KEY',
        icon: '🤖',
        description: 'Advanced reasoning model from DeepSeek',
        capabilities: ['text', 'code', 'reasoning'],
        contextWindow: 64000,
        maxTokens: 4096,
        live: false,
    },
    {
        id: 'grok-2',
        name: 'Grok 2',
        provider: 'xai',
        apiKeyEnv: 'XAI_API_KEY',
        icon: '🤖',
        description: 'xAI Grok model with real-time information',
        capabilities: ['text', 'code', 'realtime'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
    },
    {
        id: 'moonshot-v1',
        name: 'Moonshot V1',
        provider: 'kimi',
        apiKeyEnv: 'KIMI_API_KEY',
        icon: '🤖',
        description: 'Kimi Moonshot model with long context',
        capabilities: ['text', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
    },
];

// Provider configuration
export const PROVIDERS_CONFIG = {
    anthropic: {
        name: 'Anthropic Claude',
        baseUrl: 'https://api.anthropic.com',
        keyLabel: 'Anthropic API Key',
        envKeys: ['ANTHROPIC_API_KEY', 'CLAUDE_API_KEY'],
        signupUrl: 'https://console.anthropic.com',
    },
    openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com',
        keyLabel: 'OpenAI API Key',
        envKeys: ['OPENAI_API_KEY'],
        signupUrl: 'https://platform.openai.com/api-keys',
    },
    google: {
        name: 'Google Gemini',
        baseUrl: 'https://generativelanguage.googleapis.com',
        keyLabel: 'Google API Key',
        envKeys: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
        signupUrl: 'https://aistudio.google.com',
    },
    deepseek: {
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com',
        keyLabel: 'DeepSeek API Key',
        envKeys: ['DEEPSEEK_API_KEY'],
        signupUrl: 'https://platform.deepseek.com',
    },
    openrouter: {
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api',
        keyLabel: 'OpenRouter API Key',
        envKeys: ['OPENROUTER_API_KEY'],
        signupUrl: 'https://openrouter.ai/keys',
    },
    xai: {
        name: 'xAI',
        baseUrl: 'https://api.x.ai',
        keyLabel: 'xAI API Key',
        envKeys: ['XAI_API_KEY'],
        signupUrl: 'https://x.ai',
    },
    kimi: {
        name: 'Kimi',
        baseUrl: 'https://api.moonshot.cn',
        keyLabel: 'Kimi API Key',
        envKeys: ['KIMI_API_KEY'],
        signupUrl: 'https://platform.moonshot.cn',
    },
};

// Helper functions
export function getModelById(modelId) {
    return getAllModels().find(model => model.id === modelId);
}

export function getModelsByProvider(providerId) {
    return getAllModels().filter(model => model.provider === providerId);
}

export function getProviderByModel(modelId) {
    const model = getModelById(modelId);
    return model ? PROVIDERS_CONFIG[model.provider] : null;
}

export function getApiKeyForModel(modelId) {
    const model = getModelById(modelId);
    if (!model) return null;

    // Check environment variables for the model's API key
    const envKeys = [model.apiKeyEnv];
    if (model.apiKeyEnvAlt) {
        envKeys.push(model.apiKeyEnvAlt);
    }

    // In browser environment, we'll need to get this from the backend
    // This is a placeholder - actual implementation would call backend
    return {
        model: model,
        provider: PROVIDERS_CONFIG[model.provider],
        envKeys: envKeys,
    };
}

export function getAllProviders() {
    return Object.keys(PROVIDERS_CONFIG).map(key => ({
        value: key,
        ...PROVIDERS_CONFIG[key],
    }));
}

export function getEnabledModels(enabledModelIds) {
    return getAllModels().filter(model => enabledModelIds.includes(model.id));
}

// Custom models storage key
const CUSTOM_MODELS_STORAGE_KEY = 'buddy_custom_models';

// Custom models management
export function getCustomModels() {
    try {
        const stored = localStorage.getItem(CUSTOM_MODELS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load custom models:', error);
        return [];
    }
}

export function saveCustomModel(customModel) {
    try {
        const customModels = getCustomModels();
        const existingIndex = customModels.findIndex(m => m.id === customModel.id);
        
        if (existingIndex >= 0) {
            customModels[existingIndex] = customModel;
        } else {
            customModels.push(customModel);
        }
        
        localStorage.setItem(CUSTOM_MODELS_STORAGE_KEY, JSON.stringify(customModels));
        return true;
    } catch (error) {
        console.error('Failed to save custom model:', error);
        return false;
    }
}

export function deleteCustomModel(modelId) {
    try {
        const customModels = getCustomModels();
        const filtered = customModels.filter(m => m.id !== modelId);
        localStorage.setItem(CUSTOM_MODELS_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Failed to delete custom model:', error);
        return false;
    }
}

export function getAllModels() {
    return [...MODELS_CONFIG, ...getCustomModels()];
}

export function isCustomModel(modelId) {
    return getCustomModels().some(m => m.id === modelId);
}

// Additional helper functions for compatibility with models.js
export function getModelsWithCapability(capability) {
    return getAllModels().filter(m => m.capabilities && m.capabilities.includes(capability));
}

// Export models organized by provider for easy access (compatibility with models.js)
export const google = getAllModels().filter(m => m.provider === 'google').map(m => m.id);
export const openai = getAllModels().filter(m => m.provider === 'openai').map(m => m.id);
export const anthropic = getAllModels().filter(m => m.provider === 'anthropic').map(m => m.id);
export const deepseek = getAllModels().filter(m => m.provider === 'deepseek').map(m => m.id);
export const openrouter = getAllModels().filter(m => m.provider === 'openrouter').map(m => m.id);
export const xai = getAllModels().filter(m => m.provider === 'xai').map(m => m.id);
export const kimi = getAllModels().filter(m => m.provider === 'kimi').map(m => m.id);

// Default enabled models (recommended presets)
export const DEFAULT_ENABLED_MODELS = [
    'claude-4-sonnet', 
    'claude-3.5-sonnet', 
    'claude-3-5-sonnet-20241022',
    'claude-sonnet-4-20250514',
    'gemini-2.5-pro',
    'gemini-2.5-flash', 
    'gemini-2.0-flash-live-001', 
    'o3', 
    'o3-2025-04-16',
    'gpt-4o',
    'gpt-4.1-2025-04-14',
    'o4-mini-2025-04-16',
    'deepseek-v3',
    'deepseek-chat',
    'anthropic/claude-3.5-sonnet',
    'deepseek/deepseek-chat-v3-0324:free',
    'openrouter/cypher-alpha:free'
];
