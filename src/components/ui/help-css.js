import { css } from '../../lit-core-2.7.4.min.js';

export const helpStyles = css`
    :host { 
        display: block; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: transparent;
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        color: #ffffff;
    }

    :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
        pointer-events: none;
    }

    .help-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
        overflow-y: auto;
    }

    .help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .help-title {
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.5px;
        margin: 0;
    }

    .close-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-size: 16px;
        font-weight: bold;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }

    .section {
        margin-bottom: 32px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 24px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 16px;
        letter-spacing: 0.3px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .section-title::before {
        content: '';
        width: 4px;
        height: 20px;
        background: linear-gradient(135deg, #3b82f6, #60a5fa);
        border-radius: 2px;
    }

    .shortcuts-grid {
        display: grid;
        gap: 12px;
        margin-top: 16px;
    }

    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        transition: all 0.2s ease;
    }

    .shortcut-item:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .shortcut-label {
        font-size: 14px;
        font-weight: 500;
        color: #e2e8f0;
        flex: 1;
    }

    .shortcut-keys {
        display: flex;
        gap: 4px;
        align-items: center;
    }

    .key {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        min-width: 24px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    }

    .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        margin: 0 2px;
    }

    .description {
        font-size: 14px;
        color: #cbd5e1;
        line-height: 1.6;
        margin-top: 12px;
    }

    .description strong {
        color: #ffffff;
        font-weight: 600;
    }

    .profile-list {
        display: grid;
        gap: 8px;
        margin-top: 12px;
    }

    .profile-item {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-size: 13px;
        line-height: 1.4;
    }

    .profile-name {
        font-weight: 600;
        color: #60a5fa;
        margin-bottom: 2px;
    }

    .profile-desc {
        color: #cbd5e1;
        font-size: 12px;
    }

    .update-section {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 24px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .version-info {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 16px;
        font-weight: 500;
    }

    .update-button {
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        backdrop-filter: blur(10px);
    }

    .update-button:hover {
        background: linear-gradient(135deg, #45a049, #4CAF50);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    }

    .update-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
    }

    .update-status {
        font-size: 14px;
        margin-top: 12px;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 500;
    }

    .update-status.checking {
        color: #60a5fa;
        background: rgba(96, 165, 250, 0.1);
        border: 1px solid rgba(96, 165, 250, 0.2);
    }

    .update-status.available {
        color: #4ade80;
        background: rgba(74, 222, 128, 0.1);
        border: 1px solid rgba(74, 222, 128, 0.2);
    }

    .update-status.not-available {
        color: #94a3b8;
        background: rgba(148, 163, 184, 0.1);
        border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .update-status.error {
        color: #f87171;
        background: rgba(248, 113, 113, 0.1);
        border: 1px solid rgba(248, 113, 113, 0.2);
    }

    .platform-info {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #94a3b8;
        margin-top: 8px;
    }

    @media (max-width: 640px) {
        .help-container {
            padding: 16px;
            max-width: 100%;
        }

        .help-title {
            font-size: 20px;
        }

        .section {
            padding: 20px;
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 16px;
        }

        .shortcut-item {
            padding: 10px 12px;
        }

        .shortcut-label {
            font-size: 13px;
        }

        .key {
            padding: 3px 6px;
            font-size: 11px;
        }
    }
`;