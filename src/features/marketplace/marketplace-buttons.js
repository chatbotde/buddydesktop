import './marketplace-window.js';

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

                                <!-- Audio Window - Commented Out -->
                                <!-- <button class="menu-item" @click=${this._handleOpenAudioWindow}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                                    </svg>
                                    <span class="menu-item-label">Audio Window</span>
                                </button> -->

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
                                    
                                    <!-- Audio Toggle - Commented Out -->
                                    <!-- <button class="menu-item ${this.isAudioActive ? 'active' : 'inactive'}" @click=${this._handleMenuToggleAudio}>
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
                                    </button> -->
                                    
                                    <!-- Video Toggle - Commented Out -->
                                    <!-- <button class="menu-item ${this.isScreenActive ? 'active' : 'inactive'}" @click=${this._handleMenuToggleScreen}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                                            <rect x="2" y="6" width="14" height="12" rx="2"/>
                                        </svg>
                                        <span class="menu-item-label">Video</span>
                                        <span class="menu-item-status">${this.isScreenActive ? 'ON' : 'OFF'}</span>
                                    </button> -->
                                    
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
                    
                            