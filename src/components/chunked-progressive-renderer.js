/**
 * Chunked Progressive Renderer
 * Renders content in small intelligent chunks for optimal performance
 */

export class ChunkedProgressiveRenderer {
    constructor(options = {}) {
        this.options = {
            chunkSize: 50,              // Characters per chunk
            chunkDelay: 16,             // Delay between chunks (60fps = 16ms)
            maxChunksPerFrame: 3,       // Max chunks to render per frame
            enableVirtualization: true,  // Virtual rendering for large content
            enableLazyRendering: true,   // Lazy render off-screen content
            adaptiveChunking: true,      // Adjust chunk size based on performance
            performanceThreshold: 16,    // Target frame time in ms
            ...options
        };

        this.renderQueue = [];
        this.isRendering = false;
        this.performanceMonitor = new PerformanceMonitor();
        this.viewportObserver = new ViewportObserver();
        this.chunkCache = new Map();
        this.currentChunkIndex = 0;
        this.totalChunks = 0;
    }

    /**
     * Start chunked progressive rendering after text streaming
     * @param {string} content - Content to render
     * @param {HTMLElement} container - Container element
     * @param {object} options - Rendering options
     * @returns {Promise} Rendering promise
     */
    async renderProgressively(content, container, options = {}) {
        const renderOptions = { ...this.options, ...options };
        
        console.log('🔄 Starting chunked progressive rendering:', {
            contentLength: content.length,
            chunkSize: renderOptions.chunkSize,
            enableVirtualization: renderOptions.enableVirtualization
        });

        // Prepare content chunks
        const chunks = this.prepareContentChunks(content, renderOptions);
        this.totalChunks = chunks.length;
        this.currentChunkIndex = 0;

        // Create render container
        const renderContainer = this.createRenderContainer(container, renderOptions);

        // Setup performance monitoring
        this.performanceMonitor.start();

        // Start progressive rendering
        this.isRendering = true;
        await this.processChunks(chunks, renderContainer, renderOptions);
        this.isRendering = false;

        // Final optimization pass
        await this.optimizeRenderedContent(renderContainer, renderOptions);

        this.performanceMonitor.stop();
        
        return {
            totalChunks: this.totalChunks,
            renderTime: this.performanceMonitor.getTotalTime(),
            averageChunkTime: this.performanceMonitor.getAverageChunkTime(),
            performanceScore: this.performanceMonitor.getScore()
        };
    }

    /**
     * Prepare content into intelligent chunks
     */
    prepareContentChunks(content, options) {
        const chunks = [];
        let currentPos = 0;
        
        while (currentPos < content.length) {
            const chunkSize = this.calculateOptimalChunkSize(content, currentPos, options);
            const chunk = this.extractChunk(content, currentPos, chunkSize, options);
            
            chunks.push({
                id: chunks.length,
                content: chunk.content,
                start: currentPos,
                end: chunk.end,
                type: chunk.type,
                priority: chunk.priority,
                isVisible: chunk.isVisible,
                complexity: chunk.complexity
            });
            
            currentPos = chunk.end;
        }

        // Sort by priority (visible chunks first)
        return chunks.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Calculate optimal chunk size based on content and performance
     */
    calculateOptimalChunkSize(content, position, options) {
        let baseSize = options.chunkSize;
        
        if (options.adaptiveChunking) {
            // Adjust based on performance
            const avgFrameTime = this.performanceMonitor.getAverageFrameTime();
            if (avgFrameTime > options.performanceThreshold) {
                baseSize = Math.max(10, baseSize * 0.8); // Reduce chunk size
            } else if (avgFrameTime < options.performanceThreshold * 0.5) {
                baseSize = Math.min(200, baseSize * 1.2); // Increase chunk size
            }
        }

        // Adjust based on content complexity
        const segment = content.slice(position, position + baseSize * 2);
        const complexity = this.calculateContentComplexity(segment);
        
        if (complexity > 0.7) {
            baseSize *= 0.6; // Smaller chunks for complex content
        } else if (complexity < 0.3) {
            baseSize *= 1.4; // Larger chunks for simple content
        }

        return Math.round(baseSize);
    }

    /**
     * Extract a chunk with smart boundary detection
     */
    extractChunk(content, start, maxSize, options) {
        const segment = content.slice(start, start + maxSize);
        let endPos = start + maxSize;
        
        // Find good break points
        const breakPoints = [
            /\.\s+/g,           // Sentence end
            /\n\s*\n/g,         // Paragraph break
            /[,;:]\s+/g,        // Punctuation
            /\s+/g              // Word boundary
        ];

        for (const pattern of breakPoints) {
            const matches = [...segment.matchAll(pattern)];
            if (matches.length > 0) {
                const lastMatch = matches[matches.length - 1];
                const potentialEnd = start + lastMatch.index + lastMatch[0].length;
                if (potentialEnd > start + maxSize * 0.5) { // At least 50% of target size
                    endPos = potentialEnd;
                    break;
                }
            }
        }

        const chunkContent = content.slice(start, endPos);
        
        return {
            content: chunkContent,
            end: endPos,
            type: this.detectChunkType(chunkContent),
            priority: this.calculateChunkPriority(chunkContent, start),
            isVisible: this.isChunkVisible(start, endPos),
            complexity: this.calculateContentComplexity(chunkContent)
        };
    }

    /**
     * Process chunks with frame-aware rendering
     */
    async processChunks(chunks, container, options) {
        let frameStartTime = performance.now();
        let chunksInCurrentFrame = 0;

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            
            // Check if we should yield to browser
            const currentTime = performance.now();
            const frameTime = currentTime - frameStartTime;
            
            if (frameTime > options.performanceThreshold || 
                chunksInCurrentFrame >= options.maxChunksPerFrame) {
                
                // Yield to browser
                await this.yieldToBrowser();
                frameStartTime = performance.now();
                chunksInCurrentFrame = 0;
            }

            // Render chunk
            await this.renderChunk(chunk, container, options);
            chunksInCurrentFrame++;
            this.currentChunkIndex = i + 1;

            // Update progress
            this.dispatchProgressEvent(container, {
                current: i + 1,
                total: chunks.length,
                progress: (i + 1) / chunks.length,
                chunk: chunk
            });
        }
    }

    /**
     * Render a single chunk
     */
    async renderChunk(chunk, container, options) {
        const chunkStartTime = performance.now();
        
        try {
            // Check if chunk is in cache
            const cacheKey = this.generateCacheKey(chunk);
            let renderedElement = this.chunkCache.get(cacheKey);
            
            if (!renderedElement) {
                // Create new element
                renderedElement = await this.createChunkElement(chunk, options);
                
                // Cache if beneficial
                if (chunk.complexity < 0.5) {
                    this.chunkCache.set(cacheKey, renderedElement.cloneNode(true));
                }
            }

            // Apply chunk to container
            await this.applyChunkToContainer(renderedElement, container, chunk, options);
            
            // Monitor performance
            const renderTime = performance.now() - chunkStartTime;
            this.performanceMonitor.recordChunkRender(chunk.id, renderTime, chunk.complexity);
            
        } catch (error) {
            console.warn('Chunk render error:', error, chunk);
            // Create fallback element
            const fallbackElement = this.createFallbackElement(chunk);
            container.appendChild(fallbackElement);
        }
    }

    /**
     * Create element for chunk
     */
    async createChunkElement(chunk, options) {
        const element = document.createElement('div');
        element.className = `chunk-element chunk-${chunk.type}`;
        element.setAttribute('data-chunk-id', chunk.id);
        element.setAttribute('data-chunk-complexity', chunk.complexity.toFixed(2));

        // Apply content based on type
        switch (chunk.type) {
            case 'html':
                element.innerHTML = chunk.content;
                break;
            case 'text':
                element.textContent = chunk.content;
                break;
            case 'markdown':
                element.innerHTML = await this.processMarkdown(chunk.content);
                break;
            default:
                element.textContent = chunk.content;
        }

        // Add progressive styling
        element.style.opacity = '0';
        element.style.transform = 'translateY(5px)';
        element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

        return element;
    }

    /**
     * Apply chunk element to container with animation
     */
    async applyChunkToContainer(element, container, chunk, options) {
        // Lazy rendering check
        if (options.enableLazyRendering && !chunk.isVisible) {
            element.classList.add('lazy-chunk');
            this.viewportObserver.observe(element, () => {
                this.animateChunkIn(element);
            });
        }

        container.appendChild(element);

        // Animate in if visible
        if (chunk.isVisible) {
            await this.animateChunkIn(element);
        }
    }

    /**
     * Animate chunk entrance
     */
    async animateChunkIn(element) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                element.addEventListener('transitionend', () => {
                    element.classList.add('chunk-rendered');
                    resolve();
                }, { once: true });
            });
        });
    }

    /**
     * Create render container with virtualization support
     */
    createRenderContainer(container, options) {
        const renderContainer = document.createElement('div');
        renderContainer.className = 'progressive-render-container';
        
        if (options.enableVirtualization) {
            renderContainer.style.position = 'relative';
            renderContainer.style.overflow = 'hidden';
        }

        // Add progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'render-progress-bar';
        progressBar.innerHTML = `
            <div class="progress-track">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Rendering chunks...</div>
        `;
        renderContainer.appendChild(progressBar);

        container.appendChild(renderContainer);
        return renderContainer;
    }

    /**
     * Utility methods
     */
    calculateContentComplexity(content) {
        let complexity = 0;
        
        // HTML tags add complexity
        const htmlTags = (content.match(/<[^>]+>/g) || []).length;
        complexity += htmlTags * 0.1;
        
        // Special characters add complexity
        const specialChars = (content.match(/[<>&"']/g) || []).length;
        complexity += specialChars * 0.02;
        
        // Length affects complexity
        complexity += content.length / 1000;
        
        return Math.min(complexity, 1);
    }

    detectChunkType(content) {
        if (/<[^>]+>/.test(content)) return 'html';
        if (/[*_`#]/.test(content)) return 'markdown';
        return 'text';
    }

    calculateChunkPriority(content, position) {
        let priority = 1;
        
        // Visible content gets higher priority
        if (this.isChunkVisible(position, position + content.length)) {
            priority += 2;
        }
        
        // Headers get higher priority
        if (/^#+\s/.test(content.trim())) {
            priority += 1;
        }
        
        return priority;
    }

    isChunkVisible(start, end) {
        // Simple viewport detection - can be enhanced
        return start < 2000; // First 2000 characters considered "above fold"
    }

    generateCacheKey(chunk) {
        return `${chunk.type}-${chunk.complexity.toFixed(1)}-${chunk.content.length}`;
    }

    async processMarkdown(content) {
        // Use existing markdown processor
        if (window.marked) {
            return window.marked.parse(content, { streamingMode: true });
        }
        return content;
    }

    createFallbackElement(chunk) {
        const element = document.createElement('div');
        element.className = 'chunk-fallback';
        element.textContent = chunk.content;
        return element;
    }

    yieldToBrowser() {
        return new Promise(resolve => {
            if (typeof scheduler?.postTask === 'function') {
                scheduler.postTask(resolve, { priority: 'user-blocking' });
            } else {
                setTimeout(resolve, 0);
            }
        });
    }

    async optimizeRenderedContent(container, options) {
        // Remove progress bar
        const progressBar = container.querySelector('.render-progress-bar');
        if (progressBar) {
            progressBar.style.opacity = '0';
            setTimeout(() => progressBar.remove(), 300);
        }

        // Optimize DOM structure
        this.optimizeDOMStructure(container);
        
        // Setup intersection observer for lazy chunks
        if (options.enableLazyRendering) {
            this.setupLazyRendering(container);
        }
    }

    optimizeDOMStructure(container) {
        // Merge consecutive text chunks
        const textChunks = container.querySelectorAll('.chunk-element.chunk-text');
        for (let i = 0; i < textChunks.length - 1; i++) {
            const current = textChunks[i];
            const next = textChunks[i + 1];
            
            if (current.nextElementSibling === next) {
                current.textContent += next.textContent;
                next.remove();
            }
        }
    }

    setupLazyRendering(container) {
        const lazyChunks = container.querySelectorAll('.lazy-chunk');
        lazyChunks.forEach(chunk => {
            this.viewportObserver.observe(chunk, () => {
                chunk.classList.remove('lazy-chunk');
                this.animateChunkIn(chunk);
            });
        });
    }

    dispatchProgressEvent(container, progress) {
        container.dispatchEvent(new CustomEvent('chunk-progress', {
            detail: progress,
            bubbles: true
        }));
    }

    // Control methods
    pause() {
        this.isRendering = false;
    }

    resume() {
        this.isRendering = true;
    }

    stop() {
        this.isRendering = false;
        this.renderQueue = [];
        this.currentChunkIndex = 0;
    }

    getProgress() {
        return {
            current: this.currentChunkIndex,
            total: this.totalChunks,
            progress: this.totalChunks > 0 ? this.currentChunkIndex / this.totalChunks : 0,
            isRendering: this.isRendering
        };
    }
}

/**
 * Performance Monitor for chunked rendering
 */
class PerformanceMonitor {
    constructor() {
        this.startTime = 0;
        this.chunkTimes = [];
        this.frameTimes = [];
        this.totalTime = 0;
    }

    start() {
        this.startTime = performance.now();
        this.chunkTimes = [];
        this.frameTimes = [];
    }

    stop() {
        this.totalTime = performance.now() - this.startTime;
    }

    recordChunkRender(chunkId, renderTime, complexity) {
        this.chunkTimes.push({
            id: chunkId,
            time: renderTime,
            complexity: complexity,
            timestamp: performance.now()
        });
    }

    recordFrameTime(frameTime) {
        this.frameTimes.push(frameTime);
    }

    getTotalTime() {
        return this.totalTime;
    }

    getAverageChunkTime() {
        if (this.chunkTimes.length === 0) return 0;
        const total = this.chunkTimes.reduce((sum, chunk) => sum + chunk.time, 0);
        return total / this.chunkTimes.length;
    }

    getAverageFrameTime() {
        if (this.frameTimes.length === 0) return 0;
        const total = this.frameTimes.reduce((sum, time) => sum + time, 0);
        return total / this.frameTimes.length;
    }

    getScore() {
        const avgChunkTime = this.getAverageChunkTime();
        const avgFrameTime = this.getAverageFrameTime();
        
        // Score based on 60fps target (16.67ms per frame)
        const frameScore = Math.max(0, 100 - (avgFrameTime / 16.67) * 50);
        const chunkScore = Math.max(0, 100 - (avgChunkTime / 5) * 50);
        
        return Math.round((frameScore + chunkScore) / 2);
    }
}

/**
 * Viewport Observer for lazy rendering
 */
class ViewportObserver {
    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            rootMargin: '50px'
        });
        this.callbacks = new Map();
    }

    observe(element, callback) {
        this.callbacks.set(element, callback);
        this.observer.observe(element);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const callback = this.callbacks.get(entry.target);
                if (callback) {
                    callback();
                    this.observer.unobserve(entry.target);
                    this.callbacks.delete(entry.target);
                }
            }
        });
    }
}
