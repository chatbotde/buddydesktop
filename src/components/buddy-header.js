import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { headerStyles } from './ui/header-css.js';

class BuddyHeader extends LitElement {
    static properties = {
        currentView: { type: String },
        sessionActive: { type: Boolean },
        startTime: { type: Number },
        isAudioActive: { type: Boolean },
        isScreenActive: { type: Boolean },
        isControlsMenuOpen: { type: Boolean },
        isMainMenuOpen: { type: Boolean },
        user: { type: Object },
        isAuthenticated: { type: Boolean },
        isGuest: { type: Boolean },
        isContentProtected: { type: Boolean },
        isVisibleOnAllWorkspaces: { type: Boolean },
    };

    constructor() {
        super();
        this.isControlsMenuOpen = false;
        this.isMainMenuOpen = false;
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
        if (this.isControlsMenuOpen) {
            setTimeout(() => {
                document.addEventListener('click', this.boundOutsideClickHandler);
            }, 0);
        } else {
            document.removeEventListener('click', this.boundOutsideClickHandler);
        }
    }

    _closeControlsMenu() {
        if (this.isControlsMenuOpen) {
            this.isControlsMenuOpen = false;
            document.removeEventListener('click', this.boundOutsideClickHandler);
            this.requestUpdate();
        }
    }

    _toggleMainMenu() {
        this.isMainMenuOpen = !this.isMainMenuOpen;
        this.requestUpdate();
        if (this.isMainMenuOpen) {
            setTimeout(() => {
                document.addEventListener('click', this.boundOutsideClickHandler);
            }, 0);
        } else {
            document.removeEventListener('click', this.boundOutsideClickHandler);
        }
    }

    _closeMainMenu() {
        if (this.isMainMenuOpen) {
            this.isMainMenuOpen = false;
            document.removeEventListener('click', this.boundOutsideClickHandler);
            this.requestUpdate();
        }
    }

    _handleOutsideClick(e) {
        const controlsContainer = this.renderRoot.querySelector('.controls-dropdown-container');
        const mainMenuContainer = this.renderRoot.querySelector('.main-menu-dropdown-container');
        
        if (controlsContainer && !controlsContainer.contains(e.target)) {
            this._closeControlsMenu();
        }
        
        if (mainMenuContainer && !mainMenuContainer.contains(e.target)) {
            this._closeMainMenu();
        }
    }

    _handleEndSession() {
        this.dispatchEvent(new CustomEvent('end-session', { bubbles: true, composed: true }));
    }
    _handleStartSession() {
        this.dispatchEvent(new CustomEvent('start-session', { bubbles: true, composed: true }));
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
    
    _handleMenuStartSession() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('start-session', { bubbles: true, composed: true }));
    }
    
    _handleMenuEndSession() {
        this._closeMainMenu();
        this.dispatchEvent(new CustomEvent('end-session', { bubbles: true, composed: true }));
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

    render() {
        const titles = {
            main: 'Buddy',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            assistant: 'Buddy',
            settings: 'AI Settings',
        };
        let elapsedTime = '';
        if (this.currentView === 'assistant' && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            elapsedTime = `${elapsed}s`;
        }
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
                    <!-- Session Timer (only for assistant view) -->
                    ${this.currentView === 'assistant' ? html`
                        <span>${elapsedTime}</span>
                        <span class="status-indicator ${statusIndicator}"></span>
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

                                <!-- Session Controls (only show in assistant view) -->
                                ${this.currentView === 'assistant' ? html`
                                    ${this.sessionActive ? html`
                                        <button class="menu-item" @click=${this._handleMenuEndSession}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <rect x="6" y="4" width="4" height="16"/>
                                                <rect x="14" y="4" width="4" height="16"/>
                                            </svg>
                                            <span class="menu-item-label">End Session</span>
                                        </button>
                                    ` : html`
                                        <button class="menu-item" @click=${this._handleMenuStartSession}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <polygon points="5,3 19,12 5,21"/>
                                            </svg>
                                            <span class="menu-item-label">Start Session</span>
                                        </button>
                                    `}
                                    
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
                                        <span class="menu-item-label">Content Protection</span>
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