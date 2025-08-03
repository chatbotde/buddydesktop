import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { highlightLoader } from '../highlight-loader.js';

class UnifiedCodeBlock extends LitElement {
    static properties = {
        code: { type: String },
        language: { type: String },
        showHeader: { type: Boolean },
        showCopyButton: { type: Boolean },
        // Animation properties
        writing: { type: Boolean },
        duration: { type: Number },
        delay: { type: Number },
        cursor: { type: Boolean },
        autoStart: { type: Boolean },
        // Editor-style properties
        theme: { type: String },
        title: { type: String },
        icon: { type: String },
        dots: { type: Boolean },
        width: { type: String },
        height: { type: String }
    };

    constructor() {
        super();
        // Core properties
        this.code = '';
        this.language = '';
        this.showHeader = true;
        this.showCopyButton = true;
        
        // Animation properties
        this.writing = false;
        this.duration = 3;
        this.delay = 0;
        this.cursor = true;
        this.autoStart = true;
        
        // Editor-style properties
        this.theme = 'dark';
        this.title = '';
        this.icon = '';
        this.dots = false;
        this.width = '100%';
        this.height = 'auto';
        
        this.codeId = 'code-' + Math.random().toString(36).substring(2, 11);
        
        // Animation state
        this.visibleCode = '';
        this.highlightedCode = '';
        this.isDone = false;
        this.intervalId = null;
        this.timeoutId = null;
        
        this._initializeHighlighting();
    }

    static styles = css`
        :host {
            display: block;
            font-family: inherit;
        }

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
            padding: 8px 16px;
            background: oklch(21.6% 0.006 56.043);
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            position: relative;
            min-height: 32px;
        }

        .code-block-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: oklch(21.6% 0.006 56.043);
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

        /* Editor-style header */
        .editor-header {
            background: var(--header-bg, #2d2d30);
            border-bottom: 1px solid var(--border-color, #3e3e42);
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            padding: 0 16px;
            position: relative;
        }

        .header-dots {
            display: flex;
            gap: 8px;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .dot.red { background: #ff5f56; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27ca3f; }

        .header-title {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-muted, #cccccc);
            font-size: 13px;
        }

        .header-icon {
            width: 14px;
            height: 14px;
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
            text-align: left;
        }

        .code-block::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: oklch(21.6% 0.006 56.043);
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
            display: block;
            text-align: left;
            line-height: inherit;
            position: relative;
        }

        /* Typewriter cursor */
        .typewriter-cursor {
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background: #4fc3f7;
            animation: blink 1s infinite;
            margin-left: 0;
            vertical-align: baseline;
            position: relative;
            top: 0;
            box-sizing: border-box;
            transform: translateZ(0);
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
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

        .code-copy-btn.copied {
            background: rgba(76, 175, 80, 0.2);
            border-color: rgba(76, 175, 80, 0.3);
            color: #4caf50;
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

        /* Light theme support */
        :host([theme="light"]) {
            --code-bg: #f8f9fa;
            --header-bg: #f1f3f4;
            --border-color: #e1e5e9;
            --code-content-bg: #ffffff;
            --text-muted: #6b7280;
            --hover-bg: rgba(0, 0, 0, 0.05);
        }

        :host([theme="light"]) .hljs-keyword { color: #d73a49; }
        :host([theme="light"]) .hljs-string { color: #032f62; }
        :host([theme="light"]) .hljs-comment { color: #6a737d; }
        :host([theme="light"]) .hljs-number { color: #005cc5; }
        :host([theme="light"]) .hljs-function { color: #6f42c1; }
        :host([theme="light"]) .hljs-variable { color: #e36209; }
        :host([theme="light"]) .hljs-built_in { color: #005cc5; }
        :host([theme="light"]) .hljs-literal { color: #005cc5; }
        :host([theme="light"]) .hljs-title { color: #6f42c1; }
        :host([theme="light"]) .hljs-params { color: #24292e; }

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
            await highlightLoader.load();
            console.log('Highlight.js initialized successfully');
            this.requestUpdate();
        } catch (error) {
            console.warn('Failed to initialize highlighting:', error);
        }
    }

    updated(changedProperties) {
        // Start typewriter animation when code changes or writing becomes true
        if ((changedProperties.has('code') || changedProperties.has('writing')) && 
            this.code && this.writing && this.autoStart) {
            this.startTypewriter();
        } else if (changedProperties.has('code') && this.code && !this.writing) {
            // Show complete code immediately if not writing
            this.visibleCode = this.code;
            this.isDone = true;
            this.updateHighlighting();
        }
        
        // If writing becomes false, show complete code immediately
        if (changedProperties.has('writing') && !this.writing && this.code) {
            this.visibleCode = this.code;
            this.isDone = true;
            this.updateHighlighting();
        }
    }

    // Typewriter animation logic
    startTypewriter() {
        if (!this.code) return;
        
        this.reset();
        
        const characters = Array.from(this.code);
        let index = 0;
        const totalDuration = this.duration * 1000;
        const interval = totalDuration / characters.length;

        this.timeoutId = setTimeout(() => {
            this.intervalId = setInterval(() => {
                if (index < characters.length) {
                    this.visibleCode += characters[index];
                    index++;
                    this.updateHighlighting();
                    
                    // Auto-scroll to bottom
                    const codeBlock = this.shadowRoot.querySelector('.code-block');
                    if (codeBlock) {
                        codeBlock.scrollTop = codeBlock.scrollHeight;
                    }
                } else {
                    this.clearIntervals();
                    this.isDone = true;
                    this.requestUpdate();
                    
                    // Dispatch completion event
                    this.dispatchEvent(new CustomEvent('animation-complete', {
                        detail: { code: this.code },
                        bubbles: true,
                        composed: true
                    }));
                }
            }, interval);
        }, this.delay * 1000);
    }

    updateHighlighting() {
        if (!this.visibleCode) {
            this.highlightedCode = '';
            this.requestUpdate();
            return;
        }
        
        const { highlightedCode } = this._getHighlightedCode(this.visibleCode);
        this.highlightedCode = highlightedCode;
        this.requestUpdate();
    }

    reset() {
        this.visibleCode = '';
        this.highlightedCode = '';
        this.isDone = false;
        this.clearIntervals();
    }

    clearIntervals() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    pause() {
        this.clearIntervals();
    }

    resume() {
        if (!this.isDone && this.visibleCode.length < this.code.length) {
            this.startTypewriter();
        }
    }

    _detectLanguage(code) {
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

    _getHighlightedCode(code) {
        // Don't trim the code to preserve original indentation
        const detectedLang = this.language || this._detectLanguage(code);
        
        let highlightedCode = code;
        
        if (window.hljs && detectedLang !== 'text') {
            try {
                const supportedLanguages = window.hljs.listLanguages();
                
                if (supportedLanguages.includes(detectedLang)) {
                    const result = window.hljs.highlight(code, { language: detectedLang });
                    highlightedCode = result.value;
                } else {
                    const result = window.hljs.highlightAuto(code);
                    highlightedCode = result.value;
                }
            } catch (error) {
                console.warn('Highlighting failed:', error);
                highlightedCode = this._escapeHtml(code);
            }
        } else {
            highlightedCode = this._escapeHtml(code);
        }

        return { highlightedCode, detectedLang };
    }

    async _copyCode() {
        try {
            await navigator.clipboard.writeText(this.code);
            const copyBtn = this.shadowRoot.querySelector('.code-copy-btn');
            if (copyBtn) {
                copyBtn.classList.add('copied');
                const originalHTML = copyBtn.innerHTML;
                
                copyBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            }
            
            this.dispatchEvent(new CustomEvent('code-copied', {
                detail: { code: this.code },
                bubbles: true,
                composed: true
            }));
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    }

    render() {
        if (!this.code) return html``;

        const { detectedLang } = this._getHighlightedCode(this.code);
        const displayCode = this.writing ? this.highlightedCode : this._getHighlightedCode(this.code).highlightedCode;
        const isEditorStyle = this.dots || this.title;

        return html`
            <div class="code-block-container" style="width: ${this.width}; height: ${this.height};">
                ${this.showHeader ? html`
                    ${isEditorStyle ? html`
                        <div class="editor-header">
                            ${this.dots ? html`
                                <div class="header-dots">
                                    <div class="dot red"></div>
                                    <div class="dot yellow"></div>
                                    <div class="dot green"></div>
                                </div>
                            ` : ''}
                            
                            ${this.title ? html`
                                <div class="header-title">
                                    ${this.icon ? html`
                                        <div class="header-icon" .innerHTML=${this.icon}></div>
                                    ` : ''}
                                    <span>${this.title}</span>
                                </div>
                            ` : ''}
                        </div>
                    ` : html`
                        <div class="code-block-header">
                            <span class="code-language">${detectedLang}</span>
                        </div>
                    `}
                ` : ''}
                <pre class="code-block">
                    <code id="${this.codeId}" class="hljs ${detectedLang}" .innerHTML="${displayCode}"></code>${!this.isDone && this.cursor && this.writing ? html`<span class="typewriter-cursor"></span>` : ''}
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

    disconnectedCallback() {
        super.disconnectedCallback();
        this.clearIntervals();
    }
}

customElements.define('unified-code-block', UnifiedCodeBlock);

export { UnifiedCodeBlock }; 