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

    render() {
        const profiles = [
            {
                value: 'general',
                name: 'General Assistant',
                description: 'Ask anything - general knowledge, problem solving, creative tasks, and more',
            },
            
            // {
            //     value: 'sales',
            //     name: 'Sales Call', 
            //     description: 'Assist with sales conversations and objection handling',
            // },
            // {
            //     value: 'meeting',
            //     name: 'Business Meeting',
            //     description: 'Support for professional meetings and discussions',
            // },
            // {
            //     value: 'presentation',
            //     name: 'Presentation',
            //     description: 'Help with presentations and public speaking',
            // },
            // {
            //     value: 'negotiation',
            //     name: 'Negotiation',
            //     description: 'Guidance for business negotiations and deals',
            // },
            {
                value: 'teacher',
                name: 'JEE Advanced Teacher',
                description: 'Educational explanations and teaching for JEE Advanced topics',
            },
            {
                value: 'math_teacher',
                name: 'Math Teacher',
                description: 'Comprehensive mathematics instruction with step-by-step solutions',
            },
            {
                value: 'physics_teacher',
                name: 'Physics Teacher',
                description: 'Physics concepts with real-world applications and mathematical approach',
            },
            {
                value: 'chemistry_teacher',
                name: 'Chemistry Teacher',
                description: 'Chemistry instruction with molecular understanding and safety notes',
            },
            {
                value: 'advanced_math_teacher',
                name: 'Advanced Math Teacher',
                description: 'Advanced mathematics with modular DSPy reasoning and multi-step problem solving',
            },
            {
                value: 'advanced_physics_teacher',
                name: 'Advanced Physics Teacher',
                description: 'Advanced physics with experimental design, unit conversion, and error analysis',
            },
            {
                value: 'advanced_chemistry_teacher',
                name: 'Advanced Chemistry Teacher',
                description: 'Advanced chemistry with stoichiometry, pH analysis, and thermodynamics',
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
            math_teacher: 'Math Teacher',
            physics_teacher: 'Physics Teacher',
            chemistry_teacher: 'Chemistry Teacher',
            advanced_math_teacher: 'Advanced Math Teacher',
            advanced_physics_teacher: 'Advanced Physics Teacher',
            advanced_chemistry_teacher: 'Advanced Chemistry Teacher',
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