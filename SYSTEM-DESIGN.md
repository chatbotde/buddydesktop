# Buddy Desktop - System Design Document

## Overview

Buddy Desktop is an AI assistant desktop application built with Electron that provides real-time multimodal AI interactions. The system supports multiple AI providers, real-time audio/video capture, authentication, and a modular plugin architecture.

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Buddy Desktop Application                     │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Renderer Process)                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   UI Components │  │  Service Layer  │  │  Feature Layer  │ │
│  │   (Lit Elements)│  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Backend (Main Process)                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Core Systems  │  │  AI Providers   │  │  System APIs    │ │
│  │                 │  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  External Services                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   AI APIs       │  │   Database      │  │  Auth Services  │ │
│  │                 │  │   (MongoDB)     │  │  (Google OAuth) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Core Systems

### 1. Application Core (`src/core/`)

#### AppCore (`AppCore.js`)
- **Purpose**: Central orchestrator for the entire application
- **Responsibilities**:
  - Initialize and manage core systems
  - Configuration management
  - Plugin and service lifecycle
  - Event coordination
- **Key Methods**:
  - `initialize(config)`: Bootstrap application
  - `registerModule(id, module)`: Register application modules
  - `getService(id)`: Service dependency injection
  - `shutdown()`: Graceful application shutdown

#### EventBus (`EventBus.js`)
- **Purpose**: Centralized event management system
- **Features**:
  - Decoupled component communication
  - Event middleware support
  - Priority-based listeners
  - Event history tracking
- **Key Methods**:
  - `on(event, listener, options)`: Subscribe to events
  - `emit(event, data, options)`: Publish events
  - `namespace(prefix)`: Create namespaced event channels

#### ServiceManager (`ServiceManager.js`)
- **Purpose**: Dependency injection and service lifecycle management
- **Features**:
  - Singleton and factory patterns
  - Dependency resolution
  - Service hooks and lifecycle events
- **Key Methods**:
  - `register(id, service, options)`: Register services
  - `get(id)`: Resolve service instances
  - `initialize()`: Initialize all services

### 2. AI Provider System (`src/ai-providers.js`)

#### Provider Architecture
```
BaseAIProvider (Abstract)
├── GoogleAIProvider
├── OpenAIProvider
├── AnthropicProvider
├── DeepSeekProvider
└── OpenRouterProvider
```

#### Provider Interface
```javascript
class BaseAIProvider {
  async initialize()
  async sendRealtimeInput(input)
  async close()
}
```

#### Supported Providers
- **Google Gemini**: Real-time and chat models
- **OpenAI**: GPT models with streaming
- **Anthropic**: Claude models
- **DeepSeek**: Reasoning models
- **OpenRouter**: Multi-provider access

### 3. Authentication System (`src/auth-service.js`)

#### Features
- Google OAuth 2.0 integration
- JWT token management
- User session persistence
- MongoDB user storage

#### Data Flow
```
User Login → Google OAuth → Token Exchange → User Creation/Update → JWT Generation → Session Storage
```

#### Database Schema
```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  name: String,
  picture: String,
  googleId: String,
  createdAt: Date,
  lastLogin: Date,
  preferences: {
    selectedProfile: String,
    selectedLanguage: String,
    selectedProvider: String,
    theme: String
  }
}

// Sessions Collection
{
  _id: ObjectId,
  userId: ObjectId,
  messages: Array,
  provider: String,
  model: String,
  createdAt: Date,
  metadata: Object
}
```

## Frontend Architecture

### 1. Component System (Lit Elements)

#### Main Components
- `BuddyApp`: Root application component
- `BuddyHeader`: Navigation and controls
- `BuddyAssistantView`: Main chat interface
- `BuddyModelsView`: AI model selection
- `BuddySettingsView`: Configuration panel

#### Component Hierarchy
```
BuddyApp
├── BuddyHeader
├── BuddyLoginView
├── BuddyMainView
│   ├── BuddyAssistantView
│   ├── BuddyModelsView
│   ├── BuddySettingsView
│   └── BuddyHistoryView
└── BuddyUpdateNotification
```

### 2. Service Layer

#### Models Service (`src/services/models-service.js`)
- Centralized AI model configuration
- Provider mapping and capabilities
- Custom model management
- Environment key resolution

#### Model Configuration Schema
```javascript
{
  id: String,
  name: String,
  provider: String,
  apiKeyEnv: String,
  capabilities: Array,
  contextWindow: Number,
  maxTokens: Number,
  live: Boolean,
  premium: Boolean
}
```

## Feature System

### 1. Audio Features (`src/features/audio/`)

#### Components
- `AudioManager`: Audio capture and processing
- `AudioWindow`: Floating audio control interface
- `AudioFeature`: Feature integration

#### Audio Pipeline
```
System Audio → SystemAudioDump → PCM Processing → Base64 Encoding → AI Provider
```

### 2. Screenshot Features (`src/features/ScreenshotFeature.js`)

#### Capabilities
- Screen capture via Electron APIs
- Image processing and optimization
- Multi-screen support
- Real-time analysis integration

## Window Management System (`src/window.js`)

### Consistent Window Properties
All application windows share these properties:
- **Frameless**: No window borders
- **Transparent**: Transparent background
- **Always on Top**: Stay above other applications
- **Hidden from Taskbar**: Don't appear in system taskbar
- **Content Protection**: Prevent screen recording

### Window Types
- **Main Window**: Primary application interface
- **Image Windows**: Screenshot display
- **Audio Windows**: Floating audio controls
- **Consistent Windows**: Generic window creation

## Data Flow Architecture

### 1. Real-time AI Interaction Flow
```
User Input → Input Processing → AI Provider → Streaming Response → UI Update
     ↓              ↓               ↓              ↓              ↓
Audio/Video → Format Conversion → API Call → Response Stream → Live Display
```

### 2. Authentication Flow
```
Login Request → Google OAuth → Token Exchange → User Lookup/Creation → JWT Generation → Session Storage
```

### 3. Configuration Flow
```
Environment Variables → Service Configuration → Provider Initialization → Model Selection → Session Start
```

## API Interfaces

### 1. IPC Communication (Main ↔ Renderer)

#### Main Process Handlers
```javascript
// AI Operations
'initialize-ai': (provider, apiKey, customPrompt, profile, language, model)
'send-text-message': (messageData)
'send-audio-content': ({ data, mimeType })
'send-image-content': ({ data, debug })
'send-video-content': ({ data, mimeType, isRealtime })

// Window Management
'create-image-window': (imageData, title)
'create-audio-window': (options)
'create-consistent-window': (options)

// Authentication
'get-google-auth-url': ()
'handle-google-auth-callback': (code)
'verify-auth-token': (token)

// System Operations
'start-macos-audio': ()
'stop-macos-audio': ()
'close-session': ()
'quit-application': ()
```

#### Renderer Events
```javascript
// Status Updates
'update-status': (statusText)
'update-response': ({ text, isStreaming, isComplete })

// System Events
'capture-and-send-screenshot': ()
'view-changed': (view)
```

### 2. AI Provider APIs

#### Input Interface
```javascript
{
  text?: string,
  audio?: { data: string, mimeType: string },
  media?: { data: string, mimeType: string },
  screenshots?: string[]
}
```

#### Response Interface
```javascript
{
  text: string,
  isStreaming: boolean,
  isComplete: boolean
}
```

## Database Schema

### MongoDB Collections

#### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  picture: String,
  googleId: String,
  createdAt: Date,
  lastLogin: Date,
  preferences: {
    selectedProfile: String,
    selectedLanguage: String,
    selectedProvider: String,
    theme: String
  }
}
```

#### Sessions
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  messages: [{
    role: String,
    content: String,
    timestamp: Date,
    type: String
  }],
  provider: String,
  model: String,
  createdAt: Date,
  metadata: {
    messageCount: Number,
    duration: Number
  }
}
```

#### Indexes
```javascript
// Users collection
{ email: 1 } // unique

// Sessions collection
{ userId: 1 }
{ createdAt: 1 } // TTL index (30 days)
```

## Configuration Management

### Environment Variables
```bash
# Authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
JWT_SECRET=

# Database
MONGODB_URI=

# AI Provider Keys
GOOGLE_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=
OPENROUTER_API_KEY=
XAI_API_KEY=
KIMI_API_KEY=
```

### Application Configuration
```javascript
{
  features: {
    autoLoad: true,
    enablePlugins: true,
    enableServices: true
  },
  plugins: {
    directory: './plugins',
    autoDiscover: true,
    enabledByDefault: true
  },
  services: {
    autoInitialize: true,
    lazyLoading: false
  },
  events: {
    enableHistory: true,
    maxHistorySize: 100,
    debugMode: boolean
  }
}
```

## Security Considerations

### 1. API Key Management
- Environment variable storage
- No hardcoded credentials
- Runtime key validation
- Secure key transmission

### 2. Authentication Security
- OAuth 2.0 implementation
- JWT token expiration (30 days)
- Secure token storage
- Session validation

### 3. Content Security
- CSP headers in HTML
- Secure IPC communication
- Input validation and sanitization
- Protected window content

## Performance Optimizations

### 1. Audio Processing
- Real-time PCM processing
- Optimized buffer management
- Efficient format conversion
- Minimal latency streaming

### 2. UI Rendering
- Lit Element virtual DOM
- Efficient component updates
- Lazy loading of features
- Optimized CSS rendering

### 3. Memory Management
- Service lifecycle management
- Event listener cleanup
- Buffer size limitations
- Garbage collection optimization

## Deployment Architecture

### 1. Electron Packaging
- Cross-platform builds (Windows, macOS, Linux)
- Auto-updater integration
- Native dependency bundling
- Code signing and notarization

### 2. Distribution
- GitHub releases
- Auto-update mechanism
- Platform-specific installers
- Portable executables

## Monitoring and Debugging

### 1. Logging System
- Structured logging
- Debug mode support
- Error tracking
- Performance metrics

### 2. Development Tools
- Hot reload support
- DevTools integration
- Debug audio processing
- Event bus monitoring

## Future Extensibility

### 1. Plugin System
- Dynamic plugin loading
- Plugin lifecycle management
- API extension points
- Third-party integrations

### 2. Feature Modules
- Modular feature architecture
- Feature toggles
- Dynamic feature loading
- Custom feature development

This system design provides a comprehensive overview of the Buddy Desktop application architecture, covering all major components, data flows, and integration points. The modular design enables scalability and maintainability while supporting real-time AI interactions across multiple providers.