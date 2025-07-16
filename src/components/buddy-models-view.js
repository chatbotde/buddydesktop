import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { modelsStyles } from './ui/models-css.js';

class BuddyModelsView extends LitElement {
    static properties = {
        models: { type: Array },
        searchQuery: { type: String },
        enabledModels: { type: Array },
    };

    constructor() {
        super();
        this.models = [
            { id: 'claude-4-sonnet', name: 'claude-4-sonnet', provider: 'anthropic', icon: '🤖' },
            { id: 'claude-4-opus', name: 'claude-4-opus', provider: 'anthropic', icon: '🤖', badge: 'MAX Only' },
            { id: 'claude-3.5-sonnet', name: 'claude-3.5-sonnet', provider: 'anthropic', icon: null },
            { id: 'o3', name: 'o3', provider: 'openai', icon: '🤖' },
            { id: 'gemini-2.5-pro', name: 'gemini-2.5-pro', provider: 'google', icon: '🤖' },
            { id: 'gemini-2.5-flash', name: 'gemini-2.5-flash', provider: 'google', icon: '🤖' },
        ];
        this.searchQuery = '';
        this.enabledModels = [];
    }

    static styles = [
        modelsStyles,
        css`
            .models-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }

            .search-container {
                margin-bottom: 24px;
                position: relative;
            }

            .search-input {
                width: 100%;
                background: rgba(255, 255, 255, 0.08);
                color: var(--text-color);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                padding: 16px 20px;
                font-size: 16px;
                box-sizing: border-box;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .search-input::placeholder {
                color: var(--placeholder-color);
                opacity: 0.6;
            }

            .search-input:focus {
                outline: none;
                border-color: var(--text-color);
                box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.12) 100%);
            }

            .models-list {
                display: flex;
                flex-direction: column;
                gap: 1px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                overflow: hidden;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }

            .model-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.03);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                transition: all 0.2s ease;
                cursor: pointer;
            }

            .model-item:last-child {
                border-bottom: none;
            }

            .model-item:hover {
                background: rgba(255, 255, 255, 0.08);
                transform: translateX(4px);
            }

            .model-info {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .model-icon {
                font-size: 20px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
            }

            .model-details {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .model-name {
                font-size: 16px;
                font-weight: 500;
                color: var(--text-color);
                letter-spacing: 0.2px;
            }

            .model-badge {
                font-size: 12px;
                color: var(--text-color);
                opacity: 0.6;
                font-weight: 400;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .toggle-switch {
                position: relative;
                width: 52px;
                height: 28px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
                outline: none;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .toggle-switch.enabled {
                background: linear-gradient(135deg, #4ade80, #22c55e);
                border-color: #22c55e;
                box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .toggle-knob {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 22px;
                height: 22px;
                background: #ffffff;
                border-radius: 50%;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1);
            }

            .toggle-switch.enabled .toggle-knob {
                transform: translateX(24px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.15);
            }

            .no-results {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-color);
                opacity: 0.6;
                font-size: 16px;
                font-weight: 500;
            }

            @media (max-width: 640px) {
                .models-container {
                    padding: 16px;
                }

                .model-item {
                    padding: 14px 16px;
                }

                .model-name {
                    font-size: 15px;
                }

                .toggle-switch {
                    width: 48px;
                    height: 26px;
                }

                .toggle-knob {
                    width: 20px;
                    height: 20px;
                }

                .toggle-switch.enabled .toggle-knob {
                    transform: translateX(22px);
                }
            }
        `,
    ];

    _onSearchInput(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.requestUpdate();
    }

    _toggleModel(modelId) {
        const isEnabled = this.enabledModels.includes(modelId);
        if (isEnabled) {
            this.enabledModels = this.enabledModels.filter(id => id !== modelId);
        } else {
            this.enabledModels = [...this.enabledModels, modelId];
        }

        this.dispatchEvent(
            new CustomEvent('model-toggle', {
                detail: { modelId, enabled: !isEnabled },
                bubbles: true,
                composed: true,
            })
        );

        this.requestUpdate();
    }

    _getFilteredModels() {
        if (!this.searchQuery) {
            return this.models;
        }

        return this.models.filter(
            model => model.name.toLowerCase().includes(this.searchQuery) || model.provider.toLowerCase().includes(this.searchQuery)
        );
    }

    render() {
        const filteredModels = this._getFilteredModels();

        return html`
            <div class="models-container">
                <div class="search-container">
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Add or search model"
                        .value=${this.searchQuery}
                        @input=${this._onSearchInput}
                    />
                </div>

                <div class="models-list">
                    ${filteredModels.length > 0
                        ? filteredModels.map(
                              model => html`
                                  <div class="model-item" @click=${() => this._toggleModel(model.id)}>
                                      <div class="model-info">
                                          ${model.icon ? html` <div class="model-icon">${model.icon}</div> ` : ''}
                                          <div class="model-details">
                                              <div class="model-name">${model.name}</div>
                                              ${model.badge ? html` <div class="model-badge">${model.badge}</div> ` : ''}
                                          </div>
                                      </div>
                                      <button
                                          class="toggle-switch ${this.enabledModels.includes(model.id) ? 'enabled' : ''}"
                                          @click=${e => {
                                              e.stopPropagation();
                                              this._toggleModel(model.id);
                                          }}
                                      >
                                          <div class="toggle-knob"></div>
                                      </button>
                                  </div>
                              `
                          )
                        : html` <div class="no-results">No models found matching "${this.searchQuery}"</div> `}
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-models-view', BuddyModelsView);
