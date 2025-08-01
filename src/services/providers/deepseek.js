// DeepSeek Models Configuration
export const DEEPSEEK_MODELS = [
    {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        apiKeyEnv: 'DEEPSEEK_API_KEY',
        icon: null,
        description: 'DeepSeek Chat is a text-only language model optimized for conversational AI.',
        capabilities: ['text', 'code'],
        contextWindow: 64000,
        maxTokens: 4096,
        live: false,
        url: 'https://deepseek.com/models/deepseek-chat',
    },
    {
        id: 'deepseek-v3',
        name: 'DeepSeek V3',
        provider: 'deepseek',
        apiKeyEnv: 'DEEPSEEK_API_KEY',
        icon: null,
        description: 'Advanced reasoning model from DeepSeek',
        capabilities: ['text', 'code', 'reasoning'],
        contextWindow: 64000,
        maxTokens: 4096,
        live: false,
    },
];

export const DEEPSEEK_PROVIDER_CONFIG = {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    keyLabel: 'DeepSeek API Key',
    envKeys: ['DEEPSEEK_API_KEY'],
    signupUrl: 'https://platform.deepseek.com',
};