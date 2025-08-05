import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { headerStyles } from './ui/header-css.js';
import { tooltipContainer } from './css-componets/tooltip-css.js';
import { getEnabledModels } from '../services/models-service.js';
import { CapabilityAwareMixin, capabilityAwareStyles } from '../mixins/capability-aware-mixin.js';
import { CAPABILITY_TYPES } from '../services/capability-service.js';

class BuddyHeader extends CapabilityAwareMixin(LitElement) {
    static properties = {
        currentView: { type: String },
        sessionActive: { type: Boolean },
        isAudioActive: { type: Boolean },
        isSearchActive: { type: Boolean },
        isScreenActive: { type: Boolean },
        isControlsMenuOpen: { type: Boolean },
        isMainMenuOpen: { type: Boolean },
        user: { type: Object },
        isAuthenticated: { type: Boolean },
        isGuest: { type: Boolean },
        isContentProtected: { type: Boolean },
        isVisibleOnAllWorkspaces: { type: Boolean },
        enabledModels: { type: Array },
        selectedModel: { type: String },
        isModelsDropdownOpen: { type: Boolean },
        windowOpacity: { type: Number },
        isOpacityControlActive: { type: Boolean },
        isThemeControlDropdownOpen: { type: Boolean },
        currentWindowTheme: { type: String },
        availableThemes: { type: Object },
        isAudioWindowOpen: { type: Boolean },
        isSearchWindowOpen: { type: Boolean },

        customMenuButtons: { type: Array },
    };

    constructor() {
        super();
        this.isControlsMenuOpen = false;
        this.isMainMenuOpen = false;
        this.isModelsDropdownOpen = false;
        this.isThemeControlDropdownOpen = false;
        this.currentWindowTheme = 'transparent';
        this.availableThemes = {};

        this.isContentProtected = true;
        this.isVisibleOnAllWorkspaces = true;
        this.windowOpacity = 1.0;
        this.isOpacityControlActive = false;
        this.customMenuButtons = ['chat', 'history', 'models', 'customize', 'help'];
        this.boundOutsideClickHandler = this._handleOutsideClick.bind(this);
        this.isEventListenerActive = false;
        this.eventListenerTimeout = null;
    }

    static styles = [headerStyles, capabilityAwareStyles, tooltipContainer];

    disconnectedCallback() {
        super.disconnectedCallback();
        this._cleanupEventListener();
        if (this.eventListenerTimeout) {
            clearTimeout(this.eventListenerTimeout);
            this.eventListenerTimeout = null;
        }
    }

    _toggleControlsMenu() {
        console.log('Toggling controls menu. Current state:', this.isControlsMenuOpen);

        // Debounce rapid clicks
        if (this._toggleTimeout) {
            return;
        }

        this._toggleTimeout = setTimeout(() => {
            this._toggleTimeout = null;
        }, 100);

        this.isControlsMenuOpen = !this.isControlsMenuOpen;
        console.log('New state:', this.isControlsMenuOpen);
        this.requestUpdate();
        this._manageEventListener();
    }

    _closeControlsMenu() {
        if (this.isControlsMenuOpen) {
            this.isControlsMenuOpen = false;
            this.requestUpdate();
            this._manageEventListener();
        }
    }

    _toggleMainMenu() {
        // Debounce rapid clicks
        if (this._toggleTimeout) {
            return;
        }

        this._toggleTimeout = setTimeout(() => {
            this._toggleTimeout = null;
        }, 100);

        // Close other dropdowns first
        this._closeModelsDropdown();
        this._closeControlsMenu();

        this.isMainMenuOpen = !this.isMainMenuOpen;
        this.requestUpdate();
        this._manageEventListener();
    }

    _closeMainMenu() {
        if (this.isMainMenuOpen) {
            this.isMainMenuOpen = false;
            this.requestUpdate();
            this._manageEventListener();
        }
    }

    _toggleModelsDropdown() {
        // Debounce rapid clicks
        if (this._toggleTimeout) {
            return;
        }

        this._toggleTimeout = setTimeout(() => {
            this._toggleTimeout = null;
        }, 100);

        // Close other dropdowns first
        this._closeMainMenu();
        this._closeControlsMenu();

        this.isModelsDropdownOpen = !this.isModelsDropdownOpen;
        this.requestUpdate();
        this._manageEventListener();
    }

    _closeModelsDropdown() {
        if (this.isModelsDropdownOpen) {
            this.isModelsDropdownOpen = false;
            this.requestUpdate();
            this._manageEventListener();
        }
    }

    _toggleThemeControlDropdown() {
        // Debounce rapid clicks
        if (this._toggleTimeout) {
            return;
        }

        this._toggleTimeout = setTimeout(() => {
            this._toggleTimeout = null;
        }, 100);

        // Close other dropdowns first
        this._closeMainMenu();
        this._closeControlsMenu();
        this._closeModelsDropdown();

        this.isThemeControlDropdownOpen = !this.isThemeControlDropdownOpen;
        this.requestUpdate();
        this._manageEventListener();
    }

    _closeThemeControlDropdown() {
        if (this.isThemeControlDropdownOpen) {
            this.isThemeControlDropdownOpen = false;
            this.requestUpdate();
            this._manageEventListener();
        }
    }

    _cleanupEventListener() {
        if (this.isEventListenerActive) {
            document.removeEventListener('click', this.boundOutsideClickHandler);
            this.isEventListenerActive = false;
        }
        if (this.eventListenerTimeout) {
            clearTimeout(this.eventListenerTimeout);
            this.eventListenerTimeout = null;
        }
        if (this._toggleTimeout) {
            clearTimeout(this._toggleTimeout);
            this._toggleTimeout = null;
        }
    }

    _manageEventListener() {
        const hasOpenDropdown = this.isMainMenuOpen || this.isControlsMenuOpen || this.isModelsDropdownOpen || this.isThemeControlDropdownOpen;

        // Clear any existing timeout
        if (this.eventListenerTimeout) {
            clearTimeout(this.eventListenerTimeout);
            this.eventListenerTimeout = null;
        }

        if (hasOpenDropdown) {
            // Only add listener if not already active
            if (!this.isEventListenerActive) {
                // Use requestAnimationFrame for better timing instead of setTimeout
                this.eventListenerTimeout = requestAnimationFrame(() => {
                    if (!this.isEventListenerActive) {
                        document.addEventListener('click', this.boundOutsideClickHandler, { passive: true });
                        this.isEventListenerActive = true;
                    }
                    this.eventListenerTimeout = null;
                });
            }
        } else {
            // Remove event listener when no dropdowns are open
            this._cleanupEventListener();
        }
    }

    _handleOutsideClick(e) {
        // Early return if no dropdowns are open
        if (!this.isMainMenuOpen && !this.isControlsMenuOpen && !this.isModelsDropdownOpen && !this.isThemeControlDropdownOpen) {
            this._cleanupEventListener();
            return;
        }

        // Prevent handling clicks on the component itself during initial render
        if (!this.renderRoot) {
            return;
        }

        const containers = [
            { element: this.renderRoot.querySelector('.controls-dropdown-container'), handler: () => this._closeControlsMenu() },
            { element: this.renderRoot.querySelector('.main-menu-dropdown-container'), handler: () => this._closeMainMenu() },
            { element: this.renderRoot.querySelector('.models-dropdown-container'), handler: () => this._closeModelsDropdown() },
            { element: this.renderRoot.querySelector('.theme-control-dropdown-container'), handler: () => this._closeThemeControlDropdown() },
        ];

        let clickedInside = false;

        for (const container of containers) {
            if (container.element && container.element.contains(e.target)) {
                clickedInside = true;
                break;
            }
        }

        // If click was outside all containers, close all dropdowns
        if (!clickedInside) {
            this._closeAllDropdowns();
        }
    }

    _closeAllDropdowns() {
        const hadOpenDropdown = this.isMainMenuOpen || this.isControlsMenuOpen || this.isModelsDropdownOpen || this.isThemeControlDropdownOpen;

        this.isControlsMenuOpen = false;
        this.isMainMenuOpen = false;
        this.isModelsDropdownOpen = false;
        this.isThemeControlDropdownOpen = false;

        if (hadOpenDropdown) {
            this.requestUpdate();
            this._manageEventListener();
        }
    }

    _handleNewChat() {
        this.dispatchEvent(new CustomEvent('new-chat', { bubbles: true, composed: true }));
    }
    _handleToggleAudio() {
        this._closeControlsMenu();
        
        if (!this.isFeatureEnabled('audio-capture')) {
            this.handleDisabledFeatureClick('audio-capture', CAPABILITY_TYPES.AUDIO);
            return;
        }
        
        this.dispatchEvent(new CustomEvent('toggle-audio', { bubbles: true, composed: true }));
    }
    _handleToggleScreen() {
        this._closeControlsMenu();
        
        if (!this.isFeatureEnabled('screen-capture')) {
            this.handleDisabledFeatureClick('screen-capture', CAPABILITY_TYPES.VIDEO);
            return;
        }
        
        this.dispatchEvent(new CustomEvent('toggle-screen', { bubbles: true, composed: true }));
    }
    _handleClose() {
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }

    _handleBack() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'assistant' }, bubbles: true, composed: true }));
    }
    _handleNav(e) {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: e }, bubbles: true, composed: true }));
    }

    _handleMenuToggleAudio() {
        this._closeMainMenu();
        
        if (!this.isFeatureEnabled('audio-capture')) {
            this.handleDisabledFeatureClick('audio-capture', CAPABILITY_TYPES.AUDIO);
            return;
        }
        
        this.dispatchEvent(new CustomEvent('toggle-audio', { bubbles: true, composed: true }));
    }

    _handleMenuToggleScreen() {
        this._closeMainMenu();
        
        if (!this.isFeatureEnabled('screen-capture')) {
            this.handleDisabledFeatureClick('screen-capture', CAPABILITY_TYPES.VIDEO);
            return;
        }
        
        this.dispatchEvent(new CustomEvent('toggle-screen', { bubbles: true, composed: true }));
    }

    _handleOpenAudioWindow() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('open-audio-window', { bubbles: true, composed: true }));
    }

    _handleToggleSearch() {
        this._closeControlsMenu();
        this.dispatchEvent(new CustomEvent('toggle-search', { bubbles: true, composed: true }));
    }

    _handleMenuToggleSearch() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('toggle-search', { bubbles: true, composed: true }));
    }

    _handleOpenSearchWindow() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('open-search-window', { bubbles: true, composed: true }));
    }

    _handleMenuNewChat() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('new-chat', { bubbles: true, composed: true }));
    }

    _handleToggleContentProtection() {
        this._closeMainMenu();
        this.isContentProtected = !this.isContentProtected;
        this.dispatchEvent(
            new CustomEvent('toggle-content-protection', {
                detail: { enabled: this.isContentProtected },
                bubbles: true,
                composed: true,
            })
        );
    }

    _handleToggleVisibilityOnWorkspaces() {
        this._closeMainMenu();
        this.isVisibleOnAllWorkspaces = !this.isVisibleOnAllWorkspaces;
        this.dispatchEvent(
            new CustomEvent('toggle-workspace-visibility', {
                detail: { enabled: this.isVisibleOnAllWorkspaces },
                bubbles: true,
                composed: true,
            })
        );
    }

    _handleModelSelect(modelId) {
        this._closeModelsDropdown();
        this.dispatchEvent(
            new CustomEvent('model-select', {
                detail: { model: modelId },
                bubbles: true,
                composed: true,
            })
        );
    }

    _handleOpenMarketplace() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('open-marketplace-window', { bubbles: true, composed: true }));
    }

    _handleToggleOpacityControl() {
        this._closeMainMenu();
        this.isOpacityControlActive = !this.isOpacityControlActive;
        this.dispatchEvent(
            new CustomEvent('toggle-opacity-control', {
                detail: { active: this.isOpacityControlActive },
                bubbles: true,
                composed: true,
            })
        );
    }

    _handleOpacityChange(opacity) {
        this.windowOpacity = opacity;
        this.dispatchEvent(
            new CustomEvent('opacity-change', {
                detail: { opacity },
                bubbles: true,
                composed: true,
            })
        );
    }

    _handleOpacitySliderChange(e) {
        const opacity = parseFloat(e.target.value);
        this._handleOpacityChange(opacity);
    }

    _handleOpacityPreset(opacity) {
        this._closeThemeControlDropdown();
        this._handleOpacityChange(opacity);
    }

    _handleOpacityInputChange(e) {
        const value = parseInt(e.target.value);
        if (value >= 10 && value <= 100) {
            const opacity = value / 100;
            this._handleOpacityChange(opacity);
        }
    }

    _handleThemeSelect(theme) {
        this._closeThemeControlDropdown();
        this.currentWindowTheme = theme;
        this.dispatchEvent(
            new CustomEvent('window-theme-change', {
                detail: { theme },
                bubbles: true,
                composed: true,
            })
        );
    }

    _handleTitleClick() {
        // Navigate to chat section when title is clicked
        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: { view: 'assistant' },
                bubbles: true,
                composed: true,
            })
        );
    }

    _getEnabledModelsData() {
        if (!this.enabledModels || this.enabledModels.length === 0) {
            return [];
        }

        // Get enabled models from the models service
        return getEnabledModels(this.enabledModels);
    }

    _getMenuButtonsData() {
        const allButtons = {
            chat: {
                id: 'assistant',
                name: 'Chat',
                icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
            },
            history: {
                id: 'history',
                name: 'History',
                icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12,6 12,12 16,14',
            },
            models: {
                id: 'models',
                name: 'Models',
                icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
            },
            customize: {
                id: 'customize',
                name: 'Customize',
                icon: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
            },
            help: {
                id: 'help',
                name: 'Help',
                icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01',
            },
            'audio-window': {
                id: 'audio-window',
                name: 'Audio Window',
                icon: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z',
                handler: '_handleOpenAudioWindow',
                showStatus: true,
                statusKey: 'isAudioWindowOpen',
            },
            'search-window': {
                id: 'search-window',
                name: 'Search Window',
                icon: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
                handler: '_handleOpenSearchWindow',
                showStatus: true,
                statusKey: 'isSearchWindowOpen',
            },
            'new-chat': {
                id: 'new-chat',
                name: 'New Chat',
                icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M12 7v6m-3-3h6',
                handler: '_handleMenuNewChat',
            },
            'toggle-audio': {
                id: 'toggle-audio',
                name: 'Audio',
                icon: 'M2 10v3 M6 6v11 M10 3v18 M14 8v7 M18 5v13 M22 10v3',
                handler: '_handleMenuToggleAudio',
                showStatus: true,
                statusKey: 'isAudioActive',
            },
            'toggle-search': {
                id: 'toggle-search',
                name: 'Search',
                icon: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
                handler: '_handleMenuToggleSearch',
                showStatus: true,
                statusKey: 'isSearchActive',
            },
            'toggle-video': {
                id: 'toggle-video',
                name: 'Video',
                icon: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5 M2 6h14v12H2z',
                handler: '_handleMenuToggleScreen',
                showStatus: true,
                statusKey: 'isScreenActive',
            },
            'opacity-control': {
                id: 'opacity-control',
                name: 'Opacity Control',
                icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
                handler: '_handleToggleOpacityControl',
                showStatus: true,
                statusKey: 'isOpacityControlActive',
            },
            'content-protection': {
                id: 'content-protection',
                name: 'Content Protection',
                icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                handler: '_handleToggleContentProtection',
                showStatus: true,
                statusKey: 'isContentProtected',
            },
            'workspace-visibility': {
                id: 'workspace-visibility',
                name: 'All Workspaces',
                icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
                handler: '_handleToggleVisibilityOnWorkspaces',
                showStatus: true,
                statusKey: 'isVisibleOnAllWorkspaces',
            },
        };

        return this.customMenuButtons.map(buttonId => allButtons[buttonId]).filter(Boolean);
    }

    render() {
        const titles = {
            customize: 'Customize',
            help: 'Help & Shortcuts',
            assistant: 'Buddy',
            settings: 'AI Settings',
            models: 'Models',
        };
        const statusIndicator = this.sessionActive ? 'status-live' : 'status-idle';

        // Show minimal header with only close button on login page
        if (this.currentView === 'login') {
            return html`
                <div class="header">
                    <div class="header-title">
                        <!-- Empty title area for login page -->
                    </div>
                    <div class="header-actions">
                        <!-- Only show close button on login page -->
                        <div class="tooltip-container">
                            <button class="close-btn" @click=${this._handleClose}>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <span class="tooltip">Close Application</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Normal header for all other views
        return html`
            <div class="header">
                <div class="header-title">
                    <span class="header-title-text clickable-title" @click=${this._handleTitleClick} title=" "
                        >${titles[this.currentView]}</span
                    >
                    ${this.isAuthenticated && this.user && this.currentView !== 'login'
                        ? html`
                              <div class="user-info">
                                  <img
                                      src="${this.user.picture || '/assets/default-avatar.png'}"
                                      alt="${this.user.name}"
                                      class="user-avatar"
                                      title="${this.user.name} (${this.user.email})"
                                  />
                              </div>
                          `
                        : ''}
                    ${this.isGuest && this.currentView !== 'login' ? html` <span class="guest-indicator" title="Guest Mode">👤</span> ` : ''}
                </div>
                <div class="header-actions">
                    <!-- Session Status (only for assistant view) -->
                    ${this.currentView === 'assistant' ? html` <span class="status-indicator ${statusIndicator}"></span> ` : ''}

                    <!-- Combined Theme & Opacity Control Dropdown -->
                    <div class="theme-control-dropdown-container">
                        <div class="tooltip-container">
                            <button class="theme-control-btn" @click=${this._toggleThemeControlDropdown}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                            <span class="opacity-percentage">${Math.round(this.windowOpacity * 100)}%</span>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                        </button>
                        <span class="tooltip">Theme & Opacity Settings</span>
                    </div>

                        ${this.isThemeControlDropdownOpen
                            ? html`
                                  <div class="theme-control-dropdown">
                                      <!-- Theme Section -->
                                      <div class="theme-control-section">
                                          <label class="theme-control-label">Window Theme</label>

                                          ${Object.entries(this.availableThemes).map(
                                              ([themeKey, theme]) => html`
                                                  <button
                                                      class="theme-option ${this.currentWindowTheme === themeKey ? 'selected' : ''}"
                                                      @click=${() => this._handleThemeSelect(themeKey)}
                                                      title="${theme.description}"
                                                  >
                                                      <div class="theme-preview theme-${themeKey}"></div>
                                                      <div class="theme-info">
                                                          <span class="theme-name">${theme.name}</span>
                                                          <span class="theme-desc">${theme.description}</span>
                                                      </div>
                                                      ${this.currentWindowTheme === themeKey
                                                          ? html`
                                                                <svg
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    stroke-width="2"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                >
                                                                    <polyline points="20,6 9,17 4,12"></polyline>
                                                                </svg>
                                                            `
                                                          : ''}
                                                  </button>
                                              `
                                          )}
                                      </div>

                                      <div class="theme-control-divider"></div>

                                      <!-- Opacity Section -->
                                      <div class="theme-control-section">
                                          <label class="theme-control-label">Window Opacity</label>

                                          <!-- Opacity Slider -->
                                          <div class="opacity-slider-container">
                                              <input
                                                  type="range"
                                                  class="opacity-slider"
                                                  min="0.1"
                                                  max="1.0"
                                                  step="0.05"
                                                  .value=${this.windowOpacity}
                                                  @input=${this._handleOpacitySliderChange}
                                              />
                                              <div class="opacity-slider-labels">
                                                  <span>10%</span>
                                                  <span>100%</span>
                                              </div>
                                          </div>

                                          <!-- Opacity Input -->
                                          <div class="opacity-input-container">
                                              <input
                                                  type="number"
                                                  class="opacity-input"
                                                  min="10"
                                                  max="100"
                                                  .value=${Math.round(this.windowOpacity * 100)}
                                                  @input=${this._handleOpacityInputChange}
                                              />
                                              <span class="opacity-input-suffix">%</span>
                                          </div>
                                      </div>

                                      <div class="theme-control-divider"></div>

                                      <!-- Opacity Presets -->
                                      <div class="theme-control-section">
                                          <label class="theme-control-label">Quick Presets</label>
                                          <div class="opacity-preset-buttons">
                                              <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(1.0)}>
                                                  100% <span class="preset-desc">Solid</span>
                                              </button>
                                              <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.9)}>
                                                  90% <span class="preset-desc">Slight</span>
                                              </button>
                                              <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.75)}>
                                                  75% <span class="preset-desc">Medium</span>
                                              </button>
                                              <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.5)}>
                                                  50% <span class="preset-desc">Half</span>
                                              </button>
                                              <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.25)}>
                                                  25% <span class="preset-desc">Light</span>
                                              </button>
                                          </div>
                                      </div>

                                      <div class="theme-control-divider"></div>

                                      <!-- Scroll Control Toggle -->
                                      <div class="scroll-control">
                                          <button
                                              class="scroll-control-toggle ${this.isOpacityControlActive ? 'active' : ''}"
                                              @click=${this._handleToggleOpacityControl}
                                          >
                                              <svg
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                              >
                                                  <circle cx="12" cy="12" r="3" />
                                                  <path d="M12 1v6m0 6v6" />
                                              </svg>
                                              <span>Scroll Control</span>
                                              <span class="toggle-status">${this.isOpacityControlActive ? 'ON' : 'OFF'}</span>
                                          </button>
                                      </div>
                                  </div>
                              `
                            : ''}
                    </div>

                    <!-- Models Dropdown -->
                    ${this.enabledModels && this.enabledModels.length > 0
                        ? html`
                              <div class="models-dropdown-container">
                                  <div class="tooltip-container">
                                      <button class="models-dropdown-btn" @click=${this._toggleModelsDropdown}>
                                      <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      >
                                          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                                      </svg>
                                      <span class="models-dropdown-text">
                                          ${this.selectedModel
                                              ? this._getEnabledModelsData().find(m => m.id === this.selectedModel)?.name || this.selectedModel
                                              : 'Select Model'}
                                      </span>
                                      <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      >
                                          <polyline points="6,9 12,15 18,9"></polyline>
                                      </svg>
                                  </button>
                                  <span class="tooltip">Select Model</span>
                              </div>

                                  ${this.isModelsDropdownOpen
                                      ? html`
                                            <div class="models-dropdown">
                                                <div class="models-dropdown-content">
                                                    ${this._getEnabledModelsData().map(
                                                        model => html`
                                                            <button
                                                                class="model-dropdown-item ${this.selectedModel === model.id
                                                                    ? 'selected'
                                                                    : ''} ${model.custom ? 'custom' : ''}"
                                                                @click=${() => this._handleModelSelect(model.id)}
                                                            >
                                                                ${model.icon ? html`<span class="model-icon">${model.icon}</span>` : ''}
                                                                <div class="model-info">
                                                                    <span class="model-name">
                                                                        ${model.name}
                                                                        ${model.custom ? html`<span class="custom-indicator">CUSTOM</span>` : ''}
                                                                    </span>
                                                                    ${model.badge ? html`<span class="model-badge">${model.badge}</span>` : ''}
                                                                </div>
                                                                ${this.selectedModel === model.id
                                                                    ? html`
                                                                          <svg
                                                                              width="16"
                                                                              height="16"
                                                                              viewBox="0 0 24 24"
                                                                              fill="none"
                                                                              stroke="currentColor"
                                                                              stroke-width="2"
                                                                              stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                          >
                                                                              <polyline points="20,6 9,17 4,12"></polyline>
                                                                          </svg>
                                                                      `
                                                                    : ''}
                                                            </button>
                                                        `
                                                    )}
                                                </div>
                                            </div>
                                        `
                                      : ''}
                              </div>
                          `
                        : ''}

                    <!-- Main Menu Dropdown -->
                    <div class="main-menu-dropdown-container">
                        <div class="tooltip-container">
                            <button class="main-menu-btn" @click=${this._toggleMainMenu}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                        </button>
                        <span class="tooltip">Menu</span>
                    </div>

                        ${this.isMainMenuOpen
                            ? html`
                                  <div class="main-menu-dropdown">
                                      <div class="main-menu-dropdown-content">
                                          <!-- Dynamic Navigation Items -->
                                          ${this._getMenuButtonsData().map(
                                              button => html`
                                                  <button
                                                      class="menu-item ${button.showStatus ? (this[button.statusKey] ? 'active' : 'inactive') : ''}"
                                                      @click=${button.handler ? () => this[button.handler]() : () => this._handleNav(button.id)}
                                                  >
                                                      <svg
                                                          width="18"
                                                          height="18"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          stroke-width="2"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                      >
                                                          <path d="${button.icon}" />
                                                      </svg>
                                                      <span class="menu-item-label">${button.name}</span>
                                                      ${button.showStatus
                                                          ? html` <span class="menu-item-status">${this[button.statusKey] ? 'ON' : 'OFF'}</span> `
                                                          : ''}
                                                  </button>
                                              `
                                          )}

                                          <div class="menu-divider"></div>

                                          <!-- Marketplace -->
                                          <button class="menu-item" @click=${this._handleOpenMarketplace}>
                                              <svg
                                                  width="18"
                                                  height="18"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                              >
                                                  <path
                                                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                                  />
                                              </svg>
                                              <span class="menu-item-label">Marketplace</span>
                                          </button>

                                          <!-- Chat Controls (only show in assistant view) -->
                                          ${this.currentView === 'assistant'
                                              ? html`
                                                    <div class="menu-divider"></div>

                                                    <button class="menu-item" @click=${this._handleMenuNewChat}>
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        >
                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                            <path d="M12 7v6m-3-3h6" />
                                                        </svg>
                                                        <span class="menu-item-label">New Chat</span>
                                                    </button>
                                                `
                                              : ''}

                                          <div class="menu-divider"></div>

                                          <!-- Close App (only for chat interface) or Back (for other views) -->
                                          ${this.currentView === 'assistant'
                                              ? html`
                                                    <button class="menu-item" @click=${this._handleClose}>
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        >
                                                            <line x1="18" y1="6" x2="6" y2="18" />
                                                            <line x1="6" y1="6" x2="18" y2="18" />
                                                        </svg>
                                                        <span class="menu-item-label">Close App</span>
                                                    </button>
                                                `
                                              : html`
                                                    <button class="menu-item" @click=${this._handleBack}>
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        >
                                                            <path d="m12 19-7-7 7-7" />
                                                            <path d="M19 12H5" />
                                                        </svg>
                                                        <span class="menu-item-label">Back</span>
                                                    </button>
                                                `}
                                      </div>
                                  </div>
                              `
                            : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-header', BuddyHeader);
