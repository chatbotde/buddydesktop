# Buddy Desktop

An AI assistant desktop application that supports multiple AI providers including Google Gemini, OpenAI, Anthropic Claude, DeepSeek, and OpenRouter.

## Features

- Multiple AI provider support
- Real-time audio and screen capture capabilities
- Environment variable support for API keys
- Chat interface with message history
- Cross-platform support (Windows, macOS, Linux)
- Consistent window properties across all windows (frameless, transparent, always-on-top)

## Window Properties

All windows in the application share consistent properties for a seamless desktop experience:

- **Frameless**: No window borders or title bars
- **Transparent**: Transparent background for modern look
- **Always on Top**: Windows stay above other applications
- **Hidden from Taskbar**: Windows don't appear in the system taskbar
- **Hidden from Mission Control**: Windows don't appear in macOS Mission Control
- **Content Protection**: Prevents screen recording in some contexts
- **Visible on All Workspaces**: Windows appear on all virtual desktops

### Creating Windows with Consistent Properties

The application provides utility functions to create windows with these properties:

```javascript
// Create an image window
window.buddy.createImageWindow(imageData, 'Screenshot Title');

// Create any window with consistent properties
window.buddy.createConsistentWindow({
    width: 800,
    height: 600,
    title: 'My Window',
    webPreferences: { nodeIntegration: true }
});
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the application: `npm start`

## API Key Configuration

### Option 1: Environment Variables (Recommended)

Set your API keys as environment variables. Copy `env.example` to `.env` and set your keys:

```bash
# Copy the example file
cp env.example .env

# Edit .env with your API keys
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Supported environment variable names:
- **Google Gemini**: `GOOGLE_API_KEY` or `GEMINI_API_KEY`
- **OpenAI**: `OPENAI_API_KEY`
- **Anthropic**: `ANTHROPIC_API_KEY` or `CLAUDE_API_KEY`
- **DeepSeek**: `DEEPSEEK_API_KEY`
- **OpenRouter**: `OPENROUTER_API_KEY`

### Option 2: Manual Entry

If you don't set environment variables, you can enter API keys directly in the application interface. The app will show you the status of environment variables and allow you to override them if needed.

### Option 3: Demo Mode

You can start the application without any API keys to explore the interface. Note that actual AI functionality will not work without valid API keys.

## Getting API Keys

- **Google Gemini**: [Google AI Studio](https://aistudio.google.com)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic**: [Anthropic Console](https://console.anthropic.com)
- **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com)
- **OpenRouter**: [OpenRouter Keys](https://openrouter.ai/keys)

## Development

- Package the app: `npm run package`
- Make distributables: `npm run make`

## License

MIT