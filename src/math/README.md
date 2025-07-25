# Math Module for Buddy Desktop

This module consolidates all math-related functionality for Buddy Desktop into a well-organized, centralized system.

## Module Structure

```
src/math/
├── index.js                 # Main module entry point
├── math-block-processor.js  # Math block processing (display math, code blocks)
├── equation-renderer.js     # Core equation rendering with power equations
├── katex-setup.js          # KaTeX loading and initialization
├── math-styles.js          # Centralized styling for all math components
├── math-utils.js           # Utility functions for math processing
├── math-config.js          # Configuration and constants
└── README.md               # This file
```

## Quick Start

### Basic Usage

```javascript
// Import the main math system
import { initializeMathSystem, processMathContent, renderMath } from './math/index.js';

// Initialize the system (call once during app startup)
await initializeMathSystem();

// Process content with math
const processedContent = processMathContent('Here is some math: $$E = mc^2$$');

// Render individual math expressions
const rendered = renderMath('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', { display: true });
```

### Component Integration

```javascript
// Import specific components
import { mathBlockProcessor } from './math/math-block-processor.js';
import { equationRenderer } from './math/equation-renderer.js';

// Use in your content processor
const processedContent = mathBlockProcessor.processContent(content);
```

## Features

### ✅ Fixed Math Duplication Issue
- **Single source of truth**: All math processing goes through `mathBlockProcessor`
- **Cache system**: Prevents duplicate processing of the same content
- **Duplicate detection**: Skips processing if math blocks already exist

### 🎨 Beautiful Math Rendering
- **Display Math**: `$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$`
- **Inline Math**: `$E = mc^2$`
- **Code Blocks**: ````math` or ````latex`
- **LaTeX Environments**: `\begin{equation}...\end{equation}`

### 🚀 Power Equations
User-friendly input gets automatically converted to proper LaTeX:
- `E = mc^2` → `E = mc^2`
- `F = ma` → `F = ma`
- `a^2 + b^2 = c^2` → `a^2 + b^2 = c^2`

### 🎛️ Interactive Features
- **Copy LaTeX**: Copy the original LaTeX source
- **Toggle View**: Switch between rendered and source view
- **Error Handling**: Graceful fallback for invalid expressions

## API Reference

### Main Functions

#### `initializeMathSystem()`
Initializes the complete math system including KaTeX loading and style injection.

#### `processMathContent(content)`
Processes content and renders all math expressions.

#### `renderMath(math, options)`
Renders a single math expression.

#### `validateMath(math)`
Validates if a math expression can be rendered.

### Configuration

```javascript
import { mathConfig, updateMathConfig } from './math/math-config.js';

// Update configuration
updateMathConfig({
    features: {
        enablePowerEquations: true,
        enableMathBlocks: true
    }
});
```

### Utilities

```javascript
import { mathUtils } from './math/math-utils.js';

// Extract math from content
const extracted = mathUtils.extractMath(content);

// Check if content has math
const hasMath = mathUtils.containsMath(content);

// Count math expressions
const count = mathUtils.countMath(content);
```

## Migration Guide

### From Old System

If you were using the old scattered math system:

**Before:**
```javascript
import { mathBlockProcessor } from './components/math-block-processor.js';
import { equationRenderer } from './components/equations.js';
```

**After:**
```javascript
import { mathBlockProcessor, equationRenderer } from './math/index.js';
// or
import { initializeMathSystem, processMathContent } from './math/index.js';
```

### Update Your Components

**Before:**
```javascript
import { mathBlockProcessor } from './components/math-block-processor.js';
```

**After:**
```javascript
import { mathBlockProcessor } from './math/math-block-processor.js';
```

## Performance

- **Caching**: Processed content is cached to prevent duplicate work
- **Lazy Loading**: KaTeX is loaded asynchronously with fallbacks
- **Duplicate Detection**: Smart detection prevents double processing
- **Optimized Rendering**: Only processes content that actually contains math

## Development

### Debugging

```javascript
// Enable debug logging
window.mathUtils.timeOperation('processing', () => {
    return processMathContent(content);
});

// Access global utilities
window.mathUtils.extractMath(content);
window.isKaTeXReady();
window.renderMath('E = mc^2');
```

### Adding New Features

1. **Add Power Equations**: Update `mathConfig.powerEquations`
2. **Add Macros**: Update `mathConfig.macros`
3. **Add Styles**: Extend `mathStyles` module
4. **Add Utilities**: Extend `mathUtils` module

## Troubleshooting

### Common Issues

1. **Math not rendering**: Check if `initializeMathSystem()` was called
2. **Double rendering**: Make sure old math imports are removed
3. **Styles missing**: Verify `mathStyles.injectStyles()` is called
4. **KaTeX errors**: Check browser console for specific LaTeX errors

### Debug Commands

```javascript
// Check if math system is ready
console.log('KaTeX ready:', window.isKaTeXReady());

// Test math rendering
console.log('Test render:', window.renderMath('E = mc^2'));

// Check math in content
console.log('Has math:', window.mathUtils.containsMath(content));
```

## Contributing

When adding new math functionality:

1. **Follow the module structure**: Place new features in appropriate files
2. **Update configuration**: Add new settings to `mathConfig`
3. **Add tests**: Create test cases for new functionality
4. **Update documentation**: Keep this README current

## License

This math module is part of Buddy Desktop and follows the same license terms. 