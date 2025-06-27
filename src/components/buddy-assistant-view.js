import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-chat-message.js';

class BuddyAssistantView extends LitElement {
    static properties = {
        chatMessages: { type: Array },
        isStreamingActive: { type: Boolean },
        messageTransparency: { type: Boolean },
        attachedScreenshots: { type: Array }, // Array of base64 screenshot data
    };

    constructor() {
        super();
        this.attachedScreenshots = [];
    }

    static styles = css`
        :host { display: block; height: 100%; }
        .assistant-view-root {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .chat-container {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 0;
            scroll-behavior: smooth;
        }
        .welcome-message {
            text-align: center;
            padding: 20px;
            opacity: 0.8;
            font-size: 14px;
            line-height: 1.6;
        }
        .text-input-container {
            display: flex;
            flex-direction: column;
            background: var(--header-background);
            border-radius: 16px;
            padding: 8px 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.10);
            border: 1.5px solid var(--border-color);
            position: sticky;
            bottom: 0;
            z-index: 10;
            margin: 0;
        }
        .screenshots-preview {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 8px;
        }
        .screenshots-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            opacity: 0.8;
        }
        .screenshot-count {
            color: var(--text-color);
        }
        .clear-all-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            opacity: 0.7;
            font-size: 11px;
        }
        .clear-all-btn:hover {
            opacity: 1;
            background: var(--button-background);
        }
        .screenshots-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .screenshot-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .screenshot-item img {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            cursor: pointer;
        }
        .screenshot-item img:hover {
            border-color: var(--input-border);
        }
        .screenshot-remove {
            position: absolute;
            top: -4px;
            right: -4px;
            background: var(--button-background);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            color: var(--text-color);
        }
        .screenshot-remove:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.4);
            color: #ef4444;
        }
        .screenshot-number {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 2px;
        }
        .input-row {
            display: flex;
            align-items: center;
        }
        .input-row textarea {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-color);
            font-size: 16px;
            padding: 10px 12px;
            resize: none;
            min-width: 0;
        }
        .input-row textarea::placeholder {
            color: var(--placeholder-color);
            opacity: 0.8;
        }
        .action-buttons {
            display: flex;
            gap: 4px;
            margin-left: 8px;
        }
        .action-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            font-size: 18px;
            cursor: pointer;
            border-radius: 50%;
            padding: 6px;
            transition: background 0.2s;
            opacity: 0.7;
            position: relative;
        }
        .action-btn:hover:not(:disabled) {
            background: var(--button-background);
            opacity: 1;
        }
        .action-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        .action-btn.at-limit {
            opacity: 0.3;
            cursor: not-allowed;
        }
        .screenshot-count-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            background: var(--button-background);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
        }
        .send-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            font-size: 20px;
            cursor: pointer;
            border-radius: 50%;
            padding: 6px;
            transition: background 0.2s;
        }
        .send-btn:hover:not(:disabled) {
            background: var(--button-background);
        }
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
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
            this.requestUpdate();
        }
    }

    _onKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._onSend();
        }
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
    _onToggleTransparency(e) {
        this.dispatchEvent(new CustomEvent('toggle-transparency', { detail: { id: e.detail.id }, bubbles: true, composed: true }));
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
                                .messageTransparency=${!!message.transparency}
                                .screenshots=${message.screenshots}
                                @delete-message=${(e) => this._onDelete(e)}
                                @copy-message=${() => this._onCopy(message)}
                                @toggle-transparency=${(e) => this._onToggleTransparency(e)}
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
                            placeholder="Ask me anything..."
                            @keydown=${this._onKeydown}
                            @input=${this._onResize}
                        ></textarea>
                        <div class="action-buttons">
                            <button
                                class="action-btn ${isAtLimit ? 'at-limit' : ''}"
                                @click=${this._onCaptureScreenshot}
                                title=${isAtLimit ? 'Maximum 3 screenshots allowed' : 'Capture screenshot'}
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