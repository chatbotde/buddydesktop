import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

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
        this.codeId = 'code-' + Math.random().toString(36).substr(2, 9);
        this._loadHighlightJS();
    }

    static styles = css`
        .code-block-container {
            position: relative;
            margin: 12px 0;
            border-radius: 8px;
            overflow: hidden;
            background: #1e1e1e;
            border: 1px solid #333;
        }

        .code-block-header {
            background: #2d2d2d;
            padding: 8px 12px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #888;
        }

        .code-language {
            font-weight: 500;
            color: #fff;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }

        .code-block {
            margin: 0;
            padding: 16px;
            background: #1e1e1e;
            color: #d4d4d4;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            overflow-x: auto;
            white-space: pre;
        }

        .code-copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(45, 45, 45, 0.9);
            border: 1px solid #444;
            color: #888;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
            backdrop-filter: blur(4px);
        }

        .code-copy-btn:hover {
            background: rgba(60, 60, 60, 0.9);
            color: #fff;
            border-color: #555;
        }

        .code-copy-btn:active {
            transform: scale(0.95);
        }

        .code-copy-btn svg {
            width: 14px;
            height: 14px;
        }

        /* Syntax highlighting styles */
        .hljs {
            background: transparent !important;
            color: #d4d4d4;
        }

        .hljs-keyword {
            color: #569cd6;
        }

        .hljs-string {
            color: #ce9178;
        }

        .hljs-comment {
            color: #6a9955;
            font-style: italic;
        }

        .hljs-number {
            color: #b5cea8;
        }

        .hljs-function {
            color: #dcdcaa;
        }

        .hljs-variable {
            color: #9cdcfe;
        }

        .hljs-type {
            color: #4ec9b0;
        }

        .hljs-built_in {
            color: #4fc1ff;
        }

        .hljs-operator {
            color: #d4d4d4;
        }

        .hljs-punctuation {
            color: #d4d4d4;
        }
    `;

    async _loadHighlightJS() {
        // Load highlight.js if not already loaded
        if (!window.hljs) {
            try {
                // Load highlight.js script
                const script = document.createElement('script');
                script.src = './highlight.min.js';
                script.onload = () => {
                    // Load CSS
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = './highlight.min.css';
                    document.head.appendChild(link);
                    this.requestUpdate();
                };
                document.head.appendChild(script);
            } catch (error) {
                console.warn('Failed to load highlight.js:', error);
            }
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
                if (window.hljs.getLanguage(detectedLang)) {
                    highlightedCode = window.hljs.highlight(trimmedCode, { language: detectedLang }).value;
                } else {
                    highlightedCode = window.hljs.highlightAuto(trimmedCode).value;
                }
            } catch (error) {
                console.warn('Highlighting failed:', error);
                highlightedCode = this._escapeHtml(trimmedCode);
            }
        } else {
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
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            
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
    static formatCodeBlocksToHTML(content) {
        if (!content) return '';

        // Enhanced regex to capture code blocks with optional language
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        
        return content.replace(codeBlockRegex, (match, language, code) => {
            const trimmedCode = code.trim();
            const detectedLang = language || CodeBlockProcessor._detectLanguage(trimmedCode);
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            
            let highlightedCode = trimmedCode;
            
            // Apply syntax highlighting if hljs is available
            if (window.hljs && detectedLang !== 'text') {
                try {
                    if (window.hljs.getLanguage(detectedLang)) {
                        highlightedCode = window.hljs.highlight(trimmedCode, { language: detectedLang }).value;
                    } else {
                        highlightedCode = window.hljs.highlightAuto(trimmedCode).value;
                    }
                } catch (error) {
                    console.warn('Highlighting failed:', error);
                    highlightedCode = CodeBlockProcessor._escapeHtml(trimmedCode);
                }
            } else {
                highlightedCode = CodeBlockProcessor._escapeHtml(trimmedCode);
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
}

customElements.define('code-block', CodeBlock);