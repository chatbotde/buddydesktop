class BaseAIProvider {
    constructor(apiKey, profile, language) {
        this.apiKey = apiKey;
        this.profile = profile;
        this.language = language;
        this.session = null;
    }

    async initialize() {
        throw new Error('Initialize method must be implemented');
    }

    async sendRealtimeInput(input) {
        throw new Error('SendRealtimeInput method must be implemented');
    }

    async stopStreaming() {
        // Base implementation: stop any ongoing streaming
        // Subclasses may override for provider-specific stop behavior
        console.log('🛑 BaseAIProvider: Stopping streaming...');
        
        // For most providers, stopping streaming means interrupting the current session
        if (this.session) {
            // If the session has a specific stop method, use it
            if (typeof this.session.stop === 'function') {
                await this.session.stop();
                console.log('✅ Session stopped via session.stop()');
            } else if (typeof this.session.abort === 'function') {
                await this.session.abort();
                console.log('✅ Session aborted via session.abort()');
            } else {
                console.log('⚠️ Session does not support stopping, will continue normally');
            }
        }
    }

    async close() {
        // Base implementation: cleanup session and memory
        // Subclasses may override for provider-specific cleanup
        if (this.session) {
            // Only call close if the session has a close method (like Google's real-time API)
            if (typeof this.session.close === 'function') {
                await this.session.close();
            }
            this.session = null;
        }
    }
}

module.exports = BaseAIProvider; 