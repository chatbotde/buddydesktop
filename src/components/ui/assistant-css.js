import { css } from '../../lit-core-2.7.4.min.js';

export const assistantStyles = css`
/* CSS Custom Properties for consistent theming */
:host {
    --primary-color: rgb(99, 102, 241);
    --primary-alpha-20: rgba(99, 102, 241, 0.2);
    --primary-alpha-30: rgba(99, 102, 241, 0.3);
    --primary-alpha-40: rgba(99, 102, 241, 0.4);
    --primary-alpha-50: rgba(99, 102, 241, 0.5);
    --primary-alpha-90: rgba(99, 102, 241, 0.9);
    
    --white-alpha-03: rgba(255, 255, 255, 0.03);
    --white-alpha-05: rgba(255, 255, 255, 0.05);
    --white-alpha-08: rgba(255, 255, 255, 0.08);
    --white-alpha-10: rgba(255, 255, 255, 0.1);
    --white-alpha-12: rgba(255, 255, 255, 0.12);
    --white-alpha-15: rgba(255, 255, 255, 0.15);
    --white-alpha-20: rgba(255, 255, 255, 0.2);
    --white-alpha-25: rgba(255, 255, 255, 0.25);
    --white-alpha-30: rgba(255, 255, 255, 0.3);
    --white-alpha-50: rgba(255, 255, 255, 0.5);
    
    --black-alpha-20: rgba(0, 0, 0, 0.2);
    --black-alpha-25: rgba(0, 0, 0, 0.25);
    --black-alpha-30: rgba(0, 0, 0, 0.3);
    --black-alpha-35: rgba(0, 0, 0, 0.35);
    --black-alpha-40: rgba(0, 0, 0, 0.4);
    --black-alpha-60: rgba(0, 0, 0, 0.6);
    
    --surface-primary: rgba(45, 45, 45, 0.95);
    --surface-secondary: rgba(40, 40, 40, 0.95);
    --surface-hover: rgba(50, 50, 50, 0.95);
    --surface-focus: rgba(55, 55, 55, 0.95);
    
    --border-radius-sm: 6px;
    --border-radius-md: 10px;
    --border-radius-lg: 14px;
    --border-radius-xl: 20px;
    --border-radius-2xl: 24px;
    
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 20px;
    
    --transition-fast: 0.15s ease-out;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;
    
    --scrollbar-width: 4px;
    --blur-light: blur(10px);
    --blur-medium: blur(15px);
    --blur-heavy: blur(18px);
    --blur-ultra: blur(20px);
    
    display: block;
    height: 100%;
    background: transparent;
}

/* Base Layout Components */
.assistant-view-root {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

.chat-container {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--spacing-lg) var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: 0;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: var(--white-alpha-20) transparent;
}

/* Scrollbar Styling */
.chat-container::-webkit-scrollbar {
    width: var(--scrollbar-width);
}

.chat-container::-webkit-scrollbar-track {
    background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
    background: var(--white-alpha-30);
    border-radius: 2px;
    transition: background var(--transition-slow);
}

.chat-container::-webkit-scrollbar-thumb:hover {
    background: var(--white-alpha-50);
}

/* Welcome Message */
.welcome-message {
    text-align: center;
    padding: 24px var(--spacing-lg);
    opacity: 0.8;
    font-size: 14px;
    line-height: 1.6;
    background: var(--white-alpha-05);
    border-radius: var(--border-radius-xl);
    border: 1px solid var(--white-alpha-10);
    backdrop-filter: var(--blur-medium);
    margin: var(--spacing-lg);
}

/* Text Input Container */
.text-input-container {
    display: flex;
    flex-direction: column;
    background: var(--surface-primary);
    border-radius: var(--border-radius-2xl);
    padding: var(--spacing-md) var(--spacing-lg);
    border: 1px solid var(--white-alpha-10);
    position: sticky;
    bottom: var(--spacing-lg);
    z-index: 10;
    margin: 0 var(--spacing-lg) var(--spacing-lg);
    backdrop-filter: var(--blur-ultra);
    -webkit-backdrop-filter: var(--blur-ultra);
    transition: all var(--transition-slow);
    box-shadow: 0 4px 20px var(--black-alpha-30);
}

.text-input-container:hover {
    background: var(--surface-hover);
    border-color: var(--white-alpha-15);
    box-shadow: 0 6px 25px var(--black-alpha-35);
}

.text-input-container:focus-within {
    background: var(--surface-focus);
    border-color: var(--primary-alpha-50);
    box-shadow: 
        0 8px 30px var(--black-alpha-40),
        0 0 0 2px var(--primary-alpha-20);
}

/* Drag and Drop States */
.text-input-container.drag-over {
    border-color: rgba(59, 130, 246, 0.6) !important;
    background: rgba(59, 130, 246, 0.1) !important;
    box-shadow: 
        0 8px 30px rgba(59, 130, 246, 0.3),
        0 0 0 2px rgba(59, 130, 246, 0.4) !important;
}

/* Screenshots Preview Section */
.screenshots-preview {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: 0 0 var(--spacing-md) 0;
    margin-bottom: var(--spacing-md);
}

.screenshots-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    opacity: 0.8;
    font-weight: 500;
}

.screenshot-count {
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 6px;
}

.screenshot-count::before {
    content: "📷";
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.clear-all-btn {
    background: var(--white-alpha-08);
    border: 1px solid var(--white-alpha-10);
    color: var(--text-color);
    cursor: pointer;
    padding: 6px var(--spacing-md);
    border-radius: var(--spacing-md);
    opacity: 0.7;
    font-size: 11px;
    font-weight: 500;
    transition: all var(--transition-normal);
    backdrop-filter: var(--blur-light);
}

.clear-all-btn:hover {
    opacity: 1;
    background: var(--white-alpha-15);
    border-color: var(--white-alpha-25);
}

.screenshots-grid {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.screenshot-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform var(--transition-normal);
}

.screenshot-item:hover {
    transform: translateY(-2px);
}

.screenshot-item img {
    width: 60px;
    height: 45px;
    object-fit: cover;
    border-radius: var(--spacing-sm);
    border: 1px solid var(--white-alpha-20);
    cursor: pointer;
    transition: all var(--transition-slow);
    box-shadow: 0 2px 8px var(--black-alpha-20);
}

.screenshot-item img:hover {
    border-color: var(--white-alpha-40);
    box-shadow: 0 4px 12px var(--black-alpha-25);
    transform: scale(1.05);
}

.screenshot-remove {
    position: absolute;
    top: -3px;
    right: -3px;
    background: var(--black-alpha-60);
    border: 1px solid var(--white-alpha-20);
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    color: white;
    transition: all var(--transition-normal);
    backdrop-filter: var(--blur-light);
}

.screenshot-remove:hover {
    background: rgba(239, 68, 68, 0.8);
    border-color: rgba(239, 68, 68, 0.6);
    transform: scale(1.1);
}

.screenshot-number {
    font-size: 9px;
    opacity: 0.7;
    margin-top: 2px;
    font-weight: 500;
}

/* Input Components */
.input-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.textarea-container {
    background: transparent;
    border-radius: var(--spacing-lg);
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
}

.textarea-container textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-color);
    font-size: 15px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 0;
    resize: none;
    min-width: 0;
    max-width: 100%;
    max-height: 100px;
    line-height: 1.4;
    transition: all var(--transition-normal);
    scrollbar-width: thin;
    scrollbar-color: var(--white-alpha-30) transparent;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
}

/* Textarea Scrollbar */
.textarea-container textarea::-webkit-scrollbar {
    width: var(--scrollbar-width);
}

.textarea-container textarea::-webkit-scrollbar-track {
    background: transparent;
}

.textarea-container textarea::-webkit-scrollbar-thumb {
    background: var(--white-alpha-30);
    border-radius: 2px;
    transition: background var(--transition-slow);
}

.textarea-container textarea::-webkit-scrollbar-thumb:hover {
    background: var(--white-alpha-50);
}

.textarea-container textarea::-webkit-scrollbar-corner {
    background: transparent;
}

.textarea-container textarea::placeholder {
    color: var(--white-alpha-50);
    opacity: 1;
}

.textarea-container textarea:focus {
    opacity: 1;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-sm);
}

.action-buttons-left,
.action-buttons-right {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
}

.action-btn {
    background: var(--white-alpha-08);
    border: 1px solid var(--white-alpha-10);
    color: var(--text-color);
    font-size: 14px;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all var(--transition-normal);
    opacity: 0.8;
    position: relative;
}

.action-btn:hover:not(:disabled):not(.at-limit) {
    background: var(--white-alpha-15);
    opacity: 1;
    border-color: var(--white-alpha-20);
    transform: translateY(-1px);
}

.action-btn:disabled,
.action-btn.at-limit {
    opacity: 0.3;
    cursor: not-allowed;
    background: var(--white-alpha-03);
}

.auto-screenshot-btn {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
    width: auto;
    padding: 0 var(--spacing-md);
    text-transform: uppercase;
}

.auto-screenshot-btn.active {
    background: var(--primary-alpha-20);
    border-color: var(--primary-alpha-30);
    color: #fff;
}

.auto-screenshot-btn.active:hover {
    background: var(--primary-alpha-30);
    border-color: var(--primary-alpha-40);
}

.screenshot-count-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    background: var(--primary-alpha-90);
    color: #fff;
    border: 1px solid var(--white-alpha-30);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: bold;
    backdrop-filter: var(--blur-light);
    box-shadow: 0 0 10px var(--black-alpha-20);
}

.send-btn {
    background: var(--primary-alpha-90);
    border: 1px solid var(--primary-alpha-50);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-normal);
    opacity: 0.9;
}

.send-btn:hover:not(:disabled) {
    background: var(--primary-color);
    border-color: rgba(99, 102, 241, 0.7);
    opacity: 1;
    transform: translateY(-1px);
}

.send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--white-alpha-05);
    transform: none;
    border-color: var(--white-alpha-10);
    color: var(--text-color);
    box-shadow: none;
}

.stop-btn {
    background: rgba(239, 68, 68, 0.9);
    border: 1px solid rgba(239, 68, 68, 0.5);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-normal);
    opacity: 0.9;
    animation: stopButtonPulse 2s ease-in-out infinite;
}

@keyframes stopButtonPulse {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    }
    50% {
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
}

.stop-btn:hover {
    background: rgb(239, 68, 68);
    border-color: rgba(239, 68, 68, 0.7);
    opacity: 1;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.stop-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
}

/* Animations */
.chat-container > * {
    animation: fadeInUp var(--transition-slow);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Focus States */
.action-btn:focus-visible,
.send-btn:focus-visible {
    outline: 2px solid var(--primary-alpha-50);
    outline-offset: 2px;
}

.stop-btn:focus-visible {
    outline: 2px solid rgba(239, 68, 68, 0.5);
    outline-offset: 2px;
}

/* Dropdown Components */
.actions-dropdown-container {
    position: relative;
}

.actions-dropdown {
    position: absolute;
    bottom: calc(100% + var(--spacing-sm));
    right: 0;
    background: var(--surface-secondary);
    backdrop-filter: var(--blur-heavy);
    -webkit-backdrop-filter: var(--blur-heavy);
    border: 1px solid var(--white-alpha-12);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 20;
    box-shadow: 0 10px 40px var(--black-alpha-30);
    animation: fadeInUp var(--transition-fast);
    width: 240px;
}

.dropdown-item {
    background: var(--white-alpha-08);
    border: 1px solid var(--white-alpha-10);
    color: var(--text-color);
    cursor: pointer;
    padding: 9px var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-size: 13px;
    font-weight: 500;
    transition: all var(--transition-normal);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    text-align: left;
    width: 100%;
}

.dropdown-item:hover:not(:disabled) {
    background: var(--white-alpha-15);
    border-color: var(--white-alpha-25);
    transform: translateY(-1px);
}

.dropdown-item:disabled,
.dropdown-item.at-limit {
    opacity: 0.5;
    cursor: not-allowed;
}

.dropdown-item svg {
    width: 18px;
    height: 18px;
    opacity: 0.8;
    stroke-width: 1.8;
    flex-shrink: 0;
}

.dropdown-item-label {
    flex-grow: 1;
}

.dropdown-item-value {
    opacity: 0.7;
    font-size: 12px;
}

/* Loading Indicator */
.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: var(--spacing-md) var(--spacing-lg);
    margin: var(--spacing-sm) var(--spacing-lg);
}

.loading-dots {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;
}

.loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: loadingPulse 1.4s ease-in-out infinite both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }
.loading-dot:nth-child(3) { animation-delay: 0s; }

/* Stopping animation for smooth transition */
.loading-indicator.stopping {
    animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-10px);
    }
}

@keyframes loadingPulse {
    0%, 80%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
    }
    40% {
        opacity: 1;
        transform: scale(1);
    }
}

/* Responsive Design - Tablet/Mobile */
@media (max-width: 768px) {
    .text-input-container {
        margin: 0 var(--spacing-sm) var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius-xl);
    }
    
    .input-row {
        gap: var(--spacing-md);
    }
    
    .textarea-container {
        padding: var(--spacing-sm) var(--spacing-sm);
        border-radius: var(--border-radius-lg);
    }
    
    .textarea-container textarea {
        font-size: 14px;
    }
    
    .action-buttons,
    .action-buttons-left,
    .action-buttons-right {
        gap: 6px;
    }
    
    .action-btn {
        width: 28px;
        height: 28px;
        border-radius: var(--spacing-sm);
        font-size: 12px;
    }
    
    .auto-screenshot-btn {
        padding: 0 var(--spacing-sm);
        font-size: 9px;
    }
    
    .send-btn,
    .stop-btn {
        width: 28px;
        height: 28px;
        border-radius: var(--spacing-sm);
        font-size: 14px;
    }
    
    .actions-dropdown {
        width: 200px;
        padding: 6px;
        border-radius: var(--spacing-md);
        bottom: calc(100% + 6px);
    }
    
    .dropdown-item {
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--spacing-sm);
        font-size: 12px;
        gap: var(--spacing-md);
    }
    
    .dropdown-item svg {
        width: 16px;
        height: 16px;
    }
    
    .dropdown-item-value {
        font-size: 11px;
    }
    
    .screenshot-count-badge {
        width: 14px;
        height: 14px;
        font-size: 8px;
        top: -2px;
        right: -2px;
    }
    
    .screenshots-preview {
        padding: 0 0 var(--spacing-md) 0;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
    }
    
    .screenshots-grid {
        gap: var(--spacing-sm);
    }
    
    .screenshot-item img {
        width: 50px;
        height: 38px;
        border-radius: 6px;
    }
    
    .screenshot-remove {
        width: 16px;
        height: 16px;
        font-size: 10px;
        top: -2px;
        right: -2px;
    }
    
    .clear-all-btn {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: 10px;
        border-radius: var(--spacing-sm);
    }
    
    .chat-container {
        padding: var(--spacing-md) var(--spacing-sm);
        gap: var(--spacing-md);
    }
    
    .welcome-message {
        padding: 20px var(--spacing-md);
        margin: var(--spacing-md);
        border-radius: var(--spacing-lg);
        font-size: 13px;
    }
}

/* Responsive Design - Small Mobile */
@media (max-width: 480px) {
    .text-input-container {
        margin: 0 var(--spacing-xs) var(--spacing-xs);
        padding: var(--spacing-sm) var(--spacing-sm);
        border-radius: 18px;
    }
    
    .input-row {
        gap: var(--spacing-sm);
    }
    
    .textarea-container {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--spacing-md);
    }
    
    .textarea-container textarea {
        font-size: 13px;
    }
    
    .action-buttons,
    .action-buttons-left,
    .action-buttons-right {
        gap: var(--spacing-xs);
    }
    
    .action-btn {
        width: 24px;
        height: 24px;
        border-radius: var(--border-radius-sm);
        font-size: 10px;
    }
    
    .auto-screenshot-btn {
        padding: 0 6px;
        font-size: 8px;
    }
    
    .send-btn,
    .stop-btn {
        width: 24px;
        height: 24px;
        border-radius: var(--border-radius-sm);
        font-size: 12px;
    }
    
    .actions-dropdown {
        width: 180px;
        padding: var(--spacing-xs);
        border-radius: var(--spacing-md);
        bottom: calc(100% + var(--spacing-xs));
    }
    
    .dropdown-item {
        padding: 6px var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 11px;
        gap: var(--spacing-sm);
    }
    
    .dropdown-item svg {
        width: 14px;
        height: 14px;
    }
    
    .dropdown-item-value {
        font-size: 10px;
    }
    
    .screenshot-count-badge {
        width: 12px;
        height: 12px;
        font-size: 7px;
    }
    
    .screenshots-preview {
        padding: 0 0 var(--spacing-md) 0;
        gap: 6px;
        margin-bottom: var(--spacing-md);
    }
    
    .screenshots-grid {
        gap: 6px;
    }
    
    .screenshot-item img {
        width: 45px;
        height: 34px;
        border-radius: 5px;
    }
    
    .screenshot-remove {
        width: 14px;
        height: 14px;
        font-size: 9px;
    }
    
    .clear-all-btn {
        padding: 2px 6px;
        font-size: 9px;
        border-radius: var(--border-radius-sm);
    }
    
    .chat-container {
        padding: var(--spacing-sm) var(--spacing-xs);
        gap: var(--spacing-sm);
    }
    
    .welcome-message {
        padding: 16px var(--spacing-sm);
        margin: var(--spacing-sm);
        border-radius: var(--border-radius-lg);
        font-size: 12px;
    }
    
    .loading-indicator {
        padding: var(--spacing-sm) var(--spacing-md);
        margin: 4px var(--spacing-sm);
    }
    
    .loading-dot {
        width: 5px;
        height: 5px;
    }
}
`;