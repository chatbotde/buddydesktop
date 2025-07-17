# Math Equation Rendering with KaTeX

This document describes the implementation of math equation rendering using KaTeX in the Buddy desktop application.

## Overview

The math rendering system allows users to display mathematical equations in both inline and block formats using LaTeX syntax. The implementation uses KaTeX for fast, high-quality math rendering.

## Features

### ✅ Implemented Features

- **Inline Math**: Use `$...$` for inline mathematical expressions
- **Display Math**: Use `$$...$$` for centered block equations
- **Error Handling**: Graceful fallback for invalid LaTeX syntax
- **Responsive Design**: Math equations adapt to different screen sizes
- **Dark Theme Support**: Optimized styling for dark theme
- **Common Macros**: Pre-defined shortcuts for common mathematical symbols

### 📝 Supported Math Syntax

#### Basic Math
```latex
$x = 5$                    # Simple variable
$\pi = 3.14159...$         # Greek letters
$\frac{1}{2}$              # Fractions
$x^2 + y^2 = z^2$          # Exponents
```

#### Advanced Math
```latex
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$  # Integrals
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$              # Summation
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$      # Matrices
```

#### Pre-defined Macros
```latex
$\RR$    # Real numbers (ℝ)
$\NN$    # Natural numbers (ℕ)
$\ZZ$    # Integers (ℤ)
$\QQ$    # Rational numbers (ℚ)
$\CC$    # Complex numbers (ℂ)
$\PP$    # Probability (ℙ)
$\EE$    # Expected value (𝔼)
$\Var$   # Variance
$\Cov$   # Covariance
```

## Implementation Details

### File Structure

```
src/
├── katex-setup.js          # KaTeX loading and configuration
├── marked.min.js           # Enhanced markdown parser with math support
├── components/
│   └── buddy-chat-message.js  # Chat message rendering with math support
└── test-math-rendering.html   # Test page for math functionality
```

### Key Components

#### 1. KaTeX Setup (`katex-setup.js`)
- Loads KaTeX CSS and JavaScript from CDN
- Provides global utility functions
- Adds custom styling for math equations
- Handles loading errors gracefully

#### 2. Enhanced Markdown Parser (`marked.min.js`)
- Custom markdown parser with math support
- Processes math before other markdown elements
- Handles both inline and display math
- Provides error handling for invalid syntax

#### 3. Chat Message Component (`buddy-chat-message.js`)
- Integrates math rendering into chat messages
- Applies custom styling to math elements
- Handles post-processing of rendered content

### Styling

The math equations are styled to match the application's dark theme:

```css
/* Display math blocks */
.math-block {
    margin: 1em 0;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 0.5em;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Inline math */
.math-inline {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    padding: 0.1em 0.3em;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Usage Examples

### In Chat Messages

Users can include math in their messages:

```
The quadratic formula is: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

For a centered equation:
$$e^{i\pi} + 1 = 0$$

You can also mix text and math: The velocity $v$ is given by $v = \frac{dx}{dt}$
```

### AI Responses

The AI can respond with mathematical content:

```
The derivative of $f(x) = x^2$ is:
$$f'(x) = 2x$$

The probability of event A given B is:
$$P(A|B) = \frac{P(B|A)P(A)}{P(B)}$$
```

## Error Handling

The system includes robust error handling:

1. **Invalid LaTeX**: Shows the raw LaTeX with error styling
2. **Network Issues**: Falls back to plain text if KaTeX fails to load
3. **Syntax Errors**: Displays error messages in red
4. **Missing Dependencies**: Graceful degradation

## Testing

### Test Page
Open `test-math-rendering.html` in a browser to test all math rendering features.

### Test Cases
- Basic inline math: `$x = 5$`
- Complex equations: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`
- Error cases: `$\unrecognized{command}$`
- Mixed content: Text with inline math

## Performance Considerations

- **Lazy Loading**: KaTeX is loaded only when needed
- **Caching**: Rendered math is cached to avoid re-rendering
- **Error Boundaries**: Invalid math doesn't break the entire message
- **Responsive**: Math scales appropriately on different screen sizes

## Browser Compatibility

- ✅ Chrome/Chromium (Electron)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Future Enhancements

### Planned Features
- [ ] Math equation copying (copy as LaTeX)
- [ ] Math equation editing
- [ ] Math syntax highlighting
- [ ] Export math as images
- [ ] Math equation search

### Potential Improvements
- [ ] Local KaTeX installation (offline support)
- [ ] Custom math themes
- [ ] Math equation numbering
- [ ] Cross-references between equations

## Troubleshooting

### Common Issues

1. **Math not rendering**: Check if KaTeX loaded properly
2. **Styling issues**: Verify CSS is applied correctly
3. **Performance**: Large equations may take time to render
4. **Syntax errors**: Check LaTeX syntax validity

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug-math', 'true');
```

## Contributing

When adding new math features:

1. Test with various LaTeX syntax
2. Ensure responsive design
3. Add appropriate error handling
4. Update documentation
5. Test in different themes

## Dependencies

- **KaTeX**: Math rendering engine
- **Custom Markdown Parser**: Enhanced with math support
- **LitElement**: Component framework for chat messages

## License

This implementation follows the same license as the main Buddy application. 