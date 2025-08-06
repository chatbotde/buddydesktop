/**
 * Window Theme Selector Component
 * 
 * This component provides a UI for selecting window themes
 */

class WindowThemeSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.themes = {};
        this.currentTheme = 'standard';
        this.windowId = null;
    }

    async connectedCallback() {
        // Get available themes from the main process
        if (window.ipcRenderer) {
            this.windowId = this.getAttribute('window-id') || 'current-window';
            
            // Request themes from main process
            window.ipcRenderer.invoke('get-window-themes').then(response => {
                if (response.success) {
                    this.themes = response.themes;
                    this.currentTheme = response.currentTheme || 'standard';
                    this.render();
                }
            }).catch(err => {
                console.error('Failed to get window themes:', err);
                this.render();
            });
        } else {
            // Fallback for when IPC is not available
            this.themes = {
                standard: { name: 'Standard', description: 'Default window appearance' },
                solid: { name: 'Solid', description: 'Solid window with no transparency' },
                glass: { name: 'Glass', description: 'Frosted glass effect for windows' },
                dark: { name: 'Dark Mode', description: 'Dark themed window' },
                light: { name: 'Light Mode', description: 'Light themed window' },
                colorful: { name: 'Colorful', description: 'Colorful window with gradient background' }
            };
            this.render();
        }
    }

    render() {
        const style = `
            :host {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .theme-selector {
                background: rgba(0, 0, 0, 0.7);
                border-radius: 8px;
                padding: 12px;
                color: white;
                max-width: min(300px, 90vw);
                width: min(300px, 90vw);
            }
            .theme-selector h3 {
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 500;
            }
            .theme-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 8px;
            }
            .theme-button {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 6px;
                padding: 8px;
                color: white;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s ease;
                display: flex;
                flex-direction: column;
            }
            .theme-button:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .theme-button.active {
                background: rgba(66, 153, 225, 0.5);
                box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.8);
            }
            .theme-name {
                font-weight: 500;
                margin-bottom: 4px;
            }
            .theme-description {
                font-size: 12px;
                opacity: 0.8;
            }
            
            /* Responsive adjustments for smaller windows */
            @media (max-width: 480px) {
                .theme-selector {
                    max-width: calc(100vw - 32px);
                    width: calc(100vw - 32px);
                    padding: 10px;
                }
                
                .theme-list {
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 6px;
                }
                
                .theme-button {
                    padding: 6px;
                }
                
                .theme-name {
                    font-size: 14px;
                }
                
                .theme-description {
                    font-size: 11px;
                }
                
                .theme-selector h3 {
                    font-size: 14px;
                }
            }
            
            @media (max-width: 360px) {
                .theme-selector {
                    max-width: calc(100vw - 16px);
                    width: calc(100vw - 16px);
                    padding: 8px;
                }
                
                .theme-list {
                    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                    gap: 4px;
                }
                
                .theme-button {
                    padding: 4px;
                }
                
                .theme-name {
                    font-size: 12px;
                }
                
                .theme-description {
                    font-size: 10px;
                }
                
                .theme-selector h3 {
                    font-size: 13px;
                }
            }
        `;

        const themeButtons = Object.entries(this.themes).map(([key, theme]) => `
            <button class="theme-button ${key === this.currentTheme ? 'active' : ''}" data-theme="${key}">
                <div class="theme-name">${theme.name}</div>
                <div class="theme-description">${theme.description}</div>
            </button>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="theme-selector">
                <h3>Window Themes</h3>
                <div class="theme-list">
                    ${themeButtons}
                </div>
            </div>
        `;

        // Add event listeners
        this.shadowRoot.querySelectorAll('.theme-button').forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                this.changeTheme(theme);
            });
        });
    }

    changeTheme(theme) {
        if (theme === this.currentTheme) return;
        
        this.currentTheme = theme;
        
        // Update UI
        this.shadowRoot.querySelectorAll('.theme-button').forEach(button => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });
        
        // Send theme change request to main process
        if (window.ipcRenderer) {
            window.ipcRenderer.send('change-window-theme', {
                windowId: this.windowId,
                theme: theme
            });
        }
        
        // Dispatch event
        this.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme },
            bubbles: true,
            composed: true
        }));
    }

    // Public method to set the current theme
    setTheme(theme) {
        if (this.themes[theme]) {
            this.changeTheme(theme);
        }
    }
}

// Define the custom element
customElements.define('window-theme-selector', WindowThemeSelector);

// Export for use in other modules
export default WindowThemeSelector;