/**
 * Unified Math Module for Buddy Desktop
 * Complete rewrite for consistent, mismatch-free math rendering
 * 
 * This module provides:
 * - Unified math processing pipeline
 * - Robust duplicate detection
 * - Consistent state management
 * - Better error handling
 * - Performance optimizations
 */

// New unified system
export { 
    UnifiedMathRenderer, 
    unifiedMathRenderer, 
    processMathContent, 
    isKaTeXReady, 
    clearMathCache, 
    getMathStats 
} from './unified-math-renderer.js';

export { UnifiedMathStyles, unifiedMathStyles } from './unified-math-styles.js';

// Legacy exports for backward compatibility (deprecated)
export { MathBlockProcessor, mathBlockProcessor } from './math-block-processor.js';
export { EquationRenderer, equationRenderer, EquationMixin } from './equation-renderer.js';
export { mathUtils } from './math-utils.js';
export { mathStyles } from './math-styles.js';
export { katexSetup, initializeKaTeX } from './katex-setup.js';
export { mathConfig } from './math-config.js';

/**
 * Initialize the unified math system
 * Call this once during app startup
 */
export async function initializeUnifiedMathSystem() {
    try {
        console.log('🧮 Initializing unified math system...');
        
        // Initialize the unified renderer (includes KaTeX loading)
        await unifiedMathRenderer.initializeKaTeX();
        
        // Inject unified styles
        unifiedMathStyles.injectStyles();
        
        // Setup global utilities
        window.processMathContent = processMathContent;
        window.isKaTeXReady = isKaTeXReady;
        window.clearMathCache = clearMathCache;
        window.getMathStats = getMathStats;
        
        console.log('✅ Unified math system initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize unified math system:', error);
        return false;
    }
}

/**
 * Legacy initialization function (deprecated)
 * Use initializeUnifiedMathSystem() instead
 */
export async function initializeMathSystem() {
    console.warn('⚠️ initializeMathSystem() is deprecated. Use initializeUnifiedMathSystem() instead.');
    return initializeUnifiedMathSystem();
}

/**
 * Quick math rendering function (unified)
 * @param {string} content - Content with math to process
 * @param {Object} options - Processing options
 * @returns {string} Processed content with rendered math
 */
export function renderMath(content, options = {}) {
    return processMathContent(content, options);
}

/**
 * Validate if content contains processable math
 * @param {string} content - Content to check
 * @returns {boolean} True if contains math
 */
export function containsMath(content) {
    if (!content) return false;
    
    const mathPatterns = [
        /\$\$[^$]+\$\$/,
        /\$[^$\n]+\$/,
        /```(?:math|latex|tex)/,
        /\\begin\{(?:equation|align|gather|multline|split|cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}/
    ];
    
    return mathPatterns.some(pattern => pattern.test(content));
}

/**
 * Legacy validate function (deprecated)
 */
export function validateMath(math) {
    console.warn('⚠️ validateMath() is deprecated. Use containsMath() instead.');
    return containsMath(math);
} 