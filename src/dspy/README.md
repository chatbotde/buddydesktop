# DSPy Integration for Buddy Desktop

## Overview

DSPy (Declarative Self-improving Python) integration brings advanced AI pipeline optimization and declarative programming capabilities to Buddy Desktop. This integration allows you to create, optimize, and use custom AI pipelines for enhanced conversation quality and specialized tasks.

## Features

### 🚀 Core Capabilities
- **Declarative AI Pipelines**: Create custom AI workflows using DSPy signatures
- **Self-Improving Models**: Automatically optimize pipelines based on examples
- **Multiple Pipeline Types**: Basic, QA, Chain-of-Thought, RAG, and custom pipelines
- **Real-time Optimization**: Continuously improve responses based on conversation history
- **Cross-Provider Support**: Works with all supported AI providers (Google, OpenAI, Anthropic, etc.)

### 🔧 Pipeline Types
1. **Basic Pipeline**: Simple question-answer generation
2. **QA Pipeline**: Context-aware question answering
3. **Chain-of-Thought**: Step-by-step reasoning with explanations
4. **RAG Pipeline**: Retrieval-augmented generation
5. **Custom Pipelines**: User-defined signatures and workflows

### 📊 Optimization Features
- **Example-Based Learning**: Learn from conversation examples
- **Automatic Pipeline Selection**: Choose optimal pipeline for each task
- **Performance Metrics**: Track and improve response quality
- **Memory Management**: Efficient handling of large conversation histories

## Installation

### Prerequisites
- Python 3.8+ installed and accessible from command line
- Node.js 16+ (already required for Buddy Desktop)
- Internet connection for initial DSPy installation

### Automatic Setup
Run the setup script to automatically install and configure DSPy:

```bash
# From the buddy directory
node src/dspy/setup-dspy.js
```

### Manual Setup
If automatic setup fails, follow these steps:

1. **Verify Python Installation**:
   ```bash
   python --version  # or python3 --version
   ```

2. **Install DSPy**:
   ```bash
   pip install dspy-ai
   ```

3. **Verify Installation**:
   ```bash
   python -c "import dspy; print('DSPy installed successfully')"
   ```

## Configuration

### Environment Variables
Add these to your `.env` file:

```env
# DSPy Configuration
DSPY_SERVICE_PORT=8765
DSPY_LOG_LEVEL=info
DSPY_AUTO_OPTIMIZE=true
DSPY_MAX_EXAMPLES=100
DSPY_OPTIMIZATION_INTERVAL=10
```

### Provider Configuration
DSPy works with your existing AI provider API keys:

```env
# Your existing API keys work with DSPy
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Usage

### Basic Usage
1. **Select DSPy Provider**: Choose "DSPy (Advanced)" from the provider dropdown
2. **Select Model**: Choose your preferred AI model
3. **Start Session**: Begin chatting normally - DSPy will automatically optimize responses

### Advanced Features

#### Custom Pipeline Creation
```javascript
// Example: Creating a custom pipeline for code review
const signatureConfig = {
  name: "CodeReviewSignature",
  description: "Review code and provide suggestions",
  fields: {
    code: { type: "input", description: "Code to review" },
    language: { type: "input", description: "Programming language" },
    suggestions: { type: "output", description: "Code improvement suggestions" },
    explanation: { type: "output", description: "Explanation of suggestions" }
  }
};

// Create the pipeline
await buddy.createCustomPipeline(signatureConfig, 'predict');
```

#### Manual Optimization
```javascript
// Optimize pipeline with specific examples
const examples = [
  {
    input: "What is the time complexity of binary search?",
    output: "Binary search has O(log n) time complexity because it divides the search space in half with each iteration."
  },
  {
    input: "Explain recursion",
    output: "Recursion is when a function calls itself. It has a base case to stop and a recursive case that calls the function with a smaller problem."
  }
];

await buddy.optimizePipeline(examples, 'qa');
```

### Pipeline Types Explained

#### 1. Basic Pipeline
- **Use Case**: Simple Q&A, general conversation
- **Features**: Direct question-to-answer mapping
- **Best For**: Casual conversation, quick answers

#### 2. QA Pipeline
- **Use Case**: Context-aware questions
- **Features**: Uses provided context to answer questions
- **Best For**: Document Q&A, contextual responses

#### 3. Chain-of-Thought Pipeline
- **Use Case**: Complex reasoning tasks
- **Features**: Step-by-step reasoning with explanations
- **Best For**: Math problems, logical reasoning, debugging

#### 4. RAG Pipeline
- **Use Case**: Information retrieval and synthesis
- **Features**: Retrieves relevant information before generating response
- **Best For**: Research, fact-checking, comprehensive answers

## API Reference

### DSPyProvider Methods

#### `initialize()`
Initialize the DSPy service and configure the provider.

#### `sendRealtimeInput(input)`
Send input to DSPy for processing and optimization.

#### `optimizePipeline(examples, pipelineType)`
Optimize a pipeline with provided examples.

**Parameters:**
- `examples`: Array of input/output pairs
- `pipelineType`: Type of pipeline ('basic', 'qa', 'cot', 'rag')

#### `createCustomPipeline(signatureConfig, pipelineType)`
Create a custom pipeline with user-defined signature.

**Parameters:**
- `signatureConfig`: Configuration object defining the signature
- `pipelineType`: Type of pipeline ('predict', 'optimize')

#### `getAvailableModels()`
Get list of available DSPy models.

#### `getServiceStatus()`
Get current status of DSPy service.

### DSPyService Methods

#### `start()`
Start the DSPy Python service.

#### `stop()`
Stop the DSPy Python service.

#### `configure(provider, model, apiKey)`
Configure DSPy with specific provider settings.

#### `generate(query, context, pipelineType)`
Generate response using specified pipeline.

#### `optimize(examples, pipelineType)`
Optimize pipeline with examples.

## Troubleshooting

### Common Issues

#### 1. Python Not Found
**Error**: `Python not found in PATH`
**Solution**: 
- Ensure Python is installed and in your system PATH
- Try using `python3` instead of `python`
- Add Python to PATH manually

#### 2. DSPy Installation Fails
**Error**: `Failed to install DSPy`
**Solution**:
- Check internet connection
- Try installing manually: `pip install dspy-ai`
- Update pip: `pip install --upgrade pip`

#### 3. Service Won't Start
**Error**: `DSPy service failed to start`
**Solution**:
- Check if port 8765 is available
- Restart the application
- Check Python environment

#### 4. Optimization Not Working
**Error**: `Pipeline optimization failed`
**Solution**:
- Ensure you have sufficient examples (minimum 3)
- Check API key validity
- Verify model compatibility

### Debug Mode
Enable debug logging by setting environment variable:
```env
DSPY_LOG_LEVEL=debug
```

### Health Check
Check DSPy service status:
```javascript
const status = await buddy.getServiceStatus();
console.log(status);
```

## Performance Optimization

### Memory Management
- DSPy automatically manages conversation history
- Old examples are archived after optimization
- Memory usage is monitored and optimized

### Response Time
- First response may be slower due to pipeline initialization
- Subsequent responses are optimized and faster
- Pipeline caching reduces initialization time

### Quality Improvement
- DSPy learns from your conversation patterns
- Quality improves over time with more examples
- Automatic pipeline selection optimizes for task type

## Advanced Configuration

### Custom Signatures
Create custom DSPy signatures for specialized tasks:

```javascript
const customSignature = {
  name: "TranslationSignature",
  description: "Translate text between languages",
  fields: {
    text: { type: "input", description: "Text to translate" },
    sourceLanguage: { type: "input", description: "Source language" },
    targetLanguage: { type: "input", description: "Target language" },
    translation: { type: "output", description: "Translated text" },
    confidence: { type: "output", description: "Translation confidence" }
  }
};
```

### Pipeline Optimization Settings
```javascript
const optimizationConfig = {
  maxExamples: 50,
  optimizationInterval: 5,
  qualityThreshold: 0.8,
  autoOptimize: true
};
```

## Integration with Existing Features

### Screenshot Support
DSPy can process screenshots and images:
- Automatic image analysis
- Context-aware responses
- Visual reasoning capabilities

### Audio Processing
DSPy works with audio input:
- Speech-to-text processing
- Audio context understanding
- Multi-modal responses

### Chat History
DSPy learns from your conversation history:
- Automatic example extraction
- Pattern recognition
- Personalized optimization

## Best Practices

### 1. Start Simple
- Begin with basic pipeline
- Gradually add complexity
- Test thoroughly before production use

### 2. Provide Good Examples
- Use diverse, high-quality examples
- Include edge cases
- Regular example updates

### 3. Monitor Performance
- Track response quality
- Monitor optimization success
- Adjust parameters as needed

### 4. Regular Maintenance
- Update DSPy regularly
- Clean up old examples
- Monitor memory usage

## Examples

### Example 1: Code Review Pipeline
```javascript
// Create a code review pipeline
const codeReviewConfig = {
  name: "CodeReviewSignature",
  description: "Review code and provide suggestions",
  fields: {
    code: { type: "input", description: "Code to review" },
    language: { type: "input", description: "Programming language" },
    suggestions: { type: "output", description: "Code improvement suggestions" },
    explanation: { type: "output", description: "Explanation of suggestions" }
  }
};

await buddy.createCustomPipeline(codeReviewConfig, 'predict');
```

### Example 2: Math Problem Solving
```javascript
// Optimize for math problems
const mathExamples = [
  {
    input: "Solve: 2x + 5 = 13",
    output: "Let's solve this step by step:\n1. Subtract 5 from both sides: 2x = 8\n2. Divide both sides by 2: x = 4\nAnswer: x = 4"
  },
  {
    input: "What is the area of a circle with radius 5?",
    output: "The area of a circle is A = πr²\nA = π(5)² = π(25) = 25π ≈ 78.54 square units"
  }
];

await buddy.optimizePipeline(mathExamples, 'cot');
```

### Example 3: Language Translation
```javascript
// Create translation pipeline
const translationConfig = {
  name: "TranslationSignature",
  description: "Translate text between languages",
  fields: {
    text: { type: "input", description: "Text to translate" },
    sourceLanguage: { type: "input", description: "Source language" },
    targetLanguage: { type: "input", description: "Target language" },
    translation: { type: "output", description: "Translated text" }
  }
};

await buddy.createCustomPipeline(translationConfig, 'predict');
```

## Support

### Getting Help
- Check the troubleshooting section above
- Review DSPy documentation: https://dspy-docs.vercel.app/
- Open an issue on the Buddy Desktop repository

### Community
- Join the DSPy community: https://github.com/stanfordnlp/dspy
- Share examples and best practices
- Contribute to improvements

## Changelog

### Version 1.0.0
- Initial DSPy integration
- Basic pipeline support
- Automatic optimization
- Cross-provider compatibility

### Upcoming Features
- Advanced pipeline types
- Real-time learning
- Performance analytics
- Custom signature builder UI

---

**Note**: DSPy integration is an advanced feature. For basic usage, the standard AI providers (Google, OpenAI, etc.) are recommended. DSPy is best suited for users who want to create specialized AI workflows and optimize their conversation experience. 