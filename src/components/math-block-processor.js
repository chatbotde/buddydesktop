/**
 * Math Block Processor for Buddy Desktop
 * Creates beautiful math blocks similar to code blocks
 */

export class MathBlockProcessor {
    constructor() {
        this.mathBlockId = 0;
        this.isKaTeXReady = false;
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
        console.trace('🧮 Call stack for math processing:');

        // Process math blocks first (```math or ```latex)
        content = this.processMathCodeBlocks(content);

        // Process display math ($$...$$)
        content = this.processDisplayMath(content);

        // Process inline math ($...$)
        content = this.processInlineMath(content);

        // Process LaTeX environments
        content = this.processLaTeXEnvironments(content);

        console.log('🧮 MathBlockProcessor.processContent() result:', content.substring(0, 200));
        return content;
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
     * Escape HTML characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Inject math block styles
     */
    static injectStyles() {
        if (document.getElementById('math-block-styles')) return;

        const style = document.createElement('style');
        style.id = 'math-block-styles';
        style.textContent = `
            /* Math Block Container */
            .math-block-container {
                margin: 1.5em 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            .math-block-container:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            }

            .math-block-container.success {
                border-left: 4px solid #4caf50;
            }

            .math-block-container.error {
                border-left: 4px solid #f44336;
            }

            .math-block-container.loading {
                border-left: 4px solid #ffc107;
            }

            /* Math Block Header */
            .math-block-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .math-block-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .math-block-icon {
                font-size: 14px;
            }

            .math-block-label {
                font-size: 13px;
                font-weight: 600;
                color: #e5e5e7;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .math-block-actions {
                display: flex;
                gap: 8px;
            }

            .math-copy-btn,
            .math-toggle-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: #e5e5e7;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .math-copy-btn:hover,
            .math-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            .math-copy-btn svg,
            .math-toggle-btn svg {
                opacity: 0.8;
            }

            /* Math Block Content */
            .math-block-content {
                padding: 20px;
                min-height: 60px;
            }

            .math-block-rendered {
                text-align: center;
                line-height: 1.6;
            }

            .math-block-rendered .katex-display {
                margin: 0;
                padding: 10px 0;
            }

            .math-block-rendered .katex {
                font-size: 1.3em !important;
                color: #ffffff !important;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            }

            .math-block-source {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 8px;
                padding: 16px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .math-block-source pre {
                margin: 0;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                font-size: 13px;
                line-height: 1.5;
                color: #4fc3f7;
                white-space: pre-wrap;
                word-wrap: break-word;
            }

            .math-block-source code {
                background: none;
                padding: 0;
                border: none;
                color: inherit;
            }

            /* Inline Math */
            .math-inline {
                padding: 0.2em 0.4em;
                margin: 0 0.1em;
                border-radius: 4px;
                font-size: 1.1em;
                vertical-align: middle;
                transition: all 0.2s ease;
            }

            .math-inline.success {
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.3);
            }

            .math-inline.error {
                background: rgba(244, 67, 54, 0.1);
                border: 1px solid rgba(244, 67, 54, 0.3);
                color: #f44336;
                font-family: monospace;
            }

            .math-inline.loading {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                color: #ffc107;
                font-family: monospace;
            }

            .math-inline:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            /* Enhanced KaTeX styling */
            .math-block-container .katex .base,
            .math-block-container .katex .mord,
            .math-block-container .katex .mop,
            .math-block-container .katex .mbin,
            .math-block-container .katex .mrel,
            .math-block-container .katex .mopen,
            .math-block-container .katex .mclose,
            .math-block-container .katex .mpunct {
                color: #ffffff !important;
            }

            .math-block-container .katex .frac-line {
                border-bottom-color: #ffffff !important;
                border-bottom-width: 2px !important;
            }

            .math-block-container .katex .sqrt > .sqrt-line {
                border-top-color: #ffffff !important;
                border-top-width: 2px !important;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .math-block-container {
                    margin: 1em 0;
                }

                .math-block-header {
                    padding: 10px 12px;
                }

                .math-block-content {
                    padding: 16px;
                }

                .math-block-rendered .katex {
                    font-size: 1.1em !important;
                }

                .math-copy-btn,
                .math-toggle-btn {
                    padding: 4px 8px;
                    font-size: 10px;
                }
            }

            /* Animation for loading state */
            .math-block-container.loading .math-block-icon {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Export singleton instance
export const mathBlockProcessor = new MathBlockProcessor();

// Inject styles when module loads
MathBlockProcessor.injectStyles();