import { css } from '../../lit-core-2.7.4.min.js';

export const assistantStyles = css`
:host { 
    display: block; 
    height: 100%; 
    background: transparent;
}

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
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 0;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* Custom scrollbar for webkit browsers */
.chat-container::-webkit-scrollbar {
    width: 4px;
}

.chat-container::-webkit-scrollbar-track {
    background: transparent;
}

.chat-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    transition: background 0.3s ease;
}

.chat-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

.welcome-message {
    text-align: center;
    padding: 40px 20px;
    opacity: 0.8;
    font-size: 14px;
    line-height: 1.6;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    margin: 20px;
}

.text-input-container {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 10px 10px 10px 16px;
    box-shadow: 
        0 4px 30px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    position: sticky;
    bottom: 8px;
    z-index: 10;
    margin: 0 8px 8px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    transition: all 0.3s ease;
}

.text-input-container:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 
        0 6px 35px rgba(0, 0, 0, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

.text-input-container:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 
        0 8px 40px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.08);
    transform: translateY(0);
}

/* Drag and drop visual feedback */
.text-input-container.drag-over {
    border-color: rgba(59, 130, 246, 0.5) !important;
    background: rgba(59, 130, 246, 0.1) !important;
    box-shadow: 
        0 8px 40px rgba(59, 130, 246, 0.2),
        inset 0 1px 1px rgba(59, 130, 246, 0.2),
        0 0 0 2px rgba(59, 130, 246, 0.3) !important;
}

.screenshots-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 6px 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    margin-bottom: 8px;
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
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 10px;
    opacity: 0.7;
    font-size: 11px;
    font-weight: 500;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.clear-all-btn:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
}

.screenshots-grid {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.screenshot-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s ease;
}

.screenshot-item:hover {
    transform: translateY(-2px);
}

.screenshot-item img {
    width: 60px;
    height: 45px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.screenshot-item img:hover {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transform: scale(1.05);
}

.screenshot-remove {
    position: absolute;
    top: -3px;
    right: -3px;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
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
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
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

.input-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    padding-right: 6px;
}

.input-row textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-color);
    font-size: 15px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 10px 0;
    resize: none;
    min-width: 0;
    max-width: 100%;
    width: 100%;
    max-height: 100px;
    line-height: 1.4;
    transition: all 0.2s ease;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    word-wrap: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
}

/* Custom scrollbar for textarea in webkit browsers */
.input-row textarea::-webkit-scrollbar {
    width: 4px;
}

.input-row textarea::-webkit-scrollbar-track {
    background: transparent;
}

.input-row textarea::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    transition: background 0.3s ease;
}

.input-row textarea::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

.input-row textarea::-webkit-scrollbar-corner {
    background: transparent;
}

.input-row textarea::placeholder {
    color: var(--placeholder-color);
    opacity: 0.6;
}

.input-row textarea:focus {
    opacity: 1;
}

.action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    padding-bottom: 4px;
}

.action-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: var(--text-color);
    font-size: 16px;
    cursor: pointer;
    border-radius: 14px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    opacity: 0.8;
    position: relative;
    backdrop-filter: blur(10px);
}

.action-btn:hover:not(:disabled):not(.at-limit) {
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
}

.action-btn:disabled,
.action-btn.at-limit {
    opacity: 0.3;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.03);
}

.auto-screenshot-btn {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: auto;
    padding: 0 14px;
}

.auto-screenshot-btn.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
}

.auto-screenshot-btn.active:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.35);
}

.screenshot-count-badge {
    position: absolute;
    top: -3px;
    right: -3px;
    background: rgba(255, 255, 255, 0.9);
    color: #000;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: bold;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.send-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    border-radius: 16px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    opacity: 0.9;
}

.send-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-1px) scale(1.05);
    opacity: 1;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
    transform: none;
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    box-shadow: none;
}

/* Smooth fade-in animation for messages */
.chat-container > * {
    animation: fadeInUp 0.3s ease-out;
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

/* Enhanced focus states */
.action-btn:focus-visible,
.send-btn:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.4);
    outline-offset: 2px;
}



.actions-dropdown-container {
    position: relative;
}

.actions-dropdown {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background: rgba(40, 40, 40, 0.85);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 20;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: fadeInUp 0.15s ease-out;
    width: 240px;
}

.dropdown-item {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    cursor: pointer;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    width: 100%;
}

.dropdown-item:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
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

/* Loading dots animation */
.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px 20px;
    margin: 8px 20px;
}

.loading-dots {
    display: flex;
    gap: 4px;
    align-items: center;
}

.loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    animation: loadingPulse 1.4s ease-in-out infinite both;
}

.loading-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.loading-dot:nth-child(2) {
    animation-delay: -0.16s;
}

.loading-dot:nth-child(3) {
    animation-delay: 0s;
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

/* Mobile responsiveness */
@media (max-width: 768px) {
    .text-input-container {
        margin: 0 4px 4px;
        padding: 8px 8px 8px 12px;
        border-radius: 20px;
    }
    
    .input-row {
        gap: 6px;
        padding-right: 4px;
    }
    
    .input-row textarea {
        font-size: 14px;
        padding: 8px 0;
    }
    
    .action-buttons {
        gap: 6px;
    }
    
    .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 12px;
        font-size: 14px;
    }
    
    .auto-screenshot-btn {
        padding: 0 10px;
        font-size: 10px;
    }
    
    .send-btn {
        width: 36px;
        height: 36px;
        border-radius: 14px;
        font-size: 16px;
    }
    
    .actions-dropdown {
        width: 200px;
        padding: 6px;
        border-radius: 12px;
        bottom: calc(100% + 6px);
    }
    
    .dropdown-item {
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 12px;
        gap: 10px;
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
        padding: 8px 4px 10px 0;
        gap: 8px;
    }
    
    .screenshots-grid {
        gap: 8px;
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
        padding: 3px 8px;
        font-size: 10px;
        border-radius: 8px;
    }
    
    .chat-container {
        padding: 16px 12px;
        gap: 10px;
    }
    
    .welcome-message {
        padding: 30px 16px;
        margin: 16px;
        border-radius: 16px;
        font-size: 13px;
    }
    

}

@media (max-width: 480px) {
    .text-input-container {
        margin: 0 2px 2px;
        padding: 6px 6px 6px 10px;
        border-radius: 18px;
    }
    
    .input-row {
        gap: 4px;
        padding-right: 2px;
    }
    
    .input-row textarea {
        font-size: 13px;
        padding: 6px 0;
    }
    
    .action-buttons {
        gap: 4px;
    }
    
    .action-btn {
        width: 28px;
        height: 28px;
        border-radius: 10px;
        font-size: 12px;
    }
    
    .auto-screenshot-btn {
        padding: 0 8px;
        font-size: 9px;
    }
    
    .send-btn {
        width: 32px;
        height: 32px;
        border-radius: 12px;
        font-size: 14px;
    }
    
    .actions-dropdown {
        width: 180px;
        padding: 4px;
        border-radius: 10px;
        bottom: calc(100% + 4px);
    }
    
    .dropdown-item {
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 11px;
        gap: 8px;
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
        padding: 6px 2px 8px 0;
        gap: 6px;
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
        border-radius: 6px;
    }
    
    .chat-container {
        padding: 12px 8px;
        gap: 8px;
    }
    
    .welcome-message {
        padding: 24px 12px;
        margin: 12px;
        border-radius: 14px;
        font-size: 12px;
    }
    
    .loading-indicator {
        padding: 12px 16px;
        margin: 6px 12px;
    }
    
    .loading-dot {
        width: 5px;
        height: 5px;
    }
    

}
`;