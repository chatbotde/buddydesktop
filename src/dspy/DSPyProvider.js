const DSPyService = require('./DSPyService');

class DSPyProvider {
    constructor(apiKey, profile, language, customPrompt, model) {
        this.apiKey = apiKey;
        this.profile = profile;
        this.language = language;
        this.customPrompt = customPrompt;
        this.model = model;
        this.session = null;
        this.dspyService = null;
        this.isConfigured = false;
        this.currentPipeline = null;
    }

    async initialize() {
        try {
            // Initialize DSPy service
            this.dspyService = new DSPyService({
                port: 8765,
                autoRestart: true,
                maxRestarts: 3
            });

            // Set up event listeners
            this.dspyService.on('started', () => {
                console.log('DSPy service started');
                global.sendToRenderer('update-status', 'DSPy service started');
            });

            this.dspyService.on('error', (error) => {
                console.error('DSPy service error:', error);
                global.sendToRenderer('update-status', 'DSPy service error: ' + error.message);
            });

            this.dspyService.on('health', ({ healthy, response, error }) => {
                if (!healthy) {
                    console.warn('DSPy service unhealthy:', error);
                }
            });

            // Start the service
            const started = await this.dspyService.start();
            if (!started) {
                throw new Error('Failed to start DSPy service');
            }

            // Configure DSPy with the selected provider and model
            await this.configureDSPy();

            global.sendToRenderer('update-status', 'DSPy Connected');
            this.session = { connected: true };
            return true;
        } catch (error) {
            console.error('Failed to initialize DSPy:', error);
            global.sendToRenderer('update-status', 'Error: ' + error.message);
            return false;
        }
    }

    async configureDSPy() {
        if (!this.dspyService || !this.dspyService.isRunning) {
            throw new Error('DSPy service not running');
        }

        // Map provider names to DSPy-compatible names
        const providerMap = {
            'openai': 'openai',
            'anthropic': 'anthropic',
            'google': 'google',
            'deepseek': 'deepseek',
            'openrouter': 'openai' // OpenRouter uses OpenAI-compatible API
        };

        const dspyProvider = providerMap[this.model.split('/')[0]] || 'openai';
        const dspyModel = this.model.includes('/') ? this.model.split('/')[1] : this.model;

        try {
            const result = await this.dspyService.configure(dspyProvider, dspyModel, this.apiKey);
            this.isConfigured = true;
            console.log('DSPy configured successfully:', result);
        } catch (error) {
            console.error('Failed to configure DSPy:', error);
            throw error;
        }
    }

    async sendRealtimeInput(input) {
        if (!this.dspyService || !this.isConfigured) {
            throw new Error('DSPy not configured');
        }

        try {
            let query = '';
            let context = '';
            let pipelineType = 'basic';

            // Handle text input
            if (input.text) {
                query = input.text;
            }

            // Handle screenshots (convert to context)
            if (input.screenshots && input.screenshots.length > 0) {
                context = `Images provided: ${input.screenshots.length} screenshot(s)`;
                // For now, we'll use the image count as context
                // In a full implementation, you might want to process the images
            }

            // Determine pipeline type based on profile
            if (this.profile === 'interview') {
                pipelineType = 'cot'; // Chain of thought for interviews
            } else if (this.profile === 'coding') {
                pipelineType = 'basic'; // Direct generation for coding
            } else if (this.profile === 'analysis') {
                pipelineType = 'qa'; // Question-answering for analysis
            } else if (this.profile === 'math_teacher') {
                pipelineType = 'math_teacher'; // Math teacher pipeline
            } else if (this.profile === 'physics_teacher') {
                pipelineType = 'physics_teacher'; // Physics teacher pipeline
            } else if (this.profile === 'chemistry_teacher') {
                pipelineType = 'chemistry_teacher'; // Chemistry teacher pipeline
            } else if (this.profile === 'advanced_math_teacher') {
                pipelineType = 'advanced_math_teacher'; // Advanced math teacher with modules
            } else if (this.profile === 'advanced_physics_teacher') {
                pipelineType = 'advanced_physics_teacher'; // Advanced physics teacher with modules
            } else if (this.profile === 'advanced_chemistry_teacher') {
                pipelineType = 'advanced_chemistry_teacher'; // Advanced chemistry teacher with modules
            }

            // Generate response using DSPy
            let result;
            if (pipelineType.startsWith('advanced_')) {
                // Use advanced teacher modules
                const teacherType = pipelineType.replace('advanced_', '').replace('_teacher', '');
                result = await this.dspyService.request('POST', '/advanced-teacher', {
                    query: query,
                    context: context,
                    teacher_type: teacherType
                });
            } else {
                // Use basic pipelines
                result = await this.dspyService.generate(query, context, pipelineType);
            }
            
            if (result.error) {
                throw new Error(result.error);
            }

            // Stream the response
            const response = result.response;
            let streamedText = '';
            
            // Simulate streaming by sending chunks
            const words = response.split(' ');
            for (let i = 0; i < words.length; i++) {
                streamedText += words[i] + ' ';
                
                // Send update every few words
                if (i % 3 === 0 || i === words.length - 1) {
                    global.sendToRenderer('update-response', {
                        text: streamedText.trim(),
                        isStreaming: true,
                        isComplete: i === words.length - 1
                    });
                    
                    // Small delay to simulate streaming
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

        } catch (error) {
            console.error('DSPy generation error:', error);
            global.sendToRenderer('update-status', 'Error: ' + error.message);
        }
    }

    async optimizePipeline(examples, pipelineType = 'basic') {
        if (!this.dspyService || !this.isConfigured) {
            throw new Error('DSPy not configured');
        }

        try {
            const result = await this.dspyService.optimize(examples, pipelineType);
            this.currentPipeline = result.pipeline_id;
            console.log('Pipeline optimized:', result);
            return result;
        } catch (error) {
            console.error('Pipeline optimization error:', error);
            throw error;
        }
    }

    async createCustomPipeline(signatureConfig, pipelineType = 'predict') {
        if (!this.dspyService || !this.isConfigured) {
            throw new Error('DSPy not configured');
        }

        try {
            const result = await this.dspyService.request('POST', '/pipeline', {
                pipeline_id: `custom_${Date.now()}`,
                signature: signatureConfig,
                type: pipelineType
            });
            
            this.currentPipeline = result.pipeline_id;
            console.log('Custom pipeline created:', result);
            return result;
        } catch (error) {
            console.error('Custom pipeline creation error:', error);
            throw error;
        }
    }

    async getAvailableModels() {
        if (!this.dspyService) {
            return [];
        }

        try {
            const result = await this.dspyService.getModels();
            return result.available_models || [];
        } catch (error) {
            console.error('Failed to get models:', error);
            return [];
        }
    }

    async getServiceStatus() {
        if (!this.dspyService) {
            return { isRunning: false, isHealthy: false };
        }

        return this.dspyService.getStatus();
    }

    async close() {
        if (this.dspyService) {
            await this.dspyService.stop();
            this.dspyService = null;
        }
        this.session = null;
        this.isConfigured = false;
    }

    getSystemPrompt() {
        const { getSystemPrompt } = require('../prompts');
        return getSystemPrompt(this.profile, this.customPrompt);
    }

    // Helper method to create example datasets for optimization
    createExamplesFromHistory(chatHistory) {
        const examples = [];
        
        for (let i = 0; i < chatHistory.length - 1; i += 2) {
            const userMessage = chatHistory[i];
            const assistantMessage = chatHistory[i + 1];
            
            if (userMessage.sender === 'user' && assistantMessage.sender === 'assistant') {
                examples.push({
                    input: userMessage.text,
                    output: assistantMessage.text
                });
            }
        }
        
        return examples;
    }

    // Method to optimize pipeline with chat history
    async optimizeWithHistory(chatHistory, pipelineType = 'basic') {
        const examples = this.createExamplesFromHistory(chatHistory);
        if (examples.length === 0) {
            throw new Error('No valid examples found in chat history');
        }
        
        return await this.optimizePipeline(examples, pipelineType);
    }
}

module.exports = DSPyProvider; 