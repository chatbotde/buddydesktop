# 🧮 Math Blocks Guide - Buddy Desktop

## Overview

The new Math Blocks system provides beautiful, code-block-style rendering for mathematical expressions. Just like code blocks, math blocks have headers, copy buttons, and source toggle functionality.

## Math Block Types

### 1. Math Code Blocks
Use ````math` or ````latex` for dedicated math blocks:

**Input:**
```
```math
E = mc^2
```
```

**Result:** Beautiful math block with header, copy button, and toggle functionality.

### 2. Display Math ($$...$$)
Traditional LaTeX display math:

**Input:**
```
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

**Result:** Centered math block with professional styling.

### 3. Inline Math ($...$)
Math within text:

**Input:**
```
The equation $E = mc^2$ is Einstein's famous formula.
```

**Result:** Inline math with subtle background and hover effects.

### 4. LaTeX Environments
Standard LaTeX environments:

**Input:**
```
\begin{equation}
\sum_{i=1}^n i = \frac{n(n+1)}{2}
\end{equation}
```

**Result:** Professional equation block with environment label.

## Features

### 🎨 Beautiful Styling
- **Glass-morphism design** with blur effects
- **Gradient backgrounds** and shadows
- **Hover animations** and transitions
- **Status indicators** (✅ success, ❌ error, ⏳ loading)

### 📋 Copy Functionality
- **Copy LaTeX source** with one click
- **Visual feedback** when copied
- **Preserves original formatting**

### 🔄 Source Toggle
- **Switch between rendered and source** views
- **Syntax highlighting** for LaTeX source
- **Easy debugging** of complex expressions

### 📱 Responsive Design
- **Mobile-friendly** layouts
- **Adaptive font sizes**
- **Touch-friendly** buttons

## Examples

### Basic Math
```
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.
```

### Complex Expressions
```math
\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
\begin{bmatrix}
x \\ y
\end{bmatrix}
=
\begin{bmatrix}
x\cos\theta - y\sin\theta \\
x\sin\theta + y\cos\theta
\end{bmatrix}
```

### Multiple Equations
```latex
\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{align}
```

### Mixed Content
```
Here's some analysis of the function $f(x) = x^2$:

```javascript
function quadratic(x) {
    return x * x;
}
```

The derivative is:

```math
f'(x) = 2x
```

And the integral is $\int x^2 dx = \frac{x^3}{3} + C$.
```

## Supported LaTeX

### Basic Math
- **Fractions:** `\frac{a}{b}`
- **Powers:** `x^2`, `x^{n+1}`
- **Subscripts:** `x_i`, `x_{i,j}`
- **Roots:** `\sqrt{x}`, `\sqrt[n]{x}`

### Advanced Features
- **Matrices:** `\begin{pmatrix}...\end{pmatrix}`
- **Integrals:** `\int`, `\iint`, `\iiint`
- **Summations:** `\sum_{i=1}^n`
- **Limits:** `\lim_{x \to \infty}`
- **Greek letters:** `\alpha`, `\beta`, `\gamma`
- **Operators:** `\sin`, `\cos`, `\log`

### Environments
- `equation`, `equation*`
- `align`, `align*`
- `gather`, `gather*`
- `multline`, `multline*`
- `split`

## Testing

### Quick Test
1. Open your Buddy app
2. Type a message with math: `The equation $E = mc^2$ is famous.`
3. Send the message
4. You should see properly rendered math!

### Comprehensive Test
1. Open `buddy/src/test-math-blocks.html` in your app
2. Click "🚀 Run All Tests"
3. See all math block types in action

### Console Test
```javascript
// Test in browser console
fetch('./test-math-rendering.js').then(r => r.text()).then(eval);
```

## Troubleshooting

### Math Not Rendering
1. **Check KaTeX status:**
   ```javascript
   console.log('KaTeX:', typeof katex !== 'undefined');
   ```

2. **Check console for errors**
3. **Try the test file:** `test-math-blocks.html`

### Copy/Toggle Not Working
1. **Check if buttons appear** in math blocks
2. **Look for JavaScript errors** in console
3. **Ensure chat message component** is updated

### Styling Issues
1. **Check if styles are injected**
2. **Look for CSS conflicts**
3. **Try refreshing the app**

## Implementation Details

### Files Modified
- `buddy/src/components/math-block-processor.js` - Main math block system
- `buddy/src/components/enhanced-content-processor.js` - Integration
- `buddy/src/components/buddy-chat-message.js` - Copy/toggle functionality

### How It Works
1. **Content Processing:** Math patterns are detected and processed
2. **KaTeX Rendering:** LaTeX is converted to HTML
3. **Block Creation:** Math is wrapped in styled containers
4. **Interaction:** Copy and toggle functionality is added

### Performance
- **Lazy Loading:** KaTeX loads only when needed
- **Caching:** Rendered math is cached
- **Error Handling:** Graceful fallbacks for invalid math

## Best Practices

### For Users
- Use ````math` for complex, multi-line expressions
- Use `$$...$$` for important display equations
- Use `$...$` for simple inline math
- Check the source view if rendering looks wrong

### For Developers
- Always check KaTeX readiness before rendering
- Provide fallbacks for loading/error states
- Use semantic HTML structure
- Include accessibility features

The new Math Blocks system makes mathematical communication in Buddy Desktop both beautiful and functional! 🎉