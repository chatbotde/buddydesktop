/**
 * Test Math Rendering in Electron App
 * Run this in the DevTools console to test math rendering
 */

console.log('🧮 Testing Math Rendering in Electron App...');

// Test 1: Check if KaTeX is loaded
console.log('1. Checking KaTeX availability...');
if (typeof katex !== 'undefined') {
    console.log('✅ KaTeX is loaded!');
    console.log('   Version:', katex.version || 'Unknown');
} else {
    console.log('❌ KaTeX is not loaded');
    console.log('   This means the math will show as plain text');
}

// Test 2: Check equation renderer
console.log('2. Checking equation renderer...');
if (typeof window.equationRenderer !== 'undefined') {
    console.log('✅ Equation renderer is available');
    console.log('   Ready status:', window.equationRenderer.isReady());
} else {
    console.log('❌ Equation renderer is not available');
}

// Test 3: Test direct KaTeX rendering
if (typeof katex !== 'undefined') {
    console.log('3. Testing direct KaTeX rendering...');
    
    try {
        const testEquations = [
            { name: 'Simple equation', latex: 'E = mc^2' },
            { name: 'Fraction', latex: '\\frac{a}{b}' },
            { name: 'Integral', latex: '\\int_{0}^{1} x^2 dx' },
            { name: 'Matrix', latex: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}' }
        ];
        
        testEquations.forEach(eq => {
            try {
                const result = katex.renderToString(eq.latex, {
                    displayMode: false,
                    throwOnError: false
                });
                console.log(`   ✅ ${eq.name}: Rendered successfully`);
                
                // Create a visual test element
                const testDiv = document.createElement('div');
                testDiv.innerHTML = `<strong>${eq.name}:</strong> ${result}`;
                testDiv.style.cssText = `
                    margin: 5px 0;
                    padding: 10px;
                    background: rgba(0, 122, 255, 0.1);
                    border-radius: 4px;
                    border-left: 3px solid #007aff;
                `;
                
                // Add to a test container
                let testContainer = document.getElementById('math-test-container');
                if (!testContainer) {
                    testContainer = document.createElement('div');
                    testContainer.id = 'math-test-container';
                    testContainer.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        width: 300px;
                        max-height: 400px;
                        overflow-y: auto;
                        background: #2a2a2a;
                        color: #e5e5e7;
                        padding: 15px;
                        border-radius: 8px;
                        border: 1px solid #444;
                        z-index: 10000;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        font-size: 14px;
                    `;
                    
                    const title = document.createElement('h3');
                    title.textContent = '🧮 Math Rendering Test';
                    title.style.cssText = 'margin: 0 0 10px 0; color: #007aff;';
                    testContainer.appendChild(title);
                    
                    const closeBtn = document.createElement('button');
                    closeBtn.textContent = '×';
                    closeBtn.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: none;
                        border: none;
                        color: #888;
                        font-size: 20px;
                        cursor: pointer;
                        padding: 0;
                        width: 20px;
                        height: 20px;
                    `;
                    closeBtn.onclick = () => testContainer.remove();
                    testContainer.appendChild(closeBtn);
                    
                    document.body.appendChild(testContainer);
                }
                
                testContainer.appendChild(testDiv);
                
            } catch (error) {
                console.log(`   ❌ ${eq.name}: Failed -`, error.message);
            }
        });
        
    } catch (error) {
        console.log('❌ Direct rendering test failed:', error);
    }
}

// Test 4: Test content processing
console.log('4. Testing content processing...');
if (typeof window.equationRenderer !== 'undefined' && window.equationRenderer.isReady()) {
    const testContent = "The famous equation $E = mc^2$ shows the relationship between mass and energy. For display math: $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$";
    
    try {
        const processed = window.equationRenderer.processContent(testContent);
        console.log('✅ Content processing successful');
        console.log('   Original:', testContent);
        console.log('   Processed length:', processed.length);
        console.log('   Contains KaTeX HTML:', processed.includes('katex'));
        
        // Show processed result
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = processed;
        resultDiv.style.cssText = `
            margin: 10px 0;
            padding: 15px;
            background: rgba(76, 175, 80, 0.1);
            border-radius: 4px;
            border-left: 3px solid #4caf50;
        `;
        
        let testContainer = document.getElementById('math-test-container');
        if (testContainer) {
            const separator = document.createElement('hr');
            separator.style.cssText = 'border: none; border-top: 1px solid #444; margin: 15px 0;';
            testContainer.appendChild(separator);
            
            const title = document.createElement('div');
            title.textContent = 'Content Processing Result:';
            title.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #4caf50;';
            testContainer.appendChild(title);
            
            testContainer.appendChild(resultDiv);
        }
        
    } catch (error) {
        console.log('❌ Content processing failed:', error);
    }
} else {
    console.log('❌ Cannot test content processing - equation renderer not ready');
}

// Test 5: Check for existing math elements
console.log('5. Checking for existing math elements in the page...');
const mathSelectors = ['.katex', '.math-block', '.math-inline', '.math-error', '.math-plain'];
let totalMathElements = 0;

mathSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        console.log(`   Found ${elements.length} elements with selector: ${selector}`);
        totalMathElements += elements.length;
    }
});

if (totalMathElements === 0) {
    console.log('   No math elements found in the current page');
} else {
    console.log(`   Total math elements: ${totalMathElements}`);
}

console.log('🧮 Math rendering test complete!');
console.log('');
console.log('📋 Summary:');
console.log('- KaTeX loaded:', typeof katex !== 'undefined');
console.log('- Equation renderer ready:', typeof window.equationRenderer !== 'undefined' && window.equationRenderer.isReady());
console.log('- Math elements in page:', totalMathElements);
console.log('');
console.log('💡 To test math rendering:');
console.log('1. Type a message with math like: The equation $E = mc^2$ is famous');
console.log('2. Or display math: $$\\int x^2 dx = \\frac{x^3}{3} + C$$');
console.log('3. Check if it renders as proper mathematical notation');