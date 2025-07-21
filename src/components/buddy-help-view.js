import { html, LitElement } from '../lit-core-2.7.4.min.js';
import { helpStyles } from './ui/help-css.js';

class BuddyHelpView extends LitElement {
    static properties = {
        isMacOS: { type: Boolean },
        isLinux: { type: Boolean },
        currentVersion: { type: String },
        updateStatus: { type: String },
        updateInfo: { type: Object },
    };

    static styles = [helpStyles];

    constructor() {
        super();
        this.currentVersion = '';
        this.updateStatus = '';
        this.updateInfo = null;
        this.getCurrentVersion();
        this.setupIpcListeners();
    }

    setupIpcListeners() {
        const { ipcRenderer } = require('electron');

        ipcRenderer.on('update-checking-for-update', () => {
            this.updateStatus = 'checking';
            this.requestUpdate();
        });

        ipcRenderer.on('update-update-available', (event, data) => {
            this.updateStatus = 'available';
            this.updateInfo = data;
            this.requestUpdate();
        });

        ipcRenderer.on('update-update-not-available', () => {
            this.updateStatus = 'not-available';
            this.requestUpdate();
        });

        ipcRenderer.on('update-error', (event, data) => {
            this.updateStatus = 'error';
            this.updateInfo = data;
            this.requestUpdate();
        });
    }

    async getCurrentVersion() {
        const { ipcRenderer } = require('electron');
        try {
            this.currentVersion = await ipcRenderer.invoke('get-app-version');
            this.requestUpdate();
        } catch (error) {
            console.error('Error getting app version:', error);
        }
    }

    async checkForUpdates() {
        const { ipcRenderer } = require('electron');
        try {
            this.updateStatus = 'checking';
            this.requestUpdate();
            const result = await ipcRenderer.invoke('check-for-updates');
            if (!result.success) {
                this.updateStatus = 'error';
                this.updateInfo = { error: result.error };
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
            this.updateStatus = 'error';
            this.updateInfo = { error: error.message };
            this.requestUpdate();
        }
    }

    closeWindow() {
        const { ipcRenderer } = require('electron');
        ipcRenderer.invoke('close-help-window');
    }

    render() {
        // Platform detection fallback (if not passed as prop)
        const isMacOS = this.isMacOS ?? navigator.platform.toLowerCase().includes('mac');
        const isLinux = this.isLinux ?? navigator.platform.toLowerCase().includes('linux');

        const shortcuts = [
            {
                label: 'Move window up',
                keys: [isMacOS ? 'Option' : 'Ctrl', '↑'],
            },
            {
                label: 'Move window down',
                keys: [isMacOS ? 'Option' : 'Ctrl', '↓'],
            },
            {
                label: 'Move window left',
                keys: [isMacOS ? 'Option' : 'Ctrl', '←'],
            },
            {
                label: 'Move window right',
                keys: [isMacOS ? 'Option' : 'Ctrl', '→'],
            },
            {
                label: 'Toggle mouse events',
                keys: [isMacOS ? 'Cmd' : 'Ctrl', 'M'],
            },
            {
                label: 'Close window',
                keys: [isMacOS ? 'Cmd' : 'Ctrl', '\\'],
            },
            {
                label: 'Send message',
                keys: ['Enter'],
            },
            {
                label: 'New line',
                keys: ['Shift', 'Enter'],
            },
            {
                label: 'Screen analysis',
                keys: ['Alt', 'A'],
            },
        ];

        const profiles = [
            { name: 'General Assistant', desc: 'Ask anything - general knowledge, problem solving, creative tasks' },
            { name: 'Math Teacher', desc: 'Comprehensive mathematics instruction with step-by-step solutions' },
            { name: 'Physics Teacher', desc: 'Physics concepts with real-world applications and mathematical approach' },
            { name: 'Chemistry Teacher', desc: 'Chemistry instruction with molecular understanding and safety notes' },
            { name: 'Advanced Math Teacher', desc: 'Advanced mathematics with multi-step problem solving' },
            { name: 'Advanced Physics Teacher', desc: 'Advanced physics with experimental design, unit conversion, and error analysis' },
            { name: 'Advanced Chemistry Teacher', desc: 'Advanced chemistry with stoichiometry, pH analysis, and thermodynamics' },
            { name: 'JEE Advanced Teacher', desc: 'Educational explanations and teaching for JEE Advanced topics' },
        ];

        return html`
            <div class="help-container">
                <div class="help-header">
                    <h1 class="help-title">Keyboard shortcuts</h1>
                    <button class="close-btn" @click=${this.closeWindow}>×</button>
                </div>

                <div class="section">
                    <div class="section-title">Keyboard Shortcuts</div>
                    <div class="shortcuts-grid">
                        ${shortcuts.map(
                            shortcut => html`
                                <div class="shortcut-item">
                                    <span class="shortcut-label">${shortcut.label}</span>
                                    <div class="shortcut-keys">
                                        ${shortcut.keys.map(
                                            (key, index) => html`
                                                ${index > 0 ? html`<span class="key-separator">+</span>` : ''}
                                                <span class="key">${key}</span>
                                            `
                                        )}
                                    </div>
                                </div>
                            `
                        )}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">How to Use</div>
                    <div class="description">
                        <strong>1. Start a Session:</strong> Enter your API key and click "Start Session"<br />
                        <strong>2. Customize:</strong> Choose your profile and language in the settings<br />
                        <strong>3. Position Window:</strong> Use keyboard shortcuts to move the window to your desired location<br />
                        <strong>4. Click-through Mode:</strong> Use <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> +
                        <span class="key">M</span> to make the window click-through<br />
                        <strong>5. Get AI Help:</strong> The AI will analyze your screen and audio to provide assistance<br />
                        <strong>6. Text Messages:</strong> Type questions or requests to the AI using the text input
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Supported Profiles</div>
                    <div class="profile-list">
                        ${profiles.map(
                            profile => html`
                                <div class="profile-item">
                                    <div class="profile-name">${profile.name}</div>
                                    <div class="profile-desc">${profile.desc}</div>
                                </div>
                            `
                        )}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Audio Input</div>
                    <div class="description">
                        ${isMacOS
                            ? html`<strong>macOS:</strong> Uses SystemAudioDump for system audio capture`
                            : isLinux
                            ? html`<strong>Linux:</strong> Uses microphone input`
                            : html`<strong>Windows:</strong> Uses loopback audio capture`}
                        <div class="platform-info">${isMacOS ? '🍎 macOS' : isLinux ? '🐧 Linux' : '🪟 Windows'}</div>
                    </div>
                    <div class="description">The AI listens to conversations and provides contextual assistance based on what it hears.</div>
                </div>

                <div class="update-section">
                    <div class="section-title">App Updates</div>
                    <div class="version-info">Current Version: ${this.currentVersion || 'Loading...'}</div>
                    <button class="update-button" @click=${this.checkForUpdates} ?disabled=${this.updateStatus === 'checking'}>
                        ${this.updateStatus === 'checking' ? 'Checking...' : 'Check for Updates'}
                    </button>
                    ${this.updateStatus
                        ? html`
                              <div class="update-status ${this.updateStatus}">
                                  ${this.updateStatus === 'checking' ? 'Checking for updates...' : ''}
                                  ${this.updateStatus === 'available' ? `Update available: ${this.updateInfo?.version}` : ''}
                                  ${this.updateStatus === 'not-available' ? 'No updates available' : ''}
                                  ${this.updateStatus === 'error' ? `Error: ${this.updateInfo?.error || 'Unknown error'}` : ''}
                              </div>
                          `
                        : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-help-view', BuddyHelpView);
