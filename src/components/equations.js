/**
 * Equations Rendering System for Buddy Desktop
 * Handles all math and equation rendering functionality
 */

/**
 * Equation Renderer Class
 * Manages KaTeX rendering, math styling, and equation processing
 */
export class EquationRenderer {
    constructor() {
        this.isKaTeXReady = false;
        this.mathMacros = {
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
            "\\macro": "\\text{macro}",
            "\\d": "\\mathrm{d}",
            "\\dx": "\\,\\mathrm{d}x",
            "\\dt": "\\,\\mathrm{d}t",
            "\\du": "\\,\\mathrm{d}u",
            "\\dv": "\\,\\mathrm{d}v",
            "\\dy": "\\,\\mathrm{d}y",
            "\\dz": "\\,\\mathrm{d}z",
            "\\e": "\\mathrm{e}",
            "\\i": "\\mathrm{i}",
            "\\const": "\\text{const}",
            "\\diff": "\\mathrm{d}",
            "\\grad": "\\nabla",
            "\\curl": "\\nabla \\times",
            "\\divergence": "\\nabla \\cdot",
            "\\laplacian": "\\nabla^2"
        };
        
        // ================================
        // Power-equation enhancement rules
        // ================================
        // These regex/replacement pairs convert common power-style notations written
        // in plain text into proper LaTeX before KaTeX rendering.  Keeping them in
        // the constructor means they are compiled once and re-used, which is much
        // faster than recreating them on every call.
        this.powerEnhancements = [
            // Einstein’s mass-energy equivalence variations
            { regex: /E\s*=\s*mc\^2/gi, replacement: 'E = mc^{2}' },
            { regex: /E\s*=\s*m\s*c\s*\^\s*2/gi, replacement: 'E = mc^{2}' },

            // Generic variable to positive-integer power (e.g. x^2 → x^{2})
            { regex: /([a-zA-Z])\^(\d+)/g, replacement: '$1^{$2}' },

            // Exponential functions: e^x, e^kt, …
            { regex: /e\^([a-zA-Z0-9]+)/g, replacement: 'e^{$1}' },

            // Scientific notation: 10^23 → 10^{23}
            { regex: /10\^([a-zA-Z0-9]+)/g, replacement: '10^{$1}' }
        ];

        this.init();
    }

    /**
     * Initialize KaTeX and set up math rendering
     */
    init() {
        console.log('🚀 Initializing KaTeX equation renderer...');
        this.injectMathStyles();
        this.setupEventListeners();
        
        // Check if KaTeX is already loaded
        if (typeof katex !== 'undefined') {
            console.log('✅ KaTeX already loaded!');
            this.isKaTeXReady = true;
            this.testKaTeXRendering();
        } else {
            console.log('⏳ Waiting for KaTeX to load...');
            // KaTeX will be loaded by the main HTML file
        }
    }

    /**
     * Load KaTeX library for Electron app
     */
    loadKaTeX() {
        console.log('🚀 Loading KaTeX for Electron app...');
        
        // For Electron, we need to load KaTeX synchronously and ensure it's available
        this.loadKaTeXForElectron();
    }
    
    /**
     * Load KaTeX specifically for Electron environment
     */
    loadKaTeXForElectron() {
        // First try to load from local node_modules (Electron can access these)
        const katexCSS = document.createElement('link');
        katexCSS.rel = 'stylesheet';
        katexCSS.href = '../node_modules/katex/dist/katex.min.css';
        
        katexCSS.onload = () => {
            console.log('✅ KaTeX CSS loaded from local files');
            
            const katexScript = document.createElement('script');
            katexScript.src = '../node_modules/katex/dist/katex.min.js';
            
            katexScript.onload = () => {
                console.log('✅ KaTeX JS loaded from local files');
                this.isKaTeXReady = true;
                
                setTimeout(() => {
                    if (typeof katex !== 'undefined') {
                        console.log('🎉 KaTeX ready for Electron!');
                        console.log('KaTeX version:', katex.version || 'Unknown');
                        window.dispatchEvent(new CustomEvent('katex-ready'));
                        
                        // Test render to ensure it works
                        this.testKaTeXRendering();
                    } else {
                        console.error('❌ KaTeX not available after loading');
                        this.loadKaTeXFromCDN();
                    }
                }, 200);
            };
            
            katexScript.onerror = () => {
                console.log('❌ Local KaTeX failed, trying CDN...');
                this.loadKaTeXFromCDN();
            };
            
            document.head.appendChild(katexScript);
        };
        
        katexCSS.onerror = () => {
            console.log('❌ Local KaTeX CSS failed, trying CDN...');
            this.loadKaTeXFromCDN();
        };
        
        document.head.appendChild(katexCSS);
    }
    
    /**
     * Test KaTeX rendering to ensure it works
     */
    testKaTeXRendering() {
        try {
            const testResult = katex.renderToString('E = mc^2', {
                displayMode: false,
                throwOnError: false
            });
            console.log('✅ KaTeX test render successful:', testResult.substring(0, 50) + '...');
        } catch (error) {
            console.error('❌ KaTeX test render failed:', error);
        }
    }
    
    /**
     * Try loading KaTeX from different possible paths
     */
    tryLoadKaTeXFromPaths(paths, index) {
        if (index >= paths.length) {
            console.log('All local paths failed, falling back to CDN...');
            this.loadKaTeXFromCDN();
            return;
        }
        
        const basePath = paths[index];
        console.log(`Trying KaTeX path ${index + 1}/${paths.length}: ${basePath}`);
        
        // Load CSS first
        const katexCSS = document.createElement('link');
        katexCSS.rel = 'stylesheet';
        katexCSS.href = basePath + '.css';
        
        katexCSS.onload = () => {
            console.log('✅ KaTeX CSS loaded from:', basePath + '.css');
            
            // Now load JavaScript
            const katexScript = document.createElement('script');
            katexScript.src = basePath + '.js';
            
            katexScript.onload = () => {
                console.log('✅ KaTeX JS loaded successfully from:', basePath + '.js');
                this.isKaTeXReady = true;
                
                // Wait a bit to ensure katex is fully available
                setTimeout(() => {
                    console.log('KaTeX ready check - typeof katex:', typeof katex);
                    if (typeof katex !== 'undefined') {
                        console.log('🎉 KaTeX is ready for rendering equations!');
                        console.log('KaTeX version:', katex.version || 'Unknown');
                        window.dispatchEvent(new CustomEvent('katex-ready'));
                    } else {
                        console.error('❌ KaTeX still not available after loading');
                        this.tryLoadKaTeXFromPaths(paths, index + 1);
                    }
                }, 100);
            };
            
            katexScript.onerror = (error) => {
                console.error('❌ Failed to load KaTeX JS from:', basePath + '.js');
                this.tryLoadKaTeXFromPaths(paths, index + 1);
            };
            
            document.head.appendChild(katexScript);
        };
        
        katexCSS.onerror = (error) => {
            console.error('❌ Failed to load KaTeX CSS from:', basePath + '.css');
            this.tryLoadKaTeXFromPaths(paths, index + 1);
        };
        
        document.head.appendChild(katexCSS);
    }

    /**
     * Fallback method to load KaTeX from CDN
     */
    loadKaTeXFromCDN() {
        console.log('🌐 Loading KaTeX from CDN...');
        
        // Load KaTeX CSS from CDN
        const katexCSS = document.createElement('link');
        katexCSS.rel = 'stylesheet';
        katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        
        katexCSS.onload = () => {
            console.log('✅ KaTeX CSS loaded from CDN');
            
            // Load KaTeX JavaScript from CDN
            const katexScript = document.createElement('script');
            katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
            
            katexScript.onload = () => {
                console.log('✅ KaTeX JS loaded successfully from CDN');
                this.isKaTeXReady = true;
                
                setTimeout(() => {
                    console.log('KaTeX ready from CDN - typeof katex:', typeof katex);
                    if (typeof katex !== 'undefined') {
                        console.log('🎉 KaTeX is ready from CDN!');
                        console.log('KaTeX version:', katex.version || 'Unknown');
                        window.dispatchEvent(new CustomEvent('katex-ready'));
                    } else {
                        console.error('❌ KaTeX still not available even from CDN');
                        window.dispatchEvent(new CustomEvent('katex-error'));
                    }
                }, 100);
            };
            
            katexScript.onerror = () => {
                console.error('❌ Failed to load KaTeX from CDN as well');
                console.error('❌ All KaTeX loading methods failed');
                window.dispatchEvent(new CustomEvent('katex-error'));
            };
            
            document.head.appendChild(katexScript);
        };
        
        katexCSS.onerror = () => {
            console.error('❌ Failed to load KaTeX CSS from CDN');
            window.dispatchEvent(new CustomEvent('katex-error'));
        };
        
        document.head.appendChild(katexCSS);
    }

    /**
     * Inject professional math styling with enhanced clarity
     */
    injectMathStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* KaTeX Display Math - Ultra Clear Professional styling */
            .katex-display {
                margin: 2em 0;
                overflow-x: auto;
                overflow-y: hidden;
                text-align: center;
                padding: 2em;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
                border-radius: 16px;
                border: 2px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                position: relative;
                font-size: 1.4em;
                line-height: 1.6;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .katex-display::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #007aff, #5856d6, #007aff);
                border-radius: 16px 16px 0 0;
            }
            
            .katex-display .katex {
                color: #ffffff !important;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
                font-size: 1.2em;
                font-weight: 500;
            }
            
            /* KaTeX Inline Math - Enhanced clarity */
            .katex {
                font-size: 1.2em !important;
                line-height: 1.5;
                font-weight: 500;
                color: #f0f0f0 !important;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            }
            
            .katex-inline {
                padding: 0.3em 0.6em;
                vertical-align: middle;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                margin: 0 0.2em;
            }
            
            /* Math container styling - Ultra Professional */
            .math-block {
                margin: 2.5em 0;
                text-align: center;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
                border-radius: 16px;
                padding: 2em;
                border: 2px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                position: relative;
                overflow: hidden;
                min-height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .math-block::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #007aff, #5856d6, #007aff);
                border-radius: 16px 16px 0 0;
            }
            
            .math-block .katex {
                color: #ffffff !important;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
                font-size: 1.3em;
                font-weight: 500;
            }
            
            .math-inline {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                padding: 0.3em 0.6em;
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                display: inline-block;
                margin: 0 0.2em;
            }
            
            /* Enhanced KaTeX element styling for maximum clarity */
            .katex .base {
                color: #ffffff !important;
            }
            
            .katex .mord,
            .katex .mop,
            .katex .mbin,
            .katex .mrel,
            .katex .mopen,
            .katex .mclose,
            .katex .mpunct {
                color: #ffffff !important;
            }
            
            .katex .frac-line {
                border-bottom-color: #ffffff !important;
                border-bottom-width: 2px !important;
            }
            
            .katex .sqrt > .root {
                color: #ffffff !important;
            }
            
            .katex .sqrt > .sqrt-line {
                border-top-color: #ffffff !important;
                border-top-width: 2px !important;
            }
            
            /* Matrix and array styling */
            .katex .arraycolsep {
                width: 0.8em;
            }
            
            .katex .arraycolsep .col-align-l > .vlist-t {
                color: #ffffff !important;
            }
            
            /* Summation and integral symbols */
            .katex .op-symbol {
                color: #ffffff !important;
                font-weight: 600;
            }
            
            .katex .op-limits > .vlist-t {
                color: #ffffff !important;
            }
            
            /* Parentheses and brackets */
            .katex .delimsizing {
                color: #ffffff !important;
            }
            
            .katex .delim-size1,
            .katex .delim-size2,
            .katex .delim-size3,
            .katex .delim-size4 {
                color: #ffffff !important;
            }
            
            /* Accent styling */
            .katex .accent-body {
                color: #ffffff !important;
            }
            
            /* Subscript and superscript */
            .katex .msupsub {
                color: #ffffff !important;
            }
            
            /* Error styling */
            .katex-error {
                color: #ff6b6b !important;
                background: rgba(255, 107, 107, 0.1);
                padding: 0.5em;
                border-radius: 6px;
                border: 1px solid rgba(255, 107, 107, 0.3);
            }
            
            /* Scrollbar for overflow */
            .katex-display::-webkit-scrollbar {
                height: 8px;
            }
            
            .katex-display::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            .katex-display::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            
            .katex-display::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            
            /* Power equation enhanced styling */
            .power-enhanced .katex {
                font-size: 1.3em !important;
                font-weight: 600;
            }
            
            .power-enhanced .katex-display .katex {
                font-size: 1.4em !important;
            }
            
            .power-enhanced .katex .msupsub {
                font-size: 0.85em !important;
                font-weight: 700;
            }
            
            .power-enhanced .katex .mord.mathdefault {
                font-weight: 600;
            }
            
            .power-enhanced .katex .mop {
                font-weight: 700;
                color: #4fc3f7 !important;
            }
            
            .power-enhanced .katex .mbin {
                font-weight: 600;
                color: #81c784 !important;
            }
            
            .power-enhanced .katex .mrel {
                font-weight: 600;
                color: #ffb74d !important;
            }
            
            /* Special styling for common power equations */
            .power-enhanced .katex .mord:contains('E'),
            .power-enhanced .katex .mord:contains('m'),
            .power-enhanced .katex .mord:contains('c') {
                font-weight: 700;
                color: #ff8a65 !important;
            }
            
            /* Enhanced superscript visibility */
            .power-enhanced .katex .msupsub > .vlist-t {
                color: #ffcdd2 !important;
            }
            
            /* Better fraction line visibility in power equations */
            .power-enhanced .katex .frac-line {
                border-bottom-width: 3px !important;
                border-bottom-color: #e3f2fd !important;
            }
            
            /* Enhanced square root in power equations */
            .power-enhanced .katex .sqrt > .sqrt-line {
                border-top-width: 3px !important;
                border-top-color: #e8f5e8 !important;
            }
            
            /* Power equation hover effects */
            .power-enhanced:hover .katex {
                transform: scale(1.02);
                transition: transform 0.2s ease;
            }
            
            .power-enhanced:hover .katex .msupsub {
                color: #ffeb3b !important;
                text-shadow: 0 0 8px rgba(255, 235, 59, 0.3);
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .katex-display {
                    font-size: 1.2em;
                    padding: 1.5em;
                }
                
                .math-block {
                    padding: 1.5em;
                }
                
                .katex {
                    font-size: 1.1em !important;
                }
                
                .power-enhanced .katex {
                    font-size: 1.2em !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Set up event listeners for KaTeX readiness
     */
    setupEventListeners() {
        window.addEventListener('katex-ready', () => {
            this.isKaTeXReady = true;
        });

        window.addEventListener('katex-error', () => {
            this.isKaTeXReady = false;
        });
    }

    /**
     * Check if KaTeX is ready for use
     * @returns {boolean} KaTeX readiness status
     */
    isReady() {
        const ready = this.isKaTeXReady && typeof katex !== 'undefined';
        console.log('KaTeX ready check:', { isKaTeXReady: this.isKaTeXReady, katexDefined: typeof katex !== 'undefined', ready });
        return ready;
    }

    /**
     * Render math expression with KaTeX
     * @param {string} math - Math expression to render
     * @param {boolean} display - Whether to render in display mode
     * @returns {string} Rendered HTML
     */
    renderMath(math, display = false) {
        console.log(`🔢 Attempting to render math: "${math}" (display: ${display})`);
        
        if (!this.isReady()) {
            console.warn('⚠️ KaTeX not ready yet, showing plain text');
            return `<span class="math-plain" title="KaTeX not loaded">${math}</span>`;
        }
        
        if (!math || math.trim() === '') {
            console.warn('⚠️ Empty math expression');
            return '';
        }
        
        try {
            console.log('✅ KaTeX is ready, rendering...');
            const result = katex.renderToString(math.trim(), {
                displayMode: display,
                throwOnError: false,
                errorColor: '#ff6b6b',
                strict: false,
                trust: true,
                macros: this.mathMacros,
                minRuleThickness: 0.04,
                colorIsTextColor: false,
                maxSize: Infinity,
                maxExpand: 1000,
                fleqn: false,
                leqno: false,
                output: 'html'
            });
            
            // Check if the result contains error indicators
            if (result.includes('katex-error') || result.includes('ParseError')) {
                console.warn('⚠️ KaTeX parsing error for:', math);
                return `<span class="math-error" title="LaTeX parsing error">${math}</span>`;
            }
            
            console.log('🎉 Math rendered successfully');
            return result;
        } catch (error) {
            console.error('❌ Math rendering error:', error);
            return `<span class="math-error" title="Rendering error: ${error.message}">${math}</span>`;
        }
    }

    /**
     * Enhanced math rendering with additional options
     * @param {string} math - Math expression to render
     * @param {Object} options - Rendering options
     * @returns {string} Rendered HTML
     */
    renderMathEnhanced(math, options = {}) {
        const defaultOptions = {
            display: false,
            fontSize: '1.1em',
            color: '#e5e5e7',
            backgroundColor: 'transparent',
            border: true,
            shadow: true
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        if (!this.isReady()) {
            return `<span class="math-plain" style="font-size: ${finalOptions.fontSize}; color: ${finalOptions.color};">${math}</span>`;
        }
        
        try {
            const result = katex.renderToString(math, {
                displayMode: finalOptions.display,
                throwOnError: false,
                errorColor: '#ff6b6b',
                strict: false,
                trust: true,
                macros: this.mathMacros
            });
            
            if (result.includes('katex-error') || result.includes('ParseError')) {
                return `<span class="math-error">${math}</span>`;
            }
            
            return result;
        } catch (error) {
            return `<span class="math-error">${math}</span>`;
        }
    }

    /**
     * Enhance math styling in HTML content
     * @param {string} content - HTML content to enhance
     * @returns {string} Enhanced HTML content
     */
    enhanceMathStyling(content) {
        if (!content) return content;
        
        // Add styling to display math blocks
        content = content.replace(
            /<span class="katex-display">([\s\S]*?)<\/span>/g,
            '<div class="math-block"><span class="katex-display">$1</span></div>'
        );
        
        // Add styling to inline math
        content = content.replace(
            /<span class="katex">([\s\S]*?)<\/span>/g,
            '<span class="math-inline"><span class="katex">$1</span></span>'
        );
        
        // Handle error and plain text math spans
        content = content.replace(
            /<span class="math-error">([\s\S]*?)<\/span>/g,
            '<span class="math-error">$1</span>'
        );
        
        content = content.replace(
            /<span class="math-plain">([\s\S]*?)<\/span>/g,
            '<span class="math-plain">$1</span>'
        );
        
        return content;
    }

    /**
     * Process markdown content and render math expressions
     * @param {string} text - Markdown text to process
     * @returns {string} Processed HTML with rendered math
     */
    processContent(text) {
        if (!text) return '';
        
        console.warn('⚠️ EquationRenderer.processContent is DISABLED to prevent duplicate math rendering.');
        console.warn('⚠️ Math processing is now handled by mathBlockProcessor in enhancedContentProcessor.');
        
        // Return unprocessed text to prevent double processing
        return text;

        // Process display math expressions (double $$) - do this first
        text = text.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
            console.log('Found display math:', math);
            const rendered = this.renderMath(math.trim(), true);
            console.log('Rendered display math:', rendered.substring(0, 100) + '...');
            return `<div class="math-block power-enhanced"><span class="katex-display">${rendered}</span></div>`;
        });
        
        // Process inline math expressions (single $)
        text = text.replace(/\$([^$\n]+)\$/g, (match, math) => {
            console.log('Found inline math:', math);
            const rendered = this.renderMath(math.trim(), false);
            return `<span class="math-inline power-enhanced">${rendered}</span>`;
        });
        
        // Process LaTeX-style math blocks
        text = text.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, math) => {
            const rendered = this.renderMath(math.trim(), true);
            return `<div class="math-block power-enhanced"><span class="katex-display">${rendered}</span></div>`;
        });
        
        // Process LaTeX-style align blocks
        text = text.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, (match, math) => {
            const rendered = this.renderMath(math.trim(), true);
            return `<div class="math-block power-enhanced"><span class="katex-display">${rendered}</span></div>`;
        });
        
        console.log('✅ Content processing complete.');
        console.log('Final result:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        return text;
    }

    /**
     * Add custom math macro
     * @param {string} name - Macro name
     * @param {string} definition - Macro definition
     */
    addMacro(name, definition) {
        this.mathMacros[name] = definition;
    }

    /**
     * Remove custom math macro
     * @param {string} name - Macro name to remove
     */
    removeMacro(name) {
        delete this.mathMacros[name];
    }

    /**
     * Get all available macros
     * @returns {Object} Available macros
     */
    getMacros() {
        return { ...this.mathMacros };
    }

    /**
     * Validate math expression
     * @param {string} math - Math expression to validate
     * @returns {boolean} Whether the expression is valid
     */
    validateMath(math) {
        if (!this.isReady()) {
            return false;
        }
        
        try {
            katex.renderToString(math, {
                displayMode: false,
                throwOnError: true,
                strict: false,
                trust: true,
                macros: this.mathMacros
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Replace common power-equation shorthand with valid LaTeX.
     * This runs **before** KaTeX rendering so users can type simple plain-text
     * equations and still get beautiful output.
     */
    enhancePowerEquations(text) {
        if (!text) return text;
        this.powerEnhancements.forEach(({ regex, replacement }) => {
            text = text.replace(regex, replacement);
        });
        return text;
    }
}

/**
 * Equation Processing Mixin for LitElement components
 * Provides equation rendering functionality to components
 */
export const EquationMixin = (superClass) => class extends superClass {
    constructor() {
        super();
        this.equationRenderer = new EquationRenderer();
    }

    // _processMessageContent method removed - now handled by enhancedContentProcessor

    /**
     * Enhance math styling in content
     * @param {string} content - HTML content to enhance
     * @returns {string} Enhanced content
     */
    _enhanceMathStyling(content) {
        return this.equationRenderer.enhanceMathStyling(content);
    }

    /**
     * Render math expression
     * @param {string} math - Math expression
     * @param {boolean} display - Display mode
     * @returns {string} Rendered HTML
     */
    _renderMath(math, display = false) {
        return this.equationRenderer.renderMath(math, display);
    }

    /**
     * Validate math expression
     * @param {string} math - Math expression to validate
     * @returns {boolean} Whether valid
     */
    _validateMath(math) {
        return this.equationRenderer.validateMath(math);
    }
};

// Export singleton instance for global use
export const equationRenderer = new EquationRenderer();

// Export global functions for backward compatibility
window.isKaTeXReady = () => equationRenderer.isReady();
window.renderMath = (math, display = false) => equationRenderer.renderMath(math, display);
window.renderMathEnhanced = (math, options = {}) => equationRenderer.renderMathEnhanced(math, options);
