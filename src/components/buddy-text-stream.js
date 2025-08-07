import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyTextStream extends LitElement {
    static properties = {
        text: { type: String },
        mode: { type: String }, // 'typewriter' or 'fade'
        speed: { type: Number },
        fadeDuration: { type: Number },
        segmentDelay: { type: Number },
        chunkSize: { type: Number },
        isComplete: { type: Boolean },
        isPaused: { type: Boolean },
        autoStart: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            font-family: inherit;
            line-height: 1.6;
        }

        .text-stream-container {
            position: relative;
            overflow-wrap: break-word;
        }

        .typewriter-cursor {
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background: var(--cursor-color, #3b82f6);
            animation: blink 1s infinite;
            margin-left: 1px;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .fade-segment {
            display: inline-block;
            opacity: 0;
            animation: fadeIn ease-out forwards;
        }

        .fade-segment-space {
            white-space: pre;
        }
    `;

    constructor() {
        super();
        this.text = '';
        this.mode = 'typewriter';
        this.speed = 800;
        this.fadeDuration = null;
        this.segmentDelay = null;
        this.chunkSize = null;
        this.isComplete = false;
        this.isPaused = false;
        this.autoStart = true;

        // Internal state
        this.displayedText = '';
        this.segments = [];
        this.currentIndex = 0;
        this.animationId = null;
        this.completed = false;
    }

    updated(changedProperties) {
        if (changedProperties.has('text') && this.text && this.autoStart) {
            this.startAnimation();
        }
    }

    getChunkSize() {
        if (typeof this.chunkSize === 'number') {
            return Math.max(1, this.chunkSize);
        }
        
        const normalizedSpeed = Math.min(1000, Math.max(1, this.speed));
        if (this.mode === 'typewriter') {
            // Much more aggressive chunk sizing for maximum speed
            if (normalizedSpeed < 100) return 3;
            if (normalizedSpeed < 300) return 8;
            if (normalizedSpeed < 600) return 15;
            return Math.max(20, Math.round(normalizedSpeed / 40));
        }
        return 1;
    }

    getProcessingDelay() {
        if (typeof this.segmentDelay === 'number') {
            return Math.max(0, this.segmentDelay);
        }
        
        // No delay calculation - render as fast as possible
        return 0;
    }

    getFadeDuration() {
        if (typeof this.fadeDuration === 'number') {
            return Math.max(10, this.fadeDuration);
        }
        
        const normalizedSpeed = Math.min(100, Math.max(1, this.speed));
        return Math.round(1000 / Math.sqrt(normalizedSpeed));
    }

    getSegmentDelay() {
        if (typeof this.segmentDelay === 'number') {
            return Math.max(0, this.segmentDelay);
        }
        
        const normalizedSpeed = Math.min(100, Math.max(1, this.speed));
        return Math.max(1, Math.round(100 / Math.sqrt(normalizedSpeed)));
    }

    updateSegments(text) {
        if (this.mode === 'fade') {
            try {
                // Try to use Intl.Segmenter if available
                if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                    const segmenter = new Intl.Segmenter(navigator.language, {
                        granularity: 'word'
                    });
                    const segmentIterator = segmenter.segment(text);
                    this.segments = Array.from(segmentIterator).map((segment, index) => ({
                        text: segment.segment,
                        index
                    }));
                } else {
                    throw new Error('Intl.Segmenter not available');
                }
            } catch (error) {
                // Fallback to simple split
                this.segments = text.split(/(\s+)/).filter(Boolean).map((word, index) => ({
                    text: word,
                    index
                }));
            }
        }
    }

    markComplete() {
        if (!this.completed) {
            this.completed = true;
            this.isComplete = true;
            this.dispatchEvent(new CustomEvent('animation-complete', {
                detail: { text: this.text },
                bubbles: true,
                composed: true
            }));
        }
    }

    reset() {
        this.currentIndex = 0;
        this.displayedText = '';
        this.segments = [];
        this.isComplete = false;
        this.completed = false;
        this.isPaused = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.requestUpdate();
    }

    processTypewriter(text) {
        // Check if text contains HTML
        const hasHTML = /<[^>]*>/g.test(text);
        
        if (hasHTML) {
            this._processTypewriterHTML(text);
        } else {
            this._processTypewriterPlain(text);
        }
    }

    _processTypewriterPlain(text) {
        const streamContent = () => {
            if (this.isPaused) {
                return;
            }

            if (this.currentIndex >= text.length) {
                this.markComplete();
                this.requestUpdate();
                return;
            }

            const chunkSize = this.getChunkSize();
            const endIndex = Math.min(this.currentIndex + chunkSize, text.length);
            this.displayedText = text.slice(0, endIndex);
            this.currentIndex = endIndex;

            this.requestUpdate();

            if (endIndex < text.length) {
                this.animationId = requestAnimationFrame(streamContent);
            } else {
                this.markComplete();
            }
        };

        this.animationId = requestAnimationFrame(streamContent);
    }

    _processTypewriterHTML(text) {
        // Parse HTML and separate into blocks and inline content
        const blocks = this._parseHTMLBlocks(text);
        
        let currentBlockIndex = 0;
        let currentCharInBlock = 0;
        
        const streamContent = () => {
            if (this.isPaused) {
                return;
            }

            if (currentBlockIndex >= blocks.length) {
                this.displayedText = text;
                this.markComplete();
                this.requestUpdate();
                return;
            }

            const currentBlock = blocks[currentBlockIndex];
            
            if (currentBlock.isComplex) {
                // Show complex blocks immediately (code blocks, headers, etc.)
                currentBlockIndex++;
                currentCharInBlock = 0;
            } else {
                // Animate simple text blocks character by character
                const chunkSize = this.getChunkSize();
                const blockText = currentBlock.content;
                const newCharCount = Math.min(currentCharInBlock + chunkSize, blockText.length);
                
                if (newCharCount >= blockText.length) {
                    // Finished this block, move to next
                    currentBlockIndex++;
                    currentCharInBlock = 0;
                } else {
                    currentCharInBlock = newCharCount;
                }
            }
            
            // Build the displayed content
            this.displayedText = this._buildDisplayedContent(blocks, currentBlockIndex, currentCharInBlock);
            this.requestUpdate();

            if (currentBlockIndex < blocks.length) {
                this.animationId = requestAnimationFrame(streamContent);
            } else {
                this.displayedText = text;
                this.markComplete();
            }
        };

        this.animationId = requestAnimationFrame(streamContent);
    }

    _parseHTMLBlocks(htmlText) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;
        
        const blocks = [];
        const complexSelectors = [
            '.code-block-container',
            '.math-block-container', 
            '.math-inline',
            'pre',
            'code',
            'table',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            '.enhanced-table',
            '.enhanced-blockquote',
            '[class*="hljs"]',
            '[class*="katex"]'
        ];
        
        // Walk through child nodes
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                if (text.trim()) {
                    blocks.push({
                        content: text,
                        html: text,
                        isComplex: false
                    });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if this is a complex element
                const isComplex = complexSelectors.some(selector => {
                    if (selector.startsWith('.')) {
                        return node.classList.contains(selector.slice(1));
                    } else if (selector.startsWith('[')) {
                        // Handle attribute selectors like [class*="hljs"]
                        if (selector.includes('class*=')) {
                            const className = selector.match(/class\*="([^"]+)"/)?.[1];
                            return className && Array.from(node.classList).some(cls => cls.includes(className));
                        }
                    } else {
                        return node.tagName.toLowerCase() === selector.toLowerCase();
                    }
                    return false;
                });
                
                if (isComplex) {
                    // Treat complex elements as single blocks
                    blocks.push({
                        content: node.outerHTML,
                        html: node.outerHTML,
                        isComplex: true
                    });
                } else {
                    // Process children of simple elements
                    if (node.childNodes.length > 0) {
                        // If it has children, process them
                        Array.from(node.childNodes).forEach(processNode);
                    } else {
                        // Leaf element with no children
                        const text = node.textContent || '';
                        if (text.trim()) {
                            blocks.push({
                                content: text,
                                html: node.outerHTML,
                                isComplex: false
                            });
                        }
                    }
                }
            }
        };
        
        Array.from(tempDiv.childNodes).forEach(processNode);
        
        // If no blocks found, treat the whole thing as one block
        if (blocks.length === 0) {
            blocks.push({
                content: htmlText,
                html: htmlText,
                isComplex: this._isComplexHTML(htmlText)
            });
        }
        
        return blocks;
    }

    _isComplexHTML(htmlText) {
        const complexPatterns = [
            /class="code-block-container"/,
            /class="math-block-container"/,
            /class="math-inline"/,
            /class="enhanced-table"/,
            /class="enhanced-blockquote"/,
            /class="[^"]*hljs[^"]*"/,
            /class="[^"]*katex[^"]*"/,
            /<(pre|code|table|h[1-6])[^>]*>/i
        ];
        
        return complexPatterns.some(pattern => pattern.test(htmlText));
    }

    _buildDisplayedContent(blocks, currentBlockIndex, currentCharInBlock) {
        let result = '';
        
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            
            if (i < currentBlockIndex) {
                // Completed blocks - show in full
                result += block.html;
            } else if (i === currentBlockIndex) {
                // Current block being animated
                if (block.isComplex) {
                    // Complex blocks appear immediately
                    result += block.html;
                } else {
                    // Simple blocks are animated character by character
                    const truncatedText = block.content.slice(0, currentCharInBlock);
                    if (block.html !== block.content) {
                        // This is wrapped in HTML, need to preserve wrapper
                        const wrapper = block.html.replace(block.content, truncatedText);
                        result += wrapper;
                    } else {
                        result += truncatedText;
                    }
                }
            }
            // Future blocks (i > currentBlockIndex) are not shown yet
        }
        
        return result;
    }

    processFade(text) {
        this.displayedText = text;
        this.updateSegments(text);
        this.markComplete();
        this.requestUpdate();
    }

    startAnimation() {
        this.reset();
        
        if (!this.text) return;

        console.log('🎬 Starting text stream animation:', {
            mode: this.mode,
            textLength: this.text.length,
            textPreview: this.text.substring(0, 100) + '...',
            hasHTML: /<[^>]*>/g.test(this.text)
        });

        if (this.mode === 'typewriter') {
            this.processTypewriter(this.text);
        } else if (this.mode === 'fade') {
            this.processFade(this.text);
        }
    }

    pause() {
        this.isPaused = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (this.isPaused && this.mode === 'typewriter' && !this.isComplete) {
            this.isPaused = false;
            this.processTypewriter(this.text);
        }
    }

    renderTypewriter() {
        return html`
            <div class="text-stream-container">
                <span .innerHTML=${this.displayedText}></span>${this.isComplete ? '' : html`<span class="typewriter-cursor"></span>`}
            </div>
        `;
    }

    renderFade() {
        if (this.segments.length === 0) {
            return html`<div class="text-stream-container"></div>`;
        }

        const fadeDuration = this.getFadeDuration();
        const segmentDelay = this.getSegmentDelay();

        return html`
            <div class="text-stream-container">
                ${this.segments.map((segment, idx) => {
                    const isWhitespace = /^\s+$/.test(segment.text);
                    const classes = isWhitespace ? 'fade-segment fade-segment-space' : 'fade-segment';
                    
                    return html`
                        <span 
                            class="${classes}"
                            style="
                                animation-duration: ${fadeDuration}ms;
                                animation-delay: ${idx * segmentDelay}ms;
                                animation-name: fadeIn;
                                animation-fill-mode: forwards;
                                animation-timing-function: ease-out;
                            "
                            .innerHTML=${segment.text}
                        ></span>
                    `;
                })}
            </div>
        `;
    }

    render() {
        if (this.mode === 'fade') {
            return this.renderFade();
        }
        return this.renderTypewriter();
    }
}

customElements.define('buddy-text-stream', BuddyTextStream);

export { BuddyTextStream };