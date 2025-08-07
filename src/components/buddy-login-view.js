import { LitElement, html } from '../lit-core-2.7.4.min.js';
import { loginStyles } from './ui/login-css.js';

class BuddyLoginView extends LitElement {
    static properties = {
        isLoading: { type: Boolean },
        error: { type: String },
        user: { type: Object },
        devAccessCode: { type: String }
    };

    static styles = [loginStyles];

    constructor() {
        super();
        this.isLoading = false;
        this.error = '';
        this.user = null;
        this.devAccessCode = '';
    }

    async _onGoogleLogin() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.error = '';
        this.requestUpdate();

        try {
            const result = await window.buddy.startGoogleAuth();
            if (result.success) {
                this.user = result.user;
                this.requestUpdate();
            } else {
                this.error = result.error || 'Authentication failed';
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Google login error:', error);
            this.error = 'Failed to authenticate with Google';
            this.requestUpdate();
        } finally {
            this.isLoading = false;
            this.requestUpdate();
        }
    }

    async _onGuestLogin() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.error = '';
        this.requestUpdate();

        try {
            const result = await window.buddy.startGuestSession();
            if (result.success) {
                this.dispatchEvent(new CustomEvent('login-success', { 
                    detail: { user: null, isGuest: true }, 
                    bubbles: true, 
                    composed: true 
                }));
            } else {
                this.error = result.error || 'Failed to start guest session';
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Guest login error:', error);
            this.error = 'Failed to start guest session';
            this.requestUpdate();
        } finally {
            this.isLoading = false;
            this.requestUpdate();
        }
    }

    _onContinue() {
        this.dispatchEvent(new CustomEvent('login-success', { 
            detail: { user: this.user, isGuest: false }, 
            bubbles: true, 
            composed: true 
        }));
    }

    _onLogout() {
        this.user = null;
        this.error = '';
        this.requestUpdate();
    }

    _onDevAccessInput(e) {
        this.devAccessCode = e.target.value;
    }

    _onDevAccessKeyDown(e) {
        if (e.key === 'Enter') {
            this._checkDevAccess();
        }
    }

    _checkDevAccess() {
        // Get the current master key (custom or default)
        const masterKey = localStorage.getItem('buddy-master-access-key') || 'Anupchand-Yadav';
        const savedCustomKey = localStorage.getItem('buddy-dev-access-key');
        
        // Check if entered code matches master key or saved custom key
        if (this.devAccessCode === masterKey || 
            (savedCustomKey && this.devAccessCode === savedCustomKey)) {
            
            // Start guest session and navigate to dev config
            this.dispatchEvent(new CustomEvent('user-config-access-granted', {
                detail: { accessGranted: true },
                bubbles: true,
                composed: true
            }));
        } else {
            // If not empty and doesn't match, show subtle feedback
            if (this.devAccessCode.trim()) {
                const input = this.shadowRoot.querySelector('.user-config-input');
                if (input) {
                    input.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 1000);
                }
            }
        }
        
        // Clear the input
        this.devAccessCode = '';
        this.requestUpdate();
    }

    render() {
        if (this.user) {
            return html`
                <div class="login-container">
                    <div class="login-header">
                        <h1 class="login-title">Welcome back!</h1>
                        <p class="login-subtitle">You're signed in and ready to continue.</p>
                    </div>
                    
                    <div class="user-info">
                        <img 
                            src="${this.user.picture || '/assets/default-avatar.png'}" 
                            alt="${this.user.name}"
                            class="user-avatar"
                        >
                        <div class="user-details">
                            <div class="user-name">${this.user.name}</div>
                            <div class="user-email">${this.user.email}</div>
                        </div>
                        
                        <button 
                            class="continue-btn"
                            @click=${this._onContinue}
                            ?disabled=${this.isLoading}
                        >
                            Continue to Buddy
                        </button>
                        
                        <button 
                            class="logout-btn"
                            @click=${this._onLogout}
                            ?disabled=${this.isLoading}
                        >
                            Use different account
                        </button>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="login-container">
                <div class="login-header">
                    <h1 class="login-title">Welcome to Buddy</h1>
                    <p class="login-subtitle">Sign in to sync your conversations and preferences across devices.</p>
                </div>
                
                <div class="login-form">
                    <button 
                        class="google-login-btn"
                        @click=${this._onGoogleLogin}
                        ?disabled=${this.isLoading}
                    >
                        <div class="google-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </div>
                        ${this.isLoading ? html`<div class="loading-spinner"></div>` : 'Sign in with Google'}
                    </button>
                    
                    <div class="divider">
                        <div class="divider-line"></div>
                        <span class="divider-text">or</span>
                        <div class="divider-line"></div>
                    </div>
                    
                    <button 
                        class="guest-login-btn"
                        @click=${this._onGuestLogin}
                        ?disabled=${this.isLoading}
                    >
                        ${this.isLoading ? html`<div class="loading-spinner"></div>` : 'Continue as Guest'}
                    </button>
                    
                    <div class="user-config-section">
                        <input 
                            type="text"
                            class="user-config-input"
                            placeholder="User configuration access..."
                            .value=${this.devAccessCode}
                            @input=${this._onDevAccessInput}
                            @keydown=${this._onDevAccessKeyDown}
                            ?disabled=${this.isLoading}
                        >
                    </div>
                    
                    ${this.error ? html`
                        <div class="error-message">${this.error}</div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-login-view', BuddyLoginView);

export { BuddyLoginView };
