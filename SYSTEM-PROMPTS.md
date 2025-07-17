# System Prompts Implementation

This document describes the comprehensive system prompt implementation in Buddy, providing users with powerful customization capabilities for AI behavior.

## Overview

The system prompt implementation consists of several components:

1. **Core Prompts** (`src/prompts.js`) - Predefined system prompts for different use cases
2. **Prompt Manager** (`src/lib/prompt-manager.js`) - Advanced prompt management utilities
3. **UI Components** - User interface for prompt customization
4. **Integration** - Seamless integration with all AI providers

## Available Profiles

### General Purpose
- **Default** - General-purpose assistant for problem-solving and analysis
- **General** - Helpful AI assistant for various tasks

### Professional
- **Interview** - Job interview preparation and practice
- **Sales** - Sales conversations and objection handling  
- **Meeting** - Business meeting assistance and facilitation

### Educational
- **Math Teacher** - Mathematics instruction with step-by-step solutions
- **Physics Teacher** - Physics concepts with real-world applications
- **Chemistry Teacher** - Chemistry instruction with molecular understanding

### Technical
- **Troubleshooter** - Code debugging and problem resolution
- **Code Reviewer** - Code quality analysis and improvement suggestions
- **Technical Writer** - Technical documentation and writing assistance
- **System Admin** - System administration and DevOps guidance
- **Data Analyst** - Data analysis and statistical interpretation

### Specialized
- **Screen Analyzer** - Screen content analysis and insights

## Features

### 1. Profile Selection
Users can choose from predefined profiles optimized for specific use cases:

```javascript
// Get available profiles
const profiles = getAllProfiles();

// Check if profile exists
const isValid = hasProfile('math_teacher');

// Get system prompt for profile
const prompt = getSystemPrompt('math_teacher');
```

### 2. Custom Instructions
Add personalized instructions to any profile:

```javascript
const customPrompt = "Always be encouraging and provide step-by-step explanations";
const combinedPrompt = getSystemPrompt('math_teacher', customPrompt);
```

### 3. Advanced Prompt Manager
The `PromptManager` class provides advanced functionality:

```javascript
const { promptManager } = require('./src/lib/prompt-manager');

// Save custom prompts
promptManager.saveCustomPrompt('interview', 'Focus on behavioral questions');

// Get profiles with metadata
const profiles = promptManager.getProfilesWithMetadata();

// Create conversation context
const context = promptManager.createConversationContext(messages, 'sales');

// Get usage statistics
const stats = promptManager.getStats();
```

### 4. UI Components

#### Basic Customization (Customize View)
- Profile selection dropdown
- Custom prompt textarea
- Language selection
- Access to advanced prompt manager

#### Advanced Prompt Manager
- Visual profile selection grid
- Real-time prompt preview
- Custom instruction editor
- Save/load configurations

## Usage Examples

### Basic Usage
```javascript
// Simple profile selection
const systemPrompt = getSystemPrompt('interview');

// With custom instructions
const customPrompt = getSystemPrompt('sales', 'Focus on enterprise clients');
```

### Advanced Usage
```javascript
// Using the prompt manager
const manager = new PromptManager();

// Save custom configuration
manager.saveCustomPrompt('technical_writer', 'Write for beginners');

// Create conversation with context
const conversation = manager.createConversationContext([
    { role: 'user', content: 'Explain APIs' }
], 'technical_writer');

// Get statistics
const stats = manager.getStats();
console.log(`Using ${stats.totalProfiles} profiles`);
```

### Integration with AI Providers
All AI providers automatically use the system prompts:

```javascript
// Google AI Provider
const provider = new GoogleAIProvider(apiKey, 'math_teacher', 'en', customPrompt, model);

// OpenAI Provider  
const provider = new OpenAIProvider(apiKey, 'code_reviewer', 'en', customPrompt, model);
```

## Mathematical Notation Support

All educational profiles support beautiful mathematical notation using KaTeX LaTeX:

- Inline math: `$x^2 + y^2 = z^2$`
- Display math: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`
- Chemical equations: `$\ce{2H2 + O2 -> 2H2O}$`
- Physics notation: `$\vec{F} = m\vec{a}$`

## Navigation

### Accessing System Prompts
1. **Basic**: Settings → Customize → Select Profile & Custom Prompt
2. **Advanced**: Settings → Customize → "Advanced Prompt Manager" button

### Views
- `customize` - Basic profile and custom prompt selection
- `prompt-manager` - Advanced prompt management interface

## API Reference

### Core Functions (`src/prompts.js`)

```javascript
// Get system prompt for profile with optional custom instructions
getSystemPrompt(profile = 'default', customPrompt = '')

// Get all available profile names
getAllProfiles()

// Check if profile exists
hasProfile(profile)

// Format response with system prompt info
formatResponseWithSystemPrompt(response, profile, customPrompt)

// Create conversation context
buildConversationContext(messages, profile, customPrompt)
```

### Prompt Manager (`src/lib/prompt-manager.js`)

```javascript
// Get prompt with options
getPrompt(profile, customPrompt, options)

// Save/retrieve custom prompts
saveCustomPrompt(profile, customPrompt)
getCustomPrompt(profile)

// Profile management
getProfilesWithMetadata()
validateProfile(profile)

// Conversation context
createConversationContext(messages, profile, customPrompt)

// Statistics and history
getStats()
getHistory(limit)

// Configuration management
exportConfig()
importConfig(config)
```

## Testing

Run the system prompt tests:

```bash
node test-system-prompts.js
```

This will verify:
- Basic prompt retrieval
- Custom prompt integration
- Profile validation
- Prompt manager functionality
- Statistics and export/import

## Best Practices

### 1. Profile Selection
- Choose profiles that match your specific use case
- Use educational profiles for learning and teaching
- Use professional profiles for work-related tasks

### 2. Custom Instructions
- Be specific about desired behavior
- Include context about your audience or domain
- Keep instructions concise but clear

### 3. Mathematical Content
- Use proper LaTeX notation for mathematical expressions
- Test mathematical rendering in the preview
- Include units and proper notation for physics/chemistry

### 4. Performance
- System prompts are cached for performance
- Profile switching is instant
- Custom prompts are saved locally

## Troubleshooting

### Common Issues

1. **Profile not found**: Check spelling and use `getAllProfiles()` to see available options
2. **Math not rendering**: Ensure proper LaTeX syntax with `$...$` or `$$...$$`
3. **Custom prompt not applied**: Verify the prompt is saved and the session is restarted

### Debug Information

```javascript
// Check current configuration
const stats = promptManager.getStats();
console.log('Current configuration:', stats);

// Verify profile exists
const isValid = hasProfile('your_profile');
console.log('Profile valid:', isValid);

// Check prompt content
const prompt = getSystemPrompt('your_profile', 'your_custom_prompt');
console.log('Generated prompt:', prompt);
```

## Future Enhancements

Planned improvements:
- Profile templates and sharing
- Prompt optimization suggestions
- Usage analytics and recommendations
- Integration with external prompt libraries
- A/B testing for prompt effectiveness

---

For more information, see the source code in `src/prompts.js` and `src/lib/prompt-manager.js`.