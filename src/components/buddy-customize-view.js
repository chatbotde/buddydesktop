import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyCustomizeView extends LitElement {
    static properties = {
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        customPrompt: { type: String },
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
        .description {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.7;
            margin-top: 8px;
            line-height: 1.4;
        }
        select {
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-color: var(--input-background);
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            padding: 10px 40px 10px 14px;
            color: var(--text-color);
            border: var(--glass-border);
            border-radius: 12px;
            font-size: 14px;
            width: 100%;
            margin-bottom: 0;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
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
        .custom-prompt-textarea {
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
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
        .custom-prompt-textarea:focus {
            outline: none;
            border-color: var(--input-border);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
            background: oklch(48.8% 0.243 264.376);
            transform: translateY(-1px);
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
            margin-bottom: 24px;
            align-self: flex-start;
        }
        .button:hover {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
    `;

    _onProfileSelect(e) {
        this.dispatchEvent(new CustomEvent('profile-select', { detail: { profile: e.target.value }, bubbles: true, composed: true }));
    }
    _onLanguageSelect(e) {
        this.dispatchEvent(new CustomEvent('language-select', { detail: { language: e.target.value }, bubbles: true, composed: true }));
    }
    _onPromptInput(e) {
        this.dispatchEvent(new CustomEvent('custom-prompt-input', { detail: { prompt: e.target.value }, bubbles: true, composed: true }));
    }
    _onBackToHistory() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'history' }, bubbles: true, composed: true }));
    }

    render() {
        const profiles = [
            {
                value: 'general',
                name: 'General Assistant',
                description: 'Ask anything - general knowledge, problem solving, creative tasks, and more',
            },
            {
                value: 'interview',
                name: 'Job Interview',
                description: 'Get help with answering interview questions',
            },
            {
                value: 'sales',
                name: 'Sales Call',
                description: 'Assist with sales conversations and objection handling',
            },
            {
                value: 'meeting',
                name: 'Business Meeting',
                description: 'Support for professional meetings and discussions',
            },
            {
                value: 'presentation',
                name: 'Presentation',
                description: 'Help with presentations and public speaking',
            },
            {
                value: 'negotiation',
                name: 'Negotiation',
                description: 'Guidance for business negotiations and deals',
            },
            {
                value: 'teacher',
                name: 'JEE Advanced Teacher',
                description: 'Educational explanations and teaching for JEE Advanced topics',
            },
        ];

        const languages = [
            { value: 'en-US', name: 'English (US)' },
            { value: 'en-GB', name: 'English (UK)' },
            { value: 'en-AU', name: 'English (Australia)' },
            { value: 'en-IN', name: 'English (India)' },
            { value: 'de-DE', name: 'German (Germany)' },
            { value: 'es-US', name: 'Spanish (United States)' },
            { value: 'es-ES', name: 'Spanish (Spain)' },
            { value: 'fr-FR', name: 'French (France)' },
            { value: 'fr-CA', name: 'French (Canada)' },
            { value: 'hi-IN', name: 'Hindi (India)' },
            { value: 'pt-BR', name: 'Portuguese (Brazil)' },
            { value: 'ar-XA', name: 'Arabic (Generic)' },
            { value: 'id-ID', name: 'Indonesian (Indonesia)' },
            { value: 'it-IT', name: 'Italian (Italy)' },
            { value: 'ja-JP', name: 'Japanese (Japan)' },
            { value: 'tr-TR', name: 'Turkish (Turkey)' },
            { value: 'vi-VN', name: 'Vietnamese (Vietnam)' },
            { value: 'bn-IN', name: 'Bengali (India)' },
            { value: 'gu-IN', name: 'Gujarati (India)' },
            { value: 'kn-IN', name: 'Kannada (India)' },
            { value: 'ml-IN', name: 'Malayalam (India)' },
            { value: 'mr-IN', name: 'Marathi (India)' },
            { value: 'ta-IN', name: 'Tamil (India)' },
            { value: 'te-IN', name: 'Telugu (India)' },
            { value: 'nl-NL', name: 'Dutch (Netherlands)' },
            { value: 'ko-KR', name: 'Korean (South Korea)' },
            { value: 'cmn-CN', name: 'Mandarin Chinese (China)' },
            { value: 'pl-PL', name: 'Polish (Poland)' },
            { value: 'ru-RU', name: 'Russian (Russia)' },
            { value: 'th-TH', name: 'Thai (Thailand)' },
        ];

        const profileNames = {
            general: 'General Assistant',
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            teacher: 'JEE Advanced Teacher',
        };

        return html`
            <div class="main-view-container">
                <button class="button" @click=${this._onBackToHistory}>Back to History</button>
                <div class="option-group">
                    <label class="option-label">Select Profile</label>
                    <select .value=${this.selectedProfile} @change=${this._onProfileSelect}>
                        ${profiles.map(
                            profile => html`
                                <option value=${profile.value} ?selected=${this.selectedProfile === profile.value}>${profile.name}</option>
                            `
                        )}
                    </select>
                    <div class="description">${profiles.find(p => p.value === this.selectedProfile)?.description || ''}</div>
                </div>

                <div class="option-group">
                    <label class="option-label">Select Language</label>
                    <select .value=${this.selectedLanguage} @change=${this._onLanguageSelect}>
                        ${languages.map(
                            language => html`
                                <option value=${language.value} ?selected=${this.selectedLanguage === language.value}>${language.name}</option>
                            `
                        )}
                    </select>
                    <div class="description">Choose the language for speech recognition and AI responses.</div>
                </div>

                <div class="option-group">
                    <label class="option-label">Custom AI Prompt</label>
                    <textarea
                        placeholder="Describe how you want the AI to behave..."
                        .value=${this.customPrompt || ''}
                        class="custom-prompt-textarea"
                        rows="4"
                        @input=${this._onPromptInput}
                    ></textarea>
                    <div class="description">
                        This custom prompt will be added to the ${profileNames[this.selectedProfile] || 'selected profile'} instructions to
                        personalize the AI's behavior.
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-customize-view', BuddyCustomizeView); 