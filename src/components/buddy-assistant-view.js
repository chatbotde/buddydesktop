import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-chat-message.js';

class BuddyAssistantView extends LitElement {
    static properties = {
        chatMessages: { type: Array },
        isStreamingActive: { type: Boolean },
        attachedScreenshots: { type: Array }, // Array of base64 screenshot data
        autoScreenshotEnabled: { type: Boolean }, // New property for auto screenshot
    };

    constructor() {
        super();
        this.attachedScreenshots = [];
        this.autoScreenshotEnabled = true; // Enable auto screenshot by default
        this.hasTypedInCurrentSession = false; // Track if user has typed in current input session
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
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            transition: background 0.3s ease;
        }
        
        .chat-container::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .welcome-message {
            text-align: center;
            padding: 30px 20px;
            opacity: 0.7;
            font-size: 14px;
            line-height: 1.6;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            margin: 20px 0;
        }
        
        .text-input-container {
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 12px 16px;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: sticky;
            bottom: 12px;
            z-index: 10;
            margin: 0 12px 12px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            transition: all 0.3s ease;
        }
        
        .text-input-container:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 
                0 12px 40px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        .text-input-container:focus-within {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 
                0 16px 48px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
        }
        
        .screenshots-preview {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px 0 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            margin-bottom: 10px;
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
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
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
            border: 1px solid rgba(255, 255, 255, 0.15);
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .screenshot-item img:hover {
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
            gap: 6px;
            align-items: center;
            padding-bottom: 2px;
        }
        
        .action-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            font-size: 16px;
            cursor: pointer;
            border-radius: 12px;
            padding: 8px;
            transition: all 0.3s ease;
            opacity: 0.7;
            position: relative;
            backdrop-filter: blur(10px);
        }
        
        .action-btn:hover:not(:disabled):not(.at-limit) {
            background: rgba(255, 255, 255, 0.15);
            opacity: 1;
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }
        
        .action-btn:disabled,
        .action-btn.at-limit {
            opacity: 0.3;
            cursor: not-allowed;
            background: rgba(255, 255, 255, 0.03);
        }
        
        .auto-screenshot-btn {
            font-size: 18px;
        }
        
        .auto-screenshot-btn.active {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            color: #4ade80;
        }
        
        .auto-screenshot-btn.active:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
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
        }
        
        .send-btn {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-color);
            font-size: 18px;
            cursor: pointer;
            border-radius: 14px;
            padding: 10px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .send-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        
        .send-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            background: rgba(255, 255, 255, 0.05);
            transform: none;
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
    `;

    async _onCaptureScreenshot() {
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

    _toggleAutoScreenshot() {
        this.autoScreenshotEnabled = !this.autoScreenshotEnabled;
        this.requestUpdate();
        console.log('Auto screenshot:', this.autoScreenshotEnabled ? 'enabled' : 'disabled');
    }

    render() {
        const isAtLimit = this.attachedScreenshots.length >= 3;
        
        return html`
            <div class="assistant-view-root">
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
                            ></buddy-chat-message>
                          `)
                    }
                </div>
                <div class="text-input-container">
                    ${this.attachedScreenshots.length > 0 ? html`
                        <div class="screenshots-preview">
                            <div class="screenshots-header">
                                <span class="screenshot-count">${this.attachedScreenshots.length}/3 screenshots</span>
                                <button class="clear-all-btn" @click=${this._onClearAllScreenshots} title="Clear all screenshots">
                                    Clear all
                                </button>
                            </div>
                            <div class="screenshots-grid">
                                ${this.attachedScreenshots.map((screenshot, index) => html`
                                    <div class="screenshot-item">
                                        <img 
                                            src="data:image/jpeg;base64,${screenshot}" 
                                            alt="Screenshot ${index + 1}" 
                                            @click=${() => this._onViewScreenshot(screenshot)}
                                            title="Click to view full size"
                                        />
                                        <button 
                                            class="screenshot-remove" 
                                            @click=${() => this._onRemoveScreenshot(index)}
                                            title="Remove screenshot"
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
                            <button
                                class="action-btn auto-screenshot-btn ${this.autoScreenshotEnabled ? 'active' : ''}"
                                @click=${this._toggleAutoScreenshot}
                                title=${this.autoScreenshotEnabled ? 'Disable auto screenshot' : 'Enable auto screenshot'}
                            >
                                ${this.autoScreenshotEnabled ? '📸' : '📷'}
                            </button>
                            <button
                                class="action-btn ${isAtLimit ? 'at-limit' : ''}"
                                @click=${this._onCaptureScreenshot}
                                title=${isAtLimit ? 'Maximum 3 screenshots allowed' : 'Capture screenshot manually'}
                                ?disabled=${this.isStreamingActive || isAtLimit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                    <circle cx="12" cy="13" r="3"></circle>
                                </svg>
                                ${this.attachedScreenshots.length > 0 ? html`
                                    <span class="screenshot-count-badge">${this.attachedScreenshots.length}</span>
                                ` : ''}
                            </button>
                            <button
                                class="send-btn"
                                @click=${this._onSend}
                                title="Send message"
                                ?disabled=${this.isStreamingActive}
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