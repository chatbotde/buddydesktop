#!/usr/bin/env node

/**
 * Test script for DSPy Teacher Profiles
 * This script tests the new math, physics, and chemistry teacher profiles
 */

const DSPyService = require('./src/dspy/DSPyService');

async function testTeacherProfiles() {
    console.log('🧪 Testing DSPy Teacher Profiles...\n');
    
    const dspyService = new DSPyService({
        port: 8765,
        autoRestart: true,
        maxRestarts: 3
    });

    try {
        // Start the DSPy service
        console.log('🚀 Starting DSPy service...');
        const started = await dspyService.start();
        if (!started) {
            throw new Error('Failed to start DSPy service');
        }
        console.log('✅ DSPy service started successfully\n');

        // Wait a moment for service to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Configure with a test API key (you'll need to replace this)
        console.log('⚙️ Configuring DSPy...');
        await dspyService.configure('openai', 'gpt-3.5-turbo', 'your-api-key-here');
        console.log('✅ DSPy configured successfully\n');

        // Test Math Teacher Profile
        console.log('📚 Testing Math Teacher Profile...');
        const mathResult = await dspyService.generate(
            'How do I solve the quadratic equation x² + 5x + 6 = 0?',
            'This is for a high school algebra class',
            'math_teacher'
        );
        console.log('Math Teacher Response:');
        console.log(mathResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test Physics Teacher Profile
        console.log('⚡ Testing Physics Teacher Profile...');
        const physicsResult = await dspyService.generate(
            'What is Newton\'s Second Law and how do I apply it?',
            'This is for a college physics class',
            'physics_teacher'
        );
        console.log('Physics Teacher Response:');
        console.log(physicsResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test Chemistry Teacher Profile
        console.log('🧪 Testing Chemistry Teacher Profile...');
        const chemistryResult = await dspyService.generate(
            'How do I balance the chemical equation H₂ + O₂ → H₂O?',
            'This is for a high school chemistry class',
            'chemistry_teacher'
        );
        console.log('Chemistry Teacher Response:');
        console.log(chemistryResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('🎉 All teacher profile tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        // Stop the service
        console.log('\n🛑 Stopping DSPy service...');
        await dspyService.stop();
        console.log('✅ DSPy service stopped');
    }
}

// Run the test if this script is executed directly
if (require.main === module) {
    testTeacherProfiles().catch(console.error);
}

module.exports = { testTeacherProfiles }; 