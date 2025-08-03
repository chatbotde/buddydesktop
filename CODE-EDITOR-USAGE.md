# Buddy Code Editor Component

A streaming code editor component with syntax highlighting and typewriter animation, similar to modern code presentation tools.

## Features

- ✅ **Typewriter Animation**: Code appears character by character
- ✅ **Syntax Highlighting**: Built-in highlighting for JavaScript, HTML, CSS, Python
- ✅ **Themes**: Light and dark theme support
- ✅ **Copy Functionality**: One-click code copying
- ✅ **Customizable Header**: Window-style header with dots and title
- ✅ **Responsive**: Adjustable width and height
- ✅ **Events**: Animation complete and copy events
- ✅ **Pause/Resume**: Control animation playback

## Basic Usage

### Import the Component

```javascript
import './components/buddy-code-editor.js';
```

### Simple Example

```html
<buddy-code-editor
    .code="console.log('Hello, World!');"
    lang="javascript"
    title="Hello World Example"
></buddy-code-editor>
```

### Advanced Example

```html
<buddy-code-editor
    .code=${myCodeString}
    lang="javascript"
    theme="dark"
    .duration=${3}
    .delay=${0.5}
    .writing=${true}
    .header=${true}
    .dots=${true}
    .copyButton=${true}
    .cursor=${true}
    title="My Code Example"
    icon="🚀"
    width="800px"
    height="600px"
    @animation-complete=${this.handleComplete}
    @code-copied=${this.handleCopy}
></buddy-code-editor>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `code` | String | `''` | The code content to display |
| `lang` | String | `'javascript'` | Programming language for syntax highlighting |
| `theme` | String | `'light'` | Theme: 'light' or 'dark' |
| `duration` | Number | `3` | Animation duration in seconds |
| `delay` | Number | `0` | Delay before animation starts (seconds) |
| `header` | Boolean | `true` | Show window-style header |
| `dots` | Boolean | `true` | Show colored dots in header |
| `icon` | String | `''` | Icon to display in header (emoji or HTML) |
| `cursor` | Boolean | `true` | Show blinking cursor during animation |
| `copyButton` | Boolean | `true` | Show copy button |
| `writing` | Boolean | `true` | Enable typewriter animation |
| `title` | String | `''` | Title to display in header |
| `width` | String | `'600px'` | Component width |
| `height` | String | `'400px'` | Component height |

## Supported Languages

- **JavaScript** (`javascript`, `js`)
- **HTML** (`html`)
- **CSS** (`css`)
- **Python** (`python`, `py`)

*Note: Basic syntax highlighting is included. For advanced highlighting, you can integrate with libraries like Prism.js or highlight.js.*

## Events

### `animation-complete`
Fired when the typewriter animation finishes.

```javascript
codeEditor.addEventListener('animation-complete', (e) => {
    console.log('Animation finished:', e.detail.code);
});
```

### `code-copied`
Fired when code is copied to clipboard.

```javascript
codeEditor.addEventListener('code-copied', (e) => {
    console.log('Code copied:', e.detail.code);
});
```

## Methods

### `startAnimation()`
Start or restart the typewriter animation.

```javascript
const codeEditor = document.querySelector('buddy-code-editor');
codeEditor.startAnimation();
```

### `pause()`
Pause the current animation.

```javascript
codeEditor.pause();
```

### `resume()`
Resume a paused animation.

```javascript
codeEditor.resume();
```

### `reset()`
Reset the animation to the beginning.

```javascript
codeEditor.reset();
```

### `copyCode()`
Programmatically copy the code to clipboard.

```javascript
codeEditor.copyCode();
```

## Styling

The component uses CSS custom properties for theming:

```css
buddy-code-editor {
    --code-bg: #f8f9fa;
    --header-bg: #f1f3f4;
    --border-color: #e1e5e9;
    --code-content-bg: #ffffff;
    --text-muted: #6b7280;
    --hover-bg: rgba(0, 0, 0, 0.05);
    --cursor-color: #3b82f6;
    --success-color: #10b981;
}
```

### Dark Theme
Set the `theme` attribute to automatically apply dark styling:

```html
<buddy-code-editor theme="dark" ...></buddy-code-editor>
```

## Integration Examples

### In Chat Messages

```javascript
// In your chat message component
render() {
    return html`
        <div class="message">
            ${this.isCodeBlock 
                ? html`
                    <buddy-code-editor
                        .code=${this.codeContent}
                        .lang=${this.detectedLanguage}
                        .writing=${this.isStreaming}
                        .duration=${2}
                        title="Code Example"
                    ></buddy-code-editor>
                `
                : html`<div>${this.text}</div>`
            }
        </div>
    `;
}
```

### With Dynamic Content

```javascript
class MyComponent extends LitElement {
    constructor() {
        super();
        this.currentCode = '';
    }
    
    async loadCode() {
        const response = await fetch('/api/code-example');
        this.currentCode = await response.text();
    }
    
    render() {
        return html`
            <buddy-code-editor
                .code=${this.currentCode}
                lang="javascript"
                @animation-complete=${this.onAnimationDone}
            ></buddy-code-editor>
        `;
    }
    
    onAnimationDone() {
        console.log('Code animation finished!');
    }
}
```

### Multiple Code Blocks

```javascript
render() {
    return html`
        <div class="code-examples">
            ${this.codeExamples.map((example, index) => html`
                <buddy-code-editor
                    .code=${example.code}
                    .lang=${example.language}
                    .title=${example.title}
                    .delay=${index * 0.5}
                    width="100%"
                    height="300px"
                ></buddy-code-editor>
            `)}
        </div>
    `;
}
```

## Demo

To see the component in action, use the demo component:

```javascript
import './components/buddy-code-editor-demo.js';

// In your HTML
<buddy-code-editor-demo></buddy-code-editor-demo>
```

## Performance Notes

- The component uses `requestAnimationFrame` for smooth animations
- Syntax highlighting is applied progressively during animation
- Large code blocks are handled efficiently with chunked processing
- Memory is cleaned up automatically when component is disconnected

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires Web Components support (LitElement)
- Clipboard API for copy functionality (falls back gracefully)

## Customization

You can extend the component for additional languages or features:

```javascript
class MyCodeEditor extends BuddyCodeEditor {
    highlightCode() {
        // Add custom syntax highlighting logic
        if (this.lang === 'mylang') {
            // Custom highlighting for your language
        } else {
            super.highlightCode();
        }
    }
}

customElements.define('my-code-editor', MyCodeEditor);
```