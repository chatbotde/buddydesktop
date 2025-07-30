# AI Providers Module

This directory contains the modular AI provider implementations for the Buddy Desktop application.

## Structure

```
providers/
├── README.md              # This documentation
├── index.js               # Main entry point and factory function
├── base-provider.js       # Base class for all AI providers
├── google-provider.js     # Google AI (Gemini) implementation
├── openai-provider.js     # OpenAI implementation
├── anthropic-provider.js  # Anthropic (Claude) implementation
├── deepseek-provider.js   # DeepSeek implementation
└── openrouter-provider.js # OpenRouter implementation
```

## Architecture

### BaseAIProvider
The `BaseAIProvider` class provides the common interface that all AI providers must implement:

- `constructor(apiKey, profile, language)` - Initialize with credentials and settings
- `async initialize()` - Set up the connection to the AI service
- `async sendRealtimeInput(input)` - Send user input and get streaming response
- `async close()` - Clean up resources and close connections

### Provider Implementations

Each provider extends `BaseAIProvider` and implements the specific API requirements:

- **GoogleAIProvider**: Supports both real-time (live) and chat models
- **OpenAIProvider**: Standard OpenAI API with streaming support
- **AnthropicProvider**: Claude API with streaming support
- **DeepSeekProvider**: DeepSeek API with streaming support
- **OpenRouterProvider**: OpenRouter API with streaming support

### Factory Function

The `createAIProvider(provider, apiKey, profile, language, model)` function creates the appropriate provider instance based on the provider name.

## Usage

```javascript
const { createAIProvider } = require('./providers');

// Create a provider instance
const provider = createAIProvider('openai', apiKey, profile, language, model);

// Initialize the connection
await provider.initialize();

// Send input and get streaming response
await provider.sendRealtimeInput({ text: 'Hello, world!' });

// Clean up when done
await provider.close();
```

## Features

- **Streaming Responses**: All providers support real-time streaming of AI responses
- **Image Support**: Most providers support image input via screenshots
- **Conversation History**: Maintains conversation context across messages
- **Error Handling**: Comprehensive error handling and status updates
- **Resource Management**: Proper cleanup of connections and sessions

## Adding New Providers

To add a new AI provider:

1. Create a new file `new-provider.js` in this directory
2. Extend `BaseAIProvider` and implement the required methods
3. Add the provider to the factory function in `index.js`
4. Update the exports in `index.js`

## Migration from Monolithic Structure

The original `ai-providers.js` file has been refactored into this modular structure for better maintainability and organization. The original file now simply re-exports from this directory to maintain backward compatibility. 