import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyHistoryView extends LitElement {
    static properties = {
        history: { type: Array },
    };

    static styles = css`
        :host { display: block; }
        .history-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .history-item {
            background: var(--main-content-background);
            border: var(--glass-border);
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .history-item:hover {
            background: var(--button-background);
            transform: translateY(-2px);
            box-shadow: var(--glass-shadow);
        }
        .history-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .history-item-model {
            font-weight: 600;
            font-size: 14px;
        }
        .history-item-time {
            font-size: 12px;
            opacity: 0.7;
        }
        .history-item-preview {
            font-size: 13px;
            opacity: 0.8;
            line-height: 1.4;
        }
    `;

    _onSessionClick(index) {
        this.dispatchEvent(new CustomEvent('load-session', { detail: { index }, bubbles: true, composed: true }));
    }

    render() {
        if (!this.history || this.history.length === 0) {
            return html`
                <div class="welcome-message">
                    <p>No chat history yet.</p>
                    <p>Your past conversations will appear here.</p>
                </div>
            `;
        }
        return html`
            <div class="history-container">
                ${this.history.map((session, index) => html`
                    <div class="history-item" @click=${() => this._onSessionClick(index)}>
                        <div class="history-item-header">
                            <span class="history-item-model">${session.model} (${session.provider})</span>
                            <span class="history-item-time">${new Date(session.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="history-item-preview">
                            ${session.messages[1] ? session.messages[1].text.substring(0, 100) + '...' : 'No messages'}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('buddy-history-view', BuddyHistoryView); 