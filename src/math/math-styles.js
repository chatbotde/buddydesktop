/**
 * Math Styles Module
 * Centralized styling for all math rendering components
 */

export class MathStyles {
    constructor() {
        this.stylesInjected = false;
    }

    /**
     * Inject all math-related styles
     */
    injectStyles() {
        if (this.stylesInjected) return;

        this.injectMathBlockStyles();
        this.injectKaTeXStyles();
        this.injectInlineStyles();
        
        this.stylesInjected = true;
        console.log('✅ Math styles injected successfully');
    }

    /**
     * Inject math block styles
     */
    injectMathBlockStyles() {
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

    /**
     * Inject inline math styles
     */
    injectInlineStyles() {
        if (document.getElementById('math-inline-styles')) return;

        const style = document.createElement('style');
        style.id = 'math-inline-styles';
        style.textContent = `
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

            /* Error and plain text styling */
            .math-error {
                background: rgba(244, 67, 54, 0.1);
                border: 1px solid rgba(244, 67, 54, 0.3);
                color: #f44336;
                padding: 0.2em 0.4em;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.9em;
            }

            .math-plain {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                color: #ffc107;
                padding: 0.2em 0.4em;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.9em;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Inject enhanced KaTeX styles
     */
    injectKaTeXStyles() {
        if (document.getElementById('math-katex-styles')) return;

        const style = document.createElement('style');
        style.id = 'math-katex-styles';
        style.textContent = `
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

            /* KaTeX Display Math - Professional styling */
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

            /* KaTeX Inline Math - Enhanced styling */
            .katex {
                font-size: 1.1em;
                color: #e5e5e7;
            }

            .katex-inline {
                padding: 0.1em 0.3em;
                background: rgba(0, 122, 255, 0.1);
                border-radius: 3px;
                border: 1px solid rgba(0, 122, 255, 0.2);
            }

            /* Selection styling for math content */
            .katex-display::selection,
            .katex-inline::selection {
                background: rgba(0, 122, 255, 0.3);
                color: inherit;
            }

            /* Responsive math scaling */
            @media (max-width: 768px) {
                .katex-display {
                    margin: 1em 0;
                    padding: 0.8em;
                }

                .katex {
                    font-size: 1em;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Remove all math styles (for cleanup)
     */
    removeStyles() {
        const styleIds = ['math-block-styles', 'math-inline-styles', 'math-katex-styles'];
        styleIds.forEach(id => {
            const style = document.getElementById(id);
            if (style) {
                style.remove();
            }
        });
        this.stylesInjected = false;
    }
}

// Export singleton instance
export const mathStyles = new MathStyles(); 