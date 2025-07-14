import { css } from '../../lit-core-2.7.4.min.js';

export const helpStyles = css`
        :host { display: block; }
        .option-group {
            border-color: oklch(98.5% 0.001 106.423);
        }
        
        .update-section {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .update-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            transition: background 0.2s ease;
        }
        
        .update-button:hover {
            background: #45a049;
        }
        
        .update-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .version-info {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 10px;
        }
        
        .update-status {
            font-size: 14px;
            margin-top: 10px;
        }
        
        .update-status.checking {
            color: #2196F3;
        }
        
        .update-status.available {
            color: #4CAF50;
        }
        
        .update-status.error {
            color: #f44336;
        }
    `;