/**
 * Authentication and Initialization Mixin
 * Handles authentication, math system initialization, and app startup
 */
import { initializeUnifiedMathSystem } from '../math/index.js';

export const AuthInitializationMixin = (superClass) => class extends superClass {
    
    /**
     * Initialize the unified math rendering system
     */
    async initializeUnifiedMath() {
        try {
            await initializeUnifiedMathSystem();
            console.log('Math system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize math system:', error);
        }
    }

    async initializeAuth() {
        try {
            if (this.isAuthenticated && !this.isGuest) {
                // Load user preferences from database
                const { ipcRenderer } = window.require('electron');
                const result = await ipcRenderer.invoke('load-user-preferences', {
                    userId: this.user?.id
                });
                
                if (result.success && result.preferences) {
                    // Apply loaded preferences
                    const prefs = result.preferences;
                    this.selectedProvider = prefs.selectedProvider || this.selectedProvider;
                    this.selectedModel = prefs.selectedModel || this.selectedModel;
                    this.selectedProfile = prefs.selectedProfile || this.selectedProfile;
                    this.selectedLanguage = prefs.selectedLanguage || this.selectedLanguage;
                    this.historyLimit = prefs.historyLimit || this.historyLimit;
                    this.enabledModels = prefs.enabledModels || this.enabledModels;
                    this.customProfiles = prefs.customProfiles || this.customProfiles;
                    this.windowOpacity = prefs.windowOpacity || this.windowOpacity;
                    this.currentWindowTheme = prefs.currentWindowTheme || this.currentWindowTheme;
                    this.customMenuButtons = prefs.customMenuButtons || this.customMenuButtons;
                    
                    console.log('User preferences loaded from database');
                } else {
                    // Fallback to localStorage if database fails
                    this.loadFromLocalStoragePreferences();
                }
            } else {
                // Load from localStorage for guests
                this.loadFromLocalStoragePreferences();
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            // Fallback to localStorage on error
            this.loadFromLocalStoragePreferences();
        }
    }
    
    loadFromLocalStoragePreferences() {
        this.selectedProvider = localStorage.getItem('selectedProvider') || this.selectedProvider;
        this.selectedModel = localStorage.getItem('selectedModel') || this.selectedModel;
        this.selectedProfile = localStorage.getItem('selectedProfile') || this.selectedProfile;
        this.selectedLanguage = localStorage.getItem('selectedLanguage') || this.selectedLanguage;
        this.historyLimit = parseInt(localStorage.getItem('historyLimit')) || this.historyLimit;
        this.enabledModels = this.loadEnabledModels();
        this.customProfiles = this.loadCustomProfiles();
        this.customMenuButtons = this.loadUserPreference('customMenuButtons') || this.customMenuButtons;
        this.windowOpacity = parseFloat(localStorage.getItem('windowOpacity')) || this.windowOpacity;
        this.currentWindowTheme = localStorage.getItem('windowTheme') || this.currentWindowTheme;
        
        console.log('User preferences loaded from localStorage');
    }
};
