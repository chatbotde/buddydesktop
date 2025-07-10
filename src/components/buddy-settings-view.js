import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddySettingsView extends LitElement {
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
        :host { 
            display: block; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 20px;
        }
        
        .settings-container {
            max-width: 500px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
                0 6px 24px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .settings-title {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 32px;
            color: var(--text-color);
            letter-spacing: -0.5px;
        }
        
        .settings-title::after {
            content: '';
            display: block;
            width: 40px;
            height: 3px;
            background: var(--text-color);
            margin: 12px auto 0;
            border-radius: 2px;
        }
        
        .option-group {
            margin-bottom: 24px;
            width: 100%;
            position: relative;
        }
        
        .option-label {
            display: block;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-color);
            letter-spacing: 0.2px;
        }
        
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            align-items: flex-end;
            width: 100%;
            box-sizing: border-box;
        }
        
        .input-group input {
            flex: 1;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
        }
        
        .provider-help-text {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.7;
            margin-top: 8px;
            font-style: normal;
            line-height: 1.4;
        }
        
        .description {
            font-size: 14px;
            color: var(--text-color);
            opacity: 0.8;
            margin-top: 12px;
            line-height: 1.5;
        }
        
        .api-help {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.7;
            text-align: center;
            line-height: 1.4;
        }
        
        select, input[type="password"] {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-color);
            border: 2px solid rgba(255, 255, 255, 0.1);
            padding: 14px 16px;
            width: 100%;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
                0 4px 12px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        select {
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%);
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 18px;
            padding-right: 48px;
            cursor: pointer;
        }
        
        select:hover {
            border-color: #666666;
            transform: translateY(-1px);
            box-shadow: 
                0 8px 24px #333333,
                inset 0 1px 0 #444444;
            background: linear-gradient(135deg, #444444 0%, #333333 100%);
        }
        
        select:focus {
            outline: none;
            border-color: var(--text-color);
            box-shadow: 
                0 0 0 4px rgba(255, 255, 255, 0.2),
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
            background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 100%);
        }
        
        select option {
            background: rgba(30, 30, 30, 0.95);
            color: var(--text-color);
            padding: 12px 16px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        select option:hover,
        select option:checked,
        select option:focus {
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%);
            color: var(--text-color);
        }
        
        input[type="password"]:hover {
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%);
        }
        
        input[type="password"]:focus {
            outline: none;
            border-color: var(--text-color);
            box-shadow: 
                0 0 0 4px rgba(255, 255, 255, 0.2),
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
            background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 100%);
        }
        
        input::placeholder {
            color: var(--placeholder-color);
            opacity: 0.6;
        }
        
        .button {
            background: var(--text-color);
            color: var(--main-content-background);
            border: none;
            padding: 14px 18px;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.3),
                0 4px 12px rgba(0, 0, 0, 0.1);
            letter-spacing: 0.3px;
            white-space: nowrap;
            min-width: 80px;
            flex-shrink: 0;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 12px 32px rgba(0, 0, 0, 0.4),
                0 8px 16px rgba(0, 0, 0, 0.15);
        }
        
        .button:active {
            transform: translateY(0);
            box-shadow: 
                0 4px 16px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .save-button {
            background: var(--text-color);
            width: 100%;
            margin-top: 20px;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.3),
                0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .save-button:hover {
            box-shadow: 
                0 12px 32px rgba(0, 0, 0, 0.4),
                0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .link-button {
            background: transparent;
            color: var(--text-color);
            border: none;
            padding: 0;
            font-size: inherit;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 600;
            position: relative;
        }

        .link-button::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--text-color);
            transition: width 0.3s ease;
        }

        .link-button:hover {
            color: var(--text-color);
            transform: none;
            box-shadow: none;
        }
        
        .link-button:hover::after {
            width: 100%;
        }

        .env-status {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-color);
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .env-status.warning {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
        }
        
        .env-status.success {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            color: var(--text-color);
        }

        .env-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: currentColor;
            position: relative;
            flex-shrink: 0;
        }
        
        .env-icon::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 4px;
            height: 4px;
            background: currentColor;
            border-radius: 50%;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            margin: 24px 0;
            border-radius: 1px;
        }
        
        @media (max-width: 640px) {
            .settings-container {
                padding: 20px;
                margin: 0 16px;
            }
            
            .settings-title {
                font-size: 20px;
                margin-bottom: 24px;
            }
            
            .input-group {
                flex-direction: column;
                gap: 12px;
            }
            
            .button {
                width: 100%;
                min-width: auto;
            }
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
            <div class="settings-container">
                <div class="settings-title">AI Settings</div>
                
                <div class="option-group">
                    <label class="option-label">AI Provider</label>
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
                    <label class="option-label">Model</label>
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
                
                ${this.hasEnvironmentKey ? html`
                    <div class="env-status success">
                        <div class="env-icon"></div>
                        <span>Environment key detected for ${currentProvider.name}</span>
                    </div>
                ` : html`
                    <div class="env-status warning">
                        <div class="env-icon"></div>
                        <span>Set ${this._getEnvironmentKeyName(this.selectedProvider)} or enter manually</span>
                    </div>
                `}
                
                <div class="option-group">
                    <label class="option-label">API Key</label>
                    <input
                        type="password"
                        placeholder="${this.hasEnvironmentKey ? 'Override environment key (optional)' : `Enter ${currentProvider.keyLabel || 'API Key'}`}"
                        .value=${this.apiKey || ''}
                        @input=${this._onApiKeyInput}
                    />
                    <div class="api-help">
                        ${this.hasEnvironmentKey ? 
                            'Settings will be applied to current session' :
                            html`Need a key? <button class="link-button" @click=${() => this._openExternalLink(this._getProviderSignupUrl(this.selectedProvider))}>Get ${currentProvider.name} API Key</button>`
                        }
                    </div>
                </div>
                
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
        `;
    }
}

customElements.define('buddy-settings-view', BuddySettingsView); 