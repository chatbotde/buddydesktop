/**
 * Search Feature Module
 * Exports all search-related components and utilities
 */

// Core search components
const SearchFeature = require('./SearchFeature.js');
const { SearchWindow, searchWindow } = require('./SearchWindow.js');
const { SearchManager, searchManager } = require('./SearchManager.js');

// Convenience functions
const {
    createSearchWindow,
    showSearchWindow,
    hideSearchWindow,
    closeSearchWindow,
    getSearchWindow,
    getSearchWindowStatus,
} = require('./SearchWindow.js');

const {
    initializeSearchManager,
    performSearch,
    getSearchStats,
} = require('./SearchManager.js');

const {
    initializeSearchFeature,
    getSearchFeatureStatus,
} = require('./SearchFeature.js');

/**
 * Initialize the complete search system
 * @param {Object} options - Initialization options
 * @returns {Promise<Object>} Initialized search system components
 */
async function initializeSearchSystem(options = {}) {
    try {
        // Create and initialize search feature
        const searchFeature = new SearchFeature();
        await searchFeature.initialize(options);

        // Initialize search manager with the feature
        await initializeSearchManager(options);

        // Create search window if requested
        let window = null;
        if (options.createWindow !== false) {
            window = await createSearchWindow(options.windowOptions);
        }

        console.log('Search system initialized successfully');

        return {
            searchFeature,
            searchManager,
            searchWindow: window,
            status: getSearchFeatureStatus()
        };

    } catch (error) {
        console.error('Failed to initialize search system:', error);
        throw error;
    }
}

/**
 * Quick search function for external use
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Search results
 */
async function quickSearch(query, options = {}) {
    try {
        const filters = options.filters || {};
        const results = await performSearch(query, filters);
        return results;
    } catch (error) {
        console.error('Quick search failed:', error);
        return [];
    }
}

/**
 * Open search window for user interaction
 * @param {Object} options - Window options
 * @returns {Promise<Object>} Window creation result
 */
async function openSearchWindow(options = {}) {
    try {
        // Create window if it doesn't exist
        await createSearchWindow(options);
        
        // Show the window
        const result = showSearchWindow();
        
        return {
            success: true,
            window: getSearchWindow(),
            status: getSearchWindowStatus()
        };
        
    } catch (error) {
        console.error('Failed to open search window:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get comprehensive search system status
 * @returns {Object} Complete system status
 */
function getSearchSystemStatus() {
    return {
        feature: getSearchFeatureStatus(),
        manager: getSearchStats(),
        window: getSearchWindowStatus(),
        timestamp: new Date().toISOString()
    };
}

/**
 * Search system configuration
 */
const defaultConfig = {
    enableWebSearch: false,
    maxResults: 100,
    searchDelay: 300,
    cacheResults: true,
    windowOptions: {
        width: 450,
        height: 80,
        alwaysOnTop: true,
        frame: false,
        transparent: true
    }
};

/**
 * Cleanup search system resources
 */
function cleanupSearchSystem() {
    try {
        if (searchWindow && searchWindow.window) {
            closeSearchWindow();
        }
        
        if (searchManager) {
            searchManager.clearCache();
            searchManager.clearHistory();
        }
        
        console.log('Search system cleanup completed');
    } catch (error) {
        console.error('Search system cleanup failed:', error);
    }
}

// Export main components
module.exports = {
    // Core classes
    SearchFeature,
    SearchWindow,
    SearchManager,
    
    // Singleton instances
    searchFeature: SearchFeature.searchFeature,
    searchWindow,
    searchManager,
    
    // Initialization functions
    initializeSearchSystem,
    initializeSearchFeature,
    initializeSearchManager,
    
    // Window management
    createSearchWindow,
    showSearchWindow,
    hideSearchWindow,
    closeSearchWindow,
    openSearchWindow,
    getSearchWindow,
    getSearchWindowStatus,
    
    // Search operations
    performSearch,
    quickSearch,
    getSearchStats,
    
    // System management
    getSearchFeatureStatus,
    getSearchSystemStatus,
    cleanupSearchSystem,
    
    // Configuration
    defaultConfig,
    
    // Utilities
    SearchSystemUtils: {
        initializeSearchSystem,
        openSearchWindow,
        quickSearch,
        getSearchSystemStatus,
        cleanupSearchSystem
    }
};
