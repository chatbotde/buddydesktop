/**
 * Debug script to trace exactly where duplicate math processing is happening
 * Run this in the browser console to see the processing pipeline
 */

console.log('🔍 Starting duplicate math processing trace...');

// Override console methods to capture all processing
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

const processingLog = [];

function captureLog(type, ...args) {
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    processingLog.push({ type, message, timestamp: Date.now() });
    
    // Call original method
    if (type === 'log') originalLog.apply(console, args);
    else if (type === 'warn') originalWarn.apply(console, args);
    else if (type === 'error') originalError.apply(console, args);
}

console.log = (...args) => captureLog('log', ...args);
console.warn = (...args) => captureLog('warn', ...args);
console.error = (...args) => captureLog('error', ...args);

// Test input
const testInput = 'The equation $E = mc^2$ is famous.';
console.log('🧪 Testing input:', testInput);

// Import the enhanced content processor
import('./components/enhanced-content-processor.js').then(module => {
    const { enhancedContentProcessor } = module;
    
    console.log('📝 Processing with enhancedContentProcessor...');
    const result = enhancedContentProcessor.processContentSync(testInput);
    
    console.log('📊 Final result:', result);
    
    // Analyze the result
    const rawMathCount = (result.match(/\$[^$]+\$/g) || []).length;
    const processedMathCount = (result.match(/math-inline|math-block-container|katex/g) || []).length;
    
    console.log('📈 Analysis:');
    console.log('- Raw math patterns remaining:', rawMathCount);
    console.log('- Processed math elements:', processedMathCount);
    
    if (rawMathCount === 0 && processedMathCount > 0) {
        console.log('✅ SUCCESS: No duplicates detected!');
    } else if (rawMathCount > 0 && processedMathCount > 0) {
        console.log('❌ DUPLICATE: Both raw and processed math found!');
    } else if (rawMathCount > 0) {
        console.log('⚠️ NO PROCESSING: Only raw math found!');
    } else {
        console.log('⚠️ NO MATH: No math detected!');
    }
    
    // Show processing timeline
    console.log('📋 Processing Timeline:');
    processingLog.forEach((entry, index) => {
        console.log(`${index + 1}. [${entry.type.toUpperCase()}] ${entry.message}`);
    });
    
    // Look for specific patterns that indicate duplicate processing
    const mathProcessingLogs = processingLog.filter(entry => 
        entry.message.includes('math') || 
        entry.message.includes('Math') || 
        entry.message.includes('KaTeX') ||
        entry.message.includes('$')
    );
    
    console.log('🔍 Math-related processing logs:');
    mathProcessingLogs.forEach((entry, index) => {
        console.log(`${index + 1}. [${entry.type.toUpperCase()}] ${entry.message}`);
    });
    
    // Check for duplicate processing indicators
    const duplicateIndicators = [
        'Found display math:',
        'Found inline math:',
        'Processing content for math',
        'renderToString'
    ];
    
    duplicateIndicators.forEach(indicator => {
        const count = processingLog.filter(entry => entry.message.includes(indicator)).length;
        if (count > 1) {
            console.log(`⚠️ POTENTIAL DUPLICATE: "${indicator}" appeared ${count} times`);
        }
    });
    
    // Restore original console methods
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
    
    console.log('🔍 Duplicate math processing trace complete!');
});

// Also test the math block processor directly
import('./components/math-block-processor.js').then(module => {
    const { mathBlockProcessor } = module;
    
    console.log('🧮 Testing mathBlockProcessor directly...');
    const directResult = mathBlockProcessor.processContent(testInput);
    console.log('🧮 Direct result:', directResult);
    
    const directRawCount = (directResult.match(/\$[^$]+\$/g) || []).length;
    const directProcessedCount = (directResult.match(/math-inline|math-block-container|katex/g) || []).length;
    
    console.log('🧮 Direct analysis:');
    console.log('- Raw math patterns:', directRawCount);
    console.log('- Processed math elements:', directProcessedCount);
});