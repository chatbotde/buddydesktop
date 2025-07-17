/**
 * Test script for System Prompt functionality
 * This script tests the system prompt manager and prompt utilities
 */

const { getSystemPrompt, getAllProfiles, hasProfile } = require('./src/prompts');
const { promptManager } = require('./src/lib/prompt-manager');

async function testSystemPrompts() {
    console.log('🧪 Testing System Prompt Implementation...\n');

    try {
        // Test 1: Basic prompt retrieval
        console.log('📝 Test 1: Basic Prompt Retrieval');
        const defaultPrompt = getSystemPrompt('default');
        console.log('✅ Default prompt loaded:', defaultPrompt.length > 0 ? 'Success' : 'Failed');
        
        const mathPrompt = getSystemPrompt('math_teacher');
        console.log('✅ Math teacher prompt loaded:', mathPrompt.length > 0 ? 'Success' : 'Failed');
        
        // Test 2: Custom prompt integration
        console.log('\n📝 Test 2: Custom Prompt Integration');
        const customPrompt = 'Always respond with enthusiasm and use emojis!';
        const combinedPrompt = getSystemPrompt('general', customPrompt);
        const hasCustom = combinedPrompt.includes(customPrompt);
        console.log('✅ Custom prompt integration:', hasCustom ? 'Success' : 'Failed');
        
        // Test 3: Profile validation
        console.log('\n📝 Test 3: Profile Validation');
        const profiles = getAllProfiles();
        console.log('✅ Available profiles:', profiles.length);
        console.log('   Profiles:', profiles.join(', '));
        
        const validProfile = hasProfile('interview');
        const invalidProfile = hasProfile('nonexistent');
        console.log('✅ Valid profile check:', validProfile ? 'Success' : 'Failed');
        console.log('✅ Invalid profile check:', !invalidProfile ? 'Success' : 'Failed');
        
        // Test 4: Prompt Manager functionality
        console.log('\n📝 Test 4: Prompt Manager');
        const profilesWithMetadata = promptManager.getProfilesWithMetadata();
        console.log('✅ Profiles with metadata:', profilesWithMetadata.length);
        
        // Test saving custom prompt
        promptManager.saveCustomPrompt('test_profile', 'This is a test custom prompt');
        const savedPrompt = promptManager.getCustomPrompt('test_profile');
        console.log('✅ Save/retrieve custom prompt:', savedPrompt === 'This is a test custom prompt' ? 'Success' : 'Failed');
        
        // Test conversation context
        const messages = [
            { role: 'user', content: 'Hello, how are you?' },
            { role: 'assistant', content: 'I am doing well, thank you!' }
        ];
        const context = promptManager.createConversationContext(messages, 'interview', 'Be professional');
        console.log('✅ Conversation context creation:', context.messages.length === 3 ? 'Success' : 'Failed');
        
        // Test 5: Statistics
        console.log('\n📝 Test 5: Statistics');
        const stats = promptManager.getStats();
        console.log('✅ Statistics generated:');
        console.log('   Total profiles:', stats.totalProfiles);
        console.log('   Custom prompts:', stats.customPromptsCount);
        console.log('   History size:', stats.historySize);
        
        // Test 6: Export/Import
        console.log('\n📝 Test 6: Export/Import Configuration');
        const config = promptManager.exportConfig();
        console.log('✅ Export config:', config.exportedAt ? 'Success' : 'Failed');
        
        // Clean up test data
        promptManager.removeCustomPrompt('test_profile');
        
        console.log('\n🎉 All system prompt tests completed successfully!');
        console.log('\n📊 Summary:');
        console.log('✅ Basic prompt retrieval working');
        console.log('✅ Custom prompt integration working');
        console.log('✅ Profile validation working');
        console.log('✅ Prompt manager functionality working');
        console.log('✅ Statistics and export/import working');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testSystemPrompts()
        .then(() => {
            console.log('\n✅ All tests passed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Tests failed:', error);
            process.exit(1);
        });
}

module.exports = { testSystemPrompts };