// Enhanced system prompt management utilities

const { systemPrompts, getSystemPrompt, getAllProfiles, hasProfile } = require('../prompts');

class PromptManager {
    constructor() {
        this.customPrompts = new Map();
        this.promptHistory = [];
        this.maxHistorySize = 50;
    }

    /**
     * Get a system prompt with optional custom instructions
     * @param {string} profile - The profile name
     * @param {string} customPrompt - Custom instructions to append
     * @param {Object} options - Additional options
     * @returns {string} The complete system prompt
     */
    getPrompt(profile = 'default', customPrompt = '', options = {}) {
        const basePrompt = getSystemPrompt(profile, customPrompt);
        
        // Add timestamp if requested
        if (options.includeTimestamp) {
            const timestamp = new Date().toISOString();
            return `${basePrompt}\n\n[System timestamp: ${timestamp}]`;
        }

        // Add context if provided
        if (options.context) {
            return `${basePrompt}\n\nAdditional Context: ${options.context}`;
        }

        return basePrompt;
    }

    /**
     * Save a custom prompt for a profile
     * @param {string} profile - The profile name
     * @param {string} customPrompt - The custom prompt to save
     */
    saveCustomPrompt(profile, customPrompt) {
        this.customPrompts.set(profile, customPrompt);
        this.addToHistory('save', { profile, customPrompt });
    }

    /**
     * Get saved custom prompt for a profile
     * @param {string} profile - The profile name
     * @returns {string} The saved custom prompt or empty string
     */
    getCustomPrompt(profile) {
        return this.customPrompts.get(profile) || '';
    }

    /**
     * Remove custom prompt for a profile
     * @param {string} profile - The profile name
     */
    removeCustomPrompt(profile) {
        this.customPrompts.delete(profile);
        this.addToHistory('remove', { profile });
    }

    /**
     * Get all available profiles with metadata
     * @returns {Array} Array of profile objects with metadata
     */
    getProfilesWithMetadata() {
        const profiles = getAllProfiles();
        return profiles.map(profile => ({
            id: profile,
            name: this.formatProfileName(profile),
            description: this.getProfileDescription(profile),
            hasCustomPrompt: this.customPrompts.has(profile),
            customPrompt: this.getCustomPrompt(profile)
        }));
    }

    /**
     * Format profile name for display
     * @param {string} profile - The profile name
     * @returns {string} Formatted name
     */
    formatProfileName(profile) {
        return profile
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Get profile description
     * @param {string} profile - The profile name
     * @returns {string} Profile description
     */
    getProfileDescription(profile) {
        const descriptions = {
            default: 'General-purpose assistant for problem-solving and analysis',
            general: 'Helpful AI assistant for various tasks',
            interview: 'Job interview preparation and practice',
            sales: 'Sales conversations and objection handling',
            meeting: 'Business meeting assistance and facilitation',
            math_teacher: 'Mathematics instruction with step-by-step solutions',
            physics_teacher: 'Physics concepts with real-world applications',
            chemistry_teacher: 'Chemistry instruction with molecular understanding',
            troubleshooter: 'Code debugging and problem resolution',
            screen_analyzer: 'Screen content analysis and insights',
            code_reviewer: 'Code quality analysis and improvement suggestions',
            technical_writer: 'Technical documentation and writing assistance',
            system_admin: 'System administration and DevOps guidance',
            data_analyst: 'Data analysis and statistical interpretation'
        };
        return descriptions[profile] || 'Specialized AI assistant profile';
    }

    /**
     * Validate a profile exists
     * @param {string} profile - The profile name
     * @returns {boolean} True if profile exists
     */
    validateProfile(profile) {
        return hasProfile(profile);
    }

    /**
     * Create a conversation context with system prompt
     * @param {Array} messages - Array of message objects
     * @param {string} profile - The profile name
     * @param {string} customPrompt - Custom instructions
     * @returns {Object} Conversation context object
     */
    createConversationContext(messages, profile = 'default', customPrompt = '') {
        const systemPrompt = this.getPrompt(profile, customPrompt);
        
        return {
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            profile,
            systemPrompt,
            messageCount: messages.length,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Add action to history
     * @param {string} action - The action performed
     * @param {Object} data - Action data
     */
    addToHistory(action, data) {
        this.promptHistory.unshift({
            action,
            data,
            timestamp: new Date().toISOString()
        });

        // Keep history size manageable
        if (this.promptHistory.length > this.maxHistorySize) {
            this.promptHistory = this.promptHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Get prompt history
     * @param {number} limit - Maximum number of entries to return
     * @returns {Array} History entries
     */
    getHistory(limit = 10) {
        return this.promptHistory.slice(0, limit);
    }

    /**
     * Export prompt configuration
     * @returns {Object} Configuration object
     */
    exportConfig() {
        return {
            customPrompts: Object.fromEntries(this.customPrompts),
            history: this.promptHistory,
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import prompt configuration
     * @param {Object} config - Configuration object
     */
    importConfig(config) {
        if (config.customPrompts) {
            this.customPrompts = new Map(Object.entries(config.customPrompts));
        }
        if (config.history) {
            this.promptHistory = config.history;
        }
        this.addToHistory('import', { importedAt: new Date().toISOString() });
    }

    /**
     * Reset all custom prompts
     */
    resetAll() {
        this.customPrompts.clear();
        this.addToHistory('reset_all', {});
    }

    /**
     * Get prompt statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        return {
            totalProfiles: getAllProfiles().length,
            customPromptsCount: this.customPrompts.size,
            historySize: this.promptHistory.length,
            mostUsedProfile: this.getMostUsedProfile(),
            lastActivity: this.promptHistory[0]?.timestamp || null
        };
    }

    /**
     * Get most used profile from history
     * @returns {string} Most used profile name
     */
    getMostUsedProfile() {
        const profileCounts = {};
        this.promptHistory.forEach(entry => {
            if (entry.data?.profile) {
                profileCounts[entry.data.profile] = (profileCounts[entry.data.profile] || 0) + 1;
            }
        });

        return Object.keys(profileCounts).reduce((a, b) => 
            profileCounts[a] > profileCounts[b] ? a : b, 'default'
        );
    }
}

// Create singleton instance
const promptManager = new PromptManager();

module.exports = {
    PromptManager,
    promptManager
};