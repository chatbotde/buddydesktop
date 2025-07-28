import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { allBaseStyles } from './ui/base/index.js';
import { DropdownMixin, ResponsiveMixin } from './ui/mixins/component-mixins.js';
import { onClickOutside, debounce } from './ui/utils/ui-utils.js';
import { getEnabledModels } from '../services/models-service.js';

/**
 * Optimized Buddy Header Component
 * Uses the new modular UI system with reusable styles and mixins
 */
class OptimizedBuddyHeader extends ResponsiveMixin(DropdownMixin(LitElement)) {
    static properties = {
        currentView: { type: String },
        sessionActive: { type: Boolean },
        isAudioActive: { type: Boolean },
        isSearchActive: { type: Boolean },
        isScreenActive: { type: Boolean },
        user: { type: Object },
        isAuthenticated: { type: Boolean },
        isGuest: { type: Boolean },
        isContentProtected: { type: Boolean },
        isVisibleOnAllWorkspaces: { type: Boolean },
        enabledModels: { type: Array },
        selectedModel: { type: String },
        windowOpacity: { type: Number },
        currentWindowTheme: { type: String },
        availableThemes: { type: Object },
        customMenuButtons: { type: Array },
        
        // Dropdown states
        isControlsMenuOpen: { type: Boolean },
        isMainMenuOpen: { type: Boolean },
        isModelsDropdownOpen: { type: Boolean },
        isOpacityDropdownOpen: { type: Boolean },
        isThemeDropdownOpen: { type: Boolean }
    };

    static styles = [
        ...allBaseStyles,
        css`
            :host {
                display: block;
                width: 100%;
            }

            .buddy-header {
                @apply header;
                -webkit-app-region: drag;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-md);
            }

            .header-title {
                flex: 1;
                font-size: var(--text-lg);
                font-weight: var(--font-semibold);
                -webkit-app-region: drag;
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                min-width: 0;
            }

            .header-title-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--text-primary);
            }

            .header-actions {
                display: flex;
                gap: var(--space-sm);
                align-items: center;
                -webkit-app-region: no-drag;
                flex-shrink: 0;
            }

            .status-container {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
            }

            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: var(--radius-full);
                margin-right: var(--space-xs);
            }

            .status-live {
                background-color: var(--success-color);
                box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
            }

            .status-idle {
                background-color: var(--warning-color);
                box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
            }

            .model-select {
                @apply btn;
                @apply btn-secondary;
                @apply btn-sm;
                min-width: 120px;
                max-width: 180px;
                text-align: left;
                justify-content: space-between;
                position: relative;
            }

            .model-select-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }

            .model-select-arrow {
                width: 12px;
                height: 12px;
                margin-left: var(--space-xs);
                transition: transform var(--transition-fast);
            }

            .model-select[aria-expanded="true"] .model-select-arrow {
                transform: rotate(180deg);
            }

            .controls-btn {
                @apply btn-icon;
                @apply btn-secondary;
                position: relative;
                font-size: var(--text-lg);
            }

            .controls-btn.active {
                @apply btn-success;
            }

            .controls-btn.inactive {
                @apply btn-danger;
            }

            .opacity-control {
                @apply btn;
                @apply btn-secondary;
                @apply btn-sm;
                min-width: 80px;
                justify-content: center;
                gap: var(--space-xs);
            }

            .opacity-value {
                font-size: var(--text-xs);
                font-weight: var(--font-semibold);
                min-width: 28px;
                text-align: center;
            }

            .theme-btn {
                @apply btn-icon;
                @apply btn-secondary;
                font-size: var(--text-lg);
            }

            .session-button {
                @apply btn;
                @apply btn-sm;
            }

            .session-button.start {
                @apply btn-success;
            }

            .session-button.end {
                @apply btn-danger;
            }

            /* Dropdown Content Styles */
            .models-dropdown {
                @apply dropdown-content;
                min-width: 280px;
                max-height: 400px;
            }

            .model-option {
                @apply dropdown-item;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-sm) var(--space-md);
            }

            .model-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                flex: 1;
                min-width: 0;
            }

            .model-name {
                font-weight: var(--font-medium);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .model-badge {
                font-size: var(--text-xs);
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .controls-dropdown {
                @apply dropdown-content;
                min-width: 220px;
            }

            .control-section {
                padding: var(--space-md);
            }

            .control-section:not(:last-child) {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .control-section-title {
                font-size: var(--text-xs);
                font-weight: var(--font-semibold);
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: var(--space-sm);
            }

            .control-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-xs) 0;
            }

            .control-toggle {
                @apply btn;
                @apply btn-xs;
                @apply btn-secondary;
                min-width: 60px;
            }

            .control-toggle.active {
                @apply btn-success;
            }

            .opacity-dropdown {
                @apply dropdown-content;
                min-width: 200px;
                padding: var(--space-md);
            }

            .opacity-slider-container {
                margin: var(--space-sm) 0;
            }

            .opacity-slider {
                width: 100%;
                margin: var(--space-sm) 0;
            }

            .opacity-presets {
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
                margin-top: var(--space-md);
            }

            .opacity-preset-btn {
                @apply btn;
                @apply btn-xs;
                @apply btn-secondary;
                justify-content: space-between;
            }

            .theme-dropdown {
                @apply dropdown-content;
                min-width: 200px;
            }

            .theme-option {
                @apply dropdown-item;
                justify-content: space-between;
            }

            .theme-preview {
                width: 20px;
                height: 20px;
                border-radius: var(--radius-sm);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .header-title {
                    font-size: var(--text-base);
                }

                .header-actions {
                    gap: var(--space-xs);
                }

                .model-select {
                    min-width: 100px;
                    max-width: 140px;
                    font-size: var(--text-sm);
                }

                .controls-btn,
                .theme-btn {
                    width: 36px;
                    height: 36px;
                }

                .session-button {
                    padding: var(--space-xs) var(--space-sm);
                    font-size: var(--text-sm);
                }
            }

            @media (max-width: 480px) {
                .buddy-header {
                    padding: var(--space-xs) var(--space-sm);
                }

                .header-title {
                    font-size: var(--text-sm);
                }

                .model-select {
                    min-width: 80px;
                    max-width: 120px;
                    font-size: var(--text-xs);
                }

                .controls-btn,
                .theme-btn {
                    width: 32px;
                    height: 32px;
                    font-size: var(--text-base);
                }

                .opacity-control {
                    min-width: 60px;
                    font-size: var(--text-xs);
                }
            }
        `
    ];

    constructor() {
        super();
        // Initialize properties
        this.currentView = 'chat';
        this.sessionActive = false;
        this.isAudioActive = false;
        this.isSearchActive = false;
        this.isScreenActive = false;
        this.user = null;
        this.isAuthenticated = false;
        this.isGuest = false;
        this.isContentProtected = true;
        this.isVisibleOnAllWorkspaces = true;
        this.enabledModels = [];
        this.selectedModel = '';
        this.windowOpacity = 1.0;
        this.currentWindowTheme = 'transparent';
        this.availableThemes = {};
        this.customMenuButtons = ['chat', 'history', 'models', 'customize', 'help'];

        // Dropdown states
        this.isControlsMenuOpen = false;
        this.isMainMenuOpen = false;
        this.isModelsDropdownOpen = false;
        this.isOpacityDropdownOpen = false;
        this.isThemeDropdownOpen = false;

        // Debounced handlers
        this.debouncedOpacityChange = debounce(this._handleOpacityChange.bind(this), 150);
        
        // Initialize models
        this._loadModels();
    }

    connectedCallback() {
        super.connectedCallback();
        this._setupEventListeners();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._cleanupEventListeners();
    }

    async _loadModels() {
        try {
            this.enabledModels = await getEnabledModels();
            if (this.enabledModels.length > 0 && !this.selectedModel) {
                this.selectedModel = this.enabledModels[0].name;
            }
        } catch (error) {
            console.error('Failed to load models:', error);
        }
    }

    _setupEventListeners() {
        document.addEventListener('click', this._handleDocumentClick.bind(this));
    }

    _cleanupEventListeners() {
        document.removeEventListener('click', this._handleDocumentClick.bind(this));
    }

    _handleDocumentClick(event) {
        // Close dropdowns when clicking outside
        if (!this.contains(event.target)) {
            this.isModelsDropdownOpen = false;
            this.isControlsMenuOpen = false;
            this.isOpacityDropdownOpen = false;
            this.isThemeDropdownOpen = false;
        }
    }

    _toggleModelsDropdown() {
        this.isModelsDropdownOpen = !this.isModelsDropdownOpen;
        this._closeOtherDropdowns('models');
    }

    _toggleControlsMenu() {
        this.isControlsMenuOpen = !this.isControlsMenuOpen;
        this._closeOtherDropdowns('controls');
    }

    _toggleOpacityDropdown() {
        this.isOpacityDropdownOpen = !this.isOpacityDropdownOpen;
        this._closeOtherDropdowns('opacity');
    }

    _toggleThemeDropdown() {
        this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
        this._closeOtherDropdowns('theme');
    }

    _closeOtherDropdowns(except) {
        if (except !== 'models') this.isModelsDropdownOpen = false;
        if (except !== 'controls') this.isControlsMenuOpen = false;
        if (except !== 'opacity') this.isOpacityDropdownOpen = false;
        if (except !== 'theme') this.isThemeDropdownOpen = false;
    }

    _selectModel(modelName) {
        this.selectedModel = modelName;
        this.isModelsDropdownOpen = false;
        this.dispatchEvent(new CustomEvent('model-changed', {
            detail: { model: modelName }
        }));
    }

    _handleOpacityChange(value) {
        this.windowOpacity = value;
        this.dispatchEvent(new CustomEvent('opacity-changed', {
            detail: { opacity: value }
        }));
    }

    _handleOpacityPreset(value) {
        this._handleOpacityChange(value);
        this.isOpacityDropdownOpen = false;
    }

    _toggleAudio() {
        this.isAudioActive = !this.isAudioActive;
        this.dispatchEvent(new CustomEvent('audio-toggle', {
            detail: { active: this.isAudioActive }
        }));
    }

    _toggleScreen() {
        this.isScreenActive = !this.isScreenActive;
        this.dispatchEvent(new CustomEvent('screen-toggle', {
            detail: { active: this.isScreenActive }
        }));
    }

    _toggleSession() {
        this.sessionActive = !this.sessionActive;
        this.dispatchEvent(new CustomEvent('session-toggle', {
            detail: { active: this.sessionActive }
        }));
    }

    _navigateToView(view) {
        this.dispatchEvent(new CustomEvent('view-change', {
            detail: { view }
        }));
    }

    _getSelectedModelInfo() {
        return this.enabledModels.find(model => model.name === this.selectedModel) || 
               { name: this.selectedModel || 'No Model', provider: 'unknown' };
    }

    render() {
        const selectedModel = this._getSelectedModelInfo();
        
        return html`
            <div class="buddy-header">
                <!-- Title Section -->
                <div class="header-title">
                    <span class="header-title-text">Buddy Desktop</span>
                    
                    <!-- Model Selector -->
                    <div class="dropdown ${this.isModelsDropdownOpen ? 'open' : ''}">
                        <button 
                            class="model-select"
                            aria-expanded="${this.isModelsDropdownOpen}"
                            @click=${this._toggleModelsDropdown}
                        >
                            <span class="model-select-text">${selectedModel.name}</span>
                            <svg class="model-select-arrow" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                        
                        <div class="models-dropdown">
                            ${this.enabledModels.map(model => html`
                                <div 
                                    class="model-option ${model.name === this.selectedModel ? 'active' : ''}"
                                    @click=${() => this._selectModel(model.name)}
                                >
                                    <div class="model-info">
                                        <div class="model-name">${model.name}</div>
                                        <div class="model-badge">${model.provider}</div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                </div>

                <!-- Actions Section -->
                <div class="header-actions">
                    <!-- Status Container -->
                    <div class="status-container">
                        <span class="status-indicator ${this.sessionActive ? 'status-live' : 'status-idle'}"></span>
                        <span>${this.sessionActive ? 'Active' : 'Idle'}</span>
                    </div>

                    <!-- Controls Menu -->
                    <div class="dropdown ${this.isControlsMenuOpen ? 'open' : ''}">
                        <button 
                            class="controls-btn ${this.isAudioActive || this.isScreenActive ? 'active' : ''}"
                            @click=${this._toggleControlsMenu}
                        >
                            ⚙️
                        </button>
                        
                        <div class="controls-dropdown">
                            <div class="control-section">
                                <div class="control-section-title">Audio & Video</div>
                                <div class="control-item">
                                    <span>Microphone</span>
                                    <button 
                                        class="control-toggle ${this.isAudioActive ? 'active' : ''}"
                                        @click=${this._toggleAudio}
                                    >
                                        ${this.isAudioActive ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                <div class="control-item">
                                    <span>Screen Share</span>
                                    <button 
                                        class="control-toggle ${this.isScreenActive ? 'active' : ''}"
                                        @click=${this._toggleScreen}
                                    >
                                        ${this.isScreenActive ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Opacity Control -->
                    <div class="dropdown ${this.isOpacityDropdownOpen ? 'open' : ''}">
                        <button 
                            class="opacity-control"
                            @click=${this._toggleOpacityDropdown}
                        >
                            <span class="opacity-value">${Math.round(this.windowOpacity * 100)}%</span>
                        </button>
                        
                        <div class="opacity-dropdown">
                            <div class="opacity-slider-container">
                                <input 
                                    type="range" 
                                    class="opacity-slider"
                                    min="0.1" 
                                    max="1" 
                                    step="0.05"
                                    .value=${this.windowOpacity}
                                    @input=${(e) => this.debouncedOpacityChange(parseFloat(e.target.value))}
                                >
                            </div>
                            
                            <div class="opacity-presets">
                                <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(1.0)}>
                                    100% <span>Solid</span>
                                </button>
                                <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.9)}>
                                    90% <span>Slight</span>
                                </button>
                                <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.75)}>
                                    75% <span>Medium</span>
                                </button>
                                <button class="opacity-preset-btn" @click=${() => this._handleOpacityPreset(0.5)}>
                                    50% <span>Half</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Theme Selector -->
                    <div class="dropdown ${this.isThemeDropdownOpen ? 'open' : ''}">
                        <button 
                            class="theme-btn"
                            @click=${this._toggleThemeDropdown}
                        >
                            🎨
                        </button>
                        
                        <div class="theme-dropdown">
                            <div class="dropdown-item">
                                <span>Dark</span>
                                <div class="theme-preview" style="background: #1a1a1a;"></div>
                            </div>
                            <div class="dropdown-item">
                                <span>Light</span>
                                <div class="theme-preview" style="background: #ffffff;"></div>
                            </div>
                            <div class="dropdown-item">
                                <span>Auto</span>
                                <div class="theme-preview" style="background: linear-gradient(45deg, #1a1a1a 50%, #ffffff 50%);"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Session Button -->
                    <button 
                        class="session-button ${this.sessionActive ? 'end' : 'start'}"
                        @click=${this._toggleSession}
                    >
                        ${this.sessionActive ? 'End' : 'Start'}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('optimized-buddy-header', OptimizedBuddyHeader);

export { OptimizedBuddyHeader };
