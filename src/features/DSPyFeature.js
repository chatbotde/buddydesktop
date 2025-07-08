const DSPyProvider = require('../dspy/DSPyProvider');

class DSPyFeature {
    constructor() {
        this.id = 'dspy';
        this.name = 'DSPy AI Provider';
        this.description = 'Advanced AI provider using DSPy for optimized language model interactions';
        this.version = '1.0.0';
        this.enabled = false;
        this.provider = null;
        this.currentPipeline = null;
        this.optimizationHistory = [];
    }

    async initialize() {
        try {
            console.log('Initializing DSPy feature...');
            
            // Register with the feature manager
            if (global.featureManager) {
                global.featureManager.registerFeature(this.id, {
                    name: this.name,
                    description: this.description,
                    version: this.version,
                    capabilities: ['ai_generation', 'pipeline_optimization', 'custom_signatures'],
                    dependencies: ['ai_providers'],
                    hooks: {
                        'ai.provider.initialize': this.onProviderInitialize.bind(this),
                        'ai.provider.generate': this.onProviderGenerate.bind(this),
                        'ai.provider.optimize': this.onProviderOptimize.bind(this)
                    }
                });
            }

            // Set up event listeners
            this.setupEventListeners();
            
            console.log('DSPy feature initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize DSPy feature:', error);
            return false;
        }
    }

    setupEventListeners() {
        // Listen for AI provider events
        if (global.eventBus) {
            global.eventBus.on('ai.provider.selected', this.onProviderSelected.bind(this));
            global.eventBus.on('ai.provider.configured', this.onProviderConfigured.bind(this));
            global.eventBus.on('chat.history.updated', this.onChatHistoryUpdated.bind(this));
        }
    }

    async onProviderInitialize(data) {
        const { provider, apiKey, profile, language, customPrompt, model } = data;
        
        if (provider === 'dspy') {
            try {
                this.provider = new DSPyProvider(apiKey, profile, language, customPrompt, model);
                const initialized = await this.provider.initialize();
                
                if (initialized) {
                    this.enabled = true;
                    console.log('DSPy provider initialized successfully');
                    
                    // Emit success event
                    if (global.eventBus) {
                        global.eventBus.emit('dspy.provider.initialized', {
                            provider: this.provider,
                            status: 'success'
                        });
                    }
                } else {
                    throw new Error('Failed to initialize DSPy provider');
                }
            } catch (error) {
                console.error('DSPy provider initialization failed:', error);
                
                // Emit error event
                if (global.eventBus) {
                    global.eventBus.emit('dspy.provider.error', {
                        error: error.message,
                        status: 'error'
                    });
                }
            }
        }
    }

    async onProviderGenerate(data) {
        if (!this.provider || !this.enabled) {
            return;
        }

        try {
            const { input, options = {} } = data;
            
            // Use current pipeline if available
            if (this.currentPipeline && options.useOptimizedPipeline) {
                // Generate with optimized pipeline
                const result = await this.provider.dspyService.generate(
                    input.text || '',
                    input.context || '',
                    this.currentPipeline
                );
                return result;
            } else {
                // Use standard generation
                return await this.provider.sendRealtimeInput(input);
            }
        } catch (error) {
            console.error('DSPy generation failed:', error);
            throw error;
        }
    }

    async onProviderOptimize(data) {
        if (!this.provider || !this.enabled) {
            return;
        }

        try {
            const { examples, pipelineType = 'basic', options = {} } = data;
            
            // Optimize pipeline
            const result = await this.provider.optimizePipeline(examples, pipelineType);
            
            // Store optimization history
            this.optimizationHistory.push({
                timestamp: Date.now(),
                pipelineId: result.pipeline_id,
                pipelineType,
                examplesCount: examples.length,
                options
            });
            
            // Set as current pipeline
            this.currentPipeline = result.pipeline_id;
            
            console.log('DSPy pipeline optimized:', result);
            
            // Emit optimization event
            if (global.eventBus) {
                global.eventBus.emit('dspy.pipeline.optimized', {
                    pipelineId: result.pipeline_id,
                    pipelineType,
                    examplesCount: examples.length,
                    result
                });
            }
            
            return result;
        } catch (error) {
            console.error('DSPy optimization failed:', error);
            throw error;
        }
    }

    async onProviderSelected(data) {
        const { provider } = data;
        
        if (provider === 'dspy') {
            console.log('DSPy provider selected');
            
            // Emit provider selection event
            if (global.eventBus) {
                global.eventBus.emit('dspy.provider.selected', {
                    provider: 'dspy',
                    capabilities: ['ai_generation', 'pipeline_optimization', 'custom_signatures']
                });
            }
        }
    }

    async onProviderConfigured(data) {
        const { provider, config } = data;
        
        if (provider === 'dspy') {
            console.log('DSPy provider configured:', config);
            
            // Emit configuration event
            if (global.eventBus) {
                global.eventBus.emit('dspy.provider.configured', {
                    provider: 'dspy',
                    config,
                    status: 'configured'
                });
            }
        }
    }

    async onChatHistoryUpdated(data) {
        const { history, options = {} } = data;
        
        // Auto-optimize pipeline if enabled and enough examples
        if (options.autoOptimize && history.length >= 6) {
            try {
                const examples = this.provider.createExamplesFromHistory(history);
                if (examples.length >= 3) {
                    console.log('Auto-optimizing DSPy pipeline with chat history...');
                    await this.optimizeWithHistory(history, options.pipelineType || 'basic');
                }
            } catch (error) {
                console.warn('Auto-optimization failed:', error);
            }
        }
    }

    // Public API methods
    async createCustomPipeline(signatureConfig, pipelineType = 'predict') {
        if (!this.provider || !this.enabled) {
            throw new Error('DSPy provider not initialized');
        }

        try {
            const result = await this.provider.createCustomPipeline(signatureConfig, pipelineType);
            
            // Emit custom pipeline event
            if (global.eventBus) {
                global.eventBus.emit('dspy.pipeline.custom_created', {
                    pipelineId: result.pipeline_id,
                    signatureConfig,
                    pipelineType,
                    result
                });
            }
            
            return result;
        } catch (error) {
            console.error('Custom pipeline creation failed:', error);
            throw error;
        }
    }

    async optimizeWithHistory(chatHistory, pipelineType = 'basic') {
        if (!this.provider || !this.enabled) {
            throw new Error('DSPy provider not initialized');
        }

        try {
            const result = await this.provider.optimizeWithHistory(chatHistory, pipelineType);
            
            // Emit optimization event
            if (global.eventBus) {
                global.eventBus.emit('dspy.pipeline.optimized_with_history', {
                    pipelineId: result.pipeline_id,
                    pipelineType,
                    historyLength: chatHistory.length,
                    result
                });
            }
            
            return result;
        } catch (error) {
            console.error('History-based optimization failed:', error);
            throw error;
        }
    }

    async getAvailableModels() {
        if (!this.provider) {
            return [];
        }

        try {
            return await this.provider.getAvailableModels();
        } catch (error) {
            console.error('Failed to get DSPy models:', error);
            return [];
        }
    }

    async getServiceStatus() {
        if (!this.provider) {
            return { isRunning: false, isHealthy: false };
        }

        try {
            return await this.provider.getServiceStatus();
        } catch (error) {
            console.error('Failed to get DSPy service status:', error);
            return { isRunning: false, isHealthy: false, error: error.message };
        }
    }

    getOptimizationHistory() {
        return this.optimizationHistory;
    }

    getCurrentPipeline() {
        return this.currentPipeline;
    }

    async cleanup() {
        try {
            if (this.provider) {
                await this.provider.close();
                this.provider = null;
            }
            
            this.enabled = false;
            this.currentPipeline = null;
            
            console.log('DSPy feature cleaned up');
        } catch (error) {
            console.error('DSPy feature cleanup failed:', error);
        }
    }

    // Hook execution methods
    async executeHook(hookName, data) {
        switch (hookName) {
            case 'ai.provider.initialize':
                return await this.onProviderInitialize(data);
            case 'ai.provider.generate':
                return await this.onProviderGenerate(data);
            case 'ai.provider.optimize':
                return await this.onProviderOptimize(data);
            default:
                console.warn(`Unknown hook: ${hookName}`);
                return null;
        }
    }

    getStats() {
        return {
            id: this.id,
            name: this.name,
            version: this.version,
            enabled: this.enabled,
            currentPipeline: this.currentPipeline,
            optimizationCount: this.optimizationHistory.length,
            lastOptimization: this.optimizationHistory.length > 0 
                ? this.optimizationHistory[this.optimizationHistory.length - 1].timestamp 
                : null
        };
    }
}

module.exports = DSPyFeature; 