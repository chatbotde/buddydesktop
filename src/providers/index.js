const BaseAIProvider = require('./base-provider');
const GoogleAIProvider = require('./google-provider');
const OpenAIProvider = require('./openai-provider');
const AnthropicProvider = require('./anthropic-provider');
const DeepSeekProvider = require('./deepseek-provider');
const OpenRouterProvider = require('./openrouter-provider');

function createAIProvider(provider, apiKey, profile, language, model) {
    switch (provider) {
        case 'google':
            return new GoogleAIProvider(apiKey, profile, language, model);
        case 'openai':
            return new OpenAIProvider(apiKey, profile, language, model);
        case 'anthropic':
            return new AnthropicProvider(apiKey, profile, language, model);
        case 'deepseek':
            return new DeepSeekProvider(apiKey, profile, language, model);
        case 'openrouter':
            return new OpenRouterProvider(apiKey, profile, language, model);

        default:
            throw new Error(`Unknown AI provider: ${provider}`);
    }
}

module.exports = {
    createAIProvider,
    BaseAIProvider,
    GoogleAIProvider,
    OpenAIProvider,
    AnthropicProvider,
    DeepSeekProvider,
    OpenRouterProvider
}; 