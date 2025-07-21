import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { getAllProviders } from '../services/models-service.js';

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
            capabilities: [],
            contextWindow: 4096,
            maxTokens: 1024,
        };
        this.errors = {};
        this.isLoading = false;
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
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
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
            color: var(--text-color);
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.2s ease;
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
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
        }

        .capability-checkbox:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .capability-checkbox.selected {
            background: rgba(34, 197, 94, 0.2);
            border-color: #22c55e;
        }

        .capability-checkbox input {
            margin: 0;
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
            padding: 8px;
            margin-top: 8px;
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.8;
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
                capabilities: [],
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
            capabilities: [],
            contextWindow: 4096,
            maxTokens: 1024,
        };
        this.errors = {};
    }

    _onInputChange(field, value) {
        this.formData = { ...this.formData, [field]: value };
        if (this.errors[field]) {
            this.errors = { ...this.errors, [field]: null };
        }
        this.requestUpdate();
    }

    _onCapabilityToggle(capability) {
        const capabilities = [...this.formData.capabilities];
        const index = capabilities.indexOf(capability);
        if (index >= 0) {
            capabilities.splice(index, 1);
        } else {
            capabilities.push(capability);
        }
        this._onInputChange('capabilities', capabilities);
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

        if (this.formData.baseUrl && !this._isValidUrl(this.formData.baseUrl)) {
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
        return [
            { id: 'text', label: 'Text' },
            { id: 'vision', label: 'Vision' },
            { id: 'code', label: 'Code' },
            { id: 'audio', label: 'Audio' },
            { id: 'video', label: 'Video' },
            { id: 'reasoning', label: 'Reasoning' },
            { id: 'analysis', label: 'Analysis' },
        ];
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
                        </select>
                        ${this.errors.provider ? html`<div class="form-error">${this.errors.provider}</div>` : ''}
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
                        <label class="form-label">Base URL (Optional)</label>
                        <input
                            type="url"
                            class="form-input"
                            .value=${this.formData.baseUrl}
                            @input=${e => this._onInputChange('baseUrl', e.target.value)}
                            placeholder="https://api.example.com"
                        />
                        <div class="help-text">Custom API endpoint (leave empty to use provider default)</div>
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
                        <div class="capabilities-group">
                            ${capabilities.map(
                                cap => html`
                                    <label
                                        class="capability-checkbox ${this.formData.capabilities.includes(cap.id) ? 'selected' : ''}"
                                        @click=${() => this._onCapabilityToggle(cap.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            .checked=${this.formData.capabilities.includes(cap.id)}
                                            @change=${() => this._onCapabilityToggle(cap.id)}
                                        />
                                        ${cap.label}
                                    </label>
                                `
                            )}
                        </div>
                    </div>

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
                        <div class="help-text">Maximum number of tokens the model can process</div>
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
                        <div class="help-text">Maximum number of tokens the model can generate</div>
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