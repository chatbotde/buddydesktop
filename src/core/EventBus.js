/**
 * EventBus - Centralized event management system
 * Provides decoupled communication between application components
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
        this.middleware = [];
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.debugMode = false;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} listener - Event listener function
     * @param {Object} options - Subscription options
     * @returns {Function} Unsubscribe function
     */
    on(event, listener, options = {}) {
        const {
            once = false,
            priority = 0,
            filter = null
        } = options;

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        const subscription = {
            listener,
            once,
            priority,
            filter,
            id: Date.now() + Math.random()
        };

        this.listeners.get(event).push(subscription);
        
        // Sort by priority (higher priority first)
        this.listeners.get(event).sort((a, b) => b.priority - a.priority);

        // Return unsubscribe function
        return () => this.off(event, listener);
    }

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} listener - Event listener function
     * @param {Object} options - Subscription options
     * @returns {Function} Unsubscribe function
     */
    once(event, listener, options = {}) {
        return this.on(event, listener, { ...options, once: true });
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} listener - Event listener function
     */
    off(event, listener) {
        const eventListeners = this.listeners.get(event);
        if (!eventListeners) return;

        const index = eventListeners.findIndex(sub => sub.listener === listener);
        if (index !== -1) {
            eventListeners.splice(index, 1);
        }

        if (eventListeners.length === 0) {
            this.listeners.delete(event);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @param {Object} options - Emission options
     * @returns {Promise<Array>} Results from all listeners
     */
    async emit(event, data, options = {}) {
        const {
            async = true,
            timeout = 5000,
            errorHandling = 'continue'
        } = options;

        if (this.debugMode) {
            console.log(`[EventBus] Emitting: ${event}`, data);
        }

        // Add to history
        this.addToHistory(event, data);

        // Execute middleware
        let processedData = data;
        for (const middleware of this.middleware) {
            try {
                processedData = await middleware(event, processedData);
            } catch (error) {
                console.error(`Middleware error for event ${event}:`, error);
                if (errorHandling === 'stop') {
                    throw error;
                }
            }
        }

        const eventListeners = this.listeners.get(event);
        if (!eventListeners || eventListeners.length === 0) {
            return [];
        }

        const results = [];
        const toRemove = [];

        for (const subscription of eventListeners) {
            try {
                // Apply filter if present
                if (subscription.filter && !subscription.filter(processedData)) {
                    continue;
                }

                let result;
                if (async) {
                    // Execute with timeout
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error(`Event listener timeout: ${event}`)), timeout);
                    });

                    result = await Promise.race([
                        subscription.listener(processedData, event),
                        timeoutPromise
                    ]);
                } else {
                    result = subscription.listener(processedData, event);
                }

                results.push({ subscription, result });

                // Mark for removal if once
                if (subscription.once) {
                    toRemove.push(subscription);
                }

            } catch (error) {
                console.error(`Event listener error for ${event}:`, error);
                results.push({ subscription, error });

                if (errorHandling === 'stop') {
                    throw error;
                }
            }
        }

        // Remove once listeners
        toRemove.forEach(subscription => {
            const eventListeners = this.listeners.get(event);
            if (eventListeners) {
                const index = eventListeners.indexOf(subscription);
                if (index !== -1) {
                    eventListeners.splice(index, 1);
                }
            }
        });

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
     * Remove middleware
     * @param {Function} middleware - Middleware function to remove
     */
    removeMiddleware(middleware) {
        const index = this.middleware.indexOf(middleware);
        if (index !== -1) {
            this.middleware.splice(index, 1);
        }
    }

    /**
     * Add event to history
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    addToHistory(event, data) {
        this.eventHistory.push({
            event,
            data,
            timestamp: Date.now()
        });

        // Limit history size
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }

    /**
     * Get event history
     * @param {string} event - Filter by event name
     * @param {number} limit - Limit number of events
     * @returns {Array} Event history
     */
    getHistory(event = null, limit = null) {
        let history = this.eventHistory;
        
        if (event) {
            history = history.filter(h => h.event === event);
        }

        if (limit) {
            history = history.slice(-limit);
        }

        return history;
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }

    /**
     * Get all registered events
     * @returns {Array} Array of event names
     */
    getEvents() {
        return Array.from(this.listeners.keys());
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    getListenerCount(event) {
        const eventListeners = this.listeners.get(event);
        return eventListeners ? eventListeners.length : 0;
    }

    /**
     * Enable/disable debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    /**
     * Get statistics
     * @returns {Object} EventBus statistics
     */
    getStats() {
        const events = this.getEvents();
        const totalListeners = events.reduce((sum, event) => sum + this.getListenerCount(event), 0);
        const totalMiddleware = this.middleware.length;
        const historySize = this.eventHistory.length;

        return {
            totalEvents: events.length,
            totalListeners,
            totalMiddleware,
            historySize,
            events: events.map(event => ({
                name: event,
                listeners: this.getListenerCount(event)
            }))
        };
    }

    /**
     * Clear all listeners
     */
    clear() {
        this.listeners.clear();
    }

    /**
     * Create a namespaced event bus
     * @param {string} namespace - Namespace prefix
     * @returns {Object} Namespaced event bus methods
     */
    namespace(namespace) {
        return {
            on: (event, listener, options) => this.on(`${namespace}:${event}`, listener, options),
            once: (event, listener, options) => this.once(`${namespace}:${event}`, listener, options),
            off: (event, listener) => this.off(`${namespace}:${event}`, listener),
            emit: (event, data, options) => this.emit(`${namespace}:${event}`, data, options)
        };
    }
}

// Create singleton instance
const eventBus = new EventBus();

// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
    eventBus.setDebugMode(true);
}

export default eventBus; 