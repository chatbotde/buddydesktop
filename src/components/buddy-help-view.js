import { html, LitElement } from '../lit-core-2.7.4.min.js';
import { helpStyles } from './ui/help-css.js';

class BuddyHelpView extends LitElement {
    static properties = {
        isMacOS: { type: Boolean },
        isLinux: { type: Boolean },
        currentVersion: { type: String },
        updateStatus: { type: String },
        updateInfo: { type: Object },
        shortcutsEnabled: { type: Object },
    };

    static styles = [helpStyles];

    constructor() {
        super();
        this.currentVersion = '';
        this.updateStatus = '';
        this.updateInfo = null;
        this.shortcutsEnabled = this._loadShortcutSettings();
        this.getCurrentVersion();
        this.setupIpcListeners();
    }

    _loadShortcutSettings() {
        try {
            const saved = localStorage.getItem('shortcuts-enabled');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading shortcut settings:', error);
        }
        // Default all shortcuts enabled
        return {
            'window-movement': true,
            'mouse-events': true,
            'window-visibility': true,
            'screen-analysis': true,
            'clear-chat': true,
            'theme-opacity-reset': true,
            'close-application': true
        };
    }

    _saveShortcutSettings() {
        try {
            localStorage.setItem('shortcuts-enabled', JSON.stringify(this.shortcutsEnabled));
        } catch (error) {
            console.error('Error saving shortcut settings:', error);
        }
    }

    _toggleShortcut(shortcutId) {
        this.shortcutsEnabled[shortcutId] = !this.shortcutsEnabled[shortcutId];
        this._saveShortcutSettings();
        
        // Send IPC message to update shortcuts in main process
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('update-shortcut-state', {
            shortcutId,
            enabled: this.shortcutsEnabled[shortcutId]
        });
        
        this.requestUpdate();
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

        // Listen for shortcut state update confirmations
        ipcRenderer.on('shortcut-state-updated', (event, data) => {
            const { shortcutId, enabled, success, error } = data;
            if (success) {
                console.log(`Shortcut ${shortcutId} ${enabled ? 'enabled' : 'disabled'} successfully`);
            } else {
                console.error(`Failed to update shortcut ${shortcutId}:`, error);
                // Revert the UI state if backend update failed
                this.shortcutsEnabled[shortcutId] = !enabled;
                this._saveShortcutSettings();
                this.requestUpdate();
            }
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

        const shortcutGroups = [
            {
                title: 'Window Movement',
                id: 'window-movement',
                shortcuts: [
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
                ]
            },
            {
                title: 'Window Controls',
                id: 'window-visibility',
                shortcuts: [
                    {
                        label: 'Hide/Show window',
                        keys: [isMacOS ? 'Cmd' : 'Ctrl', '\\'],
                    },
                ]
            },
            {
                title: 'Mouse Controls',
                id: 'mouse-events',
                shortcuts: [
                    {
                        label: 'Toggle mouse events',
                        keys: [isMacOS ? 'Cmd' : 'Ctrl', 'M'],
                    },
                ]
            },
            {
                title: 'Screen Analysis',
                id: 'screen-analysis',
                shortcuts: [
                    {
                        label: 'Capture & analyze screen',
                        keys: ['Alt', 'A'],
                    },
                ]
            },
            {
                title: 'Chat Controls',
                id: 'clear-chat',
                shortcuts: [
                    {
                        label: 'Clear chat / New chat',
                        keys: [isMacOS ? 'Cmd' : 'Ctrl', 'K'],
                    },
                ]
            },
            {
                title: 'Theme Controls',
                id: 'theme-opacity-reset',
                shortcuts: [
                    {
                        label: 'Reset theme opacity to 100%',
                        keys: [isMacOS ? 'Cmd' : 'Ctrl', 'Alt', 'T'],
                    },
                ]
            },
            {
                title: 'Application Controls',
                id: 'close-application',
                shortcuts: [
                    {
                        label: 'Close application',
                        keys: [isMacOS ? 'Cmd' : 'Ctrl', 'Alt', 'Q'],
                    },
                ]
            },
        ];

        const inputShortcuts = [
            {
                label: 'Send message',
                keys: ['Enter'],
            },
            {
                label: 'New line in message',
                keys: ['Shift', 'Enter'],
            },
        ];

        return html`
            <div class="help-container">
                <div class="help-header">
                    <h1 class="help-title">Keyboard Shortcuts & Settings</h1>
                    <button class="close-btn" @click=${this.closeWindow}>×</button>
                </div>

                <div class="section">
                    <div class="section-title">Global Shortcuts <span class="section-subtitle">(Toggle to enable/disable)</span></div>
                    ${shortcutGroups.map(
                        group => html`
                            <div class="shortcut-group">
                                <div class="group-header">
                                    <span class="group-title">${group.title}</span>
                                    <button 
                                        class="toggle-btn ${this.shortcutsEnabled[group.id] ? 'enabled' : 'disabled'}" 
                                        @click=${() => this._toggleShortcut(group.id)}
                                        title="${this.shortcutsEnabled[group.id] ? 'Click to disable' : 'Click to enable'}"
                                    >
                                        ${this.shortcutsEnabled[group.id] ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                <div class="shortcuts-list ${this.shortcutsEnabled[group.id] ? 'enabled' : 'disabled'}">
                                    ${group.shortcuts.map(
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
                        `
                    )}
                </div>

                <div class="section">
                    <div class="section-title">Input Shortcuts <span class="section-subtitle">(Always active)</span></div>
                    <div class="shortcuts-list enabled">
                        ${inputShortcuts.map(
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
