import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import '../features/marketplace/marketplace-window.js';

class EnhancedThemeSelector extends LitElement {
    static properties = {
        isOpen: { type: Boolean },
        currentTheme: { type: String },
        availableThemes: { type: Object },
        windowOpacity: { type: Number },
        isOpacityControlActive: { type: Boolean },
        searchQuery: { type: String },
        selectedCategory: { type: String }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.currentTheme = 'transparent';
        this.availableThemes = {};
        this.windowOpacity = 1.0;
        this.isOpacityControlActive = false;
        this.searchQuery = '';
        this.selectedCategory = 'all';
        this.marketplaceWindow = null;
    }

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        .theme-selector-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px 12px;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
            font-size: 14px;
        }

        .theme-selector-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .theme-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 16px;
            min-width: 320px;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(16px);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }

        .theme-dropdown.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #333;
        }

        .dropdown-title {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            margin: 0;
        }

        .marketplace-btn {
            background: #007AFF;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            color: white;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .marketplace-btn:hover {
            background: #0056CC;
        }

        .search-container {
            margin-bottom: 16px;
        }

        .search-input {
            width: 100%;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 8px 12px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
        }

        .search-input:focus {
            border-color: #007AFF;
        }

        .search-input::placeholder {
            color: #666;
        }

        .category-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 16px;
            overflow-x: auto;
        }

        .category-tab {
            background: transparent;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 6px 12px;
            color: #888;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s ease;
        }

        .category-tab:hover {
            border-color: #666;
            color: #ccc;
        }

        .category-tab.active {
            background: #007AFF;
            border-color: #007AFF;
            color: white;
        }

        .themes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 8px;
            margin-bottom: 16px;
            max-height: 200px;
            overflow-y: auto;
        }

        .theme-option {
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }

        .theme-option:hover {
            background: #333;
            border-color: #555;
        }

        .theme-option.selected {
            background: #1a3a5c;
            border-color: #007AFF;
        }

        .theme-preview {
            width: 100%;
            height: 24px;
            border-radius: 4px;
            margin-bottom: 6px;
            background: linear-gradient(45deg, #333, #666);
        }

        /* Theme-specific previews */
        .theme-transparent {
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1));
            border: 1px dashed #666;
        }

        .theme-standard {
            background: linear-gradient(45deg, #2a2a2a, #3a3a3a);
        }

        .theme-solid {
            background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
        }

        .theme-glass {
            background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
            backdrop-filter: blur(8px);
        }

        .theme-dark {
            background: linear-gradient(45deg, #000, #111);
        }

        .theme-light {
            background: linear-gradient(45deg, #f0f0f0, #fff);
        }

        .theme-name {
            font-size: 11px;
            color: #ccc;
            font-weight: 500;
        }

        .opacity-section {
            border-top: 1px solid #333;
            padding-top: 16px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .opacity-controls {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .opacity-slider-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .opacity-slider {
            flex: 1;
            height: 4px;
            background: #333;
            border-radius: 2px;
            outline: none;
            -webkit-appearance: none;
        }

        .opacity-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #007AFF;
            border-radius: 50%;
            cursor: pointer;
        }

        .opacity-value {
            font-size: 12px;
            color: #ccc;
            min-width: 40px;
            text-align: right;
        }

        .opacity-presets {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }

        .opacity-preset {
            background: #333;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 4px 8px;
            color: #ccc;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .opacity-preset:hover {
            background: #444;
            border-color: #555;
        }

        .opacity-preset.active {
            background: #007AFF;
            border-color: #007AFF;
            color: white;
        }

        .scroll-control-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .scroll-control-toggle:hover {
            background: #333;
            border-color: #555;
        }

        .scroll-control-toggle.active {
            background: #1a3a5c;
            border-color: #007AFF;
        }

        .toggle-label {
            font-size: 12px;
            color: #ccc;
        }

        .toggle-status {
            font-size: 11px;
            color: #007AFF;
            font-weight: 500;
        }

        .no-themes {
            text-align: center;
            color: #666;
            padding: 20px;
            font-size: 14px;
        }
    `;

    get filteredThemes() {
        if (!this.availableThemes) return {};
        
        let themes = { ...this.availableThemes };
        
        // Filter by category
        if (this.selectedCategory !== 'all') {
            themes = Object.fromEntries(
                Object.entries(themes).filter(([key, theme]) => 
                    theme.category === this.selectedCategory
                )
            );
        }
        
        // Filter by search query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            themes = Object.fromEntries(
                Object.entries(themes).filter(([key, theme]) =>
                    theme.name.toLowerCase().includes(query) ||
                    theme.description.toLowerCase().includes(query)
                )
            );
        }
        
        return themes;
    }

    get categories() {
        if (!this.availableThemes) return [];
        
        const categories = new Set();
        Object.values(this.availableThemes).forEach(theme => {
            if (theme.category) categories.add(theme.category);
        });
        
        return Array.from(categories);
    }

    _toggleDropdown() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            // Add click outside listener
            setTimeout(() => {
                document.addEventListener('click', this._handleOutsideClick.bind(this));
            }, 0);
        } else {
            document.removeEventListener('click', this._handleOutsideClick.bind(this));
        }
    }

    _handleOutsideClick(e) {
        if (!this.renderRoot.contains(e.target)) {
            this.isOpen = false;
            document.removeEventListener('click', this._handleOutsideClick.bind(this));
            this.requestUpdate();
        }
    }

    _handleSearch(e) {
        this.searchQuery = e.target.value;
    }

    _selectCategory(category) {
        this.selectedCategory = category;
    }

    _selectTheme(themeKey) {
        this.currentTheme = themeKey;
        this.dispatchEvent(new CustomEvent('theme-change', {
            detail: { theme: themeKey },
            bubbles: true,
            composed: true
        }));
    }

    _handleOpacityChange(e) {
        this.windowOpacity = parseFloat(e.target.value);
        this.dispatchEvent(new CustomEvent('opacity-change', {
            detail: { opacity: this.windowOpacity },
            bubbles: true,
            composed: true
        }));
    }

    _setOpacityPreset(opacity) {
        this.windowOpacity = opacity;
        this.dispatchEvent(new CustomEvent('opacity-change', {
            detail: { opacity },
            bubbles: true,
            composed: true
        }));
    }

    _toggleScrollControl() {
        this.isOpacityControlActive = !this.isOpacityControlActive;
        this.dispatchEvent(new CustomEvent('opacity-control-toggle', {
            detail: { active: this.isOpacityControlActive },
            bubbles: true,
            composed: true
        }));
    }

    _openMarketplace() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('open-marketplace', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        const filteredThemes = this.filteredThemes;
        const categories = this.categories;
        const opacityPresets = [
            { value: 1.0, label: '100%' },
            { value: 0.9, label: '90%' },
            { value: 0.75, label: '75%' },
            { value: 0.5, label: '50%' },
            { value: 0.25, label: '25%' }
        ];

        return html`
            <button class="theme-selector-btn" @click=${this._toggleDropdown}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Theme</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
            </button>

            <div class="theme-dropdown ${this.isOpen ? 'open' : ''}">
                <div class="dropdown-header">
                    <h3 class="dropdown-title">Themes & Appearance</h3>
                    <button class="marketplace-btn" @click=${this._openMarketplace}>
                        Marketplace
                    </button>
                </div>

                <div class="search-container">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Search themes..."
                        .value=${this.searchQuery}
                        @input=${this._handleSearch}
                    >
                </div>

                ${categories.length > 0 ? html`
                    <div class="category-tabs">
                        <button 
                            class="category-tab ${this.selectedCategory === 'all' ? 'active' : ''}"
                            @click=${() => this._selectCategory('all')}
                        >
                            All
                        </button>
                        ${categories.map(category => html`
                            <button 
                                class="category-tab ${this.selectedCategory === category ? 'active' : ''}"
                                @click=${() => this._selectCategory(category)}
                            >
                                ${category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        `)}
                    </div>
                ` : ''}

                <div class="themes-grid">
                    ${Object.keys(filteredThemes).length > 0 
                        ? Object.entries(filteredThemes).map(([key, theme]) => html`
                            <div 
                                class="theme-option ${this.currentTheme === key ? 'selected' : ''}"
                                @click=${() => this._selectTheme(key)}
                                title="${theme.description}"
                            >
                                <div class="theme-preview theme-${key}"></div>
                                <div class="theme-name">${theme.name}</div>
                            </div>
                        `)
                        : html`<div class="no-themes">No themes found</div>`
                    }
                </div>

                <div class="opacity-section">
                    <div class="section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2v20" />
                        </svg>
                        Opacity Control
                    </div>

                    <div class="opacity-controls">
                        <div class="opacity-slider-container">
                            <input 
                                type="range" 
                                class="opacity-slider"
                                min="0.1" 
                                max="1.0" 
                                step="0.05"
                                .value=${this.windowOpacity}
                                @input=${this._handleOpacityChange}
                            >
                            <span class="opacity-value">${Math.round(this.windowOpacity * 100)}%</span>
                        </div>

                        <div class="opacity-presets">
                            ${opacityPresets.map(preset => html`
                                <button 
                                    class="opacity-preset ${Math.abs(this.windowOpacity - preset.value) < 0.01 ? 'active' : ''}"
                                    @click=${() => this._setOpacityPreset(preset.value)}
                                >
                                    ${preset.label}
                                </button>
                            `)}
                        </div>

                        <div 
                            class="scroll-control-toggle ${this.isOpacityControlActive ? 'active' : ''}"
                            @click=${this._toggleScrollControl}
                        >
                            <span class="toggle-label">Scroll to adjust opacity</span>
                            <span class="toggle-status">${this.isOpacityControlActive ? 'ON' : 'OFF'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('enhanced-theme-selector', EnhancedThemeSelector);