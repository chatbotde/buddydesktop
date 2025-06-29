import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyMainView extends LitElement {
    static properties = {
        selectedProvider: { type: String },
        selectedModel: { type: String },
        providers: { type: Array },
        models: { type: Array },
        apiKey: { type: String },
        keyLabel: { type: String },
        disabledModelIds: { type: Array },
        hasEnvironmentKey: { type: Boolean },
    };

    static styles = css`
        :host { display: block; }
        .main-view-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }
        .welcome {
            font-size: 28px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 40px;
            color: var(--text-color);
        }
        .option-group {
            margin-bottom: 24px;
            border-color: oklch(98.5% 0.001 106.423);
        }
        .option-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: var(--text-color);
        }
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }
        .input-group input {
            flex: 1;
        }
        .provider-help-text {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.6;
            margin-top: 4px;
            font-style: italic;
        }
        .description {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.7;
            margin-top: 8px;
            line-height: 1.4;
        }
        .api-input-section {
            width: 100%;
            margin-top: 20px;
        }
        select, input[type="password"] {
            background: oklch(26.9% 0 0);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 10px 14px;
            width: 100%;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        select {
            background-color: oklch(14.1% 0.005 285.823);
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            padding-right: 40px;
            cursor: pointer;
        }
        select:focus {
            outline: none;
            border-color: var(--input-border);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
            background: oklch(48.8% 0.243 264.376);
            transform: translateY(-1px);
        }
        select option {
            background-color: var(--main-content-background);
            color: var(--text-color);
            padding: 10px 14px;
            border: none;
            font-size: 14px;
        }
        select option:hover,
        select option:checked,
        select option:focus {
            background-color: var(--button-background);
            color: var(--text-color);
        }
        input::placeholder {
            color: var(--placeholder-color);
        }
        .button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .link-button {
            background: transparent;
            color: var(--link-color, #007aff);
            border: none;
            padding: 0;
            font-size: inherit;
            text-decoration: underline;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .link-button:hover {
            color: var(--link-color, #0056b3);
            text-decoration: none;
            transform: none;
            box-shadow: none;
        }

        .env-status {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid rgba(0, 255, 0, 0.3);
            color: #4ade80;
        }

        .env-status.warning {
            background: rgba(255, 165, 0, 0.1);
            border-color: rgba(255, 165, 0, 0.3);
            color: #fbbf24;
        }

        .env-icon {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: currentColor;
        }

        .optional-label {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.5;
            font-style: italic;
        }
    `;

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

    async _checkEnvironmentKey() {
        try {
            // Check if environment variable exists for current provider
            const result = await window.buddy.checkEnvironmentKey(this.selectedProvider);
            this.hasEnvironmentKey = result;
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to check environment key:', error);
            this.hasEnvironmentKey = false;
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('selectedProvider')) {
            this._checkEnvironmentKey();
        }
    }

    _getEnvironmentKeyName(provider) {
        const envKeyMap = {
            'google': 'GOOGLE_API_KEY or GEMINI_API_KEY',
            'openai': 'OPENAI_API_KEY',
            'anthropic': 'ANTHROPIC_API_KEY or CLAUDE_API_KEY',
            'deepseek': 'DEEPSEEK_API_KEY',
            'openrouter': 'OPENROUTER_API_KEY'
        };
        return envKeyMap[provider] || 'API_KEY';
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
                <div class="option-group" >
                    <label class="option-label">Select AI Provider</label>
                    <select .value=${this.selectedProvider} @change=${this._onProviderSelect} >
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
                <div class="api-input-section">
                    <div class="option-group">
                        <label class="option-label">
                            ${currentProvider.keyLabel || 'API Key'} 
                            <span class="optional-label">(Optional)</span>
                        </label>
                        
                        ${this.hasEnvironmentKey ? html`
                            <div class="env-status">
                                <div class="env-icon"></div>
                                <span>Environment API key detected for ${currentProvider.name}</span>
                            </div>
                        ` : html`
                            <div class="env-status warning">
                                <div class="env-icon"></div>
                                <span>No environment API key found. You can set ${this._getEnvironmentKeyName(this.selectedProvider)} or enter manually below.</span>
                            </div>
                        `}
                        
                        <div class="input-group">
                            <input
                                type="password"
                                placeholder="${this.hasEnvironmentKey ? 'Using environment key (optional override)' : `Enter your ${currentProvider.keyLabel || 'API Key'}`}"
                                .value=${this.apiKey || ''}
                                @input=${this._onApiKeyInput}
                            />
                            <button @click=${this._onStartSession} class="button start-button" style="font-size: 15px">Start Session</button>
                        </div>
                        <div class="description">
                            ${this.hasEnvironmentKey ? 
                                'You can start chatting now with your environment API key, or enter a different key above to override.' :
                                html`Don't have an API key? <button class="link-button" @click=${() => this._openExternalLink(this._getProviderSignupUrl(this.selectedProvider))}>Get ${currentProvider.name} API Key</button> or set environment variable ${this._getEnvironmentKeyName(this.selectedProvider)}.`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-main-view', BuddyMainView); 