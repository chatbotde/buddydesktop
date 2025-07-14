import { html, LitElement } from '../lit-core-2.7.4.min.js';
import { historyStyles } from './ui/history-css.js';

class BuddyHistoryView extends LitElement {
    static properties = {
        history: { type: Array },
        historyLimit: { type: Number },
    };

    static styles = [historyStyles];

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