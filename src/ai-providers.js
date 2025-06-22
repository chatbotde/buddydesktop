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
            await this.session.close();
            this.session = null;
        }
    }
}

class GoogleAIProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        super(apiKey, profile, language, customPrompt);
        this.model = model || 'gemini-2.0-flash-live-001';
    }

    async initialize() {
        const { getSystemPrompt } = require('./prompts');
        const client = new GoogleGenAI({
            vertexai: false,
            apiKey: this.apiKey,
        });

        const systemPrompt = getSystemPrompt(this.profile, this.customPrompt);

        try {
            const session = await client.live.connect({
                model: this.model,
                callbacks: {
                    onopen: function () {
                        global.sendToRenderer('update-status', 'Connected to Gemini - Starting recording...');
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
                            // Send current buffer as an ongoing streaming update
                            global.sendToRenderer('update-response', {
                                text: global.messageBuffer,
                                isStreaming: true, // Indicates this is a partial, ongoing stream
                                isComplete: false
                            });
                        }

                        if (message.serverContent?.generationComplete) {
                            // Send final buffer for this generation.
                            // This is the final part of the current stream.
                            global.sendToRenderer('update-response', {
                                text: global.messageBuffer,
                                isStreaming: true, // Still part of the stream concept
                                isComplete: true   // But this is the final piece
                            });
                            global.messageBuffer = ''; // Clear buffer for the next AI utterance
                        }

                        if (message.serverContent?.turnComplete) {
                            global.sendToRenderer('update-status', 'Listening...');
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
            return true;
        } catch (error) {
            console.error('Failed to initialize Gemini session:', error);
            return false;
        }
    }

    async sendRealtimeInput(input) {
        if (!this.session) throw new Error('Session not initialized');
        return await this.session.sendRealtimeInput(input);
    }
}

class OpenAIProvider extends BaseAIProvider {
    async initialize() {
        global.sendToRenderer('update-status', 'Connected to OpenAI - Starting recording...');
        // Note: OpenAI doesn't have real-time API like Gemini, so we'll use chat completions
        // You might want to implement a different approach for real-time features
        this.session = { connected: true };
        return true;
    }

    async sendRealtimeInput(input) {
        // For text messages, we can use OpenAI's chat completions
        if (input.text) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'gpt-4',
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: input.text }
                        ],
                        stream: false
                    })
                });

                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    global.sendToRenderer('update-response', data.choices[0].message.content);
                }
            } catch (error) {
                console.error('OpenAI API error:', error);
                global.sendToRenderer('update-status', 'Error: ' + error.message);
            }
        }
        // Audio and image inputs would need different handling for OpenAI
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('./prompts');
        return getSystemPrompt(this.profile, this.customPrompt);
    }
}

class AnthropicProvider extends BaseAIProvider {
    async initialize() {
        global.sendToRenderer('update-status', 'Connected to Anthropic - Starting recording...');
        this.session = { connected: true };
        return true;
    }

    async sendRealtimeInput(input) {
        if (input.text) {
            try {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'x-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                        'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 1000,
                        system: this.getSystemPrompt(),
                        messages: [
                            { role: 'user', content: input.text }
                        ]
                    })
                });

                const data = await response.json();
                if (data.content && data.content[0]) {
                    global.sendToRenderer('update-response', data.content[0].text);
                }
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
    async initialize() {
        global.sendToRenderer('update-status', 'Connected to DeepSeek - Starting recording...');
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
                        model: 'deepseek-chat',
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: input.text }
                        ],
                        stream: false
                    })
                });

                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    global.sendToRenderer('update-response', data.choices[0].message.content);
                }
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
    async initialize() {
        global.sendToRenderer('update-status', 'Connected to OpenRouter - Starting recording...');
        this.session = { connected: true };
        return true;
    }

    async sendRealtimeInput(input) {
        if (input.text) {
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://buddy.app',
                        'X-Title': 'Buddy'
                    },
                    body: JSON.stringify({
                        model: 'anthropic/claude-3.5-sonnet',
                        messages: [
                            { role: 'system', content: this.getSystemPrompt() },
                            { role: 'user', content: input.text }
                        ]
                    })
                });

                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    global.sendToRenderer('update-response', data.choices[0].message.content);
                }
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
            return new OpenAIProvider(apiKey, profile, language, customPrompt);
        case 'anthropic':
            return new AnthropicProvider(apiKey, profile, language, customPrompt);
        case 'deepseek':
            return new DeepSeekProvider(apiKey, profile, language, customPrompt);
        case 'openrouter':
            return new OpenRouterProvider(apiKey, profile, language, customPrompt);
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
