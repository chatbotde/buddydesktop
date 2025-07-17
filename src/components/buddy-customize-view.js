import { html, LitElement } from '../lit-core-2.7.4.min.js';
import { customizeStyles } from './ui/customize-css.js';

class BuddyCustomizeView extends LitElement {
    static properties = {
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        customPrompt: { type: String },
    };

    static styles = [customizeStyles];

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
    _onOpenPromptManager() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'prompt-manager' }, bubbles: true, composed: true }));
    }

    render() {
        const profiles = [
            {
                value: 'default',
                name: 'Default Assistant',
                description: 'General-purpose assistant for problem-solving and analysis',
            },
            {
                value: 'general',
                name: 'General Assistant',
                description: 'Helpful AI assistant for various tasks',
            },
            {
                value: 'interview',
                name: 'Job Interview',
                description: 'Job interview preparation and practice',
            },
            {
                value: 'sales',
                name: 'Sales Assistant',
                description: 'Sales conversations and objection handling',
            },
            {
                value: 'meeting',
                name: 'Meeting Assistant',
                description: 'Business meeting assistance and facilitation',
            },
            {
                value: 'math_teacher',
                name: 'Math Teacher',
                description: 'Mathematics instruction with step-by-step solutions',
            },
            {
                value: 'physics_teacher',
                name: 'Physics Teacher',
                description: 'Physics concepts with real-world applications',
            },
            {
                value: 'chemistry_teacher',
                name: 'Chemistry Teacher',
                description: 'Chemistry instruction with molecular understanding',
            },
            {
                value: 'troubleshooter',
                name: 'Code Troubleshooter',
                description: 'Code debugging and problem resolution',
            },
            {
                value: 'screen_analyzer',
                name: 'Screen Analyzer',
                description: 'Screen content analysis and insights',
            },
            {
                value: 'code_reviewer',
                name: 'Code Reviewer',
                description: 'Code quality analysis and improvement suggestions',
            },
            {
                value: 'technical_writer',
                name: 'Technical Writer',
                description: 'Technical documentation and writing assistance',
            },
            {
                value: 'system_admin',
                name: 'System Admin',
                description: 'System administration and DevOps guidance',
            },
            {
                value: 'data_analyst',
                name: 'Data Analyst',
                description: 'Data analysis and statistical interpretation',
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
            default: 'Default Assistant',
            general: 'General Assistant',
            interview: 'Job Interview',
            sales: 'Sales Assistant',
            meeting: 'Meeting Assistant',
            math_teacher: 'Math Teacher',
            physics_teacher: 'Physics Teacher',
            chemistry_teacher: 'Chemistry Teacher',
            troubleshooter: 'Code Troubleshooter',
            screen_analyzer: 'Screen Analyzer',
            code_reviewer: 'Code Reviewer',
            technical_writer: 'Technical Writer',
            system_admin: 'System Admin',
            data_analyst: 'Data Analyst',
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
                    <button class="button secondary" @click=${this._onOpenPromptManager}>Advanced Prompt Manager</button>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-customize-view', BuddyCustomizeView);
