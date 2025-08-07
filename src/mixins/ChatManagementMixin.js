/**
 * Chat Management Mixin
 * Handles chat messages, responses, and text processing
 */
export const ChatManagementMixin = (superClass) => class extends superClass {
    
    // Replace existing setResponse method
    setResponse(data) {
        let responseText;
        let isStreamingChunk = false;
        let isFinalChunkOfStream = false;
        let isCompleteNonStreamed = false;

        if (typeof data === 'object' && data !== null && typeof data.text === 'string') {
            responseText = data.text;
            if (data.isStreaming === true && data.isComplete !== true) {
                isStreamingChunk = true;
            } else if (data.isStreaming === true && data.isComplete === true) {
                isFinalChunkOfStream = true;
            } else if (data.isStreaming === false && data.isComplete === true) {
                isCompleteNonStreamed = true;
            } else {
                console.warn('Unknown streaming state for setResponse:', data);
                this.requestUpdate();
                return;
            }
        } else if (typeof data === 'string') {
            responseText = data;
            isCompleteNonStreamed = true;
        } else {
            console.warn('Unknown data format for setResponse:', data);
            this.requestUpdate();
            return;
        }

        if (isStreamingChunk) {
            // Handle streaming chunks - update existing message or create new one
            if (this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    // Update existing streaming message
                    lastMessage.text = responseText;
                    this.requestUpdate();
                    this.scrollToBottom(false);
                    return;
                }
            }
            // Create new streaming message
            this.addChatMessage(responseText, 'assistant', true);
            
        } else if (isFinalChunkOfStream) {
            // Complete the streaming message
            if (this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    lastMessage.text = responseText;
                    lastMessage.isStreaming = false;
                    this.isStreamingActive = false;
                    this.streamingResponseText = '';
                    
                    // Sync streaming state with assistant view
                    const assistantView = this.shadowRoot?.querySelector('buddy-assistant-view');
                    if (assistantView && assistantView.updateStreamingState) {
                        assistantView.updateStreamingState(false);
                    }
                    
                    this.requestUpdate();
                    this.scrollToBottom(false);
                    return;
                }
            }
            // Fallback: add as complete message
            this.addChatMessage(responseText, 'assistant', false);
            this.responses.push(responseText);
            this.currentResponseIndex = this.responses.length - 1;
            
        } else if (isCompleteNonStreamed) {
            // Add complete message (non-streaming providers like OpenAI)
            this.addChatMessage(responseText, 'assistant', false);
            this.responses.push(responseText);
            if (this.currentResponseIndex === this.responses.length - 2 || this.currentResponseIndex === -1 || this.responses.length === 1) {
                this.currentResponseIndex = this.responses.length - 1;
            }
        }

        this.requestUpdate();
        if (this.currentView === 'assistant') {
            this.scrollToBottom(false);
        }
    }

    addChatMessage(text, sender, isStreaming = false, screenshots = null) {
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        this.chatMessages = [
            ...this.chatMessages,
            {
                id,
                text,
                sender,
                timestamp,
                isStreaming,
                screenshots
            }
        ];
        if (isStreaming) {
            this.isStreamingActive = true;
            this.streamingResponseText = text;
            
            // Sync streaming state with assistant view
            const assistantView = this.shadowRoot?.querySelector('buddy-assistant-view');
            if (assistantView && assistantView.updateStreamingState) {
                assistantView.updateStreamingState(true);
            }
        }
        this.requestUpdate();
        this.scrollToBottom(sender === 'user');
    }

    scrollToBottom(force = false) {
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('.chat-container');
            if (container) {
                const lastMessage = container.querySelector('.message-wrapper:last-child');
                if (lastMessage) {
                    const isUserScrolledUp = container.scrollTop + container.clientHeight < container.scrollHeight - 150;
                    if (force || !isUserScrolledUp) {
                        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }
            }
        });
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            
            // Add user message and immediately scroll to it
            this.addChatMessage(message, 'user');
            await this.scrollToUserMessage();
            
            // Send message and continue with normal flow
            const result = await buddy.sendTextMessage(message);
            textInput.value = '';

            if (!result.success) {
                console.error('Failed to send message:', result.error);
                this.setStatus('Error sending message: ' + result.error);
                // Add error message to chat
                this.addChatMessage(' error sending your message.', 'assistant');
            } else {
                this.setStatus('sending...');
            }

            if (textInput.matches('textarea')) {
                this.handleTextInputResize({ target: textInput });
            }
        }
    }

    // Add new method for user message scrolling
    async scrollToUserMessage() {
        await new Promise(resolve => requestAnimationFrame(resolve));
        const container = this.shadowRoot.querySelector('.chat-container');
        const lastMessage = this.shadowRoot.querySelector('.message-wrapper:last-child');
        
        if (container && lastMessage) {
            const scrollTarget = lastMessage.offsetTop - container.clientHeight + lastMessage.clientHeight + 100;
            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
        // For Shift+Enter, textarea will handle newline by default
    }

    handleTextInputResize(e) {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height to recalculate scrollHeight

        const computedStyle = getComputedStyle(textarea);
        const maxHeightStyle = computedStyle.maxHeight;
        const maxHeight = maxHeightStyle.endsWith('px') ? parseFloat(maxHeightStyle) : Number.MAX_SAFE_INTEGER;

        if (textarea.scrollHeight <= maxHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto'; // This enables the internal scrollbar
        }
    }

    // Add this method to actually delete a message
    deleteMessage(id) {
        this.chatMessages = this.chatMessages.filter(msg => msg.id !== id);
        this.requestUpdate();
    }
};
