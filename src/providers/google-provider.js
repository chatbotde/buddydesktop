const { GoogleGenAI } = require('@google/genai');
const BaseAIProvider = require('./base-provider');

class GoogleAIProvider extends BaseAIProvider {
    constructor(apiKey, profile, language, model) {
        super(apiKey, profile, language);
        if (!model) {
            throw new Error('Model must be specified for GoogleAIProvider');
        }
        this.model = model;
        this.isRealTimeModel = this.model.includes('live') || this.model.includes('2.0-flash-live');
    }

    async initialize() {
        const { getSystemPrompt } = require('../prompts');
        const client = new GoogleGenAI({
            vertexai: false,
            apiKey: this.apiKey,
        });

        const systemPrompt = getSystemPrompt(this.profile);

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

    async stopStreaming() {
        console.log('🛑 GoogleAIProvider: Stopping streaming...');
        
        if (this.session) {
            if (this.isRealTimeModel) {
                // For real-time models, we can interrupt the current generation
                try {
                    // If there's accumulated text, send it as final response
                    if (global.messageBuffer && global.messageBuffer.trim()) {
                        global.sendToRenderer('update-response', {
                            text: global.messageBuffer,
                            isStreaming: true,
                            isComplete: true
                        });
                    }
                    
                    // Clear the message buffer to stop accumulating text
                    global.messageBuffer = '';
                    
                    // Send status update and completion signals
                    global.sendToRenderer('update-status', 'Streaming stopped');
                    global.sendToRenderer('streaming-stopped', { success: true });
                    
                    console.log('✅ Google real-time streaming stopped');
                } catch (error) {
                    console.error('❌ Error stopping Google real-time streaming:', error);
                }
            } else {
                // For chat models, there's no ongoing stream to stop
                console.log('⚠️ Google chat model does not have ongoing streams to stop');
                global.sendToRenderer('streaming-stopped', { success: true });
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

module.exports = GoogleAIProvider; 