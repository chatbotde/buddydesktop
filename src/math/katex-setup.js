/**
 * KaTeX Setup and Configuration Module
 * Handles KaTeX loading, initialization, and configuration
 */

export class KaTeXSetup {
    constructor() {
        this.isReady = false;
        this.loadPromise = null;
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
            "\\macro": "\\text{macro}"
        };
    }

    /**
     * Initialize KaTeX with proper loading and fallback
     */
    async initialize() {
        if (this.isReady) return true;
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = this._loadKaTeX();
        return this.loadPromise;
    }

    /**
     * Private method to load KaTeX
     */
    async _loadKaTeX() {
        try {
            // Check if KaTeX is already available
            if (typeof katex !== 'undefined') {
                this.isReady = true;
                this._setupGlobalUtilities();
                console.log('✅ KaTeX already available');
                return true;
            }

            // Load KaTeX CSS
            await this._loadCSS();
            
            // Load KaTeX JavaScript
            await this._loadJS();
            
            // Setup global utilities
            this._setupGlobalUtilities();
            
            this.isReady = true;
            console.log('✅ KaTeX loaded and initialized successfully');
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('katex-ready'));
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load KaTeX:', error);
            window.dispatchEvent(new CustomEvent('katex-error', { detail: error }));
            return false;
        }
    }

    /**
     * Load KaTeX CSS
     */
    _loadCSS() {
        return new Promise((resolve, reject) => {
            // Check if CSS is already loaded
            if (document.querySelector('link[href*="katex"]')) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            
            // Try local first (Electron), then CDN fallback
            const localPath = '../node_modules/katex/dist/katex.min.css';
            const cdnPath = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            
            link.href = localPath;
            link.onload = resolve;
            link.onerror = () => {
                // Fallback to CDN
                link.href = cdnPath;
                link.onload = resolve;
                link.onerror = reject;
            };
            
            document.head.appendChild(link);
        });
    }

    /**
     * Load KaTeX JavaScript
     */
    _loadJS() {
        return new Promise((resolve, reject) => {
            // Check if KaTeX is already loaded
            if (typeof katex !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            
            // Try local first (Electron), then CDN fallback
            const localPath = '../node_modules/katex/dist/katex.min.js';
            const cdnPath = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
            
            script.src = localPath;
            script.onload = resolve;
            script.onerror = () => {
                // Fallback to CDN
                script.src = cdnPath;
                script.onload = resolve;
                script.onerror = reject;
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Setup global utilities for KaTeX
     */
    _setupGlobalUtilities() {
        // Export KaTeX ready check
        window.isKaTeXReady = () => this.isReady;
        
        // Export safe math rendering function
        window.renderMath = (math, display = false) => {
            return this.renderMath(math, display);
        };

        // Export enhanced math rendering
        window.renderMathEnhanced = (math, options = {}) => {
            return this.renderMathEnhanced(math, options);
        };
    }

    /**
     * Render math with KaTeX safely
     */
    renderMath(math, display = false) {
        if (!this.isReady || typeof katex === 'undefined') {
            console.warn('KaTeX not ready yet');
            return `<span class="math-plain">${math}</span>`;
        }

        try {
            const result = katex.renderToString(math, {
                displayMode: display,
                throwOnError: false,
                errorColor: '#ff6b6b',
                strict: false,
                trust: true,
                macros: this.mathMacros,
                minRuleThickness: 0.05,
                colorIsTextColor: false,
                maxSize: Infinity,
                maxExpand: 1000
            });

            // Check if the result contains error indicators
            if (result.includes('katex-error') || result.includes('ParseError')) {
                console.warn('KaTeX parsing error for:', math);
                return `<span class="math-error">${math}</span>`;
            }

            return result;
        } catch (error) {
            console.error('KaTeX rendering error:', error);
            return `<span class="math-error">${math}</span>`;
        }
    }

    /**
     * Enhanced math rendering with additional options
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

        if (!this.isReady) {
            return `<span class="math-plain" style="font-size: ${finalOptions.fontSize}; color: ${finalOptions.color};">${math}</span>`;
        }

        try {
            const result = katex.renderToString(math, {
                displayMode: finalOptions.display,
                throwOnError: false,
                errorColor: '#ff6b6b',
                strict: false,
                trust: true,
                macros: this.mathMacros,
                minRuleThickness: 0.05,
                colorIsTextColor: false,
                maxSize: Infinity,
                maxExpand: 1000
            });

            // Check for errors
            if (result.includes('katex-error') || result.includes('ParseError')) {
                return `<span class="math-error">${math}</span>`;
            }

            // Wrap with enhanced styling
            const styleAttributes = [
                `font-size: ${finalOptions.fontSize}`,
                `color: ${finalOptions.color}`,
                `background: ${finalOptions.backgroundColor}`
            ];

            if (finalOptions.border) {
                styleAttributes.push('border: 1px solid rgba(255, 255, 255, 0.1)');
                styleAttributes.push('border-radius: 4px');
                styleAttributes.push('padding: 0.2em 0.4em');
            }

            if (finalOptions.shadow) {
                styleAttributes.push('text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)');
            }

            return `<span class="math-enhanced" style="${styleAttributes.join('; ')}">${result}</span>`;
        } catch (error) {
            console.error('Enhanced math rendering error:', error);
            return `<span class="math-error">${math}</span>`;
        }
    }

    /**
     * Validate if a math expression can be rendered
     */
    validateMath(math) {
        if (!this.isReady || typeof katex === 'undefined') {
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
     * Check if KaTeX is ready
     */
    isKaTeXReady() {
        return this.isReady && typeof katex !== 'undefined';
    }
}

// Export singleton instance
export const katexSetup = new KaTeXSetup();

// Export convenience functions
export const initializeKaTeX = () => katexSetup.initialize();
export const isKaTeXReady = () => katexSetup.isKaTeXReady();
export const renderMath = (math, display) => katexSetup.renderMath(math, display);
export const validateMath = (math) => katexSetup.validateMath(math); 