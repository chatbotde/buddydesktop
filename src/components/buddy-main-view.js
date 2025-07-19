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
    _onStartSession() {
        this.dispatchEvent(new CustomEvent('start-session', { bubbles: true, composed: true }));
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
                                @click=${this._onStartSession} 
                                class="button start-button liquid-glass"
                                style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    width: 100%;
                                    margin-top: 20px;
                                    padding: 16px;
                                    font-size: 16px;
                                    font-weight: 600;
                                    letter-spacing: 0.5px;
                                    background: rgba(255, 255, 255, 0.1);
                                    backdrop-filter: blur(10px);
                                    border: 1px solid rgba(255, 255, 255, 0.2);
                                    border-radius: 12px;
                                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                    transition: all 0.3s ease;
                                    color: rgba(255, 255, 255, 0.9);
                                    position: relative;
                                    overflow: hidden;
                                "
                                @mousemove=${(e) => {
                                    const rect = e.target.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    e.target.style.setProperty('--mouse-x', `${x}px`);
                                    e.target.style.setProperty('--mouse-y', `${y}px`);
                                }}
                            >
                                <span style="
                                    margin-right: 12px;
                                    position: relative;
                                    z-index: 1;
                                ">Start Chat</span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    stroke-width="2.5" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round"
                                    style="position: relative; z-index: 1;"
                                >
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="m12 16 4-4-4-4"/>
                                    <path d="M8 12h8"/>
                                </svg>
                                <div style="
                                    position: absolute;
                                    width: 100px;
                                    height: 100px;
                                    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%);
                                    transform: translate(-50%, -50%);
                                    left: var(--mouse-x, 0);
                                    top: var(--mouse-y, 0);
                                    pointer-events: none;
                                "></div>
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