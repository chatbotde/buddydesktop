import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { modelsStyles } from './ui/models-css.js';
import { getAllModels, getCustomModels, saveCustomModel, deleteCustomModel, isCustomModel, DEFAULT_ENABLED_MODELS } from '../services/models-service.js';
import { formatCapabilityName, getUniqueCapabilities, filterModelsByCapability } from '../services/capabilities-service.js';
import './buddy-custom-model-form.js';

class BuddyModelsView extends LitElement {
    static properties = {
        models: { type: Array },
        searchQuery: { type: String },
        enabledModels: { type: Array },
        selectedCapabilityFilter: { type: String },
    };

    constructor() {
        super();
        this.models = getAllModels();
        this.searchQuery = '';
        this.enabledModels = [];
        this.selectedCapabilityFilter = '';
        this.apiKeyStatuses = new Map(); // Cache for API key statuses
    }

    async connectedCallback() {
        super.connectedCallback();
        await this._checkAllApiKeys();
    }

    static styles = [
        modelsStyles,
        css`
            :host {
                background: transparent !important;
                min-height: auto !important;
            }

            :host::before {
                display: none !important;
            }

            .models-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: transparent;
            }

            .search-container {
                margin-bottom: 24px;
                position: relative;
            }

            .filters-container {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                flex-wrap: wrap;
                align-items: center;
            }

            .capability-filter {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 8px 12px;
                color: var(--text-color);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 8px center;
                background-size: 12px;
                padding-right: 32px;
                min-width: 140px;
            }

            .capability-filter:focus {
                outline: none;
                border-color: var(--text-color);
                background: rgba(255, 255, 255, 0.12);
            }

            .capability-filter option {
                background: #1a1a1a;
                color: #ffffff;
            }

            .filter-label {
                font-size: 14px;
                color: var(--text-color);
                opacity: 0.8;
                font-weight: 500;
            }

            .search-input {
                width: 100%;
                background: rgba(255, 255, 255, 0.08);
                color: var(--text-color);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                padding: 16px 20px;
                font-size: 16px;
                box-sizing: border-box;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .search-input::placeholder {
                color: var(--placeholder-color);
                opacity: 0.6;
            }

            .search-input:focus {
                outline: none;
                border-color: var(--text-color);
                box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%);
            }

            .controls-container {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 16px;
            }

            .reset-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: var(--text-color);
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .reset-button:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .reset-button svg {
                opacity: 0.8;
            }

            .models-list {
                display: flex;
                flex-direction: column;
                gap: 1px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                overflow: hidden;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .model-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.03);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                transition: all 0.2s ease;
                cursor: pointer;
            }

            .model-item:last-child {
                border-bottom: none;
            }

            .model-item:hover {
                background: rgba(255, 255, 255, 0.08);
                transform: translateX(4px);
            }

            .model-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .model-icon {
                font-size: 20px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
            }

            .model-details {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .model-name {
                font-size: 16px;
                font-weight: 500;
                color: var(--text-color);
                letter-spacing: 0.2px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .default-indicator {
                font-size: 14px;
                opacity: 0.8;
                filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.3));
            }

            .model-provider {
                font-size: 12px;
                color: var(--text-color);
                opacity: 0.7;
                font-weight: 400;
                text-transform: capitalize;
            }

            .model-badge {
                font-size: 12px;
                color: var(--text-color);
                opacity: 0.6;
                font-weight: 400;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .model-description {
                font-size: 12px;
                color: var(--text-color);
                opacity: 0.6;
                line-height: 1.3;
                margin-top: 2px;
            }

            .model-capabilities {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 6px;
            }

            .capability-badge {
                font-size: 10px;
                padding: 2px 6px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: var(--text-color);
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                font-weight: 500;
            }

            .capability-badge.text { background: rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.3); }
            .capability-badge.vision { background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.3); }
            .capability-badge.code { background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.3); }
            .capability-badge.audio { background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.3); }
            .capability-badge.video { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); }
            .capability-badge.reasoning { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.3); }
            .capability-badge.realtime { background: rgba(236, 72, 153, 0.15); border-color: rgba(236, 72, 153, 0.3); }

            .api-key-status {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                margin-top: 4px;
            }

            .api-key-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ef4444;
            }

            .api-key-indicator.configured {
                background: #22c55e;
            }

            .api-key-text {
                color: var(--text-color);
                opacity: 0.5;
            }

            .toggle-switch {
                position: relative;
                width: 52px;
                height: 28px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
                outline: none;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .toggle-switch.enabled {
                background: linear-gradient(135deg, #4ade80, #22c55e);
                border-color: #22c55e;
                box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .toggle-knob {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 22px;
                height: 22px;
                background: #ffffff;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1);
            }

            .toggle-switch.enabled .toggle-knob {
                transform: translateX(24px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.15);
            }

            .no-results {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-color);
                opacity: 0.6;
                font-size: 16px;
                font-weight: 500;
            }

            .section-header {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px 12px 20px;
                font-size: 14px;
                font-weight: 600;
                color: var(--text-color);
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 24px;
            }

            .section-header:first-child {
                margin-top: 0;
            }

            .section-icon {
                font-size: 16px;
            }

            .live-indicator {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                font-weight: 600;
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 4px;
                padding: 2px 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .live-pulse {
                width: 6px;
                height: 6px;
                background: #ef4444;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(1.2);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .model-item.live {
                border-left: 3px solid #ef4444;
                background: rgba(239, 68, 68, 0.02);
            }

            .model-item.live:hover {
                background: rgba(239, 68, 68, 0.05);
            }

            .model-item.custom {
                border-left: 3px solid #8b5cf6;
                background: rgba(139, 92, 246, 0.02);
            }

            .model-item.custom:hover {
                background: rgba(139, 92, 246, 0.05);
            }

            .custom-indicator {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                font-weight: 600;
                color: #8b5cf6;
                background: rgba(139, 92, 246, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 4px;
                padding: 2px 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .add-model-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background: linear-gradient(135deg, #4ade80, #22c55e);
                border: 1px solid #22c55e;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-right: 12px;
            }

            .add-model-button:hover {
                background: linear-gradient(135deg, #22c55e, #16a34a);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            }

            .model-actions {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-left: 12px;
            }

            .model-action-btn {
                background: none;
                border: none;
                color: var(--text-color);
                opacity: 0.6;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .model-action-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }

            .model-action-btn.delete:hover {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }

            @media (max-width: 640px) {
                .models-container {
                    padding: 16px;
                }

                .model-item {
                    padding: 14px 16px;
                }

                .model-name {
                    font-size: 15px;
                }

                .toggle-switch {
                    width: 48px;
                    height: 26px;
                }

                .toggle-knob {
                    width: 20px;
                    height: 20px;
                }

                .toggle-switch.enabled .toggle-knob {
                    transform: translateX(22px);
                }
            }
        `,
    ];

    _onSearchInput(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.requestUpdate();
    }

    _onCapabilityFilterChange(e) {
        this.selectedCapabilityFilter = e.target.value;
        this.requestUpdate();
    }

    _toggleModel(modelId) {
        const isEnabled = this.enabledModels.includes(modelId);
        if (isEnabled) {
            this.enabledModels = this.enabledModels.filter(id => id !== modelId);
        } else {
            this.enabledModels = [...this.enabledModels, modelId];
        }

        this.dispatchEvent(
            new CustomEvent('model-toggle', {
                detail: { modelId, enabled: !isEnabled },
                bubbles: true,
                composed: true,
            })
        );

        this.requestUpdate();
    }

    _getFilteredModels() {
        let filtered = this.models;

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(
                model => 
                    model.name.toLowerCase().includes(this.searchQuery) || 
                    model.provider.toLowerCase().includes(this.searchQuery) ||
                    (model.description && model.description.toLowerCase().includes(this.searchQuery))
            );
        }

        // Apply capability filter
        if (this.selectedCapabilityFilter) {
            filtered = filterModelsByCapability(filtered, this.selectedCapabilityFilter);
        }

        return filtered;
    }

    _getLiveModels() {
        return this._getFilteredModels().filter(model => model.live === true);
    }

    _getRegularModels() {
        return this._getFilteredModels().filter(model => model.live !== true && !model.custom);
    }

    _getCustomModels() {
        return this._getFilteredModels().filter(model => model.custom === true);
    }

    _getDefaultEnabledModels() {
        return DEFAULT_ENABLED_MODELS;
    }

    _isDefaultEnabled(modelId) {
        return this._getDefaultEnabledModels().includes(modelId);
    }

    _getEnvironmentKeyName(provider) {
        const envKeyMap = {
            google: 'GOOGLE_API_KEY or GEMINI_API_KEY',
            openai: 'OPENAI_API_KEY',
            anthropic: 'ANTHROPIC_API_KEY or CLAUDE_API_KEY',
            deepseek: 'DEEPSEEK_API_KEY',
            openrouter: 'OPENROUTER_API_KEY',
        };
        return envKeyMap[provider] || 'API_KEY';
    }

    async _checkAllApiKeys() {
        for (const model of this.models) {
            const hasKey = await this._hasApiKey(model);
            this.apiKeyStatuses.set(model.id, hasKey);
        }
        this.requestUpdate();
    }

    _getApiKeyStatus(model) {
        return this.apiKeyStatuses.get(model.id) || false;
    }

    _resetToDefaults() {
        this.dispatchEvent(
            new CustomEvent('reset-to-defaults', {
                detail: { defaultModels: this._getDefaultEnabledModels() },
                bubbles: true,
                composed: true,
            })
        );
    }

    _onAddCustomModel() {
        const form = this.shadowRoot.querySelector('buddy-custom-model-form');
        if (form) {
            form.open();
        }
    }

    _onEditCustomModel(model) {
        const form = this.shadowRoot.querySelector('buddy-custom-model-form');
        if (form) {
            form.open(model);
        }
    }

    _onDeleteCustomModel(modelId) {
        if (confirm('Are you sure you want to delete this custom model?')) {
            if (deleteCustomModel(modelId)) {
                // Remove from enabled models if it was enabled
                this.enabledModels = this.enabledModels.filter(id => id !== modelId);
                
                // Refresh models list
                this.models = getAllModels();
                
                // Dispatch event to update parent
                this.dispatchEvent(
                    new CustomEvent('model-deleted', {
                        detail: { modelId },
                        bubbles: true,
                        composed: true,
                    })
                );
                
                this.requestUpdate();
            }
        }
    }

    _onSaveCustomModel(e) {
        const { model, isEdit } = e.detail;
        
        console.log('💾 Saving custom model:', model);
        
        if (saveCustomModel(model)) {
            console.log('✅ Custom model saved successfully');
            
            // Refresh models list
            this.models = getAllModels();
            
            // If it's a new model, enable it by default
            if (!isEdit && !this.enabledModels.includes(model.id)) {
                this.enabledModels = [...this.enabledModels, model.id];
                
                console.log('🔄 Auto-enabling new custom model:', model.id);
                
                this.dispatchEvent(
                    new CustomEvent('model-toggle', {
                        detail: { modelId: model.id, enabled: true },
                        bubbles: true,
                        composed: true,
                    })
                );
            }
            
            // Dispatch event to update parent
            this.dispatchEvent(
                new CustomEvent('custom-model-saved', {
                    detail: { model, isEdit },
                    bubbles: true,
                    composed: true,
                })
            );
            
            this.requestUpdate();
        } else {
            console.error('❌ Failed to save custom model');
        }
    }

    async _hasApiKey(model) {
        // For custom models, check if they have their own API key
        if (model.custom && model.apiKey) {
            return true;
        }

        // Check if API key is stored in localStorage for this provider
        const localApiKey = localStorage.getItem(`apiKey_${model.provider}`);
        if (localApiKey && localApiKey.trim().length > 0) {
            return true;
        }

        // Check if environment key exists for this provider
        try {
            const hasEnvKey = await window.buddy.checkEnvironmentKey(model.provider);
            return hasEnvKey;
        } catch (error) {
            console.error('Failed to check environment key:', error);
            return false;
        }
    }

    _getAvailableCapabilities() {
        return getUniqueCapabilities(this.models);
    }

    _formatCapabilityName(capability) {
        return formatCapabilityName(capability);
    }

    render() {
        const filteredModels = this._getFilteredModels();

        return html`
            <div class="models-container">
                <div class="search-container">
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Add or search model"
                        .value=${this.searchQuery}
                        @input=${this._onSearchInput}
                    />
                </div>


                <div class="controls-container">
                    <button class="add-model-button" @click=${this._onAddCustomModel}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Custom Model
                    </button>
                    <button class="reset-button" @click=${this._resetToDefaults}>
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
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                        Reset to Defaults
                    </button>
                </div>

                ${filteredModels.length > 0
                    ? html`
                          ${this._getLiveModels().length > 0
                              ? html`
                                    <div class="section-header">
                                        <span class="section-icon">🔴</span>
                                        <span>Live Models</span>
                                        <span class="live-indicator">
                                            <span class="live-pulse"></span>
                                            Real-time
                                        </span>
                                    </div>
                                    <div class="models-list">
                                        ${this._getLiveModels().map(
                                            model => html`
                                                <div class="model-item live" @click=${() => this._toggleModel(model.id)}>
                                                    <div class="model-info">
                                                        ${model.icon ? html` <div class="model-icon">${model.icon}</div> ` : ''}
                                                        <div class="model-details">
                                                            <div class="model-name">
                                                                ${model.name}
                                                                <span class="live-indicator">
                                                                    <span class="live-pulse"></span>
                                                                    LIVE
                                                                </span>
                                                            </div>
                                                            <div class="model-provider">${model.provider}</div>
                                                            ${model.badge ? html` <div class="model-badge">${model.badge}</div> ` : ''}
                                                            ${model.description
                                                                ? html` <div class="model-description">${model.description}</div> `
                                                                : ''}
                                                            <div class="api-key-status">
                                                                <div
                                                                    class="api-key-indicator ${this._getApiKeyStatus(model) ? 'configured' : ''}"
                                                                ></div>
                                                                <span class="api-key-text">
                                                                    ${this._getApiKeyStatus(model)
                                                                        ? 'API Key Configured'
                                                                        : `${this._getEnvironmentKeyName(model.provider)} Required`}
                                                                </span>
                                                            </div>
                                                            ${model.capabilities && model.capabilities.length > 0 ? html`
                                                                <div class="model-capabilities">
                                                                    ${model.capabilities.slice(0, 6).map(cap => html`
                                                                        <span class="capability-badge ${cap}">${this._formatCapabilityName(cap)}</span>
                                                                    `)}
                                                                    ${model.capabilities.length > 6 ? html`
                                                                        <span class="capability-badge">+${model.capabilities.length - 6}</span>
                                                                    ` : ''}
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    </div>
                                                    <button
                                                        class="toggle-switch ${this.enabledModels.includes(model.id) ? 'enabled' : ''}"
                                                        @click=${e => {
                                                            e.stopPropagation();
                                                            this._toggleModel(model.id);
                                                        }}
                                                    >
                                                        <div class="toggle-knob"></div>
                                                    </button>
                                                </div>
                                            `
                                        )}
                                    </div>
                                `
                              : ''}
                          ${this._getRegularModels().length > 0
                              ? html`
                                    <div class="section-header">
                                        <span class="section-icon">💬</span>
                                        <span>Chat Models</span>
                                    </div>
                                    <div class="models-list">
                                        ${this._getRegularModels().map(
                                            model => html`
                                                <div class="model-item" @click=${() => this._toggleModel(model.id)}>
                                                    <div class="model-info">
                                                        ${model.icon ? html` <div class="model-icon">${model.icon}</div> ` : ''}
                                                        <div class="model-details">
                                                            <div class="model-name">
                                                                ${model.name}
                                                            </div>
                                                            <div class="model-provider">${model.provider}</div>
                                                            ${model.badge ? html` <div class="model-badge">${model.badge}</div> ` : ''}
                                                            ${model.description
                                                                ? html` <div class="model-description">${model.description}</div> `
                                                                : ''}
                                                            <div class="api-key-status">
                                                                <div
                                                                    class="api-key-indicator ${this._getApiKeyStatus(model) ? 'configured' : ''}"
                                                                ></div>
                                                                <span class="api-key-text">
                                                                    ${this._getApiKeyStatus(model)
                                                                        ? 'API Key Configured'
                                                                        : `${this._getEnvironmentKeyName(model.provider)} Required`}
                                                                </span>
                                                            </div>
                                                            ${model.capabilities && model.capabilities.length > 0 ? html`
                                                                <div class="model-capabilities">
                                                                    ${model.capabilities.slice(0, 6).map(cap => html`
                                                                        <span class="capability-badge ${cap}">${this._formatCapabilityName(cap)}</span>
                                                                    `)}
                                                                    ${model.capabilities.length > 6 ? html`
                                                                        <span class="capability-badge">+${model.capabilities.length - 6}</span>
                                                                    ` : ''}
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    </div>
                                                    <button
                                                        class="toggle-switch ${this.enabledModels.includes(model.id) ? 'enabled' : ''}"
                                                        @click=${e => {
                                                            e.stopPropagation();
                                                            this._toggleModel(model.id);
                                                        }}
                                                    >
                                                        <div class="toggle-knob"></div>
                                                    </button>
                                                </div>
                                            `
                                        )}
                                    </div>
                                `
                              : ''}
                          ${this._getCustomModels().length > 0
                              ? html`
                                    <div class="section-header">
                                        <span class="section-icon">⚙️</span>
                                        <span>Custom Models</span>
                                    </div>
                                    <div class="models-list">
                                        ${this._getCustomModels().map(
                                            model => html`
                                                <div class="model-item custom" @click=${() => this._toggleModel(model.id)}>
                                                    <div class="model-info">
                                                        ${model.icon ? html` <div class="model-icon">${model.icon}</div> ` : ''}
                                                        <div class="model-details">
                                                            <div class="model-name">
                                                                ${model.name}
                                                                <span class="custom-indicator">CUSTOM</span>
                                                            </div>
                                                            <div class="model-provider">${model.provider}</div>
                                                            ${model.badge ? html` <div class="model-badge">${model.badge}</div> ` : ''}
                                                            ${model.description
                                                                ? html` <div class="model-description">${model.description}</div> `
                                                                : ''}
                                                            <div class="api-key-status">
                                                                <div class="api-key-indicator configured"></div>
                                                                <span class="api-key-text">Custom API Key Configured</span>
                                                            </div>
                                                            ${model.capabilities && model.capabilities.length > 0 ? html`
                                                                <div class="model-capabilities">
                                                                    ${model.capabilities.slice(0, 6).map(cap => html`
                                                                        <span class="capability-badge ${cap}">${this._formatCapabilityName(cap)}</span>
                                                                    `)}
                                                                    ${model.capabilities.length > 6 ? html`
                                                                        <span class="capability-badge">+${model.capabilities.length - 6}</span>
                                                                    ` : ''}
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    </div>
                                                    <div class="model-actions">
                                                        <button
                                                            class="model-action-btn"
                                                            @click=${e => {
                                                                e.stopPropagation();
                                                                this._onEditCustomModel(model);
                                                            }}
                                                            title="Edit model"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            class="model-action-btn delete"
                                                            @click=${e => {
                                                                e.stopPropagation();
                                                                this._onDeleteCustomModel(model.id);
                                                            }}
                                                            title="Delete model"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <polyline points="3,6 5,6 21,6"></polyline>
                                                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <button
                                                        class="toggle-switch ${this.enabledModels.includes(model.id) ? 'enabled' : ''}"
                                                        @click=${e => {
                                                            e.stopPropagation();
                                                            this._toggleModel(model.id);
                                                        }}
                                                    >
                                                        <div class="toggle-knob"></div>
                                                    </button>
                                                </div>
                                            `
                                        )}
                                    </div>
                                `
                              : ''}
                      `
                    : html` <div class="no-results">No models found matching "${this.searchQuery}"</div> `}

                <buddy-custom-model-form @save-custom-model=${this._onSaveCustomModel}></buddy-custom-model-form>
            </div>
        `;
    }
}

customElements.define('buddy-models-view', BuddyModelsView);
