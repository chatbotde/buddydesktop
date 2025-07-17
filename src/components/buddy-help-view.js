import { html,  LitElement } from '../lit-core-2.7.4.min.js';
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

    render() {
        // Platform detection fallback (if not passed as prop)
        const isMacOS = this.isMacOS ?? navigator.platform.toLowerCase().includes('mac');
        const isLinux = this.isLinux ?? navigator.platform.toLowerCase().includes('linux');
        return html`
            <div>
                <div class="option-group">
                    <span class="option-label">Community & Support</span>
                </div>

                <div class="option-group">
                    <span class="option-label">Keyboard Shortcuts</span>
                    <div class="description">
                        <strong>Window Movement:</strong><br />
                        <span class="key">${isMacOS ? 'Option' : 'Ctrl'}</span> + Arrow Keys - Move the window in 45px increments<br /><br />

                        <strong>Window Control:</strong><br />
                        <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> + <span class="key">M</span> - Toggle mouse events (click-through
                        mode)<br />
                        <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> + <span class="key">&bsol;</span> - Close window or go back<br /><br />

                        <strong>Text Input:</strong><br />
                        <span class="key">Enter</span> - Send text message to AI<br />
                        <span class="key">Shift</span> + <span class="key">Enter</span> - New line in text input
                        <span class="key">Ctrl</span> + <span class="key">Alt</span> + <span class="key">N</span> - Direct send message
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">How to Use</span>
                    <div class="description">
                        1. <strong>Start a Session:</strong> Enter your Gemini API key and click "Start Session"<br />
                        2. <strong>Customize:</strong> Choose your profile and language in the settings<br />
                        3. <strong>Position Window:</strong> Use keyboard shortcuts to move the window to your desired location<br />
                        4. <strong>Click-through Mode:</strong> Use <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> +
                        <span class="key">M</span> to make the window click-through<br />
                        5. <strong>Get AI Help:</strong> The AI will analyze your screen and audio to provide assistance<br />
                        6. <strong>Text Messages:</strong> Type questions or requests to the AI using the text input
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Supported Profiles</span>
                    <div class="description">
                        <strong>General Assistant:</strong> Ask anything - general knowledge, problem solving, creative tasks<br />
                       
                        <strong>Math Teacher:</strong> Comprehensive mathematics instruction with step-by-step solutions<br />
                        <strong>Physics Teacher:</strong> Physics concepts with real-world applications and mathematical approach<br />
                        <strong>Chemistry Teacher:</strong> Chemistry instruction with molecular understanding and safety notes<br />
                        <strong>Advanced Math Teacher:</strong> Advanced mathematics with multi-step problem solving<br />
                        <strong>Advanced Physics Teacher:</strong> Advanced physics with experimental design, unit conversion, and error analysis<br />
                        <strong>Advanced Chemistry Teacher:</strong> Advanced chemistry with stoichiometry, pH analysis, and thermodynamics<br />
                        <strong>JEE Advanced Teacher:</strong> Educational explanations and teaching for JEE Advanced topics
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Audio Input</span>
                    <div class="description">
                        ${isMacOS 
                            ? html`<strong>macOS:</strong> Uses SystemAudioDump for system audio capture`
                            : isLinux
                              ? html`<strong>Linux:</strong> Uses microphone input`
                              : html`<strong>Windows:</strong> Uses loopback audio capture`}<br />
                        The AI listens to conversations and provides contextual assistance based on what it hears.
                    </div>
                </div>

                <div class="update-section">
                    <span class="option-label">App Updates</span>
                    <div class="version-info">
                        Current Version: ${this.currentVersion || 'Loading...'}
                    </div>
                    <button class="update-button" @click=${this.checkForUpdates} ?disabled=${this.updateStatus === 'checking'}>
                        ${this.updateStatus === 'checking' ? 'Checking...' : 'Check for Updates'}
                    </button>
                    ${this.updateStatus ? html`
                        <div class="update-status ${this.updateStatus}">
                            ${this.updateStatus === 'checking' ? 'Checking for updates...' : ''}
                            ${this.updateStatus === 'available' ? `Update available: ${this.updateInfo?.version}` : ''}
                            ${this.updateStatus === 'not-available' ? 'No updates available' : ''}
                            ${this.updateStatus === 'error' ? `Error: ${this.updateInfo?.error || 'Unknown error'}` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-help-view', BuddyHelpView); 