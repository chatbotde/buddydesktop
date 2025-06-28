import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyChatMessage extends LitElement {
    static properties = {
        id: { type: String },
        text: { type: String },
        sender: { type: String },
        timestamp: { type: String },
        isStreaming: { type: Boolean },
        screenshots: { type: Array }, // Array of base64 screenshot data
    };

    constructor() {
        super();
        this.showCopyButton = false;
    }

    static styles = css`
        :host { 
            display: block; 
            margin: 6px 0;
        }
        
        .message-wrapper {
            display: flex;
            width: 100%;
            position: relative;
        }
        
        .message-wrapper.user {
            justify-content: flex-end;
        }
        
        .message-wrapper.assistant {
            justify-content: flex-start;
        }
        
        .message-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            position: relative;
            animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            transition: all 0.3s ease;
        }
        
        .message-bubble:hover {
            transform: translateY(-1px);
        }
        
        .message-bubble.user {
            background: oklch(44.4% 0.011 73.639);
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.2);
            color: var(--text-color);
            border-radius: 18px 18px 6px 18px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .message-bubble.assistant {
            background: oklch(14.7% 0.004 49.25);
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.15);
            color: var(--text-color);
            border-radius: 18px 18px 18px 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }
        
        .screenshots-container {
            margin: 8px 0 6px;
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
            transition: transform 0.3s ease;
        }
        
        .screenshot-item:hover {
            transform: translateY(-1px);
        }
        
        .screenshot-image {
            width: 20px; /* Decreased from 80px */
            height: 15px; /* Decreased from 60px */
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .screenshot-image:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        
        .screenshot-number {
            font-size: 9px;
            opacity: 0.7;
            margin-top: 3px;
            text-align: center;
            font-weight: 500;
            background: rgba(0, 0, 0, 0.4);
            color: white;
            padding: 1px 4px;
            border-radius: 4px;
            backdrop-filter: blur(10px);
        }
        
        .screenshots-caption {
            font-size: 11px;
            opacity: 0.7;
            font-style: italic;
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 500;
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 8px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .message-content {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: relative;
            user-select: text;
            -webkit-user-select: text;
        }
        
        .message-content h1, .message-content h2, .message-content h3 {
            margin: 12px 0 6px;
            line-height: 1.3;
        }
        
        .message-content p {
            margin: 6px 0;
        }
        
        .message-content code {
            background: rgba(0, 0, 0, 0.2);
            color: var(--text-color);
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 13px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-content pre {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin: 10px 0;
        }
        
        .message-content blockquote {
            border-left: 2px solid rgba(255, 255, 255, 0.3);
            padding-left: 12px;
            margin: 10px 0;
            opacity: 0.8;
            font-style: italic;
        }
        
        .message-time {
            font-size: 11px;
            opacity: 0.6;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
            justify-content: flex-end;
            font-weight: 500;
        }
        
        .message-bubble.assistant .message-time {
            text-align: left;
            justify-content: flex-start;
        }
        
        .msg-action-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            opacity: 0.6;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 8px;
            margin-left: 4px;
            font-size: 13px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            backdrop-filter: blur(10px);
        }
        
        .msg-action-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }
        
        .selection-copy-btn {
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            gap: 5px;
            opacity: 0;
            transform: translateY(-8px) scale(0.9);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            white-space: nowrap;
        }
        
        .selection-copy-btn.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
        
        .selection-copy-btn:hover {
            background: rgba(0, 0, 0, 0.95);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        .selection-copy-btn:active {
            transform: translateY(0) scale(0.98);
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
            animation: typingPulse 1.4s infinite ease-in-out;
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
        
        @keyframes typingPulse {
            0%, 80%, 100% { 
                transform: scale(0.8);
                opacity: 0.3;
            }
            40% { 
                transform: scale(1.1);
                opacity: 1;
            }
        }
        
        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(15px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Enhanced focus states */
        .msg-action-btn:focus-visible {
            outline: 2px solid rgba(255, 255, 255, 0.4);
            outline-offset: 2px;
        }
        
        /* Improved link styling */
        .message-content a {
            color: rgba(135, 206, 235, 0.9);
            text-decoration: none;
            border-bottom: 1px solid rgba(135, 206, 235, 0.3);
            transition: all 0.2s ease;
        }
        
        .message-content a:hover {
            color: rgba(135, 206, 235, 1);
            border-bottom-color: rgba(135, 206, 235, 0.6);
        }
        
        /* List styling */
        .message-content ul, .message-content ol {
            padding-left: 18px;
            margin: 6px 0;
        }
        
        .message-content li {
            margin: 3px 0;
            line-height: 1.4;
        }
        
        /* Table styling */
        .message-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-content th, .message-content td {
            padding: 6px 10px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .message-content th {
            background: rgba(255, 255, 255, 0.05);
            font-weight: 600;
        }
        
        /* Text selection styling */
        .message-content ::selection {
            background: rgba(135, 206, 235, 0.3);
            color: inherit;
        }
        
        .message-content ::-moz-selection {
            background: rgba(135, 206, 235, 0.3);
            color: inherit;
        }
    `;

    firstUpdated() {
        this._setupSelectionHandling();
    }

    _setupSelectionHandling() {
        const messageContent = this.shadowRoot.querySelector('.message-content');
        if (!messageContent) return;

        let selectionTimeout;

        // Handle text selection
        const handleSelection = (e) => {
            clearTimeout(selectionTimeout);
            selectionTimeout = setTimeout(() => {
                const selection = window.getSelection();
                const selectedText = selection.toString().trim();
                
                if (selectedText && selection.rangeCount > 0) {
                    // Check if the selection is within this message
                    const range = selection.getRangeAt(0);
                    const isWithinMessage = messageContent.contains(range.commonAncestorContainer) || 
                                          messageContent.contains(range.startContainer) || 
                                          messageContent.contains(range.endContainer);
                    
                    if (isWithinMessage) {
                        this._showSelectionCopyButton(selection);
                    } else {
                        this._hideSelectionCopyButton();
                    }
                } else {
                    this._hideSelectionCopyButton();
                }
            }, 150);
        };

        // Add event listeners for selection - focus on this message content
        messageContent.addEventListener('mouseup', handleSelection);
        messageContent.addEventListener('selectstart', handleSelection);
        document.addEventListener('selectionchange', handleSelection);

        // Hide copy button when clicking outside
        document.addEventListener('click', (e) => {
            if (!this._selectionCopyButton?.contains(e.target) && !messageContent.contains(e.target)) {
                this._hideSelectionCopyButton();
            }
        });

        // Clean up on disconnect
        this._selectionCleanup = () => {
            messageContent.removeEventListener('mouseup', handleSelection);
            messageContent.removeEventListener('selectstart', handleSelection);
            document.removeEventListener('selectionchange', handleSelection);
            clearTimeout(selectionTimeout);
        };
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._selectionCleanup) {
            this._selectionCleanup();
        }
    }

    _showSelectionCopyButton(selection) {
        // Remove any existing selection copy button
        this._hideSelectionCopyButton();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const messageContent = this.shadowRoot.querySelector('.message-content');
        
        if (!messageContent || rect.width === 0 || rect.height === 0) return;

        const copyBtn = document.createElement('div');
        copyBtn.className = 'selection-copy-btn';
        copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
        `;

        // Position the button above the selection, centered
        const buttonWidth = 60; // Approximate width of the button
        let leftPosition = rect.left + (rect.width / 2) - (buttonWidth / 2);
        
        // Ensure button stays within viewport
        const viewportWidth = window.innerWidth;
        if (leftPosition < 10) leftPosition = 10;
        if (leftPosition + buttonWidth > viewportWidth - 10) leftPosition = viewportWidth - buttonWidth - 10;

        copyBtn.style.left = `${leftPosition}px`;
        copyBtn.style.top = `${rect.top - 40}px`;
        copyBtn.style.position = 'fixed';
        copyBtn.style.zIndex = '1000';

        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._copySelectedText();
            this._hideSelectionCopyButton();
        });

        document.body.appendChild(copyBtn);
        this._selectionCopyButton = copyBtn;

        // Show the button with animation
        requestAnimationFrame(() => {
            copyBtn.classList.add('show');
        });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this._hideSelectionCopyButton();
        }, 3000);
    }

    _hideSelectionCopyButton() {
        if (this._selectionCopyButton) {
            this._selectionCopyButton.classList.remove('show');
            setTimeout(() => {
                if (this._selectionCopyButton) {
                    this._selectionCopyButton.remove();
                    this._selectionCopyButton = null;
                }
            }, 200);
        }
    }

    _copySelectedText() {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                console.log('Selected text copied to clipboard:', selectedText);
                // Clear the selection after copying
                selection.removeAllRanges();
            }).catch(err => {
                console.error('Failed to copy selected text:', err);
                // Fallback for older browsers
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = selectedText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                } catch (fallbackErr) {
                    console.error('Fallback copy also failed:', fallbackErr);
                }
            });
        }
    }

    _onDelete() {
        this.dispatchEvent(new CustomEvent('delete-message', { detail: { id: this.id }, bubbles: true, composed: true }));
    }

    _onCopy() {
        const textToCopy = this.text || '';
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log('Message copied to clipboard');
            // Optional: Show a brief success indicator
        }).catch(err => {
            console.error('Failed to copy message:', err);
        });
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
                <div class="message-bubble ${this.sender}">
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
                                📷 ${this.screenshots.length} screenshot${this.screenshots.length > 1 ? 's' : ''} attached
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
                            class="msg-action-btn copy-button"
                            @click=${this._onCopy}
                            title="Copy message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                        <button 
                            class="msg-action-btn delete-button"
                            @click=${this._onDelete}
                            title="Delete message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-chat-message', BuddyChatMessage); 