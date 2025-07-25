/**
 * Math Module for Buddy Desktop
 * Centralized math rendering and processing functionality
 * 
 * This module consolidates all math-related functionality including:
 * - KaTeX setup and initialization
 * - Math block processing (display math, inline math, code blocks)
 * - Equation rendering and validation
 * - Math styling and themes
 */

// Core math processing
export { MathBlockProcessor, mathBlockProcessor } from './math-block-processor.js';
export { EquationRenderer, equationRenderer, EquationMixin } from './equation-renderer.js';
export { mathUtils } from './math-utils.js';
export { mathStyles } from './math-styles.js';

// KaTeX setup and initialization
export { katexSetup, initializeKaTeX, isKaTeXReady } from './katex-setup.js';

// Math configuration and constants
export { mathConfig } from './math-config.js';

/**
 * Initialize the complete math system
 * Call this once during app startup
 */
export async function initializeMathSystem() {
    try {
        // Initialize KaTeX
        await initializeKaTeX();
        
        // Inject math styles
        mathStyles.injectStyles();
        
        // Setup global math utilities
        mathUtils.setupGlobalUtilities();
        
        console.log('✅ Math system initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize math system:', error);
        return false;
    }
}

/**
 * Quick math rendering function
 * @param {string} math - Math expression to render
 * @param {Object} options - Rendering options
 * @returns {string} Rendered HTML
 */
export function renderMath(math, options = {}) {
    return equationRenderer.renderMath(math, options.display || false);
}

/**
 * Process content with math rendering
 * @param {string} content - Content to process
 * @returns {string} Processed content with rendered math
 */
export function processMathContent(content) {
    return mathBlockProcessor.processContent(content);
}

/**
 * Validate math expression
 * @param {string} math - Math expression to validate
 * @returns {boolean} True if valid
 */
export function validateMath(math) {
    return equationRenderer.validateMath(math);
} 