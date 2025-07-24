import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { highlightLoader } from '../highlight-loader.js';

class CodeBlock extends LitElement {
    static properties = {
        code: { type: String },
        language: { type: String },
        showHeader: { type: Boolean },
        showCopyButton: { type: Boolean }
    };

    constructor() {
        super();
        this.code = '';
        this.language = '';
        this.showHeader = true;
        this.showCopyButton = true;
        this.codeId = 'code-' + Math.random().toString(36).substring(2, 11);
        this._initializeHighlighting();
    }

    static styles = css`
        .code-block-container {
            position: relative;
            margin: 1.5em 0;
            border-radius: 16px;
            overflow: hidden;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
            border: 2px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(20px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 100%;
            width: 100%;
            box-sizing: border-box;
        }

        .code-block-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
            border-color: rgba(255, 255, 255, 0.18);
        }

        .code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(0, 122, 255, 0.15), rgba(88, 86, 214, 0.15));
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            position: relative;
            min-height: 44px;
        }

        .code-block-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #007aff, #5856d6, #007aff);
        }

        .code-language {
            font-size: 13px;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            position: relative;
            padding-left: 1.5em;
            display: flex;
            align-items: center;
        }

        .code-language::before {
            content: '◉';
            position: absolute;
            left: 0;
            color: #4fc3f7;
            font-size: 0.9em;
        }

        .code-block {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
            overflow: auto;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.6;
            border: none;
            white-space: pre;
            max-width: 100%;
            box-sizing: border-box;
            color: #e5e5e7;
            font-weight: 500;
            position: relative;
            min-height: 60px;
        }

        .code-block::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(180deg, #4fc3f7, #007aff);
            border-radius: 0 2px 2px 0;
        }

        .code-block code {
            background: transparent;
            border: none;
            padding: 0;
            font-size: inherit;
            color: inherit;
            font-family: inherit;
            white-space: inherit;
            overflow-wrap: break-word;
            word-break: break-all;
        }

        .code-copy-btn {
            position: absolute;
            top: 8px;
            right: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            opacity: 0;
            pointer-events: none;
            backdrop-filter: blur(10px);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 10;
        }

        .code-block-container:hover .code-copy-btn {
            opacity: 0.8;
            pointer-events: all;
        }

        .code-copy-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            opacity: 1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .code-copy-btn:active {
            transform: translateY(0);
        }

        .code-copy-btn svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }

        /* Enhanced scrollbar for code blocks */
        .code-block::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .code-block::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .code-block::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            transition: background 0.2s ease;
        }

        .code-block::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .code-block::-webkit-scrollbar-corner {
            background: rgba(255, 255, 255, 0.05);
        }

        /* Enhanced syntax highlighting */
        .hljs {
            background: transparent !important;
            color: #e6e6e6;
            font-weight: 500;
        }

        .hljs-keyword {
            color: #c792ea;
            font-weight: 600;
        }

        .hljs-string {
            color: #c3e88d;
        }

        .hljs-number {
            color: #f78c6c;
        }

        .hljs-comment {
            color: #546e7a;
            font-style: italic;
            opacity: 0.8;
        }

        .hljs-function {
            color: #82aaff;
            font-weight: 600;
        }

        .hljs-variable {
            color: #eeffff;
        }

        .hljs-attr {
            color: #ffcb6b;
        }

        .hljs-tag {
            color: #f07178;
        }

        .hljs-type {
            color: #4ec9b0;
        }

        .hljs-built_in {
            color: #4fc1ff;
        }

        .hljs-operator {
            color: #89ddff;
        }

        .hljs-punctuation {
            color: #89ddff;
        }

        .hljs-title {
            color: #82aaff;
            font-weight: 600;
        }

        .hljs-literal {
            color: #ff5370;
        }

        .hljs-regexp {
            color: #c3e88d;
        }

        .hljs-meta {
            color: #ffcb6b;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .code-block-container {
                margin: 1em 0;
                border-radius: 12px;
            }

            .code-block-header {
                padding: 10px 12px;
                min-height: 40px;
            }

            .code-language {
                font-size: 12px;
            }

            .code-block {
                padding: 16px 12px;
                font-size: 13px;
                line-height: 1.5;
            }

            .code-copy-btn {
                padding: 4px 8px;
                font-size: 11px;
                top: 6px;
                right: 8px;
            }
        }

        @media (max-width: 480px) {
            .code-block {
                padding: 12px 8px;
                font-size: 12px;
                overflow-x: auto;
                white-space: pre;
            }

            .code-language {
                font-size: 11px;
                padding-left: 1.2em;
            }

            .code-copy-btn {
                padding: 3px 6px;
                font-size: 10px;
            }
        }

        /* Print styles */
        @media print {
            .code-block-container {
                background: #f8f8f8 !important;
                border: 1px solid #ddd !important;
                box-shadow: none !important;
            }

            .code-block-header {
                background: #e8e8e8 !important;
                color: #333 !important;
            }

            .code-block {
                background: #fff !important;
                color: #333 !important;
            }

            .code-copy-btn {
                display: none !important;
            }
        }

        /* Animation for dynamic content */
        .code-block-container {
            animation: codeBlockFadeIn 0.5s ease-out;
        }

        @keyframes codeBlockFadeIn {
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

    async _initializeHighlighting() {
        try {
            // Use the global highlight loader
            await highlightLoader.load();
            console.log('Highlight.js initialized successfully');
            this.requestUpdate();
        } catch (error) {
            console.warn('Failed to initialize highlighting:', error);
        }
    }

    _detectLanguage(code) {
        // Simple language detection based on common patterns
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

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    _getHighlightedCode() {
        const trimmedCode = this.code.trim();
        const detectedLang = this.language || this._detectLanguage(trimmedCode);
        
        let highlightedCode = trimmedCode;
        
        // Apply syntax highlighting if hljs is available
        if (window.hljs && detectedLang !== 'text') {
            try {
                // Check if the language is supported
                const supportedLanguages = window.hljs.listLanguages();
                console.log('CodeBlock: Available languages:', supportedLanguages.length, 'languages');
                console.log('CodeBlock: Trying to highlight with language:', detectedLang);
                console.log('CodeBlock: Code preview:', trimmedCode.substring(0, 50) + '...');
                
                if (supportedLanguages.includes(detectedLang)) {
                    const result = window.hljs.highlight(trimmedCode, { language: detectedLang });
                    highlightedCode = result.value;
                    console.log('CodeBlock: Highlighting successful for', detectedLang);
                } else {
                    // Try auto-detection
                    const result = window.hljs.highlightAuto(trimmedCode);
                    highlightedCode = result.value;
                    console.log('CodeBlock: Auto-highlighting applied, detected:', result.language);
                }
            } catch (error) {
                console.warn('CodeBlock: Highlighting failed for', detectedLang, ':', error);
                highlightedCode = this._escapeHtml(trimmedCode);
            }
        } else {
            console.log('CodeBlock: hljs not available or language is text:', !!window.hljs, detectedLang);
            highlightedCode = this._escapeHtml(trimmedCode);
        }

        return { highlightedCode, detectedLang };
    }

    _copyCode() {
        const codeElement = this.shadowRoot.getElementById(this.codeId);
        if (codeElement) {
            const code = codeElement.textContent || codeElement.innerText;
            navigator.clipboard.writeText(code).then(() => {
                // Show feedback
                const copyBtn = this.shadowRoot.querySelector('.code-copy-btn');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        Copied!
                    `;
                    copyBtn.style.color = '#4ade80';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.style.color = '';
                    }, 2000);
                }
            }).catch(err => {
                console.error('Failed to copy code:', err);
            });
        }
    }

    render() {
        if (!this.code) return html``;

        const { highlightedCode, detectedLang } = this._getHighlightedCode();

        return html`
            <div class="code-block-container">
                ${this.showHeader ? html`
                    <div class="code-block-header">
                        <span class="code-language">${detectedLang}</span>
                    </div>
                ` : ''}
                <pre class="code-block">
                    <code id="${this.codeId}" class="hljs ${detectedLang}" .innerHTML="${highlightedCode}"></code>
                </pre>
                ${this.showCopyButton ? html`
                    <button class="code-copy-btn" @click=${this._copyCode} title="Copy code">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                ` : ''}
            </div>
        `;
    }
}

// Utility class for processing markdown content with code blocks
export class CodeBlockProcessor {
    static formatCodeBlocks(content) {
        if (!content) return '';

        // Enhanced regex to capture code blocks with optional language
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        
        return content.replace(codeBlockRegex, (match, language, code) => {
            const trimmedCode = code.trim();
            const codeId = 'code-' + Math.random().toString(36).substring(2, 11);
            
            // Return a custom element tag that will be processed by the chat message
            return `<code-block code="${encodeURIComponent(trimmedCode)}" language="${language || ''}" show-header="true" show-copy-button="true"></code-block>`;
        });
    }

    static _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static _detectLanguage(code) {
        // Simple language detection based on common patterns
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

    // Alternative approach: return HTML directly for inline processing
    static async formatCodeBlocksToHTML(content) {
        if (!content) return '';

        // Ensure highlight.js is loaded
        try {
            await highlightLoader.load();
        } catch (error) {
            console.warn('Failed to load highlight.js for static processing:', error);
        }

        // Enhanced regex to capture code blocks with optional language
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        
        return content.replace(codeBlockRegex, (match, language, code) => {
            const trimmedCode = code.trim();
            const detectedLang = language || CodeBlockProcessor._detectLanguage(trimmedCode);
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
                    highlightedCode = CodeBlockProcessor._escapeHtml(trimmedCode);
                }
            } else {
                highlightedCode = CodeBlockProcessor._escapeHtml(trimmedCode);
            }

            // Add line numbers for better code editor appearance
            const lines = highlightedCode.split('\n');
            const hasMultipleLines = lines.length > 1;
            
            let processedCode;
            if (hasMultipleLines) {
                // Create line-numbered version
                const numberedLines = lines.map((line, index) => {
                    return `<span class="code-line">${line || ' '}</span>`;
                }).join('\n');
                processedCode = numberedLines;
            } else {
                // Single line - no line numbers needed
                processedCode = highlightedCode;
            }

            const header = `
                <div class="code-block-header">
                    <span class="code-language">${detectedLang}</span>
                    <button class="code-copy-btn" onclick="this.getRootNode().host._copyCode('${codeId}')" title="Copy code">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2h1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
            `;
            
            const codeBlockClass = hasMultipleLines ? 'code-block with-line-numbers' : 'code-block';
            const preformattedCode = `<pre class="${codeBlockClass}"><code id="${codeId}" class="hljs ${detectedLang}">${processedCode}</code></pre>`;

            return `
                <div class="code-block-container">
                    ${header}
                    ${preformattedCode}
                </div>
            `;
        });
    }
}

customElements.define('code-block', CodeBlock);