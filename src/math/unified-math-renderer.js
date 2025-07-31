/**
 * Unified Math Renderer - Complete Rewrite
 * Eliminates rendering mismatches and ensures consistent math processing
 * 
 * Key improvements:
 * - Single processing pipeline
 * - Robust duplicate detection
 * - Consistent state management
 * - Better error handling
 * - Performance optimizations
 */

export class UnifiedMathRenderer {
    constructor() {
        this.isKaTeXReady = false;
        this.processingQueue = new Map();
        this.renderCache = new Map();
        this.maxCacheSize = 200;
        this.processingId = 0;
        
        // Math patterns - order matters for processing
        this.patterns = {
            // Math code blocks (highest priority)
            mathCodeBlock: /```(?:math|latex|tex)\n?([\s\S]*?)```/g,
            
            // LaTeX environments (second priority)
            latexEnvironment: /\\begin\{(equation|align|gather|multline|split|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\*?\}([\s\S]*?)\\end\{\1\*?\}/g,
            
            // Display math (third priority)
            displayMath: /\$\$([^$]+?)\$\$/g,
            
            // Inline math (lowest priority, most careful)
            inlineMath: /(?<!\$)\$([^$\n]+?)\$(?!\$)/g
        };

        // Enhanced power equations
        this.powerEquations = [
            // Physics
            { pattern: /\bE\s*=\s*mc\^?2\b/gi, latex: 'E = mc^2', category: 'physics' },
            { pattern: /\bF\s*=\s*ma\b/gi, latex: 'F = ma', category: 'physics' },
            { pattern: /\bp\s*=\s*mv\b/gi, latex: 'p = mv', category: 'physics' },
            { pattern: /\bE\s*=\s*h\*?f\b/gi, latex: 'E = hf', category: 'physics' },
            { pattern: /\bv\s*=\s*f\*?\s*λ\b/gi, latex: 'v = f\\lambda', category: 'physics' },
            
            // Mathematics
            { pattern: /\ba\^?2\s*\+\s*b\^?2\s*=\s*c\^?2\b/gi, latex: 'a^2 + b^2 = c^2', category: 'geometry' },
            { pattern: /\barea\s*=\s*π\s*\*?\s*r\^?2\b/gi, latex: 'A = \\pi r^2', category: 'geometry' },
            { pattern: /\barea\s*=\s*pi\s*\*?\s*r\^?2\b/gi, latex: 'A = \\pi r^2', category: 'geometry' },
            { pattern: /\bcircumference\s*=\s*2\s*\*?\s*π\s*\*?\s*r\b/gi, latex: 'C = 2\\pi r', category: 'geometry' },
            { pattern: /\bcircumference\s*=\s*2\s*\*?\s*pi\s*\*?\s*r\b/gi, latex: 'C = 2\\pi r', category: 'geometry' },
            
            // Calculus
            { pattern: /\bd\/dx\s*\(\s*sin\s*x\s*\)\s*=\s*cos\s*x\b/gi, latex: '\\frac{d}{dx}(\\sin x) = \\cos x', category: 'calculus' },
            { pattern: /\bd\/dx\s*\(\s*cos\s*x\s*\)\s*=\s*-\s*sin\s*x\b/gi, latex: '\\frac{d}{dx}(\\cos x) = -\\sin x', category: 'calculus' },
            
            // Statistics
            { pattern: /\bmean\s*=\s*sum\s*x\s*\/\s*n\b/gi, latex: '\\bar{x} = \\frac{\\sum x}{n}', category: 'statistics' }
        ];

        // KaTeX configuration
        this.katexConfig = {
            default: {
                displayMode: false,
                throwOnError: false,
                errorColor: '#ff6b6b',
                strict: false,
                trust: true,
                minRuleThickness: 0.04,
                colorIsTextColor: false,
                maxSize: Infinity,
                maxExpand: 1000,
                fleqn: false,
                leqno: false,
                output: 'html',
                macros: {
                    "\\RR": "\\mathbb{R}",
                    "\\NN": "\\mathbb{N}",
                    "\\ZZ": "\\mathbb{Z}",
                    "\\QQ": "\\mathbb{Q}",
                    "\\CC": "\\mathbb{C}",
                    "\\PP": "\\mathbb{P}",
                    "\\EE": "\\mathbb{E}",
                    "\\Var": "\\text{Var}",
                    "\\Cov": "\\text{Cov}",
                    "\\f": "f",
                    "\\hat": "\\widehat",
                    "\\relax": "",
                    "\\e": "\\mathrm{e}",
                    "\\i": "\\mathrm{i}"
                }
            }
        };

        this.initializeKaTeX();
    }

    /**
     * Initialize KaTeX with proper loading
     */
    async initializeKaTeX() {
        try {
            // Check if already loaded
            if (typeof katex !== 'undefined') {
                this.isKaTeXReady = true;
                console.log('✅ UnifiedMathRenderer: KaTeX already available');
                return;
            }

            // Load KaTeX CSS and JS
            await Promise.all([
                this.loadKaTeXCSS(),
                this.loadKaTeXJS()
            ]);

            this.isKaTeXReady = true;
            console.log('✅ UnifiedMathRenderer: KaTeX loaded successfully');
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('unified-math-ready'));
            
        } catch (error) {
            console.error('❌ UnifiedMathRenderer: Failed to load KaTeX:', error);
        }
    }

    /**
     * Load KaTeX CSS
     */
    loadKaTeXCSS() {
        return new Promise((resolve, reject) => {
            if (document.querySelector('link[href*="katex"]')) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Load KaTeX JavaScript
     */
    loadKaTeXJS() {
        return new Promise((resolve, reject) => {
            if (typeof katex !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Main processing function - single entry point for all math rendering
     * @param {string} content - Content to process
     * @param {Object} options - Processing options
     * @returns {string} Processed content
     */
    processContent(content, options = {}) {
        if (!content || typeof content !== 'string') {
            return content || '';
        }

        // Generate unique processing ID
        const processingId = this.generateProcessingId();
        console.log(`🧮 [${processingId}] Processing content:`, content.substring(0, 100) + '...');

        // Check if already processed (robust detection)
        if (this.isAlreadyProcessed(content)) {
            console.log(`🧮 [${processingId}] Content already processed, skipping`);
            return content;
        }

        // Check cache
        const cacheKey = this.generateCacheKey(content);
        if (this.renderCache.has(cacheKey)) {
            console.log(`🧮 [${processingId}] Found in cache`);
            return this.renderCache.get(cacheKey);
        }

        // Process content
        let processedContent = content;
        
        try {
            // Step 1: Enhance power equations
            processedContent = this.enhancePowerEquations(processedContent);
            
            // Step 2: Process in order of priority
            processedContent = this.processMathCodeBlocks(processedContent, processingId);
            processedContent = this.processLaTeXEnvironments(processedContent, processingId);
            processedContent = this.processDisplayMath(processedContent, processingId);
            processedContent = this.processInlineMath(processedContent, processingId);
            
            // Cache result
            this.cacheResult(cacheKey, processedContent);
            
            console.log(`🧮 [${processingId}] Processing complete`);
            return processedContent;
            
        } catch (error) {
            console.error(`❌ [${processingId}] Processing error:`, error);
            return content; // Return original on error
        }
    }

    /**
     * Robust detection of already processed content
     */
    isAlreadyProcessed(content) {
        const indicators = [
            'math-block-container',
            'math-inline-wrapper',
            'unified-math-',
            'katex-display',
            'class="katex"',
            'data-math-processed="true"'
        ];

        return indicators.some(indicator => content.includes(indicator));
    }

    /**
     * Enhance power equations before LaTeX processing
     */
    enhancePowerEquations(content) {
        let enhanced = content;
        
        this.powerEquations.forEach(({ pattern, latex }) => {
            enhanced = enhanced.replace(pattern, latex);
        });
        
        return enhanced;
    }

    /**
     * Process math code blocks
     */
    processMathCodeBlocks(content, processingId) {
        return content.replace(this.patterns.mathCodeBlock, (match, mathContent) => {
            const blockId = this.generateBlockId();
            const trimmedMath = mathContent.trim();
            
            console.log(`📊 [${processingId}] Processing math code block: ${blockId}`);
            
            return this.renderMathBlock(trimmedMath, {
                blockId,
                title: 'Math Block',
                type: 'code-block',
                displayMode: true
            });
        });
    }

    /**
     * Process LaTeX environments
     */
    processLaTeXEnvironments(content, processingId) {
        return content.replace(this.patterns.latexEnvironment, (match, envName, mathContent) => {
            const blockId = this.generateBlockId();
            
            console.log(`📐 [${processingId}] Processing ${envName} environment: ${blockId}`);
            
            return this.renderMathBlock(match, {
                blockId,
                title: `${envName.toUpperCase()} Environment`,
                type: 'environment',
                displayMode: true
            });
        });
    }

    /**
     * Process display math
     */
    processDisplayMath(content, processingId) {
        return content.replace(this.patterns.displayMath, (match, mathContent) => {
            const blockId = this.generateBlockId();
            const trimmedMath = mathContent.trim();
            
            console.log(`📐 [${processingId}] Processing display math: ${blockId}`);
            
            return this.renderMathBlock(trimmedMath, {
                blockId,
                title: 'Display Math',
                type: 'display',
                displayMode: true
            });
        });
    }

    /**
     * Process inline math
     */
    processInlineMath(content, processingId) {
        return content.replace(this.patterns.inlineMath, (match, mathContent) => {
            const inlineId = this.generateInlineId();
            const trimmedMath = mathContent.trim();
            
            console.log(`📏 [${processingId}] Processing inline math: ${inlineId}`);
            
            return this.renderInlineMath(trimmedMath, inlineId);
        });
    }

    /**
     * Render math block with consistent structure
     */
    renderMathBlock(mathContent, options) {
        const { blockId, title, type, displayMode } = options;
        
        if (!this.isKaTeXReady) {
            return this.createLoadingBlock(blockId, mathContent, title);
        }

        try {
            const rendered = katex.renderToString(mathContent, {
                ...this.katexConfig.default,
                displayMode: displayMode
            });

            if (this.hasRenderError(rendered)) {
                return this.createErrorBlock(blockId, mathContent, title);
            }

            return this.createSuccessBlock(blockId, mathContent, title, rendered);
            
        } catch (error) {
            console.error('Math block render error:', error);
            return this.createErrorBlock(blockId, mathContent, title);
        }
    }

    /**
     * Render inline math with consistent structure
     */
    renderInlineMath(mathContent, inlineId) {
        if (!this.isKaTeXReady) {
            return `<span class="math-inline-wrapper loading" data-math-id="${inlineId}">${this.escapeHtml(mathContent)}</span>`;
        }

        try {
            const rendered = katex.renderToString(mathContent, {
                ...this.katexConfig.default,
                displayMode: false
            });

            if (this.hasRenderError(rendered)) {
                return `<span class="math-inline-wrapper error" data-math-id="${inlineId}" title="Math error">${this.escapeHtml(mathContent)}</span>`;
            }

            return `<span class="math-inline-wrapper success" data-math-id="${inlineId}">${rendered}</span>`;
            
        } catch (error) {
            console.error('Inline math render error:', error);
            return `<span class="math-inline-wrapper error" data-math-id="${inlineId}" title="Render error">${this.escapeHtml(mathContent)}</span>`;
        }
    }

    /**
     * Create loading state block
     */
    createLoadingBlock(blockId, mathContent, title) {
        return `
            <div class="math-block-container loading" data-math-id="${blockId}" data-math-processed="true">
                <div class="math-block-header">
                    <div class="math-block-title">
                        <span class="math-block-icon">⏳</span>
                        <span class="math-block-label">${title} (Loading...)</span>
                    </div>
                    <div class="math-block-actions">
                        <button class="math-copy-btn" onclick="this.getRootNode().host._copyMath('${blockId}')" title="Copy LaTeX">
                            📋 Copy
                        </button>
                    </div>
                </div>
                <div class="math-block-content">
                    <div class="math-block-source" id="${blockId}-source">
                        <pre><code>${this.escapeHtml(mathContent)}</code></pre>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create error state block
     */
    createErrorBlock(blockId, mathContent, title) {
        return `
            <div class="math-block-container error" data-math-id="${blockId}" data-math-processed="true">
                <div class="math-block-header">
                    <div class="math-block-title">
                        <span class="math-block-icon">❌</span>
                        <span class="math-block-label">${title} (Error)</span>
                    </div>
                    <div class="math-block-actions">
                        <button class="math-copy-btn" onclick="this.getRootNode().host._copyMath('${blockId}')" title="Copy LaTeX">
                            📋 Copy
                        </button>
                    </div>
                </div>
                <div class="math-block-content">
                    <div class="math-block-source" id="${blockId}-source">
                        <pre><code>${this.escapeHtml(mathContent)}</code></pre>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create success state block
     */
    createSuccessBlock(blockId, mathContent, title, rendered) {
        return `
            <div class="math-block-container success" data-math-id="${blockId}" data-math-processed="true">
                <div class="math-block-header">
                    <div class="math-block-title">
                        <span class="math-block-icon">✅</span>
                        <span class="math-block-label">${title}</span>
                    </div>
                    <div class="math-block-actions">
                        <button class="math-copy-btn" onclick="this.getRootNode().host._copyMath('${blockId}')" title="Copy LaTeX">
                            📋 Copy
                        </button>
                        <button class="math-toggle-btn" onclick="this.getRootNode().host._toggleMathSource('${blockId}')" title="Toggle source">
                            🔄 Source
                        </button>
                    </div>
                </div>
                <div class="math-block-content">
                    <div class="math-block-rendered" id="${blockId}-rendered">
                        ${rendered}
                    </div>
                    <div class="math-block-source" id="${blockId}-source" style="display: none;">
                        <pre><code>${this.escapeHtml(mathContent)}</code></pre>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Check if rendered output has errors
     */
    hasRenderError(rendered) {
        return rendered.includes('katex-error') || 
               rendered.includes('ParseError') || 
               rendered.includes('\\color{#cc0000}');
    }

    /**
     * Generate unique processing ID
     */
    generateProcessingId() {
        return `proc-${++this.processingId}-${Date.now()}`;
    }

    /**
     * Generate unique block ID
     */
    generateBlockId() {
        return `unified-math-block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Generate unique inline ID
     */
    generateInlineId() {
        return `unified-math-inline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Generate cache key for content
     */
    generateCacheKey(content) {
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    /**
     * Cache processing result
     */
    cacheResult(key, result) {
        // Limit cache size
        if (this.renderCache.size >= this.maxCacheSize) {
            const firstKey = this.renderCache.keys().next().value;
            this.renderCache.delete(firstKey);
        }
        
        this.renderCache.set(key, result);
    }

    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.renderCache.clear();
        console.log('🧮 UnifiedMathRenderer: Cache cleared');
    }

    /**
     * Get renderer statistics
     */
    getStats() {
        return {
            isKaTeXReady: this.isKaTeXReady,
            cacheSize: this.renderCache.size,
            maxCacheSize: this.maxCacheSize,
            processingId: this.processingId
        };
    }
}

// Export singleton instance
export const unifiedMathRenderer = new UnifiedMathRenderer();

// Export convenience functions
export const processMathContent = (content, options) => unifiedMathRenderer.processContent(content, options);
export const isKaTeXReady = () => unifiedMathRenderer.isKaTeXReady;
export const clearMathCache = () => unifiedMathRenderer.clearCache();
export const getMathStats = () => unifiedMathRenderer.getStats();