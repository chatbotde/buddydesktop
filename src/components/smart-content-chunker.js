/**
 * Smart Content Chunker for Enhanced Streaming
 * Intelligently splits content for optimal streaming experience
 */

export class SmartContentChunker {
    constructor() {
        this.patterns = {
            // Sentence boundaries
            sentenceEnd: /[.!?]+\s+/g,
            
            // Paragraph boundaries
            paragraphEnd: /\n\s*\n/g,
            
            // Code block boundaries
            codeBlock: /```[\s\S]*?```/g,
            
            // Math block boundaries  
            mathBlock: /\$\$[\s\S]*?\$\$/g,
            
            // List item boundaries
            listItem: /^[\s]*[-*+]\s+.*$/gm,
            
            // Header boundaries
            header: /^#{1,6}\s+.*$/gm,
            
            // Natural break points
            naturalBreaks: /[,;:\-—]\s+/g,
            
            // Word boundaries (fallback)
            wordBoundary: /\s+/g
        };
    }

    /**
     * Chunk content intelligently for streaming
     * @param {string} content - Content to chunk
     * @param {object} options - Chunking options
     * @returns {Array} Array of content chunks
     */
    chunkContent(content, options = {}) {
        const {
            maxChunkSize = 150,
            minChunkSize = 30,
            preserveElements = true,
            respectBoundaries = true,
            chunkingStrategy = 'adaptive' // 'adaptive', 'sentence', 'paragraph', 'word'
        } = options;

        if (!content) return [];

        // First, identify and preserve special elements
        const preservedElements = preserveElements ? this.identifySpecialElements(content) : [];
        
        let chunks = [];
        let currentPos = 0;

        switch (chunkingStrategy) {
            case 'sentence':
                chunks = this.chunkBySentences(content, maxChunkSize, minChunkSize);
                break;
            case 'paragraph':
                chunks = this.chunkByParagraphs(content, maxChunkSize, minChunkSize);
                break;
            case 'word':
                chunks = this.chunkByWords(content, maxChunkSize);
                break;
            case 'adaptive':
            default:
                chunks = this.chunkAdaptively(content, maxChunkSize, minChunkSize, preservedElements);
                break;
        }

        // Post-process chunks
        return this.postProcessChunks(chunks, preservedElements);
    }

    /**
     * Identify special elements that should be preserved
     */
    identifySpecialElements(content) {
        const elements = [];
        
        // Code blocks
        const codeMatches = [...content.matchAll(this.patterns.codeBlock)];
        codeMatches.forEach(match => {
            elements.push({
                type: 'code-block',
                start: match.index,
                end: match.index + match[0].length,
                content: match[0],
                preserve: true
            });
        });

        // Math blocks
        const mathMatches = [...content.matchAll(this.patterns.mathBlock)];
        mathMatches.forEach(match => {
            elements.push({
                type: 'math-block',
                start: match.index,
                end: match.index + match[0].length,
                content: match[0],
                preserve: true
            });
        });

        // Headers
        const headerMatches = [...content.matchAll(this.patterns.header)];
        headerMatches.forEach(match => {
            elements.push({
                type: 'header',
                start: match.index,
                end: match.index + match[0].length,
                content: match[0],
                preserve: true
            });
        });

        return elements.sort((a, b) => a.start - b.start);
    }

    /**
     * Adaptive chunking strategy
     */
    chunkAdaptively(content, maxChunkSize, minChunkSize, preservedElements) {
        const chunks = [];
        let currentPos = 0;

        while (currentPos < content.length) {
            // Check if we're at a preserved element
            const preservedElement = preservedElements.find(el => 
                el.start <= currentPos && currentPos < el.end
            );

            if (preservedElement) {
                // Add the preserved element as a complete chunk
                chunks.push({
                    content: preservedElement.content,
                    type: preservedElement.type,
                    start: preservedElement.start,
                    end: preservedElement.end,
                    isPreserved: true
                });
                currentPos = preservedElement.end;
                continue;
            }

            // Find the next preserved element
            const nextPreserved = preservedElements.find(el => el.start > currentPos);
            const maxEndPos = nextPreserved ? nextPreserved.start : content.length;
            
            // Determine chunk end position
            let chunkEnd = Math.min(currentPos + maxChunkSize, maxEndPos);
            
            // Try to find a good break point
            const goodBreakPoint = this.findGoodBreakPoint(
                content, 
                currentPos, 
                chunkEnd, 
                minChunkSize
            );
            
            if (goodBreakPoint > currentPos) {
                chunkEnd = goodBreakPoint;
            }

            // Extract chunk
            const chunkContent = content.slice(currentPos, chunkEnd);
            if (chunkContent.trim()) {
                chunks.push({
                    content: chunkContent,
                    type: 'text',
                    start: currentPos,
                    end: chunkEnd,
                    isPreserved: false
                });
            }

            currentPos = chunkEnd;
        }

        return chunks;
    }

    /**
     * Find a good break point for chunking
     */
    findGoodBreakPoint(content, start, maxEnd, minChunkSize) {
        const segment = content.slice(start, maxEnd);
        const minEnd = start + minChunkSize;

        // Try sentence boundaries first
        const sentences = [...segment.matchAll(this.patterns.sentenceEnd)];
        if (sentences.length > 0) {
            const lastSentence = sentences[sentences.length - 1];
            const sentenceEnd = start + lastSentence.index + lastSentence[0].length;
            if (sentenceEnd >= minEnd) {
                return sentenceEnd;
            }
        }

        // Try natural breaks
        const naturalBreaks = [...segment.matchAll(this.patterns.naturalBreaks)];
        if (naturalBreaks.length > 0) {
            const lastBreak = naturalBreaks[naturalBreaks.length - 1];
            const breakEnd = start + lastBreak.index + lastBreak[0].length;
            if (breakEnd >= minEnd) {
                return breakEnd;
            }
        }

        // Try word boundaries
        const words = [...segment.matchAll(this.patterns.wordBoundary)];
        if (words.length > 0) {
            const lastWord = words[words.length - 1];
            const wordEnd = start + lastWord.index;
            if (wordEnd >= minEnd) {
                return wordEnd;
            }
        }

        // Fallback to max end
        return maxEnd;
    }

    /**
     * Chunk by sentences
     */
    chunkBySentences(content, maxChunkSize, minChunkSize) {
        const chunks = [];
        const sentences = content.split(this.patterns.sentenceEnd);
        
        let currentChunk = '';
        for (const sentence of sentences) {
            if (!sentence.trim()) continue;
            
            if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length >= minChunkSize) {
                chunks.push({
                    content: currentChunk.trim(),
                    type: 'text',
                    isPreserved: false
                });
                currentChunk = sentence;
            } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
        
        if (currentChunk.trim()) {
            chunks.push({
                content: currentChunk.trim(),
                type: 'text',
                isPreserved: false
            });
        }
        
        return chunks;
    }

    /**
     * Chunk by paragraphs
     */
    chunkByParagraphs(content, maxChunkSize, minChunkSize) {
        const chunks = [];
        const paragraphs = content.split(this.patterns.paragraphEnd);
        
        for (const paragraph of paragraphs) {
            if (!paragraph.trim()) continue;
            
            if (paragraph.length > maxChunkSize) {
                // Split large paragraphs further
                const subChunks = this.chunkBySentences(paragraph, maxChunkSize, minChunkSize);
                chunks.push(...subChunks);
            } else {
                chunks.push({
                    content: paragraph.trim(),
                    type: 'text',
                    isPreserved: false
                });
            }
        }
        
        return chunks;
    }

    /**
     * Chunk by words (simple fallback)
     */
    chunkByWords(content, maxChunkSize) {
        const chunks = [];
        const words = content.split(/\s+/);
        
        let currentChunk = '';
        for (const word of words) {
            if (currentChunk.length + word.length + 1 > maxChunkSize && currentChunk) {
                chunks.push({
                    content: currentChunk.trim(),
                    type: 'text',
                    isPreserved: false
                });
                currentChunk = word;
            } else {
                currentChunk += (currentChunk ? ' ' : '') + word;
            }
        }
        
        if (currentChunk.trim()) {
            chunks.push({
                content: currentChunk.trim(),
                type: 'text',
                isPreserved: false
            });
        }
        
        return chunks;
    }

    /**
     * Post-process chunks for optimization
     */
    postProcessChunks(chunks, preservedElements) {
        // Merge very small chunks with adjacent text chunks
        const optimizedChunks = [];
        
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            
            // Skip empty chunks
            if (!chunk.content.trim()) continue;
            
            // If chunk is too small and not preserved, try to merge
            if (!chunk.isPreserved && chunk.content.length < 20) {
                const nextChunk = chunks[i + 1];
                if (nextChunk && !nextChunk.isPreserved) {
                    // Merge with next chunk
                    chunk.content += ' ' + nextChunk.content;
                    chunk.end = nextChunk.end;
                    i++; // Skip next chunk
                }
            }
            
            optimizedChunks.push(chunk);
        }
        
        return optimizedChunks;
    }

    /**
     * Analyze content and suggest optimal chunking strategy
     */
    analyzeContent(content) {
        const analysis = {
            totalLength: content.length,
            sentenceCount: (content.match(this.patterns.sentenceEnd) || []).length,
            paragraphCount: (content.match(this.patterns.paragraphEnd) || []).length,
            codeBlockCount: (content.match(this.patterns.codeBlock) || []).length,
            mathBlockCount: (content.match(this.patterns.mathBlock) || []).length,
            headerCount: (content.match(this.patterns.header) || []).length,
            listItemCount: (content.match(this.patterns.listItem) || []).length
        };

        // Suggest strategy based on content
        let suggestedStrategy = 'adaptive';
        if (analysis.codeBlockCount > 0 || analysis.mathBlockCount > 0) {
            suggestedStrategy = 'adaptive'; // Preserve special elements
        } else if (analysis.paragraphCount > 2) {
            suggestedStrategy = 'paragraph';
        } else if (analysis.sentenceCount > 5) {
            suggestedStrategy = 'sentence';
        }

        return {
            ...analysis,
            suggestedStrategy,
            averageSentenceLength: analysis.totalLength / Math.max(1, analysis.sentenceCount),
            complexity: this.calculateComplexity(analysis)
        };
    }

    /**
     * Calculate content complexity score
     */
    calculateComplexity(analysis) {
        let complexity = 0;
        
        // Base complexity from length
        complexity += Math.min(analysis.totalLength / 1000, 5);
        
        // Add complexity for special elements
        complexity += analysis.codeBlockCount * 2;
        complexity += analysis.mathBlockCount * 2;
        complexity += analysis.headerCount * 0.5;
        complexity += analysis.listItemCount * 0.2;
        
        // Normalize to 1-10 scale
        return Math.min(Math.max(complexity, 1), 10);
    }
}
