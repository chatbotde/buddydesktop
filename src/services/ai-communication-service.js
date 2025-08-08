// ai-communication-service.js
const { ipcRenderer } = require('electron');

class AICommunicationService {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for status updates - only process if assistant view is active
        ipcRenderer.on('update-status', (event, status) => {
            const buddy = this.getBuddyElement();
            if (buddy && buddy.currentView === 'assistant') {
                console.log('Status update:', status);
                buddy.setStatus(status);
            }
        });

        // Listen for responses - only process if assistant view is active
        ipcRenderer.on('update-response', (event, response) => {
            const buddy = this.getBuddyElement();
            if (buddy && buddy.currentView === 'assistant') {
                console.log('AI response:', response);
                buddy.setResponse(response);
            }
        });

        // Listen for live streaming events
        ipcRenderer.on('live-streaming-started', (event, data) => {
            console.log('Live streaming started:', data);
            const buddy = this.getBuddyElement();
            if (buddy && buddy.onLiveStreamingStarted) {
                buddy.onLiveStreamingStarted(data);
            }
        });

        ipcRenderer.on('live-streaming-stopped', (event, data) => {
            console.log('Live streaming stopped:', data);
            const buddy = this.getBuddyElement();
            if (buddy && buddy.onLiveStreamingStopped) {
                buddy.onLiveStreamingStopped(data);
            }
        });
    }

    getBuddyElement() {
        return document.getElementById('buddy');
    }

    async initializeAI(provider = 'google', profile = 'default', language = 'en-US', model = '') {
        let apiKey = localStorage.getItem(`apiKey_${provider}`)?.trim();
        let baseUrl = null;
        let actualModelId = model;
        let actualProvider = provider;
        
        console.log('🚀 Initializing AI with:', { provider, model, hasApiKey: !!apiKey });
        console.log('🔍 Detailed initialization params:', {
            provider: provider,
            model: model,
            profile: profile,
            language: language,
            apiKeyLength: apiKey ? apiKey.length : 0,
            apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
        });
        
        // Check if this is a custom model
        const customModels = JSON.parse(localStorage.getItem('buddy_custom_models') || '[]');
        const customModel = customModels.find(m => m.id === model);
        
        if (customModel) {
            // Use custom model's API key and settings
            apiKey = customModel.apiKey;
            baseUrl = customModel.baseUrl;
            actualModelId = customModel.modelId; // Use the actual model ID for API calls
            actualProvider = customModel.provider; // Use the custom model's provider
            
            console.log('✅ Using custom model:', {
                name: customModel.name,
                provider: actualProvider,
                modelId: actualModelId,
                hasApiKey: !!apiKey,
                hasBaseUrl: !!baseUrl
            });
        } else {
            console.log('📋 Using built-in model:', { provider, model });
        }
        
        // Validate that we have an API key for custom models
        if (customModel && (!apiKey || apiKey.trim() === '')) {
            console.error('❌ Custom model requires API key but none provided');
            const buddy = this.getBuddyElement();
            if (buddy) {
                buddy.setStatus('Error: Custom model requires API key');
            }
            return false;
        }
        
        // Always attempt to initialize, even without API key for built-in models
        // The main process will handle environment variables and fallbacks
        const success = await ipcRenderer.invoke(
            'initialize-ai',
            actualProvider,
            apiKey || '', // Pass custom API key or empty string
            profile,
            language,
            actualModelId, // Pass the actual model ID for API calls
            baseUrl // Pass custom base URL if available
        );
        
        if (success) {
            const buddy = this.getBuddyElement();
            if (buddy) {
                buddy.setStatus('Live');
            }
            console.log('✅ AI session initialized successfully');
            if (!apiKey && !customModel) {
                console.log('ℹ️ Session started without user-provided API key (using environment or demo mode)');
            }
        } else {
            const buddy = this.getBuddyElement();
            if (buddy) {
                buddy.setStatus('Error: Failed to initialize AI session');
            }
            console.error('❌ Failed to initialize AI session');
            console.error('❌ Check console for detailed error messages');
        }
        
        return success;
    }

    async sendTextMessage(text, screenshots = null) {
        if ((!text || text.trim().length === 0) && (!screenshots || screenshots.length === 0)) {
            console.warn('Cannot send empty text message without screenshots');
            return { success: false, error: 'Empty message' };
        }

        try {
            const messageData = { text: text || '' };
            
            // Add screenshots if provided
            if (screenshots && Array.isArray(screenshots) && screenshots.length > 0) {
                messageData.screenshots = screenshots;
            }
            
            const result = await ipcRenderer.invoke('send-text-message', messageData);
            if (result.success) {
                console.log('Text message sent successfully');
            } else {
                console.error('Failed to send text message:', result.error);
            }
            return result;
        } catch (error) {
            console.error('Error sending text message:', error);
            return { success: false, error: error.message };
        }
    }

    async stopStreaming() {
        try {
            console.log('🛑 Requesting to stop streaming...');
            const result = await ipcRenderer.invoke('stop-streaming');
            if (result.success) {
                console.log('✅ Streaming stopped successfully');
            } else {
                console.error('❌ Failed to stop streaming:', result.error);
            }
            return result;
        } catch (error) {
            console.error('Error stopping streaming:', error);
            return { success: false, error: error.message };
        }
    }

    async startLiveStreaming() {
        try {
            console.log('🎥 Starting live streaming with real-time AI analysis...');
            const result = await ipcRenderer.invoke('start-live-streaming');
            if (result.success) {
                console.log('✅ Live streaming started successfully');
                // Start UI status indication
                const buddy = this.getBuddyElement();
                if (buddy && buddy.setStatus) {
                    buddy.setStatus('Live Streaming');
                }
            } else {
                console.error('❌ Failed to start live streaming:', result.error);
            }
            return result;
        } catch (error) {
            console.error('Error starting live streaming:', error);
            return { success: false, error: error.message };
        }
    }

    async stopLiveStreaming() {
        try {
            console.log('⏹️ Stopping live streaming...');
            const result = await ipcRenderer.invoke('stop-live-streaming');
            if (result.success) {
                console.log('✅ Live streaming stopped successfully');
                // Reset UI status
                const buddy = this.getBuddyElement();
                if (buddy && buddy.setStatus) {
                    buddy.setStatus('Live');
                }
            } else {
                console.error('❌ Failed to stop live streaming:', result.error);
            }
            return result;
        } catch (error) {
            console.error('Error stopping live streaming:', error);
            return { success: false, error: error.message };
        }
    }

    async captureAndSendScreenshot() {
        console.log('Capturing screenshot and analyzing with AI...');
        
        // Check if we have a buddy element and basic configuration
        const buddy = this.getBuddyElement();
        if (!buddy) {
            console.warn('Buddy element not found');
            return { success: false, error: 'Application not ready' };
        }

        // For real-time models, we need an active session
        // For non-realtime models, we just need a configured model
        const isRealTimeModel = buddy.isSelectedModelRealTime;
        
        if (isRealTimeModel && !buddy.sessionActive) {
            console.log('Real-time model requires active session - attempting to start one...');
            if (buddy.setStatus) {
                buddy.setStatus('Starting AI session...');
            }
            
            if (typeof buddy.autoStartSession === 'function') {
                const sessionStarted = await buddy.autoStartSession();
                if (!sessionStarted) {
                    console.warn('Failed to start AI session automatically');
                    if (buddy.setStatus) {
                        buddy.setStatus('Please configure and start a chat session first');
                    }
                    return { success: false, error: 'Could not start AI session' };
                }
                console.log('AI session started successfully');
            } else {
                console.warn('Cannot auto-start session');
                if (buddy.setStatus) {
                    buddy.setStatus('Please start a chat session first');
                }
                return { success: false, error: 'No active AI session' };
            }
        } else if (!isRealTimeModel) {
            // For non-realtime models, just ensure we have a model selected
            if (!buddy.selectedModel) {
                console.warn('No model selected for screenshot analysis');
                if (buddy.setStatus) {
                    buddy.setStatus('Please select a model first');
                }
                return { success: false, error: 'No model selected' };
            }
            
            // If no session is active, auto-initialize for non-realtime models
            if (!buddy.sessionActive) {
                console.log('Auto-initializing session for non-realtime model...');
                if (buddy.setStatus) {
                    buddy.setStatus('Initializing AI...');
                }
                
                if (typeof buddy.autoStartSession === 'function') {
                    const sessionStarted = await buddy.autoStartSession();
                    if (!sessionStarted) {
                        console.warn('Failed to initialize AI for screenshot analysis');
                        if (buddy.setStatus) {
                            buddy.setStatus('Failed to initialize AI - check your configuration');
                        }
                        return { success: false, error: 'Could not initialize AI' };
                    }
                    console.log('AI initialized successfully for screenshot analysis');
                }
            }
        }
        
        try {
            // Capture the screenshot (assuming videoService is available)
            const videoService = window.buddy?.videoService;
            if (!videoService) {
                throw new Error('Video service not available');
            }
            
            const screenshotData = await videoService.captureManualScreenshot();
            
            if (!screenshotData) {
                console.error('Failed to capture screenshot');
                return { success: false, error: 'Failed to capture screenshot' };
            }
            
            // Send the screenshot to AI for direct problem solving
            const result = await this.sendTextMessage('You are a problem-solving assistant. Look at this screenshot and solve the problem directly. NEVER ask questions or request clarification. If you see code, provide the complete solution. If you see a math problem, solve it step by step. If you see an error, explain how to fix it. Give me the answer immediately without asking what I need.', [screenshotData]);
            
            if (result.success) {
                console.log('Screenshot analyzed and sent to AI');
                if (buddy.setStatus) {
                    buddy.setStatus('Screen analyzed and sent to AI');
                }
            } else {
                console.error('Failed to analyze and send screenshot to AI:', result.error);
                if (buddy.setStatus) {
                    buddy.setStatus('Failed to analyze screen');
                }
            }
            
            return result;
            
        } catch (error) {
            console.error('Error in captureAndSendScreenshot:', error);
            if (buddy.setStatus) {
                buddy.setStatus('Error capturing screenshot');
            }
            return { success: false, error: error.message };
        }
    }

    async checkEnvironmentKey(provider) {
        try {
            const result = await ipcRenderer.invoke('check-environment-key', provider);
            return result;
        } catch (error) {
            console.error('Error checking environment key:', error);
            return false;
        }
    }

    async testEnvironmentKeys() {
        console.log('🧪 Testing environment key detection...');
        const providers = ['google', 'openai', 'anthropic', 'deepseek', 'openrouter'];
        
        for (const provider of providers) {
            try {
                const hasKey = await this.checkEnvironmentKey(provider);
                console.log(`🔑 ${provider}: ${hasKey ? '✅ Found' : '❌ Not found'}`);
            } catch (error) {
                console.error(`❌ Error checking ${provider}:`, error);
            }
        }
    }

    async testModelInitialization(provider, model) {
        console.log(`🧪 Testing model initialization: ${provider}/${model}`);
        try {
            const success = await this.initializeAI(provider, 'default', 'en-US', model);
            console.log(`🧪 Result: ${success ? '✅ Success' : '❌ Failed'}`);
            return success;
        } catch (error) {
            console.error(`❌ Error testing model:`, error);
            return false;
        }
    }
}

module.exports = AICommunicationService;
