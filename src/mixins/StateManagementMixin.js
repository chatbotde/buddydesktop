/**
 * State Management Mixin
 * Handles application state, properties, and basic getters
 */
import { getModelsByProvider } from '../services/models-service.js';

export const StateManagementMixin = (superClass) => class extends superClass {
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
        windowOpacity: { type: Number },
        isOpacityControlActive: { type: Boolean },
        currentWindowTheme: { type: String },
        availableThemes: { type: Object },
    };

    initializeState() {
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
        this.isSearchActive = false;
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
        this.customMenuButtons = this._loadCustomMenuButtonsFromLocalStorage();
        this.windowOpacity = 1.0;
        this.isOpacityControlActive = false;
        this.currentWindowTheme = 'transparent';
        this.availableThemes = {};
    }

    getDefaultModelForProvider(provider) {
        switch (provider) {
            case 'google':
                return 'gemini-2.5-flash'; // Use available model
            case 'openai':
                return 'gpt-4o';
            case 'anthropic':
                return 'claude-3-5-sonnet-20241022';
            case 'deepseek':
                return 'deepseek-chat';
            case 'openrouter':
                return 'anthropic/claude-3.5-sonnet';
            default:
                return '';
        }
    }

    getModelDisplayName(modelId) {
        // Get all models from all providers
        const allModels = [];
        this.providers.forEach(provider => {
            const models = getModelsByProvider(provider.value) || [];
            allModels.push(...models);
        });
        
        const model = allModels.find(m => m.id === modelId);
        return model ? model.name : modelId;
    }

    getModelData(modelId) {
        // Get all models from all providers to find the model data
        const allModels = [];
        this.providers.forEach(provider => {
            const models = getModelsByProvider(provider.value) || [];
            models.forEach(model => {
                allModels.push({...model, provider: provider.value});
            });
        });
        
        return allModels.find(m => m.id === modelId) || null;
    }

    getDefaultEnabledModels() {
        // Default preset: Enable popular and reliable models, disable experimental/premium ones
        return [
            'claude-4-sonnet',
            'claude-3.5-sonnet',
            'gemini-2.5-flash',
            'o3'
        ];
    }

    getModelsByProviderForHeader() {
        const modelsByProvider = {};
        this.providers.forEach(provider => {
            modelsByProvider[provider.value] = getModelsByProvider(provider.value) || [];
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
            const models = this.getAvailableModelsForCurrentMode();
            return models.filter(m => !m.live).map(m => m.id);
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
        if (!selectedModelObj) return false;
        
        // Check both the live property and capabilities array for realtime support
        const hasLiveProp = selectedModelObj.live === true;
        const hasRealtimeCap = selectedModelObj.capabilities && selectedModelObj.capabilities.includes('realtime');
        
        return hasLiveProp || hasRealtimeCap;
    }

    // Update all components that depend on model selection
    updateModelDependentComponents() {
        // Update assistant view to refresh capability-aware UI
        const assistantView = this.shadowRoot?.querySelector('buddy-assistant-view');
        if (assistantView) {
            assistantView.selectedModel = this.selectedModel;
            assistantView.requestUpdate();
            console.log('🔄 Updated assistant view with selected model:', this.selectedModel);
        }
        
        // Update header to show new model
        const header = this.shadowRoot?.querySelector('buddy-header');
        if (header) {
            header.selectedModel = this.selectedModel;
            header.selectedProvider = this.selectedProvider;
            header.requestUpdate();
            console.log('🔄 Updated header with selected model:', this.selectedModel);
        }
        
        // Log capability information for debugging
        console.log('🔧 Model capabilities updated:', {
            selectedModel: this.selectedModel,
            isRealTime: this.isSelectedModelRealTime,
            provider: this.selectedProvider
        });
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
    _loadCustomMenuButtonsFromLocalStorage() {
        try {
            const saved = localStorage.getItem('buddy-custom-menu-buttons');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('StateManagement: Loaded custom menu buttons from localStorage:', parsed);
                return parsed;
            }
        } catch (error) {
            console.error('StateManagement: Error loading custom menu buttons from localStorage:', error);
        }
        
        // Return default buttons if nothing saved or error
        return ['chat', 'history', 'models', 'customize', 'help'];
    }

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

    setStatus(t) {
        this.statusText = t;
    }
};
