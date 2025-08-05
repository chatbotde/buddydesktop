/**
 * Progressive Markdown Processor
 * Processes markdown elements in real-time as text streams
 */

export class ProgressiveMarkdownProcessor {
    constructor() {
        this.patterns = {
            // Inline patterns that can be processed progressively
            bold: /\*\*([^*]+)\*\*/g,
            italic: /\*([^*]+)\*/g,
            inlineCode: /`([^`]+)`/g,
            links: /\[([^\]]+)\]\(([^)]+)\)/g,
            strikethrough: /~~([^~]+)~~/g,
            
            // Block patterns that need complete lines
            headers: /^(#{1,6})\s+(.+)$/gm,
            listItems: /^[\s]*[-*+]\s+(.+)$/gm,
            numberedList: /^[\s]*\d+\.\s+(.+)$/gm,
            blockquote: /^>\s+(.+)$/gm,
            
            // Complex patterns
            codeBlocks: /```(\w+)?\n?([\s\S]*?)```/g,
            mathBlocks: /\$\$([^$]+)\$\$/g,
            inlineMath: /\$([^$\n]+)\$/g
        };
        
        this.pendingBuffer = '';
        this.processedCache = new Map();
    }

    /**
     * Process text incrementally as it streams
     * @param {string} newText - New text chunk
     * @param {string} fullText - Complete text so far
     * @returns {object} Processing result
     */
    processIncremental(newText, fullText) {
        // Add new text to pending buffer
        this.pendingBuffer += newText;
        
        const result = {
            processedText: '',
            hasCompleteElements: false,
            pendingElements: [],
            streamingElements: []
        };

        // Process complete inline elements first
        result.processedText = this.processInlineElements(this.pendingBuffer);
        
        // Check for complete block elements
        const completeBlocks = this.extractCompleteBlocks(fullText);
        result.hasCompleteElements = completeBlocks.length > 0;
        
        // Process streaming elements (partial blocks)
        result.streamingElements = this.identifyStreamingElements(this.pendingBuffer);
        
        return result;
    }

    /**
     * Process inline markdown elements that can be rendered immediately
     */
    processInlineElements(text) {
        let processed = text;
        
        // Bold text - only if complete
        processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong class="md-bold streaming">$1</strong>');
        
        // Italic text - only if complete
        processed = processed.replace(/\*([^*]+)\*/g, '<em class="md-italic streaming">$1</em>');
        
        // Inline code - only if complete
        processed = processed.replace(/`([^`]+)`/g, '<code class="md-inline-code streaming">$1</code>');
        
        // Links - only if complete
        processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
            '<a href="$2" class="md-link streaming" target="_blank">$1</a>');
        
        // Strikethrough - only if complete
        processed = processed.replace(/~~([^~]+)~~/g, '<del class="md-strikethrough streaming">$1</del>');
        
        return processed;
    }

    /**
     * Extract complete block elements from text
     */
    extractCompleteBlocks(fullText) {
        const blocks = [];
        
        // Headers - complete lines only
        const headerMatches = [...fullText.matchAll(this.patterns.headers)];
        headerMatches.forEach(match => {
            const level = match[1].length;
            const text = match[2];
            blocks.push({
                type: 'header',
                level,
                text,
                html: `<h${level} class="md-header md-h${level} streaming">${text}</h${level}>`
            });
        });
        
        // List items - complete lines only
        const listMatches = [...fullText.matchAll(this.patterns.listItems)];
        listMatches.forEach(match => {
            blocks.push({
                type: 'list-item',
                text: match[1],
                html: `<li class="md-list-item streaming">${match[1]}</li>`
            });
        });
        
        // Blockquotes - complete lines only
        const quoteMatches = [...fullText.matchAll(this.patterns.blockquote)];
        quoteMatches.forEach(match => {
            blocks.push({
                type: 'blockquote',
                text: match[1],
                html: `<blockquote class="md-blockquote streaming">${match[1]}</blockquote>`
            });
        });
        
        return blocks;
    }

    /**
     * Identify elements that are currently being streamed (incomplete)
     */
    identifyStreamingElements(text) {
        const streaming = [];
        
        // Check for incomplete patterns
        if (text.includes('**') && (text.match(/\*\*/g) || []).length % 2 !== 0) {
            streaming.push({ type: 'bold', status: 'incomplete' });
        }
        
        if (text.includes('*') && (text.match(/\*/g) || []).length % 2 !== 0) {
            streaming.push({ type: 'italic', status: 'incomplete' });
        }
        
        if (text.includes('`') && (text.match(/`/g) || []).length % 2 !== 0) {
            streaming.push({ type: 'code', status: 'incomplete' });
        }
        
        if (text.includes('[') && !text.includes('](')) {
            streaming.push({ type: 'link', status: 'incomplete' });
        }
        
        // Check for incomplete code blocks
        if (text.includes('```')) {
            const codeBlockCount = (text.match(/```/g) || []).length;
            if (codeBlockCount % 2 !== 0) {
                streaming.push({ type: 'code-block', status: 'incomplete' });
            }
        }
        
        return streaming;
    }

    /**
     * Get CSS for streaming markdown animations
     */
    static getStreamingCSS() {
        return `
            .md-bold.streaming {
                animation: mdFadeIn 0.3s ease-in;
                font-weight: 600;
                color: var(--md-bold-color, inherit);
            }
            
            .md-italic.streaming {
                animation: mdFadeIn 0.3s ease-in;
                font-style: italic;
                color: var(--md-italic-color, inherit);
            }
            
            .md-inline-code.streaming {
                animation: mdFadeIn 0.3s ease-in;
                background: var(--md-code-bg, rgba(255, 255, 255, 0.1));
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'JetBrains Mono', 'Fira Code', monospace;
                font-size: 0.9em;
            }
            
            .md-link.streaming {
                animation: mdFadeIn 0.3s ease-in;
                color: var(--md-link-color, #3b82f6);
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: border-color 0.2s ease;
            }
            
            .md-link.streaming:hover {
                border-bottom-color: currentColor;
            }
            
            .md-header.streaming {
                animation: mdSlideIn 0.4s ease-out;
                margin: 1rem 0 0.5rem 0;
                font-weight: 700;
            }
            
            .md-h1.streaming { font-size: 2rem; }
            .md-h2.streaming { font-size: 1.5rem; }
            .md-h3.streaming { font-size: 1.25rem; }
            
            .md-blockquote.streaming {
                animation: mdSlideIn 0.4s ease-out;
                border-left: 3px solid var(--md-quote-border, #3b82f6);
                padding-left: 1rem;
                margin: 1rem 0;
                font-style: italic;
                opacity: 0.9;
            }
            
            .md-list-item.streaming {
                animation: mdFadeIn 0.3s ease-in;
                margin: 0.25rem 0;
            }
            
            @keyframes mdFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes mdSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(-10px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
        `;
    }

    /**
     * Reset processor state
     */
    reset() {
        this.pendingBuffer = '';
        this.processedCache.clear();
    }
}
