/**
 * UI Handlers Mixin
 * Handles UI interactions, toggles, and audio/screen capture controls
 */
export const UIHandlersMixin = (superClass) => class extends superClass {
    
    // --- Updated Toggle Handlers for Real-time Models Only ---
    async toggleAudioCapture() {
        if (!this.sessionActive || !this.isSelectedModelRealTime) return;
        this.isAudioActive = !this.isAudioActive;
        if (this.isAudioActive) {
            await buddy.resumeAudio();
            this.statusText = this.statusText.replace(/Audio Paused/, 'Listening').trim();
        } else {
            await buddy.pauseAudio();
            this.statusText = (this.statusText.includes('Listening') ? this.statusText.replace(/Listening/, 'Audio Paused') : 'Audio Paused');
        }
        this.requestUpdate();
    }

    async toggleScreenCapture() {
        if (!this.sessionActive || !this.isSelectedModelScreenshotCapable) return;
        this.isScreenActive = !this.isScreenActive;
        
        if (this.isScreenActive) {
            await buddy.resumeScreen();
            
            // Enable real-time video streaming for Gemini 2.0 Live models
            if (this.isSelectedModelRealTime) {
                buddy.enableRealtimeVideoStreaming();
                this.statusText = this.statusText.replace(/Video Paused/, 'Streaming Video').trim();
            } else {
                this.statusText = this.statusText.replace(/Screen Paused/, 'Viewing').trim();
            }
        } else {
            await buddy.pauseScreen();
            
            // Disable real-time video streaming for Gemini 2.0 Live models
            if (this.isSelectedModelRealTime) {
                buddy.disableRealtimeVideoStreaming();
                this.statusText = (this.statusText.includes('Streaming Video') ? this.statusText.replace(/Streaming Video/, 'Video Paused') : 'Video Paused');
            } else {
                this.statusText = (this.statusText.includes('Viewing') ? this.statusText.replace(/Viewing/, 'Screen Paused') : 'Screen Paused');
            }
        }
        this.requestUpdate();
    }

    handleInput(e, property) {
        localStorage.setItem(property, e.target.value);
    }

    handleProfileSelect(e) {
        this.selectedProfile = e.target.value;
        localStorage.setItem('selectedProfile', this.selectedProfile);
    }

    handleLanguageSelect(e) {
        this.selectedLanguage = e.target.value;
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
    }

    handleProviderSelect(e) {
        this.selectedProvider = e.target.value;
        localStorage.setItem('selectedProvider', this.selectedProvider);
        // Reset model when provider changes
        this.selectedModel = '';
        localStorage.setItem('selectedModel', '');
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        
        // Notify main process of view change
        if (changedProperties.has('currentView')) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('view-changed', this.currentView);
            
            // If we're entering the chat view, scroll to the bottom
            if (this.currentView === 'assistant') {
                this.scrollToBottom(true);
            }
        }
    }
};
