/**
 * COMPLETE LIVE STREAMING DIAGNOSTIC AND FIX
 * 
 * Copy and paste this entire script into your browser console
 * to diagnose and fix live streaming issues
 */

console.log('%c🎥 LIVE STREAMING DIAGNOSTIC & FIX', 'color: #4CAF50; font-size: 18px; font-weight: bold;');
console.log('This script will diagnose and attempt to fix live streaming issues.\n');

// Global diagnostic results
let diagnosticResults = {
    appFound: false,
    modelSelected: false,
    isRealtime: false,
    apiAvailable: false,
    permissionsGranted: false,
    servicesLoaded: false,
    buttonVisible: false,
    errors: []
};

// 1. Check if app is loaded
function checkAppLoaded() {
    console.log('\n1️⃣ Checking if app is loaded...');
    
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) {
        diagnosticResults.errors.push('buddy-app element not found');
        console.error('❌ buddy-app element not found');
        return false;
    }
    
    diagnosticResults.appFound = true;
    console.log('✅ buddy-app found');
    
    const assistantView = document.querySelector('buddy-assistant-view');
    if (!assistantView) {
        diagnosticResults.errors.push('buddy-assistant-view not found');
        console.error('❌ buddy-assistant-view not found');
        return false;
    }
    
    console.log('✅ buddy-assistant-view found');
    return true;
}

// 2. Check model selection
function checkModelSelection() {
    console.log('\n2️⃣ Checking model selection...');
    
    const buddyApp = document.querySelector('buddy-app');
    const currentModel = buddyApp?.selectedModel;
    
    if (!currentModel) {
        diagnosticResults.errors.push('No model selected');
        console.error('❌ No model selected');
        return false;
    }
    
    diagnosticResults.modelSelected = true;
    console.log('✅ Model selected:', currentModel);
    
    const isRealtime = buddyApp?.isSelectedModelRealTime;
    diagnosticResults.isRealtime = isRealtime;
    
    if (isRealtime) {
        console.log('✅ Model supports real-time streaming');
    } else {
        console.log('⚠️ Model does not support real-time streaming');
        diagnosticResults.errors.push('Selected model is not real-time capable');
    }
    
    return true;
}

// 3. Check API availability
function checkAPIAvailability() {
    console.log('\n3️⃣ Checking API availability...');
    
    if (!window.buddy) {
        diagnosticResults.errors.push('window.buddy not available');
        console.error('❌ window.buddy not available');
        return false;
    }
    
    diagnosticResults.apiAvailable = true;
    console.log('✅ window.buddy available');
    
    const hasStartLive = typeof window.buddy.startLiveStreaming === 'function';
    const hasStopLive = typeof window.buddy.stopLiveStreaming === 'function';
    
    console.log('Live streaming functions:');
    console.log('  startLiveStreaming:', hasStartLive ? '✅' : '❌');
    console.log('  stopLiveStreaming:', hasStopLive ? '✅');
    
    if (!hasStartLive || !hasStopLive) {
        diagnosticResults.errors.push('Live streaming functions not available');
        return false;
    }
    
    return true;
}

// 4. Check services
function checkServices() {
    console.log('\n4️⃣ Checking services...');
    
    const captureService = window.buddy?.captureService;
    const videoService = window.buddy?.videoService;
    const audioService = window.buddy?.audioService;
    
    console.log('Services:');
    console.log('  captureService:', captureService ? '✅' : '❌');
    console.log('  videoService:', videoService ? '✅' : '❌');
    console.log('  audioService:', audioService ? '✅' : '❌');
    
    if (!captureService || !videoService) {
        diagnosticResults.errors.push('Required services not loaded');
        return false;
    }
    
    diagnosticResults.servicesLoaded = true;
    return true;
}

// 5. Check permissions
async function checkPermissions() {
    console.log('\n5️⃣ Checking media permissions...');
    
    try {
        // Check display media permission
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 1 },
            audio: false
        });
        
        console.log('✅ Screen capture permission granted');
        stream.getTracks().forEach(track => track.stop());
        
        diagnosticResults.permissionsGranted = true;
        return true;
    } catch (error) {
        console.error('❌ Screen capture permission denied:', error.message);
        diagnosticResults.errors.push(`Screen capture permission: ${error.message}`);
        return false;
    }
}

// 6. Check button visibility
function checkButtonVisibility() {
    console.log('\n6️⃣ Checking button visibility...');
    
    const assistantView = document.querySelector('buddy-assistant-view');
    if (!assistantView?.shadowRoot) {
        diagnosticResults.errors.push('Cannot access assistant view shadow root');
        return false;
    }
    
    // Try to find the actions button
    const actionsBtn = assistantView.shadowRoot.querySelector('.action-btn');
    if (!actionsBtn) {
        diagnosticResults.errors.push('Actions button not found');
        console.error('❌ Actions button not found');
        return false;
    }
    
    console.log('✅ Actions button found');
    
    // Temporarily open the dropdown to check for live streaming button
    console.log('🔍 Checking for live streaming button...');
    actionsBtn.click();
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const dropdown = assistantView.shadowRoot.querySelector('.actions-dropdown');
            if (!dropdown) {
                diagnosticResults.errors.push('Actions dropdown not found');
                console.error('❌ Actions dropdown not found');
                resolve(false);
                return;
            }
            
            const buttons = Array.from(dropdown.querySelectorAll('.dropdown-item'))
                .map(btn => btn.textContent.trim())
                .filter(text => text);
            
            console.log('📋 Available buttons:', buttons);
            
            const hasLiveStreamingButton = buttons.some(btn => btn.includes('Live Streaming'));
            
            if (hasLiveStreamingButton) {
                console.log('✅ Live Streaming button found!');
                diagnosticResults.buttonVisible = true;
                resolve(true);
            } else {
                console.log('❌ Live Streaming button not found');
                diagnosticResults.errors.push('Live Streaming button not visible');
                resolve(false);
            }
        }, 200);
    });
}

// 7. Fix common issues
function fixCommonIssues() {
    console.log('\n7️⃣ Attempting to fix common issues...');
    
    const buddyApp = document.querySelector('buddy-app');
    
    // Try to switch to a real-time model if available
    if (!diagnosticResults.isRealtime && buddyApp) {
        console.log('🔧 Attempting to switch to real-time model...');
        
        const models = buddyApp.getAvailableModels ? buddyApp.getAvailableModels() : [];
        const liveModels = models.filter(m => 
            m.live === true || (m.capabilities && m.capabilities.includes('realtime'))
        );
        
        if (liveModels.length > 0) {
            const model = liveModels[0];
            console.log(`🔄 Switching to: ${model.name || model.model}`);
            
            buddyApp.dispatchEvent(new CustomEvent('model-selected', {
                detail: {
                    model: model.model,
                    provider: model.provider,
                    modelData: model
                }
            }));
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newIsRealtime = buddyApp.isSelectedModelRealTime;
                    if (newIsRealtime) {
                        console.log('✅ Successfully switched to real-time model');
                        diagnosticResults.isRealtime = true;
                        resolve(true);
                    } else {
                        console.log('❌ Failed to switch to real-time model');
                        resolve(false);
                    }
                }, 500);
            });
        } else {
            console.log('❌ No real-time models available');
            return Promise.resolve(false);
        }
    }
    
    return Promise.resolve(true);
}

// 8. Test live streaming functionality
async function testLiveStreaming() {
    console.log('\n8️⃣ Testing live streaming functionality...');
    
    if (!diagnosticResults.isRealtime) {
        console.log('❌ Cannot test - no real-time model selected');
        return false;
    }
    
    if (!diagnosticResults.apiAvailable) {
        console.log('❌ Cannot test - API not available');
        return false;
    }
    
    try {
        console.log('🧪 Testing startLiveStreaming()...');
        const startResult = await window.buddy.startLiveStreaming();
        
        if (startResult && startResult.success !== false) {
            console.log('✅ startLiveStreaming() succeeded');
            
            // Test stop after 2 seconds
            setTimeout(async () => {
                try {
                    console.log('🧪 Testing stopLiveStreaming()...');
                    const stopResult = await window.buddy.stopLiveStreaming();
                    
                    if (stopResult && stopResult.success !== false) {
                        console.log('✅ stopLiveStreaming() succeeded');
                    } else {
                        console.log('⚠️ stopLiveStreaming() returned:', stopResult);
                    }
                } catch (error) {
                    console.error('❌ Error stopping live streaming:', error);
                }
            }, 2000);
            
            return true;
        } else {
            console.log('❌ startLiveStreaming() failed:', startResult);
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing live streaming:', error);
        return false;
    }
}

// Main diagnostic function
async function runDiagnostic() {
    console.log('\n🔍 Starting comprehensive live streaming diagnostic...');
    console.log('='.repeat(60));
    
    // Run all checks
    const appLoaded = checkAppLoaded();
    const modelSelected = appLoaded && checkModelSelection();
    const apiAvailable = appLoaded && checkAPIAvailability();
    const servicesLoaded = appLoaded && checkServices();
    const permissionsGranted = appLoaded && await checkPermissions();
    const buttonVisible = appLoaded && diagnosticResults.isRealtime && await checkButtonVisibility();
    
    // Try to fix issues
    if (!diagnosticResults.isRealtime) {
        await fixCommonIssues();
    }
    
    // Test functionality if everything looks good
    if (diagnosticResults.isRealtime && diagnosticResults.apiAvailable) {
        await testLiveStreaming();
    }
    
    // Show final report
    showDiagnosticReport();
}

// Show diagnostic report
function showDiagnosticReport() {
    console.log('\n📊 DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    
    console.log('✅ App loaded:', diagnosticResults.appFound);
    console.log('📋 Model selected:', diagnosticResults.modelSelected);
    console.log('🎥 Real-time capable:', diagnosticResults.isRealtime);
    console.log('🔌 API available:', diagnosticResults.apiAvailable);
    console.log('⚙️ Services loaded:', diagnosticResults.servicesLoaded);
    console.log('🔐 Permissions granted:', diagnosticResults.permissionsGranted);
    console.log('🔘 Button visible:', diagnosticResults.buttonVisible);
    
    if (diagnosticResults.errors.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        diagnosticResults.errors.forEach((error, i) => {
            console.log(`${i + 1}. ${error}`);
        });
        
        console.log('\n💡 RECOMMENDED ACTIONS:');
        if (!diagnosticResults.isRealtime) {
            console.log('• Select a real-time model (e.g., "Gemini 2.0 Flash Live")');
        }
        if (!diagnosticResults.permissionsGranted) {
            console.log('• Grant screen capture permissions when prompted');
        }
        if (diagnosticResults.isRealtime && !diagnosticResults.buttonVisible) {
            console.log('• Check if the live streaming button appears in the actions menu (three dots)');
        }
    } else {
        console.log('\n🎉 ALL CHECKS PASSED! Live streaming should be working.');
    }
    
    console.log('\n🔧 Manual test: Run testLiveStreamingNow() to test the functionality');
}

// Manual test function
window.testLiveStreamingNow = async function() {
    console.log('\n🧪 Manual Live Streaming Test');
    console.log('='.repeat(40));
    
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp?.isSelectedModelRealTime) {
        console.error('❌ Please select a real-time model first');
        return;
    }
    
    try {
        console.log('🎬 Starting live streaming...');
        const result = await window.buddy.startLiveStreaming();
        console.log('Result:', result);
        
        if (result && result.success !== false) {
            console.log('✅ Live streaming started!');
            console.log('⏹️ Will stop in 5 seconds...');
            
            setTimeout(async () => {
                try {
                    const stopResult = await window.buddy.stopLiveStreaming();
                    console.log('✅ Live streaming stopped:', stopResult);
                } catch (error) {
                    console.error('❌ Error stopping:', error);
                }
            }, 5000);
        } else {
            console.error('❌ Failed to start live streaming');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

// Auto-run diagnostic
console.log('Running automatic diagnostic in 1 second...');
setTimeout(() => {
    runDiagnostic();
}, 1000);
