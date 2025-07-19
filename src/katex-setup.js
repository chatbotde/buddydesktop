// Load KaTeX CSS
const katexCSS = document.createElement('link');
katexCSS.rel = 'stylesheet';
katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
document.head.appendChild(katexCSS);

// Load KaTeX JavaScript
const katexScript = document.createElement('script');
katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
katexScript.onload = () => {
    console.log('KaTeX loaded successfully');
    // Trigger a custom event to notify that KaTeX is ready
    window.dispatchEvent(new CustomEvent('katex-ready'));
};
katexScript.onerror = () => {
    console.error('Failed to load KaTeX');
    // Trigger error event
    window.dispatchEvent(new CustomEvent('katex-error'));
};
document.head.appendChild(katexScript);

// Add enhanced styling for math equations with professional appearance
const style = document.createElement('style');
style.textContent = `
    /* KaTeX Display Math - Ultra Professional styling */
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
    
    /* KaTeX Inline Math - Enhanced styling */
    .katex {
        font-size: 1.1em;
        line-height: 1.4;
        font-weight: 400;
    }
    
    .katex-inline {
        padding: 0.2em 0.4em;
        vertical-align: middle;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    /* Math container styling - Professional appearance */
    .math-block {
        margin: 1.5em 0;
        text-align: center;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border-radius: 8px;
        padding: 1em;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
    }
    
    .math-block::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #007aff, #5856d6, #007aff);
    }
    
    .math-inline {
        background: rgba(255, 255, 255, 0.06);
        border-radius: 4px;
        padding: 0.2em 0.4em;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: inline-block;
        margin: 0 0.1em;
    }
    
    /* Enhanced error styling for invalid math */
    .math-error {
        color: #ff6b6b;
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
        border: 1px solid rgba(255, 107, 107, 0.3);
        border-radius: 4px;
        padding: 0.3em 0.6em;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.9em;
        box-shadow: 0 2px 4px rgba(255, 107, 107, 0.1);
    }
    
    /* Plain text fallback when KaTeX is not available */
    .math-plain {
        color: #e5e5e7;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 4px;
        padding: 0.3em 0.6em;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.9em;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    /* Enhanced KaTeX element styling */
    .katex-display .katex {
        color: #e5e5e7;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .katex-inline .katex {
        color: #e5e5e7;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    /* Responsive math with better scaling */
    @media (max-width: 768px) {
        .katex-display {
            font-size: 0.9em;
            margin: 1em 0;
            padding: 0.8em;
        }
        
        .katex {
            font-size: 1em;
        }
        
        .math-block {
            margin: 1em 0;
            padding: 0.8em;
        }
    }
    
    /* Hover effects for interactive elements */
    .math-block:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        transform: translateY(-1px);
        transition: all 0.2s ease;
    }
    
    .math-inline:hover {
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
    }
    
    /* Selection styling for math content */
    .katex-display::selection,
    .katex-inline::selection {
        background: rgba(0, 122, 255, 0.3);
    }
    
    /* Print-friendly styles */
    @media print {
        .math-block {
            background: white !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
        }
        
        .math-inline {
            background: white !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
        }
    }
`;
document.head.appendChild(style);

// Export a function to check if KaTeX is ready
window.isKaTeXReady = () => {
    return typeof katex !== 'undefined';
};

// Export a function to render math safely with enhanced options
window.renderMath = (math, display = false) => {
    if (!window.isKaTeXReady()) {
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
                "\\macro": "\\text{macro}"
            },
            minRuleThickness: 0.05,
            colorIsTextColor: false,
            maxSize: Infinity,
            maxExpand: 1000,
            strict: false
        });
        
        // Check if the result contains error indicators
        if (result.includes('katex-error') || result.includes('ParseError')) {
            console.warn('KaTeX parsing error for:', math);
            return `<span class="math-error">${math}</span>`;
        }
        
        return result;
    } catch (error) {
        console.error('Math rendering error:', error);
        return `<span class="math-error">${math}</span>`;
    }
};

// Enhanced math rendering with additional features
window.renderMathEnhanced = (math, options = {}) => {
    const defaultOptions = {
        display: false,
        fontSize: '1.1em',
        color: '#e5e5e7',
        backgroundColor: 'transparent',
        border: true,
        shadow: true
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    if (!window.isKaTeXReady()) {
        return `<span class="math-plain" style="font-size: ${finalOptions.fontSize}; color: ${finalOptions.color};">${math}</span>`;
    }
    
    try {
        const result = katex.renderToString(math, {
            displayMode: finalOptions.display,
            throwOnError: false,
            errorColor: '#ff6b6b',
            strict: false,
            trust: true,
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
                "\\macro": "\\text{macro}"
            }
        });
        
        if (result.includes('katex-error') || result.includes('ParseError')) {
            return `<span class="math-error">${math}</span>`;
        }
        
        return result;
    } catch (error) {
        return `<span class="math-error">${math}</span>`;
    }
};
