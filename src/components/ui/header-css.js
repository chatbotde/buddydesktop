import { css } from '../../lit-core-2.7.4.min.js';

export const headerStyles = css`
    .header {
        -webkit-app-region: drag;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        border: var(--glass-border);
        background: var(--header-background);
        border-radius: 16px 16px 0 0;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
        overflow: visible;
        position: relative;
        z-index: 10;
    }

    .header-title {
        flex: 1;
        font-size: 16px;
        font-weight: 600;
        -webkit-app-region: drag;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0; /* Allow shrinking */
    }

    .header-title-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }



    .header-actions {
        display: flex;
        gap: 8px;
        align-items: center;
        -webkit-app-region: no-drag;
        flex-shrink: 0;
    }

    .header-actions span {
        font-size: 13px;
        color: var(--text-color);
        opacity: 0.8;
    }

    .status-container {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .status-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 6px;
    }

    .status-live {
        background-color: #4ade80;
        box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
    }

    .status-idle {
        background-color: #fbbf24;
        box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
    }

    .button, .session-button {
        background: var(--button-background);
        color: var(--text-color);
        border: var(--glass-border);
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s ease;
        cursor: pointer;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
    }

    .button:hover, .session-button:hover {
        background: var(--button-background);
        border-color: var(--button-border);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .session-button.start, .session-button.end {
        background: var(--button-background);
        color: var(--text-color);
        border: var(--glass-border);
    }

    .icon-button {
        background: var(--button-background);
        color: var(--text-color);
        border: var(--glass-border);
        padding: 8px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        transition: all 0.3s ease;
        cursor: pointer;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        align-items: center;
        justify-content: center;
        min-width: 40px;
        min-height: 40px;
    }

    .icon-button:hover {
        background: var(--button-background);
        color: var(--text-color);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .icon-button.active {
        background: rgba(74, 222, 128, 0.2);
        border-color: rgba(74, 222, 128, 0.4);
        color: #4ade80;
    }

    .icon-button.inactive {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
        color: #ef4444;
    }

    button:disabled {
        opacity: 0.5;
        transform: none;
    }



    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
        .header {
            padding: 8px 12px;
            border-radius: 12px 12px 0 0;
        }
        
        .header-title {
            font-size: 14px;
            gap: 6px;
            flex: 1;
            min-width: 0;
        }
        
        .header-title-text {
            font-size: 14px;
        }
        
        .model-select {
            min-width: 100px;
            max-width: 140px;
            font-size: 12px;
            padding: 3px 6px;
            margin-left: 4px;
        }
        
        .header-actions {
            gap: 6px;
        }
        
        .header-actions span {
            font-size: 12px;
        }
        
        .status-container {
            gap: 4px;
        }
        
        .status-indicator {
            width: 6px;
            height: 6px;
            margin-right: 4px;
        }
        
        .button, .session-button {
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 10px;
        }
        
        .icon-button {
            padding: 6px;
            border-radius: 10px;
            min-width: 36px;
            min-height: 36px;
        }
        
        .icon-button svg {
            width: 20px;
            height: 20px;
        }
        
        /* Adjust status container for mobile */
        .status-container {
            flex-wrap: wrap;
        }
    }

    @media (max-width: 480px) {
        .header {
            padding: 6px 10px;
            border-radius: 10px 10px 0 0;
        }
        
        .header-title {
            font-size: 13px;
            gap: 4px;
        }
        
        .header-title-text {
            font-size: 13px;
            max-width: 80px;
        }
        
        .model-select {
            min-width: 80px;
            max-width: 120px;
            font-size: 11px;
            padding: 2px 4px;
            margin-left: 2px;
        }
        
        .header-actions {
            gap: 4px;
        }
        
        .header-actions span {
            font-size: 11px;
        }
        
        .status-container {
            gap: 3px;
        }
        
        .button, .session-button {
            padding: 5px 10px;
            font-size: 11px;
            border-radius: 8px;
        }
        
        .icon-button {
            padding: 5px;
            border-radius: 8px;
            min-width: 32px;
            min-height: 32px;
        }
        
        .icon-button svg {
            width: 18px;
            height: 18px;
        }
        
        /* Hide elapsed time on very small screens */
        .header-actions > span:first-child {
            display: none;
        }
        
        /* Stack audio/video buttons vertically on small screens */
        .status-container {
            flex-direction: column;
            gap: 2px;
        }
    }

    @media (max-width: 360px) {
        .header {
            padding: 5px 8px;
        }
        
        .header-title-text {
            max-width: 60px;
        }
        
        .model-select {
            min-width: 70px;
            max-width: 100px;
            font-size: 10px;
        }
        
        .header-actions {
            gap: 3px;
        }
        
        .button, .session-button {
            padding: 4px 8px;
            font-size: 10px;
        }
        
        .icon-button {
            padding: 4px;
            min-width: 28px;
            min-height: 28px;
        }
        
        .icon-button svg {
            width: 16px;
            height: 16px;
        }
        
        /* Further simplify on very small screens */
        .status-indicator {
            width: 5px;
            height: 5px;
            margin-right: 3px;
        }
    }

    /* Controls dropdown styles */
    .controls-dropdown-container {
        position: relative;
        z-index: 1000;
    }

    :host {
        z-index: 1000;
    }

    .controls-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 16px;
        display: flex !important;
        flex-direction: column;
        gap: 10px;
        z-index: 9999 !important;
        box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: fadeInDown 0.2s ease-out;
        width: 220px;
        min-height: 140px;
        max-height: 300px;
        overflow: visible;
    }

    .dropdown-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--text-color);
        cursor: pointer;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 14px;
        text-align: left;
        width: 100%;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
    }

    .dropdown-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .dropdown-item:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dropdown-item:hover:not(:disabled)::before {
        opacity: 1;
    }

    .dropdown-item:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .dropdown-item svg {
        width: 20px;
        height: 20px;
        opacity: 0.9;
        stroke-width: 2;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .dropdown-item:hover svg {
        opacity: 1;
        transform: scale(1.1);
    }

    .dropdown-item-label {
        flex-grow: 1;
    }

    .dropdown-item-value {
        opacity: 0.7;
        font-size: 12px;
    }

    .dropdown-item.active .dropdown-item-value {
        color: #ffffff;
        opacity: 1;
        font-weight: 600;
    }

    .dropdown-item.inactive .dropdown-item-value {
        color: #ffffff;
        opacity: 0.6;
        font-weight: 600;
    }

    .dropdown-item.active {
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.15);
    }

    .dropdown-item.inactive {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Controls button styling */
    .controls-btn {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        border-radius: 12px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        opacity: 0.9;
        position: relative;
    }

    .controls-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.35);
        transform: translateY(-1px) scale(1.05);
        opacity: 1;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .controls-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        background: rgba(255, 255, 255, 0.05);
        transform: none;
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        box-shadow: none;
    }

    /* Status indicator on controls button */
    .controls-status-indicator {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--header-background);
    }

    .controls-status-indicator.both-active {
        background: #ffffff;
    }

    .controls-status-indicator.partial-active {
        background: #ffffff;
        opacity: 0.7;
    }

    .controls-status-indicator.both-inactive {
        background: #ffffff;
        opacity: 0.3;
    }

    .user-info {
        display: flex;
        align-items: center;
        margin-left: 12px;
    }

    .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid var(--border-color);
        object-fit: cover;
    }

    .guest-indicator {
        margin-left: 8px;
        opacity: 0.7;
        font-size: 14px;
    }

    /* Main Menu Dropdown Styles */
    .main-menu-dropdown-container {
        position: relative;
        z-index: 1000;
    }

    .main-menu-btn {
        background: oklch(37.4% 0.01 67.558);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        cursor: pointer;
        border-radius: 8px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        opacity: 0.9;
        position: relative;
    }

    .main-menu-btn:hover:not(:disabled) {
        background: oklch(42% 0.01 67.558);
        border-color: rgba(255, 255, 255, 0.35);
        transform: translateY(-1px);
        opacity: 1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .main-menu-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: oklch(37.4% 0.01 67.558);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 12px;
        display: flex !important;
        flex-direction: column;
        gap: 6px;
        z-index: 9999 !important;
        box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 8px 32px rgba(0, 0, 0, 0.3);
        animation: fadeInDown 0.2s ease-out;
        width: 220px;
        min-height: 100px;
        max-height: 350px;
        overflow: visible;
    }

    .menu-item {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        cursor: pointer;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: left;
        width: 100%;
        position: relative;
        overflow: hidden;
    }

    .menu-item:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .menu-item svg {
        width: 16px;
        height: 16px;
        opacity: 0.9;
        stroke-width: 2;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .menu-item:hover svg {
        opacity: 1;
    }

    .menu-item-label {
        flex-grow: 1;
    }

    .menu-item-status {
        font-size: 11px;
        opacity: 0.7;
        font-weight: 600;
    }

    .menu-item.active .menu-item-status {
        color: #4ade80;
        opacity: 1;
    }

    .menu-item.inactive .menu-item-status {
        color: #ef4444;
        opacity: 1;
    }

    .menu-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.15);
        margin: 4px 0;
    }

    /* Models Dropdown Styles */
    .models-dropdown-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .models-dropdown-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: var(--text-color);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        max-width: 200px;
        -webkit-app-region: no-drag;
    }

    .models-dropdown-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }

    .models-dropdown-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 140px;
    }

    .models-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        min-width: 250px;
        max-width: 300px;
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        overflow: hidden;
        animation: dropdownFadeIn 0.2s ease-out;
    }

    @keyframes dropdownFadeIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .model-dropdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: transparent;
        border: none;
        color: var(--text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .model-dropdown-item:last-child {
        border-bottom: none;
    }

    .model-dropdown-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .model-dropdown-item.selected {
        background: rgba(255, 255, 255, 0.15);
        color: var(--text-color);
    }

    .model-dropdown-item .model-icon {
        font-size: 16px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .model-dropdown-item .model-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
    }

    .model-dropdown-item .model-name {
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .model-dropdown-item .model-badge {
        font-size: 11px;
        color: var(--text-color);
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        .models-dropdown-btn {
            max-width: 150px;
        }
        
        .models-dropdown-text {
            max-width: 100px;
        }
        
        .models-dropdown {
            min-width: 200px;
            right: -20px;
        }
    }
    `;