# Equation Rendering Examples

This document shows how to write mathematical equations that will render beautifully in Buddy Desktop, similar to the professional mathematical formatting shown in your reference image.

## Basic Integral Formulas

### Exponential Functions
```
$$\int e^x dx = e^x + C$$
```

```
$$\int a^x dx = \frac{a^x}{\ln a} + C \quad (a > 0, a \neq 1)$$
```

### Trigonometric Functions
```
$$\int \sin x dx = -\cos x + C$$
```

```
$$\int \cos x dx = \sin x + C$$
```

```
$$\int \sec^2 x dx = \tan x + C$$
```

```
$$\int \csc^2 x dx = -\cot x + C$$
```

```
$$\int \sec x \tan x dx = \sec x + C$$
```

## Integral Equations

### Fredholm Integral Equations

**First Kind:**
```
$$\int_a^b K(x, t) f(t) dt = g(x)$$
```

**Second Kind:**
```
$$f(x) = g(x) + \lambda \int_a^b K(x, t) f(t) dt$$
```

### Volterra Integral Equations

**First Kind:**
```
$$\int_a^x K(x, t) f(t) dt = g(x)$$
```

**Second Kind:**
```
$$f(x) = g(x) + \lambda \int_a^x K(x, t) f(t) dt$$
```

## Advanced Examples

### Definite Integrals
```
$$\int_0^{\infty} \frac{\sin x}{x} dx = \frac{\pi}{2}$$
```

```
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

### Fundamental Theorem of Calculus
```
$$\frac{d}{dx} \int_a^x f(t) dt = f(x)$$
```

### Complex Integrals
```
$$\int_0^{2\pi} e^{i\theta} d\theta = 0$$
```

```
$$\oint_C f(z) dz = 2\pi i \sum \text{Res}(f, z_k)$$
```

## Usage in Chat Messages

To use these equations in your chat messages, simply wrap them with `$$` for display equations:

**Input:**
```
The solution to the integral equation $$\int_0^x K(x,t)f(t)dt = g(x)$$ can be found using...
```

**For inline equations, use single `$`:**
```
The derivative $\frac{df}{dx}$ represents the rate of change.
```

## LaTeX-Style Environments

You can also use LaTeX-style equation environments:

```
\begin{equation}
\int_a^b f(x) dx = F(b) - F(a)
\end{equation}
```

```
\begin{align}
\int \sin x dx &= -\cos x + C \\
\int \cos x dx &= \sin x + C
\end{align}
```

## Tips for Beautiful Equations

1. **Use proper spacing**: `\quad` for medium spaces, `\,` for small spaces
2. **Use `\mathrm{}` for operators**: `\mathrm{d}x` instead of `dx`
3. **Use `\left` and `\right` for scalable brackets**: `\left(\frac{a}{b}\right)`
4. **Use `\frac{}{}` for fractions**: `\frac{numerator}{denominator}`
5. **Use `_{}` for subscripts and `^{}` for superscripts**
6. **Use `\int_{}^{}` for definite integrals with limits**

## Available Macros

The system includes these convenient macros:
- `\RR` → ℝ (real numbers)
- `\CC` → ℂ (complex numbers)
- `\NN` → ℕ (natural numbers)
- `\ZZ` → ℤ (integers)
- `\QQ` → ℚ (rational numbers)
- `\dx` → dx (differential)
- `\dt` → dt (differential)
- `\e` → e (Euler's number)
- `\i` → i (imaginary unit)

The equations will render with professional styling, including:
- Beautiful integral signs
- Proper fraction formatting
- Elegant spacing
- Professional typography
- Responsive design
- Dark theme compatibility 