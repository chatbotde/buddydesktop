// auth-service-renderer.js
const { ipcRenderer } = require('electron');

class AuthServiceRenderer {
    constructor() {
        // Initialize auth state from localStorage
        this.authToken = localStorage.getItem('authToken');
    }

    async startGoogleAuth() {
        try {
            const result = await ipcRenderer.invoke('get-google-auth-url');
            if (!result.success) {
                throw new Error(result.error);
            }
            
            // Open the auth URL in the system browser
            await ipcRenderer.invoke('open-external', result.url);
            
            // For now, we'll need to handle the callback manually
            // In a production app, you'd want to set up a local server to handle the callback
            const authCode = await this.promptForAuthCode();
            
            if (authCode) {
                const authResult = await ipcRenderer.invoke('handle-google-auth-callback', authCode);
                if (authResult.success) {
                    // Store the token
                    localStorage.setItem('authToken', authResult.token);
                    this.authToken = authResult.token;
                    return {
                        success: true,
                        user: authResult.user,
                        token: authResult.token
                    };
                } else {
                    throw new Error(authResult.error);
                }
            } else {
                throw new Error('Authentication cancelled');
            }
        } catch (error) {
            console.error('Google auth error:', error);
            return { success: false, error: error.message };
        }
    }

    async promptForAuthCode() {
        return new Promise((resolve) => {
            // Create a simple dialog to get the auth code
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--main-content-background);
                border: var(--glass-border);
                border-radius: 16px;
                padding: 30px;
                box-shadow: var(--glass-shadow);
                backdrop-filter: blur(20px);
                z-index: 10000;
                max-width: 400px;
                width: 90%;
            `;
            
            dialog.innerHTML = `
                <h3 style="margin-top: 0; color: var(--text-color); font-size: 18px; margin-bottom: 16px;">
                    Complete Google Authentication
                </h3>
                <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 20px; line-height: 1.4;">
                    After signing in with Google, you'll be redirected to a page with an authorization code. 
                    Copy and paste that code here:
                </p>
                <input 
                    type="text" 
                    id="authCodeInput" 
                    placeholder="Paste authorization code here"
                    style="width: 100%; padding: 12px; border: var(--glass-border); border-radius: 8px; background: var(--input-background); color: var(--text-color); margin-bottom: 16px;"
                />
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button 
                        id="cancelAuth" 
                        style="padding: 10px 20px; background: transparent; border: var(--glass-border); border-radius: 8px; color: var(--text-color); cursor: pointer;"
                    >
                        Cancel
                    </button>
                    <button 
                        id="submitAuth" 
                        style="padding: 10px 20px; background: #4285f4; border: none; border-radius: 8px; color: white; cursor: pointer;"
                    >
                        Continue
                    </button>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            const input = dialog.querySelector('#authCodeInput');
            const submitBtn = dialog.querySelector('#submitAuth');
            const cancelBtn = dialog.querySelector('#cancelAuth');
            
            input.focus();
            
            submitBtn.addEventListener('click', () => {
                const code = input.value.trim();
                if (code) {
                    document.body.removeChild(dialog);
                    resolve(code);
                }
            });
            
            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
                resolve(null);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        });
    }

    async verifyAuthToken(token = null) {
        try {
            const tokenToVerify = token || this.authToken;
            if (!tokenToVerify) {
                return { success: false, error: 'No token provided' };
            }
            
            const result = await ipcRenderer.invoke('verify-auth-token', tokenToVerify);
            return result;
        } catch (error) {
            console.error('Token verification error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUserPreferences(preferences) {
        try {
            const result = await ipcRenderer.invoke('update-user-preferences', preferences);
            return result;
        } catch (error) {
            console.error('Update preferences error:', error);
            return { success: false, error: error.message };
        }
    }

    async saveChatSession(sessionData) {
        try {
            const result = await ipcRenderer.invoke('save-chat-session', sessionData);
            return result;
        } catch (error) {
            console.error('Save session error:', error);
            return { success: false, error: error.message };
        }
    }

    async getChatHistory(limit = 10) {
        try {
            const result = await ipcRenderer.invoke('get-chat-history', limit);
            return result;
        } catch (error) {
            console.error('Get history error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteChatSession(sessionId) {
        try {
            const result = await ipcRenderer.invoke('delete-chat-session', sessionId);
            return result;
        } catch (error) {
            console.error('Delete session error:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            localStorage.removeItem('authToken');
            this.authToken = null;
            const result = await ipcRenderer.invoke('logout');
            return result;
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    async startGuestSession() {
        try {
            const result = await ipcRenderer.invoke('start-guest-session');
            return result;
        } catch (error) {
            console.error('Guest session error:', error);
            return { success: false, error: error.message };
        }
    }

    isAuthenticated() {
        return !!this.authToken;
    }

    getAuthToken() {
        return this.authToken;
    }
}

module.exports = AuthServiceRenderer;
