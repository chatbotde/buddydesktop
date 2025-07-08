const dspyModels = [
    {
        id: 'dspy/gpt-4',
        name: 'DSPy GPT-4',
        provider: 'dspy',
        capabilities: {
            text: true,
            reasoning: true,
            optimization: true,
            custom_pipelines: true
        },
        description: 'GPT-4 with DSPy optimization capabilities',
        maxTokens: 8192,
        live: false
    },
    {
        id: 'dspy/gpt-3.5-turbo',
        name: 'DSPy GPT-3.5 Turbo',
        provider: 'dspy',
        capabilities: {
            text: true,
            reasoning: true,
            optimization: true,
            custom_pipelines: true
        },
        description: 'GPT-3.5 Turbo with DSPy optimization capabilities',
        maxTokens: 4096,
        live: false
    },
    {
        id: 'dspy/claude-3-5-sonnet',
        name: 'DSPy Claude 3.5 Sonnet',
        provider: 'dspy',
        capabilities: {
            text: true,
            reasoning: true,
            optimization: true,
            custom_pipelines: true
        },
        description: 'Claude 3.5 Sonnet with DSPy optimization capabilities',
        maxTokens: 4096,
        live: false
    },
    {
        id: 'dspy/gemini-pro',
        name: 'DSPy Gemini Pro',
        provider: 'dspy',
        capabilities: {
            text: true,
            reasoning: true,
            optimization: true,
            custom_pipelines: true
        },
        description: 'Gemini Pro with DSPy optimization capabilities',
        maxTokens: 32768,
        live: false
    },
    {
        id: 'dspy/deepseek-chat',
        name: 'DSPy DeepSeek Chat',
        provider: 'dspy',
        capabilities: {
            text: true,
            reasoning: true,
            optimization: true,
            custom_pipelines: true
        },
        description: 'DeepSeek Chat with DSPy optimization capabilities',
        maxTokens: 32768,
        live: false
    }
];

module.exports = dspyModels; 