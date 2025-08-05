import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { StreamingMarkdownProcessor } from './streaming-markdown-processor.js';

/**
 * Demo component for testing advanced markdown streaming
 */
class AdvancedStreamingDemo extends LitElement {
    static properties = {
        demoContent: { type: String },
        isStreaming: { type: Boolean },
        currentStrategy: { type: String },
        showAnalysis: { type: Boolean },
        streamingSpeed: { type: Number },
        enableProgressiveRendering: { type: Boolean },
        enableSmartChunking: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .demo-header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
        }

        .demo-header h1 {
            margin: 0 0 0.5rem 0;
            font-size: 2.5rem;
            font-weight: 700;
        }

        .demo-header p {
            margin: 0;
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .demo-controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .control-group label {
            font-weight: 600;
            color: var(--text-primary, #333);
            font-size: 0.9rem;
        }

        .control-group select,
        .control-group input {
            padding: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary, #333);
            font-size: 0.9rem;
        }

        .control-group input[type="checkbox"] {
            width: auto;
            margin-right: 0.5rem;
        }

        .checkbox-wrapper {
            display: flex;
            align-items: center;
            margin-top: 0.25rem;
        }

        .demo-actions {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }

        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary, #333);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }

        .demo-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .content-input,
        .content-output {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
        }

        .content-input h3,
        .content-output h3 {
            margin: 0 0 1rem 0;
            color: var(--text-primary, #333);
            font-size: 1.1rem;
        }

        .content-input textarea {
            width: 100%;
            height: 300px;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.1);
            color: var(--text-primary, #333);
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 0.85rem;
            line-height: 1.5;
            resize: vertical;
        }

        .content-output {
            min-height: 300px;
            position: relative;
        }

        .output-area {
            min-height: 250px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 6px;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .analysis-panel {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }

        .analysis-panel h3 {
            margin: 0 0 1rem 0;
            color: var(--text-primary, #333);
        }

        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .analysis-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
        }

        .analysis-item .value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color, #3b82f6);
            margin-bottom: 0.25rem;
        }

        .analysis-item .label {
            font-size: 0.85rem;
            color: var(--text-secondary, #666);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .preset-buttons {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .preset-btn {
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary, #333);
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s ease;
        }

        .preset-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .preset-btn.active {
            background: var(--primary-color, #3b82f6);
            color: white;
            border-color: var(--primary-color, #3b82f6);
        }

        @media (max-width: 768px) {
            .demo-content {
                grid-template-columns: 1fr;
            }
            
            .demo-controls {
                grid-template-columns: 1fr;
            }
        }
    `;

    constructor() {
        super();
        this.isStreaming = false;
        this.currentStrategy = 'adaptive';
        this.showAnalysis = true;
        this.streamingSpeed = 25;
        this.enableProgressiveRendering = true;
        this.enableSmartChunking = true;
        
        this.processor = new StreamingMarkdownProcessor();
        this.analysisData = null;
        
        this.presets = {
            simple: {
                name: 'Simple Text',
                content: `# Hello World

This is a **simple** example of markdown streaming with some *italic* text and \`inline code\`.

Here's a list:
- Item one
- Item two
- Item three

> This is a blockquote with some important information.

That's it!`
            },
            complex: {
                name: 'Complex Mixed',
                content: `# Advanced Markdown Streaming Demo

This demo showcases **progressive markdown rendering** with multiple content types.

## Code Example

Here's some JavaScript code:

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55
\`\`\`

## Mathematical Expressions

Some inline math: $E = mc^2$ and a block equation:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

## Lists and Tables

### Features List
1. **Progressive rendering** - Elements appear as they're completed
2. **Smart chunking** - Respects content boundaries
3. **Visual feedback** - Shows formation progress
4. **Performance optimized** - Efficient memory usage

### Comparison Table

| Feature | Before | After |
|---------|--------|-------|
| Processing | All at once | Progressive |
| Chunking | Character-based | Content-aware |
| Feedback | None | Real-time |
| Performance | Good | Excellent |

## Conclusion

This new streaming approach provides a much more engaging and professional experience for users while maintaining excellent performance.`
            },
            realtime: {
                name: 'Real-time Example',
                content: `# Live Stream Processing

Simulating real-time markdown processing...

## Current Status
- ✅ Connection established
- ✅ Processing pipeline active
- 🔄 Streaming content...

\`\`\`json
{
  "status": "streaming",
  "progress": 0.75,
  "chunks_processed": 15,
  "elements_formed": {
    "headers": 3,
    "code_blocks": 2,
    "lists": 4,
    "emphasis": 12
  }
}
\`\`\`

Real-time markdown processing allows for immediate visual feedback as content arrives from the server. This creates a more responsive and engaging user experience.

> **Pro Tip**: Enable smart chunking for the best results with mixed content types.`
            }
        };
        
        this.demoContent = this.presets.simple.content;
        this.activePreset = 'simple';
    }

    selectPreset(presetKey) {
        this.activePreset = presetKey;
        this.demoContent = this.presets[presetKey].content;
        this.requestUpdate();
    }

    async startStreaming() {
        if (this.isStreaming) return;
        
        this.isStreaming = true;
        
        const outputArea = this.shadowRoot.querySelector('.output-area');
        outputArea.innerHTML = '';
        
        try {
            const result = await this.processor.streamContent(this.demoContent, outputArea, {
                enableProgressiveRendering: this.enableProgressiveRendering,
                enableSmartChunking: this.enableSmartChunking,
                chunkingStrategy: this.currentStrategy,
                streamingSpeed: this.streamingSpeed,
                showTypingIndicators: true
            });
            
            this.analysisData = result.analysis;
            this.requestUpdate();
        } catch (error) {
            console.error('Streaming error:', error);
            outputArea.innerHTML = `<div style="color: red;">Error: ${error.message}</div>`;
        } finally {
            this.isStreaming = false;
            this.requestUpdate();
        }
    }

    stopStreaming() {
        this.processor.stop();
        this.isStreaming = false;
        this.requestUpdate();
    }

    clearOutput() {
        const outputArea = this.shadowRoot.querySelector('.output-area');
        if (outputArea) {
            outputArea.innerHTML = '';
        }
        this.analysisData = null;
        this.requestUpdate();
    }

    updateContent(e) {
        this.demoContent = e.target.value;
        this.activePreset = null; // Clear preset selection
    }

    render() {
        return html`
            <div class="demo-header">
                <h1>🚀 Advanced Markdown Streaming</h1>
                <p>Experience progressive markdown rendering with smart chunking and real-time feedback</p>
            </div>

            <div class="demo-controls">
                <div class="control-group">
                    <label>Chunking Strategy</label>
                    <select .value=${this.currentStrategy} @change=${e => this.currentStrategy = e.target.value}>
                        <option value="adaptive">Adaptive (Recommended)</option>
                        <option value="sentence">Sentence-based</option>
                        <option value="paragraph">Paragraph-based</option>
                        <option value="word">Word-based</option>
                    </select>
                </div>

                <div class="control-group">
                    <label>Streaming Speed</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        .value=${this.streamingSpeed}
                        @input=${e => this.streamingSpeed = parseInt(e.target.value)}
                    >
                    <span>Speed: ${this.streamingSpeed}</span>
                </div>

                <div class="control-group">
                    <label>Features</label>
                    <div class="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            .checked=${this.enableProgressiveRendering}
                            @change=${e => this.enableProgressiveRendering = e.target.checked}
                        >
                        <span>Progressive Rendering</span>
                    </div>
                    <div class="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            .checked=${this.enableSmartChunking}
                            @change=${e => this.enableSmartChunking = e.target.checked}
                        >
                        <span>Smart Chunking</span>
                    </div>
                    <div class="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            .checked=${this.showAnalysis}
                            @change=${e => this.showAnalysis = e.target.checked}
                        >
                        <span>Show Analysis</span>
                    </div>
                </div>
            </div>

            <div class="demo-actions">
                <button 
                    class="btn btn-primary"
                    ?disabled=${this.isStreaming}
                    @click=${this.startStreaming}
                >
                    ${this.isStreaming ? '⏳ Streaming...' : '▶️ Start Streaming'}
                </button>
                
                <button 
                    class="btn btn-secondary"
                    ?disabled=${!this.isStreaming}
                    @click=${this.stopStreaming}
                >
                    ⏹️ Stop
                </button>
                
                <button 
                    class="btn btn-secondary"
                    @click=${this.clearOutput}
                >
                    🗑️ Clear
                </button>
            </div>

            <div class="demo-content">
                <div class="content-input">
                    <h3>📝 Input Content</h3>
                    
                    <div class="preset-buttons">
                        ${Object.entries(this.presets).map(([key, preset]) => html`
                            <button 
                                class="preset-btn ${this.activePreset === key ? 'active' : ''}"
                                @click=${() => this.selectPreset(key)}
                            >
                                ${preset.name}
                            </button>
                        `)}
                    </div>
                    
                    <textarea 
                        .value=${this.demoContent}
                        @input=${this.updateContent}
                        placeholder="Enter your markdown content here..."
                    ></textarea>
                </div>

                <div class="content-output">
                    <h3>✨ Streaming Output</h3>
                    <div class="output-area"></div>
                </div>
            </div>

            ${this.showAnalysis && this.analysisData ? html`
                <div class="analysis-panel">
                    <h3>📊 Content Analysis</h3>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <div class="value">${this.analysisData.totalLength}</div>
                            <div class="label">Characters</div>
                        </div>
                        <div class="analysis-item">
                            <div class="value">${this.analysisData.sentenceCount}</div>
                            <div class="label">Sentences</div>
                        </div>
                        <div class="analysis-item">
                            <div class="value">${this.analysisData.codeBlockCount}</div>
                            <div class="label">Code Blocks</div>
                        </div>
                        <div class="analysis-item">
                            <div class="value">${this.analysisData.headerCount}</div>
                            <div class="label">Headers</div>
                        </div>
                        <div class="analysis-item">
                            <div class="value">${this.analysisData.complexity.toFixed(1)}</div>
                            <div class="label">Complexity</div>
                        </div>
                        <div class="analysis-item">
                            <div class="value">${this.analysisData.suggestedStrategy}</div>
                            <div class="label">Suggested Strategy</div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('advanced-streaming-demo', AdvancedStreamingDemo);
export { AdvancedStreamingDemo };
