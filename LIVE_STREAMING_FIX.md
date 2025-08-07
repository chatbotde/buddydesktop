# 🎥 Live Streaming Fix Instructions

Your live streaming functionality is implemented but may have some issues. Here's how to diagnose and fix them:

## 🚨 **IMMEDIATE SOLUTION** (Copy & Paste)

**1. Open your app, press F12, and paste this code:**

```javascript
(async function() {
    console.log('🎥 FIXING LIVE STREAMING...');
    
    const buddyApp = document.querySelector('buddy-app');
    if (!buddyApp) return console.error('❌ App not found');
    
    // 1. Check current state
    console.log('📋 Current Model:', buddyApp.selectedModel);
    console.log('🎥 Is Realtime:', buddyApp.isSelectedModelRealTime);
    
    // 2. Switch to live model if needed
    if (!buddyApp.isSelectedModelRealTime) {
        const models = buddyApp.getAvailableModels ? buddyApp.getAvailableModels() : [];
        const liveModels = models.filter(m => m.live === true || (m.capabilities && m.capabilities.includes('realtime')));
        
        if (liveModels.length > 0) {
            console.log('🔄 Switching to live model:', liveModels[0].name);
            buddyApp.dispatchEvent(new CustomEvent('model-selected', {
                detail: { model: liveModels[0].model, provider: liveModels[0].provider, modelData: liveModels[0] }
            }));
            
            // Wait for switch
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('✅ Switched! Now realtime:', buddyApp.isSelectedModelRealTime);
        }
    }
    
    // 3. Test live streaming
    if (buddyApp.isSelectedModelRealTime && window.buddy?.startLiveStreaming) {
        console.log('🧪 Testing live streaming...');
        try {
            const result = await window.buddy.startLiveStreaming();
            console.log('🎬 Started:', result);
            
            setTimeout(async () => {
                const stopResult = await window.buddy.stopLiveStreaming();
                console.log('⏹️ Stopped:', stopResult);
            }, 3000);
        } catch (error) {
            console.error('❌ Error:', error);
        }
    }
    
    console.log('✅ Done! Look for the Live Streaming button in the actions menu (three dots)');
})();
```

## 📋 **Step-by-Step Instructions**

### **Step 1: Check Your Current Setup**
1. **Open your app**
2. **Press F12** to open Developer Console
3. **Paste the diagnostic script** from `fix-live-streaming.js`
4. **Read the diagnostic report**

### **Step 2: Fix Common Issues**

**If "No real-time model selected":**
- Use the model dropdown to select "Gemini 2.0 Flash Live" or similar
- Or run `quickSwitch()` in the console to auto-switch

**If "Screen capture permission denied":**
- Allow screen sharing when prompted by your browser
- Make sure you're not in incognito/private mode

**If "Live Streaming button not visible":**
- Ensure you've selected a real-time model
- Look for three dots (⋯) next to the text input
- Click the three dots to open the actions menu

### **Step 3: Test Live Streaming**

1. **Select a real-time model** (e.g., "Gemini 2.0 Flash Live")
2. **Go to the chat interface**
3. **Click the three dots** (⋯) next to the text input
4. **Look for "Live Streaming" button**
5. **Click it to toggle ON/OFF**

## 🔧 **Manual Testing Commands**

Run these in your browser console:

```javascript
// Quick diagnostic
checkLiveStreaming();

// List available models
showModels();

// Switch to live model
switchToLiveModel();

// Test the button
testLiveStreamingButton();

// Test functionality
testLiveStreamingNow();
```

## 🎯 **Expected Behavior**

When live streaming is **ON**:
- ✅ Button shows "LIVE" status
- ✅ Screen is captured at 8 FPS
- ✅ Real-time AI analysis occurs
- ✅ Console shows video frame indicators (📹)

When live streaming is **OFF**:
- ✅ Button shows "OFF" status
- ✅ Regular 1-second screenshots resume

## 🆘 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Button not visible | Select a real-time model first |
| Permission denied | Allow screen sharing in browser |
| No audio/video | Check browser permissions |
| Error starting | Refresh app and try again |
| Models not loading | Check your API keys |

## 🎥 **How Live Streaming Works**

1. **Model Selection**: Must be a real-time capable model
2. **Screen Capture**: Uses `getDisplayMedia()` API
3. **Frame Processing**: Captures at 8 FPS for real-time analysis
4. **AI Analysis**: Sends frames to real-time AI model
5. **Audio Processing**: Platform-specific audio capture

## 📞 **Need Help?**

If you're still having issues:

1. **Run the diagnostic**: Copy `fix-live-streaming.js` into console
2. **Check the console output**: Look for specific error messages
3. **Try manual test**: Run `testLiveStreamingNow()` in console
4. **Provide error details**: Share any error messages you see

---

**💡 Quick Start: Just paste the "IMMEDIATE SOLUTION" code above into your browser console!**
