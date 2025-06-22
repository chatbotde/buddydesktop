// Load KaTeX CSS
const katexCSS = document.createElement('link');
katexCSS.rel = 'stylesheet';
katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
document.head.appendChild(katexCSS);

// Load KaTeX JavaScript
const katexScript = document.createElement('script');
katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
document.head.appendChild(katexScript);

// Add some basic styling for math equations
const style = document.createElement('style');
style.textContent = `
    .katex-display {
        margin: 1em 0;
        overflow-x: auto;
        overflow-y: hidden;
    }
    .katex {
        font-size: 1.1em;
    }
    .katex-inline {
        padding: 0 0.2em;
    }
`;
document.head.appendChild(style); 