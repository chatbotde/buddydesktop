/**
 * Console Debug Helper for Live Streaming
 * 
 * Open your browser console and run:
 * - checkLiveStreaming()
 * - showModels() 
 * - testLiveStreamingButton()
 * - switchToLiveModel()
 */

window.checkLiveStreaming = function() {
    console.log('🔍 Live Streaming Debug Check\n=====================================');
    
    // Get the buddy app element
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        console.error('❌ buddy-app element not found');
        return;
    }
    
    console.log('✅ Found buddy-app element');
    
    // Check selected model
    console.log('\n📋 Current State:');
    console.log('Selected Model:', buddyApp.selectedModel);
    console.log('Selected Provider:', buddyApp.selectedProvider);
    
    // Check if model is realtime
    const isRealtime = buddyApp.isSelectedModelRealTime;
    console.log('Is Selected Model Realtime:', isRealtime ? '✅ YES' : '❌ NO');
    
    // Check live streaming API
    console.log('\n🔌 Live Streaming API:');
    console.log('window.buddy exists:', !!window.buddy);
    console.log('startLiveStreaming exists:', !!(window.buddy && window.buddy.startLiveStreaming));
    console.log('stopLiveStreaming exists:', !!(window.buddy && window.buddy.stopLiveStreaming));
    
    // Check assistant view
    const assistantView = document.querySelector('buddy-assistant-view');
    console.log('\n🎯 Assistant View:');
    console.log('Assistant view found:', !!assistantView);
    if (assistantView) {
        console.log('Live streaming active:', assistantView.isLiveStreamingActive);
    }
    
    // Check actions menu button
    const actionsButton = assistantView?.shadowRoot?.querySelector('.action-btn');
    console.log('Actions button found:', !!actionsButton);
    
    if (assistantView?.shadowRoot) {
        const liveStreamingButton = assistantView.shadowRoot.querySelector('.dropdown-item .dropdown-item-label');
        const buttons = Array.from(assistantView.shadowRoot.querySelectorAll('.dropdown-item .dropdown-item-label'))
            .map(el => el.textContent);
        console.log('Available action buttons:', buttons);
    }
    
    console.log('\n💡 Suggestions:');
    if (!isRealtime) {
        console.log('1. Select a real-time capable model (e.g. "Gemini 2.0 Flash Live")');
        console.log('2. Run switchToLiveModel() to auto-select one');
    }
    if (isRealtime) {
        console.log('1. Open the actions menu (three dots) in the assistant view');
        console.log('2. Look for the "Live Streaming" button');
        console.log('3. If not visible, try running testLiveStreamingButton()');
    }
    
    console.log('\n=====================================');
};

window.showModels = function() {
    console.log('📚 Available Models\n===================');
    
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        console.error('❌ buddy-app element not found');
        return;
    }
    
    const models = buddyApp.getAvailableModels ? buddyApp.getAvailableModels() : [];
    console.log(`Found ${models.length} models:`);
    
    models.forEach((model, index) => {
        const isRealtime = model.live === true || (model.capabilities && model.capabilities.includes('realtime'));
        const status = isRealtime ? '🎥 REALTIME' : '📝 REGULAR';
        console.log(`${index + 1}. ${status} - ${model.name || model.model}`);
        if (model.capabilities) {
            console.log(`   Capabilities: ${model.capabilities.join(', ')}`);
        }
        if (model.live !== undefined) {
            console.log(`   Live: ${model.live}`);
        }
    });
    
    const realtimeModels = models.filter(model => 
        model.live === true || (model.capabilities && model.capabilities.includes('realtime'))
    );
    
    console.log(`\n🎥 Real-time capable models: ${realtimeModels.length}`);
    realtimeModels.forEach(model => {
        console.log(`  - ${model.name || model.model} (${model.provider})`);
    });
};

window.switchToLiveModel = function() {
    console.log('🔄 Switching to Live Model\n===========================');
    
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        console.error('❌ buddy-app element not found');
        return;
    }
    
    const models = buddyApp.getAvailableModels ? buddyApp.getAvailableModels() : [];
    const realtimeModels = models.filter(model => 
        model.live === true || (model.capabilities && model.capabilities.includes('realtime'))
    );
    
    if (realtimeModels.length === 0) {
        console.error('❌ No real-time capable models found!');
        return;
    }
    
    const targetModel = realtimeModels[0];
    console.log(`Switching to: ${targetModel.name || targetModel.model}`);
    
    // Dispatch model selection event
    buddyApp.dispatchEvent(new CustomEvent('model-selected', {
        detail: {
            model: targetModel.model,
            provider: targetModel.provider,
            modelData: targetModel
        }
    }));
    
    setTimeout(() => {
        console.log('✅ Model switched! Check status:');
        console.log('Selected Model:', buddyApp.selectedModel);
        console.log('Is Realtime:', buddyApp.isSelectedModelRealTime);
    }, 500);
};

window.testLiveStreamingButton = function() {
    console.log('🧪 Testing Live Streaming Button\n==================================');
    
    const assistantView = document.querySelector('buddy-assistant-view');
    if (!assistantView) {
        console.error('❌ Assistant view not found');
        return;
    }
    
    if (!assistantView.shadowRoot) {
        console.error('❌ Assistant view shadow root not accessible');
        return;
    }
    
    // Try to find the actions button
    const actionsButton = assistantView.shadowRoot.querySelector('.action-btn');
    if (!actionsButton) {
        console.error('❌ Actions button not found');
        return;
    }
    
    console.log('✅ Found actions button, clicking...');
    actionsButton.click();
    
    // Wait and check for dropdown
    setTimeout(() => {
        const dropdown = assistantView.shadowRoot.querySelector('.actions-dropdown');
        if (dropdown) {
            console.log('✅ Actions dropdown opened');
            
            const buttons = Array.from(dropdown.querySelectorAll('.dropdown-item .dropdown-item-label'))
                .map(el => el.textContent);
            console.log('Available buttons:', buttons);
            
            const liveStreamingButton = Array.from(dropdown.querySelectorAll('.dropdown-item'))
                .find(btn => btn.textContent.includes('Live Streaming'));
            
            if (liveStreamingButton) {
                console.log('✅ Live Streaming button found!');
                console.log('Button element:', liveStreamingButton);
            } else {
                console.error('❌ Live Streaming button not found in dropdown');
                console.log('💡 Make sure you have selected a real-time capable model');
            }
        } else {
            console.error('❌ Actions dropdown not found');
        }
    }, 200);
};

// Auto-run basic check when this script loads
console.log('🎯 Live Streaming Debug Helper Loaded!');
console.log('Available commands:');
console.log('• checkLiveStreaming() - Full diagnostic');
console.log('• showModels() - List all available models');
console.log('• switchToLiveModel() - Switch to a real-time model');
console.log('• testLiveStreamingButton() - Test the UI button');
console.log('\nRunning quick check...');
setTimeout(() => {
    checkLiveStreaming();
}, 1000);
