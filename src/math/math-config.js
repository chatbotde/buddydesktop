/**
 * Math Configuration Module
 * Central configuration for all math rendering settings
 */

export const mathConfig = {
    // KaTeX rendering options
    katex: {
        default: {
            displayMode: false,
            throwOnError: false,
            errorColor: '#ff6b6b',
            strict: false,
            trust: true,
            minRuleThickness: 0.04,
            colorIsTextColor: false,
            maxSize: Infinity,
            maxExpand: 1000,
            fleqn: false,
            leqno: false,
            output: 'html'
        },
        display: {
            displayMode: true,
            throwOnError: false,
            errorColor: '#ff6b6b',
            strict: false,
            trust: true,
            minRuleThickness: 0.04,
            colorIsTextColor: false,
            maxSize: Infinity,
            maxExpand: 1000,
            fleqn: false,
            leqno: false,
            output: 'html'
        }
    },

    // Math macros for common symbols
    macros: {
        // Number sets
        "\\RR": "\\mathbb{R}",
        "\\NN": "\\mathbb{N}",
        "\\ZZ": "\\mathbb{Z}",
        "\\QQ": "\\mathbb{Q}",
        "\\CC": "\\mathbb{C}",
        "\\PP": "\\mathbb{P}",
        "\\EE": "\\mathbb{E}",
        
        // Statistics
        "\\Var": "\\text{Var}",
        "\\Cov": "\\text{Cov}",
        "\\Corr": "\\text{Corr}",
        
        // Common functions
        "\\f": "f",
        "\\g": "g",
        "\\h": "h",
        
        // Enhanced symbols
        "\\hat": "\\widehat",
        "\\tilde": "\\widetilde",
        "\\bar": "\\overline",
        
        // Physics
        "\\hbar": "\\hslash",
        "\\ell": "\\l",
        
        // Common constants
        "\\e": "\\mathrm{e}",
        "\\i": "\\mathrm{i}",
        "\\pi": "\\pi",
        
        // Utility
        "\\relax": "",
        "\\macro": "\\text{macro}"
    },

    // Pattern recognition for different math types
    patterns: {
        displayMath: /\$\$([^$]+)\$\$/g,
        inlineMath: /\$([^$\n]+)\$/g,
        mathCodeBlock: /```(?:math|latex|tex)\n?([\s\S]*?)```/g,
        latexEnvironments: {
            equation: /\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g,
            align: /\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g,
            gather: /\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g,
            multline: /\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g,
            split: /\\begin\{split\*?\}([\s\S]*?)\\end\{split\*?\}/g,
            cases: /\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g,
            matrix: /\\begin\{(?:matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}([\s\S]*?)\\end\{(?:matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}/g
        }
    },

    // Power equations for user-friendly input
    powerEquations: [
        // Physics
        { regex: /\bE\s*=\s*mc\^?2\b/gi, replacement: 'E = mc^2', category: 'physics' },
        { regex: /\bF\s*=\s*ma\b/gi, replacement: 'F = ma', category: 'physics' },
        { regex: /\bE\s*=\s*h\*?f\b/gi, replacement: 'E = hf', category: 'physics' },
        { regex: /\bp\s*=\s*mv\b/gi, replacement: 'p = mv', category: 'physics' },
        
        // Mathematics
        { regex: /\ba\^?2\s*\+\s*b\^?2\s*=\s*c\^?2\b/gi, replacement: 'a^2 + b^2 = c^2', category: 'geometry' },
        { regex: /\bx\s*=\s*\(\s*-\s*b\s*\+\/?-\s*sqrt\(b\^?2\s*-\s*4\s*a\s*c\)\s*\)\s*\/\s*2\s*a\b/gi, replacement: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', category: 'algebra' },
        { regex: /\barea\s*=\s*pi\s*\*?\s*r\^?2\b/gi, replacement: 'A = \\pi r^2', category: 'geometry' },
        { regex: /\bcircumference\s*=\s*2\s*\*?\s*pi\s*\*?\s*r\b/gi, replacement: 'C = 2\\pi r', category: 'geometry' },
        
        // Calculus
        { regex: /\bd\/dx\s*\(\s*sin\s*x\s*\)\s*=\s*cos\s*x\b/gi, replacement: '\\frac{d}{dx}(\\sin x) = \\cos x', category: 'calculus' },
        { regex: /\bd\/dx\s*\(\s*cos\s*x\s*\)\s*=\s*-\s*sin\s*x\b/gi, replacement: '\\frac{d}{dx}(\\cos x) = -\\sin x', category: 'calculus' },
        
        // Statistics
        { regex: /\bmean\s*=\s*sum\s*x\s*\/\s*n\b/gi, replacement: '\\bar{x} = \\frac{\\sum x}{n}', category: 'statistics' },
        { regex: /\bvariance\s*=\s*sum\s*\(\s*x\s*-\s*mean\s*\)\^?2\s*\/\s*n\b/gi, replacement: '\\sigma^2 = \\frac{\\sum(x - \\bar{x})^2}{n}', category: 'statistics' }
    ],

    // CSS class mappings for different math types
    cssClasses: {
        mathBlock: 'math-block-container',
        mathBlockHeader: 'math-block-header',
        mathBlockContent: 'math-block-content',
        mathBlockRendered: 'math-block-rendered',
        mathBlockSource: 'math-block-source',
        mathInline: 'math-inline',
        mathError: 'math-error',
        mathPlain: 'math-plain',
        mathLoading: 'math-loading'
    },

    // Status indicators
    status: {
        success: { icon: '✅', class: 'success', color: '#4caf50' },
        error: { icon: '❌', class: 'error', color: '#f44336' },
        loading: { icon: '⏳', class: 'loading', color: '#ffc107' },
        processing: { icon: '🔄', class: 'processing', color: '#2196f3' }
    },

    // Performance settings
    performance: {
        cacheSize: 100,
        enableCaching: true,
        enableLogging: true,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        maxProcessingTime: 5000, // milliseconds
        chunkSize: 1000 // characters
    },

    // Feature flags
    features: {
        enablePowerEquations: true,
        enableMathBlocks: true,
        enableInlineMath: true,
        enableLaTeXEnvironments: true,
        enableMathCopy: true,
        enableMathToggle: true,
        enableMathPreview: true,
        enableMathValidation: true
    },

    // CDN fallback URLs
    cdn: {
        katexCSS: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
        katexJS: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
        katexFonts: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/fonts/'
    },

    // Local paths (for Electron)
    local: {
        katexCSS: '../node_modules/katex/dist/katex.min.css',
        katexJS: '../node_modules/katex/dist/katex.min.js',
        katexFonts: '../node_modules/katex/dist/fonts/'
    },

    // Error messages
    errors: {
        katexNotLoaded: 'KaTeX library is not loaded',
        invalidMath: 'Invalid mathematical expression',
        renderingFailed: 'Failed to render mathematical expression',
        timeout: 'Math rendering timed out',
        networkError: 'Failed to load math resources'
    },

    // Development settings
    development: {
        enableDebugLogging: process.env.NODE_ENV === 'development',
        enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
        enableMathInspector: process.env.NODE_ENV === 'development'
    }
};

/**
 * Get KaTeX options for specific rendering mode
 * @param {string} mode - Rendering mode ('default', 'display', 'inline')
 * @param {Object} overrides - Option overrides
 * @returns {Object} KaTeX options
 */
export function getKaTeXOptions(mode = 'default', overrides = {}) {
    const baseOptions = mathConfig.katex[mode] || mathConfig.katex.default;
    return {
        ...baseOptions,
        macros: { ...mathConfig.macros, ...(overrides.macros || {}) },
        ...overrides
    };
}

/**
 * Get power equation patterns by category
 * @param {string} category - Category filter ('physics', 'math', 'calculus', etc.)
 * @returns {Array} Filtered power equations
 */
export function getPowerEquations(category = null) {
    if (!category) return mathConfig.powerEquations;
    return mathConfig.powerEquations.filter(eq => eq.category === category);
}

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} True if enabled
 */
export function isFeatureEnabled(feature) {
    return mathConfig.features[feature] || false;
}

/**
 * Get error message
 * @param {string} errorType - Error type key
 * @returns {string} Error message
 */
export function getErrorMessage(errorType) {
    return mathConfig.errors[errorType] || 'Unknown error occurred';
}

/**
 * Update math configuration
 * @param {Object} updates - Configuration updates
 */
export function updateMathConfig(updates) {
    Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
            mathConfig[key] = { ...mathConfig[key], ...updates[key] };
        } else {
            mathConfig[key] = updates[key];
        }
    });
} 