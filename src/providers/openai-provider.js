const BaseAIProvider = require('./base-provider');

class OpenAIProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, model) {
        super(apiKey, profile, language);
        if (!model) {
            throw new Error('Model must be specified for OpenAIProvider');
        }
        this.model = model;
        this.conversationHistory = [];
        this.currentAbortController = null;
    }

    async initialize() {
        try {
            // Initialize conversation with system prompt
            const { getSystemPrompt } = require('../prompts');
            const systemPrompt = getSystemPrompt(this.profile);
            
            this.conversationHistory = [
                { role: 'system', content: systemPrompt }
            ];
            
            global.sendToRenderer('update-status', 'Connected');
            this.session = { 
                connected: true,
                initialized: true,
                history: this.conversationHistory
            };
            return true;
        } catch (error) {
            console.error('Failed to initialize OpenAI session:', error);
            global.sendToRenderer('update-status', 'Error: ' + error.message);
            return false;
        }
    }

    async sendRealtimeInput(input) {
        if (input.text || (input.screenshots && input.screenshots.length > 0)) {
            try {
                const userContent = [];
                
                // Add text if provided
                if (input.text) {
                    userContent.push({ type: 'text', text: input.text });
                }
                
                // Add images if provided
                if (input.screenshots && Array.isArray(input.screenshots)) {
                    input.screenshots.forEach(screenshot => {
                        userContent.push({
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${screenshot}`
                            }
                        });
                    });
                }
                
                // Add user message to conversation history
                this.conversationHistory.push({ role: 'user', content: userContent });
                
                // Create abort controller for this request
                this.currentAbortController = new AbortController();
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: this.conversationHistory,
                        stream: true
                    }),
                    signal: this.currentAbortController.signal
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullResponse = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content || '';
                                if (content) {
                                    fullResponse += content;
                                    global.sendToRenderer('update-response', {
                                        text: fullResponse,
                                        isStreaming: true,
                                        isComplete: false
                                    });
                                }
                            } catch (e) {
                                // Skip invalid JSON chunks
                            }
                        }
                    }
                }

                // Add assistant response to conversation history
                if (fullResponse) {
                    this.conversationHistory.push({ role: 'assistant', content: fullResponse });
                }

                global.sendToRenderer('update-response', {
                    text: fullResponse,
                    isStreaming: true,
                    isComplete: true
                });
                
                // Clear the abort controller after successful completion
                this.currentAbortController = null;
            } catch (error) {
                // Clear the abort controller
                this.currentAbortController = null;
                
                if (error.name === 'AbortError') {
                    console.log('✅ OpenAI streaming was aborted by user');
                    global.sendToRenderer('update-status', 'Streaming stopped');
                } else {
                    console.error('OpenAI API error:', error);
                    global.sendToRenderer('update-status', 'Error: ' + error.message);
                }
            }
        }
    }

    async stopStreaming() {
        console.log('🛑 OpenAIProvider: Stopping streaming...');
        
        if (this.currentAbortController) {
            try {
                this.currentAbortController.abort();
                console.log('✅ OpenAI streaming aborted successfully');
                global.sendToRenderer('streaming-stopped', { success: true });
            } catch (error) {
                console.error('❌ Error aborting OpenAI streaming:', error);
            }
        } else {
            console.log('⚠️ No active OpenAI streaming to stop');
        }
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('../prompts');
        return getSystemPrompt(this.profile);
    }

    async close() {
        // Abort any ongoing requests
        if (this.currentAbortController) {
            this.currentAbortController.abort();
            this.currentAbortController = null;
        }
        
        // Clear conversation history and reset session state
        // No need to close HTTP connections as they are stateless
        this.conversationHistory = [];
        this.session = null;
    }
}

module.exports = OpenAIProvider; 