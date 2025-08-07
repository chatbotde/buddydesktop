import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { getAllProviders } from '../services/models-service.js';
import { 
    getAllCapabilities, 
    getCapabilitiesByCategory, 
    getCapabilityPresets, 
    getProviderCapabilityPreset,
    validateCapabilities,
    suggestCapabilities
} from '../services/capabilities-service.js';

class BuddyCustomModelForm extends LitElement {
    static properties = {
        isOpen: { type: Boolean },
        editingModel: { type: Object },
        formData: { type: Object },
        errors: { type: Object },
        isLoading: { type: Boolean },
    };

    constructor() {
        super();
        this.isOpen = false;
        this.editingModel = null;
        this.formData = {
            name: '',
            provider: '',
            baseUrl: '',
            apiKey: '',
            modelId: '',
            description: '',
            capabilities: ['text'], // Always include text capability
            contextWindow: 4096,
            maxTokens: 1024,
        };
        this.errors = {};
        this.isLoading = false;
        this.capabilityValidation = { errors: [], warnings: [], isValid: true };
    }

    static styles = css`
        :host {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            --dropdown-bg: #1a1a1a;
            --dropdown-text: #ffffff;
            --dropdown-hover-bg: #333333;
            --dropdown-border: rgba(255, 255, 255, 0.2);
        }

        :host([open]) {
            opacity: 1;
            visibility: visible;
        }

        .modal {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        :host([open]) .modal {
            transform: scale(1);
        }

        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-color);
        }

        .close-button {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background 0.2s ease;
        }

        .close-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-color);
            margin-bottom: 8px;
        }

        .form-input,
        .form-select,
        .form-textarea {
            width: 100%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            color: var(--text-color, #ffffff);
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
            color: rgba(255, 255, 255, 0.5);
            opacity: 1;
        }

        .form-select {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-color, #ffffff);
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            padding-right: 40px;
            cursor: pointer;
        }

        .form-select option {
            background: var(--dropdown-bg, #1a1a1a) !important;
            color: var(--dropdown-text, #ffffff) !important;
            padding: 8px 12px;
            border: none;
            font-size: 14px;
        }

        .form-select option:hover,
        .form-select option:focus,
        .form-select option:checked {
            background: var(--dropdown-hover-bg, #333333) !important;
            color: var(--dropdown-text, #ffffff) !important;
        }

        .form-select option:disabled {
            background: #0a0a0a !important;
            color: #666666 !important;
        }

        /* Additional styling for better cross-browser support */
        .form-select::-ms-expand {
            display: none;
        }

        .form-select:focus {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
        }

        /* Dark theme fallback for better visibility */
        @media (prefers-color-scheme: dark) {
            .form-select {
                background: rgba(40, 40, 40, 0.9);
                color: #ffffff;
                border-color: rgba(255, 255, 255, 0.3);
            }
            
            .form-select option {
                background: #2a2a2a !important;
                color: #ffffff !important;
            }
            
            .form-select option:hover,
            .form-select option:checked {
                background: #404040 !important;
            }
        }

        /* Force dark styling regardless of system preference */
        .form-select {
            background: rgba(40, 40, 40, 0.9) !important;
            color: #ffffff !important;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
            outline: none;
            border-color: var(--text-color);
            background: rgba(255, 255, 255, 0.12);
        }

        .form-textarea {
            resize: vertical;
            min-height: 80px;
        }

        .form-error {
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
        }

        .capabilities-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }

        .capability-checkbox {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
            min-width: 140px;
            flex: 1;
        }

        .capability-checkbox:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
        }

        .capability-checkbox.selected {
            background: rgba(34, 197, 94, 0.15);
            border-color: #22c55e;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
        }

        .capability-checkbox.required {
            background: rgba(59, 130, 246, 0.1);
            border-color: rgba(59, 130, 246, 0.3);
            cursor: default;
        }

        .capability-checkbox.required input {
            cursor: default;
        }

        .capability-checkbox.required.selected {
            background: rgba(59, 130, 246, 0.15);
            border-color: #3b82f6;
        }

        .capability-checkbox input {
            margin: 0;
            margin-top: 2px;
        }

        .capabilities-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 8px;
        }

        .capability-presets {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preset-button {
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            color: var(--text-color);
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .preset-button:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-1px);
        }

        .capability-category {
            margin-bottom: 12px;
        }

        .category-header {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-color);
            opacity: 0.8;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .category-capabilities {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 8px;
        }

        .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .btn-primary {
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            border: 1px solid #22c55e;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .help-text {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.6;
            margin-top: 4px;
        }

        .provider-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            padding: 12px;
            margin-top: 8px;
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.8;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .provider-info-header {
            font-weight: 500;
            margin-bottom: 4px;
            color: var(--text-color);
            opacity: 1;
        }

        .provider-info-details {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .provider-info-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
        }

        .provider-info-item a {
            color: #4ade80;
            text-decoration: none;
        }

        .provider-info-item a:hover {
            text-decoration: underline;
        }

        .capability-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
        }

        .capability-description {
            font-size: 10px;
            opacity: 0.7;
            line-height: 1.2;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .capability-validation {
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
        }

        .capability-validation.errors {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
        }

        .capability-validation.warnings {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #f59e0b;
        }

        .capability-validation.success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
        }

        .validation-item {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 4px;
        }

        .validation-item:last-child {
            margin-bottom: 0;
        }

        @media (max-width: 600px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;

    open(editingModel = null) {
        this.editingModel = editingModel;
        if (editingModel) {
            this.formData = { ...editingModel };
        } else {
            this.formData = {
                name: '',
                provider: '',
                baseUrl: '',
                apiKey: '',
                modelId: '',
                description: '',
                capabilities: ['text'], // Always include text capability
                contextWindow: 4096,
                maxTokens: 1024,
            };
        }
        this.errors = {};
        this.isOpen = true;
        this.setAttribute('open', '');
    }

    close() {
        this.isOpen = false;
        this.removeAttribute('open');
        this.editingModel = null;
        this.formData = {
            name: '',
            provider: '',
            baseUrl: '',
            apiKey: '',
            modelId: '',
            description: '',
            capabilities: ['text'], // Always include text capability
            contextWindow: 4096,
            maxTokens: 1024,
        };
        this.errors = {};
    }

    _onInputChange(field, value) {
        this.formData = { ...this.formData, [field]: value };
        
        // Auto-populate base URL when provider changes (if not already set)
        if (field === 'provider' && value && value !== 'custom' && !this.formData.baseUrl) {
            const providerInfo = this._getProviderInfo(value);
            if (providerInfo.baseUrl) {
                this.formData = { ...this.formData, baseUrl: providerInfo.baseUrl };
            }
        }
        
        // Auto-populate common capabilities when provider changes (if none selected)
        if (field === 'provider' && value && this.formData.capabilities.length <= 1) {
            const presetCapabilities = this._getProviderCapabilityPreset(value);
            this.formData = { ...this.formData, capabilities: presetCapabilities };
        }

        // Suggest capabilities based on model name
        if (field === 'name' && value && this.formData.capabilities.length <= 1) {
            const suggestedCapabilities = suggestCapabilities(value, this.formData.description, this.formData.provider);
            this.formData = { ...this.formData, capabilities: suggestedCapabilities };
        }
        
        if (this.errors[field]) {
            this.errors = { ...this.errors, [field]: null };
        }
        this.requestUpdate();
    }

    _onCapabilityToggle(capability) {
        // Don't allow toggling required capabilities
        const capabilityInfo = this._getAvailableCapabilities().find(c => c.id === capability);
        if (capabilityInfo && capabilityInfo.required) {
            return;
        }

        const capabilities = [...this.formData.capabilities];
        const index = capabilities.indexOf(capability);
        if (index >= 0) {
            capabilities.splice(index, 1);
        } else {
            capabilities.push(capability);
        }
        
        // Ensure required capabilities are always included
        const requiredCapabilities = this._getAvailableCapabilities()
            .filter(c => c.required)
            .map(c => c.id);
        
        requiredCapabilities.forEach(reqCap => {
            if (!capabilities.includes(reqCap)) {
                capabilities.push(reqCap);
            }
        });
        
        this._onInputChange('capabilities', capabilities);
        
        // Validate capabilities and show feedback
        this._validateCapabilities();
    }

    _validateForm() {
        const errors = {};

        if (!this.formData.name.trim()) {
            errors.name = 'Model name is required';
        }

        if (!this.formData.provider) {
            errors.provider = 'Provider is required';
        }

        if (!this.formData.modelId.trim()) {
            errors.modelId = 'Model ID is required';
        }

        if (!this.formData.apiKey.trim()) {
            errors.apiKey = 'API Key is required';
        }

        // Base URL is required for custom providers
        if (this.formData.provider === 'custom') {
            if (!this.formData.baseUrl.trim()) {
                errors.baseUrl = 'Base URL is required for custom providers';
            } else if (!this._isValidUrl(this.formData.baseUrl)) {
                errors.baseUrl = 'Please enter a valid URL';
            }
        } else if (this.formData.baseUrl && !this._isValidUrl(this.formData.baseUrl)) {
            errors.baseUrl = 'Please enter a valid URL';
        }

        this.errors = errors;
        return Object.keys(errors).length === 0;
    }

    _isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async _onSave() {
        if (!this._validateForm()) {
            console.log('❌ Form validation failed');
            this.requestUpdate();
            return;
        }

        this.isLoading = true;
        this.requestUpdate();

        try {
            const customModel = {
                id: this.editingModel?.id || `custom-${Date.now()}`,
                name: this.formData.name.trim(),
                provider: this.formData.provider,
                baseUrl: this.formData.baseUrl.trim() || undefined,
                apiKey: this.formData.apiKey.trim(),
                modelId: this.formData.modelId.trim(),
                description: this.formData.description.trim(),
                capabilities: this.formData.capabilities,
                contextWindow: parseInt(this.formData.contextWindow) || 4096,
                maxTokens: parseInt(this.formData.maxTokens) || 1024,
                icon: '⚙️',
                custom: true,
                live: false,
            };

            console.log('📝 Creating custom model:', customModel);

            this.dispatchEvent(
                new CustomEvent('save-custom-model', {
                    detail: { model: customModel, isEdit: !!this.editingModel },
                    bubbles: true,
                    composed: true,
                })
            );

            this.close();
        } catch (error) {
            console.error('❌ Failed to save custom model:', error);
        } finally {
            this.isLoading = false;
            this.requestUpdate();
        }
    }

    _getProviders() {
        return getAllProviders();
    }

    _getAvailableCapabilities() {
        return getAllCapabilities().map(cap => ({
            id: cap.id,
            label: `${cap.icon} ${cap.name}`,
            description: cap.description,
            category: cap.category,
            required: cap.required
        }));
    }

    _getProviderInfo(providerId) {
        const providerInfoMap = {
            openai: { 
                description: 'OpenAI models (GPT-4, GPT-3.5, etc.)',
                baseUrl: 'https://api.openai.com/v1',
                keyUrl: 'https://platform.openai.com/api-keys'
            },
            anthropic: { 
                description: 'Anthropic Claude models',
                baseUrl: 'https://api.anthropic.com/v1',
                keyUrl: 'https://console.anthropic.com/'
            },
            google: { 
                description: 'Google Gemini models',
                baseUrl: 'https://generativelanguage.googleapis.com/v1',
                keyUrl: 'https://makersuite.google.com/app/apikey'
            },
            deepseek: { 
                description: 'DeepSeek AI models',
                baseUrl: 'https://api.deepseek.com/v1',
                keyUrl: 'https://platform.deepseek.com/api_keys'
            },
            openrouter: { 
                description: 'OpenRouter unified API',
                baseUrl: 'https://openrouter.ai/api/v1',
                keyUrl: 'https://openrouter.ai/keys'
            },
            xai: { 
                description: 'xAI Grok models',
                baseUrl: 'https://api.x.ai/v1',
                keyUrl: 'https://console.x.ai/'
            },
            kimi: { 
                description: 'Kimi AI models',
                baseUrl: 'https://api.moonshot.cn/v1',
                keyUrl: 'https://platform.moonshot.cn/console/api-keys'
            },
            custom: { 
                description: 'Custom API endpoint',
                baseUrl: '',
                keyUrl: ''
            }
        };
        return providerInfoMap[providerId] || providerInfoMap.custom;
    }

    _getProviderCapabilityPreset(providerId) {
        return getProviderCapabilityPreset(providerId);
    }

    _getCapabilityPresets() {
        return getCapabilityPresets();
    }

    _applyCapabilityPreset(preset) {
        this._onInputChange('capabilities', preset.capabilities);
        this._validateCapabilities();
    }

    _validateCapabilities() {
        const validation = validateCapabilities(this.formData.capabilities);
        this.capabilityValidation = validation;
        this.requestUpdate();
    }

    _groupCapabilitiesByCategory(capabilities) {
        const categoryMap = {
            'Core Capabilities': 'core',
            'Media Processing': 'media', 
            'Advanced Features': 'advanced',
            'Real-time Features': 'realtime',
            'Specialized Tasks': 'specialized'
        };

        return getCapabilitiesByCategory().map(category => ({
            name: category.name,
            capabilities: capabilities.filter(cap => cap.category === categoryMap[category.name])
        })).filter(cat => cat.capabilities.length > 0);
    }

    render() {
        if (!this.isOpen) return html``;

        const providers = this._getProviders();
        const capabilities = this._getAvailableCapabilities();

        return html`
            <div class="modal" @click=${e => e.stopPropagation()}>
                <div class="modal-header">
                    <h2 class="modal-title">${this.editingModel ? 'Edit Custom Model' : 'Add Custom Model'}</h2>
                    <button class="close-button" @click=${this.close}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form @submit=${e => e.preventDefault()}>
                    <div class="form-group">
                        <label class="form-label">Model Name *</label>
                        <input
                            type="text"
                            class="form-input"
                            .value=${this.formData.name}
                            @input=${e => this._onInputChange('name', e.target.value)}
                            placeholder="e.g., My Custom GPT-4"
                        />
                        ${this.errors.name ? html`<div class="form-error">${this.errors.name}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label class="form-label">Provider *</label>
                        <select
                            class="form-select"
                            .value=${this.formData.provider}
                            @change=${e => this._onInputChange('provider', e.target.value)}
                        >
                            <option value="">Select a provider</option>
                            ${providers.map(
                                provider => html`
                                    <option value=${provider.value}>${provider.name}</option>
                                `
                            )}
                            <option value="custom">Custom Provider</option>
                        </select>
                        ${this.errors.provider ? html`<div class="form-error">${this.errors.provider}</div>` : ''}
                        
                        ${this.formData.provider ? html`
                            <div class="provider-info">
                                <div class="provider-info-header">${this._getProviderInfo(this.formData.provider).description}</div>
                                <div class="provider-info-details">
                                    ${this._getProviderInfo(this.formData.provider).baseUrl ? html`
                                        <div class="provider-info-item">
                                            <span>🔗 Default API:</span>
                                            <span>${this._getProviderInfo(this.formData.provider).baseUrl}</span>
                                        </div>
                                    ` : ''}
                                    ${this._getProviderInfo(this.formData.provider).keyUrl ? html`
                                        <div class="provider-info-item">
                                            <span>🔑 Get API Key:</span>
                                            <a href="${this._getProviderInfo(this.formData.provider).keyUrl}" target="_blank">
                                                ${this._getProviderInfo(this.formData.provider).keyUrl}
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="form-group">
                        <label class="form-label">Model ID *</label>
                        <input
                            type="text"
                            class="form-input"
                            .value=${this.formData.modelId}
                            @input=${e => this._onInputChange('modelId', e.target.value)}
                            placeholder="e.g., gpt-4, claude-3-sonnet"
                        />
                        <div class="help-text">The actual model identifier used in API calls</div>
                        ${this.errors.modelId ? html`<div class="form-error">${this.errors.modelId}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label class="form-label">API Key *</label>
                        <input
                            type="password"
                            class="form-input"
                            .value=${this.formData.apiKey}
                            @input=${e => this._onInputChange('apiKey', e.target.value)}
                            placeholder="Your API key"
                        />
                        ${this.errors.apiKey ? html`<div class="form-error">${this.errors.apiKey}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label class="form-label">Base URL ${this.formData.provider === 'custom' ? '*' : '(Optional)'}</label>
                        <input
                            type="url"
                            class="form-input"
                            .value=${this.formData.baseUrl}
                            @input=${e => this._onInputChange('baseUrl', e.target.value)}
                            placeholder=${this.formData.provider && this.formData.provider !== 'custom' 
                                ? this._getProviderInfo(this.formData.provider).baseUrl || "https://api.example.com"
                                : "https://api.example.com"}
                        />
                        <div class="help-text">
                            ${this.formData.provider === 'custom' 
                                ? 'API endpoint for your custom provider'
                                : 'Custom API endpoint (leave empty to use provider default)'}
                        </div>
                        ${this.errors.baseUrl ? html`<div class="form-error">${this.errors.baseUrl}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea
                            class="form-textarea"
                            .value=${this.formData.description}
                            @input=${e => this._onInputChange('description', e.target.value)}
                            placeholder="Brief description of this model"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Capabilities</label>
                        <div class="help-text">Select the capabilities your model supports. Use presets for quick setup.</div>
                        
                        <div class="capability-presets">
                            ${this._getCapabilityPresets().map(preset => html`
                                <button
                                    type="button"
                                    class="preset-button"
                                    @click=${() => this._applyCapabilityPreset(preset)}
                                    title="${preset.description}"
                                >
                                    ${preset.name}
                                </button>
                            `)}
                        </div>

                        <div class="capabilities-group">
                            ${this._groupCapabilitiesByCategory(capabilities).map(category => html`
                                <div class="capability-category">
                                    <div class="category-header">${category.name}</div>
                                    <div class="category-capabilities">
                                        ${category.capabilities.map(cap => html`
                                            <label
                                                class="capability-checkbox ${this.formData.capabilities.includes(cap.id) ? 'selected' : ''} ${cap.required ? 'required' : ''}"
                                                @click=${() => cap.required ? null : this._onCapabilityToggle(cap.id)}
                                                title="${cap.description}"
                                            >
                                                <input
                                                    type="checkbox"
                                                    .checked=${this.formData.capabilities.includes(cap.id)}
                                                    .disabled=${cap.required}
                                                    @change=${() => cap.required ? null : this._onCapabilityToggle(cap.id)}
                                                />
                                                <div class="capability-item">
                                                    <span>${cap.label} ${cap.required ? '*' : ''}</span>
                                                    <span class="capability-description">${cap.description}</span>
                                                </div>
                                            </label>
                                        `)}
                                    </div>
                                </div>
                            `)}
                        </div>

                        ${this.capabilityValidation && (this.capabilityValidation.errors.length > 0 || this.capabilityValidation.warnings.length > 0) ? html`
                            <div class="capability-validation ${this.capabilityValidation.errors.length > 0 ? 'errors' : 'warnings'}">
                                ${this.capabilityValidation.errors.map(error => html`
                                    <div class="validation-item">
                                        <span>❌</span>
                                        <span>${error}</span>
                                    </div>
                                `)}
                                ${this.capabilityValidation.warnings.map(warning => html`
                                    <div class="validation-item">
                                        <span>⚠️</span>
                                        <span>${warning}</span>
                                    </div>
                                `)}
                            </div>
                        ` : this.formData.capabilities.length > 1 ? html`
                            <div class="capability-validation success">
                                <div class="validation-item">
                                    <span>✅</span>
                                    <span>Capability configuration looks good!</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Context Window</label>
                            <input
                                type="number"
                                class="form-input"
                                .value=${this.formData.contextWindow}
                                @input=${e => this._onInputChange('contextWindow', e.target.value)}
                                min="1"
                                placeholder="4096"
                            />
                            <div class="help-text">Max tokens the model can process</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Max Output Tokens</label>
                            <input
                                type="number"
                                class="form-input"
                                .value=${this.formData.maxTokens}
                                @input=${e => this._onInputChange('maxTokens', e.target.value)}
                                min="1"
                                placeholder="1024"
                            />
                            <div class="help-text">Max tokens the model can generate</div>
                        </div>
                    </div>
                </form>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" @click=${this.close}>Cancel</button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click=${this._onSave}
                        ?disabled=${this.isLoading}
                    >
                        ${this.isLoading ? 'Saving...' : this.editingModel ? 'Update Model' : 'Add Model'}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-custom-model-form', BuddyCustomModelForm);