/**
 * Unified Math Styles
 * Consistent styling for the unified math renderer
 */

export class UnifiedMathStyles {
    constructor() {
        this.stylesInjected = false;
        this.styleId = 'unified-math-styles';
    }

    /**
     * Inject all unified math styles
     */
    injectStyles() {
        if (this.stylesInjected || document.getElementById(this.styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = this.styleId;
        style.textContent = this.getStylesCSS();
        document.head.appendChild(style);
        
        this.stylesInjected = true;
        console.log('✅ Unified math styles injected');
    }

    /**
     * Get complete CSS styles
     */
    getStylesCSS() {
        return `
            /* Unified Math Block Containers */
            .math-block-container {
                margin: 1.5em 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .math-block-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                border-radius: 12px 12px 0 0;
                transition: background 0.3s ease;
            }

            .math-block-container.success::before {
                background: linear-gradient(90deg, #4caf50, #66bb6a);
            }

            .math-block-container.error::before {
                background: linear-gradient(90deg, #f44336, #ef5350);
            }

            .math-block-container.loading::before {
                background: linear-gradient(90deg, #ffc107, #ffca28);
                animation: pulse 2s ease-in-out infinite;
            }

            .math-block-container:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
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
                min-width: 16px;
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
                text-decoration: none;
            }

            .math-copy-btn:hover,
            .math-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            .math-copy-btn:active,
            .math-toggle-btn:active {
                transform: translateY(0);
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

            /* Inline Math Wrapper */
            .math-inline-wrapper {
                display: inline-block;
                padding: 0.2em 0.4em;
                margin: 0 0.1em;
                border-radius: 4px;
                font-size: 1.1em;
                vertical-align: middle;
                transition: all 0.2s ease;
                position: relative;
            }

            .math-inline-wrapper.success {
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.3);
            }

            .math-inline-wrapper.error {
                background: rgba(244, 67, 54, 0.1);
                border: 1px solid rgba(244, 67, 54, 0.3);
                color: #f44336;
                font-family: monospace;
            }

            .math-inline-wrapper.loading {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                color: #ffc107;
                font-family: monospace;
            }

            .math-inline-wrapper:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            /* Enhanced KaTeX Styling */
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

            /* KaTeX Display Math Enhancement */
            .katex-display {
                margin: 1.5em 0;
                text-align: center;
                position: relative;
                padding: 1em;
                background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            }

            .katex-display::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #007aff, #5856d6);
                border-radius: 8px 8px 0 0;
            }

            /* Inline KaTeX Enhancement */
            .math-inline-wrapper .katex {
                font-size: 1.1em;
                color: #e5e5e7;
            }

            /* Loading Animation */
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .math-block-container.loading .math-block-icon {
                animation: spin 1s linear infinite;
            }

            /* Responsive Design */
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

                .math-inline-wrapper {
                    font-size: 1em;
                }
            }

            /* Selection Styling */
            .math-block-container *::selection,
            .math-inline-wrapper *::selection {
                background: rgba(0, 122, 255, 0.3);
                color: inherit;
            }

            /* Focus Styling */
            .math-copy-btn:focus,
            .math-toggle-btn:focus {
                outline: 2px solid rgba(0, 122, 255, 0.5);
                outline-offset: 2px;
            }

            /* High Contrast Mode Support */
            @media (prefers-contrast: high) {
                .math-block-container {
                    border: 2px solid #ffffff;
                }

                .math-inline-wrapper {
                    border-width: 2px;
                }
            }

            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .math-block-container,
                .math-inline-wrapper,
                .math-copy-btn,
                .math-toggle-btn {
                    transition: none;
                }

                .math-block-container.loading .math-block-icon {
                    animation: none;
                }

                .math-block-container::before {
                    animation: none;
                }
            }

            /* Print Styles */
            @media print {
                .math-block-container {
                    box-shadow: none;
                    border: 1px solid #000;
                    background: white;
                }

                .math-block-header {
                    background: #f5f5f5;
                    color: #000;
                }

                .math-copy-btn,
                .math-toggle-btn {
                    display: none;
                }

                .math-block-rendered .katex {
                    color: #000 !important;
                    text-shadow: none;
                }
            }
        `;
    }

    /**
     * Remove styles
     */
    removeStyles() {
        const style = document.getElementById(this.styleId);
        if (style) {
            style.remove();
            this.stylesInjected = false;
            console.log('🧮 Unified math styles removed');
        }
    }

    /**
     * Update styles dynamically
     */
    updateStyles(customCSS) {
        const style = document.getElementById(this.styleId);
        if (style) {
            style.textContent = this.getStylesCSS() + '\n' + customCSS;
        }
    }
}

// Export singleton instance
export const unifiedMathStyles = new UnifiedMathStyles();