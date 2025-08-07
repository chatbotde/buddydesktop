import { css } from '../../lit-core-2.7.4.min.js';

export const loginStyles = css`
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

.user-config-section {
    margin-top: 20px;
}

.user-config-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: var(--glass-border);
    background: var(--button-background);
    color: var(--text-color);
    font-size: 14px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.user-config-input::placeholder {
    color: var(--text-color);
    opacity: 0.4;
    font-style: italic;
}

.user-config-input:focus {
    outline: none;
    border-color: var(--button-border);
    background: var(--glass-background);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.user-config-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
`;