/**
 * SearchFeature - Main search feature implementation
 * Coordinates search window, manager, and system integration
 */
const { SearchWindow } = require('./SearchWindow.js');
const { SearchManager } = require('./SearchManager.js');
const { ipcMain } = require('electron');

class SearchFeature {
    constructor() {
        this.isInitialized = false;
        this.searchWindow = null;
        this.searchManager = null;
        this.isEnabled = true;
        this.config = {
            enableWebSearch: false,
            maxResults: 100,
            searchDelay: 300,
            cacheResults: true
        };
    }

    /**
     * Initialize the search feature
     * @param {Object} options - Initialization options
     */
    async initialize(options = {}) {
        if (this.isInitialized) {
            console.log('SearchFeature already initialized');
            return;
        }

        try {
            // Merge configuration
            this.config = { ...this.config, ...options };

            // Initialize search manager
            this.searchManager = new SearchManager();
            await this.searchManager.initialize(this.config);

            // Initialize search window
            this.searchWindow = new SearchWindow();

            // Set up IPC handlers
            this.setupIpcHandlers();

            // Set up event listeners
            this.setupEventListeners();

            this.isInitialized = true;
            console.log('SearchFeature initialized successfully');

        } catch (error) {
            console.error('Failed to initialize SearchFeature:', error);
            throw error;
        }
    }

    /**
     * Set up IPC communication handlers
     */
    setupIpcHandlers() {
        // Handle search window creation
        ipcMain.handle('search-feature-create-window', async (event, options) => {
            return await this.createSearchWindow(options);
        });

        // Handle search window visibility
        ipcMain.handle('search-feature-show-window', async (event) => {
            return this.showSearchWindow();
        });

        ipcMain.handle('search-feature-hide-window', async (event) => {
            return this.hideSearchWindow();
        });

        ipcMain.handle('search-feature-close-window', async (event) => {
            return this.closeSearchWindow();
        });

        // Handle search operations
        ipcMain.handle('search-feature-perform-search', async (event, query, filters) => {
            return await this.performSearch(query, filters);
        });

        // Handle search window specific requests
        ipcMain.handle('search-window-perform-search', async (event, searchParams) => {
            const { query, filters } = searchParams;
            return await this.performSearch(query, filters);
        });

        ipcMain.handle('search-window-select-result', async (event, result) => {
            return await this.handleResultSelection(result);
        });

        // Handle feature management
        ipcMain.handle('search-feature-enable', async (event) => {
            return this.enable();
        });

        ipcMain.handle('search-feature-disable', async (event) => {
            return this.disable();
        });

        ipcMain.handle('search-feature-get-status', async (event) => {
            return this.getStatus();
        });

        ipcMain.handle('search-feature-get-config', async (event) => {
            return this.getConfig();
        });

        ipcMain.handle('search-feature-update-config', async (event, newConfig) => {
            return this.updateConfig(newConfig);
        });

        console.log('Search feature IPC handlers registered');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for search window events
        if (this.searchWindow) {
            // Window-specific events can be handled here
        }

        // Listen for search manager events
        if (this.searchManager) {
            // Manager-specific events can be handled here
        }
    }

    /**
     * Create and show the search window
     * @param {Object} options - Window creation options
     * @returns {Promise<Object>} Window creation result
     */
    async createSearchWindow(options = {}) {
        if (!this.isInitialized) {
            throw new Error('SearchFeature not initialized');
        }

        if (!this.isEnabled) {
            throw new Error('SearchFeature is disabled');
        }

        try {
            const window = await this.searchWindow.create(options);
            
            return {
                success: true,
                windowId: this.searchWindow.windowId,
                isVisible: this.searchWindow.isVisible
            };
            
        } catch (error) {
            console.error('Failed to create search window:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Show the search window
     * @returns {Object} Operation result
     */
    showSearchWindow() {
        if (!this.searchWindow) {
            return { success: false, error: 'Search window not created' };
        }

        try {
            this.searchWindow.show();
            return { success: true, isVisible: true };
        } catch (error) {
            console.error('Failed to show search window:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Hide the search window
     * @returns {Object} Operation result
     */
    hideSearchWindow() {
        if (!this.searchWindow) {
            return { success: false, error: 'Search window not created' };
        }

        try {
            this.searchWindow.hide();
            return { success: true, isVisible: false };
        } catch (error) {
            console.error('Failed to hide search window:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Close the search window
     * @returns {Object} Operation result
     */
    closeSearchWindow() {
        if (!this.searchWindow) {
            return { success: false, error: 'Search window not created' };
        }

        try {
            this.searchWindow.close();
            return { success: true };
        } catch (error) {
            console.error('Failed to close search window:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Perform a search operation
     * @param {string} query - Search query
     * @param {Object} filters - Search filters
     * @returns {Promise<Array>} Search results
     */
    async performSearch(query, filters = {}) {
        if (!this.isInitialized) {
            throw new Error('SearchFeature not initialized');
        }

        if (!this.isEnabled) {
            throw new Error('SearchFeature is disabled');
        }

        if (!this.searchManager) {
            throw new Error('SearchManager not available');
        }

        try {
            console.log('Performing search:', { query, filters });
            
            const results = await this.searchManager.search(query, filters);
            
            console.log(`Search completed: ${results.length} results found`);
            return results;
            
        } catch (error) {
            console.error('Search failed:', error);
            throw error;
        }
    }

    /**
     * Handle search result selection
     * @param {Object} result - Selected search result
     * @returns {Promise<Object>} Selection result
     */
    async handleResultSelection(result) {
        console.log('Handling result selection:', result);

        try {
            // Different handling based on result type
            switch (result.type) {
                case 'file':
                    return await this.openFile(result);
                    
                case 'content':
                    return await this.openFileAtLocation(result);
                    
                case 'web':
                    return await this.openWebResult(result);
                    
                default:
                    console.warn('Unknown result type:', result.type);
                    return { success: false, error: 'Unknown result type' };
            }
            
        } catch (error) {
            console.error('Failed to handle result selection:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Open a file result
     * @param {Object} result - File result
     * @returns {Promise<Object>} Open result
     */
    async openFile(result) {
        try {
            // Send event to main application to open file
            const { BrowserWindow } = require('electron');
            const focusedWindow = BrowserWindow.getFocusedWindow();
            
            if (focusedWindow) {
                focusedWindow.webContents.send('search-open-file', {
                    path: result.fullPath || result.path,
                    title: result.title
                });
            }

            return { 
                success: true, 
                action: 'file-opened',
                path: result.path 
            };
            
        } catch (error) {
            console.error('Failed to open file:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Open a file at specific location (for content results)
     * @param {Object} result - Content result
     * @returns {Promise<Object>} Open result
     */
    async openFileAtLocation(result) {
        try {
            // Send event to main application to open file at specific location
            const { BrowserWindow } = require('electron');
            const focusedWindow = BrowserWindow.getFocusedWindow();
            
            if (focusedWindow) {
                focusedWindow.webContents.send('search-open-file-location', {
                    path: result.fullPath || result.path,
                    title: result.title,
                    matches: result.matches || 1,
                    content: result.content
                });
            }

            return { 
                success: true, 
                action: 'file-location-opened',
                path: result.path,
                matches: result.matches
            };
            
        } catch (error) {
            console.error('Failed to open file at location:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Open a web result
     * @param {Object} result - Web result
     * @returns {Promise<Object>} Open result
     */
    async openWebResult(result) {
        try {
            const { shell } = require('electron');
            
            if (result.url) {
                await shell.openExternal(result.url);
                return { 
                    success: true, 
                    action: 'web-opened',
                    url: result.url 
                };
            } else {
                return { success: false, error: 'No URL provided' };
            }
            
        } catch (error) {
            console.error('Failed to open web result:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Enable the search feature
     * @returns {Object} Operation result
     */
    enable() {
        this.isEnabled = true;
        console.log('SearchFeature enabled');
        return { success: true, enabled: true };
    }

    /**
     * Disable the search feature
     * @returns {Object} Operation result
     */
    disable() {
        this.isEnabled = false;
        
        // Close search window if open
        if (this.searchWindow && this.searchWindow.isVisible) {
            this.searchWindow.hide();
        }
        
        console.log('SearchFeature disabled');
        return { success: true, enabled: false };
    }

    /**
     * Get search feature status
     * @returns {Object} Feature status
     */
    getStatus() {
        const searchManagerStats = this.searchManager ? this.searchManager.getStats() : null;
        const searchWindowStatus = this.searchWindow ? this.searchWindow.getVisibility() : null;

        return {
            isInitialized: this.isInitialized,
            isEnabled: this.isEnabled,
            hasSearchWindow: !!this.searchWindow,
            hasSearchManager: !!this.searchManager,
            searchManager: searchManagerStats,
            searchWindow: searchWindowStatus,
            config: this.config
        };
    }

    /**
     * Get search feature configuration
     * @returns {Object} Feature configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Update search feature configuration
     * @param {Object} newConfig - New configuration
     * @returns {Object} Update result
     */
    updateConfig(newConfig) {
        try {
            this.config = { ...this.config, ...newConfig };
            
            // Apply configuration changes
            if (this.searchManager) {
                // Update search manager configuration if needed
            }
            
            console.log('SearchFeature configuration updated:', this.config);
            return { success: true, config: this.config };
            
        } catch (error) {
            console.error('Failed to update configuration:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.searchWindow) {
            this.searchWindow.close();
        }

        if (this.searchManager) {
            this.searchManager.clearCache();
        }

        this.isInitialized = false;
        console.log('SearchFeature cleaned up');
    }

    /**
     * Get search feature instance
     * @returns {SearchFeature} This instance
     */
    getInstance() {
        return this;
    }
}

// Create singleton instance
const searchFeature = new SearchFeature();

// Convenience functions
const initializeSearchFeature = async (options) => {
    return await searchFeature.initialize(options);
};

const createSearchWindow = async (options) => {
    return await searchFeature.createSearchWindow(options);
};

const showSearchWindow = () => {
    return searchFeature.showSearchWindow();
};

const hideSearchWindow = () => {
    return searchFeature.hideSearchWindow();
};

const closeSearchWindow = () => {
    return searchFeature.closeSearchWindow();
};

const performSearch = async (query, filters) => {
    return await searchFeature.performSearch(query, filters);
};

const getSearchFeatureStatus = () => {
    return searchFeature.getStatus();
};

module.exports = {
    SearchFeature,
    searchFeature,
    initializeSearchFeature,
    createSearchWindow,
    showSearchWindow,
    hideSearchWindow,
    closeSearchWindow,
    performSearch,
    getSearchFeatureStatus
};
