const { GoogleGenAI } = require('@google/genai');

class BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt) {
        this.apiKey = apiKey;
        this.profile = profile;
        this.language = language;
        this.customPrompt = customPrompt;
        this.session = null;
    }

    async initialize() {
        throw new Error('Initialize method must be implemented');
    }

    async sendRealtimeInput(input) {
        throw new Error('SendRealtimeInput method must be implemented');
    }

    async close() {
        if (this.session) {
            // Only call close if the session has a close method
            if (typeof this.session.close === 'function') {
                await this.session.close();
            }
            this.session = null;
        }
    }
}

class GoogleAIProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        super(apiKey, profile, language, customPrompt);
        if (!model) {
            throw new Error('Model must be specified for GoogleAIProvider');
        }
        this.model = model;
        this.isRealTimeModel = this.model.includes('live') || this.model.includes('2.0-flash-live');
    }

    async initialize() {
        const { getSystemPrompt } = require('./prompts');
        const client = new GoogleGenAI({
            vertexai: false,
            apiKey: this.apiKey,
        });

        const systemPrompt = getSystemPrompt(this.profile, this.customPrompt);

        try {
            if (this.isRealTimeModel) {
                // Use real-time API for live models
                const session = await client.live.connect({
                    model: this.model,
                    callbacks: {
                        onopen: function () {
                            global.sendToRenderer('update-status', 'Connected');
                        },
                        onmessage: function (message) {
                            let newTextReceived = false;
                            if (message.serverContent?.modelTurn?.parts) {
                                for (const part of message.serverContent.modelTurn.parts) {
                                    if (part.text) {
                                        global.messageBuffer += part.text;
                                        newTextReceived = true;
                                    }
                                }
                            }

                            if (newTextReceived && !message.serverContent?.generationComplete) {
                                global.sendToRenderer('update-response', {
                                    text: global.messageBuffer,
                                    isStreaming: true,
                                    isComplete: false
                                });
                            }

                            if (message.serverContent?.generationComplete) {
                                global.sendToRenderer('update-response', {
                                    text: global.messageBuffer,
                                    isStreaming: true,
                                    isComplete: true
                                });
                                global.messageBuffer = '';
                            }

                            if (message.serverContent?.turnComplete) {
                                global.sendToRenderer('update-status', 'Listening');
                            }
                        },
                        onerror: function (e) {
                            console.debug('Error:', e.message);
                            global.sendToRenderer('update-status', 'Error: ' + e.message);
                        },
                        onclose: function (e) {
                            console.debug('Session closed:', e.reason);
                            global.sendToRenderer('update-status', 'Session closed');
                        },
                    },
                    config: {
                        responseModalities: ['TEXT'],
                        speechConfig: { languageCode: this.language },
                        systemInstruction: {
                            parts: [{ text: systemPrompt }],
                        },
                    },
                });
                this.session = session;
            } else {
                // Use chat API for non-live models - create chat session
                this.session = client.chats.create({
                    model: this.model,
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemPrompt }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "I understand. I'll follow these instructions for our conversation." }],
                        },
                    ],
                });
                global.sendToRenderer('update-status', 'Connected');
            }

            return true;
        } catch (error) {
            console.error('Failed to initialize session:', error);
            return false;
        }
    }

    async sendRealtimeInput(input) {
        if (!this.session) throw new Error('Session not initialized');
        
        if (this.isRealTimeModel) {
            // Real-time model: use existing real-time input
            return await this.session.sendRealtimeInput(input);
        } else {
            // Chat model: handle text and image messages
            if (input.text || (input.screenshots && input.screenshots.length > 0)) {
                try {
                    const messageParts = [];
                    
                    // Add text if provided
                    if (input.text) {
                        messageParts.push({ text: input.text });
                    }
                    
                    // Add images if provided
                    if (input.screenshots && Array.isArray(input.screenshots)) {
                        input.screenshots.forEach(screenshot => {
                            messageParts.push({
                                inlineData: {
                                    mimeType: 'image/jpeg',
                                    data: screenshot
                                }
                            });
                        });
                    }
                    
                    const stream = await this.session.sendMessageStream({
                        message: messageParts
                    });
                    
                    let fullResponse = '';
                    for await (const chunk of stream) {
                        const chunkText = chunk.text;
                        fullResponse += chunkText;
                        global.sendToRenderer('update-response', {
                            text: fullResponse,
                            isStreaming: true,
                            isComplete: false
                        });
                    }
                    
                    global.sendToRenderer('update-response', {
                        text: fullResponse,
                        isStreaming: true,
                        isComplete: true
                    });
                } catch (error) {
                    console.error('chat error:', error);
                    global.sendToRenderer('update-status', 'Error: ' + error.message);
                }
            }
        }
    }

    async close() {
        if (this.session) {
            // Only real-time sessions have a close method
            if (this.isRealTimeModel && typeof this.session.close === 'function') {
                await this.session.close();
            }
            // Chat sessions don't need explicit closing
            this.session = null;
        }
    }
}

class OpenAIProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        super(apiKey, profile, language, customPrompt);
        if (!model) {
            throw new Error('Model must be specified for OpenAIProvider');
        }
        this.model = model;
    }

    async initialize() {
        global.sendToRenderer('update-status', 'Connected');
        this.session = { connected: true };
        return true;
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
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: userContent }
                        ],
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

                global.sendToRenderer('update-response', {
                    text: fullResponse,
                    isStreaming: true,
                    isComplete: true
                });
            } catch (error) {
                console.error('OpenAI API error:', error);
                global.sendToRenderer('update-status', 'Error: ' + error.message);
            }
        }
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('./prompts');
        return getSystemPrompt(this.profile, this.customPrompt);
    }
}

class AnthropicProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        super(apiKey, profile, language, customPrompt);
        if (!model) {
            throw new Error('Model must be specified for AnthropicProvider');
        }
        this.model = model;
    }

    async initialize() {
        global.sendToRenderer('update-status', 'Connected');
        this.session = { connected: true };
        return true;
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
                        system: this.getSystemPrompt(),
                        messages: [
                            { role: 'user', content: userContent }
                        ],
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
        const { getSystemPrompt } = require('./prompts');
        return getSystemPrompt(this.profile, this.customPrompt);
    }
}

class DeepSeekProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        super(apiKey, profile, language, customPrompt);
        if (!model) {
            throw new Error('Model must be specified for DeepSeekProvider');
        }
        this.model = model;
    }

    async initialize() {
        global.sendToRenderer('update-status', 'Connected');
        this.session = { connected: true };
        return true;
    }

    async sendRealtimeInput(input) {
        if (input.text) {
            try {
                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: input.text }
                        ],
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

                global.sendToRenderer('update-response', {
                    text: fullResponse,
                    isStreaming: true,
                    isComplete: true
                });
            } catch (error) {
                console.error('DeepSeek API error:', error);
                global.sendToRenderer('update-status', 'Error: ' + error.message);
            }
        }
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('./prompts');
        return getSystemPrompt(this.profile, this.customPrompt);
    }
}

class OpenRouterProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        super(apiKey, profile, language, customPrompt);
        if (!model) {
            throw new Error('Model must be specified for OpenRouterProvider');
        }
        this.model = model;
    }

    async initialize() {
        global.sendToRenderer('update-status', 'Connected');
        this.session = { connected: true };
        return true;
    }

    async sendRealtimeInput(input) {
        if (input.text || (input.screenshots && input.screenshots.length > 0)) {
            try {
                const userContent = [];
                
                // Add text if provided
                if (input.text) {
                    userContent.push({ type: 'text', text: input.text });
                }
                
                // Add images if provided (only if model supports it)
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
                
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://buddy.app',
                        'X-Title': 'Buddy'
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: userContent.length === 1 && userContent[0].type === 'text' ? input.text : userContent }
                        ],
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

                global.sendToRenderer('update-response', {
                    text: fullResponse,
                    isStreaming: true,
                    isComplete: true
                });
            } catch (error) {
                console.error('OpenRouter API error:', error);
                global.sendToRenderer('update-status', 'Error: ' + error.message);
            }
        }
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('./prompts');
        return getSystemPrompt(this.profile, this.customPrompt);
    }
}

function createAIProvider(provider, apiKey, profile, language, customPrompt, model) {
    switch (provider) {
        case 'google':
            return new GoogleAIProvider(apiKey, profile, language, customPrompt, model);
        case 'openai':
            return new OpenAIProvider(apiKey, profile, language, customPrompt, model);
        case 'anthropic':
            return new AnthropicProvider(apiKey, profile, language, customPrompt, model);
        case 'deepseek':
            return new DeepSeekProvider(apiKey, profile, language, customPrompt, model);
        case 'openrouter':
            return new OpenRouterProvider(apiKey, profile, language, customPrompt, model);
        case 'dspy':
            const DSPyProvider = require('./dspy/DSPyProvider');
            return new DSPyProvider(apiKey, profile, language, customPrompt, model);
        default:
            throw new Error(`Unknown AI provider: ${provider}`);
    }
}

module.exports = {
    createAIProvider,
    GoogleAIProvider,
    OpenAIProvider,
    AnthropicProvider,
    DeepSeekProvider,
    OpenRouterProvider
};
