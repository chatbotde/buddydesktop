/**
 * Enhanced Content Processor for Buddy Desktop
 * Provides comprehensive content rendering with improved UI for all output types
 */

import { EquationRenderer } from './equations.js';
import { CodeBlockProcessor } from './code-block.js';
import { highlightLoader } from '../highlight-loader.js';

export class EnhancedContentProcessor {
    constructor() {
        this.equationRenderer = new EquationRenderer();
        this.initializeProcessor();
    }

    initializeProcessor() {
        // Enhanced markdown processing patterns
        this.patterns = {
            // Headers with enhanced styling
            h1: /^# (.+)$/gm,
            h2: /^## (.+)$/gm,
            h3: /^### (.+)$/gm,
            h4: /^#### (.+)$/gm,
            h5: /^##### (.+)$/gm,
            h6: /^###### (.+)$/gm,
            
            // Enhanced lists
            unorderedList: /^[\s]*[-*+] (.+)$/gm,
            orderedList: /^[\s]*\d+\. (.+)$/gm,
            
            // Enhanced tables
            table: /^\|(.+)\|$/gm,
            
            // Enhanced blockquotes
            blockquote: /^> (.+)$/gm,
            
            // Enhanced links
            link: /\[([^\]]+)\]\(([^)]+)\)/g,
            
            // Enhanced emphasis
            bold: /\*\*([^*]+)\*\*/g,
            italic: /\*([^*]+)\*/g,
            strikethrough: /~~([^~]+)~~/g,
            
            // Enhanced inline code
            inlineCode: /`([^`]+)`/g,
            
            // Horizontal rules
            hr: /^---$/gm,
            
            // Task lists
            taskList: /^[\s]*- \[([ x])\] (.+)$/gm,
            
            // Definition lists
            definitionTerm: /^([^:\n]+):$/gm,
            definitionDesc: /^[\s]+(.+)$/gm
        };
    }

    /**
     * Process content with all enhancements
     * @param {string} content - Raw content to process
     * @returns {Promise<string>} Enhanced HTML content
     */
    async processContent(content) {
        if (!content) return '';

        console.log('Enhanced content processing started');
        
        // Step 1: Ensure highlight.js is loaded
        try {
            await highlightLoader.load();
        } catch (error) {
            console.warn('Failed to load highlight.js:', error);
        }
        
        // Step 2: Process math equations first (before other markdown)
        content = this.equationRenderer.processContent(content);
        
        // Step 3: Process code blocks (now async)
        content = await CodeBlockProcessor.formatCodeBlocksToHTML(content);
        
        // Step 4: Process enhanced markdown
        content = this.processEnhancedMarkdown(content);
        
        // Step 5: Apply final styling enhancements
        content = this.applyFinalEnhancements(content);
        
        console.log('Enhanced content processing completed');
        return content;
    }

    /**
     * Synchronous version for backward compatibility
     * @param {string} content - Raw content to process
     * @returns {string} Enhanced HTML content
     */
    processContentSync(content) {
        if (!content) return '';

        console.log('Enhanced content processing started (sync)');
        
        // Step 1: Process math equations first (before other markdown)
        content = this.equationRenderer.processContent(content);
        
        // Step 2: Process code blocks synchronously (without highlighting if not loaded)
        content = this._processCodeBlocksSync(content);
        
        // Step 3: Process enhanced markdown
        content = this.processEnhancedMarkdown(content);
        
        // Step 4: Apply final styling enhancements
        content = this.applyFinalEnhancements(content);
        
        console.log('Enhanced content processing completed (sync)');
        return content;
    }

    /**
     * Synchronous code block processing fallback
     * @param {string} content - Content to process
     * @returns {string} Processed content
     */
    _processCodeBlocksSync(content) {
        if (!content) return '';

        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        
        return content.replace(codeBlockRegex, (match, language, code) => {
            const trimmedCode = code.trim();
            const detectedLang = language || this._detectLanguageSync(trimmedCode);
            const codeId = 'code-' + Math.random().toString(36).substring(2, 11);
            
            let highlightedCode = trimmedCode;
            
            // Apply syntax highlighting if hljs is available
            if (window.hljs && detectedLang !== 'text') {
                try {
                    const supportedLanguages = window.hljs.listLanguages();
                    if (supportedLanguages.includes(detectedLang)) {
                        const result = window.hljs.highlight(trimmedCode, { language: detectedLang });
                        highlightedCode = result.value;
                    } else {
                        const result = window.hljs.highlightAuto(trimmedCode);
                        highlightedCode = result.value;
                    }
                } catch (error) {
                    console.warn('Highlighting failed:', error);
                    highlightedCode = this._escapeHtml(trimmedCode);
                }
            } else {
                highlightedCode = this._escapeHtml(trimmedCode);
            }

            const header = `<div class="code-block-header"><span class="code-language">${detectedLang}</span></div>`;
            const preformattedCode = `<pre class="code-block"><code id="${codeId}" class="hljs ${detectedLang}">${highlightedCode}</code></pre>`;
            const copyButton = `<button class="code-copy-btn" onclick="this.getRootNode().host._copyCode('${codeId}')" title="Copy code">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Copy
                                </button>`;

            return `
                <div class="code-block-container">
                    ${header}
                    ${preformattedCode}
                    ${copyButton}
                </div>
            `;
        });
    }

    /**
     * Synchronous language detection
     * @param {string} code - Code to analyze
     * @returns {string} Detected language
     */
    _detectLanguageSync(code) {
        const patterns = {
            javascript: /(?:function|const|let|var|=>|console\.log|require|import|export)/,
            python: /(?:def |import |from |print\(|if __name__|class |self\.)/,
            java: /(?:public class|private |public static|System\.out)/,
            cpp: /(?:#include|std::|cout|cin|int main)/,
            csharp: /(?:using System|public class|private |Console\.WriteLine)/,
            html: /(?:<html|<div|<span|<p>|<!DOCTYPE)/,
            css: /(?:\{[\s\S]*\}|@media|@import|\.[\w-]+\s*\{)/,
            sql: /(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i,
            json: /^\s*[\{\[]/,
            xml: /^\s*<\\?xml|<[a-zA-Z]/,
            bash: /(?:#!\/bin\/bash|sudo |apt-get|npm |yarn |git )/,
            php: /(?:<\\?php|\$[a-zA-Z_])/,
            ruby: /(?:def |class |require |puts |end$)/,
            go: /(?:package |func |import |fmt\.)/,
            rust: /(?:fn |let |pub |use |match |impl)/,
            swift: /(?:func |var |let |import |class |struct)/,
            kotlin: /(?:fun |val |var |class |package |import)/,
            typescript: /(?:interface |type |enum |namespace |declare)/
        };

        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(code)) {
                return lang;
            }
        }

        return 'text';
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Process enhanced markdown with better styling
     * @param {string} content - Content to process
     * @returns {string} Processed content
     */
    processEnhancedMarkdown(content) {
        // Process headers with enhanced styling
        content = content.replace(this.patterns.h1, '<h1 class="enhanced-h1">$1</h1>');
        content = content.replace(this.patterns.h2, '<h2 class="enhanced-h2">$1</h2>');
        content = content.replace(this.patterns.h3, '<h3 class="enhanced-h3">$1</h3>');
        content = content.replace(this.patterns.h4, '<h4 class="enhanced-h4">$1</h4>');
        content = content.replace(this.patterns.h5, '<h5 class="enhanced-h5">$1</h5>');
        content = content.replace(this.patterns.h6, '<h6 class="enhanced-h6">$1</h6>');

        // Process tables with enhanced styling
        content = this.processEnhancedTables(content);
        
        // Process lists with enhanced styling
        content = this.processEnhancedLists(content);
        
        // Process task lists
        content = content.replace(this.patterns.taskList, (match, checked, text) => {
            const isChecked = checked === 'x';
            return `<div class="enhanced-task-item ${isChecked ? 'checked' : ''}">
                <input type="checkbox" ${isChecked ? 'checked' : ''} disabled>
                <span class="task-text">${text}</span>
            </div>`;
        });
        
        // Process blockquotes with enhanced styling
        content = content.replace(this.patterns.blockquote, '<blockquote class="enhanced-blockquote">$1</blockquote>');
        
        // Process links with enhanced styling
        content = content.replace(this.patterns.link, '<a href="$2" class="enhanced-link" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Process text formatting
        content = content.replace(this.patterns.bold, '<strong class="enhanced-bold">$1</strong>');
        content = content.replace(this.patterns.italic, '<em class="enhanced-italic">$1</em>');
        content = content.replace(this.patterns.strikethrough, '<del class="enhanced-strikethrough">$1</del>');
        
        // Process inline code with enhanced styling
        content = content.replace(this.patterns.inlineCode, '<code class="enhanced-inline-code">$1</code>');
        
        // Process horizontal rules
        content = content.replace(this.patterns.hr, '<hr class="enhanced-hr">');
        
        return content;
    }

    /**
     * Process enhanced tables with better styling and responsiveness
     * @param {string} content - Content to process
     * @returns {string} Processed content
     */
    processEnhancedTables(content) {
        const lines = content.split('\n');
        const processedLines = [];
        let inTable = false;
        let tableRows = [];
        let headerProcessed = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.match(/^\|(.+)\|$/)) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                    headerProcessed = false;
                }
                
                // Skip separator lines (|---|---|)
                if (line.match(/^\|[\s\-\|:]+\|$/)) {
                    continue;
                }
                
                const cells = line.slice(1, -1).split('|').map(cell => cell.trim());
                
                if (!headerProcessed) {
                    tableRows.push(`<thead><tr>${cells.map(cell => `<th class="enhanced-th">${cell}</th>`).join('')}</tr></thead>`);
                    headerProcessed = true;
                } else {
                    if (tableRows.length === 1) {
                        tableRows.push('<tbody>');
                    }
                    tableRows.push(`<tr class="enhanced-tr">${cells.map(cell => `<td class="enhanced-td">${cell}</td>`).join('')}</tr>`);
                }
            } else {
                if (inTable) {
                    // End of table
                    if (tableRows.length > 1) {
                        tableRows.push('</tbody>');
                    }
                    processedLines.push(`<div class="enhanced-table-container"><table class="enhanced-table">${tableRows.join('')}</table></div>`);
                    inTable = false;
                    tableRows = [];
                }
                processedLines.push(line);
            }
        }
        
        // Handle table at end of content
        if (inTable && tableRows.length > 0) {
            if (tableRows.length > 1) {
                tableRows.push('</tbody>');
            }
            processedLines.push(`<div class="enhanced-table-container"><table class="enhanced-table">${tableRows.join('')}</table></div>`);
        }
        
        return processedLines.join('\n');
    }

    /**
     * Process enhanced lists with better nesting and styling
     * @param {string} content - Content to process
     * @returns {string} Processed content
     */
    processEnhancedLists(content) {
        const lines = content.split('\n');
        const processedLines = [];
        let inList = false;
        let listType = null; // 'ul' or 'ol'
        let listItems = [];
        let currentIndent = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check for list items
            const unorderedMatch = trimmedLine.match(/^[-*+] (.+)$/);
            const orderedMatch = trimmedLine.match(/^(\d+)\. (.+)$/);
            
            if (unorderedMatch || orderedMatch) {
                const indent = line.length - line.trimLeft().length;
                const text = unorderedMatch ? unorderedMatch[1] : orderedMatch[2];
                const newListType = unorderedMatch ? 'ul' : 'ol';
                
                if (!inList) {
                    inList = true;
                    listType = newListType;
                    currentIndent = indent;
                    listItems = [];
                }
                
                listItems.push({
                    text: text,
                    indent: indent,
                    type: newListType
                });
            } else {
                if (inList) {
                    // End of list - process accumulated items
                    processedLines.push(this.renderEnhancedList(listItems, listType));
                    inList = false;
                    listItems = [];
                }
                processedLines.push(line);
            }
        }
        
        // Handle list at end of content
        if (inList && listItems.length > 0) {
            processedLines.push(this.renderEnhancedList(listItems, listType));
        }
        
        return processedLines.join('\n');
    }

    /**
     * Render enhanced list with proper nesting
     * @param {Array} items - List items
     * @param {string} defaultType - Default list type
     * @returns {string} Rendered list HTML
     */
    renderEnhancedList(items, defaultType) {
        if (items.length === 0) return '';
        
        const listClass = defaultType === 'ul' ? 'enhanced-ul' : 'enhanced-ol';
        const listItems = items.map(item => 
            `<li class="enhanced-li">${item.text}</li>`
        ).join('');
        
        return `<${defaultType} class="${listClass}">${listItems}</${defaultType}>`;
    }

    /**
     * Apply final styling enhancements
     * @param {string} content - Content to enhance
     * @returns {string} Enhanced content
     */
    applyFinalEnhancements(content) {
        // Wrap paragraphs
        content = content.replace(/^(?!<[h1-6]|<ul|<ol|<table|<div|<blockquote|<hr)([^\n<]+)$/gm, '<p class="enhanced-paragraph">$1</p>');
        
        // Add line breaks for better spacing
        content = content.replace(/\n\n/g, '\n<br class="enhanced-break">\n');
        
        return content;
    }

    /**
     * Inject enhanced styling for all content types
     */
    static injectEnhancedStyles() {
        if (document.getElementById('enhanced-content-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'enhanced-content-styles';
        style.textContent = `
            /* Enhanced Typography and Readability */
            .enhanced-paragraph {
                margin: 0.8em 0;
                line-height: 1.7;
                font-size: 14px;
                color: #e5e5e7;
                font-weight: 400;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
            }

            .enhanced-break {
                display: block;
                height: 0.5em;
                border: none;
                background: none;
            }

            /* Enhanced Headers with Visual Hierarchy */
            .enhanced-h1 {
                font-size: 2.2em;
                font-weight: 700;
                color: #ffffff;
                margin: 1.5em 0 0.8em 0;
                line-height: 1.2;
                border-bottom: 3px solid #007aff;
                padding-bottom: 0.3em;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), transparent);
                padding: 0.5em;
                border-radius: 8px;
                position: relative;
            }

            .enhanced-h1::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(180deg, #007aff, #5856d6);
                border-radius: 2px;
            }

            .enhanced-h2 {
                font-size: 1.8em;
                font-weight: 600;
                color: #f0f0f0;
                margin: 1.3em 0 0.6em 0;
                line-height: 1.3;
                border-bottom: 2px solid rgba(255, 255, 255, 0.2);
                padding-bottom: 0.2em;
                position: relative;
                padding-left: 1em;
            }

            .enhanced-h2::before {
                content: '▶';
                position: absolute;
                left: 0;
                color: #007aff;
                font-size: 0.8em;
            }

            .enhanced-h3 {
                font-size: 1.5em;
                font-weight: 600;
                color: #e0e0e0;
                margin: 1.1em 0 0.5em 0;
                line-height: 1.4;
                position: relative;
                padding-left: 1.2em;
            }

            .enhanced-h3::before {
                content: '●';
                position: absolute;
                left: 0;
                color: #5856d6;
                font-size: 0.7em;
                top: 0.3em;
            }

            .enhanced-h4 {
                font-size: 1.3em;
                font-weight: 600;
                color: #d0d0d0;
                margin: 1em 0 0.4em 0;
                line-height: 1.4;
            }

            .enhanced-h5 {
                font-size: 1.1em;
                font-weight: 600;
                color: #c0c0c0;
                margin: 0.9em 0 0.3em 0;
                line-height: 1.5;
            }

            .enhanced-h6 {
                font-size: 1em;
                font-weight: 600;
                color: #b0b0b0;
                margin: 0.8em 0 0.3em 0;
                line-height: 1.5;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Enhanced Lists with Better Visual Hierarchy */
            .enhanced-ul, .enhanced-ol {
                margin: 1em 0;
                padding-left: 1.5em;
                line-height: 1.6;
            }

            .enhanced-ul {
                list-style: none;
            }

            .enhanced-ul .enhanced-li {
                position: relative;
                margin: 0.5em 0;
                padding-left: 1.2em;
                color: #e5e5e7;
            }

            .enhanced-ul .enhanced-li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: #007aff;
                font-weight: bold;
                font-size: 1.2em;
                line-height: 1;
            }

            .enhanced-ol {
                counter-reset: enhanced-counter;
            }

            .enhanced-ol .enhanced-li {
                position: relative;
                margin: 0.5em 0;
                padding-left: 1.5em;
                color: #e5e5e7;
                counter-increment: enhanced-counter;
            }

            .enhanced-ol .enhanced-li::before {
                content: counter(enhanced-counter) '.';
                position: absolute;
                left: 0;
                color: #007aff;
                font-weight: bold;
                min-width: 1.2em;
            }

            /* Enhanced Task Lists */
            .enhanced-task-item {
                display: flex;
                align-items: center;
                margin: 0.5em 0;
                padding: 0.3em 0;
                transition: all 0.2s ease;
            }

            .enhanced-task-item input[type="checkbox"] {
                margin-right: 0.8em;
                transform: scale(1.2);
                accent-color: #007aff;
            }

            .enhanced-task-item.checked .task-text {
                text-decoration: line-through;
                opacity: 0.7;
                color: #888;
            }

            .task-text {
                color: #e5e5e7;
                line-height: 1.5;
            }

            /* Enhanced Tables with Professional Styling */
            .enhanced-table-container {
                margin: 1.5em 0;
                overflow-x: auto;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            }

            .enhanced-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                background: transparent;
            }

            .enhanced-th {
                background: linear-gradient(135deg, rgba(0, 122, 255, 0.2), rgba(88, 86, 214, 0.2));
                color: #ffffff;
                font-weight: 600;
                padding: 1em 1.2em;
                text-align: left;
                border-bottom: 2px solid rgba(255, 255, 255, 0.2);
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                position: relative;
            }

            .enhanced-th::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #007aff, #5856d6);
            }

            .enhanced-td {
                padding: 0.8em 1.2em;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                color: #e5e5e7;
                line-height: 1.5;
                transition: background-color 0.2s ease;
            }

            .enhanced-tr:hover .enhanced-td {
                background: rgba(255, 255, 255, 0.05);
            }

            .enhanced-tr:nth-child(even) .enhanced-td {
                background: rgba(255, 255, 255, 0.02);
            }

            /* Enhanced Blockquotes */
            .enhanced-blockquote {
                margin: 1.5em 0;
                padding: 1.2em 1.5em;
                border-left: 4px solid #007aff;
                background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05));
                border-radius: 0 8px 8px 0;
                font-style: italic;
                color: #d0d0d0;
                position: relative;
                box-shadow: 0 4px 16px rgba(0, 122, 255, 0.1);
            }

            .enhanced-blockquote::before {
                content: '"';
                position: absolute;
                top: -0.2em;
                left: 0.5em;
                font-size: 3em;
                color: rgba(0, 122, 255, 0.3);
                font-family: serif;
                line-height: 1;
            }

            /* Enhanced Links */
            .enhanced-link {
                color: #4fc3f7;
                text-decoration: none;
                border-bottom: 1px solid rgba(79, 195, 247, 0.3);
                transition: all 0.2s ease;
                position: relative;
                padding: 0.1em 0.2em;
                border-radius: 3px;
            }

            .enhanced-link:hover {
                color: #81d4fa;
                border-bottom-color: rgba(129, 212, 250, 0.6);
                background: rgba(79, 195, 247, 0.1);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(79, 195, 247, 0.2);
            }

            /* Enhanced Text Formatting */
            .enhanced-bold {
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }

            .enhanced-italic {
                font-style: italic;
                color: #f0f0f0;
            }

            .enhanced-strikethrough {
                text-decoration: line-through;
                color: #888;
                opacity: 0.8;
            }

            /* Enhanced Inline Code */
            .enhanced-inline-code {
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
                color: #4fc3f7;
                padding: 0.2em 0.5em;
                border-radius: 4px;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                font-size: 0.9em;
                border: 1px solid rgba(79, 195, 247, 0.2);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                font-weight: 500;
            }

            /* Enhanced Horizontal Rules */
            .enhanced-hr {
                margin: 2em 0;
                border: none;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                border-radius: 1px;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .enhanced-h1 {
                    font-size: 1.8em;
                    padding: 0.4em;
                }

                .enhanced-h2 {
                    font-size: 1.5em;
                }

                .enhanced-h3 {
                    font-size: 1.3em;
                }

                .enhanced-table-container {
                    font-size: 12px;
                }

                .enhanced-th, .enhanced-td {
                    padding: 0.6em 0.8em;
                }

                .enhanced-blockquote {
                    padding: 1em;
                    margin: 1em 0;
                }
            }

            /* Print Styles */
            @media print {
                .enhanced-h1, .enhanced-h2, .enhanced-h3 {
                    color: #000 !important;
                    text-shadow: none !important;
                }

                .enhanced-table-container {
                    box-shadow: none !important;
                    border: 1px solid #ccc !important;
                }

                .enhanced-blockquote {
                    background: #f5f5f5 !important;
                    color: #333 !important;
                }

                .enhanced-link {
                    color: #0066cc !important;
                }
            }

            /* Selection Styling */
            .enhanced-paragraph::selection,
            .enhanced-h1::selection,
            .enhanced-h2::selection,
            .enhanced-h3::selection,
            .enhanced-li::selection,
            .enhanced-td::selection {
                background: rgba(79, 195, 247, 0.3);
                color: inherit;
            }

            /* Accessibility Improvements */
            .enhanced-link:focus {
                outline: 2px solid #4fc3f7;
                outline-offset: 2px;
            }

            .enhanced-task-item input:focus {
                outline: 2px solid #007aff;
                outline-offset: 2px;
            }

            /* Animation for Dynamic Content */
            .enhanced-h1, .enhanced-h2, .enhanced-h3,
            .enhanced-table-container, .enhanced-blockquote {
                animation: enhancedFadeIn 0.5s ease-out;
            }

            @keyframes enhancedFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Auto-inject styles when module loads
EnhancedContentProcessor.injectEnhancedStyles();

// Export singleton instance
export const enhancedContentProcessor = new EnhancedContentProcessor();