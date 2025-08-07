// Quick Debug Script - Copy and paste this entire code into your browser console

console.log('%c🎯 LIVE STREAMING QUICK DEBUG', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
console.log('Copy and paste this entire script into your browser console, then use the commands below:\n');

// Quick check function
window.quickCheck = function() {
    console.log('\n🔍 QUICK LIVE STREAMING CHECK\n' + '='.repeat(40));
    
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        console.error('❌ buddy-app not found');
        return;
    }
    
    console.log('✅ Found buddy-app');
    console.log('📋 Current model:', buddyApp.selectedModel);
    console.log('🔄 Is realtime:', buddyApp.isSelectedModelRealTime);
    console.log('🔌 Live API available:', !!(window.buddy && window.buddy.startLiveStreaming));
    
    const assistantView = document.querySelector('buddy-assistant-view');
    console.log('🎯 Assistant view found:', !!assistantView);
    
    if (assistantView && assistantView.shadowRoot) {
        const actionsBtn = assistantView.shadowRoot.querySelector('.action-btn');
        console.log('⚙️ Actions button found:', !!actionsBtn);
        
        if (actionsBtn) {
            console.log('💡 TIP: Click the three dots next to the text input, then look for "Live Streaming" button');
        }
    }
    
    console.log('\n🎯 NEXT STEPS:');
    if (!buddyApp.isSelectedModelRealTime) {
        console.log('1. Run quickSwitch() to switch to a live model');
    } else {
        console.log('1. Look for the Live Streaming button in the actions menu (three dots)');
    }
    console.log('2. Run quickTest() to test the UI button detection');
    console.log('3. Run quickModels() to see all available models');
};

// Quick model switch
window.quickSwitch = function() {
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        console.error('❌ buddy-app not found');
        return;
    }
    
    const models = buddyApp.getAvailableModels ? buddyApp.getAvailableModels() : [];
    const liveModels = models.filter(m => m.live === true || (m.capabilities && m.capabilities.includes('realtime')));
    
    if (liveModels.length === 0) {
        console.error('❌ No live models available');
        return;
    }
    
    const model = liveModels[0];
    console.log(`🔄 Switching to: ${model.name || model.model}`);
    
    buddyApp.dispatchEvent(new CustomEvent('model-selected', {
        detail: {
            model: model.model,
            provider: model.provider,
            modelData: model
        }
    }));
    
    setTimeout(() => {
        console.log('✅ Switched! Current:', buddyApp.selectedModel);
        console.log('🎥 Is realtime:', buddyApp.isSelectedModelRealTime);
    }, 300);
};

// Quick models list
window.quickModels = function() {
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        console.error('❌ buddy-app not found');
        return;
    }
    
    const models = buddyApp.getAvailableModels ? buddyApp.getAvailableModels() : [];
    console.log(`\n📚 Found ${models.length} models:`);
    
    models.forEach((model, i) => {
        const isLive = model.live === true || (model.capabilities && model.capabilities.includes('realtime'));
        const icon = isLive ? '🎥' : '📝';
        console.log(`${i+1}. ${icon} ${model.name || model.model} (${model.provider})`);
    });
    
    const liveCount = models.filter(m => m.live === true || (m.capabilities && m.capabilities.includes('realtime'))).length;
    console.log(`\n🎥 Live models: ${liveCount}/${models.length}`);
};

// Quick UI test
window.quickTest = function() {
    console.log('\n🧪 Testing UI...');
    const assistantView = document.querySelector('buddy-assistant-view');
    
    if (!assistantView) {
        console.error('❌ Assistant view not found');
        return;
    }
    
    if (!assistantView.shadowRoot) {
        console.error('❌ Shadow root not accessible');
        return;
    }
    
    const actionsBtn = assistantView.shadowRoot.querySelector('.action-btn');
    if (!actionsBtn) {
        console.error('❌ Actions button not found');
        return;
    }
    
    console.log('✅ Clicking actions button...');
    actionsBtn.click();
    
    setTimeout(() => {
        const dropdown = assistantView.shadowRoot.querySelector('.actions-dropdown');
        if (!dropdown) {
            console.error('❌ Dropdown not opened');
            return;
        }
        
        const buttons = Array.from(dropdown.querySelectorAll('.dropdown-item'))
            .map(btn => btn.textContent.trim())
            .filter(text => text);
        
        console.log('📋 Available buttons:', buttons);
        
        const hasLiveStreaming = buttons.some(btn => btn.includes('Live Streaming'));
        if (hasLiveStreaming) {
            console.log('✅ Live Streaming button found!');
        } else {
            console.log('❌ Live Streaming button NOT found');
            console.log('💡 Make sure you have selected a real-time model first');
        }
    }, 200);
};

// Add quick show debug function
window.showDebug = function() {
    // Create and show debug component inline
    const existingDebug = document.querySelector('.quick-debug-panel');
    if (existingDebug) {
        existingDebug.remove();
    }
    
    const debugPanel = document.createElement('div');
    debugPanel.className = 'quick-debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        max-height: 80vh;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #4CAF50;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        z-index: 10000;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    const buddyApp = document.querySelector('buddy-app');
    const isRealtime = buddyApp ? buddyApp.isSelectedModelRealTime : false;
    const currentModel = buddyApp ? buddyApp.selectedModel : 'Unknown';
    const hasAPI = !!(window.buddy && window.buddy.startLiveStreaming);
    
    debugPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; color: #4CAF50;">🎥 Live Streaming Debug</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">✕</button>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <div><strong>Current Model:</strong> ${currentModel}</div>
            <div><strong>Is Realtime:</strong> <span style="color: ${isRealtime ? '#4CAF50' : '#f44336'}">${isRealtime ? '✅ YES' : '❌ NO'}</span></div>
            <div><strong>API Available:</strong> <span style="color: ${hasAPI ? '#4CAF50' : '#f44336'}">${hasAPI ? '✅ YES' : '❌ NO'}</span></div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <strong>Quick Actions:</strong><br>
            <button onclick="quickCheck()" style="margin: 2px; padding: 6px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">🔍 Quick Check</button><br>
            <button onclick="quickModels()" style="margin: 2px; padding: 6px 12px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">📚 Show Models</button><br>
            <button onclick="quickSwitch()" style="margin: 2px; padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Switch to Live Model</button><br>
            <button onclick="quickTest()" style="margin: 2px; padding: 6px 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">🧪 Test UI Button</button>
        </div>
        
        <div style="font-size: 12px; color: #ccc;">
            <strong>Instructions:</strong><br>
            1. Select a real-time model<br>
            2. Look for three dots (⋯) next to text input<br>
            3. Click it to open actions menu<br>
            4. Find "Live Streaming" button
        </div>
    `;
    
    document.body.appendChild(debugPanel);
    console.log('✅ Debug panel shown! Check top-right corner of your screen.');
};

console.log('🎯 Available Commands:');
console.log('• quickCheck() - Quick status check');
console.log('• quickModels() - List all models');
console.log('• quickSwitch() - Switch to live model');
console.log('• quickTest() - Test UI button');
console.log('• showDebug() - Show debug panel');
console.log('\n💡 Start with: quickCheck()');

// Auto-run quick check
setTimeout(() => {
    console.log('\n🚀 Running automatic check...');
    if (typeof window.quickCheck === 'function') {
        window.quickCheck();
    }
}, 1000);
