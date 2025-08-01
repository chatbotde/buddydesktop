// Kimi Models Configuration
export const KIMI_MODELS = [
    {
        id: 'moonshot-v1',
        name: 'Moonshot V1',
        provider: 'kimi',
        apiKeyEnv: 'KIMI_API_KEY',
        icon: null,
        description: 'Kimi Moonshot model with long context',
        capabilities: ['text', 'code'],
        contextWindow: 200000,
        maxTokens: 4096,
        live: false,
    },
];

export const KIMI_PROVIDER_CONFIG = {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn',
    keyLabel: 'Kimi API Key',
    envKeys: ['KIMI_API_KEY'],
    signupUrl: 'https://platform.moonshot.cn',
};