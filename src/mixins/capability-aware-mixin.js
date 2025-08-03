/**
 * Capability Aware Mixin - Provides capability checking functionality to components
 */

import { html, css } from '../lit-core-2.7.4.min.js';
import { 
    getCapabilityStatus, 
    isUIFeatureEnabled, 
    getDisabledFeatureMessage,
    getSuggestedModelsForCapability,
    CAPABILITY_TYPES
} from '../services/capability-service.js';

export const CapabilityAwareMixin = (superClass) => class extends superClass {
    static properties = {
        ...superClass.properties,
        selectedModel: { type: String },
        capabilityStatus: { type: Object }
    };

    constructor() {
        super();
        this.capabilityStatus = null;
    }

    /**
     * Update capability status when model changes
     */
    updated(changedProperties) {
        super.updated?.(changedProperties);
        
        if (changedProperties.has('selectedModel') && this.selectedModel) {
            this.capabilityStatus = getCapabilityStatus(this.selectedModel);
            this.onCapabilityStatusChanged?.(this.capabilityStatus);
        }
    }

    /**
     * Check if a UI feature is enabled for the current model
     */
    isFeatureEnabled(uiFeature) {
        return this.selectedModel ? isUIFeatureEnabled(this.selectedModel, uiFeature) : false;
    }

    /**
     * Get disabled feature message
     */
    getDisabledMessage(uiFeature) {
        const modelName = this.capabilityStatus?.modelName || 'Current model';
        return getDisabledFeatureMessage(uiFeature, modelName);
    }

    /**
     * Show capability notification to user
     */
    showCapabilityNotification(uiFeature, type = 'warning') {
        const message = this.getDisabledMessage(uiFeature);
        this.showNotification?.(message, type) || this._showDefaultNotification(message, type);
    }

    /**
     * Default notification implementation if component doesn't have one
     */
    _showDefaultNotification(message, type = 'warning') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'capability-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
                type === 'success'
                    ? 'rgba(34, 197, 94, 0.9)'
                    : type === 'warning'
                    ? 'rgba(251, 191, 36, 0.9)'
                    : type === 'error'
                    ? 'rgba(239, 68, 68, 0.9)'
                    : 'rgba(59, 130, 246, 0.9)'
            };
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    /**
     * Handle disabled feature click - show notification and suggest alternatives
     */
    handleDisabledFeatureClick(uiFeature, capability) {
        this.showCapabilityNotification(uiFeature);
        
        // Optionally suggest alternative models
        const suggestions = getSuggestedModelsForCapability(capability);
        if (suggestions.length > 0) {
            const suggestionMessage = `Try switching to: ${suggestions.slice(0, 3).join(', ')}`;
            setTimeout(() => {
                this.showNotification?.(suggestionMessage, 'info');
            }, 2000);
        }
    }

    /**
     * Create a disabled button with tooltip
     */
    createDisabledButton(content, uiFeature, capability, className = '') {
        return html`
            <button 
                class="${className} disabled-feature" 
                disabled
                title="${this.getDisabledMessage(uiFeature)}"
                @click=${() => this.handleDisabledFeatureClick(uiFeature, capability)}
            >
                ${content}
                <div class="disabled-overlay">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m4.9 4.9 14.2 14.2"></path>
                    </svg>
                </div>
            </button>
        `;
    }

    /**
     * Conditionally render UI element based on capability
     */
    renderIfCapable(uiFeature, capability, enabledContent, disabledContent = null) {
        if (this.isFeatureEnabled(uiFeature)) {
            return enabledContent;
        } else if (disabledContent) {
            return disabledContent;
        } else {
            // Return disabled version with notification
            return this.createDisabledButton(
                enabledContent, 
                uiFeature, 
                capability,
                'capability-disabled'
            );
        }
    }

    /**
     * Get capability indicator for UI
     */
    getCapabilityIndicator() {
        if (!this.capabilityStatus) return '';
        
        const indicators = [];
        if (this.capabilityStatus.hasVision) indicators.push('👁️');
        if (this.capabilityStatus.hasAudio) indicators.push('🎤');
        if (this.capabilityStatus.hasVideo) indicators.push('📹');
        if (this.capabilityStatus.hasRealtime) indicators.push('⚡');
        
        return indicators.join(' ');
    }

    /**
     * Get capability summary for display
     */
    getCapabilitySummary() {
        if (!this.capabilityStatus) return 'Loading...';
        
        const capabilities = [];
        if (this.capabilityStatus.hasText) capabilities.push('Text');
        if (this.capabilityStatus.hasVision) capabilities.push('Vision');
        if (this.capabilityStatus.hasAudio) capabilities.push('Audio');
        if (this.capabilityStatus.hasVideo) capabilities.push('Video');
        if (this.capabilityStatus.hasCode) capabilities.push('Code');
        if (this.capabilityStatus.hasRealtime) capabilities.push('Real-time');
        
        return capabilities.length > 0 ? capabilities.join(', ') : 'Text only';
    }
};

// CSS styles for disabled features
export const capabilityAwareStyles = css`
    .disabled-feature {
        position: relative;
        opacity: 0.5;
        cursor: not-allowed !important;
    }

    .disabled-feature:hover {
        opacity: 0.7;
    }

    .disabled-overlay {
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
        color: var(--error-color, #ef4444);
        pointer-events: none;
    }

    .capability-indicator {
        font-size: 12px;
        opacity: 0.7;
        margin-left: 8px;
    }

    .capability-summary {
        font-size: 11px;
        opacity: 0.6;
        margin-top: 2px;
    }

    .capability-disabled {
        background: rgba(239, 68, 68, 0.1) !important;
        border-color: rgba(239, 68, 68, 0.3) !important;
    }

    .capability-disabled:hover {
        background: rgba(239, 68, 68, 0.15) !important;
    }
`;