/**
 * Math Utilities Module
 * Helper functions for math processing and manipulation
 */

export class MathUtils {
    constructor() {
        this.commonPatterns = {
            displayMath: /\$\$([^$]+)\$\$/g,
            inlineMath: /\$([^$\n]+)\$/g,
            mathCodeBlock: /```(?:math|latex|tex)\n?([\s\S]*?)```/g,
            latexEnvironment: /\\begin\{(\w+)\*?\}([\s\S]*?)\\end\{\1\*?\}/g
        };
    }

    /**
     * Extract all math expressions from content
     * @param {string} content - Content to analyze
     * @returns {Object} Extracted math expressions
     */
    extractMath(content) {
        if (!content) return { displayMath: [], inlineMath: [], codeBlocks: [], environments: [] };

        const results = {
            displayMath: [],
            inlineMath: [],
            codeBlocks: [],
            environments: []
        };

        // Extract display math
        let match;
        while ((match = this.commonPatterns.displayMath.exec(content)) !== null) {
            results.displayMath.push({
                full: match[0],
                math: match[1],
                index: match.index
            });
        }

        // Extract inline math
        while ((match = this.commonPatterns.inlineMath.exec(content)) !== null) {
            results.inlineMath.push({
                full: match[0],
                math: match[1],
                index: match.index
            });
        }

        // Extract math code blocks
        while ((match = this.commonPatterns.mathCodeBlock.exec(content)) !== null) {
            results.codeBlocks.push({
                full: match[0],
                math: match[1],
                index: match.index
            });
        }

        // Extract LaTeX environments
        while ((match = this.commonPatterns.latexEnvironment.exec(content)) !== null) {
            results.environments.push({
                full: match[0],
                environment: match[1],
                math: match[2],
                index: match.index
            });
        }

        return results;
    }

    /**
     * Check if content contains math expressions
     * @param {string} content - Content to check
     * @returns {boolean} True if math found
     */
    containsMath(content) {
        if (!content) return false;

        return this.commonPatterns.displayMath.test(content) ||
               this.commonPatterns.inlineMath.test(content) ||
               this.commonPatterns.mathCodeBlock.test(content) ||
               this.commonPatterns.latexEnvironment.test(content);
    }

    /**
     * Count math expressions in content
     * @param {string} content - Content to analyze
     * @returns {Object} Count statistics
     */
    countMath(content) {
        const extracted = this.extractMath(content);
        return {
            displayMath: extracted.displayMath.length,
            inlineMath: extracted.inlineMath.length,
            codeBlocks: extracted.codeBlocks.length,
            environments: extracted.environments.length,
            total: extracted.displayMath.length + extracted.inlineMath.length + 
                   extracted.codeBlocks.length + extracted.environments.length
        };
    }

    /**
     * Replace math expressions with placeholders
     * @param {string} content - Content to process
     * @param {string} placeholder - Placeholder pattern
     * @returns {Object} Content with placeholders and extraction map
     */
    replaceMathWithPlaceholders(content, placeholder = '__MATH_PLACEHOLDER_') {
        if (!content) return { content, mathMap: new Map() };

        const mathMap = new Map();
        let processedContent = content;
        let placeholderIndex = 0;

        // Replace display math
        processedContent = processedContent.replace(this.commonPatterns.displayMath, (match) => {
            const placeholderKey = `${placeholder}${placeholderIndex++}__`;
            mathMap.set(placeholderKey, match);
            return placeholderKey;
        });

        // Replace inline math (be careful not to match display math)
        processedContent = processedContent.replace(/(?<!\$)\$([^$\n]+)\$(?!\$)/g, (match) => {
            const placeholderKey = `${placeholder}${placeholderIndex++}__`;
            mathMap.set(placeholderKey, match);
            return placeholderKey;
        });

        // Replace math code blocks
        processedContent = processedContent.replace(this.commonPatterns.mathCodeBlock, (match) => {
            const placeholderKey = `${placeholder}${placeholderIndex++}__`;
            mathMap.set(placeholderKey, match);
            return placeholderKey;
        });

        // Replace LaTeX environments
        processedContent = processedContent.replace(this.commonPatterns.latexEnvironment, (match) => {
            const placeholderKey = `${placeholder}${placeholderIndex++}__`;
            mathMap.set(placeholderKey, match);
            return placeholderKey;
        });

        return { content: processedContent, mathMap };
    }

    /**
     * Restore math expressions from placeholders
     * @param {string} content - Content with placeholders
     * @param {Map} mathMap - Map of placeholders to math expressions
     * @returns {string} Content with restored math
     */
    restoreMathFromPlaceholders(content, mathMap) {
        if (!content || !mathMap) return content;

        let restoredContent = content;
        mathMap.forEach((mathExpression, placeholder) => {
            restoredContent = restoredContent.replace(placeholder, mathExpression);
        });

        return restoredContent;
    }

    /**
     * Escape LaTeX special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeLaTeX(text) {
        if (!text) return text;

        const escapeMap = {
            '\\': '\\textbackslash{}',
            '{': '\\{',
            '}': '\\}',
            '$': '\\$',
            '&': '\\&',
            '%': '\\%',
            '#': '\\#',
            '^': '\\textasciicircum{}',
            '_': '\\_',
            '~': '\\textasciitilde{}'
        };

        return text.replace(/[\\{}$&%#^_~]/g, (char) => escapeMap[char] || char);
    }

    /**
     * Unescape LaTeX special characters
     * @param {string} text - Text to unescape
     * @returns {string} Unescaped text
     */
    unescapeLaTeX(text) {
        if (!text) return text;

        const unescapeMap = {
            '\\textbackslash\\{\\}': '\\',
            '\\\\\\{': '{',
            '\\\\\\}': '}',
            '\\\\\\$': '$',
            '\\\\&': '&',
            '\\\\%': '%',
            '\\\\#': '#',
            '\\\\textasciicircum\\{\\}': '^',
            '\\\\_': '_',
            '\\\\textasciitilde\\{\\}': '~'
        };

        let result = text;
        Object.entries(unescapeMap).forEach(([escaped, original]) => {
            result = result.replace(new RegExp(escaped, 'g'), original);
        });

        return result;
    }

    /**
     * Normalize math expression (remove extra whitespace, etc.)
     * @param {string} math - Math expression to normalize
     * @returns {string} Normalized math
     */
    normalizeMath(math) {
        if (!math) return math;

        return math
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\s*([+\-*/=<>])\s*/g, '$1')
            .replace(/\s*([(){}[\]])\s*/g, '$1');
    }

    /**
     * Generate a unique ID for math expressions
     * @param {string} prefix - ID prefix
     * @returns {string} Unique ID
     */
    generateMathId(prefix = 'math') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Check if a string is a valid LaTeX command
     * @param {string} command - Command to check
     * @returns {boolean} True if valid
     */
    isValidLaTeXCommand(command) {
        if (!command) return false;
        return /^\\[a-zA-Z]+(\*)?$/.test(command);
    }

    /**
     * Extract LaTeX commands from math expression
     * @param {string} math - Math expression
     * @returns {Array} Array of commands found
     */
    extractLaTeXCommands(math) {
        if (!math) return [];

        const commandPattern = /\\[a-zA-Z]+(\*)?/g;
        const commands = [];
        let match;

        while ((match = commandPattern.exec(math)) !== null) {
            commands.push(match[0]);
        }

        return [...new Set(commands)]; // Remove duplicates
    }

    /**
     * Setup global math utilities on window object
     */
    setupGlobalUtilities() {
        // Export utilities to global scope for debugging/development
        window.mathUtils = {
            extractMath: this.extractMath.bind(this),
            containsMath: this.containsMath.bind(this),
            countMath: this.countMath.bind(this),
            normalizeMath: this.normalizeMath.bind(this),
            escapeLaTeX: this.escapeLaTeX.bind(this),
            unescapeLaTeX: this.unescapeLaTeX.bind(this)
        };

        console.log('✅ Math utilities available globally via window.mathUtils');
    }

    /**
     * Performance timing helper for math operations
     * @param {string} operation - Operation name
     * @param {Function} fn - Function to time
     * @returns {*} Function result
     */
    async timeOperation(operation, fn) {
        const start = performance.now();
        try {
            const result = await fn();
            const end = performance.now();
            console.log(`⏱️ Math operation '${operation}' took ${(end - start).toFixed(2)}ms`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.error(`❌ Math operation '${operation}' failed after ${(end - start).toFixed(2)}ms:`, error);
            throw error;
        }
    }
}

// Export singleton instance
export const mathUtils = new MathUtils(); 