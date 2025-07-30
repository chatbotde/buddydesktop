const BaseAIProvider = require('./base-provider');

class AnthropicProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, model) {
        super(apiKey, profile, language);
        if (!model) {
            throw new Error('Model must be specified for AnthropicProvider');
        }
        this.model = model;
        this.conversationHistory = [];
    }

    async initialize() {
        try {
            // Initialize conversation with system prompt
            const { getSystemPrompt } = require('../prompts');
            const systemPrompt = getSystemPrompt(this.profile);
            
            this.systemPrompt = systemPrompt;
            this.conversationHistory = [];
            
            global.sendToRenderer('update-status', 'Connected');
            this.session = { 
                connected: true,
                initialized: true,
                systemPrompt: this.systemPrompt,
                history: this.conversationHistory
            };
            return true;
        } catch (error) {
            console.error('Failed to initialize Anthropic session:', error);
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
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: screenshot
                            }
                        });
                    });
                }
                
                // Add user message to conversation history
                this.conversationHistory.push({ role: 'user', content: userContent });
                
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                        'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                        model: this.model,
                        max_tokens: 4000,
                        system: this.systemPrompt,
                        messages: this.conversationHistory,
                        stream: true
                    })
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
                                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                                    fullResponse += parsed.delta.text;
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
                    this.conversationHistory.push({ role: 'assistant', content: [{ type: 'text', text: fullResponse }] });
                }

                global.sendToRenderer('update-response', {
                    text: fullResponse,
                    isStreaming: true,
                    isComplete: true
                });
            } catch (error) {
                console.error('Anthropic API error:', error);
                global.sendToRenderer('update-status', 'Error: ' + error.message);
            }
        }
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('../prompts');
        return getSystemPrompt(this.profile);
    }

    async close() {
        // Clear conversation history and reset session state
        // No need to close HTTP connections as they are stateless
        this.conversationHistory = [];
        this.systemPrompt = null;
        this.session = null;
    }
}

module.exports = AnthropicProvider; 