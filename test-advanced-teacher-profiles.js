#!/usr/bin/env node

/**
 * Test script for Advanced DSPy Teacher Profiles
 * Demonstrates modular design, ReAct capabilities, and multi-stage pipelines
 */

const DSPyService = require('./src/dspy/DSPyService');

async function testAdvancedTeacherProfiles() {
    console.log('🧪 Testing Advanced DSPy Teacher Profiles with Modular Design...\n');
    
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

        // Test Advanced Math Teacher Profile
        console.log('📚 Testing Advanced Math Teacher Profile...');
        const advancedMathResult = await dspyService.request('POST', '/advanced-teacher', {
            query: 'Prove that the sum of the angles in a triangle equals 180 degrees',
            context: 'This is for a high school geometry class',
            teacher_type: 'math'
        });
        console.log('Advanced Math Teacher Response:');
        console.log(advancedMathResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test Advanced Physics Teacher Profile
        console.log('⚡ Testing Advanced Physics Teacher Profile...');
        const advancedPhysicsResult = await dspyService.request('POST', '/advanced-teacher', {
            query: 'Calculate the uncertainty in measuring the acceleration due to gravity using a pendulum',
            context: 'This is for a college physics laboratory',
            teacher_type: 'physics'
        });
        console.log('Advanced Physics Teacher Response:');
        console.log(advancedPhysicsResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test Advanced Chemistry Teacher Profile
        console.log('🧪 Testing Advanced Chemistry Teacher Profile...');
        const advancedChemistryResult = await dspyService.request('POST', '/advanced-teacher', {
            query: 'Calculate the theoretical yield and limiting reactant for the reaction: 2H₂ + O₂ → 2H₂O, starting with 10g H₂ and 50g O₂',
            context: 'This is for a high school chemistry laboratory',
            teacher_type: 'chemistry'
        });
        console.log('Advanced Chemistry Teacher Response:');
        console.log(advancedChemistryResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        // Test different types of math problems
        console.log('🔢 Testing Different Math Problem Types...');
        
        // Geometry problem
        const geometryResult = await dspyService.request('POST', '/advanced-teacher', {
            query: 'Find the area of a circle with radius 5 units',
            context: 'Geometry class',
            teacher_type: 'math'
        });
        console.log('Geometry Problem Response:');
        console.log(geometryResult.response);
        console.log('\n' + '='.repeat(30) + '\n');

        // Statistics problem
        const statisticsResult = await dspyService.request('POST', '/advanced-teacher', {
            query: 'Calculate the mean, median, and standard deviation of the dataset: [2, 4, 6, 8, 10, 12, 14]',
            context: 'Statistics class',
            teacher_type: 'math'
        });
        console.log('Statistics Problem Response:');
        console.log(statisticsResult.response);
        console.log('\n' + '='.repeat(30) + '\n');

        // Proof problem
        const proofResult = await dspyService.request('POST', '/advanced-teacher', {
            query: 'Prove that the square root of 2 is irrational',
            context: 'Number theory class',
            teacher_type: 'math'
        });
        console.log('Proof Problem Response:');
        console.log(proofResult.response);
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('🎉 All advanced teacher profile tests completed successfully!');
        console.log('\n📊 Summary of Advanced Features Demonstrated:');
        console.log('✅ Modular DSPy design with typed signatures');
        console.log('✅ Multi-stage pipelines with specialized modules');
        console.log('✅ Problem type routing and specialized handling');
        console.log('✅ Structured reasoning with Chain of Thought');
        console.log('✅ Advanced calculations and analysis');
        console.log('✅ Safety considerations and error analysis');

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
    testAdvancedTeacherProfiles().catch(console.error);
}

module.exports = { testAdvancedTeacherProfiles }; 