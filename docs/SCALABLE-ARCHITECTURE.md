# Scalable Architecture Documentation

## Overview

The Buddy application has been refactored to use a scalable, modular architecture that makes it easy to add new features, plugins, and capabilities. This document explains how to use the new architecture system.

## Core Systems

### 1. AppCore (`src/core/AppCore.js`)
The main orchestrator that ties together all systems and provides a unified interface.

```javascript
import appCore from './core/AppCore.js';

// Initialize the application
await appCore.initialize({
    features: { autoLoad: true },
    plugins: { autoDiscover: true },
    events: { debugMode: true }
});

// Access core systems
const { featureManager, pluginSystem, eventBus, serviceManager } = appCore.getSystems();
```

### 2. FeatureManager (`src/core/FeatureManager.js`)
Manages feature registration, capabilities, and lifecycle.

```javascript
// Register a feature
appCore.registerFeature('my-feature', {
    name: 'My Feature',
    description: 'Description of my feature',
    version: '1.0.0',
    capabilities: ['text-processing', 'ui-component'],
    config: { enabled: true },
    handlers: {
        process: this.process.bind(this),
        toggle: this.toggle.bind(this)
    },
    hooks: {
        'before-process': this.beforeProcess.bind(this),
        'after-process': this.afterProcess.bind(this)
    }
});

// Check if feature is enabled
if (appCore.getService('featureManager').isFeatureEnabled('my-feature')) {
    // Feature is available
}

// Get features with specific capability
const textFeatures = appCore.getService('featureManager').getFeaturesWithCapability('text-processing');
```

### 3. PluginSystem (`src/core/PluginSystem.js`)
Handles dynamic plugin loading and management.

```javascript
// Register a plugin
appCore.getService('pluginSystem').registerPlugin('my-plugin', {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    type: 'feature',
    entryPoint: './plugins/my-plugin.js',
    enabled: true,
    dependencies: ['core-feature']
});

// Load a plugin
await appCore.getService('pluginSystem').loadPlugin('my-plugin');
```

### 4. EventBus (`src/core/EventBus.js`)
Provides decoupled communication between components.

```javascript
// Subscribe to events
appCore.on('user:message', (data) => {
    console.log('User sent message:', data);
});

// Emit events
appCore.emit('feature:activated', { featureId: 'my-feature' });

// Subscribe with options
appCore.on('important:event', (data) => {
    // Handle important event
}, { 
    priority: 10,  // Higher priority executes first
    once: true,    // Execute only once
    filter: (data) => data.type === 'specific'  // Only handle specific data
});
```

### 5. ServiceManager (`src/core/ServiceManager.js`)
Manages dependency injection and service lifecycle.

```javascript
// Register a service
appCore.getService('serviceManager').register('myService', MyServiceClass, {
    singleton: true,
    dependencies: ['config', 'eventBus'],
    lazy: false
});

// Get a service
const myService = appCore.getService('myService');
```

## Creating Features

### Basic Feature Structure

```javascript
import appCore from '../core/AppCore.js';

class MyFeature {
    constructor() {
        this.enabled = false;
        this.eventBus = appCore.getService('eventBus');
    }

    async initialize() {
        // Register the feature
        appCore.registerFeature('my-feature', {
            name: 'My Feature',
            description: 'Description of my feature',
            version: '1.0.0',
            capabilities: ['text-processing'],
            config: {
                enabled: false,
                autoStart: false
            },
            handlers: {
                start: this.start.bind(this),
                stop: this.stop.bind(this),
                process: this.process.bind(this)
            },
            hooks: {
                'before-process': this.beforeProcess.bind(this),
                'after-process': this.afterProcess.bind(this)
            }
        });

        // Subscribe to events
        this.eventBus.on('my-feature:start', this.handleStart.bind(this));
        this.eventBus.on('my-feature:stop', this.handleStop.bind(this));
    }

    async start() {
        this.enabled = true;
        this.eventBus.emit('my-feature:started', { timestamp: Date.now() });
    }

    async stop() {
        this.enabled = false;
        this.eventBus.emit('my-feature:stopped', { timestamp: Date.now() });
    }

    async process(data) {
        // Process data
        const result = await this.doProcessing(data);
        
        // Execute hooks
        await appCore.executeHook('after-process', { input: data, output: result });
        
        return result;
    }

    async beforeProcess(data) {
        console.log('Before processing:', data);
    }

    async afterProcess(data) {
        console.log('After processing:', data);
    }

    async cleanup() {
        this.eventBus.off('my-feature:start', this.handleStart);
        this.eventBus.off('my-feature:stop', this.handleStop);
    }
}

export default MyFeature;
```

### Feature Capabilities

Features can declare capabilities that other parts of the system can check:

```javascript
// Register feature with capabilities
appCore.registerFeature('ai-chat', {
    capabilities: ['text-processing', 'ai-integration', 'real-time'],
    // ... other config
});

// Check if model supports specific capabilities
const aiFeatures = appCore.getService('featureManager').getFeaturesWithCapability('ai-integration');
```

## Creating Plugins

### Plugin Structure

```javascript
// plugins/my-plugin.js
export default {
    // Plugin metadata
    name: 'My Plugin',
    version: '1.0.0',
    description: 'Description of my plugin',

    // Feature configuration (optional)
    featureConfig: {
        name: 'My Plugin Feature',
        capabilities: ['plugin-specific'],
        handlers: {
            pluginAction: this.pluginAction.bind(this)
        }
    },

    // Plugin hooks (optional)
    hooks: {
        'app:startup': this.onStartup.bind(this),
        'app:shutdown': this.onShutdown.bind(this)
    },

    // Plugin methods
    async initialize(appCore) {
        this.appCore = appCore;
        console.log('My plugin initialized');
    },

    async pluginAction(data) {
        // Plugin-specific functionality
        return { processed: data };
    },

    async onStartup(data) {
        console.log('App started, plugin ready');
    },

    async onShutdown(data) {
        console.log('App shutting down, cleaning up plugin');
    },

    async cleanup() {
        console.log('Plugin cleanup complete');
    }
};
```

### Plugin Registration

```javascript
// Register and load plugin
const pluginSystem = appCore.getService('pluginSystem');

pluginSystem.registerPlugin('my-plugin', {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    type: 'feature',
    entryPoint: './plugins/my-plugin.js',
    enabled: true,
    dependencies: []
});

await pluginSystem.loadPlugin('my-plugin');
```

## Event-Driven Communication

### Event Patterns

```javascript
// Component A emits event
appCore.emit('data:processed', { 
    result: processedData, 
    timestamp: Date.now() 
});

// Component B listens for event
appCore.on('data:processed', (data) => {
    console.log('Data processed:', data.result);
    // Handle the processed data
});

// Namespaced events
const userEvents = appCore.getService('eventBus').namespace('user');
userEvents.emit('login', { userId: '123' });
userEvents.on('logout', (data) => {
    console.log('User logged out:', data);
});
```

### Event Middleware

```javascript
// Add middleware to process all events
appCore.getService('eventBus').addMiddleware(async (event, data) => {
    // Add logging
    console.log(`Event: ${event}`, data);
    
    // Add authentication check
    if (event.startsWith('admin:') && !isAdmin()) {
        throw new Error('Unauthorized');
    }
    
    return data;
});
```

## Service Dependency Injection

### Service Registration

```javascript
// Register service with dependencies
appCore.getService('serviceManager').register('dataProcessor', DataProcessor, {
    singleton: true,
    dependencies: ['config', 'eventBus', 'logger'],
    lazy: false
});

// Service class with dependency injection
class DataProcessor {
    constructor(config, eventBus, logger) {
        this.config = config;
        this.eventBus = eventBus;
        this.logger = logger;
    }

    async initialize() {
        this.logger.info('DataProcessor initialized');
    }

    async process(data) {
        // Process data using injected dependencies
        this.logger.debug('Processing data:', data);
        const result = await this.doProcessing(data);
        this.eventBus.emit('data:processed', { result });
        return result;
    }
}
```

## Configuration Management

### Application Configuration

```javascript
// Initialize with custom configuration
await appCore.initialize({
    features: {
        autoLoad: true,
        enablePlugins: true
    },
    plugins: {
        directory: './plugins',
        autoDiscover: true
    },
    events: {
        debugMode: process.env.NODE_ENV === 'development'
    }
});

// Access configuration
const config = appCore.getService('config');
console.log('Feature auto-load:', config.features.autoLoad);
```

### Feature Configuration

```javascript
// Get feature configuration
const featureConfig = appCore.getService('featureManager').getFeatureConfig('my-feature');

// Update feature configuration
appCore.getService('featureManager').updateFeatureConfig('my-feature', {
    enabled: true,
    autoStart: false
});
```

## Best Practices

### 1. Feature Development

- Always register features with appropriate capabilities
- Use hooks for extensibility
- Emit events for important state changes
- Implement proper cleanup methods

### 2. Plugin Development

- Keep plugins self-contained
- Use dependency injection for external services
- Implement proper initialization and cleanup
- Follow the plugin interface contract

### 3. Event Usage

- Use descriptive event names with namespaces
- Keep event data minimal and focused
- Use middleware for cross-cutting concerns
- Handle errors gracefully in event listeners

### 4. Service Design

- Make services stateless when possible
- Use dependency injection for external dependencies
- Implement proper lifecycle methods
- Handle errors and edge cases

## Migration Guide

### From Old Architecture

1. **Replace direct function calls with events:**
   ```javascript
   // Old way
   buddy.captureScreenshot();
   
   // New way
   appCore.emit('screenshot:capture');
   ```

2. **Register features instead of hardcoding:**
   ```javascript
   // Old way - hardcoded in components
   if (this.isSelectedModelScreenshotCapable) {
       // Screenshot logic
   }
   
   // New way - feature-based
   const screenshotFeatures = appCore.getService('featureManager')
       .getFeaturesWithCapability('screenshot');
   ```

3. **Use service injection instead of global objects:**
   ```javascript
   // Old way
   const result = await buddy.sendTextMessage(text);
   
   // New way
   const aiService = appCore.getService('aiService');
   const result = await aiService.sendMessage(text);
   ```

## Example: Adding a New AI Provider

```javascript
// 1. Create the provider feature
class NewAIProvider {
    async initialize() {
        appCore.registerFeature('new-ai-provider', {
            name: 'New AI Provider',
            capabilities: ['ai-integration', 'text-processing'],
            handlers: {
                sendMessage: this.sendMessage.bind(this),
                initialize: this.initialize.bind(this)
            }
        });
    }

    async sendMessage(message) {
        // Implementation
    }
}

// 2. Register as a service
appCore.getService('serviceManager').register('newAIProvider', NewAIProvider, {
    dependencies: ['config', 'eventBus']
});

// 3. Subscribe to events
appCore.on('ai:send-message', async (data) => {
    const provider = appCore.getService('newAIProvider');
    const result = await provider.sendMessage(data.message);
    appCore.emit('ai:message-sent', { result });
});
```

This architecture makes it easy to add new features, maintain existing code, and scale the application as needed. Each component is loosely coupled and can be developed, tested, and deployed independently. 