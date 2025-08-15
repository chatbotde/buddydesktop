/**
 * Event Handlers Mixin
 * Handles all event listeners and their setup in firstUpdated()
 */
export const EventHandlersMixin = (superClass) => class extends superClass {
    
    setupEventListeners() {
        // Login event handlers
        this.addEventListener('login-success', async (e) => {
            this.user = e.detail.user;
            this.isAuthenticated = true;
            this.isGuest = e.detail.isGuest || false;
            
            // Initialize auth service
            await this.initializeAuth();
            
            // Load available themes and apply saved settings
            await this.loadAvailableThemes();
            await this.loadSavedTheme();
            await this.loadSavedOpacity();
            
            // Set default model if none selected
            if (!this.selectedModel) {
                this.selectedModel = this.getDefaultModelForProvider(this.selectedProvider);
            }
            
            // Navigate to assistant view (history will load lazily when needed)
            this.currentView = 'assistant';
            this.requestUpdate();
        });
        
        this.addEventListener('provider-select', async (e) => {
            
            if (this.isGuest) {
                localStorage.setItem('selectedProvider', e.detail.provider);
            } else {
                this.selectedProvider = e.detail.provider;
                await this.saveUserPreferences();
            }
            
            // Auto-restart session with new provider and model if session is active
            if (this.sessionActive) {
                await this.handleRestartSession();
            }
            
            this.requestUpdate();
        });
        
        this.addEventListener('model-select', async (e) => {
            console.log('🔄 Model selected:', e.detail.model);
            this.selectedModel = e.detail.model;
            
            // Update the provider to match the selected model's provider
            const modelData = this.getModelData(this.selectedModel);
            if (modelData && modelData.provider) {
                this.selectedProvider = modelData.provider;
            }
            
            // Log model capabilities for debugging
            console.log('📊 Model capabilities:', {
                model: this.selectedModel,
                provider: this.selectedProvider,
                isRealTime: this.isSelectedModelRealTime,
                modelData: modelData
            });
            
            if (this.isGuest) {
                localStorage.setItem('selectedModel', this.selectedModel);
                localStorage.setItem('selectedProvider', this.selectedProvider);
            } else {
                await this.saveUserPreferences();
            }
            
            // Update all components that depend on model selection
            this.updateModelDependentComponents();
            
            // Auto-restart session with new model if session is active
            if (this.sessionActive) {
                await this.handleRestartSession();
            }
            
            this.requestUpdate();
        });
        
        this.addEventListener('api-key-input', (e) => {
            localStorage.setItem(`apiKey_${this.selectedProvider}`, e.detail.apiKey);
            this.requestUpdate();
        });
        
        this.addEventListener('new-chat', async () => {
            await this.handleNewChat();
        });
        
        this.addEventListener('user-config-access-granted', async (e) => {
            console.log('🔑 User configuration access granted');
            // Start guest session
            const result = await window.buddy.startGuestSession();
            if (result.success) {
                this.user = null;
                this.isAuthenticated = false;
                this.isGuest = true;
                
                // Load user preferences (history loads lazily when needed)
                await this.loadAvailableThemes();
                await this.loadSavedTheme();
                await this.loadSavedOpacity();
                
                // Set default model if none selected
                if (!this.selectedModel) {
                    this.selectedModel = this.getDefaultModelForProvider(this.selectedProvider);
                }
                
                // Navigate directly to assistant (chat) view
                this.currentView = 'assistant';
                this.requestUpdate();
            } else {
                console.error('Failed to start guest session for user config mode:', result.error);
            }
        });
        
        // Settings view now works exactly like main view, no separate save needed
        
        this.addEventListener('profile-select', async (e) => {
            this.selectedProfile = e.detail.profile;
            
            if (this.isGuest) {
                localStorage.setItem('selectedProfile', this.selectedProfile);
            } else {
                await this.saveUserPreferences();
            }
            
            this.requestUpdate();
        });
        
        this.addEventListener('language-select', async (e) => {
            this.selectedLanguage = e.detail.language;
            
            if (this.isGuest) {
                localStorage.setItem('selectedLanguage', this.selectedLanguage);
            } else {
                await this.saveUserPreferences();
            }
            
            this.requestUpdate();
        });
        
        this.addEventListener('custom-prompt-input', (e) => {
            localStorage.setItem('customPrompt', e.detail.prompt);
            this.requestUpdate();
        });
        
        this.addEventListener('load-session', (e) => {
            this.loadSessionFromHistory(e.detail.index);
        });
        
        this.addEventListener('send-message', async (e) => {
            const message = e.detail.text;
            const screenshots = e.detail.screenshots;
            
            // Auto-start session if not active
            if (!this.sessionActive) {
                const success = await this.autoStartSession();
                if (!success) return;
            }
            
            // Add user message with screenshots if provided
            this.addChatMessage(message, 'user', false, screenshots);
            await this.scrollToUserMessage();
            
            const result = await buddy.sendTextMessage(message, screenshots);
            if (!result.success) {
                console.error('Failed to send message:', result.error);
                this.setStatus('Error sending message: ' + result.error);
                this.addChatMessage('Sorry, there was an error sending your message.', 'assistant');
            } else {
                this.setStatus('Message sent');
            }
        });

        this.addEventListener('stop-streaming', async (e) => {
            console.log('🛑 Stop streaming requested');
            
            // Immediately clear streaming states for smooth UX
            this.isStreamingActive = false;
            
            // Find and clear the streaming state of the last assistant message
            if (this.chatMessages && this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage && lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    lastMessage.isStreaming = false;
                }
            }
            
            this.requestUpdate();
            
            // Clear assistant view states immediately
            const assistantView = this.shadowRoot.querySelector('buddy-assistant-view');
            if (assistantView) {
                assistantView.isWaitingForResponse = false;
                assistantView.isStreamingActive = false;
                assistantView.clearLoadingState();
                assistantView.requestUpdate();
            }
            
            // Call the backend to stop streaming
            const result = await buddy.stopStreaming();
            if (result.success) {
                console.log('✅ Streaming stopped successfully');
            } else {
                console.error('❌ Failed to stop streaming:', result.error);
            }
        });
        
        this.addEventListener('delete-message', (e) => {
            if (e.detail.id) {
                this.deleteMessage(e.detail.id);
            }
        });

        // ...existing event handlers...
        this.addEventListener('close', async () => {
            await this.handleClose();
        });
        this.addEventListener('navigate', async (e) => {
            const targetView = e.detail.view === 'main' ? 'assistant' : e.detail.view;
            
            // Only load history when actually navigating to history view
            if (targetView === 'history' && this.currentView !== 'history') {
                console.log('📚 Navigating to history view - lazy loading history data...');
                await this.loadChatHistory();
            }
            
            this.currentView = targetView;
        });

        this.addEventListener('toggle-audio', async () => {
            await this.toggleAudioCapture();
        });
        this.addEventListener('toggle-screen', async () => {
            await this.toggleScreenCapture();
        });
        this.addEventListener('toggle-content-protection', async (e) => {
            await this.toggleContentProtection(e.detail.enabled);
        });
        this.addEventListener('toggle-workspace-visibility', async (e) => {
            await this.toggleWorkspaceVisibility(e.detail.enabled);
        });
        this.addEventListener('open-audio-window', async () => {
            await this.openAudioWindow();
        });
        this.addEventListener('toggle-search', async () => {
            await this.toggleSearch();
        });
        this.addEventListener('open-search-window', async () => {
            await this.openSearchWindow();
        });
        this.addEventListener('open-marketplace-window', async () => {
            await this.openMarketplaceWindow();
        });
        this.addEventListener('toggle-opacity-control', async (e) => {
            await this.toggleOpacityControl(e.detail.active);
        });
        this.addEventListener('opacity-change', async (e) => {
            await this.setWindowOpacity(e.detail.opacity);
        });
        this.addEventListener('window-theme-change', async (e) => {
            await this.setWindowTheme(e.detail.theme);
        });
        this.addEventListener('toggle-header', () => {
            this.isHeaderVisible = !this.isHeaderVisible;
            this.requestUpdate();
        });
        this.addEventListener('delete-session', (e) => {
            this.deleteSession(e.detail.index);
        });
        this.addEventListener('extend-history-limit', () => {
            this.extendHistoryLimit();
        });
        this.addEventListener('decrease-history-limit', () => {
            this.decreaseHistoryLimit();
        });
        this.addEventListener('model-toggle', (e) => {
            const { modelId, enabled } = e.detail;
            if (enabled) {
                this.enabledModels = [...this.enabledModels, modelId];
            } else {
                this.enabledModels = this.enabledModels.filter(id => id !== modelId);
            }
            this.saveEnabledModels();
            this.requestUpdate();
        });
        this.addEventListener('reset-to-defaults', (e) => {
            this.enabledModels = [...e.detail.defaultModels];
            this.saveEnabledModels();
            this.requestUpdate();
        });
        
        // Custom profile event handlers
        this.addEventListener('create-profile', (e) => {
            this.createCustomProfile(e.detail.profile);
        });
        
        this.addEventListener('delete-profile', (e) => {
            this.deleteCustomProfile(e.detail.profileValue);
        });

        // Custom model event handlers
        this.addEventListener('custom-model-saved', (e) => {
            const { model, isEdit } = e.detail;
            console.log('🔄 Custom model saved event received:', model.name);
            
            // If it's a new model and no model is currently selected, select this one
            if (!isEdit && !this.selectedModel) {
                this.selectedModel = model.id;
                console.log('🎯 Auto-selecting new custom model:', model.id);
                
                if (this.isGuest) {
                    localStorage.setItem('selectedModel', this.selectedModel);
                } else {
                    this.saveUserPreferences();
                }
            }
            
            // Refresh models list and update UI
            this.requestUpdate();
        });

        this.addEventListener('model-deleted', (e) => {
            const { modelId } = e.detail;
            console.log('🗑️ Custom model deleted:', modelId);
            
            // If the deleted model was selected, reset to default
            if (this.selectedModel === modelId) {
                this.selectedModel = this.getDefaultModelForProvider(this.selectedProvider);
                console.log('🔄 Resetting selected model to:', this.selectedModel);
                
                if (this.isGuest) {
                    localStorage.setItem('selectedModel', this.selectedModel);
                } else {
                    this.saveUserPreferences();
                }
            }
            this.requestUpdate();
        });
    }

    setupIPCListeners() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('marketplace-buttons-updated', (event, data) => {
                this._handleMarketplaceButtonsUpdated(data.selectedButtons);
            });
            
            // Listen for window state changes
            ipcRenderer.on('audio-window-closed', () => {
                this.isAudioWindowOpen = false;
                this.requestUpdate();
            });
            
            ipcRenderer.on('search-window-closed', () => {
                this.isSearchWindowOpen = false;
                this.requestUpdate();
            });
            
            // Listen for streaming stopped events
            ipcRenderer.on('streaming-stopped', (event, data) => {
                console.log('🛑 Streaming stopped event received:', data);
                this.isStreamingActive = false;
                
                // Find and clear the streaming state of the last assistant message
                if (this.chatMessages && this.chatMessages.length > 0) {
                    if (lastMessage && lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                        lastMessage.isStreaming = false;
                    }
                }
                
                this.requestUpdate();
                
                // Clear the assistant view loading state immediately
                const assistantView = this.shadowRoot.querySelector('buddy-assistant-view');
                if (assistantView) {
                    assistantView.isWaitingForResponse = false;
                    assistantView.isStreamingActive = false;
                    assistantView.clearLoadingState();
                    assistantView.requestUpdate();
                }
            });

            // Listen for clear chat shortcut
            ipcRenderer.on('clear-chat-shortcut', async () => {
                console.log('🧹 Clear chat shortcut triggered');
                await this.handleNewChat();
            });

            // Listen for toggle header shortcut
            ipcRenderer.on('toggle-header-shortcut', () => {
                console.log('🎛️ Toggle header shortcut triggered');
                this.isHeaderVisible = !this.isHeaderVisible;
                this.requestUpdate();
            });

            // Listen for theme opacity reset shortcut
            ipcRenderer.on('reset-theme-opacity', async () => {
                console.log('🎨 Theme opacity reset shortcut triggered');
                await this.setWindowOpacity(1.0); // Reset to 100%
            });

            // Listen for close application shortcut
            ipcRenderer.on('close-application-shortcut', async () => {
                console.log('🚪 Close application shortcut triggered');
                await this.handleWindowClose();
            });
            
            // Listen for screenshot capture shortcut (Alt+A)
            ipcRenderer.on('capture-and-send-screenshot', async () => {
                console.log('📸 Screenshot capture shortcut triggered');
                try {
                    // Auto-start session if not active
                    if (!this.sessionActive) {
                        const success = await this.autoStartSession();
                        if (!success) {
                            console.error('Failed to start session for screenshot capture');
                            return;
                        }
                    }
                    
                    // Capture screenshot and send it
                    const result = await window.buddy.captureAndSendScreenshot();
                    if (result && result.success) {
                        console.log('✅ Screenshot captured and sent successfully');
                        this.setStatus('Screenshot captured and analyzing...');
                    } else {
                        console.error('❌ Failed to capture screenshot:', result?.error);
                        this.setStatus('Failed to capture screenshot');
                    }
                } catch (error) {
                    console.error('Error handling screenshot capture:', error);
                    this.setStatus('Error capturing screenshot: ' + error.message);
                }
            });

        }
    }

    setupLinkHandler() {
        // Add event listener for link clicks to open in external browser
        this._linkClickHandler = (event) => {
            // Only handle left-clicks, no modifier keys
            if (event.target && event.target.tagName === 'A' && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                const href = event.target.getAttribute('href');
                if (href && href.startsWith('http')) {
                    event.preventDefault();
                    try {
                        const { shell } = window.require('electron');
                        shell.openExternal(href);
                    } catch (err) {
                        console.error('Failed to open external link:', err);
                    }
                }
            }
        };
        this.shadowRoot.addEventListener('click', this._linkClickHandler);
    }

    removeIPCListeners() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeAllListeners('update-response');
            ipcRenderer.removeAllListeners('update-status');
            ipcRenderer.removeAllListeners('marketplace-buttons-updated');
            ipcRenderer.removeAllListeners('clear-chat-shortcut');
            ipcRenderer.removeAllListeners('toggle-header-shortcut');
            ipcRenderer.removeAllListeners('reset-theme-opacity');
            ipcRenderer.removeAllListeners('close-application-shortcut');
            ipcRenderer.removeAllListeners('capture-and-send-screenshot');
        }
    }

    removeLinkHandler() {
        // Remove the link click handler
        if (this._linkClickHandler) {
            this.shadowRoot.removeEventListener('click', this._linkClickHandler);
        }
    }
};
