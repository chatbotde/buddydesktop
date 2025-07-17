# KaTeX Usage in Buddy Desktop

## Overview
Your Buddy Desktop app now supports beautiful mathematical equation rendering using KaTeX. Users can type LaTeX equations in chat messages and they will be automatically rendered as professional-looking mathematical expressions.

## How to Use

### 1. Block Equations (Centered)
Use double dollar signs `$$` for block equations:

```
$$\int e^x dx = e^x + C$$
```

This will render as a centered, beautifully formatted integral equation.

### 2. Inline Equations
Use single dollar signs `$` for inline equations:

```
The famous equation $E = mc^2$ was discovered by Einstein.
```

### 3. Common Examples

#### Basic Calculus
```
$$\frac{d}{dx}[x^n] = nx^{n-1}$$
```

#### Integrals
```
$$\int_a^b f(x) dx = F(b) - F(a)$$
```

#### Fractions
```
$$\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}$$
```

#### Matrices
```
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
```

#### Greek Letters
```
$$\alpha + \beta = \gamma$$
```

#### Summations
```
$$\sum_{i=1}^n i = \frac{n(n+1)}{2}$$
```

## Features

### Professional Styling
- Dark theme optimized
- Beautiful shadows and borders
- Responsive design
- Clean typography

### Error Handling
- Graceful fallback for invalid LaTeX
- Console logging for debugging
- Fallback to CDN if local files fail

### Performance
- Uses local KaTeX files for faster loading
- Optimized for Electron desktop environment
- Minimal overhead

## Technical Details

### File Structure
- `equations.js` - Main equation rendering system
- `buddy-chat-message.js` - Chat integration
- Local KaTeX files in `node_modules/katex/`

### Supported LaTeX Commands
All standard KaTeX commands are supported, including:
- Mathematical symbols
- Fractions and roots
- Integrals and summations
- Matrices and arrays
- Greek letters
- And much more!

## Testing

To test KaTeX functionality:
1. Open `test-katex-electron.html` in your Electron app
2. Check console for loading status
3. Verify equations render properly

## Troubleshooting

### Equations Not Rendering
1. Check browser console for errors
2. Verify KaTeX files are in node_modules
3. Ensure equations use proper LaTeX syntax

### Performance Issues
1. KaTeX loads from local files first
2. Falls back to CDN if local files fail
3. Check network connectivity if CDN fails

## Examples for Testing

Try typing these in your chat:

```
$$\int e^x dx = e^x + C$$
$$\frac{d}{dx}\left[\int_a^x f(t) dt\right] = f(x)$$
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
$$E = mc^2$$
$$\pi r^2$$
```

Each should render as beautiful mathematical expressions instead of raw LaTeX code! 