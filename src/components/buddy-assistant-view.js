import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-chat-message.js';

class BuddyAssistantView extends LitElement {
    static properties = {
        chatMessages: { type: Array },
        isStreamingActive: { type: Boolean },
        messageTransparency: { type: Boolean },
    };

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
            align-items: center;
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
        .text-input-container textarea {
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
        .text-input-container textarea::placeholder {
            color: var(--placeholder-color);
            opacity: 0.8;
        }
        .send-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            font-size: 20px;
            margin-left: 8px;
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

    _onSend() {
        const textarea = this.renderRoot.querySelector('#textInput');
        if (textarea && textarea.value.trim()) {
            this.dispatchEvent(new CustomEvent('send-message', { detail: { text: textarea.value.trim() }, bubbles: true, composed: true }));
            textarea.value = '';
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
                                @delete-message=${(e) => this._onDelete(e)}
                                @copy-message=${() => this._onCopy(message)}
                                @toggle-transparency=${(e) => this._onToggleTransparency(e)}
                            ></buddy-chat-message>
                          `)
                    }
                </div>
                <div class="text-input-container">
                    <textarea
                        id="textInput"
                        rows="1"
                        placeholder="Ask me anything..."
                        @keydown=${this._onKeydown}
                        @input=${this._onResize}
                    ></textarea>
                    <button
                        class="send-btn"
                        @click=${this._onSend}
                        title="Send message"
                        ?disabled=${this.isStreamingActive}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-up-icon lucide-arrow-big-up"><path d="M9 18v-6H5l7-7 7 7h-4v6H9z"/></svg>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-assistant-view', BuddyAssistantView); 