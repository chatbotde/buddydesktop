import { LitElement, html, css } from 'lit';
import { WebAuthService } from '../web-auth-service.js';

export class BuddyDesktopAuth extends LitElement {
    static get properties() {
        return {
            authService: { type: Object },
            isAuthenticated: { type: Boolean },
            currentUser: { type: Object },
            isLoading: { type: Boolean },
            error: { type: String },
            showTokenInput: { type: Boolean },
            authToken: { type: String }
        };
    }

    constructor() {
        super();
        this.authService = new WebAuthService();
        this.isAuthenticated = false;
        this.currentUser = null;
        this.isLoading = false;
        this.error = null;
        this.showTokenInput = false;
        this.authToken = '';
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.checkAuthentication();
    }

    async checkAuthentication() {
        this.isLoading = true;
        try {
            const isAuth = await this.authService.isAuthenticated();
            if (isAuth) {
                this.isAuthenticated = true;
                this.currentUser = await this.authService.getCurrentUser();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.error = 'Authentication check failed';
        } finally {
            this.isLoading = false;
        }
    }

    async openWebAuth() {
        try {
            this.authService.openDesktopAuth();
            this.showTokenInput = true;
        } catch (error) {
            console.error('Failed to open web auth:', error);
            this.error = 'Failed to open authentication page';
        }
    }

    async submitToken() {
        if (!this.authToken.trim()) {
            this.error = 'Please enter a valid token';
            return;
        }

        this.isLoading = true;
        this.error = null;

        try {
            this.authService.setAuthToken(this.authToken);
            const result = await this.authService.verifyToken(this.authToken);
            
            if (result.success) {
                this.isAuthenticated = true;
                this.currentUser = result.user;
                this.showTokenInput = false;
                this.authToken = '';
                this.dispatchEvent(new CustomEvent('auth-success', { 
                    detail: { user: result.user } 
                }));
            } else {
                this.error = result.error || 'Invalid token';
                this.authService.clearAuthToken();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.error = 'Token verification failed';
            this.authService.clearAuthToken();
        } finally {
            this.isLoading = false;
        }
    }

    async signOut() {
        try {
            this.authService.clearAuthToken();
            this.isAuthenticated = false;
            this.currentUser = null;
            this.dispatchEvent(new CustomEvent('auth-signout'));
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .auth-container {
                max-width: 400px;
                margin: 0 auto;
                padding: 2rem;
                background: var(--bg-color, #ffffff);
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .auth-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .auth-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--text-color, #1f2937);
                margin-bottom: 0.5rem;
            }

            .auth-subtitle {
                color: var(--text-secondary, #6b7280);
                font-size: 0.875rem;
            }

            .auth-button {
                width: 100%;
                padding: 0.75rem 1rem;
                background: var(--primary-color, #3b82f6);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
                margin-bottom: 1rem;
            }

            .auth-button:hover {
                background: var(--primary-hover, #2563eb);
            }

            .auth-button:disabled {
                background: var(--disabled-color, #9ca3af);
                cursor: not-allowed;
            }

            .auth-button.secondary {
                background: var(--secondary-color, #f3f4f6);
                color: var(--text-color, #1f2937);
            }

            .auth-button.secondary:hover {
                background: var(--secondary-hover, #e5e7eb);
            }

            .token-input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--border-color, #d1d5db);
                border-radius: 8px;
                font-size: 0.875rem;
                margin-bottom: 1rem;
                font-family: 'Monaco', 'Menlo', monospace;
            }

            .token-input:focus {
                outline: none;
                border-color: var(--primary-color, #3b82f6);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .error-message {
                color: var(--error-color, #dc2626);
                background: var(--error-bg, #fef2f2);
                padding: 0.75rem;
                border-radius: 8px;
                font-size: 0.875rem;
                margin-bottom: 1rem;
                border: 1px solid var(--error-border, #fecaca);
            }

            .success-message {
                color: var(--success-color, #059669);
                background: var(--success-bg, #f0fdf4);
                padding: 0.75rem;
                border-radius: 8px;
                font-size: 0.875rem;
                margin-bottom: 1rem;
                border: 1px solid var(--success-border, #bbf7d0);
            }

            .user-info {
                background: var(--bg-secondary, #f9fafb);
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            .user-name {
                font-weight: 600;
                color: var(--text-color, #1f2937);
                margin-bottom: 0.25rem;
            }

            .user-email {
                color: var(--text-secondary, #6b7280);
                font-size: 0.875rem;
            }

            .loading {
                text-align: center;
                color: var(--text-secondary, #6b7280);
                font-size: 0.875rem;
            }

            .spinner {
                display: inline-block;
                width: 1rem;
                height: 1rem;
                border: 2px solid var(--border-color, #d1d5db);
                border-radius: 50%;
                border-top-color: var(--primary-color, #3b82f6);
                animation: spin 1s ease-in-out infinite;
                margin-right: 0.5rem;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .instructions {
                background: var(--info-bg, #eff6ff);
                border: 1px solid var(--info-border, #bfdbfe);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .instructions h4 {
                color: var(--info-color, #1d4ed8);
                margin: 0 0 0.5rem 0;
                font-size: 0.875rem;
                font-weight: 600;
            }

            .instructions ol {
                margin: 0;
                padding-left: 1.25rem;
                color: var(--info-text, #1e40af);
                font-size: 0.875rem;
            }

            .instructions li {
                margin-bottom: 0.25rem;
            }
        `;
    }

    render() {
        if (this.isLoading) {
            return html`
                <div class="auth-container">
                    <div class="loading">
                        <span class="spinner"></span>
                        Checking authentication...
                    </div>
                </div>
            `;
        }

        if (this.isAuthenticated && this.currentUser) {
            return html`
                <div class="auth-container">
                    <div class="auth-header">
                        <div class="auth-title">Welcome back!</div>
                        <div class="auth-subtitle">You're successfully authenticated</div>
                    </div>

                    <div class="user-info">
                        <div class="user-name">${this.currentUser.name}</div>
                        <div class="user-email">${this.currentUser.email}</div>
                    </div>

                    <button class="auth-button secondary" @click=${this.signOut}>
                        Sign Out
                    </button>
                </div>
            `;
        }

        return html`
            <div class="auth-container">
                <div class="auth-header">
                    <div class="auth-title">Desktop Authentication</div>
                    <div class="auth-subtitle">Get a token from your web account and paste it here</div>
                </div>

                ${this.error ? html`
                    <div class="error-message">${this.error}</div>
                ` : ''}

                ${!this.showTokenInput ? html`
                    <button class="auth-button" @click=${this.openWebAuth}>
                        Get Desktop Token
                    </button>
                    
                    <div class="instructions">
                        <h4>How to get your desktop token:</h4>
                        <ol>
                            <li>Click "Get Desktop Token" to open your web account</li>
                            <li>Sign in to your account if needed</li>
                            <li>Go to "Desktop Tokens" page</li>
                            <li>Generate a new token with a device name</li>
                            <li>Copy the generated token</li>
                            <li>Paste it here in the desktop app</li>
                        </ol>
                    </div>
                ` : html`
                    <div class="success-message">
                        Web page opened! Please generate a desktop token and copy it here.
                    </div>

                    <input 
                        type="text" 
                        class="token-input" 
                        placeholder="Paste your authentication token here..."
                        .value=${this.authToken}
                        @input=${(e) => this.authToken = e.target.value}
                    />

                    <button class="auth-button" @click=${this.submitToken} ?disabled=${this.isLoading}>
                        ${this.isLoading ? html`<span class="spinner"></span>Verifying...` : 'Verify Token'}
                    </button>

                    <button class="auth-button secondary" @click=${() => this.showTokenInput = false}>
                        Cancel
                    </button>
                `}
            </div>
        `;
    }
}

customElements.define('buddy-desktop-auth', BuddyDesktopAuth); 