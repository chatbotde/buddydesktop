import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-text-stream.js';

class BuddyResponseStream extends LitElement {
    static properties = {
        textStream: { type: String },
        mode: { type: String },
        speed: { type: Number },
        fadeDuration: { type: Number },
        segmentDelay: { type: Number },
        chunkSize: { type: Number },
        isStreaming: { type: Boolean },
        autoStart: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        .response-container {
            position: relative;
            width: 100%;
        }

        .streaming-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-left: 8px;
            opacity: 0.7;
        }

        .streaming-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: var(--streaming-color, #666);
            animation: pulse 1.4s ease-in-out infinite both;
        }

        .streaming-dot:nth-child(1) { animation-delay: -0.32s; }
        .streaming-dot:nth-child(2) { animation-delay: -0.16s; }
        .streaming-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes pulse {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        buddy-text-stream {
            --cursor-color: var(--primary-color, #3b82f6);
        }
    `;

    constructor() {
        super();
        this.textStream = '';
        this.mode = 'typewriter';
        this.speed = 20;
        this.fadeDuration = null;
        this.segmentDelay = null;
        this.chunkSize = null;
        this.isStreaming = false;
        this.autoStart = true;
        this.isComplete = false;
    }

    updated(changedProperties) {
        if (changedProperties.has('textStream') && this.textStream) {
            this.startStreaming();
        }
    }

    startStreaming() {
        const textStreamElement = this.shadowRoot.querySelector('buddy-text-stream');
        if (textStreamElement) {
            textStreamElement.text = this.textStream;
            textStreamElement.mode = this.mode;
            textStreamElement.speed = this.speed;
            textStreamElement.fadeDuration = this.fadeDuration;
            textStreamElement.segmentDelay = this.segmentDelay;
            textStreamElement.chunkSize = this.chunkSize;
            textStreamElement.startAnimation();
        }
    }

    pause() {
        const textStreamElement = this.shadowRoot.querySelector('buddy-text-stream');
        if (textStreamElement) {
            textStreamElement.pause();
        }
    }

    resume() {
        const textStreamElement = this.shadowRoot.querySelector('buddy-text-stream');
        if (textStreamElement) {
            textStreamElement.resume();
        }
    }

    reset() {
        const textStreamElement = this.shadowRoot.querySelector('buddy-text-stream');
        if (textStreamElement) {
            textStreamElement.reset();
        }
        this.isComplete = false;
    }

    _onAnimationComplete(e) {
        this.isComplete = true;
        this.dispatchEvent(new CustomEvent('stream-complete', {
            detail: { text: e.detail.text },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="response-container">
                <buddy-text-stream
                    .text=${this.textStream}
                    .mode=${this.mode}
                    .speed=${this.speed}
                    .fadeDuration=${this.fadeDuration}
                    .segmentDelay=${this.segmentDelay}
                    .chunkSize=${this.chunkSize}
                    .autoStart=${this.autoStart}
                    @animation-complete=${this._onAnimationComplete}
                ></buddy-text-stream>
                ${this.isStreaming && !this.isComplete ? html`
                    <span class="streaming-indicator">
                        <span class="streaming-dot"></span>
                        <span class="streaming-dot"></span>
                        <span class="streaming-dot"></span>
                    </span>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('buddy-response-stream', BuddyResponseStream);

export { BuddyResponseStream };