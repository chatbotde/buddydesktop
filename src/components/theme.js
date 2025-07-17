import { ThemeConfig, backgroundThemes } from './ui/theme-config.js';

/**
 * Centralized Theme Manager for Buddy Desktop
 * Handles theme loading, saving, validation, and application
 */
export class ThemeManager {
    constructor() {
        this.config = ThemeConfig;
        this.backgroundThemes = backgroundThemes;
    }

    /**
     * Load saved theme from localStorage for a specific message type
     * @param {string} messageType - 'input' or 'output'
     * @returns {string} Theme key
     */
    loadSavedTheme(messageType = 'output') {
        try {
            const themeKey = `buddy-chat-${messageType}-theme`;
            const savedTheme = localStorage.getItem(themeKey);
            
            console.log(`Loading theme for ${messageType} message:`, savedTheme);
            
            if (savedTheme && this.config.themes[savedTheme]) {
                // Check if the theme is suitable for this message type
                const theme = this.config.themes[savedTheme];
                if (theme.suitableFor.includes(messageType)) {
                    console.log(`Using saved theme: ${savedTheme} for ${messageType}`);
                    return savedTheme;
                } else {
                    console.warn(`Saved theme ${savedTheme} is not suitable for ${messageType} messages`);
                }
            }
            
            // Fallback to default theme for this message type
            const defaultTheme = this.config.getDefaultTheme(messageType);
            console.log(`Using default theme: ${defaultTheme} for ${messageType}`);
            return defaultTheme;
        } catch (error) {
            console.warn('Failed to load saved theme:', error);
            return this.config.getDefaultTheme(messageType);
        }
    }

    /**
     * Save theme preference to localStorage
     * @param {string} themeKey - Theme key to save
     * @param {string} messageType - 'input' or 'output'
     */
    saveTheme(themeKey, messageType = 'output') {
        try {
            const storageKey = `buddy-chat-${messageType}-theme`;
            localStorage.setItem(storageKey, themeKey);
            console.log(`Saved theme ${themeKey} for ${messageType} messages`);
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
    }

    /**
     * Validate if a theme is suitable for a message type
     * @param {string} themeKey - Theme key to validate
     * @param {string} messageType - 'input' or 'output'
     * @returns {boolean} Whether the theme is valid
     */
    validateTheme(themeKey, messageType = 'output') {
        const theme = this.config.themes[themeKey];
        
        if (!theme) {
            console.warn(`Theme "${themeKey}" not found in theme config`);
            return false;
        }
        
        if (!theme.suitableFor.includes(messageType)) {
            console.warn(`Theme "${themeKey}" is not suitable for ${messageType} messages. Suitable for: ${theme.suitableFor.join(', ')}`);
            return false;
        }
        
        console.log(`Theme "${themeKey}" is valid for ${messageType} messages`);
        return true;
    }

    /**
     * Get a valid theme for a message type, with fallback to default
     * @param {string} themeKey - Desired theme key
     * @param {string} messageType - 'input' or 'output'
     * @returns {string} Valid theme key
     */
    getValidTheme(themeKey, messageType = 'output') {
        if (this.validateTheme(themeKey, messageType)) {
            return themeKey;
        }
        return this.config.getDefaultTheme(messageType);
    }

    /**
     * Get CSS class for a theme
     * @param {string} themeKey - Theme key
     * @returns {string} CSS class
     */
    getThemeClass(themeKey) {
        const theme = this.config.themes[themeKey];
        return theme ? theme.class : '';
    }

    /**
     * Get background class for rendering (excludes default theme)
     * @param {string} themeKey - Theme key
     * @returns {string} Background CSS class
     */
    getBackgroundClass(themeKey) {
        return themeKey !== 'default' ? this.getThemeClass(themeKey) : '';
    }

    /**
     * Get filtered themes for a message type
     * @param {string} messageType - 'input' or 'output'
     * @param {string} searchQuery - Optional search query
     * @param {string} category - Optional category filter
     * @returns {Object} Filtered themes
     */
    getFilteredThemes(messageType = 'output', searchQuery = '', category = 'all') {
        let themes = this.config.getThemesForMessageType(messageType);
        
        // Filter by search query
        if (searchQuery) {
            themes = this.config.searchThemes(searchQuery, messageType);
        }
        
        // Filter by category
        if (category && category !== 'all') {
            const categoryThemes = this.config.getThemesByCategory(category);
            themes = Object.entries(themes)
                .filter(([key, theme]) => categoryThemes[key])
                .reduce((acc, [key, theme]) => {
                    acc[key] = theme;
                    return acc;
                }, {});
        }
        
        return themes;
    }

    /**
     * Get categorized themes for dropdown display
     * @param {string} messageType - 'input' or 'output'
     * @param {string} searchQuery - Optional search query
     * @returns {Object} Categorized themes
     */
    getCategorizedThemes(messageType = 'output', searchQuery = '') {
        const categorized = this.config.getThemesForDropdown(messageType);
        
        // Filter by search if needed
        if (searchQuery) {
            const searchResults = this.config.searchThemes(searchQuery, messageType);
            const filtered = {};
            Object.keys(categorized).forEach(categoryKey => {
                const categoryThemes = categorized[categoryKey].themes;
                const filteredThemes = {};
                Object.keys(categoryThemes).forEach(themeKey => {
                    if (searchResults[themeKey]) {
                        filteredThemes[themeKey] = categoryThemes[themeKey];
                    }
                });
                if (Object.keys(filteredThemes).length > 0) {
                    filtered[categoryKey] = {
                        ...categorized[categoryKey],
                        themes: filteredThemes
                    };
                }
            });
            return filtered;
        }
        return categorized;
    }

    /**
     * Get theme by key with fallback
     * @param {string} themeKey - Theme key
     * @returns {Object} Theme object
     */
    getTheme(themeKey) {
        return this.config.getThemeByKey(themeKey);
    }

    /**
     * Get all available themes
     * @returns {Object} All themes
     */
    getAllThemes() {
        return this.config.themes;
    }

    /**
     * Get themes suitable for a specific message type
     * @param {string} messageType - 'input' or 'output'
     * @returns {Object} Suitable themes
     */
    getThemesForMessageType(messageType) {
        return this.config.getThemesForMessageType(messageType);
    }

    /**
     * Get default theme for a message type
     * @param {string} messageType - 'input' or 'output'
     * @returns {string} Default theme key
     */
    getDefaultTheme(messageType) {
        return this.config.getDefaultTheme(messageType);
    }

    /**
     * Search themes by query
     * @param {string} query - Search query
     * @param {string} messageType - 'input' or 'output'
     * @returns {Object} Matching themes
     */
    searchThemes(query, messageType = 'output') {
        return this.config.searchThemes(query, messageType);
    }

    /**
     * Get themes by category
     * @param {string} category - Category key
     * @returns {Object} Category themes
     */
    getThemesByCategory(category) {
        return this.config.getThemesByCategory(category);
    }

    /**
     * Get all categories
     * @returns {Object} All categories
     */
    getAllCategories() {
        return this.config.getAllCategories();
    }
}

/**
 * Theme Management Mixin for LitElement components
 * Provides theme-related functionality to components
 */
export const ThemeMixin = (superClass) => class extends superClass {
    static properties = {
        ...superClass.properties,
        backgroundTheme: { type: String },
        showBackgroundDropdown: { type: Boolean },
        searchQuery: { type: String },
        selectedCategory: { type: String },
    };

    constructor() {
        super();
        this.themeManager = new ThemeManager();
        this.showBackgroundDropdown = false;
        this.searchQuery = '';
        this.selectedCategory = 'all';
    }

    /**
     * Load saved theme for this component's message type
     */
    _loadSavedTheme() {
        if (!this.sender) {
            console.warn('Sender not available yet, using default theme');
            return this.themeManager.getDefaultTheme('input');
        }
        
        const messageType = this.sender === 'user' ? 'input' : 'output';
        return this.themeManager.loadSavedTheme(messageType);
    }

    /**
     * Validate and fix theme for current message type
     */
    _validateAndFixTheme() {
        if (!this.sender) {
            console.warn('Cannot validate theme: sender not available');
            return;
        }

        if (!this.backgroundTheme) {
            console.log('No background theme set, loading saved theme');
            this.backgroundTheme = this._loadSavedTheme();
            return;
        }

        const messageType = this.sender === 'user' ? 'input' : 'output';
        
        if (!this.themeManager.validateTheme(this.backgroundTheme, messageType)) {
            this.backgroundTheme = this.themeManager.getDefaultTheme(messageType);
        }
    }

    /**
     * Handle background theme change
     */
    _onBackgroundThemeChange(theme) {
        if (this.backgroundTheme === theme) {
            this.showBackgroundDropdown = false;
            this.searchQuery = '';
            this.selectedCategory = 'all';
            return;
        }

        this.backgroundTheme = theme;
        this.showBackgroundDropdown = false;
        this.searchQuery = '';
        this.selectedCategory = 'all';
        
        // Save theme preference
        const messageType = this.sender === 'user' ? 'input' : 'output';
        this.themeManager.saveTheme(theme, messageType);
        
        this.requestUpdate();
        
        // Dispatch event to notify parent of background change
        this.dispatchEvent(new CustomEvent('background-theme-changed', {
            detail: { 
                id: this.id,
                backgroundTheme: this.backgroundTheme
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Get filtered themes for current message type
     */
    _getFilteredThemes() {
        const messageType = this.sender === 'user' ? 'input' : 'output';
        return this.themeManager.getFilteredThemes(messageType, this.searchQuery, this.selectedCategory);
    }

    /**
     * Get categorized themes for dropdown
     */
    _getCategorizedThemes() {
        const messageType = this.sender === 'user' ? 'input' : 'output';
        return this.themeManager.getCategorizedThemes(messageType, this.searchQuery);
    }

    /**
     * Get background class for rendering
     */
    _getBackgroundClass() {
        return this.themeManager.getBackgroundClass(this.backgroundTheme);
    }

    /**
     * Toggle background dropdown
     */
    _onToggleBackgroundDropdown() {
        this.showBackgroundDropdown = !this.showBackgroundDropdown;
        this.requestUpdate();
        
        // Dispatch event to notify parent of dropdown state change
        this.dispatchEvent(new CustomEvent('background-dropdown-toggled', {
            detail: { 
                id: this.id,
                isOpen: this.showBackgroundDropdown
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle search input
     */
    _onSearchInput(e) {
        this.searchQuery = e.target.value;
        this.requestUpdate();
    }

    /**
     * Handle category selection
     */
    _onCategorySelect(category) {
        this.selectedCategory = category;
        this.requestUpdate();
    }

    /**
     * Initialize theme on component connection
     */
    connectedCallback() {
        super.connectedCallback();
        
        // Initialize background theme if not already set
        if (!this.backgroundTheme) {
            this.backgroundTheme = this._loadSavedTheme();
        }
    }

    /**
     * Handle theme updates
     */
    updated(changedProperties) {
        super.updated(changedProperties);
        
        // Validate theme when sender or backgroundTheme changes
        if (changedProperties.has('sender')) {
            console.log(`Sender changed from "${changedProperties.get('sender')}" to "${this.sender}"`);
            // Reload theme when sender changes
            this.backgroundTheme = this._loadSavedTheme();
            this._validateAndFixTheme();
        } else if (changedProperties.has('backgroundTheme')) {
            this._validateAndFixTheme();
        }
    }
};

// Export singleton instance for global use
export const themeManager = new ThemeManager();

// Export theme config for backward compatibility
export { ThemeConfig, backgroundThemes };
