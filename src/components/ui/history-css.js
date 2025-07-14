import { css } from '../../lit-core-2.7.4.min.js';

export const historyStyles = css`
        :host { display: block; }
        .history-controls {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-bottom: 12px;
        }
        .history-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .history-item {
            background: var(--main-content-background);
            border: var(--glass-border);
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .history-item-content {
            flex: 1;
        }
        .history-item:hover {
            background: var(--button-background);
            transform: translateY(-2px);
            box-shadow: var(--glass-shadow);
        }
        .history-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .history-item-model {
            font-weight: 600;
            font-size: 14px;
        }
        .history-item-time {
            font-size: 12px;
            opacity: 0.7;
        }
        .history-item-preview {
            font-size: 13px;
            opacity: 0.8;
            line-height: 1.4;
        }
        .delete-btn {
            background: transparent;
            border: none;
            color: #ef4444;
            font-size: 18px;
            cursor: pointer;
            margin-left: 12px;
            padding: 2px 6px;
            border-radius: 6px;
            transition: background 0.2s;
        }
        .delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
        }
        .control-btn {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .control-btn:hover {
            background: var(--button-background);
            border-color: var(--button-border);
        }
    `;