import { html, LitElement } from '../lit-core-2.7.4.min.js';
import { customizeStyles } from './ui/customize-css.js';

class BuddyCustomizeView extends LitElement {
    static properties = {
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        customProfiles: { type: Array },
        isCreatingProfile: { type: Boolean },
        newProfileName: { type: String },
        newProfileDescription: { type: String },
        newProfilePrompt: { type: String },
        validationErrors: { type: Object },
        isLoading: { type: Boolean },
    };

    constructor() {
        super();
        this.validationErrors = {};
        this.isLoading = false;
    }

    static styles = [customizeStyles];

    _onProfileSelect(e) {
        this.dispatchEvent(new CustomEvent('profile-select', { detail: { profile: e.target.value }, bubbles: true, composed: true }));
    }
    _onLanguageSelect(e) {
        this.dispatchEvent(new CustomEvent('language-select', { detail: { language: e.target.value }, bubbles: true, composed: true }));
    }
    _onBackToHistory() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'history' }, bubbles: true, composed: true }));
    }

    _onCreateProfile() {
        this.isCreatingProfile = true;
        this.newProfileName = '';
        this.newProfileDescription = '';
        this.newProfilePrompt = '';
        this.validationErrors = {};
        this.requestUpdate();
    }

    _onCancelCreateProfile() {
        this.isCreatingProfile = false;
        this.validationErrors = {};
        this.requestUpdate();
    }

    _validateProfileData() {
        const errors = {};

        // Validate profile name
        if (!this.newProfileName?.trim()) {
            errors.name = 'Profile name is required';
        } else if (this.newProfileName.trim().length < 2) {
            errors.name = 'Profile name must be at least 2 characters';
        } else if (this.newProfileName.trim().length > 50) {
            errors.name = 'Profile name must be less than 50 characters';
        } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(this.newProfileName.trim())) {
            errors.name = 'Profile name can only contain letters, numbers, spaces, hyphens, and underscores';
        }

        // Check for duplicate names
        const profileValue = this.newProfileName.toLowerCase().replace(/\s+/g, '_');
        const allProfiles = [{ value: 'default', name: 'Default Assistant' }, ...(this.customProfiles || [])];

        if (allProfiles.some(p => p.value === profileValue)) {
            errors.name = 'A profile with this name already exists';
        }

        // Validate description
        if (this.newProfileDescription?.trim() && this.newProfileDescription.trim().length > 200) {
            errors.description = 'Description must be less than 200 characters';
        }

        // Validate system prompt
        if (!this.newProfilePrompt?.trim()) {
            errors.prompt = 'System prompt is required';
        } else if (this.newProfilePrompt.trim().length < 10) {
            errors.prompt = 'System prompt must be at least 10 characters';
        } else if (this.newProfilePrompt.trim().length > 2000) {
            errors.prompt = 'System prompt must be less than 2000 characters';
        }

        return errors;
    }

    _onSaveProfile() {
        this.isLoading = true;
        this.validationErrors = this._validateProfileData();

        if (Object.keys(this.validationErrors).length > 0) {
            this.isLoading = false;
            this.requestUpdate();
            return;
        }

        try {
            const newProfile = {
                value: this.newProfileName.toLowerCase().replace(/\s+/g, '_'),
                name: this.newProfileName.trim(),
                description: this.newProfileDescription?.trim() || '',
                prompt: this.newProfilePrompt.trim(),
                isCustom: true,
                createdAt: new Date().toISOString(),
            };

            this.dispatchEvent(
                new CustomEvent('create-profile', {
                    detail: { profile: newProfile },
                    bubbles: true,
                    composed: true,
                })
            );

            // Reset form
            this.isCreatingProfile = false;
            this.newProfileName = '';
            this.newProfileDescription = '';
            this.newProfilePrompt = '';
            this.validationErrors = {};

            // Show success feedback
            this._showSuccessMessage('Profile created successfully!');
        } catch (error) {
            console.error('Error creating profile:', error);
            this.validationErrors.general = 'Failed to create profile. Please try again.';
        } finally {
            this.isLoading = false;
            this.requestUpdate();
        }
    }

    _onDeleteProfile(profileValue) {
        if (!confirm('Are you sure you want to delete this custom profile? This action cannot be undone.')) {
            return;
        }

        try {
            this.dispatchEvent(
                new CustomEvent('delete-profile', {
                    detail: { profileValue },
                    bubbles: true,
                    composed: true,
                })
            );

            this._showSuccessMessage('Profile deleted successfully!');
        } catch (error) {
            console.error('Error deleting profile:', error);
            this._showErrorMessage('Failed to delete profile. Please try again.');
        }
    }

    _showSuccessMessage(message) {
        // Simple success feedback - you could enhance this with a toast system
        console.log('✅', message);
    }

    _showErrorMessage(message) {
        // Simple error feedback - you could enhance this with a toast system
        console.error('❌', message);
    }

    render() {
        // Only keep default profile, add custom profiles from props
        const baseProfiles = [
            {
                value: 'default',
                name: 'Default Assistant',
                description: 'General-purpose assistant for problem-solving and analysis',
                isCustom: false,
            },
        ];

        const allProfiles = [...baseProfiles, ...(this.customProfiles || [])];

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

        const selectedProfileData = allProfiles.find(p => p.value === this.selectedProfile);

        return html`
            <div class="main-view-container">
                <div class="option-group ${selectedProfileData ? 'active-profile' : ''}">
                    <div class="profile-header">
                        <label class="option-label">Assistant Profiles</label>
                        <button class="button secondary" @click=${this._onCreateProfile}>+ Create New Profile</button>
                    </div>

                    <div class="profile-selector ${selectedProfileData ? 'selected' : ''}">
                        <select .value=${this.selectedProfile} @change=${this._onProfileSelect}>
                            ${allProfiles.map(
                                profile => html`
                                    <option value=${profile.value} ?selected=${this.selectedProfile === profile.value}>
                                        ${profile.name}${profile.isCustom ? ' (Custom)' : ''}
                                    </option>
                                `
                            )}
                        </select>
                        ${selectedProfileData ? html` <div class="selected-profile-indicator">✓</div> ` : ''}
                    </div>

                    ${selectedProfileData
                        ? html`
                              <div class="profile-status">
                                  <div class="profile-status-icon">${selectedProfileData.isCustom ? 'C' : 'D'}</div>
                                  <span>
                                      Currently using: <strong>${selectedProfileData.name}</strong>
                                      ${selectedProfileData.isCustom ? html`<span class="custom-profile-badge">Custom</span>` : ''}
                                  </span>
                              </div>
                          `
                        : ''}

                    <div class="description">${selectedProfileData?.description || ''}</div>

                    ${selectedProfileData?.isCustom
                        ? html`
                              <button class="button danger small" @click=${() => this._onDeleteProfile(selectedProfileData.value)}>
                                  🗑️ Delete Custom Profile
                              </button>
                          `
                        : ''}
                </div>

                ${this.isCreatingProfile
                    ? html`
                          <div class="option-group create-profile-form">
                              <h3>✨ Create New Profile</h3>

                              ${this.validationErrors.general ? html` <div class="general-error">${this.validationErrors.general}</div> ` : ''}

                              <label class="option-label">Profile Name *</label>
                              <input
                                  type="text"
                                  placeholder="e.g., Code Reviewer, Math Tutor, Creative Writer..."
                                  .value=${this.newProfileName || ''}
                                  class="profile-name-input ${this.validationErrors.name ? 'input-error' : ''}"
                                  maxlength="50"
                                  @input=${e => {
                                      this.newProfileName = e.target.value;
                                      // Clear error when user starts typing
                                      if (this.validationErrors.name) {
                                          delete this.validationErrors.name;
                                          this.requestUpdate();
                                      }
                                  }}
                              />
                              ${this.validationErrors.name ? html` <div class="error-message">${this.validationErrors.name}</div> ` : ''}
                              <div
                                  class="character-counter ${(this.newProfileName?.length || 0) > 40 ? 'warning' : ''} ${(this.newProfileName
                                      ?.length || 0) > 50
                                      ? 'error'
                                      : ''}"
                              >
                                  ${this.newProfileName?.length || 0}/50 characters
                              </div>

                              <label class="option-label">Description</label>
                              <input
                                  type="text"
                                  placeholder="Brief description of what this profile does..."
                                  .value=${this.newProfileDescription || ''}
                                  class="profile-description-input ${this.validationErrors.description ? 'input-error' : ''}"
                                  maxlength="200"
                                  @input=${e => {
                                      this.newProfileDescription = e.target.value;
                                      if (this.validationErrors.description) {
                                          delete this.validationErrors.description;
                                          this.requestUpdate();
                                      }
                                  }}
                              />
                              ${this.validationErrors.description
                                  ? html` <div class="error-message">${this.validationErrors.description}</div> `
                                  : ''}
                              <div
                                  class="character-counter ${(this.newProfileDescription?.length || 0) > 160 ? 'warning' : ''} ${(this
                                      .newProfileDescription?.length || 0) > 200
                                      ? 'error'
                                      : ''}"
                              >
                                  ${this.newProfileDescription?.length || 0}/200 characters
                              </div>

                              <label class="option-label">System Prompt *</label>
                              <textarea
                                  placeholder="Define how the AI should behave in this role. Be specific about the assistant's expertise, tone, and approach. For example: 'You are an expert code reviewer who focuses on security, performance, and best practices...'"
                                  .value=${this.newProfilePrompt || ''}
                                  class="profile-prompt-textarea ${this.validationErrors.prompt ? 'input-error' : ''}"
                                  rows="6"
                                  maxlength="2000"
                                  @input=${e => {
                                      this.newProfilePrompt = e.target.value;
                                      if (this.validationErrors.prompt) {
                                          delete this.validationErrors.prompt;
                                          this.requestUpdate();
                                      }
                                  }}
                              ></textarea>
                              ${this.validationErrors.prompt ? html` <div class="error-message">${this.validationErrors.prompt}</div> ` : ''}
                              <div
                                  class="character-counter ${(this.newProfilePrompt?.length || 0) > 1600 ? 'warning' : ''} ${(this.newProfilePrompt
                                      ?.length || 0) > 2000
                                      ? 'error'
                                      : ''}"
                              >
                                  ${this.newProfilePrompt?.length || 0}/2000 characters
                              </div>

                              <div class="button-group">
                                  <button class="button ${this.isLoading ? 'loading' : ''}" @click=${this._onSaveProfile} ?disabled=${this.isLoading}>
                                      ${this.isLoading ? 'Creating...' : '💾 Save Profile'}
                                  </button>
                                  <button class="button secondary" @click=${this._onCancelCreateProfile} ?disabled=${this.isLoading}>
                                      ❌ Cancel
                                  </button>
                              </div>

                              <div class="description">
                                  <strong>💡 Tips:</strong> Create specialized profiles for different tasks like code review, creative writing,
                                  technical documentation, or tutoring. The more specific your system prompt, the better the AI will perform in that
                                  role.
                              </div>
                          </div>
                      `
                    : ''}
                <!--
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
                -->
            </div>
        `;
    }
}

customElements.define('buddy-customize-view', BuddyCustomizeView);
