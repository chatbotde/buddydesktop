/**
 * Storage Management Mixin
 * Handles localStorage operations and data persistence
 */
export const StorageManagementMixin = (superClass) => class extends superClass {
    
    async saveUserPreferences() {
        if (this.isAuthenticated && !this.isGuest) {
            // Save preferences to database for authenticated users
            try {
                const { ipcRenderer } = window.require('electron');
                const preferences = {
                    selectedProvider: this.selectedProvider,
                    selectedModel: this.selectedModel,
                    selectedProfile: this.selectedProfile,
                    selectedLanguage: this.selectedLanguage,
                    historyLimit: this.historyLimit,
                    enabledModels: this.enabledModels,
                    customProfiles: this.customProfiles,
                    windowOpacity: this.windowOpacity,
                    currentWindowTheme: this.currentWindowTheme,
                    customMenuButtons: this.customMenuButtons
                };
                
                await ipcRenderer.invoke('save-user-preferences', {
                    userId: this.user?.id,
                    preferences
                });
                console.log('User preferences saved to database');
            } catch (error) {
                console.error('Failed to save user preferences to database:', error);
                // Fallback to localStorage
                this.saveToLocalStorage();
            }
        } else {
            // Save to localStorage for guests
            this.saveToLocalStorage();
        }
    }
    
    saveToLocalStorage() {
        localStorage.setItem('selectedProvider', this.selectedProvider);
        localStorage.setItem('selectedModel', this.selectedModel);
        localStorage.setItem('selectedProfile', this.selectedProfile);
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
        localStorage.setItem('historyLimit', this.historyLimit.toString());
        localStorage.setItem('enabledModels', JSON.stringify(this.enabledModels));
        localStorage.setItem('customProfiles', JSON.stringify(this.customProfiles));
        localStorage.setItem('windowOpacity', this.windowOpacity.toString());
        localStorage.setItem('currentWindowTheme', this.currentWindowTheme);
        localStorage.setItem('customMenuButtons', JSON.stringify(this.customMenuButtons));
        console.log('User preferences saved to localStorage');
    }

    saveUserPreference(key, value) {
        try {
            localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
        } catch (error) {
            console.error(`Failed to save preference ${key}:`, error);
        }
    }

    loadUserPreference(key) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) return null;
            
            // Try to parse as JSON first, fallback to string
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (error) {
            console.error(`Failed to load preference ${key}:`, error);
            return null;
        }
    }

    loadEnabledModels() {
        try {
            const saved = localStorage.getItem('enabledModels');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load enabled models:', error);
        }
        
        // Return default preset if no saved data or error
        return this.getDefaultEnabledModels();
    }

    saveEnabledModels() {
        try {
            localStorage.setItem('enabledModels', JSON.stringify(this.enabledModels));
        } catch (error) {
            console.error('Failed to save enabled models:', error);
        }
    }

    loadCustomProfiles() {
        try {
            const saved = localStorage.getItem('customProfiles');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load custom profiles:', error);
        }
        
        // Return empty array if no saved data or error
        return [];
    }

    saveCustomProfiles() {
        try {
            localStorage.setItem('customProfiles', JSON.stringify(this.customProfiles));
        } catch (error) {
            console.error('Failed to save custom profiles:', error);
        }
    }

    async loadChatHistory() {
        if (this.isAuthenticated && !this.isGuest) {
            // Load from database for authenticated users
            try {
                const { ipcRenderer } = window.require('electron');
                const result = await ipcRenderer.invoke('load-chat-history', { userId: this.user?.id });
                if (result.success) {
                    this.history = result.history || [];
                }
            } catch (error) {
                console.error('Failed to load chat history from database:', error);
                // Fallback to localStorage
                this.loadFromLocalStorage();
            }
        } else {
            // Load from localStorage for guests
            this.loadFromLocalStorage();
        }
    }
    
    loadFromLocalStorage() {
        try {
            const savedHistory = localStorage.getItem('chatHistory');
            this.history = savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            console.error('Failed to load chat history from localStorage:', error);
            this.history = [];
        }
    }

    saveToLocalStorageHistory(sessionData) {
        const newHistory = [...this.history];
        newHistory.unshift(sessionData);
        // Enforce limit
        if (newHistory.length > this.historyLimit) {
            newHistory.length = this.historyLimit;
        }
        this.history = newHistory;
        localStorage.setItem('chatHistory', JSON.stringify(this.history));
    }

    createCustomProfile(profileData) {
        // Add the new profile to the array
        this.customProfiles = [...this.customProfiles, profileData];
        this.saveCustomProfiles();
        this.requestUpdate();
    }

    deleteCustomProfile(profileValue) {
        // Remove the profile from the array
        this.customProfiles = this.customProfiles.filter(p => p.value !== profileValue);
        this.saveCustomProfiles();
        
        // If the deleted profile was selected, switch to default
        if (this.selectedProfile === profileValue) {
            this.selectedProfile = 'default';
            if (this.isGuest) {
                localStorage.setItem('selectedProfile', this.selectedProfile);
            } else {
                this.saveUserPreferences();
            }
        }
        
        this.requestUpdate();
    }

    deleteSession(index) {
        this.history = this.history.filter((_, i) => i !== index);
        localStorage.setItem('chatHistory', JSON.stringify(this.history));
        this.requestUpdate();
    }

    extendHistoryLimit() {
        this.historyLimit += 5;
        localStorage.setItem('historyLimit', this.historyLimit);
        // No need to trim history, just allow more
        this.requestUpdate();
    }

    decreaseHistoryLimit() {
        if (this.historyLimit > 5) {
            this.historyLimit -= 5;
            localStorage.setItem('historyLimit', this.historyLimit);
            // Trim history if needed
            if (this.history.length > this.historyLimit) {
                this.history.length = this.historyLimit;
                localStorage.setItem('chatHistory', JSON.stringify(this.history));
            }
            this.requestUpdate();
        }
    }
};
