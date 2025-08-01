// xAI Models Configuration
export const XAI_MODELS = [
    {
        id: 'grok-2',
        name: 'Grok 2',
        provider: 'xai',
        apiKeyEnv: 'XAI_API_KEY',
        icon: null,
        description: 'xAI Grok model with real-time information',
        capabilities: ['text', 'code', 'realtime'],
        contextWindow: 128000,
        maxTokens: 4096,
        live: false,
    },
];

export const XAI_PROVIDER_CONFIG = {
    name: 'xAI',
    baseUrl: 'https://api.x.ai',
    keyLabel: 'xAI API Key',
    envKeys: ['XAI_API_KEY'],
    signupUrl: 'https://x.ai',
};