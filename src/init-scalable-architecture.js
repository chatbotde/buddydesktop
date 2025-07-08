/**
 * Scalable Architecture Initialization
 * This script demonstrates how to integrate the new scalable architecture
 * with the existing Buddy application
 */
import appCore from './core/AppCore.js';
import ScreenshotFeature from './features/ScreenshotFeature.js';
import AudioFeature from './features/AudioFeature.js';

/**
 * Initialize the scalable architecture
 */
async function initializeScalableArchitecture() {
    try {
        console.log('Initializing scalable architecture...');

        // Initialize AppCore with configuration
        await appCore.initialize({
            features: {
                autoLoad: true,
                enablePlugins: true,
                enableServices: true
            },
            plugins: {
                directory: './plugins',
                autoDiscover: false, // Disable for now
                enabledByDefault: true
            },
            services: {
                autoInitialize: true,
                lazyLoading: false
            },
            events: {
                enableHistory: true,
                maxHistorySize: 100,
                debugMode: process.env.NODE_ENV === 'development'
            }
        });

        // Register core features
        await registerCoreFeatures();

        // Register existing services
        await registerExistingServices();

        // Set up event bridges
        await setupEventBridges();

        // Initialize features
        await initializeFeatures();

        console.log('Scalable architecture initialized successfully');

        // Log statistics
        const stats = appCore.getStats();
        console.log('Application statistics:', stats);

        return appCore;

    } catch (error) {
        console.error('Failed to initialize scalable architecture:', error);
        throw error;
    }
}

/**
 * Register core features
 */
async function registerCoreFeatures() {
    console.log('Registering core features...');

    // Register screenshot feature
    const screenshotFeature = new ScreenshotFeature();
    await screenshotFeature.initialize();

    // Register audio feature
    const audioFeature = new AudioFeature();
    await audioFeature.initialize();

    // Register AI providers as features
    appCore.registerFeature('ai-providers', {
        name: 'AI Providers',
        description: 'AI provider management and integration',
        version: '1.0.0',
        capabilities: ['ai-integration', 'text-processing', 'image-processing'],
        config: {
            providers: ['google', 'openai', 'anthropic', 'deepseek', 'openrouter'],
            defaultProvider: 'google'
        },
        handlers: {
            initialize: initializeAIProvider.bind(this),
            sendMessage: sendAIMessage.bind(this),
            getProviders: getAIProviders.bind(this)
        },
        hooks: {
            'before-ai-message': beforeAIMessage.bind(this),
            'after-ai-message': afterAIMessage.bind(this)
        }
    });

    // Register authentication feature
    appCore.registerFeature('authentication', {
        name: 'Authentication',
        description: 'User authentication and session management',
        version: '1.0.0',
        capabilities: ['auth', 'session-management'],
        config: {
            provider: 'google',
            enableGuest: true
        },
        handlers: {
            login: handleLogin.bind(this),
            logout: handleLogout.bind(this),
            verifyToken: verifyAuthToken.bind(this)
        },
        hooks: {
            'before-login': beforeLogin.bind(this),
            'after-login': afterLogin.bind(this)
        }
    });

    console.log('Core features registered');
}

/**
 * Register existing services
 */
async function registerExistingServices() {
    console.log('Registering existing services...');

    const serviceManager = appCore.getService('serviceManager');

    // Register existing AI providers as services
    serviceManager.register('googleAIProvider', async () => {
        const { GoogleAIProvider } = await import('./ai-providers.js');
        return GoogleAIProvider;
    }, { dependencies: ['config', 'eventBus'] });

    serviceManager.register('openaiProvider', async () => {
        const { OpenAIProvider } = await import('./ai-providers.js');
        return OpenAIProvider;
    }, { dependencies: ['config', 'eventBus'] });

    // Register auth service
    serviceManager.register('authService', async () => {
        const AuthService = await import('./auth-service.js');
        return AuthService.default;
    }, { dependencies: ['config', 'eventBus'] });

    // Register audio utilities
    serviceManager.register('audioUtils', async () => {
        const audioUtils = await import('./audioUtils.js');
        return audioUtils;
    }, { dependencies: ['config'] });

    console.log('Existing services registered');
}

/**
 * Set up event bridges between old and new architecture
 */
async function setupEventBridges() {
    console.log('Setting up event bridges...');

    const eventBus = appCore.getService('eventBus');

    // Bridge old buddy.captureScreenshot() to new event system
    if (window.buddy && window.buddy.captureScreenshot) {
        const originalCaptureScreenshot = window.buddy.captureScreenshot;
        window.buddy.captureScreenshot = async function() {
            // Emit event before capture
            eventBus.emit('screenshot:capture-requested', { timestamp: Date.now() });
            
            try {
                const result = await originalCaptureScreenshot();
                
                // Emit event after successful capture
                eventBus.emit('screenshot:captured', { 
                    data: result, 
                    timestamp: Date.now() 
                });
                
                return result;
            } catch (error) {
                eventBus.emit('screenshot:error', { error: error.message });
                throw error;
            }
        };
    }

    // Bridge old buddy.sendTextMessage() to new event system
    if (window.buddy && window.buddy.sendTextMessage) {
        const originalSendTextMessage = window.buddy.sendTextMessage;
        window.buddy.sendTextMessage = async function(text, screenshots) {
            // Emit event before sending
            eventBus.emit('ai:message-requested', { 
                text, 
                screenshots, 
                timestamp: Date.now() 
            });
            
            try {
                const result = await originalSendTextMessage(text, screenshots);
                
                // Emit event after successful send
                eventBus.emit('ai:message-sent', { 
                    result, 
                    timestamp: Date.now() 
                });
                
                return result;
            } catch (error) {
                eventBus.emit('ai:message-error', { error: error.message });
                throw error;
            }
        };
    }

    // Bridge old buddy.startCapture() to new event system
    if (window.buddy && window.buddy.startCapture) {
        const originalStartCapture = window.buddy.startCapture;
        window.buddy.startCapture = async function() {
            eventBus.emit('capture:start-requested', { timestamp: Date.now() });
            
            try {
                const result = await originalStartCapture();
                eventBus.emit('capture:started', { timestamp: Date.now() });
                return result;
            } catch (error) {
                eventBus.emit('capture:error', { error: error.message });
                throw error;
            }
        };
    }

    console.log('Event bridges set up');
}

/**
 * Initialize features
 */
async function initializeFeatures() {
    console.log('Initializing features...');

    // Get all enabled features
    const enabledFeatures = appCore.getService('featureManager').getEnabledFeatures();
    
    for (const feature of enabledFeatures) {
        try {
            // Execute feature initialization hooks
            await appCore.executeHook('feature:initialize', { featureId: feature.id });
            console.log(`Feature initialized: ${feature.id}`);
        } catch (error) {
            console.error(`Failed to initialize feature ${feature.id}:`, error);
        }
    }

    console.log('Features initialized');
}

// AI Provider handlers
async function initializeAIProvider(provider, config) {
    const { createAIProvider } = await import('./ai-providers.js');
    return createAIProvider(provider, config.apiKey, config.profile, config.language, config.customPrompt, config.model);
}

async function sendAIMessage(message, provider) {
    const aiService = appCore.getService(`${provider}AIProvider`);
    return await aiService.sendRealtimeInput(message);
}

async function getAIProviders() {
    const { getModelsByProvider } = await import('./lib/models/models.js');
    return {
        google: getModelsByProvider('google'),
        openai: getModelsByProvider('openai'),
        anthropic: getModelsByProvider('anthropic'),
        deepseek: getModelsByProvider('deepseek'),
        openrouter: getModelsByProvider('openrouter')
    };
}

async function beforeAIMessage(data) {
    console.log('Before AI message:', data);
    // Could add rate limiting, validation, etc.
}

async function afterAIMessage(data) {
    console.log('After AI message:', data);
    // Could add logging, analytics, etc.
}

// Authentication handlers
async function handleLogin(credentials) {
    const authService = appCore.getService('authService');
    return await authService.exchangeCodeForTokens(credentials.code);
}

async function handleLogout() {
    const authService = appCore.getService('authService');
    return await authService.logout();
}

async function verifyAuthToken(token) {
    const authService = appCore.getService('authService');
    return await authService.verifyJWT(token);
}

async function beforeLogin(data) {
    console.log('Before login:', data);
    // Could add validation, rate limiting, etc.
}

async function afterLogin(data) {
    console.log('After login:', data);
    // Could add session management, user preferences loading, etc.
}

/**
 * Get the initialized AppCore instance
 */
function getAppCore() {
    return appCore;
}

/**
 * Get feature manager
 */
function getFeatureManager() {
    return appCore.getService('featureManager');
}

/**
 * Get plugin system
 */
function getPluginSystem() {
    return appCore.getService('pluginSystem');
}

/**
 * Get event bus
 */
function getEventBus() {
    return appCore.getService('eventBus');
}

/**
 * Get service manager
 */
function getServiceManager() {
    return appCore.getService('serviceManager');
}

// Export functions for use in the application
export {
    initializeScalableArchitecture,
    getAppCore,
    getFeatureManager,
    getPluginSystem,
    getEventBus,
    getServiceManager
};

// Auto-initialize if this module is imported
if (typeof window !== 'undefined') {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScalableArchitecture);
    } else {
        initializeScalableArchitecture();
    }
} 