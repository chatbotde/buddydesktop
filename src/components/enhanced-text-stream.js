import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { ProgressiveMarkdownProcessor } from './progressive-markdown-processor.js';
import { ChunkedProgressiveRenderer } from './chunked-progressive-renderer.js';

/**
 * Enhanced Text Stream with Progressive Markdown Processing and Chunked Rendering
 * Extends the original text stream to handle markdown progressively with smart chunking
 */
class EnhancedTextStream extends LitElement {
    static properties = {
        text: { type: String },
        mode: { type: String }, // 'typewriter' or 'fade' or 'progressive-markdown' or 'chunked-progressive'
        speed: { type: Number },
        enableMarkdown: { type: Boolean },
        enableChunkedRendering: { type: Boolean }, // Enable post-stream chunked rendering
        fadeDuration: { type: Number },
        segmentDelay: { type: Number },
        chunkSize: { type: Number },
        postRenderChunkSize: { type: Number }, // Size for post-streaming chunks
        isComplete: { type: Boolean },
        isPaused: { type: Boolean },
        autoStart: { type: Boolean },
        showMarkdownPreview: { type: Boolean }, // Show markdown as it's being typed
        showChunkProgress: { type: Boolean } // Show chunked rendering progress
    };

    static styles = css`
        :host {
            display: block;
            font-family: inherit;
            line-height: 1.6;
        }

        .enhanced-stream-container {
            position: relative;
            overflow-wrap: break-word;
        }

        .typewriter-cursor {
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background: var(--cursor-color, #3b82f6);
            animation: blink 1s infinite;
            margin-left: 1px;
        }

        .markdown-preview {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.05);
            border: 1px dashed rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            padding: 8px;
            font-size: 0.85em;
            opacity: 0.6;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .markdown-preview.hidden {
            opacity: 0;
        }

        /* Progressive markdown animations */
        .md-element-forming {
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            background-size: 200% 100%;
            animation: mdFormingShimmer 1.5s infinite;
        }

        @keyframes mdFormingShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .md-element-complete {
            animation: mdElementComplete 0.4s ease-out;
        }

        @keyframes mdElementComplete {
            0% { 
                background-color: rgba(59, 130, 246, 0.2);
                transform: scale(1.02);
            }
            100% { 
                background-color: transparent;
                transform: scale(1);
            }
        }

        /* Enhanced markdown styles */
        ${ProgressiveMarkdownProcessor.getStreamingCSS()}

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .fade-segment {
            display: inline-block;
            opacity: 0;
            animation: fadeIn ease-out forwards;
        }

        .fade-segment-space {
            white-space: pre;
        }

        /* Chunked rendering progress */
        .chunk-progress {
            position: absolute;
            bottom: -30px;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1px;
            overflow: hidden;
        }

        .chunk-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color, #3b82f6), var(--secondary-color, #1e40af));
            width: 0%;
            transition: width 0.2s ease;
        }

        .chunk-progress-text {
            position: absolute;
            bottom: -50px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.75em;
            color: var(--text-secondary, #666);
            white-space: nowrap;
        }

        /* Enhanced chunk elements */
        .chunk-element {
            opacity: 0;
            transform: translateY(3px);
            transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .chunk-element.chunk-rendered {
            opacity: 1;
            transform: translateY(0);
        }

        .chunk-element.lazy-chunk {
            min-height: 20px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
        }

        /* Performance indicators */
        .performance-indicator {
            position: absolute;
            top: -20px;
            right: 0;
            font-size: 0.7em;
            color: var(--text-tertiary, #999);
            opacity: 0.7;
        }

        .performance-indicator.good { color: #22c55e; }
        .performance-indicator.medium { color: #eab308; }
        .performance-indicator.poor { color: #ef4444; }
    `;

    constructor() {
        super();
        this.text = '';
        this.mode = 'progressive-markdown';
        this.speed = 20;
        this.enableMarkdown = true;
        this.enableChunkedRendering = false;
        this.showMarkdownPreview = false;
        this.showChunkProgress = false;
        this.fadeDuration = null;
        this.segmentDelay = null;
        this.chunkSize = null;
        this.postRenderChunkSize = 100;
        this.isComplete = false;
        this.isPaused = false;
        this.autoStart = true;

        // Internal state
        this.displayedText = '';
        this.processedText = '';
        this.segments = [];
        this.currentIndex = 0;
        this.animationId = null;
        this.completed = false;

        // Markdown processing
        this.markdownProcessor = new ProgressiveMarkdownProcessor();
        this.markdownState = {
            completeElements: [],
            streamingElements: [],
            lastProcessedIndex: 0
        };

        // Chunked rendering
        this.chunkedProgressiveRenderer = new ChunkedProgressiveRenderer();
        this.chunkingState = {
            isChunking: false,
            currentChunk: 0,
            totalChunks: 0,
            chunkProgress: 0
        };
        this.renderingStats = null;
    }

    updated(changedProperties) {
        if (changedProperties.has('text') && this.text && this.autoStart) {
            this.startAnimation();
        }
    }

    /**
     * Start the enhanced streaming animation
     */
    startAnimation() {
        this.reset();
        
        if (!this.text) return;

        console.log('🎬 Starting enhanced text stream animation:', {
            mode: this.mode,
            enableMarkdown: this.enableMarkdown,
            textLength: this.text.length,
            textPreview: this.text.substring(0, 100) + '...'
        });

        if (this.mode === 'progressive-markdown' && this.enableMarkdown) {
            this.processProgressiveMarkdown();
        } else if (this.mode === 'chunked-progressive') {
            this.processChunkedProgressive();
        } else if (this.mode === 'typewriter') {
            this.processTypewriter(this.text);
        } else if (this.mode === 'fade') {
            this.processFade(this.text);
        }
    }

    processChunkedProgressive() {
        if (this.chunkedProgressiveRenderer) {
            // Start chunked progressive rendering
            this.chunkedProgressiveRenderer.renderProgressively(
                this.text,
                this.shadowRoot.querySelector('.content'),
                this.postRenderChunkSize,
                (progress) => {
                    if (this.showChunkProgress) {
                        this.updateChunkProgress(progress);
                    }
                }
            ).then(() => {
                this.dispatchEvent(new CustomEvent('rendering-complete', {
                    bubbles: true,
                    detail: { mode: 'chunked-progressive' }
                }));
            });
        }
    }

    updateChunkProgress(progress) {
        const progressBar = this.shadowRoot.querySelector('.chunk-progress-bar');
        if (progressBar) {
            progressBar.style.setProperty('--progress', `${progress.percentage}%`);
            const counter = this.shadowRoot.querySelector('.chunk-counter');
            if (counter) {
                counter.textContent = `${progress.current}/${progress.total}`;
            }
        }
    }

    startChunkedRendering() {
        if (this.enableChunkedRendering && this.chunkedProgressiveRenderer) {
            this.mode = 'chunked-progressive';
            this.requestUpdate();
        }
    }

    /**
     * Process text with progressive markdown rendering
     */
    processProgressiveMarkdown() {
        let lastFrameTime = 0;
        
        const streamContent = (timestamp) => {
            if (this.isPaused) {
                return;
            }

            const delay = this.getProcessingDelay();
            if (delay > 0 && timestamp - lastFrameTime < delay) {
                this.animationId = requestAnimationFrame(streamContent);
                return;
            }

            lastFrameTime = timestamp;

            if (this.currentIndex >= this.text.length) {
                this.completeMarkdownProcessing();
                return;
            }

            // Get chunk of text to process
            const chunkSize = this.getChunkSize();
            const endIndex = Math.min(this.currentIndex + chunkSize, this.text.length);
            const currentText = this.text.slice(0, endIndex);
            
            // Process markdown incrementally
            const markdownResult = this.markdownProcessor.processIncremental(
                this.text.slice(this.currentIndex, endIndex),
                currentText
            );

            // Update displayed text with processed markdown
            this.displayedText = markdownResult.processedText;
            
            // Update markdown state
            this.markdownState.streamingElements = markdownResult.streamingElements;
            
            // Handle complete elements
            if (markdownResult.hasCompleteElements) {
                this.handleCompleteMarkdownElements();
            }

            this.currentIndex = endIndex;
            this.requestUpdate();

            if (endIndex < this.text.length) {
                this.animationId = requestAnimationFrame(streamContent);
            } else {
                this.completeMarkdownProcessing();
            }
        };

        this.animationId = requestAnimationFrame(streamContent);
    }

    /**
     * Handle completed markdown elements
     */
    handleCompleteMarkdownElements() {
        // Trigger completion animations for newly completed elements
        setTimeout(() => {
            const completeElements = this.shadowRoot.querySelectorAll('.md-element-complete');
            completeElements.forEach(el => {
                el.classList.remove('md-element-complete');
                // Re-add class to trigger animation
                requestAnimationFrame(() => {
                    el.classList.add('md-element-complete');
                });
            });
        }, 10);
    }

    /**
     * Complete markdown processing and optionally start chunked rendering
     */
    completeMarkdownProcessing() {
        // Final processing pass
        this.displayedText = this.markdownProcessor.processInlineElements(this.text);
        
        // If chunked rendering is enabled, switch to chunked mode
        if (this.enableChunkedRendering) {
            setTimeout(() => {
                this.startChunkedRendering();
            }, 100); // Small delay to ensure markdown processing is complete
        } else {
            this.markComplete();
        }
        
        this.requestUpdate();
    }

    /**
     * Original typewriter processing (fallback)
     */
    processTypewriter(text) {
        let lastFrameTime = 0;
        
        const streamContent = (timestamp) => {
            if (this.isPaused) {
                return;
            }

            const delay = this.getProcessingDelay();
            if (delay > 0 && timestamp - lastFrameTime < delay) {
                this.animationId = requestAnimationFrame(streamContent);
                return;
            }

            lastFrameTime = timestamp;

            if (this.currentIndex >= text.length) {
                this.markComplete();
                return;
            }

            const chunkSize = this.getChunkSize();
            const endIndex = Math.min(this.currentIndex + chunkSize, text.length);
            this.displayedText = text.slice(0, endIndex);
            this.currentIndex = endIndex;

            this.requestUpdate();

            if (endIndex < text.length) {
                this.animationId = requestAnimationFrame(streamContent);
            } else {
                this.markComplete();
            }
        };

        this.animationId = requestAnimationFrame(streamContent);
    }

    /**
     * Fade mode processing
     */
    processFade(text) {
        this.displayedText = text;
        this.updateSegments(text);
        this.markComplete();
        this.requestUpdate();
    }

    // Utility methods (same as original)
    getChunkSize() {
        if (typeof this.chunkSize === 'number') {
            return Math.max(1, this.chunkSize);
        }
        
        const normalizedSpeed = Math.min(100, Math.max(1, this.speed));
        if (this.mode === 'typewriter' || this.mode === 'progressive-markdown') {
            if (normalizedSpeed < 25) return 1;
            return Math.max(1, Math.round((normalizedSpeed - 25) / 10));
        }
        return 1;
    }

    getProcessingDelay() {
        if (typeof this.segmentDelay === 'number') {
            return Math.max(0, this.segmentDelay);
        }
        
        const normalizedSpeed = Math.min(100, Math.max(1, this.speed));
        return Math.max(1, Math.round(100 / Math.sqrt(normalizedSpeed)));
    }

    updateSegments(text) {
        if (this.mode === 'fade') {
            try {
                if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter(navigator.language, {
                        granularity: 'word'
                    });
                    const segmentIterator = segmenter.segment(text);
                    this.segments = Array.from(segmentIterator).map((segment, index) => ({
                        text: segment.segment,
                        index
                    }));
                } else {
                    throw new Error('Intl.Segmenter not available');
                }
            } catch (error) {
                this.segments = text.split(/(\s+)/).filter(Boolean).map((word, index) => ({
                    text: word,
                    index
                }));
            }
        }
    }

    markComplete() {
        if (!this.completed) {
            this.completed = true;
            this.isComplete = true;
            this.dispatchEvent(new CustomEvent('animation-complete', {
                detail: { text: this.text },
                bubbles: true,
                composed: true
            }));
        }
    }

    reset() {
        this.currentIndex = 0;
        this.displayedText = '';
        this.processedText = '';
        this.segments = [];
        this.isComplete = false;
        this.completed = false;
        this.isPaused = false;
        this.markdownProcessor.reset();
        this.markdownState = {
            completeElements: [],
            streamingElements: [],
            lastProcessedIndex: 0
        };
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.requestUpdate();
    }

    pause() {
        this.isPaused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (this.isPaused && !this.isComplete) {
            this.isPaused = false;
            if (this.mode === 'progressive-markdown' && this.enableMarkdown) {
                this.processProgressiveMarkdown();
            } else if (this.mode === 'typewriter') {
                this.processTypewriter(this.text);
            }
        }
    }

    render() {
        if (this.mode === 'fade') {
            return this.renderFade();
        }
        return this.renderTypewriter();
    }

    renderTypewriter() {
        const hasStreamingElements = this.markdownState.streamingElements.length > 0;
        const showChunkProgress = this.showChunkProgress && this.mode === 'chunked-progressive';
        
        return html`
            <div class="enhanced-stream-container">
                ${showChunkProgress ? html`
                    <div class="chunk-progress">
                        <div class="chunk-progress-bar">
                            <div class="chunk-progress-fill"></div>
                        </div>
                        <div class="chunk-counter">0/0</div>
                    </div>
                ` : ''}
                ${this.showMarkdownPreview && hasStreamingElements ? html`
                    <div class="markdown-preview">
                        Preview: ${this.markdownState.streamingElements.map(el => el.type).join(', ')} forming...
                    </div>
                ` : ''}
                <div class="content">
                    <span .innerHTML=${this.displayedText}></span>
                    ${this.isComplete ? '' : html`<span class="typewriter-cursor"></span>`}
                    ${hasStreamingElements ? html`<span class="streaming-md-indicator"></span>` : ''}
                </div>
            </div>
        `;
    }

    renderFade() {
        if (this.segments.length === 0) {
            return html`<div class="enhanced-stream-container"><div class="content"></div></div>`;
        }

        const fadeDuration = this.fadeDuration || 800;
        const segmentDelay = this.segmentDelay || 50;
        const showChunkProgress = this.showChunkProgress && this.mode === 'chunked-progressive';

        return html`
            <div class="enhanced-stream-container">
                ${showChunkProgress ? html`
                    <div class="chunk-progress">
                        <div class="chunk-progress-bar">
                            <div class="chunk-progress-fill"></div>
                        </div>
                        <div class="chunk-counter">0/0</div>
                    </div>
                ` : ''}
                <div class="content">
                    ${this.segments.map((segment, idx) => {
                        const isWhitespace = /^\s+$/.test(segment.text);
                        const classes = isWhitespace ? 'fade-segment fade-segment-space' : 'fade-segment';
                        
                        return html`
                            <span 
                                class="${classes}"
                                style="
                                    animation-duration: ${fadeDuration}ms;
                                    animation-delay: ${idx * segmentDelay}ms;
                                    animation-name: fadeIn;
                                    animation-fill-mode: forwards;
                                    animation-timing-function: ease-out;
                                "
                                .innerHTML=${segment.text}
                            ></span>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}

customElements.define('enhanced-text-stream', EnhancedTextStream);
export { EnhancedTextStream };
