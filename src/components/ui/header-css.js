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

    /* Opacity control button styling */
    .opacity-control-btn {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        cursor: pointer;
        border-radius: 12px;
        height: 40px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        opacity: 0.9;
        position: relative;
        font-size: 12px;
        font-weight: 500;
        min-width: 80px;
    }

    .opacity-control-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
        opacity: 1;
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .opacity-control-btn.active {
        background: rgba(0, 122, 255, 0.3);
        border-color: rgba(0, 122, 255, 0.5);
        color: #ffffff;
    }

    .opacity-control-btn.active:hover {
        background: rgba(0, 122, 255, 0.4);
        border-color: rgba(0, 122, 255, 0.6);
    }

    .opacity-control-btn svg {
        width: 16px;
        height: 16px;
        opacity: 0.9;
        transition: all 0.3s ease;
    }

    .opacity-control-btn:hover svg {
        opacity: 1;
        transform: scale(1.1);
    }

    .opacity-value {
        font-size: 11px;
        font-weight: 600;
        opacity: 0.9;
        min-width: 28px;
        text-align: center;
    }

    /* Opacity dropdown container */
    .opacity-dropdown-container {
        position: relative;
        display: inline-block;
    }

    /* Opacity dropdown */
    .opacity-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 16px;
        min-width: 280px;
        backdrop-filter: blur(20px);
        box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: fadeInDown 0.3s ease;
    }

    .opacity-section {
        margin-bottom: 12px;
    }

    .opacity-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 8px;
    }

    /* Opacity slider */
    .opacity-slider-container {
        margin-bottom: 12px;
    }

    .opacity-slider {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        outline: none;
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
    }

    .opacity-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        background: #007aff;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
    }

    .opacity-slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
    }

    .opacity-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        background: #007aff;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
    }

    .opacity-slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 4px;
    }

    /* Opacity input */
    .opacity-input-container {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .opacity-input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: #fff;
        padding: 6px 8px;
        font-size: 12px;
        width: 60px;
        text-align: center;
        outline: none;
        transition: all 0.2s ease;
    }

    .opacity-input:focus {
        border-color: #007aff;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
    }

    .opacity-input-suffix {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
    }

    /* Opacity divider */
    .opacity-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 12px 0;
    }

    /* Opacity presets */
    .opacity-presets {
        margin-bottom: 12px;
    }

    .opacity-preset-buttons {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .opacity-preset-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        padding: 8px 12px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .opacity-preset-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .preset-desc {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
        font-weight: 400;
    }

    /* Scroll control toggle */
    .opacity-scroll-control {
        margin-top: 8px;
    }

    .opacity-scroll-toggle {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        padding: 8px 12px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .opacity-scroll-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .opacity-scroll-toggle.active {
        background: rgba(0, 122, 255, 0.2);
        border-color: rgba(0, 122, 255, 0.4);
        color: #ffffff;
    }

    .opacity-scroll-toggle.active:hover {
        background: rgba(0, 122, 255, 0.3);
        border-color: rgba(0, 122, 255, 0.5);
    }

    .toggle-status {
        margin-left: auto;
        font-size: 10px;
        font-weight: 600;
        opacity: 0.8;
    }

    /* Theme dropdown container */
    .theme-dropdown-container {
        position: relative;
        display: inline-block;
    }

    /* Theme button */
    .theme-btn {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        cursor: pointer;
        border-radius: 12px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        opacity: 0.9;
        position: relative;
    }

    .theme-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
        opacity: 1;
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Theme dropdown */
    .theme-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 16px;
        min-width: 220px;
        backdrop-filter: blur(20px);
        box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: fadeInDown 0.3s ease;
    }

    .theme-section {
        margin-bottom: 12px;
    }

    .theme-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 8px;
    }

    /* Theme options */
    .theme-option {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #fff;
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: left;
        width: 100%;
        margin-bottom: 4px;
    }

    .theme-option:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .theme-option.selected {
        background: rgba(0, 122, 255, 0.2);
        border-color: rgba(0, 122, 255, 0.4);
        color: #ffffff;
    }

    .theme-option.selected:hover {
        background: rgba(0, 122, 255, 0.3);
        border-color: rgba(0, 122, 255, 0.5);
    }

    /* Theme preview */
    .theme-preview {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
    }

    .theme-preview.theme-transparent {
        background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0.1) 25%, 
            transparent 25%, 
            transparent 75%, 
            rgba(255, 255, 255, 0.1) 75%
        );
        background-size: 8px 8px;
    }

    .theme-preview.theme-black {
        background: #000000;
    }



    /* Theme info */
    .theme-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .theme-name {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
    }

    .theme-desc {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.3;
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

<<<<<<< HEAD
=======
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
        background: rgba(20, 20, 20, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 8px;
        display: flex !important;
        flex-direction: column;
        gap: 2px;
        z-index: 9999 !important;
        box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.5),
            0 12px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: fadeInDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        width: 260px;
        min-height: 120px;
        max-height: 420px;
        overflow: hidden;
        transform-origin: top right;
    }

    .main-menu-dropdown-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 350px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 4px;
        margin-right: -4px;
    }

    /* Custom scrollbar for dropdown */
    .main-menu-dropdown-content::-webkit-scrollbar {
        width: 6px;
    }

    .main-menu-dropdown-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    .main-menu-dropdown-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        transition: background 0.2s ease;
    }

    .main-menu-dropdown-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Firefox scrollbar */
    .main-menu-dropdown-content {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
    }

    /* Responsive dropdown styles */
    @media (max-width: 768px) {
        .main-menu-dropdown {
            width: 240px;
            max-height: 380px;
            right: -10px;
        }

        .main-menu-dropdown-content {
            max-height: 320px;
        }

        .menu-item {
            padding: 10px 14px;
            font-size: 13px;
            min-height: 40px;
            gap: 10px;
        }

        .menu-item svg {
            width: 16px;
            height: 16px;
        }

        .menu-item-status {
            font-size: 10px;
            padding: 2px 5px;
            min-width: 26px;
        }
    }

    @media (max-width: 480px) {
        .main-menu-dropdown {
            width: 220px;
            max-height: 350px;
            right: -15px;
            border-radius: 14px;
        }

        .main-menu-dropdown-content {
            max-height: 290px;
        }

        .menu-item {
            padding: 9px 12px;
            font-size: 12px;
            min-height: 38px;
            gap: 8px;
            border-radius: 8px;
        }

        .menu-item svg {
            width: 15px;
            height: 15px;
        }

        .menu-item-label {
            font-size: 12px;
        }

        .menu-item-status {
            font-size: 9px;
            padding: 1px 4px;
            min-width: 24px;
        }

        .menu-divider {
            margin: 6px 10px;
        }
    }

    @media (max-width: 360px) {
        .main-menu-dropdown {
            width: 200px;
            max-height: 320px;
            right: -20px;
        }

        .main-menu-dropdown-content {
            max-height: 260px;
        }

        .menu-item {
            padding: 8px 10px;
            font-size: 11px;
            min-height: 36px;
            gap: 6px;
        }

        .menu-item svg {
            width: 14px;
            height: 14px;
        }

        .menu-item-label {
            font-size: 11px;
        }

        .menu-item-status {
            font-size: 8px;
            padding: 1px 3px;
            min-width: 22px;
        }
    }

    .menu-item {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--text-color);
        cursor: pointer;
        padding: 12px 16px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: left;
        width: 100%;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        min-height: 44px;
        box-sizing: border-box;
    }

    .menu-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
        border-radius: 10px;
    }

    .menu-item:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.25),
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .menu-item:hover:not(:disabled)::before {
        opacity: 1;
    }

    .menu-item:active {
        transform: translateY(-1px) scale(1.01);
        transition: all 0.1s ease;
    }

    .menu-item svg {
        width: 18px;
        height: 18px;
        opacity: 0.85;
        stroke-width: 2;
        flex-shrink: 0;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    .menu-item:hover svg {
        opacity: 1;
        transform: scale(1.1);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .menu-item-label {
        flex-grow: 1;
        font-weight: 500;
        letter-spacing: 0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .menu-item-status {
        font-size: 11px;
        opacity: 0.8;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        min-width: 28px;
        text-align: center;
    }

    .menu-item.active .menu-item-status {
        color: #ffffff;
        background: rgba(74, 222, 128, 0.2);
        border-color: rgba(74, 222, 128, 0.3);
        opacity: 1;
        box-shadow: 0 0 8px rgba(74, 222, 128, 0.2);
    }

    .menu-item.inactive .menu-item-status {
        color: #ffffff;
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.3);
        opacity: 1;
        box-shadow: 0 0 8px rgba(239, 68, 68, 0.2);
    }

    .menu-item.active {
        background: rgba(74, 222, 128, 0.08);
        border-color: rgba(74, 222, 128, 0.15);
    }

    .menu-item.inactive {
        background: rgba(239, 68, 68, 0.08);
        border-color: rgba(239, 68, 68, 0.15);
    }

    .menu-divider {
        height: 1px;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2) 20%, 
            rgba(255, 255, 255, 0.2) 80%, 
            transparent
        );
        margin: 8px 12px;
        position: relative;
    }

    .menu-divider::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.05) 20%, 
            rgba(255, 255, 255, 0.05) 80%, 
            transparent
        );
    }

>>>>>>> 2a28782d9958864772159323227dd2251e26a861
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

    .model-dropdown-item .custom-indicator {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 9px;
        font-weight: 600;
        color: #8b5cf6;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 3px;
        padding: 1px 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-left: 6px;
    }

    .model-dropdown-item.custom {
        border-left: 2px solid #8b5cf6;
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

    /* Main Menu Dropdown Styles */
    .main-menu-dropdown-container {
        position: relative;
        z-index: 1000;
    }

    .main-menu-btn {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        cursor: pointer;
        border-radius: 12px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0.9;
        position: relative;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .main-menu-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px) scale(1.02);
        opacity: 1;
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .main-menu-btn svg {
        transition: transform 0.3s ease;
    }

    .main-menu-btn:hover svg {
        transform: scale(1.1);
    }

    .main-menu-dropdown {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        background: rgba(20, 20, 25, 0.97);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 8px;
        display: flex !important;
        flex-direction: column;
        gap: 2px;
        z-index: 9999 !important;
        box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.5),
            0 12px 40px rgba(0, 0, 0, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        animation: modernDropdownIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        
        /* Responsive sizing */
        width: min(280px, calc(100vw - 40px));
        min-height: 120px;
        max-height: min(400px, calc(100vh - 100px));
        overflow-y: auto;
        overflow-x: hidden;
        
        /* Custom scrollbar */
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    }

    /* Webkit scrollbar styles */
    .main-menu-dropdown::-webkit-scrollbar {
        width: 6px;
    }

    .main-menu-dropdown::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
    }

    .main-menu-dropdown::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        transition: background 0.2s ease;
    }

    .main-menu-dropdown::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    @keyframes modernDropdownIn {
        from {
            opacity: 0;
            transform: translateY(-12px) scale(0.95);
            filter: blur(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
        }
    }

    .menu-item {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.95);
        cursor: pointer;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: left;
        width: 100%;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .menu-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%, 
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0.02) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .menu-item:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px) scale(1.02);
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.2),
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        color: #ffffff;
    }

    .menu-item:hover:not(:disabled)::before {
        opacity: 1;
    }

    .menu-item:active {
        transform: translateY(0) scale(0.98);
        transition: all 0.1s ease;
    }

    .menu-item svg {
        width: 18px;
        height: 18px;
        opacity: 0.9;
        stroke-width: 1.8;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .menu-item:hover svg {
        opacity: 1;
        transform: scale(1.1);
    }

    .menu-item-label {
        flex-grow: 1;
        font-weight: 500;
        letter-spacing: -0.01em;
    }

    .menu-item-status {
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .menu-item.active {
        background: rgba(76, 222, 128, 0.12);
        border-color: rgba(76, 222, 128, 0.2);
        color: #ffffff;
    }

    .menu-item.active svg {
        color: #4ade80;
    }

    .menu-item.active .menu-item-status {
        background: rgba(76, 222, 128, 0.2);
        color: #4ade80;
        border: 1px solid rgba(76, 222, 128, 0.3);
    }

    .menu-item.inactive {
        background: rgba(239, 68, 68, 0.08);
        border-color: rgba(239, 68, 68, 0.15);
    }

    .menu-item.inactive svg {
        color: #ef4444;
    }

    .menu-item.inactive .menu-item-status {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .menu-divider {
        height: 1px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.15) 50%, 
            transparent 100%
        );
        margin: 8px 12px;
        position: relative;
    }

    .menu-divider::after {
        content: '';
        position: absolute;
        top: 1px;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            transparent 100%
        );
    }

    /* Enhanced responsive behavior for mobile */
    @media (max-width: 768px) {
        .main-menu-dropdown {
            width: min(260px, calc(100vw - 20px));
            max-height: min(350px, calc(100vh - 80px));
            top: calc(100% + 8px);
            right: -10px;
        }

        .menu-item {
            padding: 14px 16px;
            font-size: 15px;
        }

        .menu-item svg {
            width: 20px;
            height: 20px;
        }

        .menu-item-status {
            font-size: 10px;
            padding: 3px 8px;
        }
    }

    @media (max-width: 480px) {
        .main-menu-dropdown {
            width: min(240px, calc(100vw - 16px));
            max-height: min(300px, calc(100vh - 60px));
            right: -8px;
        }

        .menu-item {
            padding: 12px 14px;
            font-size: 14px;
            gap: 10px;
        }

        .menu-item svg {
            width: 18px;
            height: 18px;
        }
    }

    /* Ensure dropdown stays within viewport bounds */
    @media (max-height: 500px) {
        .main-menu-dropdown {
            max-height: calc(100vh - 40px);
        }
    }

    /* Add smooth scroll behavior */
    .main-menu-dropdown {
        scroll-behavior: smooth;
    }

    /* Focus styles for accessibility */
    .menu-item:focus {
        outline: 2px solid rgba(255, 255, 255, 0.3);
        outline-offset: 2px;
        background: rgba(255, 255, 255, 0.1);
    }

    /* Loading state for menu items */
    .menu-item.loading {
        opacity: 0.6;
        cursor: wait;
        pointer-events: none;
    }

    .menu-item.loading::after {
        content: '';
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-top-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: translateY(-50%) rotate(360deg);
        }
    }
    `;