// Provider exports
export { GOOGLE_MODELS, GOOGLE_PROVIDER_CONFIG } from './google.js';
export { OPENAI_MODELS, OPENAI_PROVIDER_CONFIG } from './openai.js';
export { ANTHROPIC_MODELS, ANTHROPIC_PROVIDER_CONFIG } from './anthropic.js';
export { DEEPSEEK_MODELS, DEEPSEEK_PROVIDER_CONFIG } from './deepseek.js';
export { OPENROUTER_MODELS, OPENROUTER_PROVIDER_CONFIG } from './openrouter.js';
export { XAI_MODELS, XAI_PROVIDER_CONFIG } from './xai.js';
export { KIMI_MODELS, KIMI_PROVIDER_CONFIG } from './kimi.js';

// Consolidated models array
import { GOOGLE_MODELS } from './google.js';
import { OPENAI_MODELS } from './openai.js';
import { ANTHROPIC_MODELS } from './anthropic.js';
import { DEEPSEEK_MODELS } from './deepseek.js';
import { OPENROUTER_MODELS } from './openrouter.js';
import { XAI_MODELS } from './xai.js';
import { KIMI_MODELS } from './kimi.js';

export const ALL_PROVIDER_MODELS = [
    ...GOOGLE_MODELS,
    ...OPENAI_MODELS,
    ...ANTHROPIC_MODELS,
    ...DEEPSEEK_MODELS,
    ...OPENROUTER_MODELS,
    ...XAI_MODELS,
    ...KIMI_MODELS,
];

// Consolidated provider configs
import { GOOGLE_PROVIDER_CONFIG } from './google.js';
import { OPENAI_PROVIDER_CONFIG } from './openai.js';
import { ANTHROPIC_PROVIDER_CONFIG } from './anthropic.js';
import { DEEPSEEK_PROVIDER_CONFIG } from './deepseek.js';
import { OPENROUTER_PROVIDER_CONFIG } from './openrouter.js';
import { XAI_PROVIDER_CONFIG } from './xai.js';
import { KIMI_PROVIDER_CONFIG } from './kimi.js';

export const ALL_PROVIDERS_CONFIG = {
    google: GOOGLE_PROVIDER_CONFIG,
    openai: OPENAI_PROVIDER_CONFIG,
    anthropic: ANTHROPIC_PROVIDER_CONFIG,
    deepseek: DEEPSEEK_PROVIDER_CONFIG,
    openrouter: OPENROUTER_PROVIDER_CONFIG,
    xai: XAI_PROVIDER_CONFIG,
    kimi: KIMI_PROVIDER_CONFIG,
};