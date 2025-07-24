/**
 * KaTeX Debug Script
 * Run this in the browser console to debug KaTeX loading issues
 */

console.log('🔍 KaTeX Debug Script Starting...');

// Check if KaTeX is already loaded
console.log('1. Checking if KaTeX is already loaded...');
console.log('   typeof katex:', typeof katex);
if (typeof katex !== 'undefined') {
    console.log('   ✅ KaTeX is loaded!');
    console.log('   Version:', katex.version || 'Unknown');
} else {
    console.log('   ❌ KaTeX is not loaded');
}

// Check if equation renderer exists
console.log('2. Checking equation renderer...');
console.log('   typeof equationRenderer:', typeof equationRenderer);
console.log('   typeof window.equationRenderer:', typeof window.equationRenderer);

// Test math rendering if KaTeX is available
if (typeof katex !== 'undefined') {
    console.log('3. Testing math rendering...');
    
    try {
        const testMath = 'E = mc^2';
        const result = katex.renderToString(testMath, {
            displayMode: false,
            throwOnError: false
        });
        console.log('   ✅ Test render successful:', result.substring(0, 50) + '...');
        
        // Create a test element to show the result
        const testDiv = document.createElement('div');
        testDiv.innerHTML = `
            <h3>KaTeX Test Results:</h3>
            <p>Inline: ${result}</p>
            <div style="margin: 20px 0;">${katex.renderToString('\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}', { displayMode: true, throwOnError: false })}</div>
        `;
        testDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2a2a2a;
            color: #e5e5e7;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #444;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(testDiv);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (testDiv.parentNode) {
                testDiv.parentNode.removeChild(testDiv);
            }
        }, 10000);
        
    } catch (error) {
        console.log('   ❌ Test render failed:', error);
    }
} else {
    console.log('3. Attempting to load KaTeX...');
    
    // Try to load KaTeX manually
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = () => {
        console.log('   ✅ KaTeX loaded from CDN!');
        console.log('   Version:', katex.version || 'Unknown');
        
        // Test rendering
        try {
            const result = katex.renderToString('E = mc^2', { displayMode: false, throwOnError: false });
            console.log('   ✅ Test render after manual load:', result.substring(0, 50) + '...');
        } catch (error) {
            console.log('   ❌ Test render failed after manual load:', error);
        }
    };
    script.onerror = () => {
        console.log('   ❌ Failed to load KaTeX from CDN');
    };
    document.head.appendChild(script);
    
    // Also load CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(css);
}

// Check for existing math elements in the page
console.log('4. Checking for existing math elements...');
const mathElements = document.querySelectorAll('.katex, .math-block, .math-inline, .math-error, .math-plain');
console.log(`   Found ${mathElements.length} math-related elements`);
mathElements.forEach((el, i) => {
    console.log(`   Element ${i + 1}:`, el.className, el.textContent.substring(0, 50));
});

// Check for dollar sign patterns in text content
console.log('5. Checking for unprocessed math patterns...');
const textNodes = [];
const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
);

let node;
while (node = walker.nextNode()) {
    if (node.textContent.includes('$')) {
        textNodes.push(node);
    }
}

console.log(`   Found ${textNodes.length} text nodes containing '$'`);
textNodes.forEach((node, i) => {
    console.log(`   Text node ${i + 1}:`, node.textContent.substring(0, 100));
});

console.log('🔍 KaTeX Debug Script Complete!');