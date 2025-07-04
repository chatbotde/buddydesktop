import { LitElement, html, css } from '../lit-core-2.7.4.min.js';

class BuddyLoginView extends LitElement {
    static properties = {
        isLoading: { type: Boolean },
        error: { type: String },
        user: { type: Object }
    };

    static styles = css`
        :host { 
            display: block; 
            height: 100%;
        }
        
        .login-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .login-title {
            font-size: 32px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 8px;
        }
        
        .login-subtitle {
            font-size: 16px;
            color: var(--text-color);
            opacity: 0.7;
            line-height: 1.4;
        }
        
        .login-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .google-login-btn {
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 0 4px 16px rgba(66, 133, 244, 0.3);
        }
        
        .google-login-btn:hover:not(:disabled) {
            background: #3367d6;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
        }
        
        .google-login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .google-icon {
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 20px 0;
        }
        
        .divider-line {
            flex: 1;
            height: 1px;
            background: var(--border-color);
        }
        
        .divider-text {
            color: var(--text-color);
            opacity: 0.6;
            font-size: 14px;
        }
        
        .guest-login-btn {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .guest-login-btn:hover:not(:disabled) {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .guest-login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .error-message {
            color: #ef4444;
            font-size: 14px;
            text-align: center;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-top: 16px;
        }
        
        .user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            width: 100%;
        }
        
        .user-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 3px solid var(--border-color);
            object-fit: cover;
        }
        
        .user-details {
            text-align: center;
        }
        
        .user-name {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 4px;
        }
        
        .user-email {
            font-size: 14px;
            color: var(--text-color);
            opacity: 0.7;
        }
        
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .continue-btn {
            background: #4ade80;
            color: #065f46;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(74, 222, 128, 0.3);
        }
        
        .continue-btn:hover:not(:disabled) {
            background: #22c55e;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
        }
        
        .logout-btn {
            background: transparent;
            color: var(--text-color);
            border: var(--glass-border);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.7;
        }
        
        .logout-btn:hover {
            opacity: 1;
            background: var(--button-background);
        }
    `;

    constructor() {
        super();
        this.isLoading = false;
        this.error = '';
        this.user = null;
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
