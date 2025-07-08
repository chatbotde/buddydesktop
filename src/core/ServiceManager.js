/**
 * ServiceManager - Dependency injection and service lifecycle management
 * Provides a centralized way to manage application services
 */
import eventBus from './EventBus.js';

class ServiceManager {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
        this.factories = new Map();
        this.dependencies = new Map();
        this.serviceHooks = new Map();
        this.initialized = false;
    }

    /**
     * Register a service
     * @param {string} serviceId - Service identifier
     * @param {Function|Object} service - Service constructor or instance
     * @param {Object} options - Registration options
     */
    register(serviceId, service, options = {}) {
        const {
            singleton = true,
            dependencies = [],
            factory = false,
            lazy = false,
            hooks = {}
        } = options;

        if (this.services.has(serviceId)) {
            throw new Error(`Service ${serviceId} is already registered`);
        }

        const serviceConfig = {
            id: serviceId,
            service,
            singleton,
            dependencies,
            factory,
            lazy,
            hooks,
            registeredAt: Date.now()
        };

        this.services.set(serviceId, serviceConfig);
        this.dependencies.set(serviceId, dependencies);

        // Register hooks
        Object.entries(hooks).forEach(([hookName, handler]) => {
            if (!this.serviceHooks.has(hookName)) {
                this.serviceHooks.set(hookName, new Map());
            }
            this.serviceHooks.get(hookName).set(serviceId, handler);
        });

        console.log(`Service registered: ${serviceId}`);
        return serviceConfig;
    }

    /**
     * Get a service instance
     * @param {string} serviceId - Service identifier
     * @returns {*} Service instance
     */
    get(serviceId) {
        const config = this.services.get(serviceId);
        if (!config) {
            throw new Error(`Service ${serviceId} not found`);
        }

        // Return singleton if already created
        if (config.singleton && this.singletons.has(serviceId)) {
            return this.singletons.get(serviceId);
        }

        // Create new instance
        const instance = this.createInstance(config);
        
        // Store singleton
        if (config.singleton) {
            this.singletons.set(serviceId, instance);
        }

        return instance;
    }

    /**
     * Create a service instance
     * @param {Object} config - Service configuration
     * @returns {*} Service instance
     */
    createInstance(config) {
        const { service, dependencies, factory } = config;

        try {
            // Resolve dependencies
            const resolvedDependencies = dependencies.map(dep => this.get(dep));

            let instance;
            if (factory) {
                // Factory function
                instance = service(...resolvedDependencies);
            } else if (typeof service === 'function') {
                // Constructor function
                instance = new service(...resolvedDependencies);
            } else {
                // Direct instance
                instance = service;
            }

            // Execute post-creation hooks
            this.executeServiceHook('postCreate', serviceId, instance);

            return instance;

        } catch (error) {
            console.error(`Failed to create service ${config.id}:`, error);
            throw error;
        }
    }

    /**
     * Check if a service is registered
     * @param {string} serviceId - Service identifier
     * @returns {boolean}
     */
    has(serviceId) {
        return this.services.has(serviceId);
    }

    /**
     * Unregister a service
     * @param {string} serviceId - Service identifier
     */
    unregister(serviceId) {
        const config = this.services.get(serviceId);
        if (!config) return false;

        // Execute cleanup hooks
        this.executeServiceHook('cleanup', serviceId, this.singletons.get(serviceId));

        // Remove singleton instance
        this.singletons.delete(serviceId);

        // Remove from services
        this.services.delete(serviceId);
        this.dependencies.delete(serviceId);

        // Remove hooks
        for (const [hookName, hookMap] of this.serviceHooks) {
            hookMap.delete(serviceId);
            if (hookMap.size === 0) {
                this.serviceHooks.delete(hookName);
            }
        }

        console.log(`Service unregistered: ${serviceId}`);
        return true;
    }

    /**
     * Initialize all services
     * @param {Array} serviceIds - Specific services to initialize (optional)
     */
    async initialize(serviceIds = null) {
        if (this.initialized) return;

        const servicesToInit = serviceIds || Array.from(this.services.keys());
        
        // Sort by dependencies
        const sortedServices = this.sortByDependencies(servicesToInit);

        for (const serviceId of sortedServices) {
            const config = this.services.get(serviceId);
            if (!config || config.lazy) continue;

            try {
                const instance = this.get(serviceId);
                
                // Execute initialization hooks
                if (typeof instance.initialize === 'function') {
                    await instance.initialize();
                }
                
                this.executeServiceHook('postInit', serviceId, instance);
                
                console.log(`Service initialized: ${serviceId}`);

            } catch (error) {
                console.error(`Failed to initialize service ${serviceId}:`, error);
                throw error;
            }
        }

        this.initialized = true;
        eventBus.emit('services:initialized', { services: sortedServices });
    }

    /**
     * Sort services by dependencies
     * @param {Array} serviceIds - Service IDs to sort
     * @returns {Array} Sorted service IDs
     */
    sortByDependencies(serviceIds) {
        const sorted = [];
        const visited = new Set();
        const visiting = new Set();

        const visit = (serviceId) => {
            if (visiting.has(serviceId)) {
                throw new Error(`Circular dependency detected: ${serviceId}`);
            }
            if (visited.has(serviceId)) return;

            visiting.add(serviceId);

            const config = this.services.get(serviceId);
            if (config) {
                for (const dep of config.dependencies) {
                    if (serviceIds.includes(dep)) {
                        visit(dep);
                    }
                }
            }

            visiting.delete(serviceId);
            visited.add(serviceId);
            sorted.push(serviceId);
        };

        for (const serviceId of serviceIds) {
            visit(serviceId);
        }

        return sorted;
    }

    /**
     * Execute service hook
     * @param {string} hookName - Hook name
     * @param {string} serviceId - Service ID
     * @param {*} instance - Service instance
     */
    executeServiceHook(hookName, serviceId, instance) {
        const hookMap = this.serviceHooks.get(hookName);
        if (!hookMap) return;

        const handler = hookMap.get(serviceId);
        if (handler) {
            try {
                handler(instance, serviceId);
            } catch (error) {
                console.error(`Service hook ${hookName} failed for ${serviceId}:`, error);
            }
        }
    }

    /**
     * Get all registered services
     * @returns {Array} Array of service configurations
     */
    getAllServices() {
        return Array.from(this.services.values());
    }

    /**
     * Get service dependencies
     * @param {string} serviceId - Service identifier
     * @returns {Array} Array of dependency IDs
     */
    getDependencies(serviceId) {
        return this.dependencies.get(serviceId) || [];
    }

    /**
     * Get services that depend on a specific service
     * @param {string} serviceId - Service identifier
     * @returns {Array} Array of dependent service IDs
     */
    getDependents(serviceId) {
        const dependents = [];
        for (const [id, deps] of this.dependencies) {
            if (deps.includes(serviceId)) {
                dependents.push(id);
            }
        }
        return dependents;
    }

    /**
     * Get service statistics
     * @returns {Object} Service statistics
     */
    getStats() {
        const totalServices = this.services.size;
        const singletonInstances = this.singletons.size;
        const totalHooks = Array.from(this.serviceHooks.values())
            .reduce((sum, hookMap) => sum + hookMap.size, 0);

        return {
            totalServices,
            singletonInstances,
            totalHooks,
            initialized: this.initialized,
            services: Array.from(this.services.keys())
        };
    }

    /**
     * Clear all services
     */
    clear() {
        // Cleanup all services
        for (const serviceId of this.services.keys()) {
            this.unregister(serviceId);
        }

        this.initialized = false;
    }
}

// Create singleton instance
const serviceManager = new ServiceManager();

export default serviceManager; 