import { html, LitElement } from '../lit-core-2.7.4.min.js';
import { modelsStyles } from './ui/models-css.js';

class BuddyMainView extends LitElement {
    static properties = {
        selectedProvider: { type: String },
        selectedModel: { type: String },
        providers: { type: Array },
        models: { type: Array },
        apiKey: { type: String },
        keyLabel: { type: String },
        disabledModelIds: { type: Array },
    };

    static styles = [modelsStyles];

    _onProviderSelect(e) {
        this.dispatchEvent(new CustomEvent('provider-select', { detail: { provider: e.target.value }, bubbles: true, composed: true }));
    }
    _onModelSelect(e) {
        this.dispatchEvent(new CustomEvent('model-select', { detail: { model: e.target.value }, bubbles: true, composed: true }));
    }
    _onApiKeyInput(e) {
        this.dispatchEvent(new CustomEvent('api-key-input', { detail: { apiKey: e.target.value }, bubbles: true, composed: true }));
    }
    _onGoToChat() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'assistant' }, bubbles: true, composed: true }));
    }

    async _openExternalLink(url) {
        try {
            await window.buddy.openExternal(url);
        } catch (error) {
            console.error('Failed to open external link:', error);
        }
    }



    _getProviderSignupUrl(provider) {
        const urlMap = {
            'google': 'https://aistudio.google.com',
            'openai': 'https://platform.openai.com/api-keys',
            'anthropic': 'https://console.anthropic.com',
            'deepseek': 'https://platform.deepseek.com',
            'openrouter': 'https://openrouter.ai/keys'
        };
        return urlMap[provider] || 'https://aistudio.google.com';
    }

    render() {
        const currentProvider = this.providers?.find(p => p.value === this.selectedProvider) || {};
        const disabledModelIds = this.disabledModelIds || [];
        return html`
            <div class="main-view-container">
                <div class="welcome">Welcome to Buddy</div>
                
                <div class="form-card">
                    <div class="card-title">AI Configuration</div>
                    
                    <div class="option-group">
                        <label class="option-label">Select AI Provider</label>
                        <select .value=${this.selectedProvider} @change=${this._onProviderSelect}>
                            ${this.providers?.map(
                                provider => html`
                                    <option value=${provider.value} ?selected=${this.selectedProvider === provider.value}>${provider.name}</option>
                                `
                            )}
                        </select>
                        <div class="provider-help-text">Choose your preferred AI service provider</div>
                    </div>
                    
                    <div class="option-group">
                        <label class="option-label">Select Model</label>
                        <select .value=${this.selectedModel} @change=${this._onModelSelect}>
                            ${this.models?.map(
                                model => html`
                                    <option value=${model.id} ?selected=${this.selectedModel === model.id} ?disabled=${disabledModelIds.includes(model.id)}>
                                        ${model.name}${disabledModelIds.includes(model.id) ? ' (Not for real-time)' : ''}
                                    </option>
                                `
                            )}
                        </select>
                        <div class="provider-help-text">Choose a model for the selected provider</div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="option-group">
                        <label class="option-label">API Key</label>
                        <div class="input-group">
                            <input
                                type="password"
                                placeholder="Enter ${currentProvider.keyLabel || 'API Key'} (optional if set in environment)"
                                .value=${this.apiKey || ''}
                                @input=${this._onApiKeyInput}
                            />
                            <button 
                                @click=${this._onGoToChat} 
                                class="go-to-chat-button"
                            >
                                <div class="button-content">
                                    <span>Go to Chat</span>
                                    <svg 
                                        class="button-icon"
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        stroke-width="2.5" 
                                        stroke-linecap="round" 
                                        stroke-linejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="m12 16 4-4-4-4"/>
                                        <path d="M8 12h8"/>
                                    </svg>
                                </div>
                            </button>
                        </div>
                        <div class="api-help">
                            Need a key? <button class="link-button" @click=${() => this._openExternalLink(this._getProviderSignupUrl(this.selectedProvider))}>Get ${currentProvider.name} API Key</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-main-view', BuddyMainView);