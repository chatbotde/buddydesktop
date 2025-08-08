import { html, css, LitElement } from '../lit-core-2.7.4.min.js';
import { chatMessageStyles } from './ui/chat-message-css.js';
import { ThemeMixin, themeManager } from './theme.js';
import { CodeBlockProcessor } from './code-block.js';
import { enhancedContentProcessor } from './enhanced-content-processor.js';
import './buddy-response-stream.js';
import './unified-code-block.js';

class BuddyChatMessage extends ThemeMixin(LitElement) {
    static properties = {
        id: { type: String },
        text: { type: String },
        sender: { type: String },
        timestamp: { type: String },
        isStreaming: { type: Boolean },
        screenshots: { type: Array }, // Array of base64 screenshot data
        autoScreenshotEnabled: { type: Boolean }, // New property for auto screenshot
        isViewingHistory: { type: Boolean }, // Flag to indicate viewing historical messages
        isEditing: { type: Boolean },
        editableContent: { type: String },
        // Text stream animation properties
        streamMode: { type: String }, // 'typewriter' or 'fade'
        streamSpeed: { type: Number },
        streamFadeDuration: { type: Number },
        streamSegmentDelay: { type: Number },
        streamChunkSize: { type: Number },
        enableTextAnimation: { type: Boolean },
        // Theme properties are now handled by ThemeMixin
    };

    constructor() {
        super();
        this.showCopyButton = false;
        this.isEditing = false;
        this.editableContent = '';
        this._processedContentCache = new Map(); // Cache for processed content
        
        // Text stream animation defaults
        this.streamMode = 'typewriter';
        this.streamSpeed = 25;
        this.streamFadeDuration = null;
        this.streamSegmentDelay = null;
        this.streamChunkSize = null;
        this.enableTextAnimation = true;
    }

    // Background theme options - now using centralized config
    static get backgroundThemes() {
        return themeManager.backgroundThemes;
    }

    _copyCode(codeId) {
        const codeElement = this.shadowRoot.getElementById(codeId);
        if (codeElement) {
            const code = codeElement.textContent || codeElement.innerText;
            navigator.clipboard
                .writeText(code)
                .then(() => {
                    // Show feedback
                    const copyBtn = this.shadowRoot.querySelector(`[onclick*="${codeId}"]`);
                    if (copyBtn) {
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        Copied!
                    `;
                        copyBtn.style.color = '#4ade80';

                        setTimeout(() => {
                            copyBtn.innerHTML = originalText;
                            copyBtn.style.color = '';
                        }, 2000);
                    }
                })
                .catch((err) => {
                    console.error('Failed to copy code: ', err);
                });
        }
    }

    /**
     * Copy math LaTeX source
     */
    _copyMath(mathId) {
        const mathContainer = this.shadowRoot.querySelector(`[data-math-id="${mathId}"]`);
        if (mathContainer) {
            const sourceElement = mathContainer.querySelector(`#${mathId}-source code`);
            if (sourceElement) {
                const mathSource = sourceElement.textContent || sourceElement.innerText;
                navigator.clipboard
                    .writeText(mathSource)
                    .then(() => {
                        // Show feedback
                        const copyBtn = mathContainer.querySelector('.math-copy-btn');
                        if (copyBtn) {
                            const originalText = copyBtn.innerHTML;
                            copyBtn.innerHTML = `
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                            Copied!
                        `;
                            copyBtn.style.color = '#4ade80';

                            setTimeout(() => {
                                copyBtn.innerHTML = originalText;
                                copyBtn.style.color = '';
                            }, 2000);
                        }
                    })
                    .catch((err) => {
                        console.error('Failed to copy math: ', err);
                    });
            }
        }
    }

    /**
     * Toggle between rendered math and LaTeX source
     */
    _toggleMathSource(mathId) {
        const renderedElement = this.shadowRoot.getElementById(`${mathId}-rendered`);
        const sourceElement = this.shadowRoot.getElementById(`${mathId}-source`);
        const toggleBtn = this.shadowRoot.querySelector(`[data-math-id="${mathId}"] .math-toggle-btn`);
        
        if (renderedElement && sourceElement && toggleBtn) {
            const isShowingSource = sourceElement.style.display !== 'none';
            
            if (isShowingSource) {
                // Show rendered
                renderedElement.style.display = 'block';
                sourceElement.style.display = 'none';
                toggleBtn.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    Source
                `;
            } else {
                // Show source
                renderedElement.style.display = 'none';
                sourceElement.style.display = 'block';
                toggleBtn.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                    </svg>
                    Render
                `;
            }
        }
    }

    // Override the mixin's _processMessageContent to use enhanced content processor
    _processMessageContent(text) {
        if (!text) return '';

        console.log('🔍 _processMessageContent called with text:', text.substring(0, 100) + '...');
        console.log('🔍 Cache size:', this._processedContentCache.size);

        // Check cache first to prevent duplicate processing
        if (this._processedContentCache.has(text)) {
            console.log('✅ Found in cache, returning cached result');
            return this._processedContentCache.get(text);
        }

        // ⭐ SMART DUPLICATE DETECTION: Check if content is already rendered
        if (this._isContentAlreadyRendered(text)) {
            console.log('✅ Content already rendered, skipping processing');
            this._processedContentCache.set(text, text); // Cache the original as-is
            return text;
        }

        console.log('🔄 Processing new content...');
        
        // Process code blocks with animation if streaming
        let processedContent;
        if (this.isStreaming && this.enableTextAnimation) {
            processedContent = this._processCodeBlocksWithAnimation(text);
        } else {
            processedContent = enhancedContentProcessor.processContentSync(text);
        }

        // Cache the result
        this._processedContentCache.set(text, processedContent);

        console.log('💾 Cached result, cache size now:', this._processedContentCache.size);
        console.log('💾 Processed content preview:', processedContent.substring(0, 200) + '...');

        // Add event listeners to links after processing
        setTimeout(() => this._setupLinkHandlers(), 0);

        return processedContent;
    }

    _processCodeBlocksWithAnimation(text) {
        if (!text) return '';

        // Replace code blocks with animated versions
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        
        return text.replace(codeBlockRegex, (match, language, code) => {
            // Preserve original indentation by not trimming
            const codeId = 'animated-code-' + Math.random().toString(36).substring(2, 11);
            
            // Return unified code block element
            return `<unified-code-block 
                id="${codeId}"
                code="${this._escapeAttribute(code)}" 
                language="${language || ''}" 
                show-header="true" 
                show-copy-button="true"
                writing="true"
                duration="3"
                cursor="true"
                auto-start="true"
            ></unified-code-block>`;
        });
    }

    _escapeAttribute(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Async version for future use
    async _processMessageContentAsync(text) {
        if (!text) return '';

        // Use the enhanced content processor for comprehensive rendering
        const processedContent = await enhancedContentProcessor.processContent(text);

        // Add event listeners to links after processing
        setTimeout(() => this._setupLinkHandlers(), 0);

        return processedContent;
    }

    async _openExternalLink(url) {
        try {
            await window.buddy.openExternal(url);
        } catch (error) {
            console.error('Failed to open external link:', error);
        }
    }

    _setupLinkHandlers() {
        const messageContent = this.shadowRoot.querySelector('.message-content');
        if (!messageContent) return;

        const links = messageContent.querySelectorAll('a[href]');
        links.forEach(link => {
            // Remove any existing click handlers
            link.removeEventListener('click', this._handleLinkClick);

            // Add our custom click handler
            link.addEventListener('click', this._handleLinkClick.bind(this));
        });
    }

    _handleLinkClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const url = e.target.href || e.target.getAttribute('href');
        if (url) {
            this._openExternalLink(url);
        }
    }

    static styles = [
        chatMessageStyles,
        css`
            /* Mixed content layout */
            .mixed-content {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .text-part {
                /* Text parts use default styling */
            }

            .code-part {
                margin: 8px 0;
            }

            /* Unified code block integration */
            unified-code-block {
                display: block;
                width: 100%;
            }

            /* Ensure code blocks fit well in chat messages */
            .message-content unified-code-block {
                max-width: 100%;
            }

            /* Smooth transitions */
            .text-part, .code-part {
                transition: opacity 0.3s ease;
            }
        `
    ];

    firstUpdated() {
        this._setupSelectionHandling();
        this._validateAndFixTheme();
    }

    _setupSelectionHandling() {
        const messageContent = this.shadowRoot.querySelector('.message-content');
        if (!messageContent) return;

        let selectionTimeout;

        // Handle text selection
        const handleSelection = e => {
            clearTimeout(selectionTimeout);
            selectionTimeout = setTimeout(() => {
                const selection = window.getSelection();
                const selectedText = selection.toString().trim();

                if (selectedText && selection.rangeCount > 0) {
                    // Check if the selection is within this message
                    const range = selection.getRangeAt(0);
                    const isWithinMessage =
                        messageContent.contains(range.commonAncestorContainer) ||
                        messageContent.contains(range.startContainer) ||
                        messageContent.contains(range.endContainer);

                    if (isWithinMessage) {
                        this._showSelectionCopyButton(selection);
                    } else {
                        this._hideSelectionCopyButton();
                    }
                } else {
                    this._hideSelectionCopyButton();
                }
            }, 150);
        };

        // Add event listeners for selection - focus on this message content
        messageContent.addEventListener('mouseup', handleSelection);
        messageContent.addEventListener('selectstart', handleSelection);
        document.addEventListener('selectionchange', handleSelection);

        // Hide copy button when clicking outside
        document.addEventListener('click', e => {
            if (!this._selectionCopyButton?.contains(e.target) && !messageContent.contains(e.target)) {
                this._hideSelectionCopyButton();
            }
        });

        // Clean up on disconnect
        this._selectionCleanup = () => {
            messageContent.removeEventListener('mouseup', handleSelection);
            messageContent.removeEventListener('selectstart', handleSelection);
            document.removeEventListener('selectionchange', handleSelection);
            clearTimeout(selectionTimeout);
        };
    }

    _onDelete() {
        this.dispatchEvent(new CustomEvent('delete-message', { detail: { id: this.id }, bubbles: true, composed: true }));
    }

    _onCopy() {
        const textToCopy = this.text || '';
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                console.log('Message copied to clipboard');
                // Optional: Show a brief success indicator
            })
            .catch(err => {
                console.error('Failed to copy message:', err);
            });
    }

    _onCopyMessage() {
        const textToCopy = this.text || '';
        const copyBtn = this.shadowRoot.querySelector('.message-copy-btn');
        
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                console.log('Message copied to clipboard');
                
                // Show success feedback
                if (copyBtn) {
                    copyBtn.classList.add('copied');
                    const originalHTML = copyBtn.innerHTML;
                    
                    copyBtn.innerHTML = `
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                    `;
                    
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = originalHTML;
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy message:', err);
            });
    }

    _onEdit() {
        this.isEditing = true;
        this.editableContent = this.text || '';
        this.requestUpdate();

        // Focus on textarea after render
        setTimeout(() => {
            const textarea = this.shadowRoot.querySelector('.edit-textarea');
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);

                // Set initial size based on content
                this._setInitialTextareaSize(textarea);
            }
        }, 0);
    }

    _onSave() {
        this.text = this.editableContent;
        this.isEditing = false;
        this.requestUpdate();

        // Dispatch event to notify parent of content change
        this.dispatchEvent(
            new CustomEvent('message-edited', {
                detail: {
                    id: this.id,
                    newText: this.text,
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    _onCancel() {
        this.isEditing = false;
        this.editableContent = '';
        this.requestUpdate();
    }

    _onTextareaInput(e) {
        this.editableContent = e.target.value;
    }

    _setInitialTextareaSize(textarea) {
        // Calculate initial height based on content
        const lines = this.editableContent.split('\n').length;
        const lineHeight = 20; // Approximate line height
        const padding = 24; // Top and bottom padding
        const minHeight = 100;

        // Calculate height based on content
        const contentHeight = Math.max(lines * lineHeight + padding, minHeight);
        textarea.style.height = `${contentHeight}px`;

        // Set minimum width to prevent shrinking
        textarea.style.minWidth = '100%';
        textarea.style.width = '100%';
    }

    _onScreenshotClick(screenshot) {
        // Open screenshot in a new window with consistent properties
        if (screenshot) {
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
    }

    _onStreamComplete(e) {
        // Dispatch event to notify parent that streaming animation is complete
        this.dispatchEvent(new CustomEvent('stream-animation-complete', {
            detail: { 
                id: this.id,
                text: e.detail.text 
            },
            bubbles: true,
            composed: true
        }));
    }

    _renderStreamingContent() {
        if (!this.text) return html``;

        // Check if the message contains code blocks
        const hasCodeBlocks = this._hasCodeBlocks(this.text);
        
        if (!hasCodeBlocks) {
            // No code blocks - use regular text streaming
            return html`
                <buddy-response-stream
                    .textStream=${this._processMessageContent(this.text)}
                    .mode=${this.streamMode}
                    .speed=${this.streamSpeed}
                    .fadeDuration=${this.streamFadeDuration}
                    .segmentDelay=${this.streamSegmentDelay}
                    .chunkSize=${this.streamChunkSize}
                    .isStreaming=${this.isStreaming}
                    @stream-complete=${this._onStreamComplete}
                ></buddy-response-stream>
            `;
        }

        // Has code blocks - split content and render parts
        return this._renderMixedContent();
    }

    _hasCodeBlocks(text) {
        const codeBlockRegex = /```[\w]*\n?[\s\S]*?```/g;
        return codeBlockRegex.test(text);
    }

    _renderMixedContent() {
        const parts = this._splitContentIntoParts(this.text);
        
        // Initialize streaming state if not already done
        if (!this._streamingState) {
            this._streamingState = {
                currentPartIndex: 0,
                isActive: this.isStreaming,
                parts: parts
            };
        }
        
        return html`
            <div class="mixed-content">
                ${parts.map((part, index) => {
                    const shouldAnimate = this.isStreaming && this._shouldPartAnimate(index);
                    const isCurrentPart = this._streamingState.currentPartIndex === index;
                    const shouldShow = !this.isStreaming || index <= this._streamingState.currentPartIndex;
                    
                    if (!shouldShow) {
                        return html``;
                    }
                    
                    if (part.type === 'text') {
                        return html`
                            <div class="text-part">
                                <buddy-response-stream
                                    .textStream=${this._processMessageContent(part.content)}
                                    .mode=${this.streamMode}
                                    .speed=${this.streamSpeed}
                                    .fadeDuration=${this.streamFadeDuration}
                                    .segmentDelay=${this.streamSegmentDelay}
                                    .chunkSize=${this.streamChunkSize}
                                    .isStreaming=${shouldAnimate && isCurrentPart}
                                    @stream-complete=${() => this._onPartComplete(index)}
                                ></buddy-response-stream>
                            </div>
                        `;
                    } else if (part.type === 'code') {
                        return html`
                            <div class="code-part">
                                <unified-code-block
                                    .code=${part.code}
                                    .language=${part.language}
                                    .writing=${shouldAnimate && isCurrentPart}
                                    .duration=${Math.max(2, part.code.length / 30)}
                                    .cursor=${true}
                                    .showHeader=${true}
                                    .showCopyButton=${true}
                                    .autoStart=${shouldAnimate && isCurrentPart}
                                    @animation-complete=${() => this._onPartComplete(index)}
                                    @code-copied=${this._onCodeCopied}
                                ></unified-code-block>
                            </div>
                        `;
                    }
                    return html``;
                })}
            </div>
        `;
    }

    _shouldPartAnimate(index) {
        if (!this._streamingState) return false;
        return this._streamingState.isActive && index <= this._streamingState.currentPartIndex;
    }

    _onPartComplete(partIndex) {
        if (!this._streamingState) return;
        
        const part = this._streamingState.parts[partIndex];
        console.log(`✅ Part ${partIndex} completed (${part?.type}):`, part?.type === 'code' ? part.language : 'text');
        
        // Move to next part
        if (partIndex === this._streamingState.currentPartIndex) {
            this._streamingState.currentPartIndex++;
            
            // Check if we've completed all parts
            if (this._streamingState.currentPartIndex >= this._streamingState.parts.length) {
                this._streamingState.isActive = false;
                console.log('🎉 All parts completed!');
                this.dispatchEvent(new CustomEvent('stream-animation-complete', {
                    detail: { 
                        id: this.id,
                        text: this.text 
                    },
                    bubbles: true,
                    composed: true
                }));
            } else {
                // Trigger update to show next part
                const nextPart = this._streamingState.parts[this._streamingState.currentPartIndex];
                console.log(`🚀 Starting part ${this._streamingState.currentPartIndex} (${nextPart?.type})`);
                this.requestUpdate();
            }
        }
    }

    _splitContentIntoParts(text) {
        const parts = [];
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Add text before this code block
            if (match.index > lastIndex) {
                const textContent = text.slice(lastIndex, match.index).trim();
                if (textContent) {
                    parts.push({
                        type: 'text',
                        content: textContent
                    });
                }
            }

            // Add the code block
            parts.push({
                type: 'code',
                language: match[1] || 'text',
                code: match[2]
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text after last code block
        if (lastIndex < text.length) {
            const textContent = text.slice(lastIndex).trim();
            if (textContent) {
                parts.push({
                    type: 'text',
                    content: textContent
                });
            }
        }

        return parts;
    }

    _onCodeAnimationComplete(e) {
        console.log('Code animation completed:', e.detail);
        // Dispatch the same event as text streaming for consistency
        this.dispatchEvent(new CustomEvent('stream-animation-complete', {
            detail: { 
                id: this.id,
                code: e.detail.code 
            },
            bubbles: true,
            composed: true
        }));
    }

    _onCodeCopied(e) {
        console.log('Code copied:', e.detail);
        this.dispatchEvent(new CustomEvent('code-copied', {
            detail: { 
                id: this.id,
                code: e.detail.code 
            },
            bubbles: true,
            composed: true
        }));
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Clear processed content cache when text changes to prevent stale cached content
        if (changedProperties.has('text')) {
            this._processedContentCache.clear();
            // Reset streaming state when text changes
            this._streamingState = null;
        }

        // Reset streaming state when streaming status changes
        if (changedProperties.has('isStreaming')) {
            if (this.isStreaming) {
                // Starting to stream - reset state
                this._streamingState = null;
            }
        }

        // Notify parent when assistant message starts (has content for first time)
        if (this.sender === 'assistant' && changedProperties.has('text')) {
            const hadContent = changedProperties.get('text');
            const hasContentNow = !!this.text;

            // Only trigger on first content appearance (when streaming starts)
            if (!hadContent && hasContentNow) {
                this.dispatchEvent(
                    new CustomEvent('message-content-updated', {
                        detail: {
                            id: this.id,
                            isStreaming: this.isStreaming,
                            hasContent: true,
                        },
                        bubbles: true,
                        composed: true,
                    })
                );
            }
        }
    }

    _onClickOutside(event) {
        if (this.showBackgroundDropdown) {
            const popup = this.shadowRoot.querySelector('.background-popup');
            const dropdownBtn = this.shadowRoot.querySelector('.background-dropdown-btn');

            if (popup && !popup.contains(event.target) && !dropdownBtn.contains(event.target)) {
                this.showBackgroundDropdown = false;
                this.requestUpdate();
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onClickOutside.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._onClickOutside.bind(this));
        if (this._selectionCleanup) {
            this._selectionCleanup();
        }
    }

    _showSelectionCopyButton(selection) {
        // Remove any existing selection copy button
        this._hideSelectionCopyButton();

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const messageContent = this.shadowRoot.querySelector('.message-content');

        if (!messageContent || rect.width === 0 || rect.height === 0) return;

        const copyBtn = document.createElement('div');
        copyBtn.className = 'selection-copy-btn';
        copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1"></path>
            </svg>
            Copy
        `;

        // Position the button above the selection, centered
        const buttonWidth = 60; // Approximate width of the button
        let leftPosition = rect.left + rect.width / 2 - buttonWidth / 2;

        // Ensure button stays within viewport
        const viewportWidth = window.innerWidth;
        if (leftPosition < 10) leftPosition = 10;
        if (leftPosition + buttonWidth > viewportWidth - 10) leftPosition = viewportWidth - buttonWidth - 10;

        copyBtn.style.left = `${leftPosition}px`;
        copyBtn.style.top = `${rect.top - 40}px`;
        copyBtn.style.position = 'fixed';
        copyBtn.style.zIndex = '1000';

        copyBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            this._copySelectedText();
            this._hideSelectionCopyButton();
        });

        document.body.appendChild(copyBtn);
        this._selectionCopyButton = copyBtn;

        // Show the button with animation
        requestAnimationFrame(() => {
            copyBtn.classList.add('show');
        });

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this._hideSelectionCopyButton();
        }, 3000);
    }

    _hideSelectionCopyButton() {
        if (this._selectionCopyButton) {
            this._selectionCopyButton.classList.remove('show');
            setTimeout(() => {
                if (this._selectionCopyButton) {
                    this._selectionCopyButton.remove();
                    this._selectionCopyButton = null;
                }
            }, 200);
        }
    }

    _copySelectedText() {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText) {
            navigator.clipboard
                .writeText(selectedText)
                .then(() => {
                    console.log('Selected text copied to clipboard:', selectedText);
                    // Clear the selection after copying
                    selection.removeAllRanges();
                })
                .catch(err => {
                    console.error('Failed to copy selected text:', err);
                    // Fallback for older browsers
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = selectedText;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                    } catch (fallbackErr) {
                        console.error('Fallback copy also failed:', fallbackErr);
                    }
                });
        }
    }

    /**
     * ⭐ SMART DUPLICATE DETECTION: Check if content is already rendered
     * This prevents re-processing content that's already been processed
     */
    _isContentAlreadyRendered(text) {
        if (!text) return false;

        // Check for already processed math elements
        const hasProcessedMath = text.includes('math-block-container') || 
                               text.includes('math-inline') || 
                               text.includes('katex') ||
                               text.includes('class="katex"');

        // Check for already processed code blocks
        const hasProcessedCode = text.includes('code-block-container') ||
                                text.includes('class="hljs"') ||
                                text.includes('class="code-line"');

        // Check for already processed markdown elements
        const hasProcessedMarkdown = text.includes('class="enhanced-') ||
                                   text.includes('<h1 class=') ||
                                   text.includes('<h2 class=') ||
                                   text.includes('<table class="enhanced-table"') ||
                                   text.includes('<blockquote class="enhanced-blockquote"');

        const isAlreadyRendered = hasProcessedMath || hasProcessedCode || hasProcessedMarkdown;
        
        if (isAlreadyRendered) {
            console.log('🔍 Content already rendered detected:', {
                hasProcessedMath,
                hasProcessedCode, 
                hasProcessedMarkdown
            });
        }

        return isAlreadyRendered;
    }

    render() {
        const hasScreenshots = this.screenshots && Array.isArray(this.screenshots) && this.screenshots.length > 0;
        const shouldShowScreenshots = hasScreenshots && !this.autoScreenshotEnabled;
        const backgroundClass = this._getBackgroundClass();

        return html`
            <div class="message-wrapper ${this.sender}">
                <!-- Copy button that appears on hover -->
                <button class="message-copy-btn" @click=${this._onCopyMessage} title=" ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1"></path>
                    </svg>
                </button>
                <div class="message-bubble ${this.sender} ${backgroundClass}">
                    ${shouldShowScreenshots
                        ? html`
                              <div class="screenshots-container">
                                  <div class="screenshots-grid">
                                      ${this.screenshots.map(
                                          (screenshot, index) => html`
                                              <div class="screenshot-item">
                                                  <img
                                                      class="screenshot-image"
                                                      src="data:image/jpeg;base64,${screenshot}"
                                                      alt="Screenshot ${index + 1}"
                                                      @click=${() => this._onScreenshotClick(screenshot)}
                                                      title="Click to view full size"
                                                  />
                                                  <div class="screenshot-number">#${index + 1}</div>
                                              </div>
                                          `
                                      )}
                                  </div>
                                  <div class="screenshots-caption">
                                      ${this.screenshots.length} screenshot${this.screenshots.length > 1 ? 's' : ''} attached
                                  </div>
                              </div>
                          `
                        : ''}
                    ${this.isEditing
                        ? html`
                              <div class="edit-container">
                                  <textarea
                                      class="edit-textarea"
                                      .value=${this.editableContent}
                                      @input=${this._onTextareaInput}
                                      placeholder="Edit your message..."
                                  ></textarea>
                                  <div class="edit-buttons">
                                      <button class="edit-btn save" @click=${this._onSave}>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                              <polyline points="17,21 17,13 7,13 7,21"></polyline>
                                              <polyline points="7,3 7,8 15,8"></polyline>
                                          </svg>
                                          Save
                                      </button>
                                      <button class="edit-btn cancel" @click=${this._onCancel}>
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                              <line x1="18" y1="6" x2="6" y2="18"></line>
                                              <line x1="6" y1="6" x2="18" y2="18"></line>
                                          </svg>
                                          Cancel
                                      </button>
                                  </div>
                              </div>
                          `
                        : this.text
                        ? html`
                              <div class="message-content">
                                  ${this.sender === 'assistant' && this.enableTextAnimation && !this.isViewingHistory
                                      ? this._renderStreamingContent()
                                      : this.sender === 'assistant'
                                      ? html`<div .innerHTML=${this._processMessageContent(this.text)}></div>`
                                      : html`<div>${this.text}</div>`}
                                  ${this.isStreaming && !this.enableTextAnimation
                                      ? html`
                                            <div class="typing-indicator">
                                                <div class="typing-dot"></div>
                                                <div class="typing-dot"></div>
                                                <div class="typing-dot"></div>
                                            </div>
                                        `
                                      : ''}
                              </div>
                          `
                        : ''}
                    <div class="message-time">
                        ${this.isStreaming ? 'typing...' : this.timestamp}
                        <button class="msg-action-btn copy-button" @click=${this._onCopy} title="Copy message">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1"></path>
                            </svg>
                        </button>
                        <button class="msg-action-btn edit-button" @click=${this._onEdit} title="Edit message">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <div class="background-dropdown-container" style="position:relative;">
                            <button
                                class="background-dropdown-btn ${this.sender === 'user' ? 'input' : 'output'}"
                                @click=${this._onToggleBackgroundDropdown}
                                title="Change background theme"
                            >
                                <div class="current-theme-preview ${this.themeManager.getThemeClass(this.backgroundTheme)}"></div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                            </button>
                            ${this.showBackgroundDropdown
                                ? html`
                                      <div class="background-dropdown above">
                                          <div class="dropdown-header">
                                              <span class="dropdown-title">
                                                  <span class="message-type-indicator ${this.sender === 'user' ? 'input' : 'output'}">
                                                      ${this.sender === 'user' ? 'Input' : 'Output'}
                                                  </span>
                                                  Message Theme
                                              </span>
                                              <input
                                                  class="dropdown-search"
                                                  type="text"
                                                  placeholder="Search themes..."
                                                  .value=${this.searchQuery}
                                                  @input=${this._onSearchInput}
                                              />
                                          </div>
                                          <div class="dropdown-categories">
                                              ${Object.entries(this._getCategorizedThemes()).map(
                                                  ([categoryKey, category]) => html`
                                                      <div class="category-section">
                                                          <div class="category-header">
                                                              <span class="category-icon">${category.icon}</span>
                                                              <span>${category.name}</span>
                                                          </div>
                                                          ${Object.entries(category.themes).map(
                                                              ([themeKey, theme]) => html`
                                                                  <button
                                                                      class="theme-item ${this.backgroundTheme === themeKey ? 'active' : ''}"
                                                                      @click=${() => this._onBackgroundThemeChange(themeKey)}
                                                                  >
                                                                      <div class="theme-preview ${theme.class}"></div>
                                                                      <div class="theme-info">
                                                                          <div class="theme-name">${theme.name}</div>
                                                                          <div class="theme-description">${theme.description}</div>
                                                                          <div class="theme-tags">
                                                                              ${theme.tags.map(tag => html`<span class="theme-tag">${tag}</span>`)}
                                                                          </div>
                                                                      </div>
                                                                      <div class="theme-suitability">
                                                                          ${theme.suitableFor.includes('input')
                                                                              ? html`<div class="suitability-dot input"></div>`
                                                                              : ''}
                                                                          ${theme.suitableFor.includes('output')
                                                                              ? html`<div class="suitability-dot output"></div>`
                                                                              : ''}
                                                                      </div>
                                                                  </button>
                                                              `
                                                          )}
                                                      </div>
                                                  `
                                              )}
                                              ${Object.keys(this._getCategorizedThemes()).length === 0
                                                  ? html` <div class="no-results">No themes found.</div> `
                                                  : ''}
                                          </div>
                                      </div>
                                  `
                                : ''}
                        </div>
                        <button class="msg-action-btn delete-button" @click=${this._onDelete} title="Delete message">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M3 6h18"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-chat-message', BuddyChatMessage);
