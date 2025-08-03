# Text Stream Animation Components

This document explains how to use the text stream animation components in your Buddy Desktop application.

## Components

### 1. `buddy-text-stream`
The core text streaming component that handles the animation logic.

### 2. `buddy-response-stream`
A wrapper component that adds streaming indicators and integrates with the chat system.

### 3. `buddy-text-stream-demo`
A demo component that shows all the features and allows testing different configurations.

## Basic Usage

### In Chat Messages

The text stream animation is automatically integrated into `buddy-chat-message` for assistant responses. You can control it with these properties:

```javascript
// Enable/disable text animation
message.enableTextAnimation = true;

// Set animation mode
message.streamMode = 'typewriter'; // or 'fade'

// Set animation speed (1-100)
message.streamSpeed = 25;

// Optional: Set custom timing
message.streamFadeDuration = 800; // milliseconds
message.streamSegmentDelay = 50;  // milliseconds
message.streamChunkSize = 2;      // characters per frame
```

### Standalone Usage

```html
<buddy-response-stream
    .textStream="Your text content here"
    .mode="typewriter"
    .speed="25"
    .isStreaming="true"
    @stream-complete="${this.handleComplete}"
></buddy-response-stream>
```

### Direct Text Stream

```html
<buddy-text-stream
    .text="Your text content here"
    .mode="fade"
    .speed="30"
    @animation-complete="${this.handleComplete}"
></buddy-text-stream>
```

## Configuration Options

### Animation Modes

- **`typewriter`**: Characters appear one by one (default)
- **`fade`**: Words fade in sequentially

### Speed Control

- **`speed`**: Number from 1-100 controlling animation speed
  - Lower values = slower animation
  - Higher values = faster animation

### Advanced Timing (Optional)

- **`fadeDuration`**: Duration of fade animation in milliseconds (fade mode only)
- **`segmentDelay`**: Delay between segments in milliseconds
- **`chunkSize`**: Number of characters processed per frame (typewriter mode)

If these are not set, the component calculates optimal values based on the speed setting.

## Events

### `animation-complete`
Fired when the text animation finishes.

```javascript
element.addEventListener('animation-complete', (e) => {
    console.log('Animation finished:', e.detail.text);
});
```

### `stream-complete`
Fired by `buddy-response-stream` when streaming animation finishes.

```javascript
element.addEventListener('stream-complete', (e) => {
    console.log('Stream finished:', e.detail.text);
});
```

## Methods

### Control Methods

```javascript
const streamElement = document.querySelector('buddy-text-stream');

// Start animation
streamElement.startAnimation();

// Pause animation
streamElement.pause();

// Resume animation
streamElement.resume();

// Reset animation
streamElement.reset();
```

## Integration Examples

### 1. Update Chat Message Component

```javascript
// In your chat message component
render() {
    return html`
        <div class="message">
            ${this.sender === 'assistant' && this.enableTextAnimation
                ? html`
                    <buddy-response-stream
                        .textStream=${this.processedText}
                        .mode=${this.streamMode}
                        .speed=${this.streamSpeed}
                        .isStreaming=${this.isStreaming}
                        @stream-complete=${this.onStreamComplete}
                    ></buddy-response-stream>
                `
                : html`<div>${this.text}</div>`
            }
        </div>
    `;
}
```

### 2. Settings Integration

```javascript
// Add to your settings/preferences
const textAnimationSettings = {
    enabled: true,
    mode: 'typewriter', // or 'fade'
    speed: 25,
    customTiming: {
        fadeDuration: null, // auto
        segmentDelay: null, // auto
        chunkSize: null     // auto
    }
};

// Apply to chat messages
chatMessage.enableTextAnimation = textAnimationSettings.enabled;
chatMessage.streamMode = textAnimationSettings.mode;
chatMessage.streamSpeed = textAnimationSettings.speed;
```

### 3. Real-time Streaming

```javascript
// For real-time streaming responses
class StreamingResponse {
    constructor(element) {
        this.element = element;
        this.currentText = '';
    }
    
    appendText(newText) {
        this.currentText += newText;
        this.element.textStream = this.currentText;
    }
    
    complete() {
        this.element.isStreaming = false;
    }
}
```

## CSS Customization

You can customize the appearance using CSS custom properties:

```css
buddy-text-stream {
    --cursor-color: #3b82f6;
}

buddy-response-stream {
    --primary-color: #3b82f6;
    --streaming-color: #666;
}
```

## Demo Component

To test the text stream animation, you can use the demo component:

```javascript
import './components/buddy-text-stream-demo.js';

// In your HTML
<buddy-text-stream-demo></buddy-text-stream-demo>
```

This provides a full interface for testing all animation modes and settings.

## Performance Notes

- The animation uses `requestAnimationFrame` for smooth performance
- Content is cached to prevent duplicate processing
- Large texts are processed in chunks to maintain responsiveness
- The fade mode uses CSS animations for optimal performance

## Browser Compatibility

- Modern browsers with ES6+ support
- Uses `Intl.Segmenter` when available, falls back to simple word splitting
- Requires Web Components support (LitElement)