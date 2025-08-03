# Capability-Aware UI System Demo

This document demonstrates the new capability-aware UI system that dynamically shows/hides features based on the selected model's capabilities.

## How It Works

### 1. Model Capabilities
Each model in the system now has a `capabilities` array that defines what it can do:

```javascript
// Example: Gemini 2.0 Flash Live (supports everything)
{
    id: 'gemini-2.0-flash-live-001',
    name: 'Gemini 2.0 Flash Live',
    capabilities: ['text', 'vision', 'code', 'audio', 'video', 'realtime'],
    live: true
}

// Example: Text-only model
{
    id: 'text-only-model',
    name: 'Text Only Model',
    capabilities: ['text', 'code']
}
```

### 2. UI Feature Mapping
UI features are mapped to capabilities:

- **Vision capabilities** → Image upload, screenshot capture, image paste, drag & drop
- **Audio capabilities** → Audio capture, microphone toggle, audio upload
- **Video capabilities** → Screen capture, video upload, camera capture
- **Realtime capabilities** → Live video/audio streaming

### 3. Dynamic UI Behavior

#### When Vision is NOT Supported:
- ❌ Screenshot capture button becomes disabled with tooltip
- ❌ Image upload button shows "not supported" message
- ❌ Image paste (Ctrl+V) shows notification
- ❌ Drag & drop shows capability message
- ❌ Auto-screenshot toggle is disabled

#### When Audio is NOT Supported:
- ❌ Audio capture toggle shows notification
- ❌ Microphone controls are disabled
- ❌ Audio upload features hidden

#### When Video is NOT Supported:
- ❌ Screen capture toggle shows notification
- ❌ Video streaming controls disabled

## User Experience

### Visual Indicators
1. **Model Capability Status**: Shows in actions dropdown
   ```
   GPT-4o
   Text, Vision, Code
   ```

2. **Disabled Features**: Grayed out with prohibition icon
3. **Helpful Messages**: "GPT-4o doesn't support audio processing. Switch to an audio-capable model to capture audio."
4. **Model Suggestions**: "Try switching to: gemini-2.0-flash-live-001"

### Interactive Feedback
- Click disabled feature → Shows notification explaining why
- Suggests alternative models that support the feature
- Provides clear guidance on what to do next

## Implementation Benefits

1. **No Confusion**: Users immediately know what's available
2. **Educational**: Learns about model capabilities
3. **Guided Experience**: Suggests better models for specific tasks
4. **Future-Proof**: Easy to add new capabilities (audio, video, etc.)
5. **Consistent**: Same pattern across all components

## Testing the System

1. **Switch to a vision-capable model** (e.g., Gemini 2.5 Flash)
   - ✅ All image features work normally
   - ✅ Screenshot, upload, paste, drag & drop enabled

2. **Switch to a text-only model** (e.g., basic GPT model)
   - ❌ Image features show as disabled
   - 💬 Helpful notifications explain why
   - 🔄 Suggests vision-capable alternatives

3. **Switch to Gemini 2.0 Flash Live**
   - ✅ All features enabled (text, vision, audio, video, realtime)
   - ⚡ Real-time streaming controls appear

## Future Enhancements

- **Audio Upload**: File picker for audio files
- **Video Upload**: File picker for video files  
- **Camera Capture**: Direct camera access
- **Real-time Indicators**: Live streaming status
- **Capability Badges**: Visual indicators in model selector
- **Smart Defaults**: Auto-enable features when switching to capable models