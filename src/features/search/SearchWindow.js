/**
 * SearchWindow - Dedicated window for search features
 * Creates a rectangular window with rounded corners for search controls and results
 */
const { windowManager } = require('../../window.js');
const path = require('path');
const { ipcMain } = require('electron');

class SearchWindow {
    constructor() {
        this.window = null;
        this.windowId = 'search-window';
        this.isVisible = false;
        this.isExpanded = false;
        this.searchResults = [];
        this.currentQuery = '';
    }

    /**
     * Create and show the search window
     * @param {Object} options - Window creation options
     */
    async create(options = {}) {
        if (this.window && !this.window.isDestroyed()) {
            this.show();
            return this.window;
        }

        const searchWindowOptions = {
            width: 450,
            height: 80,
            frame: false,
            transparent: true,
            hasShadow: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            hiddenInMissionControl: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            closable: true,
            roundedCorners: true,
            vibrancy: 'ultra-dark',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                backgroundThrottling: false,
                webSecurity: true,
                allowRunningInsecureContent: false,
            },
            backgroundColor: '#00000000',
            titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : undefined,
            ...options
        };

        // Create the window using WindowManager
        this.window = windowManager.createWindow(searchWindowOptions, this.windowId);

        // Load the search window HTML
        const htmlPath = path.join(__dirname, 'search-window.html');
        await this.window.loadFile(htmlPath);

        // Set up window event handlers
        this.setupEventHandlers();

        // Position window (default to center-top of screen)
        this.positionWindow();

        this.isVisible = true;
        console.log('Search window created');

        return this.window;
    }

    /**
     * Set up window event handlers
     */
    setupEventHandlers() {
        if (!this.window) return;

        // Handle window closed
        this.window.on('closed', () => {
            this.window = null;
            this.isVisible = false;
            console.log('Search window closed');
        });

        // Handle window ready
        this.window.webContents.once('dom-ready', () => {
            console.log('Search window DOM ready');
        });

        // Set up IPC handlers
        this.setupIpcHandlers();

        // Prevent navigation
        this.window.webContents.on('will-navigate', (event) => {
            event.preventDefault();
        });

        // Handle new window requests
        this.window.webContents.setWindowOpenHandler(() => {
            return { action: 'deny' };
        });

        // Handle focus events
        this.window.on('focus', () => {
            console.log('Search window focused');
        });

        this.window.on('blur', () => {
            console.log('Search window blurred');
        });
    }

    /**
     * Set up IPC communication handlers
     */
    setupIpcHandlers() {
        // Handle search requests
        ipcMain.handle('search-window-perform-search', async (event, query) => {
            return await this.performSearch(query);
        });

        // Handle search result selection
        ipcMain.handle('search-window-select-result', async (event, result) => {
            return await this.selectSearchResult(result);
        });

        // Handle window expand/collapse
        ipcMain.handle('search-window-toggle-expand', async (event) => {
            return await this.toggleExpand();
        });

        // Handle window close
        ipcMain.handle('search-window-close', async (event) => {
            this.close();
        });

        // Handle window minimize
        ipcMain.handle('search-window-minimize', async (event) => {
            this.minimize();
        });

        // Handle theme toggle
        ipcMain.handle('search-window-toggle-theme', async (event) => {
            return await this.toggleTheme();
        });
    }

    /**
     * Position the search window on screen
     */
    positionWindow() {
        if (!this.window) return;

        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        
        const windowBounds = this.window.getBounds();
        const x = Math.round((screenWidth - windowBounds.width) / 2);
        const y = Math.round(screenHeight * 0.15); // Position in top 15% of screen
        
        this.window.setPosition(x, y);
        console.log(`Search window positioned at (${x}, ${y})`);
    }

    /**
     * Perform search operation
     * @param {string} query - Search query
     * @returns {Promise<Array>} Search results
     */
    async performSearch(query) {
        this.currentQuery = query;
        console.log('Performing search for:', query);

        try {
            // Implement your search logic here
            // This could search files, content, web, etc.
            const results = await this.executeSearch(query);
            this.searchResults = results;
            
            // Expand window if we have results
            if (results.length > 0 && !this.isExpanded) {
                await this.expand();
            }
            
            return results;
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    /**
     * Execute the actual search logic
     * @param {string} query - Search query
     * @returns {Promise<Array>} Search results
     */
    async executeSearch(query) {
        // Placeholder search implementation
        // You can implement file search, content search, web search, etc.
        const mockResults = [
            {
                type: 'file',
                title: `Example result for "${query}"`,
                path: '/path/to/file.js',
                content: 'Matching content snippet...',
                relevance: 0.9
            },
            {
                type: 'content',
                title: `Content match for "${query}"`,
                path: '/path/to/document.md',
                content: 'Another matching snippet...',
                relevance: 0.7
            }
        ];

        // Simulate search delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return mockResults;
    }

    /**
     * Handle search result selection
     * @param {Object} result - Selected search result
     */
    async selectSearchResult(result) {
        console.log('Search result selected:', result);
        
        // Implement result selection logic
        // This could open files, navigate to content, etc.
        
        // For now, just log the selection
        return { success: true, result };
    }

    /**
     * Toggle window expansion
     */
    async toggleExpand() {
        if (this.isExpanded) {
            await this.collapse();
        } else {
            await this.expand();
        }
        return this.isExpanded;
    }

    /**
     * Expand the search window to show results
     */
    async expand() {
        if (!this.window || this.isExpanded) return;

        const newHeight = 400; // Expanded height for search results
        const currentBounds = this.window.getBounds();
        
        this.window.setSize(currentBounds.width, newHeight, true);
        this.isExpanded = true;
        
        console.log('Search window expanded');
    }

    /**
     * Collapse the search window to compact size
     */
    async collapse() {
        if (!this.window || !this.isExpanded) return;

        const newHeight = 80; // Compact height for search input only
        const currentBounds = this.window.getBounds();
        
        this.window.setSize(currentBounds.width, newHeight, true);
        this.isExpanded = false;
        
        console.log('Search window collapsed');
    }

    /**
     * Toggle window theme
     */
    async toggleTheme() {
        if (!this.window) return;

        // Send theme toggle event to renderer
        this.window.webContents.send('search-window-theme-toggle');
        return { success: true };
    }

    /**
     * Show the search window
     */
    show() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.show();
            this.window.focus();
            this.isVisible = true;
            console.log('Search window shown');
        }
    }

    /**
     * Hide the search window
     */
    hide() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.hide();
            this.isVisible = false;
            console.log('Search window hidden');
        }
    }

    /**
     * Minimize the search window
     */
    minimize() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.minimize();
            console.log('Search window minimized');
        }
    }

    /**
     * Close the search window
     */
    close() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.close();
        }
    }

    /**
     * Get window visibility status
     */
    getVisibility() {
        return {
            isVisible: this.isVisible,
            isExpanded: this.isExpanded,
            currentQuery: this.currentQuery,
            resultCount: this.searchResults.length
        };
    }

    /**
     * Clear search results
     */
    clearResults() {
        this.searchResults = [];
        this.currentQuery = '';
        if (this.isExpanded) {
            this.collapse();
        }
    }
}

// Create singleton instance
const searchWindow = new SearchWindow();

// Export convenience functions
const createSearchWindow = async (options) => {
    return await searchWindow.create(options);
};

const showSearchWindow = () => {
    searchWindow.show();
};

const hideSearchWindow = () => {
    searchWindow.hide();
};

const closeSearchWindow = () => {
    searchWindow.close();
};

const getSearchWindow = () => {
    return searchWindow.window;
};

const getSearchWindowStatus = () => {
    return searchWindow.getVisibility();
};

module.exports = {
    SearchWindow,
    searchWindow,
    createSearchWindow,
    showSearchWindow,
    hideSearchWindow,
    closeSearchWindow,
    getSearchWindow,
    getSearchWindowStatus
};
