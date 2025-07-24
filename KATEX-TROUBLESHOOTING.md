# KaTeX Troubleshooting Guide

## Problem: Seeing LaTeX code instead of rendered math

If you're seeing raw LaTeX code like `$E = mc^2$` instead of properly rendered mathematical equations, follow these steps:

### Step 1: Check Browser Console

1. Open your Buddy app
2. Press `F12` or `Ctrl+Shift+I` to open Developer Tools
3. Go to the **Console** tab
4. Look for KaTeX-related messages

**Expected messages:**
```
🚀 Initializing KaTeX equation renderer...
🌐 Loading KaTeX from CDN for reliability...
✅ KaTeX CSS loaded from CDN
✅ KaTeX JS loaded successfully from CDN
🎉 KaTeX is ready from CDN!
```

**Problem indicators:**
```
❌ Failed to load KaTeX from CDN
⚠️ KaTeX not ready yet, showing plain text
❌ All KaTeX loading methods failed
```

### Step 2: Test KaTeX Loading

1. In the browser console, paste and run this command:
```javascript
console.log('KaTeX available:', typeof katex !== 'undefined');
if (typeof katex !== 'undefined') {
    console.log('KaTeX version:', katex.version);
    console.log('Test render:', katex.renderToString('E = mc^2', {displayMode: false, throwOnError: false}));
}
```

### Step 3: Manual KaTeX Test

1. Open `buddy/src/test-katex.html` in your browser
2. This will test different loading paths and show detailed results
3. Check if math renders properly in this test file

### Step 4: Debug Script

1. In the browser console, run:
```javascript
// Load and run the debug script
fetch('./debug-katex.js').then(r => r.text()).then(eval);
```

### Step 5: Common Fixes

#### Fix 1: Clear Browser Cache
1. Press `Ctrl+Shift+Delete`
2. Clear cached images and files
3. Restart the app

#### Fix 2: Check Internet Connection
KaTeX loads from CDN, so you need internet access:
```javascript
// Test CDN access
fetch('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js')
  .then(() => console.log('✅ CDN accessible'))
  .catch(() => console.log('❌ CDN not accessible'));
```

#### Fix 3: Force Reload KaTeX
Run this in the console:
```javascript
// Remove existing KaTeX
delete window.katex;
// Reload the equation renderer
if (window.equationRenderer) {
    window.equationRenderer.loadKaTeX();
}
```

#### Fix 4: Manual KaTeX Loading
If automatic loading fails, load manually:
```javascript
// Load KaTeX CSS
const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
document.head.appendChild(css);

// Load KaTeX JS
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
script.onload = () => {
    console.log('KaTeX loaded manually!');
    // Trigger re-render of messages
    window.dispatchEvent(new CustomEvent('katex-ready'));
};
document.head.appendChild(script);
```

### Step 6: Test Math Rendering

After KaTeX loads, test with these examples:

**Inline math:**
```
Type in chat: The equation $E = mc^2$ is famous.
```

**Display math:**
```
Type in chat: $$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

**Common equations:**
```
$x^2 + y^2 = z^2$
$\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}$
$\sum_{i=1}^n i = \frac{n(n+1)}{2}$
```

### Step 7: Check Message Processing

If KaTeX loads but math still doesn't render:

1. Check if messages are being processed:
```javascript
// Check if enhanced content processor is working
console.log('Enhanced processor:', typeof enhancedContentProcessor);
```

2. Test message processing directly:
```javascript
// Test processing a math message
const testText = "The equation $E = mc^2$ is important.";
const processed = enhancedContentProcessor.processContentSync(testText);
console.log('Processed:', processed);
```

### Step 8: Restart Application

If all else fails:
1. Close the Buddy app completely
2. Clear any cached data
3. Restart the application
4. Check console for loading messages

### Expected Behavior

When working correctly:
- Raw LaTeX like `$E = mc^2$` should render as formatted math
- Display math `$$...$$` should appear in centered blocks with styling
- Console should show successful KaTeX loading messages
- No "math-plain" or "math-error" spans should appear

### Getting Help

If the issue persists:
1. Copy all console messages (especially errors)
2. Note your operating system and browser version
3. Include the output from the debug script
4. Describe exactly what you see vs. what you expect

The math rendering should work automatically once KaTeX loads properly from the CDN.