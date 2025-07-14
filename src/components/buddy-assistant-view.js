import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import './buddy-chat-message.js';
import { assistantStyles } from './ui/assistant-css.js';

class BuddyAssistantView extends LitElement {
    static properties = {
        chatMessages: { type: Array },
        isStreamingActive: { type: Boolean },
        attachedScreenshots: { type: Array }, // Array of base64 screenshot data
        autoScreenshotEnabled: { type: Boolean }, // New property for auto screenshot
        isActionsMenuOpen: { type: Boolean },
        isWaitingForResponse: { type: Boolean }, // New property for loading state

    };

    constructor() {
        super();
        this.attachedScreenshots = [];
        this.autoScreenshotEnabled = true; // Enable auto screenshot by default
        this.hasTypedInCurrentSession = false; // Track if user has typed in current input session
        this.isActionsMenuOpen = false;
        this.isWaitingForResponse = false; // Initialize loading state
        this.boundOutsideClickHandler = this._handleOutsideClick.bind(this);
        // Simple auto-scroll for input/output visibility
        this.isUserScrolledUp = false;
    }

    connectedCallback() {
        super.connectedCallback();
        // Set up scroll listener to detect when user scrolls up
        this.updateComplete.then(() => {
            this._setupScrollListener();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.boundOutsideClickHandler);
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
                behavior: 'smooth'
            });
        }, 100);
    }

    static styles = [assistantStyles];

    async _onCaptureScreenshot() {
        this._closeActionsMenu();
        if (this.attachedScreenshots.length >= 3) {
            console.warn('3-max');
            return;
        }
        
        try {
            // Request screenshot from renderer
            const screenshotData = await window.buddy.captureScreenshot();
            if (screenshotData) {
                this.attachedScreenshots = [...this.attachedScreenshots, screenshotData];
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
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
            
            this.dispatchEvent(new CustomEvent('send-message', { 
                detail: { 
                    text,
                    screenshots: [...this.attachedScreenshots] // Send array of screenshots
                }, 
                bubbles: true, 
                composed: true 
            }));
            textarea.value = '';
            this.attachedScreenshots = [];
            this.hasTypedInCurrentSession = false; // Reset for next message
            this.requestUpdate();
            
            // Scroll to show the user's input message (always force for user input)
            this._scrollToShowLatestMessage(true);
        }
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

    _onUploadImageClick() {
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
        reader.onload = (event) => {
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
                
                if (this.attachedScreenshots.length >= 3) {
                    this._showNotification('Maximum 3 images allowed', 'warning');
                    return;
                }

                const file = item.getAsFile();
                if (file) {
                    // Show loading notification
                    this._showNotification('Processing pasted image...', 'info');
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
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
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                         type === 'warning' ? 'rgba(251, 191, 36, 0.9)' : 
                         type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                         'rgba(59, 130, 246, 0.9)'};
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
                    reader.onload = (event) => {
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
                <input 
                    type="file" 
                    id="fileInput" 
                    hidden 
                    accept="image/*" 
                    @change=${this._handleFileSelect}
                />
                <div class="chat-container">
                    ${!this.chatMessages || this.chatMessages.length === 0 
                        ? html`
                            <div class="welcome-message">
                                <p>Welcome! Start a session to begin chatting with your AI assistant.</p>
                                <p style="font-size: 12px; opacity: 0.7; margin-top: 8px;">
                                    📷 <strong>Image support:</strong> Take screenshots, upload files, paste images with Ctrl+V, or drag & drop!
                                </p>
                                ${this.autoScreenshotEnabled ? html`
                                    <p style="font-size: 12px; opacity: 0.6; margin-top: 8px;">
                                        Auto-screenshot is enabled - a screenshot will be captured when you start typing
                                    </p>
                                ` : ''}
                            </div>
                          `
                        : this.chatMessages.map((message) => html`
                            <buddy-chat-message
                                key=${message.id}
                                .id=${message.id}
                                .text=${message.text}
                                .sender=${message.sender}
                                .timestamp=${message.timestamp}
                                .isStreaming=${message.isStreaming}
                                .screenshots=${message.screenshots}
                                @delete-message=${(e) => this._onDelete(e)}
                                @copy-message=${() => this._onCopy(message)}
                                @message-content-updated=${this._onMessageContentUpdated}
                            ></buddy-chat-message>
                          `)
                    }
                    ${this.isWaitingForResponse ? html`
                        <div class="loading-indicator">
                            <div class="loading-dots">
                                <div class="loading-dot"></div>
                                <div class="loading-dot"></div>
                                <div class="loading-dot"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="text-input-container"
                     @dragover=${this._handleDragOver}
                     @dragleave=${this._handleDragLeave}
                     @drop=${this._handleDrop}>
                    ${this.attachedScreenshots.length > 0 ? html`
                        <div class="screenshots-preview">
                            <div class="screenshots-header">
                                <span class="screenshot-count">${this.attachedScreenshots.length}/3 images</span>
                                <button class="clear-all-btn" @click=${this._onClearAllScreenshots} title="Clear all images">
                                    Clear all
                                </button>
                            </div>
                            <div class="screenshots-grid">
                                ${this.attachedScreenshots.map((screenshot, index) => html`
                                    <div class="screenshot-item">
                                        <img 
                                            src="data:image/jpeg;base64,${screenshot}" 
                                            alt="Attached image ${index + 1}" 
                                            @click=${() => this._onViewScreenshot(screenshot)}
                                            title="Click to view full size"
                                        />
                                        <button 
                                            class="screenshot-remove" 
                                            @click=${() => this._onRemoveScreenshot(index)}
                                            title="Remove image"
                                        >
                                            ×
                                        </button>
                                        <div class="screenshot-number">#${index + 1}</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    ` : ''}
                    <div class="input-row">
                        <textarea
                            id="textInput"
                            rows="1"
                            placeholder="${this.autoScreenshotEnabled ? 'Ask me anything... (auto-screenshot enabled) - Paste images with Ctrl+V or drag & drop' : 'Ask me anything... - Paste images with Ctrl+V or drag & drop'}"
                            @keydown=${this._onKeydown}
                            @input=${this._onTextInput}
                            @paste=${this._handlePaste}
                        ></textarea>
                        <div class="action-buttons">
                             <div class="actions-dropdown-container">
                                <button 
                                    class="action-btn"
                                    @click=${this._toggleActionsMenu}
                                    title="More actions"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                    ${this.attachedScreenshots.length > 0 ? html`
                                        <span class="screenshot-count-badge">${this.attachedScreenshots.length}</span>
                                    ` : ''}
                                </button>

                                ${this.isActionsMenuOpen ? html`
                                    <div class="actions-dropdown">
                                        <button class="dropdown-item" @click=${this._toggleAutoScreenshot}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5v3m0 9v3m4.5-10.5l-2.12 2.12M6.62 17.38l-2.12 2.12M19.5 12h-3m-9 0H4.5m10.5 2.12-2.12 2.12M6.62 6.62 4.5 4.5"/></svg>
                                            <span class="dropdown-item-label">Auto-screenshot</span>
                                            <span class="dropdown-item-value">${this.autoScreenshotEnabled ? 'ON' : 'OFF'}</span>
                                        </button>
                                        <button
                                            class="dropdown-item ${isAtLimit ? 'at-limit' : ''}"
                                            @click=${this._onUploadImageClick}
                                            ?disabled=${this.isStreamingActive || isAtLimit}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                            <span class="dropdown-item-label">Attach image</span>
                                        </button>
                                        <button
                                            class="dropdown-item ${isAtLimit ? 'at-limit' : ''}"
                                            @click=${this._onCaptureScreenshot}
                                            ?disabled=${this.isStreamingActive || isAtLimit}
                                        >
                                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                                                <circle cx="12" cy="13" r="3"></circle>
                                            </svg>
                                            <span class="dropdown-item-label">Capture screenshot</span>
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                           
                            <button
                                class="send-btn"
                                @click=${this._onSend}
                                title="Send message"
                                ?disabled=${this.isStreamingActive || this.isWaitingForResponse}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 18v-6H5l7-7 7 7h-4v6H9z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-assistant-view', BuddyAssistantView); 