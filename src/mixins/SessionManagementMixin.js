/**
 * Session Management Mixin
 * Handles session lifecycle, model initialization, and AI operations
 */
export const SessionManagementMixin = (superClass) => class extends superClass {
    
    async handleStartSession() {
        await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage, this.selectedModel);
        buddy.startCapture();
        this.sessionActive = true;
        this.isAudioActive = true; // Audio starts active
        this.isScreenActive = true; // Screen starts active
        this.startTime = Date.now();
        this.statusText = 'Starting...';
    }

    async handleEndSession() {
        if (this.sessionActive) {
            this.saveHistory();
            
            // Only stop capture if it was started (for real-time models)
            if (this.isSelectedModelRealTime) {
                buddy.disableRealtimeVideoStreaming(); // Disable real-time video streaming first
                buddy.stopCapture();
            }
            
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('close-session');
            this.sessionActive = false;
            this.isAudioActive = false;
            this.isScreenActive = false;
            this.statusText = 'Stop';
        }
    }

    async handleNewChat() {
        // Save current conversation if it exists
        if (this.sessionActive && this.chatMessages.length > 1) {
            await this.saveHistory();
        }
        
        // Reset chat state
        this.responses = [];
        this.currentResponseIndex = -1;
        this.chatMessages = [];
        this.sessionActive = false;
        this.isAudioActive = false;
        this.isScreenActive = false;
        this.startTime = null;
        this.statusText = '';
        this.isStreamingActive = false;
        this.streamingResponseText = '';
        
        // Reset assistant view states (loading animations, stop button, etc.)
        const assistantView = this.shadowRoot?.querySelector('buddy-assistant-view');
        if (assistantView && assistantView.resetStates) {
            assistantView.resetStates();
        }
        
        // Navigate to assistant view
        this.currentView = 'assistant';
        this.requestUpdate();
    }

    async autoStartSession() {
        // Validate that a model is selected
        if (!this.selectedModel) {
            this.setStatus('Error: Please select a model first');
            return false;
        }

        try {
            await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage, this.selectedModel);
            this.disableAllFeatures();
            
            if (this.isSelectedModelRealTime) {
                // Real-time: enable all real-time features
                this.enableRealTimeFeatures();
            } else {
                // Non-real-time: enable only supported features
                this.enableFeaturesForCapabilities(this.selectedModelCapabilities);
            }
            
            this.sessionActive = true;
            this.startTime = Date.now();
            this.setStatus('Ready');
            
            return true;
        } catch (error) {
            this.setStatus('Error starting session: ' + error.message);
            return false;
        }
    }

    async handleStart() { // This is the main "Start Session" from the main view - kept for compatibility
        const success = await this.autoStartSession();
        if (success) {
            this.responses = [];
            this.currentResponseIndex = -1;
            this.chatMessages = []; // Clear chat messages
            this.currentView = 'assistant';
            
            // Add welcome message to chat
            const welcomeText = `<div style="text-align: center"><strong>Hi, How Can I Help You?</strong></div>`;
            this.addChatMessage(welcomeText, 'assistant');
        }
    }

    async handleClose() {
        if (this.currentView === 'customize' || this.currentView === 'help' || this.currentView === 'history' || this.currentView === 'settings' || this.currentView === 'models' || this.currentView === 'prompt-manager') {
            this.currentView = 'assistant';
        } else if (this.currentView === 'assistant') {
            // Auto-save conversation if there are messages
            if (this.sessionActive && this.chatMessages.length > 1) {
                await this.saveHistory();
            }
            // Quit the entire application
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('quit-application');

        } else {
            // Quit the entire application
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('quit-application');
        }
    }

    async handleRestartSession() {
        // Validate that a model is selected
        if (!this.selectedModel) {
            this.setStatus('Error: Please select a model first');
            return;
        }

        if (this.sessionActive) {
            // Stop current session without clearing chat
            if (this.isSelectedModelRealTime) {
                buddy.stopCapture();
            } else {
                // Add logic to stop non-real-time features if needed
                if (buddy.disableScreenshotFeature) buddy.disableScreenshotFeature();
                if (buddy.disableAudioInputFeature) buddy.disableAudioInputFeature();
            }
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('close-session');
        }

        this.sessionActive = false;
        this.disableAllFeatures();
        this.statusText = 'Switching model...';
        this.requestUpdate(); // Update UI to show loading state

        // Initialize with new model
        await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage, this.selectedModel);
        
        if (this.isSelectedModelRealTime) {
            this.enableRealTimeFeatures();
        } else {
            this.enableFeaturesForCapabilities(this.selectedModelCapabilities);
        }
        
        this.sessionActive = true;
        this.statusText = 'Live';
        this.requestUpdate(); // Update UI to show live state
        
        // Add a subtle notification about model switch
        const modelName = this.getModelDisplayName(this.selectedModel);
        const switchMessage = `<div style="text-align: center; opacity: 0.7; font-size: 0.9em; margin: 10px 0;"><em>Switched to ${modelName}</em></div>`;
        this.addChatMessage(switchMessage, 'assistant');
    }

    async handleRestart() {
        // Validate that a model is selected
        if (!this.selectedModel) {
            this.setStatus('Error: Please select a model first');
            return;
        }

        if (this.sessionActive) {
            this.saveHistory();
            // Stop all features
            if (this.isSelectedModelRealTime) {
                buddy.stopCapture();
            } else {
                // Add logic to stop non-real-time features if needed
                if (buddy.disableScreenshotFeature) buddy.disableScreenshotFeature();
                if (buddy.disableAudioInputFeature) buddy.disableAudioInputFeature();
            }
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('close-session');
        }

        this.responses = [];
        this.currentResponseIndex = -1;
        this.chatMessages = []; // Clear chat messages
        this.sessionActive = false; // Will be set to true by start logic below
        this.disableAllFeatures();
        this.statusText = 'Restarting...';
        
        // Reset assistant view states (loading animations, stop button, etc.)
        const assistantView = this.shadowRoot?.querySelector('buddy-assistant-view');
        if (assistantView && assistantView.resetStates) {
            assistantView.resetStates();
        }

        await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage, this.selectedModel);
        
        if (this.isSelectedModelRealTime) {
            this.enableRealTimeFeatures();
        } else {
            this.enableFeaturesForCapabilities(this.selectedModelCapabilities);
        }
        
        this.sessionActive = true;
        
        // Add welcome message to restarted chat
        const welcomeText = `<div style="text-align: center"><strong>Hi, How Can I Help You?</strong></div>`;
        this.addChatMessage(welcomeText, 'assistant');
    }

    async saveHistory() {
        if (this.chatMessages.length > 1) {
            const sessionData = {
                messages: this.chatMessages,
                timestamp: new Date().toISOString(),
                provider: this.selectedProvider,
                model: this.selectedModel,
                duration: this.startTime ? Date.now() - this.startTime : 0
            };
            
            if (this.isAuthenticated && !this.isGuest) {
                // Save to database for authenticated users
                try {
                    const { ipcRenderer } = window.require('electron');
                    const result = await ipcRenderer.invoke('save-chat-session', {
                        userId: this.user?.id,
                        sessionData
                    });
                    if (result.success) {
                        // Add to local history array for immediate UI update
                        this.history.unshift(sessionData);
                        if (this.history.length > this.historyLimit) {
                            this.history.length = this.historyLimit;
                        }
                        console.log('Chat session saved to database');
                    } else {
                        throw new Error(result.error || 'Failed to save to database');
                    }
                } catch (error) {
                    console.error('Failed to save chat session to database:', error);
                    // Fallback to localStorage
                    this.saveToLocalStorageHistory(sessionData);
                }
            } else {
                // Save to local storage for guests
                this.saveToLocalStorageHistory(sessionData);
            }
        }
    }

    loadSessionFromHistory(index) {
        const session = this.history[index];
        if (session) {
            // Ensure every message has a unique id
            this.chatMessages = session.messages.map(msg => ({
                ...msg,
                id: msg.id || (Date.now().toString(36) + Math.random().toString(36).slice(2))
            }));
            this.selectedProvider = session.provider;
            this.selectedModel = session.model;
            this.sessionActive = false;
            this.isAudioActive = false;
            this.isScreenActive = false;
            this.startTime = null;
            this.statusText = 'Viewing history';
            this.currentView = 'assistant';
        }
    }

    // Helper to disable all features
    disableAllFeatures() {
        this.isScreenActive = false;
        this.isAudioActive = false;
        // Add more feature flags as needed
    }

    // Helper to enable real-time features
    enableRealTimeFeatures() {
        buddy.startCapture();
        this.isScreenActive = true;
        this.isAudioActive = true;
        
        // Enable real-time video streaming for Gemini 2.0 Live models
        setTimeout(() => {
            buddy.enableRealtimeVideoStreaming();
        }, 1000); // Small delay to ensure capture is started
        
        // Add more real-time features as needed
    }

    // Helper to enable features based on capabilities for non-real-time models
    enableFeaturesForCapabilities(capabilities) {
        // Only enable what the model supports
        if (capabilities.image) {
            // Enable screenshot feature (single capture, not interval)
            if (buddy.enableScreenshotFeature) {
                buddy.enableScreenshotFeature();
            }
            this.isScreenActive = true;
        }
        if (capabilities.audio) {
            // Enable audio input (not real-time streaming)
            if (buddy.enableAudioInputFeature) {
                buddy.enableAudioInputFeature();
            }
            this.isAudioActive = true;
        }
        // Add more capabilities as needed (text, video, etc.)
    }
};
