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

// Add enhanced styling for math equations
const style = document.createElement('style');
style.textContent = `
    /* KaTeX Display Math */
    .katex-display {
        margin: 1em 0;
        overflow-x: auto;
        overflow-y: hidden;
        text-align: center;
        padding: 0.5em 0;
    }
    
    /* KaTeX Inline Math */
    .katex {
        font-size: 1.1em;
        line-height: 1.2;
    }
    
    .katex-inline {
        padding: 0 0.2em;
        vertical-align: middle;
    }
    
    /* Math container styling */
    .math-block {
        margin: 1em 0;
        text-align: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        padding: 0.5em;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .math-inline {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        padding: 0.1em 0.3em;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Error styling for invalid math */
    .math-error {
        color: #ff6b6b;
        background: rgba(255, 107, 107, 0.1);
        border: 1px solid rgba(255, 107, 107, 0.3);
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: monospace;
        font-size: 0.9em;
    }
    
    /* Plain text fallback when KaTeX is not available */
    .math-plain {
        color: #e5e5e7;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: monospace;
        font-size: 0.9em;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Responsive math */
    @media (max-width: 768px) {
        .katex-display {
            font-size: 0.9em;
            margin: 0.5em 0;
        }
        
        .katex {
            font-size: 1em;
        }
    }
    
    /* Dark theme adjustments */
    .katex-display .katex {
        color: #e5e5e7;
    }
    
    .katex-inline .katex {
        color: #e5e5e7;
    }
`;
document.head.appendChild(style);

// Export a function to check if KaTeX is ready
window.isKaTeXReady = () => {
    return typeof katex !== 'undefined';
};

// Export a function to render math safely
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
            macros: {
                "\\RR": "\\mathbb{R}",
                "\\NN": "\\mathbb{N}",
                "\\ZZ": "\\mathbb{Z}",
                "\\QQ": "\\mathbb{Q}",
                "\\CC": "\\mathbb{C}",
                "\\PP": "\\mathbb{P}",
                "\\EE": "\\mathbb{E}",
                "\\Var": "\\text{Var}",
                "\\Cov": "\\text{Cov}"
            }
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
