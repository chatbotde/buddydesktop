import { html, css, LitElement } from '../lit-core-2.7.4.min.js';

class BuddyHelpView extends LitElement {
    static properties = {
        isMacOS: { type: Boolean },
        isLinux: { type: Boolean },
    };

    static styles = css`
        :host { display: block; }
        .option-group {
            border-color: oklch(98.5% 0.001 106.423);
        }
    `;

    render() {
        // Platform detection fallback (if not passed as prop)
        const isMacOS = this.isMacOS ?? navigator.platform.toLowerCase().includes('mac');
        const isLinux = this.isLinux ?? navigator.platform.toLowerCase().includes('linux');
        return html`
            <div>
                <div class="option-group">
                    <span class="option-label">Community & Support</span>
                </div>

                <div class="option-group">
                    <span class="option-label">Keyboard Shortcuts</span>
                    <div class="description">
                        <strong>Window Movement:</strong><br />
                        <span class="key">${isMacOS ? 'Option' : 'Ctrl'}</span> + Arrow Keys - Move the window in 45px increments<br /><br />

                        <strong>Window Control:</strong><br />
                        <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> + <span class="key">M</span> - Toggle mouse events (click-through
                        mode)<br />
                        <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> + <span class="key">&bsol;</span> - Close window or go back<br /><br />

                        <strong>Text Input:</strong><br />
                        <span class="key">Enter</span> - Send text message to AI<br />
                        <span class="key">Shift</span> + <span class="key">Enter</span> - New line in text input
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">How to Use</span>
                    <div class="description">
                        1. <strong>Start a Session:</strong> Enter your Gemini API key and click "Start Session"<br />
                        2. <strong>Customize:</strong> Choose your profile and language in the settings<br />
                        3. <strong>Position Window:</strong> Use keyboard shortcuts to move the window to your desired location<br />
                        4. <strong>Click-through Mode:</strong> Use <span class="key">${isMacOS ? 'Cmd' : 'Ctrl'}</span> +
                        <span class="key">M</span> to make the window click-through<br />
                        5. <strong>Get AI Help:</strong> The AI will analyze your screen and audio to provide assistance<br />
                        6. <strong>Text Messages:</strong> Type questions or requests to the AI using the text input
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Supported Profiles</span>
                    <div class="description">
                        <strong>General Assistant:</strong> Ask anything - general knowledge, problem solving, creative tasks<br />
                        <strong>Job Interview:</strong> Get help with interview questions and responses<br />
                        <strong>Sales Call:</strong> Assistance with sales conversations and objection handling<br />
                        <strong>Business Meeting:</strong> Support for professional meetings and discussions<br />
                        <strong>Presentation:</strong> Help with presentations and public speaking<br />
                        <strong>Negotiation:</strong> Guidance for business negotiations and deals<br />
                        <strong>JEE Advanced Teacher:</strong> Educational explanations and teaching for JEE Advanced topics
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Audio Input</span>
                    <div class="description">
                        ${isMacOS 
                            ? html`<strong>macOS:</strong> Uses SystemAudioDump for system audio capture`
                            : isLinux
                              ? html`<strong>Linux:</strong> Uses microphone input`
                              : html`<strong>Windows:</strong> Uses loopback audio capture`}<br />
                        The AI listens to conversations and provides contextual assistance based on what it hears.
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-help-view', BuddyHelpView); 