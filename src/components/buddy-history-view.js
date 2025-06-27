import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyHistoryView extends LitElement {
    static properties = {
        history: { type: Array },
        historyLimit: { type: Number },
    };

    static styles = css`
        :host { display: block; }
        .history-controls {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-bottom: 12px;
        }
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
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .history-item-content {
            flex: 1;
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
        .delete-btn {
            background: transparent;
            border: none;
            color: #ef4444;
            font-size: 18px;
            cursor: pointer;
            margin-left: 12px;
            padding: 2px 6px;
            border-radius: 6px;
            transition: background 0.2s;
        }
        .delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
        }
        .control-btn {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .control-btn:hover {
            background: var(--button-background);
            border-color: var(--button-border);
        }
    `;

    _onSessionClick(index) {
        this.dispatchEvent(new CustomEvent('load-session', { detail: { index }, bubbles: true, composed: true }));
    }

    _onDeleteClick(index, e) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('delete-session', { detail: { index }, bubbles: true, composed: true }));
    }

    _onExtendClick() {
        this.dispatchEvent(new CustomEvent('extend-history-limit', { bubbles: true, composed: true }));
    }

    _onDecreaseClick() {
        this.dispatchEvent(new CustomEvent('decrease-history-limit', { bubbles: true, composed: true }));
    }

    render() {
        return html`
            <div class="history-controls">
                <button class="control-btn" @click=${this._onExtendClick}>Extend</button>
                <button class="control-btn" @click=${this._onDecreaseClick}>Decrease</button>
                <span style="font-size:12px;opacity:0.7;">Limit: ${this.historyLimit || 5}</span>
            </div>
            ${!this.history || this.history.length === 0 ? html`
                <div class="welcome-message">
                    <p>No chat history yet.</p>
                    <p>Your past conversations will appear here.</p>
                </div>
            ` : html`
                <div class="history-container">
                    ${this.history.map((session, index) => html`
                        <div class="history-item" @click=${() => this._onSessionClick(index)}>
                            <div class="history-item-content">
                                <div class="history-item-header">
                                    <span class="history-item-model">${session.model} (${session.provider})</span>
                                    <span class="history-item-time">${new Date(session.timestamp).toLocaleString()}</span>
                                </div>
                                <div class="history-item-preview">
                                    ${session.messages[1] ? session.messages[1].text.substring(0, 100) + '...' : 'No messages'}
                                </div>
                            </div>
                            <button class="delete-btn" title="Delete session" @click=${(e) => this._onDeleteClick(index, e)}>&#128465;</button>
                        </div>
                    `)}
                </div>
            `}
        `;
    }
}

customElements.define('buddy-history-view', BuddyHistoryView); 