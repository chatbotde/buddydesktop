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
