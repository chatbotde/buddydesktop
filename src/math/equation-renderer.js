/**
 * Equation Renderer Module
 * Enhanced equation rendering with power equations support
 */

import { katexSetup } from './katex-setup.js';

export class EquationRenderer {
    constructor() {
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

        // Power equation enhancements for user-friendly input
        this.powerEnhancements = [
            { regex: /\bE\s*=\s*mc\^2\b/g, replacement: 'E = mc^2' },
            { regex: /\bF\s*=\s*ma\b/g, replacement: 'F = ma' },
            { regex: /\ba\^2\s*\+\s*b\^2\s*=\s*c\^2\b/g, replacement: 'a^2 + b^2 = c^2' },
            { regex: /\bx\s*=\s*\(\-b\s*\+\/\-\s*sqrt\(b\^2\s*\-\s*4ac\)\)\s*\/\s*2a\b/g, replacement: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
            // Add more power equations as needed
        ];
    }

    /**
     * Check if the renderer is ready
     */
    isReady() {
        return katexSetup.isKaTeXReady();
    }

    /**
     * Render math expression with KaTeX
     * @param {string} math - Math expression to render
     * @param {boolean} display - Display mode (block vs inline)
     * @returns {string} Rendered HTML
     */
    renderMath(math, display = false) {
        if (!math || math.trim() === '') {
            console.warn('⚠️ Empty math expression');
            return '';
        }

        // Enhance power equations first
        const enhancedMath = this.enhancePowerEquations(math);

        if (!this.isReady()) {
            console.warn('⚠️ KaTeX not ready, showing plain text');
            return `<span class="math-plain">${enhancedMath}</span>`;
        }
        
        try {
            console.log('✅ KaTeX is ready, rendering...');
            const result = katex.renderToString(enhancedMath.trim(), {
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
                console.warn('⚠️ KaTeX parsing error for:', enhancedMath);
                return `<span class="math-error" title="LaTeX parsing error">${enhancedMath}</span>`;
            }
            
            console.log('🎉 Math rendered successfully');
            return result;
        } catch (error) {
            console.error('❌ Math rendering error:', error);
            return `<span class="math-error" title="Rendering error: ${error.message}">${enhancedMath}</span>`;
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
            const enhancedMath = this.enhancePowerEquations(math);
            const result = katex.renderToString(enhancedMath, {
                displayMode: finalOptions.display,
                throwOnError: false,
                errorColor: '#ff6b6b',
                strict: false,
                trust: true,
                macros: this.mathMacros,
                minRuleThickness: 0.04,
                colorIsTextColor: false,
                maxSize: Infinity,
                maxExpand: 1000
            });
            
            if (result.includes('katex-error') || result.includes('ParseError')) {
                return `<span class="math-error">${enhancedMath}</span>`;
            }
            
            // Apply enhanced styling
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
     * @param {string} math - Math expression to validate
     * @returns {boolean} True if valid
     */
    validateMath(math) {
        if (!this.isReady()) {
            return false;
        }
        
        try {
            const enhancedMath = this.enhancePowerEquations(math);
            katex.renderToString(enhancedMath, {
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
        
        let enhanced = text;
        this.powerEnhancements.forEach(({ regex, replacement }) => {
            enhanced = enhanced.replace(regex, replacement);
        });
        
        return enhanced;
    }

    /**
     * Enhance math styling in content
     * @param {string} content - HTML content to enhance
     * @returns {string} Enhanced content
     */
    enhanceMathStyling(content) {
        if (!content) return content;
        
        // Add hover effects to math elements
        content = content.replace(
            /<span class="katex">/g,
            '<span class="katex math-hover-effect">'
        );
        
        // Add wrapper classes for better styling
        content = content.replace(
            /<span class="katex-display">/g,
            '<span class="katex-display math-display-enhanced">'
        );
        
        return content;
    }

    /**
     * Add power equation enhancement
     * @param {RegExp} regex - Pattern to match
     * @param {string} replacement - LaTeX replacement
     */
    addPowerEquation(regex, replacement) {
        this.powerEnhancements.push({ regex, replacement });
    }

    /**
     * Get available math macros
     * @returns {Object} Math macros object
     */
    getMathMacros() {
        return { ...this.mathMacros };
    }

    /**
     * Add custom math macro
     * @param {string} command - Macro command (e.g., "\\newcommand")
     * @param {string} replacement - Macro replacement
     */
    addMathMacro(command, replacement) {
        this.mathMacros[command] = replacement;
    }
}

/**
 * Equation Processing Mixin for LitElement components
 * Provides equation rendering functionality to components
 */
export const EquationMixin = (superClass) => class extends superClass {
    constructor() {
        super();
        this.equationRenderer = equationRenderer;
    }

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
     * @param {string} math - Math expression
     * @returns {boolean} True if valid
     */
    _validateMath(math) {
        return this.equationRenderer.validateMath(math);
    }
};

// Export singleton instance
export const equationRenderer = new EquationRenderer(); 