import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { headerStyles } from './ui/header-css.js';
import { getEnabledModels } from '../services/models-service.js';

class BuddyHeader extends LitElement {
    static properties = {
        currentView: { type: String },
        sessionActive: { type: Boolean },
        isAudioActive: { type: Boolean },
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
    };

    constructor() {
        super();
        this.isControlsMenuOpen = false;
        this.isMainMenuOpen = false;
        this.isModelsDropdownOpen = false;
        this.isContentProtected = true;
        this.isVisibleOnAllWorkspaces = true;
        this.boundOutsideClickHandler = this._handleOutsideClick.bind(this);
    }

    static styles = [headerStyles];

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.boundOutsideClickHandler);
    }

    _toggleControlsMenu() {
        console.log('Toggling controls menu. Current state:', this.isControlsMenuOpen);
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

    _manageEventListener() {
        const hasOpenDropdown = this.isMainMenuOpen || this.isControlsMenuOpen || this.isModelsDropdownOpen;
        
        if (hasOpenDropdown) {
            // Add event listener with a small delay to prevent immediate closure
            setTimeout(() => {
                document.addEventListener('click', this.boundOutsideClickHandler);
            }, 10);
        } else {
            // Remove event listener when no dropdowns are open
            document.removeEventListener('click', this.boundOutsideClickHandler);
        }
    }

    _handleOutsideClick(e) {
        const controlsContainer = this.renderRoot.querySelector('.controls-dropdown-container');
        const mainMenuContainer = this.renderRoot.querySelector('.main-menu-dropdown-container');
        const modelsDropdownContainer = this.renderRoot.querySelector('.models-dropdown-container');
        
        if (controlsContainer && !controlsContainer.contains(e.target)) {
            this._closeControlsMenu();
        }
        
        if (mainMenuContainer && !mainMenuContainer.contains(e.target)) {
            this._closeMainMenu();
        }
        
        if (modelsDropdownContainer && !modelsDropdownContainer.contains(e.target)) {
            this._closeModelsDropdown();
        }
    }

    _handleNewChat() {
        this.dispatchEvent(new CustomEvent('new-chat', { bubbles: true, composed: true }));
    }
    _handleToggleAudio() {
        this._closeControlsMenu();
        this.dispatchEvent(new CustomEvent('toggle-audio', { bubbles: true, composed: true }));
    }
    _handleToggleScreen() {
        this._closeControlsMenu();
        this.dispatchEvent(new CustomEvent('toggle-screen', { bubbles: true, composed: true }));
    }
    _handleClose() {
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
    _handleNav(e) {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: e }, bubbles: true, composed: true }));
    }
    
    _handleMenuToggleAudio() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('toggle-audio', { bubbles: true, composed: true }));
    }
    
    _handleMenuToggleScreen() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('toggle-screen', { bubbles: true, composed: true }));
    }
    
    _handleMenuNewChat() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('new-chat', { bubbles: true, composed: true }));
    }
    
    _handleToggleContentProtection() {
        this._closeMainMenu();
        this.isContentProtected = !this.isContentProtected;
        this.dispatchEvent(new CustomEvent('toggle-content-protection', { 
            detail: { enabled: this.isContentProtected }, 
            bubbles: true, 
            composed: true 
        }));
    }
    
    _handleToggleVisibilityOnWorkspaces() {
        this._closeMainMenu();
        this.isVisibleOnAllWorkspaces = !this.isVisibleOnAllWorkspaces;
        this.dispatchEvent(new CustomEvent('toggle-workspace-visibility', { 
            detail: { enabled: this.isVisibleOnAllWorkspaces }, 
            bubbles: true, 
            composed: true 
        }));
    }

    _handleModelSelect(modelId) {
        this._closeModelsDropdown();
        this.dispatchEvent(new CustomEvent('model-select', { 
            detail: { model: modelId }, 
            bubbles: true, 
            composed: true 
        }));
    }



    _getEnabledModelsData() {
        if (!this.enabledModels || this.enabledModels.length === 0) {
            return [];
        }
        
        // Get enabled models from the models service
        return getEnabledModels(this.enabledModels);
    }

    render() {
        const titles = {
            main: 'Buddy',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            assistant: 'Buddy',
            settings: 'AI Settings',
            models: 'Models',
        };
        const statusIndicator = this.sessionActive ? 'status-live' : 'status-idle';
        return html`
            <div class="header">
                <div class="header-title">
                    <span class="header-title-text">${titles[this.currentView]}</span>
                    ${this.isAuthenticated && this.user && this.currentView !== 'login' ? html`
                        <div class="user-info">
                            <img 
                                src="${this.user.picture || '/assets/default-avatar.png'}" 
                                alt="${this.user.name}"
                                class="user-avatar"
                                title="${this.user.name} (${this.user.email})"
                            >
                        </div>
                    ` : ''}
                    ${this.isGuest && this.currentView !== 'login' ? html`
                        <span class="guest-indicator" title="Guest Mode">👤</span>
                    ` : ''}
                </div>
                <div class="header-actions">
                    <!-- Session Status (only for assistant view) -->
                    ${this.currentView === 'assistant' ? html`
                        <span class="status-indicator ${statusIndicator}"></span>
                    ` : ''}
                    
                    <!-- Models Dropdown -->
                    ${this.enabledModels && this.enabledModels.length > 0 ? html`
                        <div class="models-dropdown-container">
                            <button 
                                class="models-dropdown-btn"
                                @click=${this._toggleModelsDropdown}
                                title="Select Model"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <path d="M21 15l-5-5L5 21"/>
                                </svg>
                                <span class="models-dropdown-text">
                                    ${this.selectedModel ? this._getEnabledModelsData().find(m => m.id === this.selectedModel)?.name || this.selectedModel : 'Select Model'}
                                </span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                            </button>

                            ${this.isModelsDropdownOpen ? html`
                                <div class="models-dropdown">
                                    ${this._getEnabledModelsData().map(model => html`
                                        <button 
                                            class="model-dropdown-item ${this.selectedModel === model.id ? 'selected' : ''} ${model.custom ? 'custom' : ''}"
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
                                            ${this.selectedModel === model.id ? html`
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="20,6 9,17 4,12"></polyline>
                                                </svg>
                                            ` : ''}
                                        </button>
                                    `)}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    <!-- Main Menu Dropdown -->
                    <div class="main-menu-dropdown-container">
                        <button 
                            class="main-menu-btn"
                            @click=${this._toggleMainMenu}
                            title="Menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"/>
                                <circle cx="19" cy="12" r="1"/>
                                <circle cx="5" cy="12" r="1"/>
                            </svg>
                        </button>

                        ${this.isMainMenuOpen ? html`
                            <div class="main-menu-dropdown">
                                <!-- Navigation Items -->
                                <button class="menu-item" @click=${() => this._handleNav('main')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                        <polyline points="9,22 9,12 15,12 15,22"/>
                                    </svg>
                                    <span class="menu-item-label">Home</span>
                                </button>
                                
                                <button class="menu-item" @click=${() => this._handleNav('assistant')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                    <span class="menu-item-label">Chat</span>
                                </button>
                                
                                <button class="menu-item" @click=${() => this._handleNav('history')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12,6 12,12 16,14"/>
                                    </svg>
                                    <span class="menu-item-label">History</span>
                                </button>
                                
                                <button class="menu-item" @click=${() => this._handleNav('models')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <path d="M21 15l-5-5L5 21"/>
                                    </svg>
                                    <span class="menu-item-label">Models</span>
                                </button>
                                
                                <button class="menu-item" @click=${() => this._handleNav('customize')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="3"/>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                    </svg>
                                    <span class="menu-item-label">Customize</span>
                                </button>
                                
                                <button class="menu-item" @click=${() => this._handleNav('help')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                    <span class="menu-item-label">Help</span>
                                </button>

                                <div class="menu-divider"></div>

                                <!-- Chat Controls (only show in assistant view) -->
                                ${this.currentView === 'assistant' ? html`
                                    <button class="menu-item" @click=${this._handleMenuNewChat}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                            <path d="M12 7v6m-3-3h6"/>
                                        </svg>
                                        <span class="menu-item-label">New Chat</span>
                                    </button>
                                    
                                    <button class="menu-item ${this.isAudioActive ? 'active' : 'inactive'}" @click=${this._handleMenuToggleAudio}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M2 10v3"/>
                                            <path d="M6 6v11"/>
                                            <path d="M10 3v18"/>
                                            <path d="M14 8v7"/>
                                            <path d="M18 5v13"/>
                                            <path d="M22 10v3"/>
                                        </svg>
                                        <span class="menu-item-label">Audio</span>
                                        <span class="menu-item-status">${this.isAudioActive ? 'ON' : 'OFF'}</span>
                                    </button>
                                    
                                    <button class="menu-item ${this.isScreenActive ? 'active' : 'inactive'}" @click=${this._handleMenuToggleScreen}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                                            <rect x="2" y="6" width="14" height="12" rx="2"/>
                                        </svg>
                                        <span class="menu-item-label">Video</span>
                                        <span class="menu-item-status">${this.isScreenActive ? 'ON' : 'OFF'}</span>
                                    </button>
                                    
                                    <div class="menu-divider"></div>
                                    
                                    <!-- Visibility Controls -->
                                    <button class="menu-item ${this.isContentProtected ? 'active' : 'inactive'}" @click=${this._handleToggleContentProtection}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                        <span class="menu-item-label">visible/invisible</span>
                                        <span class="menu-item-status">${this.isContentProtected ? 'ON' : 'OFF'}</span>
                                    </button>
                                    
                                    <button class="menu-item ${this.isVisibleOnAllWorkspaces ? 'active' : 'inactive'}" @click=${this._handleToggleVisibilityOnWorkspaces}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        <span class="menu-item-label">Visible on All Workspaces</span>
                                        <span class="menu-item-status">${this.isVisibleOnAllWorkspaces ? 'ON' : 'OFF'}</span>
                                    </button>
                                    
                                    <div class="menu-divider"></div>
                                ` : ''}

                                <!-- Close App -->
                                <button class="menu-item" @click=${this._handleClose}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                    <span class="menu-item-label">Close App</span>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-header', BuddyHeader);