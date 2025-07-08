/**
 * AppCore - Main application core that orchestrates all systems
 * Provides a unified interface for the entire application
 */
import featureManager from './FeatureManager.js';
import pluginSystem from './PluginSystem.js';
import eventBus from './EventBus.js';
import serviceManager from './ServiceManager.js';

class AppCore {
    constructor() {
        this.initialized = false;
        this.config = {};
        this.modules = new Map();
        this.startupHooks = [];
        this.shutdownHooks = [];
    }

    /**
     * Initialize the application core
     * @param {Object} config - Application configuration
     */
    async initialize(config = {}) {
        if (this.initialized) {
            console.warn('AppCore already initialized');
            return;
        }

        this.config = { ...this.getDefaultConfig(), ...config };

        try {
            console.log('Initializing AppCore...');

            // Initialize core systems
            await this.initializeCoreSystems();

            // Load configuration
            await this.loadConfiguration();

            // Register core services
            await this.registerCoreServices();

            // Initialize services
            await serviceManager.initialize();

            // Load plugins
            await this.loadPlugins();

            // Execute startup hooks
            await this.executeStartupHooks();

            this.initialized = true;
            console.log('AppCore initialized successfully');

            // Emit initialization event
            eventBus.emit('app:initialized', { config: this.config });

        } catch (error) {
            console.error('Failed to initialize AppCore:', error);
            throw error;
        }
    }

    /**
     * Get default configuration
     * @returns {Object} Default configuration
     */
    getDefaultConfig() {
        return {
            features: {
                autoLoad: true,
                enablePlugins: true,
                enableServices: true
            },
            plugins: {
                directory: './plugins',
                autoDiscover: true,
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
        };
    }

    /**
     * Initialize core systems
     */
    async initializeCoreSystems() {
        // Set up event bus middleware
        eventBus.addMiddleware(async (event, data) => {
            // Add timestamp to all events
            return { ...data, timestamp: Date.now() };
        });

        // Set up feature manager hooks
        featureManager.on('featureToggled', ({ featureId, enabled }) => {
            eventBus.emit('feature:toggled', { featureId, enabled });
        });

        // Set up plugin system hooks
        pluginSystem.registerPluginLoader('core-module', async (plugin) => {
            // Load core modules
            const module = await import(plugin.entryPoint);
            return module.default || module;
        });

        console.log('Core systems initialized');
    }

    /**
     * Load application configuration
     */
    async loadConfiguration() {
        // Load from localStorage or other sources
        const storedConfig = this.loadStoredConfiguration();
        this.config = { ...this.config, ...storedConfig };

        // Apply configuration to systems
        if (this.config.events.debugMode) {
            eventBus.setDebugMode(true);
        }

        console.log('Configuration loaded');
    }

    /**
     * Load stored configuration
     * @returns {Object} Stored configuration
     */
    loadStoredConfiguration() {
        try {
            const stored = localStorage.getItem('buddy-app-config');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Failed to load stored configuration:', error);
            return {};
        }
    }

    /**
     * Save configuration
     */
    saveConfiguration() {
        try {
            localStorage.setItem('buddy-app-config', JSON.stringify(this.config));
        } catch (error) {
            console.warn('Failed to save configuration:', error);
        }
    }

    /**
     * Register core services
     */
    async registerCoreServices() {
        // Register core services with dependency injection
        serviceManager.register('config', this.config, { singleton: true });
        serviceManager.register('eventBus', eventBus, { singleton: true });
        serviceManager.register('featureManager', featureManager, { singleton: true });
        serviceManager.register('pluginSystem', pluginSystem, { singleton: true });

        console.log('Core services registered');
    }

    /**
     * Load plugins
     */
    async loadPlugins() {
        if (!this.config.features.enablePlugins) return;

        // Load built-in plugins
        await this.loadBuiltInPlugins();

        // Load external plugins if auto-discovery is enabled
        if (this.config.plugins.autoDiscover) {
            await this.discoverAndLoadPlugins();
        }

        console.log('Plugins loaded');
    }

    /**
     * Load built-in plugins
     */
    async loadBuiltInPlugins() {
        const builtInPlugins = [
            {
                id: 'ai-providers',
                name: 'AI Providers',
                version: '1.0.0',
                type: 'ai-provider',
                entryPoint: '../ai-providers.js',
                enabled: true
            },
            {
                id: 'auth-system',
                name: 'Authentication System',
                version: '1.0.0',
                type: 'feature',
                entryPoint: '../auth-service.js',
                enabled: true
            }
        ];

        for (const plugin of builtInPlugins) {
            try {
                pluginSystem.registerPlugin(plugin.id, plugin);
                if (plugin.enabled) {
                    await pluginSystem.loadPlugin(plugin.id);
                }
            } catch (error) {
                console.error(`Failed to load built-in plugin ${plugin.id}:`, error);
            }
        }
    }

    /**
     * Discover and load external plugins
     */
    async discoverAndLoadPlugins() {
        // This would scan the plugins directory and load discovered plugins
        // Implementation depends on the environment
        console.log('Plugin discovery not implemented in this environment');
    }

    /**
     * Execute startup hooks
     */
    async executeStartupHooks() {
        for (const hook of this.startupHooks) {
            try {
                await hook(this);
            } catch (error) {
                console.error('Startup hook failed:', error);
            }
        }
    }

    /**
     * Add startup hook
     * @param {Function} hook - Startup hook function
     */
    addStartupHook(hook) {
        this.startupHooks.push(hook);
    }

    /**
     * Add shutdown hook
     * @param {Function} hook - Shutdown hook function
     */
    addShutdownHook(hook) {
        this.shutdownHooks.push(hook);
    }

    /**
     * Register a module
     * @param {string} moduleId - Module identifier
     * @param {Object} module - Module object
     */
    registerModule(moduleId, module) {
        this.modules.set(moduleId, module);
        console.log(`Module registered: ${moduleId}`);
    }

    /**
     * Get a module
     * @param {string} moduleId - Module identifier
     * @returns {Object|null} Module object
     */
    getModule(moduleId) {
        return this.modules.get(moduleId) || null;
    }

    /**
     * Register a feature
     * @param {string} featureId - Feature identifier
     * @param {Object} featureConfig - Feature configuration
     */
    registerFeature(featureId, featureConfig) {
        return featureManager.registerFeature(featureId, featureConfig);
    }

    /**
     * Get a service
     * @param {string} serviceId - Service identifier
     * @returns {*} Service instance
     */
    getService(serviceId) {
        return serviceManager.get(serviceId);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @param {Object} options - Event options
     */
    emit(event, data, options = {}) {
        return eventBus.emit(event, data, options);
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} listener - Event listener
     * @param {Object} options - Subscription options
     */
    on(event, listener, options = {}) {
        return eventBus.on(event, listener, options);
    }

    /**
     * Execute a hook
     * @param {string} hookName - Hook name
     * @param {*} data - Hook data
     */
    async executeHook(hookName, data) {
        return featureManager.executeHook(hookName, data);
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getStats() {
        return {
            initialized: this.initialized,
            config: this.config,
            features: featureManager.getStats(),
            plugins: pluginSystem.getStats(),
            services: serviceManager.getStats(),
            events: eventBus.getStats(),
            modules: this.modules.size
        };
    }

    /**
     * Shutdown the application
     */
    async shutdown() {
        if (!this.initialized) return;

        console.log('Shutting down AppCore...');

        try {
            // Execute shutdown hooks
            for (const hook of this.shutdownHooks) {
                try {
                    await hook(this);
                } catch (error) {
                    console.error('Shutdown hook failed:', error);
                }
            }

            // Save configuration
            this.saveConfiguration();

            // Clear all systems
            eventBus.clear();
            serviceManager.clear();
            this.modules.clear();

            this.initialized = false;
            console.log('AppCore shutdown complete');

        } catch (error) {
            console.error('Failed to shutdown AppCore:', error);
            throw error;
        }
    }

    /**
     * Get core systems for direct access
     * @returns {Object} Core systems
     */
    getSystems() {
        return {
            featureManager,
            pluginSystem,
            eventBus,
            serviceManager
        };
    }
}

// Create singleton instance
const appCore = new AppCore();

export default appCore; 