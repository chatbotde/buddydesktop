// Centralized models configuration with provider mapping
export const MODELS_CONFIG = [
    {
        id: 'claude-4-sonnet',
        name: 'Claude 4 Sonnet',
        provider: 'anthropic',
        apiKeyEnv: 'ANTHROPIC_API_KEY', // Primary env key
        apiKeyEnvAlt: 'CLAUDE_API_KEY', // Alternative env key
        icon: '🤖',
        description: 'Most capable Claude model for complex tasks',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
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
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        apiKeyEnv: 'GOOGLE_API_KEY',
        apiKeyEnvAlt: 'GEMINI_API_KEY',
        icon: '🤖',
        description: "Google's most capable multimodal model",
        capabilities: ['text', 'vision', 'code', 'audio'],
        contextWindow: 1000000,
        maxTokens: 8192,
        premium: true,
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        apiKeyEnv: 'GOOGLE_API_KEY',
        apiKeyEnvAlt: 'GEMINI_API_KEY',
        icon: '🤖',
        description: 'Fast and efficient Google model',
        capabilities: ['text', 'vision', 'code'],
        contextWindow: 1000000,
        maxTokens: 8192,
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
};

// Helper functions
export function getModelById(modelId) {
    return MODELS_CONFIG.find(model => model.id === modelId);
}

export function getModelsByProvider(providerId) {
    return MODELS_CONFIG.filter(model => model.provider === providerId);
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
    return MODELS_CONFIG.filter(model => enabledModelIds.includes(model.id));
}

// Default enabled models (recommended presets)
export const DEFAULT_ENABLED_MODELS = ['claude-4-sonnet', 'claude-3.5-sonnet', 'gemini-2.5-flash', 'o3'];
