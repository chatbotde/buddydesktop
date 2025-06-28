# DSPy Integration for Buddy Desktop

This document explains how to set up and use DSPy (Declarative Self-improving Python) with Buddy Desktop for optimized AI workflows.

## What is DSPy?

DSPy is a framework for algorithmically optimizing LM prompts and weights. It allows you to:
- Create more reliable and consistent AI pipelines
- Automatically optimize prompts for better performance
- Build complex reasoning chains (Chain of Thought)
- Create question-answering systems with context

## Setup Instructions

### 1. Install Python Dependencies

Run the setup script to install DSPy and required dependencies:

```bash
python setup-dspy.py
```

Or install manually:

```bash
pip install -U dspy-ai
pip install -U requests openai anthropic google-generativeai
```

### 2. Install Node.js Dependencies

Install the concurrently package for running both services:

```bash
npm install
```

### 3. Start the DSPy Service

The DSPy service runs as a separate Python HTTP server:

```bash
# Start DSPy service only
python src/dspy-service.py

# Or start both DSPy service and Buddy Desktop
npm run dev
```

### 4. Configure Buddy Desktop

1. Open Buddy Desktop
2. Select "DSPy (Optimized)" as your AI provider
3. Choose a DSPy model (e.g., "DSPy GPT-4 (Optimized)")
4. Enter your API key for the underlying model (OpenAI, Anthropic, etc.)
5. Click "Start Session"

## Available DSPy Models

- **DSPy GPT-4 (Optimized)**: GPT-4 with DSPy optimization
- **DSPy GPT-3.5 Turbo (Optimized)**: GPT-3.5 Turbo with DSPy optimization  
- **DSPy Claude 3.5 Sonnet (Optimized)**: Claude 3.5 Sonnet with DSPy optimization

## Features

### Automatic Pipeline Selection

DSPy automatically selects the best pipeline based on your input:

- **Basic Pipeline**: Simple text generation
- **Question-Answering Pipeline**: When context (screenshots) is available
- **Chain of Thought Pipeline**: For explanatory queries containing "step by step", "explain", or "how"

### Pipeline Optimization

You can optimize DSPy pipelines with examples through the API:

```javascript
// Example: Optimize pipeline with training examples
const examples = [
    { input: "What is 2+2?", output: "4" },
    { input: "What is 3+3?", output: "6" }
];

fetch('http://localhost:8765/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        examples: examples,
        pipeline_type: 'qa'
    })
});
```

## DSPy Service API

The DSPy service provides the following endpoints:

### Health Check
```
GET /health
```

### Configure DSPy
```
POST /configure
{
    "provider": "openai",
    "model": "gpt-4",
    "api_key": "your-api-key"
}
```

### Generate Response
```
POST /generate
{
    "query": "Your question",
    "context": "Optional context",
    "pipeline_type": "basic|qa|cot"
}
```

### Optimize Pipeline
```
POST /optimize
{
    "examples": [{"input": "...", "output": "..."}],
    "pipeline_type": "qa"
}
```

## Troubleshooting

### DSPy Service Not Starting

1. Check Python version (3.8+ required):
   ```bash
   python --version
   ```

2. Verify DSPy installation:
   ```bash
   python -c "import dspy; print('DSPy installed successfully')"
   ```

3. Check if port 8765 is available:
   ```bash
   # Windows
   netstat -an | findstr 8765
   
   # macOS/Linux
   lsof -i :8765
   ```

### Connection Errors

- Ensure the DSPy service is running before starting Buddy Desktop
- Check that the service is accessible at `http://localhost:8765/health`
- Verify your API keys are correct for the underlying models

### Model Configuration Issues

- Make sure you have valid API keys for the underlying model provider
- Check that the selected model is supported by your API key
- Verify network connectivity to the model provider's API

## Benefits of Using DSPy

1. **Improved Consistency**: DSPy optimizes prompts for more reliable outputs
2. **Better Reasoning**: Chain of Thought pipelines provide step-by-step explanations
3. **Context Awareness**: Q&A pipelines effectively use screenshot context
4. **Automatic Optimization**: Pipelines improve over time with examples
5. **Structured Outputs**: More predictable and structured responses

## Advanced Usage

### Custom Pipeline Types

You can extend the DSPy service to support custom pipeline types by modifying `src/dspy-service.py`.

### Training with Examples

Collect examples of good inputs/outputs and use the optimize endpoint to improve performance.

### Multiple Models

Switch between different underlying models (GPT-4, Claude, etc.) while maintaining DSPy optimizations.

## Resources

- [DSPy Documentation](https://dspy-docs.vercel.app/)
- [DSPy GitHub Repository](https://github.com/stanfordnlp/dspy)
- [DSPy Paper](https://arxiv.org/abs/2310.03714)

## Support

If you encounter issues with DSPy integration:

1. Check the DSPy service logs in the terminal
2. Verify your Python environment and dependencies
3. Test the DSPy service endpoints directly with curl or Postman
4. Review the Buddy Desktop console for error messages 