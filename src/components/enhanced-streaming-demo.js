import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { EnhancedTextStream } from './enhanced-text-stream.js';

/**
 * Enhanced Streaming Demo Component
 * Demonstrates various streaming modes and configurations
 */
class EnhancedStreamingDemo extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .demo-section {
            margin-bottom: 40px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
        }

        .demo-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: #1f2937;
        }

        .demo-description {
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 15px;
        }

        .demo-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .demo-button {
            padding: 8px 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background-color 0.2s;
        }

        .demo-button:hover {
            background: #2563eb;
        }

        .demo-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }

        .demo-output {
            background: #ffffff;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 15px;
            min-height: 100px;
            position: relative;
        }

        .demo-stats {
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 10px;
            padding: 8px;
            background: #f3f4f6;
            border-radius: 4px;
        }

        .settings-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }

        .setting-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .setting-item label {
            font-size: 0.875rem;
            color: #374151;
        }

        .setting-item input[type="number"],
        .setting-item select {
            padding: 4px 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 0.875rem;
        }

        .setting-item input[type="checkbox"] {
            margin: 0;
        }
    `;

    static properties = {
        currentDemo: { type: String },
        isStreaming: { type: Boolean },
        streamingStats: { type: Object }
    };

    constructor() {
        super();
        this.currentDemo = 'progressive-markdown';
        this.isStreaming = false;
        this.streamingStats = {};
        this.demoTexts = this.initializeDemoTexts();
        this.settings = this.initializeSettings();
    }

    initializeDemoTexts() {
        return {
            'progressive-markdown': `# Progressive Markdown Demo

This demonstrates **real-time markdown processing** during streaming.

## Features

- \`Progressive rendering\` of markdown elements
- **Bold** and *italic* text formatting
- Code blocks with syntax highlighting:

\`\`\`javascript
function streamContent() {
    console.log('Streaming markdown content...');
    return 'Enhanced streaming system';
}
\`\`\`

> Blockquotes are rendered progressively
> 
> With multiple lines and formatting

### Lists work too:

1. First item with **bold text**
2. Second item with \`code\`
3. Third item with [links](https://example.com)

The system intelligently detects markdown boundaries and renders elements as they complete during the streaming process.`,

            'chunked-progressive': `# Chunked Progressive Rendering

This mode demonstrates post-streaming chunked rendering for optimal performance with large content.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.`,

            'combined': `# Combined Progressive + Chunked Rendering

This demonstrates the **best of both worlds** - progressive markdown during streaming followed by chunked optimization.

## Real-time Processing

The system first processes markdown elements progressively:

### Code Example

\`\`\`python
def enhanced_streaming():
    """
    Combines progressive markdown with chunked rendering
    """
    processor = ProgressiveMarkdownProcessor()
    chunker = ChunkedProgressiveRenderer()
    
    # Stream with progressive markdown
    result = processor.stream_content(content)
    
    # Follow up with chunked optimization
    chunker.optimize_rendering(result)
    
    return optimized_content
\`\`\`

## Post-Stream Optimization

After the initial streaming completes, the system switches to chunked progressive rendering for better performance with large content blocks.

This approach provides:

1. **Immediate feedback** - Users see content appearing in real-time
2. **Smooth experience** - No blocking during large content processing
3. **Optimal performance** - Chunked rendering prevents UI freezing
4. **Progressive enhancement** - Markdown elements render as they complete

> The combination of both modes creates the optimal user experience for any content size.`,

            'typewriter': `Classic typewriter effect streaming each character individually. This mode provides the traditional streaming experience without markdown processing. Perfect for simple text content or when you want the classic "typing" animation effect.`,

            'fade': `Fade animation mode renders text in segments with smooth fade-in effects. Each segment appears with configurable timing and duration. This creates an elegant reveal animation perfect for presentations or emphasized content delivery.`
        };
    }

    initializeSettings() {
        return {
            speed: 30,
            postRenderChunkSize: 100,
            enableChunkedRendering: false,
            showChunkProgress: true,
            showMarkdownPreview: false,
            fadeDuration: 800,
            segmentDelay: 50
        };
    }

    startDemo(demoType) {
        if (this.isStreaming) return;

        this.currentDemo = demoType;
        this.isStreaming = true;
        this.streamingStats = { startTime: Date.now(), mode: demoType };

        const streamElement = this.shadowRoot.querySelector('enhanced-text-stream');
        if (streamElement) {
            streamElement.remove();
        }

        this.requestUpdate();
    }

    stopDemo() {
        this.isStreaming = false;
        const streamElement = this.shadowRoot.querySelector('enhanced-text-stream');
        if (streamElement) {
            streamElement.pause();
        }
    }

    resetDemo() {
        this.isStreaming = false;
        this.streamingStats = {};
        const streamElement = this.shadowRoot.querySelector('enhanced-text-stream');
        if (streamElement) {
            streamElement.reset();
        }
        this.requestUpdate();
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        const streamElement = this.shadowRoot.querySelector('enhanced-text-stream');
        if (streamElement) {
            streamElement[key] = value;
        }
    }

    handleRenderingComplete(event) {
        this.isStreaming = false;
        this.streamingStats.endTime = Date.now();
        this.streamingStats.duration = this.streamingStats.endTime - this.streamingStats.startTime;
        this.requestUpdate();
    }

    getStreamElementConfig() {
        const baseConfig = {
            text: this.demoTexts[this.currentDemo] || '',
            speed: this.settings.speed,
            autoStart: true
        };

        switch (this.currentDemo) {
            case 'progressive-markdown':
                return {
                    ...baseConfig,
                    mode: 'progressive-markdown',
                    enableMarkdown: true,
                    showMarkdownPreview: this.settings.showMarkdownPreview
                };

            case 'chunked-progressive':
                return {
                    ...baseConfig,
                    mode: 'chunked-progressive',
                    enableChunkedRendering: true,
                    postRenderChunkSize: this.settings.postRenderChunkSize,
                    showChunkProgress: this.settings.showChunkProgress
                };

            case 'combined':
                return {
                    ...baseConfig,
                    mode: 'progressive-markdown',
                    enableMarkdown: true,
                    enableChunkedRendering: true,
                    postRenderChunkSize: this.settings.postRenderChunkSize,
                    showChunkProgress: this.settings.showChunkProgress,
                    showMarkdownPreview: this.settings.showMarkdownPreview
                };

            case 'typewriter':
                return {
                    ...baseConfig,
                    mode: 'typewriter',
                    enableMarkdown: false
                };

            case 'fade':
                return {
                    ...baseConfig,
                    mode: 'fade',
                    fadeDuration: this.settings.fadeDuration,
                    segmentDelay: this.settings.segmentDelay
                };

            default:
                return baseConfig;
        }
    }

    render() {
        const config = this.getStreamElementConfig();

        return html`
            <div class="demo-container">
                <h1>Enhanced Streaming System Demo</h1>

                <!-- Progressive Markdown Demo -->
                <div class="demo-section">
                    <div class="demo-title">Progressive Markdown Streaming</div>
                    <div class="demo-description">
                        Real-time markdown processing during text streaming with element completion animations.
                    </div>
                    <div class="demo-controls">
                        <button 
                            class="demo-button" 
                            ?disabled=${this.isStreaming}
                            @click=${() => this.startDemo('progressive-markdown')}>
                            Start Progressive Markdown
                        </button>
                    </div>
                    ${this.currentDemo === 'progressive-markdown' ? html`
                        <div class="demo-output">
                            <enhanced-text-stream
                                .text=${config.text}
                                .mode=${config.mode}
                                .speed=${config.speed}
                                .enableMarkdown=${config.enableMarkdown}
                                .showMarkdownPreview=${config.showMarkdownPreview}
                                .autoStart=${config.autoStart}
                                @rendering-complete=${this.handleRenderingComplete}>
                            </enhanced-text-stream>
                        </div>
                    ` : ''}
                </div>

                <!-- Chunked Progressive Demo -->
                <div class="demo-section">
                    <div class="demo-title">Chunked Progressive Rendering</div>
                    <div class="demo-description">
                        Post-streaming chunked rendering for optimal performance with large content.
                    </div>
                    <div class="demo-controls">
                        <button 
                            class="demo-button" 
                            ?disabled=${this.isStreaming}
                            @click=${() => this.startDemo('chunked-progressive')}>
                            Start Chunked Rendering
                        </button>
                    </div>
                    ${this.currentDemo === 'chunked-progressive' ? html`
                        <div class="demo-output">
                            <enhanced-text-stream
                                .text=${config.text}
                                .mode=${config.mode}
                                .enableChunkedRendering=${config.enableChunkedRendering}
                                .postRenderChunkSize=${config.postRenderChunkSize}
                                .showChunkProgress=${config.showChunkProgress}
                                .autoStart=${config.autoStart}
                                @rendering-complete=${this.handleRenderingComplete}>
                            </enhanced-text-stream>
                        </div>
                    ` : ''}
                </div>

                <!-- Combined Demo -->
                <div class="demo-section">
                    <div class="demo-title">Combined Progressive + Chunked</div>
                    <div class="demo-description">
                        Best of both worlds - progressive markdown followed by chunked optimization.
                    </div>
                    <div class="demo-controls">
                        <button 
                            class="demo-button" 
                            ?disabled=${this.isStreaming}
                            @click=${() => this.startDemo('combined')}>
                            Start Combined Mode
                        </button>
                    </div>
                    ${this.currentDemo === 'combined' ? html`
                        <div class="demo-output">
                            <enhanced-text-stream
                                .text=${config.text}
                                .mode=${config.mode}
                                .enableMarkdown=${config.enableMarkdown}
                                .enableChunkedRendering=${config.enableChunkedRendering}
                                .postRenderChunkSize=${config.postRenderChunkSize}
                                .showChunkProgress=${config.showChunkProgress}
                                .showMarkdownPreview=${config.showMarkdownPreview}
                                .autoStart=${config.autoStart}
                                @rendering-complete=${this.handleRenderingComplete}>
                            </enhanced-text-stream>
                        </div>
                    ` : ''}
                </div>

                <!-- Settings Panel -->
                <div class="demo-section">
                    <div class="demo-title">Settings</div>
                    <div class="settings-panel">
                        <div class="setting-item">
                            <label>Speed:</label>
                            <input 
                                type="number" 
                                .value=${this.settings.speed}
                                @change=${(e) => this.updateSetting('speed', parseInt(e.target.value))}
                                min="1" max="100">
                        </div>
                        <div class="setting-item">
                            <label>Chunk Size:</label>
                            <input 
                                type="number" 
                                .value=${this.settings.postRenderChunkSize}
                                @change=${(e) => this.updateSetting('postRenderChunkSize', parseInt(e.target.value))}
                                min="50" max="500">
                        </div>
                        <div class="setting-item">
                            <label>Show Progress:</label>
                            <input 
                                type="checkbox" 
                                .checked=${this.settings.showChunkProgress}
                                @change=${(e) => this.updateSetting('showChunkProgress', e.target.checked)}>
                        </div>
                        <div class="setting-item">
                            <label>MD Preview:</label>
                            <input 
                                type="checkbox" 
                                .checked=${this.settings.showMarkdownPreview}
                                @change=${(e) => this.updateSetting('showMarkdownPreview', e.target.checked)}>
                        </div>
                    </div>
                </div>

                <!-- Control Panel -->
                <div class="demo-section">
                    <div class="demo-title">Controls</div>
                    <div class="demo-controls">
                        <button class="demo-button" @click=${this.stopDemo}>Stop</button>
                        <button class="demo-button" @click=${this.resetDemo}>Reset</button>
                    </div>
                    ${this.streamingStats.duration ? html`
                        <div class="demo-stats">
                            Completed in ${this.streamingStats.duration}ms (Mode: ${this.streamingStats.mode})
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('enhanced-streaming-demo', EnhancedStreamingDemo);
export { EnhancedStreamingDemo };
