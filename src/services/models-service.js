// Import provider configurations
import { ALL_PROVIDER_MODELS, ALL_PROVIDERS_CONFIG } from './providers/index.js';

// Centralized models configuration with provider mapping
export const MODELS_CONFIG = ALL_PROVIDER_MODELS;

// Provider configuration
export const PROVIDERS_CONFIG = ALL_PROVIDERS_CONFIG;

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
export const google = getAllModels()
    .filter(m => m.provider === 'google')
    .map(m => m.id);
export const openai = getAllModels()
    .filter(m => m.provider === 'openai')
    .map(m => m.id);
export const anthropic = getAllModels()
    .filter(m => m.provider === 'anthropic')
    .map(m => m.id);
export const deepseek = getAllModels()
    .filter(m => m.provider === 'deepseek')
    .map(m => m.id);
export const openrouter = getAllModels()
    .filter(m => m.provider === 'openrouter')
    .map(m => m.id);
export const xai = getAllModels()
    .filter(m => m.provider === 'xai')
    .map(m => m.id);
export const kimi = getAllModels()
    .filter(m => m.provider === 'kimi')
    .map(m => m.id);

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
    'openrouter/cypher-alpha:free',
];
