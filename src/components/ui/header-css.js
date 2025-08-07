import { css } from '../../lit-core-2.7.4.min.js';

export const headerStyles = css`
    .header {
        -webkit-app-region: drag;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        border: none;
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

    .clickable-title {
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 4px 8px;
        border-radius: 8px;
        -webkit-app-region: no-drag;
    }

    .clickable-title:hover {
        background: var(--button-background);
        color: var(--text-color);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
        transform: none;
    }

    /* Close button specific styles for login page */
    .close-btn {
        background: var(--button-background);
        color: var(--text-color);
        border: var(--glass-border);
        padding: 8px;
        border-radius: 12px;
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

    .close-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
        color: #ef4444;
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.15);
    }



    /* Vertical Height Responsive Design */
    @media (max-height: 800px) {
        .header {
            padding: 8px 16px;
            border-radius: 14px 14px 0 0;
        }
        
        .header-title {
            font-size: 15px;
            gap: 6px;
        }
        
        .icon-button {
            min-width: 36px;
            min-height: 36px;
            padding: 6px;
        }
        
        .button, .session-button {
            padding: 6px 14px;
            font-size: 13px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 36px;
            padding: 0 10px;
            font-size: 12px;
        }
        
        .main-menu-btn {
            width: 36px;
            height: 36px;
        }
        
        .clear-chat-btn {
            width: 36px;
            height: 36px;
        }
    }

    @media (max-height: 600px) {
        .header {
            padding: 6px 14px;
            border-radius: 12px 12px 0 0;
        }
        
        .header-title {
            font-size: 14px;
            gap: 5px;
        }
        
        .header-title-text {
            font-size: 14px;
        }
        
        .header-actions {
            gap: 5px;
        }
        
        .header-actions span {
            font-size: 12px;
        }
        
        .icon-button {
            min-width: 32px;
            min-height: 32px;
            padding: 5px;
            border-radius: 8px;
        }
        
        .icon-button svg {
            width: 18px;
            height: 18px;
        }
        
        .button, .session-button {
            padding: 5px 12px;
            font-size: 12px;
            border-radius: 8px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 32px;
            padding: 0 8px;
            font-size: 11px;
            border-radius: 8px;
        }
        
        .main-menu-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
        }
        
        .clear-chat-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
        }
        
        .status-indicator {
            width: 6px;
            height: 6px;
        }
    }

    @media (max-height: 480px) {
        .header {
            padding: 5px 12px;
            border-radius: 10px 10px 0 0;
        }
        
        .header-title {
            font-size: 13px;
            gap: 4px;
        }
        
        .header-title-text {
            font-size: 13px;
        }
        
        .header-actions {
            gap: 4px;
        }
        
        .header-actions span {
            font-size: 11px;
        }
        
        .icon-button {
            min-width: 28px;
            min-height: 28px;
            padding: 4px;
            border-radius: 6px;
        }
        
        .icon-button svg {
            width: 16px;
            height: 16px;
        }
        
        .button, .session-button {
            padding: 4px 10px;
            font-size: 11px;
            border-radius: 6px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 28px;
            padding: 0 6px;
            font-size: 10px;
            border-radius: 6px;
        }
        
        .main-menu-btn {
            width: 28px;
            height: 28px;
            border-radius: 6px;
        }
        
        .clear-chat-btn {
            width: 28px;
            height: 28px;
            border-radius: 6px;
        }
        
        .status-indicator {
            width: 5px;
            height: 5px;
        }
        
        .status-container {
            gap: 2px;
        }
    }

    @media (max-height: 400px) {
        .header {
            padding: 4px 10px;
            border-radius: 8px 8px 0 0;
        }
        
        .header-title {
            font-size: 12px;
            gap: 3px;
        }
        
        .header-title-text {
            font-size: 12px;
            max-width: 60px;
        }
        
        .header-actions {
            gap: 3px;
        }
        
        .header-actions span {
            font-size: 10px;
        }
        
        .icon-button {
            min-width: 24px;
            min-height: 24px;
            padding: 3px;
            border-radius: 4px;
        }
        
        .icon-button svg {
            width: 14px;
            height: 14px;
        }
        
        .button, .session-button {
            padding: 3px 8px;
            font-size: 10px;
            border-radius: 4px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 24px;
            padding: 0 5px;
            font-size: 9px;
            border-radius: 4px;
        }
        
        .main-menu-btn {
            width: 24px;
            height: 24px;
            border-radius: 4px;
        }
        
        .clear-chat-btn {
            width: 24px;
            height: 24px;
            border-radius: 4px;
        }
        
        .status-indicator {
            width: 4px;
            height: 4px;
        }
        
        /* Hide less critical elements on very small heights */
        .header-actions > span:first-child {
            display: none;
        }
    }

    @media (max-height: 320px) {
        .header {
            padding: 3px 8px;
            border-radius: 6px 6px 0 0;
        }
        
        .header-title {
            font-size: 11px;
            gap: 2px;
        }
        
        .header-title-text {
            font-size: 11px;
            max-width: 50px;
        }
        
        .header-actions {
            gap: 2px;
        }
        
        .icon-button {
            min-width: 20px;
            min-height: 20px;
            padding: 2px;
        }
        
        .icon-button svg {
            width: 12px;
            height: 12px;
        }
        
        .button, .session-button {
            padding: 2px 6px;
            font-size: 9px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 20px;
            padding: 0 4px;
            font-size: 8px;
        }
        
        .main-menu-btn {
            width: 20px;
            height: 20px;
        }
        
        .clear-chat-btn {
            width: 20px;
            height: 20px;
        }
        
        /* Stack elements differently for extreme heights */
        .status-container {
            flex-direction: column;
            gap: 1px;
        }
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
        
        .close-btn {
            padding: 6px;
            border-radius: 10px;
            min-width: 36px;
            min-height: 36px;
        }
        
        .close-btn svg {
            width: 18px;
            height: 18px;
        }
        
        /* Adjust status container for mobile */
        .status-container {
            flex-wrap: wrap;
        }
    }

    /* Enhanced Mobile Responsive with Vertical Height Considerations */
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
        
        .close-btn {
            padding: 5px;
            border-radius: 8px;
            min-width: 32px;
            min-height: 32px;
        }
        
        .close-btn svg {
            width: 16px;
            height: 16px;
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

    /* Small Mobile with Height Considerations */
    @media (max-width: 480px) and (max-height: 600px) {
        .header {
            padding: 5px 8px;
        }
        
        .header-title {
            font-size: 12px;
            gap: 3px;
        }
        
        .icon-button {
            min-width: 28px;
            min-height: 28px;
            padding: 4px;
        }
        
        .icon-button svg {
            width: 16px;
            height: 16px;
        }
        
        .button, .session-button {
            padding: 4px 8px;
            font-size: 10px;
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
        
        .close-btn {
            padding: 4px;
            min-width: 28px;
            min-height: 28px;
        }
        
        .close-btn svg {
            width: 14px;
            height: 14px;
        }
        
        /* Further simplify on very small screens */
        .status-indicator {
            width: 5px;
            height: 5px;
            margin-right: 3px;
        }
    }

    /* Ultra Small Mobile with Height Considerations */
    @media (max-width: 360px) and (max-height: 500px) {
        .header {
            padding: 4px 6px;
        }
        
        .header-title {
            font-size: 11px;
            gap: 2px;
        }
        
        .header-title-text {
            max-width: 50px;
            font-size: 11px;
        }
        
        .icon-button {
            min-width: 24px;
            min-height: 24px;
            padding: 3px;
        }
        
        .icon-button svg {
            width: 14px;
            height: 14px;
        }
        
        .button, .session-button {
            padding: 3px 6px;
            font-size: 9px;
        }
        
        .header-actions span {
            font-size: 9px;
        }
        
        .status-indicator {
            width: 4px;
            height: 4px;
        }
    }

    /* Extreme Small Screens */
    @media (max-width: 320px) {
        .header {
            padding: 3px 5px;
        }
        
        .header-title {
            font-size: 10px;
            gap: 1px;
        }
        
        .header-title-text {
            max-width: 40px;
            font-size: 10px;
        }
        
        .header-actions {
            gap: 2px;
        }
        
        .icon-button {
            min-width: 20px;
            min-height: 20px;
            padding: 2px;
        }
        
        .icon-button svg {
            width: 12px;
            height: 12px;
        }
        
        .button, .session-button {
            padding: 2px 4px;
            font-size: 8px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 20px;
            padding: 0 3px;
            font-size: 7px;
        }
        
        .main-menu-btn {
            width: 20px;
            height: 20px;
        }
        
        .clear-chat-btn {
            width: 20px;
            height: 20px;
        }
    }

    /* Combined Horizontal and Vertical Responsive Design */
    
    /* Medium screens with constrained height */
    @media (max-width: 768px) and (max-height: 600px) {
        .header {
            padding: 5px 10px;
        }
        
        .header-title {
            font-size: 13px;
        }
        
        .icon-button {
            min-width: 30px;
            min-height: 30px;
            padding: 4px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 30px;
            font-size: 11px;
        }
    }

    /* Small screens with constrained height */
    @media (max-width: 480px) and (max-height: 500px) {
        .header {
            padding: 4px 8px;
        }
        
        .header-title {
            font-size: 12px;
            gap: 2px;
        }
        
        .header-title-text {
            max-width: 60px;
        }
        
        .icon-button {
            min-width: 26px;
            min-height: 26px;
            padding: 3px;
        }
        
        .icon-button svg {
            width: 15px;
            height: 15px;
        }
        
        .button, .session-button {
            padding: 3px 7px;
            font-size: 9px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 26px;
            padding: 0 5px;
            font-size: 9px;
        }
        
        .main-menu-btn {
            width: 26px;
            height: 26px;
        }
    }

    /* Very small screens with very constrained height */
    @media (max-width: 360px) and (max-height: 400px) {
        .header {
            padding: 3px 6px;
        }
        
        .header-title {
            font-size: 11px;
            gap: 1px;
        }
        
        .header-title-text {
            max-width: 45px;
            font-size: 11px;
        }
        
        .header-actions {
            gap: 2px;
        }
        
        .icon-button {
            min-width: 22px;
            min-height: 22px;
            padding: 2px;
        }
        
        .icon-button svg {
            width: 13px;
            height: 13px;
        }
        
        .button, .session-button {
            padding: 2px 5px;
            font-size: 8px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 22px;
            padding: 0 4px;
            font-size: 8px;
        }
        
        .main-menu-btn {
            width: 22px;
            height: 22px;
        }
        
        .status-indicator {
            width: 3px;
            height: 3px;
        }
        
        /* Hide non-essential elements */
        .header-actions > span {
            display: none;
        }
    }

    /* Extreme constraints - very small and very short */
    @media (max-width: 320px) and (max-height: 350px) {
        .header {
            padding: 2px 4px;
        }
        
        .header-title {
            font-size: 10px;
            gap: 1px;
        }
        
        .header-title-text {
            max-width: 35px;
            font-size: 10px;
        }
        
        .header-actions {
            gap: 1px;
        }
        
        .icon-button {
            min-width: 18px;
            min-height: 18px;
            padding: 1px;
        }
        
        .icon-button svg {
            width: 11px;
            height: 11px;
        }
        
        .button, .session-button {
            padding: 1px 3px;
            font-size: 7px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 18px;
            padding: 0 2px;
            font-size: 7px;
        }
        
        .main-menu-btn {
            width: 18px;
            height: 18px;
        }
        
        /* Minimal status indicators */
        .status-container {
            gap: 1px;
        }
        
        .status-indicator {
            width: 2px;
            height: 2px;
        }
    }

    /* Landscape orientation with height constraints */
    @media (orientation: landscape) and (max-height: 500px) {
        .header {
            padding: 4px 12px;
        }
        
        .icon-button {
            min-width: 28px;
            min-height: 28px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 28px;
        }
        
        .main-menu-btn {
            width: 28px;
            height: 28px;
        }
        
        .clear-chat-btn {
            width: 28px;
            height: 28px;
        }
    }

    @media (orientation: landscape) and (max-height: 400px) {
        .header {
            padding: 3px 10px;
        }
        
        .header-title {
            font-size: 12px;
        }
        
        .icon-button {
            min-width: 24px;
            min-height: 24px;
            padding: 3px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 24px;
            font-size: 10px;
        }
        
        .main-menu-btn {
            width: 24px;
            height: 24px;
        }
        
        .clear-chat-btn {
            width: 24px;
            height: 24px;
        }
    }

    /* Portrait orientation with width constraints */
    @media (orientation: portrait) and (max-width: 400px) {
        .header-title-text {
            max-width: 70px;
        }
        
        .status-container {
            flex-direction: column;
            gap: 2px;
        }
    }

    @media (orientation: portrait) and (max-width: 320px) {
        .header-title-text {
            max-width: 50px;
        }
        
        .models-dropdown-btn {
            max-width: 80px;
        }
        
        .models-dropdown-text {
            max-width: 60px;
        }
    }

    /* Container queries for modern browsers */
    @container (inline-size < 500px) {
        .header {
            padding: 5px 8px;
        }
        
        .header-title {
            font-size: 13px;
        }
        
        .icon-button {
            min-width: 30px;
            min-height: 30px;
        }
    }

    @container (block-size < 400px) {
        .header {
            padding: 4px 10px;
        }
        
        .icon-button {
            min-width: 26px;
            min-height: 26px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 26px;
        }
    }

    @container (inline-size < 400px) and (block-size < 350px) {
        .header {
            padding: 3px 6px;
        }
        
        .header-title {
            font-size: 11px;
        }
        
        .icon-button {
            min-width: 22px;
            min-height: 22px;
        }
        
        .models-dropdown-btn,
        .theme-control-btn {
            height: 22px;
            font-size: 9px;
        }
    }

    /* High-density displays need smaller elements */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        @media (max-width: 480px) and (max-height: 600px) {
            .header {
                padding: 4px 8px;
            }
            
            .icon-button {
                min-width: 28px;
                min-height: 28px;
            }
            
            .models-dropdown-btn,
            .theme-control-btn {
                height: 28px;
            }
        }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .icon-button:hover,
        .button:hover,
        .session-button:hover {
            transform: none;
        }
    }

    /* Enhanced accessibility for small screens */
    @media (max-width: 480px) {
        .icon-button:focus,
        .button:focus,
        .models-dropdown-btn:focus,
        .theme-control-btn:focus,
        .main-menu-btn:focus {
            outline: 2px solid rgba(255, 255, 255, 0.6);
            outline-offset: 1px;
        }
    }

    /* Print styles */
    @media print {
        .header {
            background: white !important;
            color: black !important;
            border: 1px solid #ccc !important;
            border-radius: 0 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
        
        .header-actions {
            display: none !important;
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
        transform: scale(1.05);
    }

    .dropdown-item:disabled {
        cursor: not-allowed;
        filter: grayscale(50%);
    }

    .dropdown-item svg {
        width: 20px;
        height: 20px;
        stroke-width: 2;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .dropdown-item:hover svg {
        transform: scale(1.1);
    }

    .dropdown-item-label {
        flex-grow: 1;
    }

    .dropdown-item-value {
        font-size: 12px;
    }

    .dropdown-item.active .dropdown-item-value {
        color: #ffffff;
        font-weight: 600;
    }

    .dropdown-item.inactive .dropdown-item-value {
        color: #ffffff;
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
        cursor: not-allowed;
        background: rgba(255, 255, 255, 0.05);
        transform: none;
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        box-shadow: none;
        filter: grayscale(50%);
    }

    /* Combined theme and opacity control button styling */
    .theme-control-btn {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        cursor: pointer;
        border-radius: 12px;
        height: 40px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        position: relative;
        font-size: 12px;
        font-weight: 500;
        min-width: 80px;
    }

    .theme-control-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .theme-control-btn svg {
        width: 16px;
        height: 16px;
        transition: all 0.3s ease;
    }

    .theme-control-btn:hover svg {
        transform: scale(1.1);
    }

    .opacity-percentage {
        font-size: 11px;
        font-weight: 600;
        min-width: 28px;
        text-align: center;
        color: rgba(255, 255, 255, 0.9);
    }

    /* Combined theme and opacity dropdown container */
    .theme-control-dropdown-container {
        position: relative;
        display: inline-block;
    }

    /* Combined theme and opacity dropdown */
    .theme-control-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 12px;
        min-width: min(200px, calc(100vw - 40px));
        width: min(280px, calc(100vw - 20px));
        max-width: min(280px, calc(100vw - 20px));
        backdrop-filter: blur(20px);
        box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: fadeInDown 0.3s ease;
        max-height: min(75vh, 400px);
        height: auto;
        overflow-y: auto;
        overflow-x: hidden;
        resize: both;
        min-height: 200px;
    }

    .theme-control-dropdown::-webkit-scrollbar {
        width: 6px;
    }

    .theme-control-dropdown::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    .theme-control-dropdown::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        transition: background 0.2s ease;
    }

    .theme-control-dropdown::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Custom resize handle styling */
    .theme-control-dropdown::-webkit-resizer {
        background: linear-gradient(-45deg, 
            transparent 0%, 
            transparent 30%, 
            rgba(255, 255, 255, 0.2) 30%, 
            rgba(255, 255, 255, 0.2) 40%, 
            transparent 40%, 
            transparent 60%, 
            rgba(255, 255, 255, 0.2) 60%, 
            rgba(255, 255, 255, 0.2) 70%, 
            transparent 70%
        );
        border-radius: 0 0 12px 0;
    }

    .theme-control-section {
        margin-bottom: 12px;
    }

    .theme-control-section:last-child {
        margin-bottom: 0;
    }

    .theme-control-label {
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
    .theme-control-divider {
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
    .scroll-control {
        margin-top: 8px;
    }

    .scroll-control-toggle {
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

    .scroll-control-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .scroll-control-toggle.active {
        background: rgba(0, 122, 255, 0.2);
        border-color: rgba(0, 122, 255, 0.4);
        color: #ffffff;
    }

    .scroll-control-toggle.active:hover {
        background: rgba(0, 122, 255, 0.3);
        border-color: rgba(0, 122, 255, 0.5);
    }

    .toggle-status {
        margin-left: auto;
        font-size: 10px;
        font-weight: 600;
    }

    /* Vertical responsive design for theme control dropdown */
    @media (max-height: 800px) {
        .theme-control-dropdown {
            max-height: min(70vh, 350px);
            padding: 10px;
        }

        .theme-control-section {
            margin-bottom: 10px;
        }

        .opacity-slider-container {
            margin-bottom: 6px;
        }
    }

    @media (max-height: 600px) {
        .theme-control-dropdown {
            max-height: min(65vh, 300px);
            padding: 8px;
            min-width: min(180px, calc(100vw - 60px));
            width: min(250px, calc(100vw - 40px));
            max-width: min(250px, calc(100vw - 40px));
        }

        .theme-control-section {
            margin-bottom: 8px;
        }

        .theme-control-label {
            font-size: 11px;
            margin-bottom: 5px;
        }

        .theme-option {
            padding: 6px 8px;
            margin-bottom: 2px;
        }

        .opacity-preset-btn {
            padding: 5px 8px;
            font-size: 10px;
        }

        .scroll-control-toggle {
            padding: 5px 8px;
            font-size: 10px;
        }
    }

    @media (max-height: 480px) {
        .theme-control-dropdown {
            max-height: min(60vh, 240px);
            padding: 6px;
            min-width: min(160px, calc(100vw - 80px));
            width: min(220px, calc(100vw - 60px));
            max-width: min(220px, calc(100vw - 60px));
        }

        .theme-control-section {
            margin-bottom: 6px;
        }

        .theme-control-divider {
            margin: 8px 0;
        }

        .theme-option {
            padding: 4px 6px;
            font-size: 10px;
        }

        .theme-preview {
            width: 14px;
            height: 14px;
        }

        .opacity-preset-btn {
            padding: 4px 6px;
            font-size: 9px;
        }
    }

    @media (max-height: 400px) {
        .theme-control-dropdown {
            max-height: min(55vh, 180px);
            padding: 4px;
        }

        .theme-control-section {
            margin-bottom: 4px;
        }

        .theme-option {
            padding: 3px 4px;
            font-size: 9px;
            margin-bottom: 1px;
        }

        .opacity-preset-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px;
        }

        .opacity-preset-btn {
            padding: 3px 4px;
            font-size: 8px;
        }
    }

    /* Horizontal responsive design for theme control dropdown */
    @media (max-width: 768px) {
        .theme-control-dropdown {
            min-width: min(180px, calc(100vw - 60px));
            width: min(250px, calc(100vw - 40px));
            max-width: min(250px, calc(100vw - 40px));
            right: -5px;
        }

        .theme-control-btn {
            min-width: 65px;
            padding: 0 8px;
            font-size: 11px;
        }

        .opacity-percentage {
            font-size: 10px;
            min-width: 22px;
        }
    }

    @media (max-width: 480px) {
        .theme-control-dropdown {
            min-width: min(160px, calc(100vw - 80px));
            width: min(220px, calc(100vw - 60px));
            max-width: min(220px, calc(100vw - 60px));
            right: -10px;
            border-radius: 10px;
        }

        .theme-control-btn {
            min-width: 55px;
            padding: 0 6px;
            font-size: 10px;
            height: 36px;
        }

        .theme-option {
            padding: 5px 6px;
            font-size: 10px;
            gap: 6px;
        }

        .theme-preview {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 360px) {
        .theme-control-dropdown {
            min-width: min(140px, calc(100vw - 100px));
            width: min(200px, calc(100vw - 80px));
            max-width: min(200px, calc(100vw - 80px));
            right: -15px;
        }

        .theme-control-btn {
            min-width: 45px;
            padding: 0 4px;
            font-size: 9px;
            height: 32px;
        }

        .opacity-percentage {
            font-size: 8px;
            min-width: 18px;
        }
    }

    /* Remove old theme dropdown styles - now combined */

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
        filter: brightness(0.7);
    }

    .controls-status-indicator.both-inactive {
        background: #ffffff;
        filter: brightness(0.3);
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
        position: relative;
    }

    .main-menu-btn:hover:not(:disabled) {
        background: oklch(42% 0.01 67.558);
        border-color: rgba(255, 255, 255, 0.35);
        transform: translateY(-1px);
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
        flex-shrink: 1;
        min-width: 0;
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
        min-width: 120px;
        -webkit-app-region: no-drag;
        white-space: nowrap;
        overflow: hidden;
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
        max-width: clamp(80px, 12vw, 140px);
        flex: 1;
    }

    .models-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        min-width: 250px;
        max-width: min(320px, 90vw);
        width: clamp(280px, 25vw, 320px);
        background: rgba(20, 20, 20, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.5),
            0 12px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        z-index: 1000;
        overflow: hidden;
        animation: fadeInDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        max-height: min(400px, 80vh);
        transform-origin: top right;
        padding: 8px;
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .models-dropdown-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: min(320px, 70vh);
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 4px;
        margin-right: -4px;
        min-height: 0;
    }

    /* Custom scrollbar for models dropdown */
    .models-dropdown-content::-webkit-scrollbar {
        width: 6px;
    }

    .models-dropdown-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    .models-dropdown-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        transition: background 0.2s ease;
    }

    .models-dropdown-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Firefox scrollbar for models dropdown */
    .models-dropdown-content {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
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
        border-radius: 8px;
        margin-bottom: 2px;
    }

    .model-dropdown-item:last-child {
        margin-bottom: 0;
    }

    .model-dropdown-item:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }

    .model-dropdown-item.selected {
        background: rgba(255, 255, 255, 0.15);
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.2);
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

    /* Large screen adjustments */
    @media (min-width: 1200px) {
        .models-dropdown {
            width: 320px;
            max-width: 360px;
        }

        .models-dropdown-btn {
            max-width: 220px;
        }
        
        .models-dropdown-text {
            max-width: 160px;
        }
    }

    @media (min-width: 1600px) {
        .models-dropdown {
            width: 350px;
            max-width: 400px;
        }

        .models-dropdown-btn {
            max-width: 250px;
        }
        
        .models-dropdown-text {
            max-width: 180px;
        }
    }

    /* Vertical responsive design for models dropdown */
    @media (max-height: 800px) {
        .models-dropdown {
            max-height: min(70vh, 350px);
        }

        .models-dropdown-content {
            max-height: min(280px, 60vh);
        }
    }

    @media (max-height: 600px) {
        .models-dropdown {
            max-height: min(65vh, 300px);
            padding: 6px;
        }

        .models-dropdown-content {
            max-height: min(240px, 55vh);
        }

        .model-dropdown-item {
            padding: 10px 14px;
            gap: 10px;
        }

        .model-dropdown-item .model-icon {
            width: 18px;
            height: 18px;
            font-size: 14px;
        }
    }

    @media (max-height: 480px) {
        .models-dropdown {
            max-height: min(60vh, 250px);
            padding: 4px;
        }

        .models-dropdown-content {
            max-height: min(200px, 50vh);
        }

        .model-dropdown-item {
            padding: 8px 12px;
            gap: 8px;
            font-size: 13px;
        }

        .model-dropdown-item .model-icon {
            width: 16px;
            height: 16px;
            font-size: 12px;
        }

        .model-dropdown-item .model-name {
            font-size: 13px;
        }
    }

    @media (max-height: 400px) {
        .models-dropdown {
            max-height: min(55vh, 200px);
        }

        .models-dropdown-content {
            max-height: min(160px, 45vh);
        }

        .model-dropdown-item {
            padding: 6px 10px;
            gap: 6px;
            font-size: 12px;
        }

        .model-dropdown-item .model-name {
            font-size: 12px;
        }

        .model-dropdown-item .model-badge {
            font-size: 9px;
        }
    }

    /* Responsive Models Dropdown */
    @media (max-width: 768px) {
        .models-dropdown-btn {
            max-width: 140px;
            padding: 7px 10px;
            font-size: 12px;
        }
        
        .models-dropdown-text {
            max-width: 90px;
        }
        
        .models-dropdown {
            min-width: 220px;
            width: 240px;
            max-width: 280px;
            right: -10px;
            max-height: 350px;
        }

        .models-dropdown-content {
            max-height: 290px;
        }

        .model-dropdown-item {
            padding: 10px 14px;
            font-size: 13px;
            gap: 10px;
        }

        .model-dropdown-item .model-icon {
            width: 18px;
            height: 18px;
            font-size: 14px;
        }

        .model-dropdown-item .model-name {
            font-size: 13px;
        }

        .model-dropdown-item .model-badge {
            font-size: 10px;
        }

        .model-dropdown-item .custom-indicator {
            font-size: 8px;
            padding: 1px 3px;
        }
    }

    @media (max-width: 480px) {
        .models-dropdown-btn {
            max-width: 120px;
            padding: 6px 8px;
            font-size: 11px;
            gap: 6px;
        }
        
        .models-dropdown-text {
            max-width: 80px;
            font-size: 11px;
        }
        
        .models-dropdown {
            min-width: 200px;
            width: 220px;
            max-width: 260px;
            right: -15px;
            max-height: 320px;
            border-radius: 14px;
        }

        .models-dropdown-content {
            max-height: 260px;
        }

        .model-dropdown-item {
            padding: 8px 12px;
            font-size: 12px;
            gap: 8px;
        }

        .model-dropdown-item .model-icon {
            width: 16px;
            height: 16px;
            font-size: 12px;
        }

        .model-dropdown-item .model-name {
            font-size: 12px;
        }

        .model-dropdown-item .model-badge {
            font-size: 9px;
        }

        .model-dropdown-item .custom-indicator {
            font-size: 7px;
            padding: 1px 2px;
        }

        .model-dropdown-item svg {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 360px) {
        .models-dropdown-btn {
            max-width: 100px;
            padding: 5px 6px;
        }
        
        .models-dropdown-text {
            max-width: 70px;
            font-size: 10px;
        }
        
        .models-dropdown {
            min-width: 180px;
            width: 200px;
            right: -20px;
            max-height: 300px;
        }

        .models-dropdown-content {
            max-height: 240px;
        }

        .model-dropdown-item {
            padding: 7px 10px;
            font-size: 11px;
            gap: 6px;
        }

        .model-dropdown-item .model-name {
            font-size: 11px;
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

    /* Clear Chat Button */
    .clear-chat-btn {
        -webkit-app-region: no-drag;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color);
        width: 36px;
        height: 36px;
    }

    .clear-chat-btn:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
        color: #ef4444;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }

    .clear-chat-btn svg {
        color: inherit;
        transition: transform 0.3s ease;
    }

    .clear-chat-btn:hover svg {
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
        
        /* Responsive sizing with both horizontal and vertical considerations */
        width: clamp(260px, 20vw, 320px);
        min-width: min(260px, calc(100vw - 40px));
        max-width: min(320px, calc(100vw - 20px));
        min-height: 120px;
        max-height: min(80vh, 450px);
        height: auto;
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

    /* Vertical responsive design for main menu dropdown */
    @media (max-height: 800px) {
        .main-menu-dropdown {
            max-height: min(75vh, 400px);
        }

        .menu-item {
            padding: 10px 14px;
        }
    }

    @media (max-height: 600px) {
        .main-menu-dropdown {
            max-height: min(70vh, 350px);
            padding: 6px;
        }

        .menu-item {
            padding: 9px 12px;
            font-size: 13px;
            gap: 10px;
        }

        .menu-item svg {
            width: 16px;
            height: 16px;
        }

        .menu-item-status {
            font-size: 10px;
            padding: 2px 5px;
        }
    }

    @media (max-height: 480px) {
        .main-menu-dropdown {
            max-height: min(65vh, 280px);
            padding: 4px;
        }

        .menu-item {
            padding: 8px 10px;
            font-size: 12px;
            gap: 8px;
        }

        .menu-item svg {
            width: 15px;
            height: 15px;
        }

        .menu-divider {
            margin: 6px 8px;
        }
    }

    @media (max-height: 400px) {
        .main-menu-dropdown {
            max-height: min(60vh, 220px);
        }

        .menu-item {
            padding: 6px 8px;
            font-size: 11px;
            gap: 6px;
        }

        .menu-item svg {
            width: 14px;
            height: 14px;
        }

        .menu-item-status {
            font-size: 9px;
            padding: 1px 4px;
        }

        .menu-divider {
            margin: 4px 6px;
        }
    }

    @media (max-height: 350px) {
        .main-menu-dropdown {
            max-height: min(55vh, 180px);
            border-radius: 12px;
        }

        .menu-item {
            padding: 5px 7px;
            font-size: 10px;
            gap: 5px;
            border-radius: 8px;
        }

        .menu-item svg {
            width: 12px;
            height: 12px;
        }

        .menu-item-status {
            font-size: 8px;
            padding: 1px 3px;
        }
    }

    /* Enhanced responsive behavior for mobile (horizontal) */
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

    /* Container Queries for advanced responsive behavior */
    @container (height < 500px) {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            max-height: 60vh;
            border-radius: 12px;
        }

        .models-dropdown-content {
            max-height: 50vh;
        }

        .menu-item,
        .model-dropdown-item,
        .theme-option {
            padding: 6px 8px;
            font-size: 11px;
            gap: 6px;
        }
    }

    @container (width < 400px) {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            min-width: min(180px, calc(100vw - 100px));
            width: min(200px, calc(100vw - 80px));
            max-width: min(200px, calc(100vw - 80px));
            right: -20px;
        }

        .models-dropdown-btn,
        .theme-control-btn {
            max-width: 100px;
            padding: 5px 6px;
            font-size: 10px;
        }
    }

    /* Orientation-based responsive design */
    @media (orientation: landscape) and (max-height: 500px) {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            max-height: 80vh;
        }

        .models-dropdown-content {
            max-height: 70vh;
        }
    }

    @media (orientation: portrait) and (max-width: 500px) {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            width: calc(100vw - 30px);
            max-width: 90vw;
            right: -15px;
        }
    }

    /* High density display adjustments */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
        }

        .menu-item,
        .model-dropdown-item,
        .theme-option {
            border-width: 0.5px;
        }
    }

    /* Reduced motion accessibility */
    @media (prefers-reduced-motion: reduce) {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            animation: none;
        }

        .menu-item,
        .model-dropdown-item,
        .theme-option {
            transition: none;
        }

        .menu-item:hover,
        .model-dropdown-item:hover,
        .theme-option:hover {
            transform: none;
        }
    }

    /* Print styles */
    @media print {
        .models-dropdown,
        .theme-control-dropdown,
        .main-menu-dropdown {
            display: none !important;
        }
    }
    `;