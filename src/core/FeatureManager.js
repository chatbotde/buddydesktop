/**
 * FeatureManager - Centralized feature management system
 * Handles feature registration, capabilities, and lifecycle management
 */
class FeatureManager {
    constructor() {
        this.features = new Map();
        this.capabilities = new Map();
        this.hooks = new Map();
        this.middleware = [];
        this.eventListeners = new Map();
    }

    /**
     * Register a new feature
     * @param {string} featureId - Unique identifier for the feature
     * @param {Object} featureConfig - Feature configuration
     */
    registerFeature(featureId, featureConfig) {
        const {
            name,
            description,
            version,
            capabilities = [],
            dependencies = [],
            enabled = true,
            config = {},
            handlers = {},
            ui = {},
            hooks = {}
        } = featureConfig;

        // Validate dependencies
        for (const dep of dependencies) {
            if (!this.features.has(dep)) {
                console.warn(`Feature ${featureId} depends on ${dep} which is not registered`);
            }
        }

        const feature = {
            id: featureId,
            name,
            description,
            version,
            capabilities,
            dependencies,
            enabled,
            config,
            handlers,
            ui,
            hooks,
            registeredAt: Date.now()
        };

        this.features.set(featureId, feature);

        // Register capabilities
        capabilities.forEach(capability => {
            if (!this.capabilities.has(capability)) {
                this.capabilities.set(capability, new Set());
            }
            this.capabilities.get(capability).add(featureId);
        });

        // Register hooks
        Object.entries(hooks).forEach(([hookName, handler]) => {
            if (!this.hooks.has(hookName)) {
                this.hooks.set(hookName, new Map());
            }
            this.hooks.get(hookName).set(featureId, handler);
        });

        console.log(`Feature registered: ${featureId} (${name})`);
        return feature;
    }

    /**
     * Unregister a feature
     * @param {string} featureId - Feature to unregister
     */
    unregisterFeature(featureId) {
        const feature = this.features.get(featureId);
        if (!feature) return false;

        // Remove from capabilities
        feature.capabilities.forEach(capability => {
            const capabilitySet = this.capabilities.get(capability);
            if (capabilitySet) {
                capabilitySet.delete(featureId);
                if (capabilitySet.size === 0) {
                    this.capabilities.delete(capability);
                }
            }
        });

        // Remove hooks
        Object.keys(feature.hooks).forEach(hookName => {
            const hookMap = this.hooks.get(hookName);
            if (hookMap) {
                hookMap.delete(featureId);
                if (hookMap.size === 0) {
                    this.hooks.delete(hookName);
                }
            }
        });

        this.features.delete(featureId);
        console.log(`Feature unregistered: ${featureId}`);
        return true;
    }

    /**
     * Enable/disable a feature
     * @param {string} featureId - Feature to toggle
     * @param {boolean} enabled - Whether to enable or disable
     */
    setFeatureEnabled(featureId, enabled) {
        const feature = this.features.get(featureId);
        if (feature) {
            feature.enabled = enabled;
            this.emit('featureToggled', { featureId, enabled });
        }
    }

    /**
     * Check if a feature is enabled
     * @param {string} featureId - Feature to check
     * @returns {boolean}
     */
    isFeatureEnabled(featureId) {
        const feature = this.features.get(featureId);
        return feature ? feature.enabled : false;
    }

    /**
     * Get all features with a specific capability
     * @param {string} capability - Capability to search for
     * @returns {Array} Array of feature objects
     */
    getFeaturesWithCapability(capability) {
        const featureIds = this.capabilities.get(capability) || new Set();
        return Array.from(featureIds)
            .map(id => this.features.get(id))
            .filter(feature => feature && feature.enabled);
    }

    /**
     * Get all enabled features
     * @returns {Array} Array of enabled feature objects
     */
    getEnabledFeatures() {
        return Array.from(this.features.values()).filter(f => f.enabled);
    }

    /**
     * Execute a hook
     * @param {string} hookName - Name of the hook to execute
     * @param {*} data - Data to pass to hook handlers
     * @returns {Promise<Array>} Results from all hook handlers
     */
    async executeHook(hookName, data) {
        const hookMap = this.hooks.get(hookName);
        if (!hookMap) return [];

        const results = [];
        for (const [featureId, handler] of hookMap) {
            const feature = this.features.get(featureId);
            if (feature && feature.enabled) {
                try {
                    const result = await handler(data, feature);
                    results.push({ featureId, result });
                } catch (error) {
                    console.error(`Hook ${hookName} failed for feature ${featureId}:`, error);
                    results.push({ featureId, error });
                }
            }
        }
        return results;
    }

    /**
     * Add middleware
     * @param {Function} middleware - Middleware function
     */
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }

    /**
     * Execute middleware chain
     * @param {string} action - Action being performed
     * @param {*} data - Data to process
     * @returns {Promise<*>} Processed data
     */
    async executeMiddleware(action, data) {
        let result = data;
        for (const middleware of this.middleware) {
            result = await middleware(action, result, this);
        }
        return result;
    }

    /**
     * Get feature configuration
     * @param {string} featureId - Feature ID
     * @returns {Object|null} Feature configuration
     */
    getFeatureConfig(featureId) {
        const feature = this.features.get(featureId);
        return feature ? feature.config : null;
    }

    /**
     * Update feature configuration
     * @param {string} featureId - Feature ID
     * @param {Object} config - New configuration
     */
    updateFeatureConfig(featureId, config) {
        const feature = this.features.get(featureId);
        if (feature) {
            feature.config = { ...feature.config, ...config };
            this.emit('configUpdated', { featureId, config });
        }
    }

    /**
     * Get UI components for a feature
     * @param {string} featureId - Feature ID
     * @returns {Object|null} UI configuration
     */
    getFeatureUI(featureId) {
        const feature = this.features.get(featureId);
        return feature ? feature.ui : null;
    }

    /**
     * Event system for feature communication
     */
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(listener);
    }

    off(event, listener) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.delete(listener);
        }
    }

    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`Event listener error for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get feature statistics
     * @returns {Object} Statistics about registered features
     */
    getStats() {
        const totalFeatures = this.features.size;
        const enabledFeatures = this.getEnabledFeatures().length;
        const totalCapabilities = this.capabilities.size;
        const totalHooks = this.hooks.size;

        return {
            totalFeatures,
            enabledFeatures,
            disabledFeatures: totalFeatures - enabledFeatures,
            totalCapabilities,
            totalHooks,
            capabilities: Array.from(this.capabilities.keys()),
            hookTypes: Array.from(this.hooks.keys())
        };
    }
}

// Create singleton instance
const featureManager = new FeatureManager();

export default featureManager; 