/**
 * Math Block Processor for Buddy Desktop
 * Creates beautiful math blocks similar to code blocks
 */

export class MathBlockProcessor {
    constructor() {
        this.mathBlockId = 0;
        this.isKaTeXReady = false;
        this.processedContentCache = new Map(); // Cache to prevent duplicate processing
        this.setupKaTeXCheck();
    }

    /**
     * Check if KaTeX is ready
     */
    setupKaTeXCheck() {
        const checkKaTeX = () => {
            if (typeof katex !== 'undefined') {
                this.isKaTeXReady = true;
                console.log('✅ MathBlockProcessor: KaTeX is ready');
            } else {
                setTimeout(checkKaTeX, 100);
            }
        };
        checkKaTeX();

        // Listen for KaTeX ready event
        window.addEventListener('katex-ready', () => {
            this.isKaTeXReady = true;
            console.log('✅ MathBlockProcessor: KaTeX ready event received');
        });
    }

    /**
     * Process content and create math blocks
     * @param {string} content - Content to process
     * @returns {string} Processed content with math blocks
     */
    processContent(content) {
        if (!content) return '';

        console.log('🧮 MathBlockProcessor.processContent() called with:', content.substring(0, 100));

        // Check cache first to prevent duplicate processing
        const contentHash = this._hashContent(content);
        if (this.processedContentCache.has(contentHash)) {
            console.log('🧮 Content found in cache, returning cached result');
            return this.processedContentCache.get(contentHash);
        }

        // ⭐ ENHANCED DUPLICATE DETECTION: Check if content already has processed math
        if (this._hasProcessedMath(content)) {
            console.log('🧮 Content already contains processed math, skipping processing');
            return content;
        }

        let processedContent = content;

        // Process math blocks first (```math or ```latex)
        processedContent = this.processMathCodeBlocks(processedContent);

        // Process display math ($$...$$)
        processedContent = this.processDisplayMath(processedContent);

        // Process inline math ($...$)
        processedContent = this.processInlineMath(processedContent);

        // Process LaTeX environments
        processedContent = this.processLaTeXEnvironments(processedContent);

        // Cache the result
        this.processedContentCache.set(contentHash, processedContent);
        
        // Limit cache size to prevent memory issues
        if (this.processedContentCache.size > 100) {
            const firstKey = this.processedContentCache.keys().next().value;
            this.processedContentCache.delete(firstKey);
        }

        console.log('🧮 MathBlockProcessor.processContent() result:', processedContent.substring(0, 200));
        return processedContent;
    }

    /**
     * Process math code blocks (```math or ```latex)
     */
    processMathCodeBlocks(content) {
        const mathBlockRegex = /```(?:math|latex|tex)\n?([\s\S]*?)```/g;
        
        return content.replace(mathBlockRegex, (match, mathContent) => {
            const blockId = this.generateBlockId();
            const trimmedMath = mathContent.trim();
            
            console.log('📊 Found math code block:', trimmedMath.substring(0, 50) + '...');
            
            if (!this.isKaTeXReady) {
                return this.createMathBlockHTML(blockId, trimmedMath, 'Math block (KaTeX loading...)', 'loading');
            }

            try {
                const rendered = katex.renderToString(trimmedMath, {
                    displayMode: true,
                    throwOnError: false,
                    strict: false,
                    trust: true
                });

                if (rendered.includes('katex-error') || rendered.includes('ParseError')) {
                    return this.createMathBlockHTML(blockId, trimmedMath, 'Math block (Parse Error)', 'error');
                }

                return this.createMathBlockHTML(blockId, trimmedMath, 'Math Block', 'success', rendered);
            } catch (error) {
                console.error('❌ Math block render error:', error);
                return this.createMathBlockHTML(blockId, trimmedMath, 'Math block (Render Error)', 'error');
            }
        });
    }

    /**
     * Process display math ($$...$$)
     */
    processDisplayMath(content) {
        console.log('📐 Processing display math in content:', content.substring(0, 200));
        
        return content.replace(/\$\$([^$]+)\$\$/g, (match, mathContent) => {
            const blockId = this.generateBlockId();
            const trimmedMath = mathContent.trim();
            
            console.log('📐 Found display math:', trimmedMath);
            console.log('📐 Block ID:', blockId);
            console.log('📐 Full match:', match);
            
            if (!this.isKaTeXReady) {
                return this.createMathBlockHTML(blockId, trimmedMath, 'Display Math (KaTeX loading...)', 'loading');
            }

            try {
                console.log('📐 Rendering with KaTeX...');
                const rendered = katex.renderToString(trimmedMath, {
                    displayMode: true,
                    throwOnError: false,
                    strict: false,
                    trust: true
                });

                console.log('📐 KaTeX rendered result:', rendered.substring(0, 100) + '...');

                if (rendered.includes('katex-error') || rendered.includes('ParseError')) {
                    console.log('❌ Parse error in display math');
                    return this.createMathBlockHTML(blockId, trimmedMath, 'Display Math (Parse Error)', 'error');
                }

                console.log('✅ Display math rendered successfully');
                return this.createMathBlockHTML(blockId, trimmedMath, 'Display Math', 'success', rendered);
            } catch (error) {
                console.error('❌ Display math render error:', error);
                return this.createMathBlockHTML(blockId, trimmedMath, 'Display Math (Render Error)', 'error');
            }
        });
    }

    /**
     * Process inline math ($...$)
     */
    processInlineMath(content) {
        console.log('📏 Processing inline math in content:', content.substring(0, 200));
        
        return content.replace(/\$([^$\n]+)\$/g, (match, mathContent) => {
            const trimmedMath = mathContent.trim();
            
            console.log('📏 Found inline math:', trimmedMath);
            console.log('📏 Full match:', match);
            
            if (!this.isKaTeXReady) {
                console.log('⏳ KaTeX not ready for inline math');
                return `<span class="math-inline loading" title="KaTeX loading...">${trimmedMath}</span>`;
            }

            try {
                console.log('📏 Rendering inline math with KaTeX...');
                const rendered = katex.renderToString(trimmedMath, {
                    displayMode: false,
                    throwOnError: false,
                    strict: false,
                    trust: true
                });

                console.log('📏 KaTeX inline rendered result:', rendered.substring(0, 100) + '...');

                if (rendered.includes('katex-error') || rendered.includes('ParseError')) {
                    console.log('❌ Parse error in inline math');
                    return `<span class="math-inline error" title="Parse error">${this.escapeHtml(trimmedMath)}</span>`;
                }

                console.log('✅ Inline math rendered successfully');
                return `<span class="math-inline success">${rendered}</span>`;
            } catch (error) {
                console.error('❌ Inline math render error:', error);
                return `<span class="math-inline error" title="Render error">${this.escapeHtml(trimmedMath)}</span>`;
            }
        });
    }

    /**
     * Process LaTeX environments (align, equation, etc.)
     */
    processLaTeXEnvironments(content) {
        const environments = ['equation', 'align', 'gather', 'multline', 'split'];
        
        environments.forEach(env => {
            const regex = new RegExp(`\\\\begin\\{${env}\\*?\\}([\\s\\S]*?)\\\\end\\{${env}\\*?\\}`, 'g');
            
            content = content.replace(regex, (match, mathContent) => {
                const blockId = this.generateBlockId();
                const trimmedMath = mathContent.trim();
                
                console.log(`📐 Found ${env} environment:`, trimmedMath);
                
                if (!this.isKaTeXReady) {
                    return this.createMathBlockHTML(blockId, match, `${env.toUpperCase()} Environment (KaTeX loading...)`, 'loading');
                }

                try {
                    const rendered = katex.renderToString(match, {
                        displayMode: true,
                        throwOnError: false,
                        strict: false,
                        trust: true
                    });

                    if (rendered.includes('katex-error') || rendered.includes('ParseError')) {
                        return this.createMathBlockHTML(blockId, match, `${env.toUpperCase()} Environment (Parse Error)`, 'error');
                    }

                    return this.createMathBlockHTML(blockId, match, `${env.toUpperCase()} Environment`, 'success', rendered);
                } catch (error) {
                    console.error(`❌ ${env} environment render error:`, error);
                    return this.createMathBlockHTML(blockId, match, `${env.toUpperCase()} Environment (Render Error)`, 'error');
                }
            });
        });

        return content;
    }

    /**
     * Generate unique block ID
     */
    generateBlockId() {
        return `math-block-${++this.mathBlockId}-${Date.now()}`;
    }

    /**
     * Create math block HTML structure
     */
    createMathBlockHTML(blockId, rawMath, title, status, renderedMath = null) {
        const statusClass = status === 'success' ? 'success' : status === 'error' ? 'error' : 'loading';
        const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
        
        const header = `
            <div class="math-block-header">
                <div class="math-block-title">
                    <span class="math-block-icon">${statusIcon}</span>
                    <span class="math-block-label">${title}</span>
                </div>
                <div class="math-block-actions">
                    <button class="math-copy-btn" onclick="this.getRootNode().host._copyMath('${blockId}')" title="Copy LaTeX">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1"></path>
                        </svg>
                        Copy
                    </button>
                    <button class="math-toggle-btn" onclick="this.getRootNode().host._toggleMathSource('${blockId}')" title="Toggle source">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                        Source
                    </button>
                </div>
            </div>
        `;

        const mathContent = renderedMath ? `
            <div class="math-block-rendered" id="${blockId}-rendered">
                ${renderedMath}
            </div>
            <div class="math-block-source" id="${blockId}-source" style="display: none;">
                <pre><code>${this.escapeHtml(rawMath)}</code></pre>
            </div>
        ` : `
            <div class="math-block-source" id="${blockId}-source">
                <pre><code>${this.escapeHtml(rawMath)}</code></pre>
            </div>
        `;

        return `
            <div class="math-block-container ${statusClass}" data-math-id="${blockId}">
                ${header}
                <div class="math-block-content" id="${blockId}">
                    ${mathContent}
                </div>
            </div>
        `;
    }

    /**
     * Simple hash function for content caching
     * @param {string} content - Content to hash
     * @returns {string} Hash string
     */
    _hashContent(content) {
        let hash = 0;
        if (content.length === 0) return hash.toString();
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    /**
     * ⭐ ENHANCED DUPLICATE DETECTION: Check if content has processed math
     */
    _hasProcessedMath(content) {
        if (!content) return false;

        const mathIndicators = [
            'math-block-container',
            'math-inline',
            'class="katex"',
            'katex-display',
            'math-error',
            'math-plain',
            'math-loading'
        ];

        return mathIndicators.some(indicator => content.includes(indicator));
    }

    /**
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export singleton instance
export const mathBlockProcessor = new MathBlockProcessor();

// Note: Styles are now handled by the mathStyles module 