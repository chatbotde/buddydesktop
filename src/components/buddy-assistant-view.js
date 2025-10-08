import { html, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-chat-message.js';
import { assistantStyles } from './ui/assistant-css.js';
import { tooltipContainer } from './css-componets/tooltip-css.js';
import { CapabilityAwareMixin, capabilityAwareStyles } from '../mixins/capability-aware-mixin.js';
import { CAPABILITY_TYPES } from '../services/capability-service.js';

class BuddyAssistantView extends CapabilityAwareMixin(LitElement) {
    static properties = {
        chatMessages: { type: Array },
        isStreamingActive: { type: Boolean },
        attachedScreenshots: { type: Array }, // Array of base64 screenshot data
        autoScreenshotEnabled: { type: Boolean }, // New property for auto screenshot
        isActionsMenuOpen: { type: Boolean },
        isWaitingForResponse: { type: Boolean }, // New property for loading state
        isStopping: { type: Boolean }, // New property for stopping animation
        isInputVisible: { type: Boolean }, // New property for input visibility toggle
    };

    constructor() {
        super();
        this.attachedScreenshots = [];
        this.autoScreenshotEnabled = false; // Enable auto screenshot by default
        this.hasTypedInCurrentSession = false; // Track if user has typed in current input session
        this.isActionsMenuOpen = false;
        this.isWaitingForResponse = false; // Initialize loading state
        this.isStopping = false; // Initialize stopping state
        this.isInputVisible = true; // Input is visible by default
        this.boundOutsideClickHandler = this._handleOutsideClick.bind(this);
        this.boundGlobalKeydownHandler = this._handleGlobalKeydown.bind(this);
        // Simple auto-scroll for input/output visibility
        this.isUserScrolledUp = false;
    }

    connectedCallback() {
        super.connectedCallback();
        // Set up scroll listener to detect when user scrolls up
        this.updateComplete.then(() => {
            this._setupScrollListener();
        });

        // Add global keydown listener for auto-focus functionality
        document.addEventListener('keydown', this.boundGlobalKeydownHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.boundOutsideClickHandler);
        document.removeEventListener('keydown', this.boundGlobalKeydownHandler);
        this._cleanupScrollListener();
    }

    _toggleActionsMenu() {
        this.isActionsMenuOpen = !this.isActionsMenuOpen;
        this.requestUpdate();
        if (this.isActionsMenuOpen) {
            setTimeout(() => {
                document.addEventListener('click', this.boundOutsideClickHandler);
            }, 0);
        } else {
            document.removeEventListener('click', this.boundOutsideClickHandler);
        }
    }

    _closeActionsMenu() {
        if (this.isActionsMenuOpen) {
            this.isActionsMenuOpen = false;
            document.removeEventListener('click', this.boundOutsideClickHandler);
            this.requestUpdate();
        }
    }

    _handleOutsideClick(e) {
        if (!this.renderRoot.querySelector('.actions-dropdown-container')?.contains(e.target)) {
            this._closeActionsMenu();
        }
    }

    _handleGlobalKeydown(e) {
        // More robust check for input elements
        const isInputElement =
            e.target.matches('input, textarea, [contenteditable], [contenteditable="true"]') ||
            e.target.closest('input, textarea, [contenteditable], [contenteditable="true"]') ||
            e.target.isContentEditable;

        // Ignore if already in an input field or if it's a special key
        if (isInputElement) return;

        // Ignore modifier keys, arrow keys, function keys, etc.
        const ignoredKeys = [
            'Shift',
            'Control',
            'Alt',
            'Meta',
            'CapsLock',
            'Tab',
            'Escape',
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'Home',
            'End',
            'PageUp',
            'PageDown',
            'Insert',
            'Delete',
            'F1',
            'F2',
            'F3',
            'F4',
            'F5',
            'F6',
            'F7',
            'F8',
            'F9',
            'F10',
            'F11',
            'F12',
        ];
        if (ignoredKeys.includes(e.key)) return;

        // Ignore shortcuts (Ctrl+, Cmd+, Alt+)
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        // Cache textarea reference for performance
        const textarea = this.renderRoot.querySelector('#textInput');
        if (!textarea) return;

        // Handle printable characters only for input injection
        if (e.key.length === 1) {
            e.preventDefault(); // Prevent typing in the wrong place
            textarea.focus();

            const currentValue = textarea.value;
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            // Insert the character at the cursor position
            const newValue = currentValue.substring(0, selectionStart) + e.key + currentValue.substring(selectionEnd);
            textarea.value = newValue;

            // Set cursor after the inserted character
            textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);

            // Trigger input event to handle any resize logic
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);

            // Handle auto screenshot on first keystroke
            this._onTextInput({ target: textarea });
        }
        // Handle special keys for focus only (no input injection)
        else if (e.key === 'Backspace' || e.key === 'Enter') {
            textarea.focus();
        }
    }
    _setupScrollListener() {
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (!chatContainer) return;

        this.boundScrollHandler = this._handleScroll.bind(this);
        chatContainer.addEventListener('scroll', this.boundScrollHandler);
    }

    _cleanupScrollListener() {
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (chatContainer && this.boundScrollHandler) {
            chatContainer.removeEventListener('scroll', this.boundScrollHandler);
        }
    }

    _handleScroll() {
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (!chatContainer) return;

        const scrollTop = chatContainer.scrollTop;
        const scrollHeight = chatContainer.scrollHeight;
        const clientHeight = chatContainer.clientHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        // Consider user "scrolled up" if they're more than 50px from bottom
        this.isUserScrolledUp = distanceFromBottom > 50;
    }

    _scrollToShowLatestMessage(force = false) {
        // Simple scroll to show the latest message
        const chatContainer = this.renderRoot.querySelector('.chat-container');
        if (!chatContainer) return;

        // Don't auto-scroll if user has scrolled up (unless forced)
        if (this.isUserScrolledUp && !force) {
            return;
        }

        // Use a slight delay to ensure DOM is updated
        setTimeout(() => {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth',
            });
        }, 100);
    }

    static styles = [assistantStyles, capabilityAwareStyles, tooltipContainer];

    async _onCaptureScreenshot() {
        this._closeActionsMenu();
        
        // Check if vision capability is available
        if (!this.isFeatureEnabled('screenshot-capture')) {
            this.handleDisabledFeatureClick('screenshot-capture', CAPABILITY_TYPES.VISION);
            return;
        }
        
        if (this.attachedScreenshots.length >= 3) {
            this._showNotification('Maximum 3 images allowed', 'warning');
            return;
        }

        try {
            // Request screenshot from renderer
            const screenshotData = await window.buddy.captureScreenshot();
            if (screenshotData) {
                this.attachedScreenshots = [...this.attachedScreenshots, screenshotData];
                this.requestUpdate();
                this._showNotification('Screenshot captured successfully!', 'success');
            }
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            this._showNotification('Failed to capture screenshot', 'error');
        }
    }

    async _captureAutoScreenshot() {
        if (!this.autoScreenshotEnabled || this.attachedScreenshots.length >= 3) {
            return;
        }

        try {
            const screenshotData = await window.buddy.captureScreenshot();
            if (screenshotData) {
                this.attachedScreenshots = [...this.attachedScreenshots, screenshotData];
                this.requestUpdate();
                console.log('auto-screenshot');
            }
        } catch (error) {
            console.error('auto-screenshot-error');
        }
    }

    _onRemoveScreenshot(index) {
        this.attachedScreenshots = this.attachedScreenshots.filter((_, i) => i !== index);
        this.requestUpdate();
    }

    _onClearAllScreenshots() {
        this.attachedScreenshots = [];
        this.requestUpdate();
    }

    _onViewScreenshot(screenshot) {
        // Open screenshot in a new window with consistent properties
        // Use the new createImageWindow function if available, fallback to window.open()
        if (window.buddy && window.buddy.createImageWindow) {
            window.buddy.createImageWindow(screenshot, 'Screenshot');
        } else {
            // Fallback to original method
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                    <head><title>Screenshot</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000;">
                        <img src="data:image/jpeg;base64,${screenshot}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                    </body>
                </html>
            `);
        }
    }

    _onSend() {
        const textarea = this.renderRoot.querySelector('#textInput');
        const text = textarea?.value.trim() || '';

        if (text || this.attachedScreenshots.length > 0) {
            // Set loading state
            this.isWaitingForResponse = true;
            this.requestUpdate();

            this.dispatchEvent(
                new CustomEvent('send-message', {
                    detail: {
                        text,
                        screenshots: [...this.attachedScreenshots], // Send array of screenshots
                    },
                    bubbles: true,
                    composed: true,
                })
            );
            textarea.value = '';
            this.attachedScreenshots = [];
            this.hasTypedInCurrentSession = false; // Reset for next message
            this.requestUpdate();

            // Scroll to show the user's input message (always force for user input)
            this._scrollToShowLatestMessage(true);
        }
    }

    _onStop() {
        // Immediately clear all loading/streaming states for instant feedback
        this.isWaitingForResponse = false;
        this.isStreamingActive = false;
        this.isStopping = false;
        this.requestUpdate();

        // Dispatch stop streaming event
        this.dispatchEvent(
            new CustomEvent('stop-streaming', {
                bubbles: true,
                composed: true,
            })
        );
    }

    _onKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this._onSend();
        }
    }

    _onTextInput(e) {
        // Handle auto screenshot on first keystroke
        if (this.autoScreenshotEnabled && !this.hasTypedInCurrentSession && e.target.value.length === 1) {
            this.hasTypedInCurrentSession = true;
            this._captureAutoScreenshot();
        }

        // Handle textarea resizing
        this._onResize(e);
    }

    _onResize(e) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    _onDelete(e) {
        this.dispatchEvent(new CustomEvent('delete-message', { detail: { id: e.detail.id }, bubbles: true, composed: true }));
    }

    _onCopy(message) {
        this.dispatchEvent(new CustomEvent('copy-message', { detail: { message }, bubbles: true, composed: true }));
    }

    _onMessageContentUpdated(e) {
        // Scroll to show assistant response when it starts streaming (only if user hasn't scrolled up)
        if (e.detail.isStreaming && e.detail.hasContent) {
            this._scrollToShowLatestMessage(); // Don't force - respect user scroll position
        }
    }

    // Method to clear loading state when response starts
    clearLoadingState() {
        this.isWaitingForResponse = false;
        this.isStopping = false;
        this.requestUpdate();
    }

    // Override updated to automatically clear loading state when streaming starts or messages change
    updated(changedProperties) {
        super.updated(changedProperties);

        // Clear loading state when streaming starts or when new messages arrive
        if (changedProperties.has('isStreamingActive') && this.isStreamingActive) {
            this.isWaitingForResponse = false;
        }

        // Clear loading state when new assistant messages arrive
        if (changedProperties.has('chatMessages') && this.chatMessages) {
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'assistant' && this.isWaitingForResponse) {
                this.isWaitingForResponse = false;
            }
        }

        // Scroll to show new messages when they arrive
        if (changedProperties.has('chatMessages') && this.chatMessages && this.chatMessages.length > 0) {
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];
            // Only scroll for new assistant messages (user messages are handled in _onSend)
            if (lastMessage && lastMessage.sender === 'assistant') {
                this._scrollToShowLatestMessage(); // Don't force - respect user scroll position
            }
        }

        // Re-setup scroll listener if needed
        if (changedProperties.has('chatMessages')) {
            this.updateComplete.then(() => {
                if (!this.boundScrollHandler) {
                    this._setupScrollListener();
                }
            });
        }
    }

    _toggleAutoScreenshot() {
        this.autoScreenshotEnabled = !this.autoScreenshotEnabled;
        this.requestUpdate();
        console.log('Auto screenshot:', this.autoScreenshotEnabled ? 'enabled' : 'disabled');
        this._closeActionsMenu();
    }

    _toggleInputVisibility() {
        this.isInputVisible = !this.isInputVisible;
        this.requestUpdate();
    }

    _onUploadImageClick() {
        // Check if vision capability is available
        if (!this.isFeatureEnabled('image-upload')) {
            this.handleDisabledFeatureClick('image-upload', CAPABILITY_TYPES.VISION);
            this._closeActionsMenu();
            return;
        }
        
        this.renderRoot.querySelector('#fileInput').click();
        this._closeActionsMenu();
    }

    _handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (this.attachedScreenshots.length >= 3) {
            console.warn('3-max');
            return;
        }

        const reader = new FileReader();
        reader.onload = event => {
            // event.target.result is the base64-encoded string
            const base64String = event.target.result.split(',')[1];
            this.attachedScreenshots = [...this.attachedScreenshots, base64String];
            this.requestUpdate();
        };
        reader.readAsDataURL(file);

        // Reset file input to allow selecting the same file again
        e.target.value = '';
    }

    // Handle paste events for images
    _handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Check if the pasted item is an image
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();

                // Check if vision capability is available
                if (!this.isFeatureEnabled('image-paste')) {
                    this.handleDisabledFeatureClick('image-paste', CAPABILITY_TYPES.VISION);
                    return;
                }

                if (this.attachedScreenshots.length >= 3) {
                    this._showNotification('Maximum 3 images allowed', 'warning');
                    return;
                }

                const file = item.getAsFile();
                if (file) {
                    // Show loading notification
                    this._showNotification('Processing pasted image...', 'info');

                    const reader = new FileReader();
                    reader.onload = event => {
                        // event.target.result is the base64-encoded string
                        const base64String = event.target.result.split(',')[1];
                        this.attachedScreenshots = [...this.attachedScreenshots, base64String];
                        this.requestUpdate();
                        this._showNotification('Image pasted successfully!', 'success');
                        console.log('Image pasted successfully');
                    };
                    reader.onerror = () => {
                        this._showNotification('Failed to process image', 'error');
                    };
                    reader.readAsDataURL(file);
                }
                break;
            }
        }
    }

    // Show notification to user
    _showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Handle drag and drop for images
    _handleDragOver(e) {
        // Check if vision capability is available
        if (!this.isFeatureEnabled('image-drag-drop')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    }

    _handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
    }

    _handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        // Reset styling
        e.currentTarget.classList.remove('drag-over');

        // Check if vision capability is available
        if (!this.isFeatureEnabled('image-drag-drop')) {
            this.handleDisabledFeatureClick('image-drag-drop', CAPABILITY_TYPES.VISION);
            return;
        }

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Check if it's an image file
                if (file.type.startsWith('image/')) {
                    if (this.attachedScreenshots.length >= 3) {
                        this._showNotification('Maximum 3 images allowed', 'warning');
                        return;
                    }

                    this._showNotification('Processing dropped image...', 'info');

                    const reader = new FileReader();
                    reader.onload = event => {
                        const base64String = event.target.result.split(',')[1];
                        this.attachedScreenshots = [...this.attachedScreenshots, base64String];
                        this.requestUpdate();
                        this._showNotification('Image dropped successfully!', 'success');
                    };
                    reader.onerror = () => {
                        this._showNotification('Failed to process dropped image', 'error');
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    // Test function for image paste functionality (can be called from console)
    testImagePaste() {
        console.log('Testing image paste functionality...');
        console.log('Available methods:');
        console.log('1. Copy an image to clipboard and paste with Ctrl+V');
        console.log('2. Drag and drop image files onto the text input');
        console.log('3. Use the "Attach image" button in the actions menu');
        console.log('4. Take screenshots with the "Capture screenshot" button');

        // Focus the textarea
        const textarea = this.renderRoot.querySelector('#textInput');
        if (textarea) {
            textarea.focus();
            this._showNotification('Ready to test image paste! Copy an image and press Ctrl+V', 'info');
        }
    }

    render() {
        const isAtLimit = this.attachedScreenshots.length >= 3;

        return html`
            <div class="assistant-view-root">
                <input type="file" id="fileInput" hidden accept="image/*" @change=${this._handleFileSelect} />
                <div class="chat-container">
                    ${!this.chatMessages || this.chatMessages.length === 0
                        ? html`
                              <div class="welcome-message">
                                  

                                  ${this.autoScreenshotEnabled
                                      ? html`
                                            <p style="font-size: 12px; opacity: 0.6; margin-top: 8px;">
                                                Auto-screen info on
                                            </p>
                                        `
                                      : ''}
                              </div>
                          `
                        : this.chatMessages.map(
                              message => html`
                                  <buddy-chat-message
                                      key=${message.id}
                                      .id=${message.id}
                                      .text=${message.text}
                                      .sender=${message.sender}
                                      .timestamp=${message.timestamp}
                                      .isStreaming=${message.isStreaming}
                                      .screenshots=${message.screenshots}
                                      .autoScreenshotEnabled=${this.autoScreenshotEnabled}
                                      @delete-message=${e => this._onDelete(e)}
                                      @copy-message=${() => this._onCopy(message)}
                                      @message-content-updated=${this._onMessageContentUpdated}
                                  ></buddy-chat-message>
                              `
                          )}
                    ${this.isWaitingForResponse
                        ? html`
                              <div class="loading-indicator ${this.isStopping ? 'stopping' : ''}">
                                  <div class="loading-dots">
                                      <div class="loading-dot"></div>
                                      <div class="loading-dot"></div>
                                      <div class="loading-dot"></div>
                                  </div>
                              </div>
                          `
                        : ''}
                </div>
                
                <!-- Toggle Input Button -->
                <div class="toggle-input-container">
                    <div class="tooltip-container">
                        <button class="toggle-input-btn" @click=${this._toggleInputVisibility}>
                            ${this.isInputVisible
                                ? html`
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                `
                                : html`
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                `}
                        </button>
                        <span class="tooltip">${this.isInputVisible ? 'Hide input' : 'Show input'}</span>
                    </div>
                </div>

                <!-- Chat Input Container -->
                ${this.isInputVisible ? html`
                <div
                    class="text-input-container ${this.isFeatureEnabled('image-drag-drop') ? 'drag-enabled' : 'drag-disabled'}"
                    @dragover=${this.autoScreenshotEnabled ? null : this._handleDragOver}
                    @dragleave=${this.autoScreenshotEnabled ? null : this._handleDragLeave}
                    @drop=${this.autoScreenshotEnabled ? null : this._handleDrop}
                >
                    ${this.attachedScreenshots.length > 0 && !this.autoScreenshotEnabled
                        ? html`
                              <div class="screenshots-preview">
                                  <div class="screenshots-header">
                                      <span class="screenshot-count">${this.attachedScreenshots.length}/3 images</span>
                                      <div class="tooltip-container">
                                          <button class="clear-all-btn" @click=${this._onClearAllScreenshots}>Clear all</button>
                                          <span class="tooltip">Clear all images</span>
                                      </div>
                                  </div>
                                  <div class="screenshots-grid">
                                      ${this.attachedScreenshots.map(
                                          (screenshot, index) => html`
                                              <div class="screenshot-item">
                                                  <div class="tooltip-container">
                                                      <img
                                                          src="data:image/jpeg;base64,${screenshot}"
                                                          alt="Attached image ${index + 1}"
                                                          @click=${() => this._onViewScreenshot(screenshot)}
                                                      />
                                                      <span class="tooltip">Click to view full size</span>
                                                  </div>
                                                  <div class="tooltip-container">
                                                      <button
                                                          class="screenshot-remove"
                                                          @click=${() => this._onRemoveScreenshot(index)}
                                                      >
                                                          ×
                                                      </button>
                                                      <span class="tooltip">Remove image</span>
                                                  </div>
                                                  <div class="screenshot-number">#${index + 1}</div>
                                              </div>
                                          `
                                      )}
                                  </div>
                              </div>
                          `
                        : ''}
                    <div class="input-row">
                        <div class="textarea-container">
                            <textarea
                                id="textInput"
                                rows="1"
                                placeholder="${this.autoScreenshotEnabled
                                    ? 'Ask me anything...'
                                    : 'Ask me anything...'}"
                                @keydown=${this._onKeydown}
                                @input=${this._onTextInput}
                                @paste=${this.autoScreenshotEnabled || !this.isFeatureEnabled('image-paste') ? null : this._handlePaste}
                            ></textarea>
                        </div>
                        <div class="action-buttons">
                            <div class="action-buttons-left">
                                <!-- Left side buttons can be added here if needed -->
                            </div>
                            <div class="action-buttons-right">
                                <div class="actions-dropdown-container">
                                    <div class="tooltip-container">
                                        <button class="action-btn" @click=${this._toggleActionsMenu}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="12" cy="5" r="1"></circle>
                                            <circle cx="12" cy="19" r="1"></circle>
                                        </svg>
                                        ${this.attachedScreenshots.length > 0 && !this.autoScreenshotEnabled
                                            ? html` <span class="screenshot-count-badge">${this.attachedScreenshots.length}</span> `
                                            : ''}
                                    </button>
                                    <span class="tooltip">More actions</span>
                                </div>

                                    ${this.isActionsMenuOpen
                                        ? html`
                                              <div class="actions-dropdown">
                                                  <!-- Model Capability Status -->
                                                  ${this.capabilityStatus ? html`
                                                      <div class="capability-status">
                                                          <div class="capability-model-name">${this.capabilityStatus.modelName}</div>
                                                          <div class="capability-summary">${this.getCapabilitySummary()}</div>
                                                      </div>
                                                      <div class="dropdown-divider"></div>
                                                  ` : ''}
                                                  
                                                  <!-- Auto Screenshot Toggle (Vision-dependent) -->
                                                  ${this.renderIfCapable(
                                                      'screenshot-capture',
                                                      CAPABILITY_TYPES.VISION,
                                                      html`
                                                          <button class="dropdown-item" @click=${this._toggleAutoScreenshot}>
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width="24"
                                                                  height="24"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  stroke-width="2"
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                              >
                                                                  <path
                                                                      d="M12 4.5v3m0 9v3m4.5-10.5l-2.12 2.12M6.62 17.38l-2.12 2.12M19.5 12h-3m-9 0H4.5m10.5 2.12-2.12 2.12M6.62 6.62 4.5 4.5"
                                                                  />
                                                              </svg>
                                                              <span class="dropdown-item-label">add screen info</span>
                                                              <span class="dropdown-item-value">${this.autoScreenshotEnabled ? 'ON' : 'OFF'}</span>
                                                          </button>
                                                      `
                                                  )}
                                                  
                                                  <!-- Image Upload (Vision-dependent) -->
                                                  ${!this.autoScreenshotEnabled ? this.renderIfCapable(
                                                      'image-upload',
                                                      CAPABILITY_TYPES.VISION,
                                                      html`
                                                          <button
                                                              class="dropdown-item ${isAtLimit ? 'at-limit' : ''}"
                                                              @click=${this._onUploadImageClick}
                                                              ?disabled=${this.isStreamingActive || isAtLimit}
                                                          >
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width="18"
                                                                  height="18"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  stroke-width="2"
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                              >
                                                                  <path
                                                                      d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                                                                  ></path>
                                                              </svg>
                                                              <span class="dropdown-item-label">Attach image</span>
                                                          </button>
                                                      `
                                                  ) : ''}
                                                  
                                                  <!-- Screenshot Capture (Vision-dependent) -->
                                                  ${!this.autoScreenshotEnabled ? this.renderIfCapable(
                                                      'screenshot-capture',
                                                      CAPABILITY_TYPES.VISION,
                                                      html`
                                                          <button
                                                              class="dropdown-item ${isAtLimit ? 'at-limit' : ''}"
                                                              @click=${this._onCaptureScreenshot}
                                                              ?disabled=${this.isStreamingActive || isAtLimit}
                                                          >
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width="18"
                                                                  height="18"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  stroke-width="2"
                                                                  stroke-linecap="round"
                                                                  stroke-linejoin="round"
                                                              >
                                                                  <path
                                                                      d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                                                                  ></path>
                                                                  <circle cx="12" cy="13" r="3"></circle>
                                                              </svg>
                                                              <span class="dropdown-item-label">Capture screenshot</span>
                                                          </button>
                                                      `
                                                  ) : ''}
                                              </div>
                                          `
                                        : ''}
                                </div>

                                ${this.isStreamingActive
                                    ? html`
                                          <div class="tooltip-container">
                                              <button class="stop-btn" @click=${this._onStop}>
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                              >
                                                  <rect x="6" y="6" width="12" height="12" rx="2" />
                                              </svg>
                                          </button>
                                          <span class="tooltip">Stop streaming</span>
                                      </div>
                                      `
                                    : html`
                                          <div class="tooltip-container">
                                              <button class="send-btn" @click=${this._onSend} ?disabled=${this.isWaitingForResponse}>
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="24"
                                                  height="24"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  stroke-width="2"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                  class="lucide lucide-arrow-up-icon lucide-arrow-up"
                                              >
                                                  <path d="m5 12 7-7 7 7" />
                                                  <path d="M12 19V5" />
                                              </svg>
                                          </button>
                                          <span class="tooltip">Send message</span>
                                      </div>
                                      `}
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('buddy-assistant-view', BuddyAssistantView);
