import { LitElement, html, css } from 'lit-core-2.7.4.min.js';

class BuddyUpdateNotification extends LitElement {
    static get properties() {
        return {
            updateStatus: { type: String },
            updateInfo: { type: Object },
            downloadProgress: { type: Number },
            isVisible: { type: Boolean },
            currentVersion: { type: String }
        };
    }

    constructor() {
        super();
        this.updateStatus = '';
        this.updateInfo = null;
        this.downloadProgress = 0;
        this.isVisible = false;
        this.currentVersion = '';
        this.setupIpcListeners();
        this.getCurrentVersion();
    }

    static get styles() {
        return css`
            :host {
                display: block;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .update-notification {
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 20px;
                color: white;
                min-width: 300px;
                max-width: 400px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transform: translateX(100%);
                transition: transform 0.3s ease-in-out;
            }

            .update-notification.visible {
                transform: translateX(0);
            }

            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .notification-title {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
            }

            .close-btn {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .notification-content {
                margin-bottom: 15px;
            }

            .version-info {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 10px;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
                margin: 10px 0;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #45a049);
                border-radius: 3px;
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                text-align: center;
            }

            .action-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 80px;
            }

            .btn-primary {
                background: #4CAF50;
                color: white;
            }

            .btn-primary:hover {
                background: #45a049;
            }

            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .status-message {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 10px;
            }

            .error-message {
                color: #ff6b6b;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .success-message {
                color: #4CAF50;
                font-size: 14px;
                margin-bottom: 10px;
            }
        `;
    }

    setupIpcListeners() {
        const { ipcRenderer } = require('electron');

        // Listen for update events
        ipcRenderer.on('update-checking-for-update', () => {
            this.updateStatus = 'checking';
            this.show();
        });

        ipcRenderer.on('update-update-available', (event, data) => {
            this.updateStatus = 'available';
            this.updateInfo = data;
            this.show();
        });

        ipcRenderer.on('update-update-not-available', () => {
            this.updateStatus = 'not-available';
            this.hide();
        });

        ipcRenderer.on('update-download-progress', (event, data) => {
            this.updateStatus = 'downloading';
            this.downloadProgress = data.percent;
            this.show();
        });

        ipcRenderer.on('update-update-downloaded', (event, data) => {
            this.updateStatus = 'downloaded';
            this.updateInfo = data;
            this.show();
        });

        ipcRenderer.on('update-error', (event, data) => {
            this.updateStatus = 'error';
            this.updateInfo = data;
            this.show();
        });
    }

    async getCurrentVersion() {
        const { ipcRenderer } = require('electron');
        try {
            this.currentVersion = await ipcRenderer.invoke('get-app-version');
        } catch (error) {
            console.error('Error getting app version:', error);
        }
    }

    show() {
        this.isVisible = true;
        this.requestUpdate();
    }

    hide() {
        this.isVisible = false;
        this.requestUpdate();
    }

    async checkForUpdates() {
        const { ipcRenderer } = require('electron');
        try {
            const result = await ipcRenderer.invoke('check-for-updates');
            if (!result.success) {
                console.error('Update check failed:', result.error);
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    async downloadUpdate() {
        const { ipcRenderer } = require('electron');
        try {
            const result = await ipcRenderer.invoke('download-update');
            if (!result.success) {
                console.error('Download failed:', result.error);
            }
        } catch (error) {
            console.error('Error downloading update:', error);
        }
    }

    async installUpdate() {
        const { ipcRenderer } = require('electron');
        try {
            const result = await ipcRenderer.invoke('install-update');
            if (!result.success) {
                console.error('Install failed:', result.error);
            }
        } catch (error) {
            console.error('Error installing update:', error);
        }
    }

    render() {
        if (!this.isVisible) {
            return html``;
        }

        return html`
            <div class="update-notification ${this.isVisible ? 'visible' : ''}">
                <div class="notification-header">
                    <h3 class="notification-title">
                        ${this.getTitle()}
                    </h3>
                    <button class="close-btn" @click=${this.hide}>×</button>
                </div>

                <div class="notification-content">
                    ${this.renderContent()}
                </div>

                <div class="action-buttons">
                    ${this.renderActions()}
                </div>
            </div>
        `;
    }

    getTitle() {
        switch (this.updateStatus) {
            case 'checking':
                return 'Checking for Updates';
            case 'available':
                return 'Update Available';
            case 'downloading':
                return 'Downloading Update';
            case 'downloaded':
                return 'Update Ready';
            case 'error':
                return 'Update Error';
            default:
                return 'Update';
        }
    }

    renderContent() {
        switch (this.updateStatus) {
            case 'checking':
                return html`
                    <div class="status-message">Checking for updates...</div>
                `;

            case 'available':
                return html`
                    <div class="status-message">
                        A new version (${this.updateInfo?.version}) is available!
                    </div>
                    <div class="version-info">
                        Current: ${this.currentVersion} → New: ${this.updateInfo?.version}
                    </div>
                `;

            case 'downloading':
                return html`
                    <div class="status-message">Downloading update...</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.downloadProgress}%"></div>
                    </div>
                    <div class="progress-text">${Math.round(this.downloadProgress)}%</div>
                `;

            case 'downloaded':
                return html`
                    <div class="success-message">
                        Update ${this.updateInfo?.version} has been downloaded!
                    </div>
                    <div class="version-info">
                        Ready to install. The app will restart to complete the installation.
                    </div>
                `;

            case 'error':
                return html`
                    <div class="error-message">
                        ${this.updateInfo?.message || 'An error occurred'}
                    </div>
                    ${this.updateInfo?.error ? html`
                        <div class="version-info">${this.updateInfo.error}</div>
                    ` : ''}
                `;

            default:
                return html``;
        }
    }

    renderActions() {
        switch (this.updateStatus) {
            case 'available':
                return html`
                    <button class="btn btn-secondary" @click=${this.hide}>Later</button>
                    <button class="btn btn-primary" @click=${this.downloadUpdate}>Download</button>
                `;

            case 'downloading':
                return html`
                    <button class="btn btn-secondary" @click=${this.hide}>Cancel</button>
                `;

            case 'downloaded':
                return html`
                    <button class="btn btn-secondary" @click=${this.hide}>Later</button>
                    <button class="btn btn-primary" @click=${this.installUpdate}>Install Now</button>
                `;

            case 'error':
                return html`
                    <button class="btn btn-secondary" @click=${this.hide}>Close</button>
                    <button class="btn btn-primary" @click=${this.checkForUpdates}>Retry</button>
                `;

            default:
                return html``;
        }
    }
}

customElements.define('buddy-update-notification', BuddyUpdateNotification); 