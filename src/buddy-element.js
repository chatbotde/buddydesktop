/**
 * Main BuddyApp class using composition of mixins
 * This is the new modular buddy-element.js
 */
import { html, css, LitElement } from './lit-core-2.7.4.min.js';
import './marked.min.js';
import './components/buddy-header.js';
import './components/buddy-login-view.js';
import './components/buddy-customize-view.js';
import './components/buddy-help-view.js';
import './components/buddy-history-view.js';
import './components/buddy-assistant-view.js';
import './components/buddy-settings-view.js';
import './components/buddy-models-view.js';
import './components/buddy-system-prompt-manager.js';
import './components/debug-live-streaming.js';
import './components/buddy-dev-config-view.js';
import './components/buddy-master-key-view.js';
import { getAllModels, getModelsByProvider, getEnabledModels } from './services/models-service.js';
import { buddyAppStyles } from './components/ui/buddy-app-style.js';
import { initializeUnifiedMathSystem } from './math/index.js';

// Import all mixins
import { StateManagementMixin } from './mixins/StateManagementMixin.js';
import { StorageManagementMixin } from './mixins/StorageManagementMixin.js';
import { SessionManagementMixin } from './mixins/SessionManagementMixin.js';
import { ChatManagementMixin } from './mixins/ChatManagementMixin.js';
import { WindowManagementMixin } from './mixins/WindowManagementMixin.js';
import { UIHandlersMixin } from './mixins/UIHandlersMixin.js';
import { EventHandlersMixin } from './mixins/EventHandlersMixin.js';
import { AuthInitializationMixin } from './mixins/AuthInitializationMixin.js';

// Compose the main class using all mixins
class BuddyApp extends AuthInitializationMixin(
    EventHandlersMixin(
        UIHandlersMixin(
            WindowManagementMixin(
                ChatManagementMixin(
                    SessionManagementMixin(
                        StorageManagementMixin(
                            StateManagementMixin(LitElement)
                        )
                    )
                )
            )
        )
    )
) {
    static styles = [buddyAppStyles];

    constructor() {
        super();
        
        // Initialize state using the mixin
        this.initializeState();
        
        // Initialize unified math system
        this.initializeUnifiedMath();
    }

    firstUpdated() {
        // Set up all event listeners
        this.setupEventListeners();
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('theme', this.currentTheme);
        
        // Set up IPC listeners and link handlers
        this.setupIPCListeners();
        this.setupLinkHandler();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Clean up listeners
        this.removeIPCListeners();
        this.removeLinkHandler();
        
        if (this.currentView === 'assistant') {
            this.scrollToBottom(false);
        }
    }

    render() {
        const views = {
            login: html`<buddy-login-view
                .user=${this.user}
                .isLoading=${false}
            ></buddy-login-view>`,

            customize: html`<buddy-customize-view
                .selectedProfile=${this.selectedProfile}
                .selectedLanguage=${this.selectedLanguage}
                .customPrompt=${this.customizeViewCustomPrompt}
                .customProfiles=${this.customProfiles}
            ></buddy-customize-view>`,
            
            help: html`<buddy-help-view
                .isMacOS=${this.isMacOS}
                .isLinux=${this.isLinux}
            ></buddy-help-view>`,
            
            history: html`<buddy-history-view
                .history=${this.history}
                .historyLimit=${this.historyLimit}
            ></buddy-history-view>`,
            
            assistant: html`<buddy-assistant-view
                .chatMessages=${this.chatMessages}
                .isStreamingActive=${this.isStreamingActive}
                .selectedModel=${this.selectedModel}
                .isViewingHistory=${this.isViewingHistory}
            ></buddy-assistant-view>`,
            
            settings: html`<buddy-settings-view
                .selectedProvider=${this.selectedProvider}
                .selectedModel=${this.selectedModel}
                .providers=${this.providers}
                .models=${this.mainViewModels}
                .apiKey=${this.mainViewApiKey}
                .keyLabel=${this.mainViewKeyLabel}
                .disabledModelIds=${this.disabledModelIdsForCurrentMode}
                .hasEnvironmentKey=${this.mainViewHasEnvironmentKey}
            ></buddy-settings-view>`,
            
            models: html`<buddy-models-view
                .enabledModels=${this.enabledModels}
            ></buddy-models-view>`,
            
            'prompt-manager': html`<buddy-system-prompt-manager
                .currentProfile=${this.selectedProfile}
                .customPrompt=${this.customizeViewCustomPrompt}
            ></buddy-system-prompt-manager>`,
            
            debug: html`<debug-live-streaming></debug-live-streaming>`,
            
            'user-config': html`<buddy-dev-config-view></buddy-dev-config-view>`,
            
            'master-key': html`<buddy-master-key-view></buddy-master-key-view>`,
        };

        return html`
            <div class="window-container">
                <div class="container">
                    <buddy-header
                        .currentView=${this.currentView}
                        .selectedModel=${this.selectedModel}
                        .selectedProvider=${this.selectedProvider}
                        .sessionActive=${this.sessionActive}
                        .statusText=${this.statusText}
                        .startTime=${this.startTime}
                        .isAudioActive=${this.isAudioActive}
                        .isSearchActive=${this.isSearchActive}
                        .isScreenActive=${this.isScreenActive}
                        .modelsByProvider=${this.getModelsByProviderForHeader()}
                        .user=${this.user}
                        .isAuthenticated=${this.isAuthenticated}
                        .isGuest=${this.isGuest}
                        .enabledModels=${this.enabledModels}
                        .customMenuButtons=${this.customMenuButtons}
                        .windowOpacity=${this.windowOpacity}
                        .isOpacityControlActive=${this.isOpacityControlActive}
                        .currentWindowTheme=${this.currentWindowTheme}
                        .availableThemes=${this.availableThemes}
                        .isAudioWindowOpen=${this.isAudioWindowOpen}
                        .isSearchWindowOpen=${this.isSearchWindowOpen}
                    ></buddy-header>
                    <div class="main-content">${views[this.currentView]}</div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-app', BuddyApp);
