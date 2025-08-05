/**
 * Window Management Mixin
 * Handles window operations, themes, opacity, and IPC communication
 */
export const WindowManagementMixin = (superClass) => class extends superClass {
    
    async handleWindowClose() {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('window-close');
    }

    async toggleContentProtection(enabled) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('toggle-content-protection', enabled);
            if (result.success) {
                console.log(`Content protection ${enabled ? 'enabled' : 'disabled'}`);
            } else {
                console.error('Failed to toggle content protection:', result.error);
            }
        } catch (error) {
            console.error('Error toggling content protection:', error);
        }
    }

    async toggleWorkspaceVisibility(enabled) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('toggle-workspace-visibility', enabled);
            if (result.success) {
                console.log(`Workspace visibility ${enabled ? 'enabled' : 'disabled'}`);
            } else {
                console.error('Failed to toggle workspace visibility:', result.error);
            }
        } catch (error) {
            console.error('Error toggling workspace visibility:', error);
        }
    }

    async openAudioWindow() {
        try {
            const { ipcRenderer } = window.require('electron');
            
            // Send IPC message to main process to create audio window
            const result = await ipcRenderer.invoke('create-audio-window', {
                width: 400,
                height: 400,
                // Position in top-right corner by default
                x: undefined,
                y: undefined
            });
            
            if (result.success) {
                console.log('Audio window opened successfully');
                this.isAudioWindowOpen = true;
                
                // Show brief notification
                this.statusText = 'Audio window opened';
                setTimeout(() => {
                    if (this.statusText === 'Audio window opened') {
                        this.statusText = '';
                    }
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to create audio window');
            }
            
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to open audio window:', error);
            
            // Show error message
            this.statusText = 'Failed to open audio window';
            setTimeout(() => {
                if (this.statusText === 'Failed to open audio window') {
                    this.statusText = '';
                }
            }, 3000);
            
            this.requestUpdate();
        }
    }

    async openMarketplaceWindow() {
        try {
            const { ipcRenderer } = window.require('electron');
            
            // Send IPC message to main process to create marketplace window
            const result = await ipcRenderer.invoke('create-marketplace-window', {
                selectedButtons: this.customMenuButtons || [],
                width: 800,
                height: 600
            });
            
            if (result.success) {
                console.log('Marketplace window opened successfully');
                
                // Show brief notification
                this.statusText = 'Marketplace window opened';
                setTimeout(() => {
                    if (this.statusText === 'Marketplace window opened') {
                        this.statusText = '';
                    }
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to create marketplace window');
            }
            
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to open marketplace window:', error);
            
            // Show error message
            this.statusText = 'Failed to open marketplace window';
            setTimeout(() => {
                if (this.statusText === 'Failed to open marketplace window') {
                    this.statusText = '';
                }
            }, 3000);
            
            this.requestUpdate();
        }
    }

    async toggleSearch() {
        try {
            this.isSearchActive = !this.isSearchActive;
            
            // Update header with search state
            const header = this.shadowRoot.querySelector('buddy-header');
            if (header) {
                header.isSearchActive = this.isSearchActive;
            }
            
            // Show brief notification
            this.statusText = this.isSearchActive ? 'Search enabled' : 'Search disabled';
            setTimeout(() => {
                if (this.statusText === 'Search enabled' || this.statusText === 'Search disabled') {
                    this.statusText = '';
                }
            }, 2000);
            
            console.log('Search toggled:', this.isSearchActive);
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to toggle search:', error);
            
            // Show error message
            this.statusText = 'Failed to toggle search';
            setTimeout(() => {
                if (this.statusText === 'Failed to toggle search') {
                    this.statusText = '';
                }
            }, 3000);
            
            this.requestUpdate();
        }
    }

    async openSearchWindow() {
        try {
            const { ipcRenderer } = window.require('electron');
            
            // Send IPC message to main process to create search window
            const result = await ipcRenderer.invoke('create-search-window', {
                width: 450,
                height: 80,
                // Position in center-top by default
                x: undefined,
                y: undefined
            });
            
            if (result.success) {
                console.log('Search window opened successfully');
                this.isSearchWindowOpen = true;
                
                // Show brief notification
                this.statusText = 'Search window opened';
                setTimeout(() => {
                    if (this.statusText === 'Search window opened') {
                        this.statusText = '';
                    }
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to create search window');
            }
            
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to open search window:', error);
            
            // Show error message
            this.statusText = 'Failed to open search window';
            setTimeout(() => {
                if (this.statusText === 'Failed to open search window') {
                    this.statusText = '';
                }
            }, 3000);
            
            this.requestUpdate();
        }
    }

    _handleMarketplaceButtonsUpdated(selectedButtons) {
        // Update the custom menu buttons
        this.customMenuButtons = selectedButtons;
        
        // Save the configuration
        this.saveUserPreference('customMenuButtons', selectedButtons);
        
        // Update header component
        const header = this.shadowRoot.querySelector('buddy-header');
        if (header) {
            header.customMenuButtons = selectedButtons;
            header.requestUpdate();
        }
        
        // Show brief notification
        this.statusText = 'Menu buttons updated';
        setTimeout(() => {
            if (this.statusText === 'Menu buttons updated') {
                this.statusText = '';
            }
        }, 2000);
        
        this.requestUpdate();
    }

    async toggleOpacityControl(active) {
        this.isOpacityControlActive = active;
        
        if (active) {
            // Add scroll wheel event listener
            this.addEventListener('wheel', this.handleOpacityScroll.bind(this), { passive: false });
            console.log('Opacity control activated - use scroll wheel to adjust opacity');
        } else {
            // Remove scroll wheel event listener
            this.removeEventListener('wheel', this.handleOpacityScroll.bind(this));
            console.log('Opacity control deactivated');
        }
        
        this.requestUpdate();
    }

    handleOpacityScroll(e) {
        if (!this.isOpacityControlActive) return;
        
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05; // Invert scroll direction for intuitive control
        this.adjustWindowOpacity(delta);
    }

    async adjustWindowOpacity(delta) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('adjust-window-opacity', {
                windowId: 'main', // Assuming main window ID
                delta: delta
            });
            
            if (result.success) {
                this.windowOpacity = result.opacity;
                this.requestUpdate();
                console.log(`Window opacity adjusted to: ${Math.round(this.windowOpacity * 100)}%`);
            } else {
                console.error('Failed to adjust window opacity:', result.error);
            }
        } catch (error) {
            console.error('Error adjusting window opacity:', error);
        }
    }

    async setWindowOpacity(opacity) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('set-window-opacity', {
                windowId: 'main', // Assuming main window ID
                opacity: opacity
            });
            
            if (result.success) {
                this.windowOpacity = opacity;
                // Save opacity preference to localStorage
                localStorage.setItem('windowOpacity', opacity.toString());
                this.requestUpdate();
                console.log(`Window opacity set to: ${Math.round(this.windowOpacity * 100)}%`);
            } else {
                console.error('Failed to set window opacity:', result.error);
            }
        } catch (error) {
            console.error('Error setting window opacity:', error);
        }
    }

    async setWindowTheme(theme) {
        try {
            console.log('Buddy element: Setting window theme to:', theme);
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('set-simple-window-theme', {
                windowId: 'main',
                theme: theme
            });
            
            console.log('IPC result:', result);
            
            if (result.success) {
                this.currentWindowTheme = theme;
                // Save theme preference to localStorage
                localStorage.setItem('windowTheme', theme);
                this.requestUpdate();
                console.log(`Window theme successfully set to: ${theme}`);
            } else {
                console.error('Failed to set window theme:', result.error);
            }
        } catch (error) {
            console.error('Error setting window theme:', error);
        }
    }

    async loadAvailableThemes() {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('get-simple-themes');
            
            if (result.success) {
                this.availableThemes = result.themes;
                this.requestUpdate();
            } else {
                console.error('Failed to load available themes:', result.error);
            }
        } catch (error) {
            console.error('Error loading available themes:', error);
        }
    }

    async loadSavedTheme() {
        try {
            // Load saved theme from localStorage
            const savedTheme = localStorage.getItem('windowTheme');
            
            if (savedTheme && (savedTheme === 'transparent' || savedTheme === 'black')) {
                console.log('Loading saved theme:', savedTheme);
                await this.setWindowTheme(savedTheme);
            } else {
                // Set default theme if no valid saved theme
                console.log('No valid saved theme found, using default: transparent');
                await this.setWindowTheme('transparent');
            }
        } catch (error) {
            console.error('Error loading saved theme:', error);
            // Fallback to default theme on error
            await this.setWindowTheme('transparent');
        }
    }

    async loadSavedOpacity() {
        try {
            // Load saved opacity from localStorage
            const savedOpacity = localStorage.getItem('windowOpacity');
            
            if (savedOpacity) {
                const opacity = parseFloat(savedOpacity);
                
                // Validate opacity value (between 0.1 and 1.0)
                if (opacity >= 0.1 && opacity <= 1.0) {
                    console.log('Loading saved opacity:', opacity);
                    await this.setWindowOpacity(opacity);
                } else {
                    // Set default opacity if saved value is invalid
                    console.log('Invalid saved opacity, using default: 1.0');
                    await this.setWindowOpacity(1.0);
                }
            } else {
                // Set default opacity if no saved value
                console.log('No saved opacity found, using default: 1.0');
                await this.setWindowOpacity(1.0);
            }
        } catch (error) {
            console.error('Error loading saved opacity:', error);
            // Fallback to default opacity on error
            await this.setWindowOpacity(1.0);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ;
        localStorage.setItem('theme', this.currentTheme);
        this.setAttribute('theme', this.currentTheme);
        this.requestUpdate();
    }
};
