import { EnhancedTextStream } from './enhanced-text-stream.js';
import { SmartContentChunker } from './smart-content-chunker.js';
import { ProgressiveMarkdownProcessor } from './progressive-markdown-processor.js';

/**
 * Advanced Streaming Markdown Processor
 * Combines smart chunking, progressive rendering, and enhanced streaming
 */
export class StreamingMarkdownProcessor {
    constructor(options = {}) {
        this.options = {
            enableProgressiveRendering: true,
            enableSmartChunking: true,
            enableLivePreview: false,
            chunkingStrategy: 'adaptive',
            maxChunkSize: 150,
            minChunkSize: 30,
            streamingSpeed: 25,
            showTypingIndicators: true,
            enableSyntaxHighlighting: true,
            enableMathRendering: true,
            ...options
        };

        this.chunker = new SmartContentChunker();
        this.markdownProcessor = new ProgressiveMarkdownProcessor();
        this.currentChunks = [];
        this.completedChunks = [];
        this.currentChunkIndex = 0;
        this.isStreaming = false;
    }

    /**
     * Process content with advanced streaming
     * @param {string} content - Raw markdown content
     * @param {HTMLElement} targetElement - Element to render into
     * @param {object} options - Processing options
     * @returns {Promise} Processing promise
     */
    async streamContent(content, targetElement, options = {}) {
        const processingOptions = { ...this.options, ...options };
        
        console.log('🚀 Starting advanced markdown streaming:', {
            contentLength: content.length,
            enableProgressiveRendering: processingOptions.enableProgressiveRendering,
            enableSmartChunking: processingOptions.enableSmartChunking
        });

        // Analyze content
        const analysis = this.chunker.analyzeContent(content);
        console.log('📊 Content analysis:', analysis);

        // Smart chunking
        if (processingOptions.enableSmartChunking) {
            this.currentChunks = this.chunker.chunkContent(content, {
                maxChunkSize: processingOptions.maxChunkSize,
                minChunkSize: processingOptions.minChunkSize,
                chunkingStrategy: analysis.suggestedStrategy,
                preserveElements: true
            });
        } else {
            // Simple chunking
            this.currentChunks = [{
                content: content,
                type: 'text',
                isPreserved: false
            }];
        }

        console.log('✂️ Content chunked into', this.currentChunks.length, 'chunks');

        // Create streaming container
        const streamingContainer = this.createStreamingContainer(targetElement, processingOptions);

        // Start streaming chunks
        this.isStreaming = true;
        await this.streamChunks(streamingContainer, processingOptions);
        this.isStreaming = false;

        return {
            chunks: this.currentChunks,
            analysis,
            totalTime: Date.now() - this.startTime
        };
    }

    /**
     * Create the streaming container
     */
    createStreamingContainer(targetElement, options) {
        const container = document.createElement('div');
        container.className = 'streaming-markdown-container';
        
        // Add CSS if not already present
        if (!document.querySelector('#streaming-markdown-styles')) {
            this.injectStyles();
        }

        // Add live preview if enabled
        if (options.enableLivePreview) {
            const preview = document.createElement('div');
            preview.className = 'markdown-live-preview';
            container.appendChild(preview);
        }

        // Add main content area
        const contentArea = document.createElement('div');
        contentArea.className = 'streaming-content-area';
        container.appendChild(contentArea);

        // Add typing indicator
        if (options.showTypingIndicators) {
            const indicator = document.createElement('div');
            indicator.className = 'streaming-typing-indicator';
            indicator.innerHTML = `
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-text">Processing markdown...</span>
            `;
            container.appendChild(indicator);
        }

        targetElement.appendChild(container);
        return container;
    }

    /**
     * Stream chunks sequentially
     */
    async streamChunks(container, options) {
        const contentArea = container.querySelector('.streaming-content-area');
        const indicator = container.querySelector('.streaming-typing-indicator');
        this.startTime = Date.now();

        for (let i = 0; i < this.currentChunks.length; i++) {
            const chunk = this.currentChunks[i];
            
            console.log(`📝 Streaming chunk ${i + 1}/${this.currentChunks.length}:`, {
                type: chunk.type,
                length: chunk.content.length,
                isPreserved: chunk.isPreserved
            });

            // Update typing indicator
            if (indicator) {
                const typingText = indicator.querySelector('.typing-text');
                if (typingText) {
                    typingText.textContent = `Processing ${chunk.type} (${i + 1}/${this.currentChunks.length})...`;
                }
            }

            // Create chunk element
            const chunkElement = await this.createChunkElement(chunk, options, i);
            contentArea.appendChild(chunkElement);

            // Stream the chunk
            await this.streamChunk(chunkElement, chunk, options);

            // Add to completed chunks
            this.completedChunks.push(chunk);

            // Small delay between chunks for better UX
            if (i < this.currentChunks.length - 1) {
                await this.sleep(50);
            }
        }

        // Hide typing indicator
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }

        // Dispatch completion event
        container.dispatchEvent(new CustomEvent('streaming-complete', {
            detail: {
                chunks: this.currentChunks,
                completedChunks: this.completedChunks,
                totalTime: Date.now() - this.startTime
            },
            bubbles: true
        }));
    }

    /**
     * Create element for a chunk
     */
    async createChunkElement(chunk, options, index) {
        const element = document.createElement('div');
        element.className = `chunk-container chunk-${chunk.type} chunk-${index}`;
        element.setAttribute('data-chunk-index', index);
        element.setAttribute('data-chunk-type', chunk.type);

        if (chunk.isPreserved) {
            // Special handling for preserved elements
            if (chunk.type === 'code-block') {
                element.innerHTML = `<code-block 
                    code="${this.escapeAttribute(chunk.content)}" 
                    language="${this.detectLanguage(chunk.content)}"
                    show-header="true" 
                    show-copy-button="true"
                    writing="true"
                    auto-start="false"
                ></code-block>`;
            } else if (chunk.type === 'math-block') {
                element.innerHTML = chunk.content; // Math will be processed by math renderer
            } else {
                element.innerHTML = chunk.content;
            }
        } else {
            // Create enhanced text stream element
            const streamElement = document.createElement('enhanced-text-stream');
            streamElement.text = chunk.content;
            streamElement.mode = options.enableProgressiveRendering ? 'progressive-markdown' : 'typewriter';
            streamElement.speed = options.streamingSpeed;
            streamElement.enableMarkdown = options.enableProgressiveRendering;
            streamElement.showMarkdownPreview = options.enableLivePreview;
            streamElement.autoStart = false;
            
            element.appendChild(streamElement);
        }

        return element;
    }

    /**
     * Stream a single chunk
     */
    async streamChunk(chunkElement, chunk, options) {
        return new Promise((resolve) => {
            if (chunk.isPreserved) {
                // For preserved elements, just show them with animation
                chunkElement.style.opacity = '0';
                chunkElement.style.transform = 'translateY(10px)';
                
                requestAnimationFrame(() => {
                    chunkElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    chunkElement.style.opacity = '1';
                    chunkElement.style.transform = 'translateY(0)';
                    
                    // Start code block animation if applicable
                    const codeBlock = chunkElement.querySelector('code-block');
                    if (codeBlock) {
                        codeBlock.autoStart = true;
                        codeBlock.addEventListener('animation-complete', () => resolve(), { once: true });
                    } else {
                        setTimeout(resolve, 300);
                    }
                });
            } else {
                // For text chunks, use enhanced streaming
                const streamElement = chunkElement.querySelector('enhanced-text-stream');
                if (streamElement) {
                    streamElement.addEventListener('animation-complete', () => resolve(), { once: true });
                    streamElement.startAnimation();
                } else {
                    resolve();
                }
            }
        });
    }

    /**
     * Inject required CSS styles
     */
    injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.id = 'streaming-markdown-styles';
        styleElement.textContent = `
            .streaming-markdown-container {
                position: relative;
                min-height: 20px;
            }

            .markdown-live-preview {
                position: absolute;
                top: -30px;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.75em;
                opacity: 0.7;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .streaming-content-area {
                position: relative;
                min-height: 20px;
            }

            .chunk-container {
                margin-bottom: 0.5rem;
                animation: chunkFadeIn 0.3s ease-out;
            }

            .chunk-container:last-child {
                margin-bottom: 0;
            }

            @keyframes chunkFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .streaming-typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
                opacity: 1;
                transition: opacity 0.3s ease;
                font-size: 0.85em;
                color: var(--text-secondary, #666);
            }

            .typing-dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--primary-color, #3b82f6);
                animation: typingDotPulse 1.4s infinite ease-in-out;
            }

            .typing-dot:nth-child(1) {
                animation-delay: -0.32s;
            }

            .typing-dot:nth-child(2) {
                animation-delay: -0.16s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0s;
            }

            @keyframes typingDotPulse {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1.2);
                    opacity: 1;
                }
            }

            .typing-text {
                font-style: italic;
            }

            /* Enhanced chunk animations */
            .chunk-code-block {
                border-radius: 8px;
                overflow: hidden;
                margin: 1rem 0;
            }

            .chunk-text {
                line-height: 1.6;
            }

            .chunk-header {
                margin: 1.5rem 0 0.5rem 0;
                font-weight: bold;
            }

            .chunk-math-block {
                margin: 1rem 0;
                text-align: center;
            }

            /* Progressive markdown enhancements */
            ${ProgressiveMarkdownProcessor.getStreamingCSS()}
        `;
        
        document.head.appendChild(styleElement);
    }

    /**
     * Utility methods
     */
    escapeAttribute(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    detectLanguage(codeContent) {
        // Simple language detection based on content
        if (codeContent.includes('function') || codeContent.includes('const ') || codeContent.includes('let ')) {
            return 'javascript';
        }
        if (codeContent.includes('def ') || codeContent.includes('import ')) {
            return 'python';
        }
        if (codeContent.includes('<') && codeContent.includes('>')) {
            return 'html';
        }
        return 'text';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Stop streaming
     */
    stop() {
        this.isStreaming = false;
    }

    /**
     * Reset processor
     */
    reset() {
        this.currentChunks = [];
        this.completedChunks = [];
        this.currentChunkIndex = 0;
        this.isStreaming = false;
        this.markdownProcessor.reset();
    }

    /**
     * Get streaming statistics
     */
    getStats() {
        return {
            totalChunks: this.currentChunks.length,
            completedChunks: this.completedChunks.length,
            isStreaming: this.isStreaming,
            currentChunkIndex: this.currentChunkIndex,
            progress: this.currentChunks.length > 0 ? 
                (this.completedChunks.length / this.currentChunks.length) * 100 : 0
        };
    }
}
