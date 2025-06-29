import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-chat-message.js';

class BuddyAssistantView extends LitElement {
    static properties = {
        chatMessages: { type: Array },
        isStreamingActive: { type: Boolean },
        attachedScreenshots: { type: Array }, // Array of base64 screenshot data
        autoScreenshotEnabled: { type: Boolean }, // New property for auto screenshot
        isActionsMenuOpen: { type: Boolean },
        isWaitingForResponse: { type: Boolean }, // New property for loading state

    };

    constructor() {
        super();
        this.attachedScreenshots = [];
        this.autoScreenshotEnabled = true; // Enable auto screenshot by default
        this.hasTypedInCurrentSession = false; // Track if user has typed in current input session
        this.isActionsMenuOpen = false;
        this.isWaitingForResponse = false; // Initialize loading state
        this.boundOutsideClickHandler = this._handleOutsideClick.bind(this);
        // Simple auto-scroll for input/output visibility
        this.isUserScrolledUp = false;
    }

    connectedCallback() {
        super.connectedCallback();
        // Set up scroll listener to detect when user scrolls up
        this.updateComplete.then(() => {
            this._setupScrollListener();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.boundOutsideClickHandler);
        this._cleanupScrollListener();
    }

    _toggleActionsMenu() {
        this.isActionsMenuOpen = !this.isActionsMenuOpen;
        this.requestUpdate();
        if (this.isActionsMenuOpen) {
            setTimeout(() => {
                document.addEventListener('click', this.boundOutsideClickHandler);
            }, 0);
        } else {
            document.removeEventListener('click', this.boundOutsideClickHandler);
        }
    }

    _closeActionsMenu() {
        if (this.isActionsMenuOpen) {
            this.isActionsMenuOpen = false;
            document.removeEventListener('click', this.boundOutsideClickHandler);
            this.requestUpdate();
        }
    }

    _handleOutsideClick(e) {
        if (!this.renderRoot.querySelector('.actions-dropdown-container')?.contains(e.target)) {
            this._closeActionsMenu();
        }
    }

    _setupScrollListener() {
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (!chatContainer) return;

        this.boundScrollHandler = this._handleScroll.bind(this);
        chatContainer.addEventListener('scroll', this.boundScrollHandler);
    }

    _cleanupScrollListener() {
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (chatContainer && this.boundScrollHandler) {
            chatContainer.removeEventListener('scroll', this.boundScrollHandler);
        }
    }

    _handleScroll() {
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (!chatContainer) return;

        const scrollTop = chatContainer.scrollTop;
        const scrollHeight = chatContainer.scrollHeight;
        const clientHeight = chatContainer.clientHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        // Consider user "scrolled up" if they're more than 50px from bottom
        this.isUserScrolledUp = distanceFromBottom > 50;
    }

    _scrollToShowLatestMessage(force = false) {
        // Simple scroll to show the latest message
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (!chatContainer) return;

        // Don't auto-scroll if user has scrolled up (unless forced)
        if (this.isUserScrolledUp && !force) {
            return;
        }

        // Use a slight delay to ensure DOM is updated
        setTimeout(() => {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    static styles = css`
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
            max-height: 100px;
            line-height: 1.4;
            transition: all 0.2s ease;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
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

    async _onCaptureScreenshot() {
        this._closeActionsMenu();
        if (this.attachedScreenshots.length >= 3) {
            console.warn('Maximum of 3 screenshots allowed');
            return;
        }
        
        try {
            // Request screenshot from renderer
            const screenshotData = await window.buddy.captureScreenshot();
            if (screenshotData) {
                this.attachedScreenshots = [...this.attachedScreenshots, screenshotData];
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
        }
    }

    async _captureAutoScreenshot() {
        if (!this.autoScreenshotEnabled || this.attachedScreenshots.length >= 3) {
            return;
        }
        
        try {
            const screenshotData = await window.buddy.captureScreenshot();
            if (screenshotData) {
                this.attachedScreenshots = [...this.attachedScreenshots, screenshotData];
                this.requestUpdate();
                console.log('Auto screenshot captured');
            }
        } catch (error) {
            console.error('Failed to capture auto screenshot:', error);
        }
    }

    _onRemoveScreenshot(index) {
        this.attachedScreenshots = this.attachedScreenshots.filter((_, i) => i !== index);
        this.requestUpdate();
    }

    _onClearAllScreenshots() {
        this.attachedScreenshots = [];
        this.requestUpdate();
    }

    _onViewScreenshot(screenshot) {
        // Open screenshot in a new window
        const newWindow = window.open();
        newWindow.document.write(`
            <html>
                <head><title>Screenshot</title></head>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                    <img src="data:image/jpeg;base64,${screenshot}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                </body>
            </html>
        `);
    }

    _onSend() {
        const textarea = this.renderRoot.querySelector('#textInput');
        const text = textarea?.value.trim() || '';
        
        if (text || this.attachedScreenshots.length > 0) {
            // Set loading state
            this.isWaitingForResponse = true;
            this.requestUpdate();
            
            this.dispatchEvent(new CustomEvent('send-message', { 
                detail: { 
                    text,
                    screenshots: [...this.attachedScreenshots] // Send array of screenshots
                }, 
                bubbles: true, 
                composed: true 
            }));
            textarea.value = '';
            this.attachedScreenshots = [];
            this.hasTypedInCurrentSession = false; // Reset for next message
            this.requestUpdate();
            
            // Scroll to show the user's input message (always force for user input)
            this._scrollToShowLatestMessage(true);
        }
    }

    _onKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._onSend();
        }
    }

    _onTextInput(e) {
        // Handle auto screenshot on first keystroke
        if (this.autoScreenshotEnabled && !this.hasTypedInCurrentSession && e.target.value.length === 1) {
            this.hasTypedInCurrentSession = true;
            this._captureAutoScreenshot();
        }
        
        // Handle textarea resizing
        this._onResize(e);
    }

    _onResize(e) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    _onDelete(e) {
        this.dispatchEvent(new CustomEvent('delete-message', { detail: { id: e.detail.id }, bubbles: true, composed: true }));
    }

    _onCopy(message) {
        this.dispatchEvent(new CustomEvent('copy-message', { detail: { message }, bubbles: true, composed: true }));
    }

    _onMessageContentUpdated(e) {
        // Scroll to show assistant response when it starts streaming (only if user hasn't scrolled up)
        if (e.detail.isStreaming && e.detail.hasContent) {
            this._scrollToShowLatestMessage(); // Don't force - respect user scroll position
        }
    }

    // Method to clear loading state when response starts
    clearLoadingState() {
        this.isWaitingForResponse = false;
        this.requestUpdate();
    }

    // Override updated to automatically clear loading state when streaming starts or messages change
    updated(changedProperties) {
        super.updated(changedProperties);
        
        // Clear loading state when streaming starts or when new messages arrive
        if (changedProperties.has('isStreamingActive') && this.isStreamingActive) {
            this.isWaitingForResponse = false;
        }
        
        // Clear loading state when new assistant messages arrive
        if (changedProperties.has('chatMessages') && this.chatMessages) {
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'assistant' && this.isWaitingForResponse) {
                this.isWaitingForResponse = false;
            }
        }
        
        // Scroll to show new messages when they arrive
        if (changedProperties.has('chatMessages') && this.chatMessages && this.chatMessages.length > 0) {
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];
            // Only scroll for new assistant messages (user messages are handled in _onSend)
            if (lastMessage && lastMessage.sender === 'assistant') {
                this._scrollToShowLatestMessage(); // Don't force - respect user scroll position
            }
        }
        
        // Re-setup scroll listener if needed
        if (changedProperties.has('chatMessages')) {
            this.updateComplete.then(() => {
                if (!this.boundScrollHandler) {
                    this._setupScrollListener();
                }
            });
        }
    }

    _toggleAutoScreenshot() {
        this.autoScreenshotEnabled = !this.autoScreenshotEnabled;
        this.requestUpdate();
        console.log('Auto screenshot:', this.autoScreenshotEnabled ? 'enabled' : 'disabled');
        this._closeActionsMenu();
    }

    _onUploadImageClick() {
        this.renderRoot.querySelector('#fileInput').click();
        this._closeActionsMenu();
    }

    _handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (this.attachedScreenshots.length >= 3) {
            console.warn('Maximum of 3 images allowed');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            // event.target.result is the base64-encoded string
            const base64String = event.target.result.split(',')[1];
            this.attachedScreenshots = [...this.attachedScreenshots, base64String];
            this.requestUpdate();
        };
        reader.readAsDataURL(file);

        // Reset file input to allow selecting the same file again
        e.target.value = '';
    }

    render() {
        const isAtLimit = this.attachedScreenshots.length >= 3;
        
        return html`
            <div class="assistant-view-root">
                <input 
                    type="file" 
                    id="fileInput" 
                    hidden 
                    accept="image/*" 
                    @change=${this._handleFileSelect}
                />
                <div class="chat-container">
                    ${!this.chatMessages || this.chatMessages.length === 0 
                        ? html`
                            <div class="welcome-message">
                                <p>Welcome! Start a session to begin chatting with your AI assistant.</p>
                                ${this.autoScreenshotEnabled ? html`
                                    <p style="font-size: 12px; opacity: 0.6; margin-top: 8px;">
                                        📸 Auto-screenshot is enabled - a screenshot will be captured when you start typing
                                    </p>
                                ` : ''}
                            </div>
                          `
                        : this.chatMessages.map((message) => html`
                            <buddy-chat-message
                                key=${message.id}
                                .id=${message.id}
                                .text=${message.text}
                                .sender=${message.sender}
                                .timestamp=${message.timestamp}
                                .isStreaming=${message.isStreaming}
                                .screenshots=${message.screenshots}
                                @delete-message=${(e) => this._onDelete(e)}
                                @copy-message=${() => this._onCopy(message)}
                                @message-content-updated=${this._onMessageContentUpdated}
                            ></buddy-chat-message>
                          `)
                    }
                    ${this.isWaitingForResponse ? html`
                        <div class="loading-indicator">
                            <div class="loading-dots">
                                <div class="loading-dot"></div>
                                <div class="loading-dot"></div>
                                <div class="loading-dot"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="text-input-container">
                    ${this.attachedScreenshots.length > 0 ? html`
                        <div class="screenshots-preview">
                            <div class="screenshots-header">
                                <span class="screenshot-count">${this.attachedScreenshots.length}/3 images</span>
                                <button class="clear-all-btn" @click=${this._onClearAllScreenshots} title="Clear all images">
                                    Clear all
                                </button>
                            </div>
                            <div class="screenshots-grid">
                                ${this.attachedScreenshots.map((screenshot, index) => html`
                                    <div class="screenshot-item">
                                        <img 
                                            src="data:image/jpeg;base64,${screenshot}" 
                                            alt="Attached image ${index + 1}" 
                                            @click=${() => this._onViewScreenshot(screenshot)}
                                            title="Click to view full size"
                                        />
                                        <button 
                                            class="screenshot-remove" 
                                            @click=${() => this._onRemoveScreenshot(index)}
                                            title="Remove image"
                                        >
                                            ×
                                        </button>
                                        <div class="screenshot-number">#${index + 1}</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}
                    <div class="input-row">
                        <textarea
                            id="textInput"
                            rows="1"
                            placeholder="${this.autoScreenshotEnabled ? 'Ask me anything... (auto-screenshot enabled)' : 'Ask me anything...'}"
                            @keydown=${this._onKeydown}
                            @input=${this._onTextInput}
                        ></textarea>
                        <div class="action-buttons">
                             <div class="actions-dropdown-container">
                                <button 
                                    class="action-btn"
                                    @click=${this._toggleActionsMenu}
                                    title="More actions"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                    ${this.attachedScreenshots.length > 0 ? html`
                                        <span class="screenshot-count-badge">${this.attachedScreenshots.length}</span>
                                    ` : ''}
                                </button>

                                ${this.isActionsMenuOpen ? html`
                                    <div class="actions-dropdown">
                                        <button class="dropdown-item" @click=${this._toggleAutoScreenshot}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5v3m0 9v3m4.5-10.5l-2.12 2.12M6.62 17.38l-2.12 2.12M19.5 12h-3m-9 0H4.5m10.5 2.12-2.12 2.12M6.62 6.62 4.5 4.5"/></svg>
                                            <span class="dropdown-item-label">Auto-screenshot</span>
                                            <span class="dropdown-item-value">${this.autoScreenshotEnabled ? 'ON' : 'OFF'}</span>
                                        </button>
                                        <button
                                            class="dropdown-item ${isAtLimit ? 'at-limit' : ''}"
                                            @click=${this._onUploadImageClick}
                                            ?disabled=${this.isStreamingActive || isAtLimit}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                            <span class="dropdown-item-label">Attach image</span>
                                        </button>
                                        <button
                                            class="dropdown-item ${isAtLimit ? 'at-limit' : ''}"
                                            @click=${this._onCaptureScreenshot}
                                            ?disabled=${this.isStreamingActive || isAtLimit}
                                        >
                                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                                <circle cx="12" cy="13" r="3"></circle>
                                            </svg>
                                            <span class="dropdown-item-label">Capture screenshot</span>
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                           
                            <button
                                class="send-btn"
                                @click=${this._onSend}
                                title="Send message"
                                ?disabled=${this.isStreamingActive || this.isWaitingForResponse}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 18v-6H5l7-7 7 7h-4v6H9z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-assistant-view', BuddyAssistantView); 