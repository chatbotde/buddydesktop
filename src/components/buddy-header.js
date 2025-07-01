import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyHeader extends LitElement {
    static properties = {
        currentView: { type: String },
        sessionActive: { type: Boolean },
        statusText: { type: String },
        startTime: { type: Number },
        isAudioActive: { type: Boolean },
        isScreenActive: { type: Boolean },
    };

    static styles = css`
        .header {
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            border: var(--glass-border);
            background: var(--header-background);
            border-radius: 16px 16px 0 0;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
        }
        
        .header-title {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0; /* Allow shrinking */
        }
        
        .header-title-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        

        
        .header-actions {
            display: flex;
            gap: 8px;
            align-items: center;
            -webkit-app-region: no-drag;
            flex-shrink: 0;
        }
        
        .header-actions span {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.8;
        }
        
        .status-container {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }
        
        .status-live {
            background-color: #4ade80;
            box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
        }
        
        .status-idle {
            background-color: #fbbf24;
            box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
        }
        
        .button, .session-button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
        }
        
        .button:hover, .session-button:hover {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .session-button.start, .session-button.end {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
        }
        
        .icon-button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 8px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            transition: all 0.3s ease;
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            align-items: center;
            justify-content: center;
            min-width: 40px;
            min-height: 40px;
        }
        
        .icon-button:hover {
            background: var(--button-background);
            color: var(--text-color);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .icon-button.active {
            background: rgba(74, 222, 128, 0.2);
            border-color: rgba(74, 222, 128, 0.4);
            color: #4ade80;
        }
        
        .icon-button.inactive {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.4);
            color: #ef4444;
        }
        
        button:disabled {
            opacity: 0.5;
            transform: none;
        }
        
        .status-text {
            min-width: 50px; 
            text-align: right; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
            .header {
                padding: 8px 12px;
                border-radius: 12px 12px 0 0;
            }
            
            .header-title {
                font-size: 14px;
                gap: 6px;
                flex: 1;
                min-width: 0;
            }
            
            .header-title-text {
                font-size: 14px;
            }
            
            .model-select {
                min-width: 100px;
                max-width: 140px;
                font-size: 12px;
                padding: 3px 6px;
                margin-left: 4px;
            }
            
            .header-actions {
                gap: 6px;
            }
            
            .header-actions span {
                font-size: 12px;
            }
            
            .status-container {
                gap: 4px;
            }
            
            .status-indicator {
                width: 6px;
                height: 6px;
                margin-right: 4px;
            }
            
            .button, .session-button {
                padding: 6px 12px;
                font-size: 12px;
                border-radius: 10px;
            }
            
            .icon-button {
                padding: 6px;
                border-radius: 10px;
                min-width: 36px;
                min-height: 36px;
            }
            
            .icon-button svg {
                width: 20px;
                height: 20px;
            }
            
            .status-text {
                min-width: 40px;
                font-size: 12px;
            }
            
            /* Adjust status container for mobile */
            .status-container {
                flex-wrap: wrap;
            }
        }
        
        @media (max-width: 480px) {
            .header {
                padding: 6px 10px;
                border-radius: 10px 10px 0 0;
            }
            
            .header-title {
                font-size: 13px;
                gap: 4px;
            }
            
            .header-title-text {
                font-size: 13px;
                max-width: 80px;
            }
            
            .model-select {
                min-width: 80px;
                max-width: 120px;
                font-size: 11px;
                padding: 2px 4px;
                margin-left: 2px;
            }
            
            .header-actions {
                gap: 4px;
            }
            
            .header-actions span {
                font-size: 11px;
            }
            
            .status-container {
                gap: 3px;
            }
            
            .button, .session-button {
                padding: 5px 10px;
                font-size: 11px;
                border-radius: 8px;
            }
            
            .icon-button {
                padding: 5px;
                border-radius: 8px;
                min-width: 32px;
                min-height: 32px;
            }
            
            .icon-button svg {
                width: 18px;
                height: 18px;
            }
            
            .status-text {
                display: none; /* Hide status text on very small screens */
            }
            
            /* Hide elapsed time on very small screens */
            .header-actions > span:first-child {
                display: none;
            }
            
            /* Stack audio/video buttons vertically on small screens */
            .status-container {
                flex-direction: column;
                gap: 2px;
            }
        }
        
        @media (max-width: 360px) {
            .header {
                padding: 5px 8px;
            }
            
            .header-title-text {
                max-width: 60px;
            }
            
            .model-select {
                min-width: 70px;
                max-width: 100px;
                font-size: 10px;
            }
            
            .header-actions {
                gap: 3px;
            }
            
            .button, .session-button {
                padding: 4px 8px;
                font-size: 10px;
            }
            
            .icon-button {
                padding: 4px;
                min-width: 28px;
                min-height: 28px;
            }
            
            .icon-button svg {
                width: 16px;
                height: 16px;
            }
            
            /* Further simplify on very small screens */
            .status-indicator {
                width: 5px;
                height: 5px;
                margin-right: 3px;
            }
        }
    `;

    _handleEndSession() {
        this.dispatchEvent(new CustomEvent('end-session', { bubbles: true, composed: true }));
    }
    _handleStartSession() {
        this.dispatchEvent(new CustomEvent('start-session', { bubbles: true, composed: true }));
    }
    _handleToggleAudio() {
        this.dispatchEvent(new CustomEvent('toggle-audio', { bubbles: true, composed: true }));
    }
    _handleToggleScreen() {
        this.dispatchEvent(new CustomEvent('toggle-screen', { bubbles: true, composed: true }));
    }
    _handleClose() {
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
    _handleNav(e) {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { view: e }, bubbles: true, composed: true }));
    }

    render() {
        const titles = {
            main: 'Buddy',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            assistant: 'Buddy',
        };
        let elapsedTime = '';
        if (this.currentView === 'assistant' && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            elapsedTime = `${elapsed}s`;
        }
        const isLive = this.sessionActive && (this.statusText?.includes('Listening') || this.statusText?.includes('Processing'));
        const statusIndicator = isLive ? 'status-live' : 'status-idle';
        return html`
            <div class="header">
                <div class="header-title">
                    <span class="header-title-text">${titles[this.currentView]}</span>
                </div>
                <div class="header-actions">
                    ${this.currentView === 'assistant'
                        ? html`
                              <span>${elapsedTime}</span>
                              <div class="status-container">
                                  <span class="status-indicator ${statusIndicator}"></span>
                                  ${this.sessionActive
                                      ? html`
                                            <!-- Audio Toggle Button -->
                                            <button 
                                                class="icon-button ${this.isAudioActive ? 'active' : 'inactive'}" 
                                                @click=${this._handleToggleAudio} 
                                                title="${this.isAudioActive ? 'Disable Audio' : 'Enable Audio'}"
                                                ?disabled=${!this.sessionActive}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    ${this.isAudioActive 
                                                        ? html`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`
                                                        : html`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`
                                                    }
                                                </svg>
                                            </button>
                                            <!-- Video Toggle Button -->
                                            <button 
                                                class="icon-button ${this.isScreenActive ? 'active' : 'inactive'}" 
                                                @click=${this._handleToggleScreen} 
                                                title="${this.isScreenActive ? 'Disable Video' : 'Enable Video'}"
                                                ?disabled=${!this.sessionActive}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    ${this.isScreenActive 
                                                        ? html`<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>`
                                                        : html`<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
                                                    }
                                                </svg>
                                            </button>
                                            <button class="session-button end" @click=${this._handleEndSession} title="End Session">
                                                ■ End
                                            </button>
                                        `
                                      : html`
                                            <button class="session-button start" @click=${this._handleStartSession} title="Start Session">
                                                ▶ Start
                                            </button>
                                        `}
                              </div>
                              <span class="status-text">${this.statusText}</span>
                          `
                        : ''}
                    ${this.currentView === 'main'
                        ? html`
                              <button class="icon-button" @click=${() => this._handleNav('history')}>
                                  <svg width="24px" height="24px" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M12 6v6h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22a9.99999 9.99999 0 0 1-9.42-7.11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.5492 14.3313A9.99999 9.99999 0 0 1 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2c5.4578 0 9.8787 4.3676 9.9958 9.794" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </button>
                              <button class="icon-button" @click=${() => this._handleNav('customize')}>
                                  <svg
                                      width="24px"
                                      height="24px"
                                      stroke-width="1.7"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="currentColor"
                                  >
                                      <path
                                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                      <path
                                          d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                  </svg>
                              </button>
                              <button class="icon-button" @click=${() => this._handleNav('help')}>
                                  <svg
                                      width="24px"
                                      height="24px"
                                      stroke-width="1.7"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="currentColor"
                                  >
                                      <path
                                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                      <path
                                          d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                      <path
                                          d="M12 18.01L12.01 17.9989"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                  </svg>
                              </button>
                          `
                        : ''}
                    ${this.currentView === 'assistant'
                        ? html`
                              <button @click=${this._handleClose} class="button window-close">
                                  Back
                              </button>
                             
                          `
                        : html`
                              <button @click=${this._handleClose} class="icon-button window-close">
                                  <svg
                                      width="24px"
                                      height="24px"
                                      stroke-width="1.7"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="currentColor"
                                  >
                                      <path
                                          d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                  </svg>
                              </button>
                          `}
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-header', BuddyHeader); 