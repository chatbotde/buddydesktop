// Test script to verify model system
import { getModelsByProvider, getModelById } from './src/lib/models/models.js';

console.log('Testing Model System...\n');

// Test providers
const providers = ['google', 'openai', 'anthropic', 'deepseek', 'openrouter'];

providers.forEach(provider => {
    console.log(`\n=== ${provider.toUpperCase()} MODELS ===`);
    const models = getModelsByProvider(provider);
    
    if (models && models.length > 0) {
        models.forEach(model => {
            console.log(`  ${model.id}`);
            console.log(`    Name: ${model.name}`);
            console.log(`    Live: ${model.live ? 'YES' : 'NO'}`);
            console.log(`    Capabilities: ${Object.keys(model.capabilities).filter(k => model.capabilities[k]).join(', ')}`);
            console.log('');
        });
        
        console.log(`  Default model: ${models[0].id}`);
    } else {
        console.log('  No models found');
    }
});

// Test specific model lookup
console.log('\n=== SPECIFIC MODEL TESTS ===');
const testModels = [
    'gemini-2.0-flash-live-001',
    'gemini-2.5-flash',
    'gpt-4',
    'claude-3-5-sonnet-20241022'
];

testModels.forEach(modelId => {
    const model = getModelById(modelId);
    if (model) {
        console.log(`✓ ${modelId} - ${model.live ? 'Real-time' : 'Chat-only'}`);
    } else {
        console.log(`✗ ${modelId} - Not found`);
    }
});

console.log('\n✅ Model system test complete!'); 