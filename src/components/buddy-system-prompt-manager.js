import { LitElement, html, css } from '../lit-core-2.7.4.min.js';

class BuddySystemPromptManager extends LitElement {
    static properties = {
        currentProfile: { type: String },
        customPrompt: { type: String },
        showPromptEditor: { type: Boolean },
        availableProfiles: { type: Array },
        systemPromptPreview: { type: String },
    };

    static styles = css`
        :host {
            display: block;
            padding: 20px;
            background: var(--main-content-background);
            color: var(--text-color);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .prompt-manager {
            max-width: 800px;
            margin: 0 auto;
        }

        .section {
            margin-bottom: 24px;
            padding: 16px;
            border: var(--glass-border);
            border-radius: 8px;
            background: var(--input-background);
            backdrop-filter: blur(10px);
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-color);
        }

        .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
        }

        .profile-card {
            padding: 12px;
            border: 2px solid var(--input-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: var(--input-background);
        }

        .profile-card:hover {
            border-color: rgba(0, 122, 255, 0.6);
            background: rgba(255, 255, 255, 0.1);
        }

        .profile-card.selected {
            border-color: rgba(0, 122, 255, 0.8);
            background: var(--user-message-bg);
        }

        .profile-name {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .profile-description {
            font-size: 12px;
            color: var(--placeholder-color);
            line-height: 1.4;
        }

        .custom-prompt-section {
            margin-top: 16px;
        }

        .custom-prompt-textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px;
            border: var(--input-border);
            border-radius: 6px;
            background: var(--input-background);
            color: var(--text-color);
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
        }

        .custom-prompt-textarea:focus {
            outline: none;
            border-color: rgba(0, 122, 255, 0.8);
        }

        .prompt-preview {
            background: var(--code-background);
            border: var(--input-border);
            border-radius: 6px;
            padding: 16px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.5;
            max-height: 300px;
            overflow-y: auto;
            white-space: pre-wrap;
            color: var(--text-color);
        }

        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }

        .button {
            padding: 8px 16px;
            border: var(--button-border);
            border-radius: 6px;
            background: var(--button-background);
            color: var(--text-color);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        .button:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(0, 122, 255, 0.8);
        }

        .button.primary {
            background: rgba(0, 122, 255, 0.8);
            color: white;
            border-color: rgba(0, 122, 255, 0.8);
        }

        .button.primary:hover {
            background: rgba(0, 122, 255, 1);
        }

        .toggle-section {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }

        .toggle {
            position: relative;
            width: 44px;
            height: 24px;
            background: var(--input-border);
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .toggle.active {
            background: rgba(0, 122, 255, 0.8);
        }

        .toggle-handle {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.2s ease;
        }

        .toggle.active .toggle-handle {
            transform: translateX(20px);
        }

        .help-text {
            font-size: 12px;
            color: var(--placeholder-color);
            margin-top: 8px;
            line-height: 1.4;
        }
    `;

    constructor() {
        super();
        this.currentProfile = 'default';
        this.customPrompt = '';
        this.showPromptEditor = false;
        this.availableProfiles = [];
        this.systemPromptPreview = '';
        this.loadProfiles();
    }

    async loadProfiles() {
        try {
            // Import the prompts module to get available profiles
            const { getAllProfiles, getSystemPrompt } = await import('../prompts.js');
            const profiles = getAllProfiles();
            
            this.availableProfiles = profiles.map(profile => ({
                value: profile,
                name: this.formatProfileName(profile),
                description: this.getProfileDescription(profile)
            }));
            
            this.updatePromptPreview();
        } catch (error) {
            console.error('Failed to load profiles:', error);
        }
    }

    formatProfileName(profile) {
        return profile
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getProfileDescription(profile) {
        const descriptions = {
            default: 'General-purpose assistant for problem-solving and analysis',
            general: 'Helpful AI assistant for various tasks',
            interview: 'Job interview preparation and practice',
            sales: 'Sales conversations and objection handling',
            meeting: 'Business meeting assistance and facilitation',
            math_teacher: 'Mathematics instruction with step-by-step solutions',
            physics_teacher: 'Physics concepts with real-world applications',
            chemistry_teacher: 'Chemistry instruction with molecular understanding',
            troubleshooter: 'Code debugging and problem resolution',
            screen_analyzer: 'Screen content analysis and insights',
            code_reviewer: 'Code quality analysis and improvement suggestions',
            technical_writer: 'Technical documentation and writing assistance',
            system_admin: 'System administration and DevOps guidance',
            data_analyst: 'Data analysis and statistical interpretation'
        };
        return descriptions[profile] || 'Specialized AI assistant profile';
    }

    async updatePromptPreview() {
        try {
            const { getSystemPrompt } = await import('../prompts.js');
            this.systemPromptPreview = getSystemPrompt(this.currentProfile, this.customPrompt);
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to update prompt preview:', error);
        }
    }

    _onProfileSelect(profile) {
        this.currentProfile = profile;
        this.updatePromptPreview();
        this.dispatchEvent(new CustomEvent('profile-changed', {
            detail: { profile },
            bubbles: true,
            composed: true
        }));
    }

    _onCustomPromptChange(e) {
        this.customPrompt = e.target.value;
        this.updatePromptPreview();
        this.dispatchEvent(new CustomEvent('custom-prompt-changed', {
            detail: { customPrompt: this.customPrompt },
            bubbles: true,
            composed: true
        }));
    }

    _togglePromptEditor() {
        this.showPromptEditor = !this.showPromptEditor;
    }

    _onSavePrompt() {
        this.dispatchEvent(new CustomEvent('save-prompt', {
            detail: {
                profile: this.currentProfile,
                customPrompt: this.customPrompt
            },
            bubbles: true,
            composed: true
        }));
    }

    _onResetPrompt() {
        this.customPrompt = '';
        this.updatePromptPreview();
        this.dispatchEvent(new CustomEvent('reset-prompt', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="prompt-manager">
                <div class="section">
                    <div class="section-title">System Prompt Profiles</div>
                    <div class="profile-grid">
                        ${this.availableProfiles.map(profile => html`
                            <div 
                                class="profile-card ${this.currentProfile === profile.value ? 'selected' : ''}"
                                @click=${() => this._onProfileSelect(profile.value)}
                            >
                                <div class="profile-name">${profile.name}</div>
                                <div class="profile-description">${profile.description}</div>
                            </div>
                        `)}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Custom Instructions</div>
                    <div class="custom-prompt-section">
                        <textarea
                            class="custom-prompt-textarea"
                            placeholder="Add custom instructions to personalize the AI's behavior..."
                            .value=${this.customPrompt}
                            @input=${this._onCustomPromptChange}
                        ></textarea>
                        <div class="help-text">
                            Custom instructions will be added to the selected profile to personalize the AI's responses.
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="toggle-section">
                        <div class="section-title">System Prompt Preview</div>
                        <div 
                            class="toggle ${this.showPromptEditor ? 'active' : ''}"
                            @click=${this._togglePromptEditor}
                        >
                            <div class="toggle-handle"></div>
                        </div>
                        <span>Show Preview</span>
                    </div>
                    
                    ${this.showPromptEditor ? html`
                        <div class="prompt-preview">${this.systemPromptPreview}</div>
                    ` : ''}
                </div>

                <div class="button-group">
                    <button class="button primary" @click=${this._onSavePrompt}>
                        Apply Changes
                    </button>
                    <button class="button" @click=${this._onResetPrompt}>
                        Reset Custom Prompt
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-system-prompt-manager', BuddySystemPromptManager);