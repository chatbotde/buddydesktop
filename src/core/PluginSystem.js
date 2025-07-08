/**
 * PluginSystem - Dynamic plugin loading and management
 * Allows for runtime plugin discovery, loading, and management
 */
import featureManager from './FeatureManager.js';

class PluginSystem {
    constructor() {
        this.plugins = new Map();
        this.pluginLoaders = new Map();
        this.pluginConfigs = new Map();
        this.loadedPlugins = new Set();
        this.pluginHooks = new Map();
    }

    /**
     * Register a plugin loader for a specific type
     * @param {string} type - Plugin type (e.g., 'ai-provider', 'ui-component', 'feature')
     * @param {Function} loader - Loader function
     */
    registerPluginLoader(type, loader) {
        this.pluginLoaders.set(type, loader);
    }

    /**
     * Register a plugin
     * @param {string} pluginId - Unique plugin identifier
     * @param {Object} pluginConfig - Plugin configuration
     */
    registerPlugin(pluginId, pluginConfig) {
        const {
            name,
            version,
            description,
            type = 'feature',
            author,
            dependencies = [],
            config = {},
            entryPoint,
            manifest,
            enabled = true
        } = pluginConfig;

        const plugin = {
            id: pluginId,
            name,
            version,
            description,
            type,
            author,
            dependencies,
            config,
            entryPoint,
            manifest,
            enabled,
            registeredAt: Date.now(),
            loaded: false
        };

        this.plugins.set(pluginId, plugin);
        console.log(`Plugin registered: ${pluginId} (${name})`);
        return plugin;
    }

    /**
     * Load a plugin
     * @param {string} pluginId - Plugin to load
     * @returns {Promise<Object>} Loaded plugin instance
     */
    async loadPlugin(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) {
            throw new Error(`Plugin ${pluginId} not found`);
        }

        if (plugin.loaded) {
            return plugin;
        }

        // Check dependencies
        for (const dep of plugin.dependencies) {
            if (!this.loadedPlugins.has(dep)) {
                await this.loadPlugin(dep);
            }
        }

        try {
            // Get loader for plugin type
            const loader = this.pluginLoaders.get(plugin.type);
            if (!loader) {
                throw new Error(`No loader registered for plugin type: ${plugin.type}`);
            }

            // Load the plugin
            const pluginInstance = await loader(plugin);
            
            // Register as feature if it has feature configuration
            if (pluginInstance.featureConfig) {
                featureManager.registerFeature(pluginId, {
                    ...pluginInstance.featureConfig,
                    config: { ...plugin.config, ...pluginInstance.featureConfig.config }
                });
            }

            // Execute plugin hooks
            if (pluginInstance.hooks) {
                Object.entries(pluginInstance.hooks).forEach(([hookName, handler]) => {
                    if (!this.pluginHooks.has(hookName)) {
                        this.pluginHooks.set(hookName, new Map());
                    }
                    this.pluginHooks.get(hookName).set(pluginId, handler);
                });
            }

            plugin.loaded = true;
            plugin.instance = pluginInstance;
            this.loadedPlugins.add(pluginId);

            console.log(`Plugin loaded: ${pluginId}`);
            return pluginInstance;

        } catch (error) {
            console.error(`Failed to load plugin ${pluginId}:`, error);
            throw error;
        }
    }

    /**
     * Unload a plugin
     * @param {string} pluginId - Plugin to unload
     */
    async unloadPlugin(pluginId) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin || !plugin.loaded) return false;

        try {
            // Call cleanup if available
            if (plugin.instance && typeof plugin.instance.cleanup === 'function') {
                await plugin.instance.cleanup();
            }

            // Remove from feature manager
            featureManager.unregisterFeature(pluginId);

            // Remove hooks
            for (const [hookName, hookMap] of this.pluginHooks) {
                hookMap.delete(pluginId);
                if (hookMap.size === 0) {
                    this.pluginHooks.delete(hookName);
                }
            }

            plugin.loaded = false;
            delete plugin.instance;
            this.loadedPlugins.delete(pluginId);

            console.log(`Plugin unloaded: ${pluginId}`);
            return true;

        } catch (error) {
            console.error(`Failed to unload plugin ${pluginId}:`, error);
            return false;
        }
    }

    /**
     * Enable/disable a plugin
     * @param {string} pluginId - Plugin to toggle
     * @param {boolean} enabled - Whether to enable or disable
     */
    async setPluginEnabled(pluginId, enabled) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) return false;

        if (enabled && !plugin.loaded) {
            await this.loadPlugin(pluginId);
        } else if (!enabled && plugin.loaded) {
            await this.unloadPlugin(pluginId);
        }

        plugin.enabled = enabled;
        return true;
    }

    /**
     * Get all plugins
     * @param {string} type - Filter by plugin type
     * @returns {Array} Array of plugin objects
     */
    getPlugins(type = null) {
        const plugins = Array.from(this.plugins.values());
        return type ? plugins.filter(p => p.type === type) : plugins;
    }

    /**
     * Get loaded plugins
     * @returns {Array} Array of loaded plugin objects
     */
    getLoadedPlugins() {
        return Array.from(this.loadedPlugins).map(id => this.plugins.get(id));
    }

    /**
     * Execute plugin hook
     * @param {string} hookName - Hook name
     * @param {*} data - Data to pass to hook
     * @returns {Promise<Array>} Results from hook handlers
     */
    async executePluginHook(hookName, data) {
        const hookMap = this.pluginHooks.get(hookName);
        if (!hookMap) return [];

        const results = [];
        for (const [pluginId, handler] of hookMap) {
            const plugin = this.plugins.get(pluginId);
            if (plugin && plugin.loaded && plugin.enabled) {
                try {
                    const result = await handler(data, plugin);
                    results.push({ pluginId, result });
                } catch (error) {
                    console.error(`Plugin hook ${hookName} failed for ${pluginId}:`, error);
                    results.push({ pluginId, error });
                }
            }
        }
        return results;
    }

    /**
     * Discover plugins from a directory
     * @param {string} directory - Directory to scan for plugins
     * @returns {Promise<Array>} Array of discovered plugin configs
     */
    async discoverPlugins(directory) {
        // This would scan a directory for plugin manifests
        // Implementation depends on the environment (Node.js vs browser)
        console.log(`Discovering plugins in: ${directory}`);
        return [];
    }

    /**
     * Load plugins from configuration
     * @param {Array} pluginConfigs - Array of plugin configurations
     */
    async loadPluginsFromConfig(pluginConfigs) {
        for (const config of pluginConfigs) {
            try {
                this.registerPlugin(config.id, config);
                if (config.enabled !== false) {
                    await this.loadPlugin(config.id);
                }
            } catch (error) {
                console.error(`Failed to load plugin from config:`, config, error);
            }
        }
    }

    /**
     * Get plugin statistics
     * @returns {Object} Statistics about plugins
     */
    getStats() {
        const totalPlugins = this.plugins.size;
        const loadedPlugins = this.loadedPlugins.size;
        const pluginTypes = new Set(Array.from(this.plugins.values()).map(p => p.type));

        return {
            totalPlugins,
            loadedPlugins,
            disabledPlugins: totalPlugins - loadedPlugins,
            pluginTypes: Array.from(pluginTypes),
            hookTypes: Array.from(this.pluginHooks.keys())
        };
    }
}

// Create singleton instance
const pluginSystem = new PluginSystem();

// Register default plugin loaders
pluginSystem.registerPluginLoader('feature', async (plugin) => {
    // Default feature loader
    if (plugin.entryPoint) {
        const module = await import(plugin.entryPoint);
        return module.default || module;
    }
    return {};
});

pluginSystem.registerPluginLoader('ai-provider', async (plugin) => {
    // AI provider loader
    if (plugin.entryPoint) {
        const module = await import(plugin.entryPoint);
        return module.default || module;
    }
    return {};
});

export default pluginSystem; 