import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyChatMessage extends LitElement {
    static properties = {
        id: { type: String },
        text: { type: String },
        sender: { type: String },
        timestamp: { type: String },
        isStreaming: { type: Boolean },
        messageTransparency: { type: Boolean },
        screenshots: { type: Array }, // Array of base64 screenshot data
    };

    static styles = css`
        :host { display: block; }
        .message-wrapper {
            display: flex;
            width: 100%;
        }
        .message-wrapper.user {
            justify-content: flex-end;
        }
        .message-wrapper.assistant {
            justify-content: flex-start;
        }
        .message-bubble {
            max-width: 100%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            position: relative;
            animation: messageAppear 0.3s ease-out;
            display: flex;
            flex-direction: column;
        }
        .message-bubble.user {
            background: oklch(44.4% 0.011 73.639);
            border: 1px solid oklch(98.5% 0.001 106.423);
            color: var(--text-color);
            border-radius: 18px 18px 4px 18px;
        }
        .message-bubble.assistant {
            background: oklch(14.7% 0.004 49.25);
            border: 1px solid oklch(98.5% 0.001 106.423);
            color: var(--text-color);
            border-radius: 18px 18px 18px 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .message-bubble.transparent {
            background: oklch(37.4% 0.01 67.558) !important;
            backdrop-filter: blur(5px);
        }
        .message-bubble.user.transparent {
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.2);
        }
        .message-bubble.assistant.transparent {
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.2);
        }
        .screenshots-container {
            margin: 8px 0;
        }
        .screenshots-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }
        .screenshot-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .screenshot-image {
            width: 120px;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            cursor: pointer;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .screenshot-image:hover {
            transform: scale(1.02);
            border-color: var(--input-border);
        }
        .screenshot-number {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 2px;
            text-align: center;
        }
        .screenshots-caption {
            font-size: 12px;
            opacity: 0.7;
            font-style: italic;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .message-content {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 4px;
        }
        .message-time {
            font-size: 11px;
            opacity: 0.6;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
            justify-content: flex-end;
        }
        .message-bubble.assistant .message-time {
            text-align: left;
            justify-content: flex-start;
        }
        .msg-action-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            opacity: 0.6;
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 4px;
            margin-left: 4px;
            font-size: 14px;
            transition: opacity 0.2s, background 0.2s;
            display: flex;
            align-items: center;
        }
        .msg-action-btn:hover {
            opacity: 1;
            background: var(--button-background);
        }
        .transparency-toggle {
            margin-left: 8px;
        }
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--text-color);
            border-radius: 50%;
            opacity: 0.4;
            animation: typingBounce 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(1) {
            animation-delay: -0.32s;
        }
        .typing-dot:nth-child(2) {
            animation-delay: -0.16s;
        }
        .typing-dot:nth-child(3) {
            animation-delay: 0s;
        }
        @keyframes typingBounce {
            0%, 80%, 100% { 
                transform: scale(0.8);
                opacity: 0.4;
            }
            40% { 
                transform: scale(1);
                opacity: 1;
            }
        }
        @keyframes messageAppear {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    _onDelete() {
        this.dispatchEvent(new CustomEvent('delete-message', { detail: { id: this.id }, bubbles: true, composed: true }));
    }
    _onCopy() {
        this.dispatchEvent(new CustomEvent('copy-message', { bubbles: true, composed: true }));
    }
    _onToggleTransparency() {
        this.dispatchEvent(new CustomEvent('toggle-transparency', { detail: { id: this.id }, bubbles: true, composed: true }));
    }

    _onScreenshotClick(screenshot) {
        // Open screenshot in a new window or modal
        if (screenshot) {
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
    }

    render() {
        const hasScreenshots = this.screenshots && Array.isArray(this.screenshots) && this.screenshots.length > 0;
        
        return html`
            <div class="message-wrapper ${this.sender}">
                <div class="message-bubble ${this.sender} ${this.messageTransparency ? 'transparent' : ''}">
                    ${hasScreenshots ? html`
                        <div class="screenshots-container">
                            <div class="screenshots-grid">
                                ${this.screenshots.map((screenshot, index) => html`
                                    <div class="screenshot-item">
                                        <img 
                                            class="screenshot-image" 
                                            src="data:image/jpeg;base64,${screenshot}" 
                                            alt="Screenshot ${index + 1}" 
                                            @click=${() => this._onScreenshotClick(screenshot)}
                                            title="Click to view full size"
                                        />
                                        <div class="screenshot-number">#${index + 1}</div>
                                    </div>
                                `)}
                            </div>
                            <div class="screenshots-caption">
                                📷 ${this.screenshots.length} screenshot${this.screenshots.length > 1 ? 's' : ''}
                            </div>
                        </div>
                    ` : ''}
                    ${this.text ? html`
                        <div class="message-content">
                            ${this.sender === 'assistant' 
                                ? html`<div .innerHTML=${window.marked ? window.marked.parse(this.text || '') : this.text}></div>`
                                : html`<div>${this.text}</div>`
                            }
                            ${this.isStreaming ? html`
                                <div class="typing-indicator">
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    <div class="message-time">
                        ${this.isStreaming ? 'typing...' : this.timestamp}
                        <button 
                            class="msg-action-btn transparency-toggle"
                            @click=${this._onToggleTransparency}
                            title=${this.messageTransparency ? 'Make messages opaque' : 'Make messages transparent'}
                        >
                            ${this.messageTransparency ? '🔲' : '🔳'}
                        </button>
                        <button 
                            class="msg-action-btn delete-button"
                            @click=${this._onDelete}
                            title="Delete message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path></svg>
                        </button>
                        <button 
                            class="msg-action-btn copy-button"
                            @click=${this._onCopy}
                            title="Copy message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-chat-message', BuddyChatMessage); 