import { html, css, LitElement } from './lit-core-2.7.4.min.js';
import './marked.min.js';
import './components/buddy-header.js';
import './components/buddy-login-view.js';
import './components/buddy-main-view.js';
import './components/buddy-customize-view.js';
import './components/buddy-help-view.js';
import './components/buddy-history-view.js';
import './components/buddy-assistant-view.js';
import './components/buddy-settings-view.js';
import './components/buddy-models-view.js';
import './components/buddy-system-prompt-manager.js';
import { getAllModels, getModelsByProvider, getEnabledModels } from './services/models-service.js';
import { buddyAppStyles } from './components/ui/buddy-app-style.js';


class BuddyApp extends LitElement {
    



    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        startTime: { type: Number },
        isRecording: { type: Boolean },
        sessionActive: { type: Boolean },
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        selectedProvider: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        streamingResponseText: { type: String },
        isStreamingActive: { type: Boolean },
        isAudioActive: { type: Boolean },
        isScreenActive: { type: Boolean },
        currentTheme: { type: String },
        chatMessages: { type: Array },
        selectedModel: { type: String },
        history: { type: Array },
        providers: { type: Array },
        historyLimit: { type: Number },
        user: { type: Object },
        isAuthenticated: { type: Boolean },
        isGuest: { type: Boolean },
        enabledModels: { type: Array },
        customProfiles: { type: Array },
        customMenuButtons: { type: Array },
    };

    static styles = [buddyAppStyles];

    constructor() {
        super();
        this.currentView = 'login'; // Start with login view
        this.statusText = '';
        this.startTime = null;
        this.sessionActive = false;
        this.selectedProfile = 'default';
        this.selectedLanguage = 'en-US';
        this.selectedProvider = 'google';
        this.responses = [];
        this.currentResponseIndex = -1;
        this.streamingResponseText = '';
        this.isStreamingActive = false;
        this.isAudioActive = false;
        this.isScreenActive = false;
        this.currentTheme = 'dark';
        this.chatMessages = [];
        this.selectedModel = '';
        this.history = [];
        this.providers = [
            { value: 'google', name: 'Google Gemini', keyLabel: 'Gemini API Key' },
            { value: 'openai', name: 'OpenAI', keyLabel: 'OpenAI API Key' },
            { value: 'anthropic', name: 'Anthropic Claude', keyLabel: 'Anthropic API Key' },
            { value: 'deepseek', name: 'DeepSeek', keyLabel: 'DeepSeek API Key' },
            { value: 'openrouter', name: 'OpenRouter', keyLabel: 'OpenRouter API Key' },

        ];
        this.historyLimit = 5;
        this.user = null;
        this.isAuthenticated = false;
        this.isGuest = false;
        // Load enabled models from localStorage or use defaults
        this.enabledModels = this.loadEnabledModels();
        this.customProfiles = this.loadCustomProfiles();
        this.customMenuButtons = this.loadUserPreference('customMenuButtons') || ['home', 'chat', 'history', 'models', 'customize', 'help'];
        
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            // Check if user has an existing auth token
            const token = localStorage.getItem('authToken');
            if (token) {
                const result = await buddy.verifyAuthToken(token);
                if (result.success) {
                    this.user = result.user;
                    this.isAuthenticated = true;
                    this.isGuest = false;
                    
                    // Load user preferences
                    if (this.user.preferences) {
                        this.selectedProfile = this.user.preferences.selectedProfile || 'default';
                        this.selectedLanguage = this.user.preferences.selectedLanguage || 'en-US';
                        this.selectedProvider = this.user.preferences.selectedProvider || 'google';
                        this.currentTheme = this.user.preferences.theme || 'dark';
                    }
                    
                    this.selectedModel = this.getDefaultModelForProvider(this.selectedProvider);
                    
                    // Load chat history from database
                    await this.loadChatHistory();
                    
                    this.currentView = 'assistant';
                } else {
                    // Invalid token, remove it
                    localStorage.removeItem('authToken');
                    this.currentView = 'login';
                }
            } else {
                this.currentView = 'login';
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            this.currentView = 'login';
        }
    }

    async loadChatHistory() {
        try {
            const result = await buddy.getChatHistory(this.historyLimit);
            if (result.success) {
                this.history = result.history;
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    async saveUserPreferences() {
        if (this.isAuthenticated && !this.isGuest) {
            try {
                const preferences = {
                    selectedProfile: this.selectedProfile,
                    selectedLanguage: this.selectedLanguage,
                    selectedProvider: this.selectedProvider,
                    theme: this.currentTheme
                };
                await buddy.updateUserPreferences(preferences);
            } catch (error) {
                console.error('Failed to save user preferences:', error);
            }
        }
    }

    saveUserPreference(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save user preference ${key}:`, error);
        }
    }

    loadUserPreference(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Failed to load user preference ${key}:`, error);
            return null;
        }
    }

    getDefaultModelForProvider(provider) {
        const models = getModelsByProvider(provider);
        if (!models || models.length === 0) return '';
        
        // Return the first model for the provider as default
        return models[0].id;
    }

    getDefaultEnabledModels() {
        // Default preset: Enable popular and reliable models, disable experimental/premium ones
        return [
            'claude-4-sonnet',      // Enabled - Popular and reliable
            'claude-3.5-sonnet',    // Enabled - Fast and efficient
            'gemini-2.5-flash',     // Enabled - Fast Google model
            'o3'                    // Enabled - OpenAI model
            // Disabled by default:
            // 'claude-4-opus' - Premium/expensive model
            // 'gemini-2.5-pro' - Premium model
        ];
    }

    loadEnabledModels() {
        try {
            const saved = localStorage.getItem('enabledModels');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate that it's an array
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn('Failed to load enabled models from localStorage:', error);
        }
        
        // Return default preset if no saved data or error
        return this.getDefaultEnabledModels();
    }

    saveEnabledModels() {
        try {
            localStorage.setItem('enabledModels', JSON.stringify(this.enabledModels));
        } catch (error) {
            console.warn('Failed to save enabled models to localStorage:', error);
        }
    }

    loadCustomProfiles() {
        try {
            const saved = localStorage.getItem('customProfiles');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate that it's an array
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn('Failed to load custom profiles from localStorage:', error);
        }
        
        // Return empty array if no saved data or error
        return [];
    }

    saveCustomProfiles() {
        try {
            localStorage.setItem('customProfiles', JSON.stringify(this.customProfiles));
        } catch (error) {
            console.warn('Failed to save custom profiles to localStorage:', error);
        }
    }

    createCustomProfile(profileData) {
        // Add the new profile to the array
        this.customProfiles = [...this.customProfiles, profileData];
        this.saveCustomProfiles();
        this.requestUpdate();
    }

    deleteCustomProfile(profileValue) {
        // Remove the profile from the array
        this.customProfiles = this.customProfiles.filter(p => p.value !== profileValue);
        this.saveCustomProfiles();
        
        // If the deleted profile was selected, switch to default
        if (this.selectedProfile === profileValue) {
            this.selectedProfile = 'default';
            if (this.isGuest) {
                localStorage.setItem('selectedProfile', this.selectedProfile);
            } else {
                this.saveUserPreferences();
            }
        }
        
        this.requestUpdate();
    }

    getModelsByProviderForHeader() {
        const modelsByProvider = {};
        this.providers.forEach(provider => {
            const models = getModelsByProvider(provider.value);
            modelsByProvider[provider.value] = models.map(model => model.id);
        });
        return modelsByProvider;
    }

    getAvailableModelsForCurrentMode() {
        // Always show all models for the provider
        return getModelsByProvider(this.selectedProvider) || [];
    }

    get disabledModelIdsForCurrentMode() {
        // If in a session, disable models that do not have live capability
        if (this.sessionActive) {
            return getModelsByProvider(this.selectedProvider)
                .filter(m => !m.live)
                .map(m => m.id);
        }
        // Otherwise, no models are disabled
        return [];
    }

    get mainViewModels() {
        return this.getAvailableModelsForCurrentMode();
    }

    // Add method to check if selected model supports real-time
    get isSelectedModelRealTime() {
        const models = getModelsByProvider(this.selectedProvider) || [];
        const selectedModelObj = models.find(m => m.id === this.selectedModel);
        return selectedModelObj ? selectedModelObj.live : false;
    }

    get mainViewApiKey() {
        return localStorage.getItem(`apiKey_${this.selectedProvider}`) || '';
    }

    get mainViewKeyLabel() {
        const provider = this.providers.find(p => p.value === this.selectedProvider);
        return provider ? provider.keyLabel : 'API Key';
    }

    get mainViewHasEnvironmentKey() {
        // This will be updated by the component itself when provider changes
        return false; // Default value, component will check and update
    }

    get customizeViewCustomPrompt() {
        return localStorage.getItem('customPrompt') || '';
    }

    firstUpdated() {
        // Login event handlers
        this.addEventListener('login-success', async (e) => {
            if (e.detail.isGuest) {
                this.isGuest = true;
                this.isAuthenticated = false;
                this.user = null;
                // Load local storage preferences for guest
                this.selectedProfile = localStorage.getItem('selectedProfile') || 'default';
                this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en-US';
                this.selectedProvider = localStorage.getItem('selectedProvider') || 'google';
                this.currentTheme = localStorage.getItem('theme') || 'dark';
                this.selectedModel = localStorage.getItem('selectedModel') || this.getDefaultModelForProvider(this.selectedProvider);
                this.history = (JSON.parse(localStorage.getItem('chatHistory')) || []).slice(0, this.historyLimit);
                this.historyLimit = parseInt(localStorage.getItem('historyLimit'), 10) || 5;
            } else {
                this.user = e.detail.user;
                this.isAuthenticated = true;
                this.isGuest = false;
                
                // Load user preferences
                if (this.user.preferences) {
                    this.selectedProfile = this.user.preferences.selectedProfile || 'default';
                    this.selectedLanguage = this.user.preferences.selectedLanguage || 'en-US';
                    this.selectedProvider = this.user.preferences.selectedProvider || 'google';
                    this.currentTheme = this.user.preferences.theme || 'dark';
                }
                
                this.selectedModel = this.getDefaultModelForProvider(this.selectedProvider);
                await this.loadChatHistory();
            }
            
            this.currentView = 'assistant';
            this.requestUpdate();
        });
        
        this.addEventListener('provider-select', async (e) => {
            this.selectedProvider = e.detail.provider;
            this.selectedModel = this.getDefaultModelForProvider(this.selectedProvider);
            
            if (this.isGuest) {
                localStorage.setItem('selectedProvider', this.selectedProvider);
                localStorage.setItem('selectedModel', this.selectedModel);
            } else {
                await this.saveUserPreferences();
            }
            
            this.requestUpdate();
        });
        
        this.addEventListener('model-select', async (e) => {
            this.selectedModel = e.detail.model;
            
            if (this.isGuest) {
                localStorage.setItem('selectedModel', this.selectedModel);
            } else {
                await this.saveUserPreferences();
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
                await this.autoStartSession();
            }
            
            // Add user message with screenshots if provided
            this.addChatMessage(message, 'user', false, screenshots);
            await this.scrollToUserMessage();
            
            const result = await buddy.sendTextMessage(message, screenshots);
            if (!result.success) {
                this.setStatus('Error sending message: ' + result.error);
                this.addChatMessage(' error sending your message.', 'assistant');
            } else {
                this.setStatus('sending...');
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
        this.addEventListener('navigate', (e) => {
            this.currentView = e.detail.view;
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
        this.addEventListener('open-marketplace-window', async () => {
            await this.openMarketplaceWindow();
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
                    await buddy.saveChatSession(sessionData);
                    // Reload history from database
                    await this.loadChatHistory();
                } catch (error) {
                    console.error('Failed to save session to database:', error);
                    // Fallback to local storage
                    this.saveToLocalStorage(sessionData);
                }
            } else {
                // Save to local storage for guests
                this.saveToLocalStorage(sessionData);
            }
        }
    }
    
    saveToLocalStorage(sessionData) {
        const newHistory = [...this.history];
        newHistory.unshift(sessionData);
        // Enforce limit
        if (newHistory.length > this.historyLimit) {
            newHistory.length = this.historyLimit;
        }
        this.history = newHistory;
        localStorage.setItem('chatHistory', JSON.stringify(this.history));
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

    async handleWindowClose() {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('window-close');
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('theme', this.currentTheme);
        
        // Set up IPC listeners for marketplace
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('marketplace-buttons-updated', (event, data) => {
                this._handleMarketplaceButtonsUpdated(data.selectedButtons);
            });
        }
        
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
                        window.open(href, '_blank'); // fallback
                    }
                }
            }
        };
        this.shadowRoot.addEventListener('click', this._linkClickHandler);
    }

    setStatus(t) {
        this.statusText = t;
    }

    // Replace existing setResponse method
    setResponse(data) {
        let responseText;
        let isStreamingChunk = false;
        let isFinalChunkOfStream = false;
        let isCompleteNonStreamed = false;

        if (typeof data === 'object' && data !== null && typeof data.text === 'string') {
            responseText = data.text;
            if (data.isStreaming === true && data.isComplete !== true) {
                isStreamingChunk = true;
            } else if (data.isStreaming === true && data.isComplete === true) {
                isFinalChunkOfStream = true;
            } else if (data.isStreaming === false && data.isComplete === true) {
                isCompleteNonStreamed = true;
            } else if (data.isComplete === true) {
                isCompleteNonStreamed = true;
            }
        } else if (typeof data === 'string') {
            responseText = data;
            isCompleteNonStreamed = true;
        } else {
            console.warn('Unknown data format for setResponse:', data);
            this.requestUpdate();
            return;
        }

        if (isStreamingChunk) {
            // Handle streaming chunks - update existing message or create new one
            if (this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    // Update existing streaming message
                    lastMessage.text = responseText;
                    this.requestUpdate();
                    this.scrollToBottom(false);
                    return;
                }
            }
            // Create new streaming message
            this.addChatMessage(responseText, 'assistant', true);
            
        } else if (isFinalChunkOfStream) {
            // Complete the streaming message
            if (this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    lastMessage.text = responseText;
                    lastMessage.isStreaming = false;
                    lastMessage.timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    this.responses.push(responseText);
                    this.currentResponseIndex = this.responses.length - 1;
                    this.isStreamingActive = false;
                    this.streamingResponseText = '';
                    this.requestUpdate();
                    this.scrollToBottom(false);
                    return;
                }
            }
            // Fallback: add as complete message
            this.addChatMessage(responseText, 'assistant', false);
            this.responses.push(responseText);
            this.currentResponseIndex = this.responses.length - 1;
            
        } else if (isCompleteNonStreamed) {
            // Add complete message (non-streaming providers like OpenAI)
            this.addChatMessage(responseText, 'assistant', false);
            this.responses.push(responseText);
            if (this.currentResponseIndex === this.responses.length - 2 || this.currentResponseIndex === -1 || this.responses.length === 1) {
                this.currentResponseIndex = this.responses.length - 1;
            }
        }

        this.requestUpdate();
        if (this.currentView === 'assistant') {
            this.scrollToBottom(false);
        }
    }

    addChatMessage(text, sender, isStreaming = false, screenshots = null) {
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        this.chatMessages = [
            ...this.chatMessages,
            {
                id,
                text,
                sender,
                timestamp,
                isStreaming,

                screenshots
            }
        ];
        if (isStreaming) {
            this.isStreamingActive = true;
            this.streamingResponseText = text;
        }
        this.requestUpdate();
        this.scrollToBottom(sender === 'user');
    }

    scrollToBottom(force = false) {
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('.chat-container');
            if (container) {
                const lastMessage = container.querySelector('.message-wrapper:last-child');
                if (lastMessage) {
                    const isUserScrolledUp = container.scrollTop + container.clientHeight < container.scrollHeight - 150;
                    if (force || !isUserScrolledUp) {
                        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeAllListeners('update-response');
            ipcRenderer.removeAllListeners('update-status');
            ipcRenderer.removeAllListeners('marketplace-buttons-updated');
        }
        
        if (this.currentView === 'assistant') {
            this.scrollToBottom(false);
        }
        // Remove the link click handler
        if (this._linkClickHandler) {
            this.shadowRoot.removeEventListener('click', this._linkClickHandler);
        }
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
        } else if (this.currentView === 'main') {
            this.currentView = 'assistant';
        } else {
            // Quit the entire application
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('quit-application');
        }
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

    async toggleContentProtection(enabled) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('toggle-content-protection', enabled);
            if (result.success) {
                console.log(`Content protection ${enabled ? 'enabled' : 'disabled'}`);
            } else {
                console.error('Failed to toggle content protection:', result.error);
            }
        } catch (error) {
            console.error('Error toggling content protection:', error);
        }
    }

    async toggleWorkspaceVisibility(enabled) {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('toggle-workspace-visibility', enabled);
            if (result.success) {
                console.log(`Workspace visibility ${enabled ? 'enabled' : 'disabled'}`);
            } else {
                console.error('Failed to toggle workspace visibility:', result.error);
            }
        } catch (error) {
            console.error('Error toggling workspace visibility:', error);
        }
    }

    async openAudioWindow() {
        try {
            const { ipcRenderer } = window.require('electron');
            
            // Send IPC message to main process to create audio window
            const result = await ipcRenderer.invoke('create-audio-window', {
                width: 50,
                height: 50,
                // Position in top-right corner by default
                x: undefined,
                y: undefined
            });
            
            if (result.success) {
                console.log('Audio window opened successfully');
                
                // Show brief notification
                this.statusText = 'Audio window opened';
                setTimeout(() => {
                    if (this.statusText === 'Audio window opened') {
                        this.statusText = '';
                    }
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to create audio window');
            }
            
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to open audio window:', error);
            
            // Show error message
            this.statusText = 'Failed to open audio window';
            setTimeout(() => {
                if (this.statusText === 'Failed to open audio window') {
                    this.statusText = '';
                }
            }, 3000);
            
            this.requestUpdate();
        }
    }

    async openMarketplaceWindow() {
        try {
            const { ipcRenderer } = window.require('electron');
            
            // Send IPC message to main process to create marketplace window
            const result = await ipcRenderer.invoke('create-marketplace-window', {
                selectedButtons: this.customMenuButtons || [],
                width: 800,
                height: 600
            });
            
            if (result.success) {
                console.log('Marketplace window opened successfully');
                
                // Show brief notification
                this.statusText = 'Marketplace window opened';
                setTimeout(() => {
                    if (this.statusText === 'Marketplace window opened') {
                        this.statusText = '';
                    }
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to create marketplace window');
            }
            
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to open marketplace window:', error);
            
            // Show error message
            this.statusText = 'Failed to open marketplace window';
            setTimeout(() => {
                if (this.statusText === 'Failed to open marketplace window') {
                    this.statusText = '';
                }
            }, 3000);
            
            this.requestUpdate();
        }
    }

    _handleMarketplaceButtonsUpdated(selectedButtons) {
        // Update the custom menu buttons
        this.customMenuButtons = selectedButtons;
        
        // Save the configuration
        this.saveUserPreference('customMenuButtons', selectedButtons);
        
        // Update header component
        const header = this.shadowRoot.querySelector('buddy-header');
        if (header) {
            header.customMenuButtons = selectedButtons;
            header.requestUpdate();
        }
        
        // Show brief notification
        this.statusText = 'Menu buttons updated';
        setTimeout(() => {
            if (this.statusText === 'Menu buttons updated') {
                this.statusText = '';
            }
        }, 2000);
        
        this.requestUpdate();
    }
    // --- End Updated Toggle Handlers ---

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ;
        localStorage.setItem('theme', this.currentTheme);
        this.setAttribute('theme', this.currentTheme);
        this.requestUpdate();
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

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            
            // Add user message and immediately scroll to it
            this.addChatMessage(message, 'user');
            await this.scrollToUserMessage();
            
            // Send message and continue with normal flow
            const result = await buddy.sendTextMessage(message);
            textInput.value = '';

            if (!result.success) {
                console.error('Failed to send message:', result.error);
                this.setStatus('Error sending message: ' + result.error);
                // Add error message to chat
                this.addChatMessage(' error sending your message.', 'assistant');
            } else {
                this.setStatus('sending...');
            }

            if (textInput.matches('textarea')) {
                this.handleTextInputResize({ target: textInput });
            }
        }
    }

    // Add new method for user message scrolling
    async scrollToUserMessage() {
        await new Promise(resolve => requestAnimationFrame(resolve));
        const container = this.shadowRoot.querySelector('.chat-container');
        const lastMessage = this.shadowRoot.querySelector('.message-wrapper:last-child');
        
        if (container && lastMessage) {
            const scrollTarget = lastMessage.offsetTop - container.clientHeight + lastMessage.clientHeight + 100;
            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
        // For Shift+Enter, textarea will handle newline by default
    }

    handleTextInputResize(e) {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height to recalculate scrollHeight

        const computedStyle = getComputedStyle(textarea);
        const maxHeightStyle = computedStyle.maxHeight;
        const maxHeight = maxHeightStyle.endsWith('px') ? parseFloat(maxHeightStyle) : Number.MAX_SAFE_INTEGER;

        if (textarea.scrollHeight <= maxHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto'; // This enables the internal scrollbar
        }
    }

    get isMacOS() {
        return typeof buddy !== 'undefined' && buddy.isMacOS !== undefined
            ? buddy.isMacOS
            : navigator.platform.toLowerCase().includes('mac');
    }
    get isLinux() {
        return typeof buddy !== 'undefined' && buddy.isLinux !== undefined
            ? buddy.isLinux
            : navigator.platform.toLowerCase().includes('linux');
    }

    // Add method to check if selected model supports screenshot (image capability)
    get isSelectedModelScreenshotCapable() {
        const models = getModelsByProvider(this.selectedProvider) || [];
        const selectedModelObj = models.find(m => m.id === this.selectedModel);
        return selectedModelObj && selectedModelObj.capabilities && selectedModelObj.capabilities.image;
    }

    // Add method to get selected model's capabilities
    get selectedModelCapabilities() {
        const models = getModelsByProvider(this.selectedProvider) || [];
        const selectedModelObj = models.find(m => m.id === this.selectedModel);
        return selectedModelObj && selectedModelObj.capabilities ? selectedModelObj.capabilities : {};
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

    render() {
        const views = {
            login: html`<buddy-login-view
                .user=${this.user}
                .isLoading=${false}
            ></buddy-login-view>`,
            main: html`<buddy-main-view
                .selectedProvider=${this.selectedProvider}
                .selectedModel=${this.selectedModel}
                .providers=${this.providers}
                .models=${this.mainViewModels}
                .apiKey=${this.mainViewApiKey}
                .keyLabel=${this.mainViewKeyLabel}
                .disabledModelIds=${this.disabledModelIdsForCurrentMode}
                .hasEnvironmentKey=${this.mainViewHasEnvironmentKey}
            ></buddy-main-view>`,
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
                        .isScreenActive=${this.isScreenActive}
                        .modelsByProvider=${this.getModelsByProviderForHeader()}
                        .user=${this.user}
                        .isAuthenticated=${this.isAuthenticated}
                        .isGuest=${this.isGuest}
                        .enabledModels=${this.enabledModels}
                        .customMenuButtons=${this.customMenuButtons}
                    ></buddy-header>
                    <div class="main-content">${views[this.currentView]}</div>
                </div>
            </div>
        `;
    }

    // Add this method to actually delete a message
    deleteMessage(id) {
        this.chatMessages = this.chatMessages.filter(msg => msg.id !== id);
        this.requestUpdate();
    }



    deleteSession(index) {
        this.history = this.history.filter((_, i) => i !== index);
        localStorage.setItem('chatHistory', JSON.stringify(this.history));
        this.requestUpdate();
    }

    extendHistoryLimit() {
        this.historyLimit += 5;
        localStorage.setItem('historyLimit', this.historyLimit);
        // No need to trim history, just allow more
        this.requestUpdate();
    }

    decreaseHistoryLimit() {
        if (this.historyLimit > 5) {
            this.historyLimit -= 5;
            localStorage.setItem('historyLimit', this.historyLimit);
            // Trim history if needed
            if (this.history.length > this.historyLimit) {
                this.history.length = this.historyLimit;
                localStorage.setItem('chatHistory', JSON.stringify(this.history));
            }
            this.requestUpdate();
        }
    }
}

customElements.define('buddy-app', BuddyApp);
