# 🛡️ Advanced Privacy Control System for Buddy Desktop

## Overview

The Advanced Privacy Control System provides comprehensive window transparency, hiding mechanisms, and privacy controls for the Buddy Desktop application. This system is designed to give users complete control over their privacy while using the application.

## ✨ Features

### 🎭 Privacy Modes
- **Normal Mode**: Standard visibility with full functionality
- **Stealth Mode**: Semi-transparent window with advanced privacy enabled
- **Invisible Mode**: Nearly completely hidden from view and detection

### 🔒 Content Protection
- **Screen Capture Protection**: Prevents screenshots and screen recording
- **Workspace Visibility**: Controls visibility across virtual desktops
- **Window Hiding**: Complete removal from taskbar and view
- **Opacity Control**: Fine-grained transparency adjustment (0.1% to 100%)

### 🎨 Transparency Controls
- **Dynamic Opacity**: Real-time opacity adjustment with visual feedback
- **Theme Selection**: Multiple window themes (Transparent, Black, etc.)
- **Advanced Transparency**: Background blur, vibrancy effects, click-through modes

### ⚡ Emergency Features
- **Panic Hide**: Instantly activates all hiding mechanisms
- **Emergency Shortcuts**: Global keyboard shortcuts for quick activation
- **Reset Controls**: One-click restoration to safe defaults

## 🚀 Quick Start

### Adding Privacy Controls to Your Interface

#### Option 1: Enhanced Settings View (Full Control Panel)
```javascript
// Import and use the enhanced settings view
import './components/buddy-enhanced-settings-view.js';

// In your main component
<buddy-enhanced-settings-view
    .selectedProvider=${this.selectedProvider}
    .selectedModel=${this.selectedModel}
    .providers=${this.providers}
    .models=${this.models}
    .apiKey=${this.apiKey}
    @provider-select=${this.handleProviderSelect}
    @model-select=${this.handleModelSelect}
></buddy-enhanced-settings-view>
```

#### Option 2: Privacy Control Panel Only
```javascript
// Import and use just the privacy panel
import './components/buddy-privacy-control-panel.js';

// In your component
<buddy-privacy-control-panel></buddy-privacy-control-panel>
```

#### Option 3: Quick Toggle Button (Floating)
```javascript
// Import and use the floating privacy button
import './components/buddy-privacy-toggle-button.js';

// Add to your main window/body
<buddy-privacy-toggle-button 
    position="bottom-right"
    @privacy-level-changed=${this.handlePrivacyChange}
    @open-privacy-panel=${this.openFullPrivacyPanel}>
</buddy-privacy-toggle-button>
```

### Position Options for Toggle Button
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

## 🎛️ Control Panel Features

### Privacy Tab
**Content Protection**
- Screen Capture Protection: System-level security
- Workspace Visibility: Show/hide on all virtual desktops

**Hiding Modes**
- Complete Window Hiding: Removes from taskbar and view
- Opacity-Based Hiding: Nearly invisible but functional
- Advanced Privacy Mode: Combines multiple protection methods

### Transparency Tab
**Window Transparency**
- Opacity Slider: 10% to 100% transparency
- Real-time preview and adjustment
- Keyboard shortcut: `Ctrl+Alt+T` (reset to 100%)

**Window Themes**
- Transparent: See-through with blur effects
- Black: Solid black background
- Custom themes can be added

### Stealth Tab
**Stealth Operations**
- Stealth Mode: Ultra-low visibility with minimal opacity
- Invisible Mode: Complete invisibility

**Quick Actions**
- Quick Hide: Instant hiding
- Quick Show: Restore full visibility

### Emergency Tab
**Emergency Controls**
- Panic Hide: Activates all hiding mechanisms instantly
- Reset All: Restores safe defaults

## ⌨️ Keyboard Shortcuts

### Built-in Shortcuts (if enabled in settings)
- `Ctrl+Alt+H` - Toggle window visibility
- `Ctrl+Alt+T` - Reset opacity to 100%
- `Ctrl+Alt+Q` - Close application

### Emergency Shortcuts (Global)
- `Ctrl+Shift+Alt+H` - Emergency invisible mode
- `Ctrl+Shift+Alt+R` - Emergency restore
- `Ctrl+Shift+Alt+S` - Quick stealth toggle

## 🔧 Implementation Guide

### Step 1: Update Your Main Component

```javascript
// In your main buddy component, add the privacy controls
import './components/buddy-privacy-toggle-button.js';
import './components/buddy-enhanced-settings-view.js';

// Add event listeners
handlePrivacyLevelChanged(e) {
    const { level, description } = e.detail;
    console.log(`Privacy level changed to: ${level} (${description})`);
    // Handle privacy level change
}

handleOpenPrivacyPanel(e) {
    // Open the full privacy panel
    this.currentView = 'enhanced-settings';
    this.activeSettingsTab = 'privacy';
}
```

### Step 2: Add Privacy Toggle to Your Layout

```javascript
// Add the floating privacy button to your main template
render() {
    return html`
        <!-- Your existing content -->
        <div class="main-content">
            ${this.renderCurrentView()}
        </div>
        
        <!-- Privacy toggle button -->
        <buddy-privacy-toggle-button 
            position="bottom-right"
            @privacy-level-changed=${this.handlePrivacyLevelChanged}
            @open-privacy-panel=${this.handleOpenPrivacyPanel}>
        </buddy-privacy-toggle-button>
    `;
}
```

### Step 3: Replace Settings View (Optional)

```javascript
// Replace your existing settings view with the enhanced version
renderCurrentView() {
    switch (this.currentView) {
        case 'settings':
        case 'enhanced-settings':
            return html`
                <buddy-enhanced-settings-view
                    .selectedProvider=${this.selectedProvider}
                    .selectedModel=${this.selectedModel}
                    .providers=${this.providers}
                    .models=${this.models}
                    .apiKey=${this.apiKey}
                    .hasEnvironmentKey=${this.hasEnvironmentKey}
                    .activeSettingsTab=${this.activeSettingsTab}
                    @provider-select=${this.handleProviderSelect}
                    @model-select=${this.handleModelSelect}
                    @api-key-input=${this.handleApiKeyInput}
                    @navigate=${this.handleNavigate}>
                </buddy-enhanced-settings-view>
            `;
        // ... other views
    }
}
```

## 🎮 Usage Examples

### Basic Privacy Control
```javascript
// Toggle between normal and stealth mode
const privacyButton = document.querySelector('buddy-privacy-toggle-button');
privacyButton.setPrivacyLevel(1); // Enable stealth mode

// Listen for privacy changes
privacyButton.addEventListener('privacy-level-changed', (e) => {
    console.log(`Privacy level: ${e.detail.level}`);
});
```

### Advanced Transparency Control
```javascript
// Set custom window opacity
window.electronAPI.invoke('set-window-opacity', {
    windowId: 'main',
    opacity: 0.5
});

// Apply advanced transparency with blur
window.electronAPI.invoke('set-advanced-transparency', {
    opacity: 0.3,
    backgroundBlur: true,
    vibrancy: 'ultra-dark',
    clickThrough: false,
    hideFromCapture: true
});
```

### Emergency Privacy Protection
```javascript
// Panic mode - instantly hide everything
window.electronAPI.invoke('emergency-invisible');

// Restore from panic mode
window.electronAPI.invoke('emergency-restore');
```

## 🔐 Security Features

### System-Level Protection
- **Windows**: Uses `SetWindowDisplayAffinity` to prevent screen capture
- **macOS**: Leverages `setContentProtection` and vibrancy effects
- **Cross-Platform**: Consistent privacy controls across all platforms

### Advanced Hiding Mechanisms
1. **Opacity-based**: Makes window nearly invisible while maintaining functionality
2. **Complete hiding**: Removes window from view and taskbar entirely
3. **Workspace isolation**: Controls visibility across virtual desktops
4. **Click-through**: Allows mouse events to pass through the window

## 🎨 Customization

### Theme Customization
You can add custom themes by modifying the theme configuration:

```javascript
// In your theme config
const customThemes = {
    neon: {
        name: 'Neon',
        description: 'Glowing neon effects',
        windowOptions: {
            transparent: true,
            backgroundColor: '#001a33',
            vibrancy: 'dark'
        }
    }
};
```

### Position Customization
```css
/* Custom positioning for privacy toggle */
buddy-privacy-toggle-button {
    --custom-position: fixed;
    bottom: 60px;
    right: 80px;
}
```

## 🐛 Troubleshooting

### Common Issues

**Privacy controls not working**
- Ensure you've registered the IPC handlers in your main process
- Check that window manager is properly initialized
- Verify electronAPI is available in renderer

**Opacity changes not visible**
- Some transparency effects require hardware acceleration
- Check if your window manager supports transparency
- Verify the window is actually transparent-enabled

**Emergency shortcuts not responding**
- Global shortcuts may conflict with other applications
- Try different key combinations
- Check if shortcuts are properly registered

### Debug Mode
Enable debug logging in your main process:

```javascript
// In main process
console.log('Privacy control debug mode enabled');
window.privacyDebug = true;
```

## 🚀 Advanced Features

### Custom Privacy Levels
You can define custom privacy levels beyond the three default ones:

```javascript
const PRIVACY_LEVELS = {
    NORMAL: 0,
    STEALTH: 1,
    INVISIBLE: 2,
    GHOST: 3,      // Custom: Ultra-transparent + click-through
    PHANTOM: 4     // Custom: Complete system-level hiding
};
```

### Integration with System Events
```javascript
// React to system events
window.addEventListener('blur', () => {
    // Automatically enable stealth mode when window loses focus
    privacyToggle.setPrivacyLevel(1);
});

// Detect screen sharing
navigator.mediaDevices.getDisplayMedia()
    .then(() => {
        // Someone is screen sharing, activate privacy mode
        privacyToggle.setPrivacyLevel(2);
    })
    .catch(() => {
        // Screen sharing denied or not available
    });
```

## 📦 File Structure

```
src/
├── components/
│   ├── buddy-privacy-control-panel.js      # Full privacy control panel
│   ├── buddy-privacy-toggle-button.js      # Floating toggle button
│   └── buddy-enhanced-settings-view.js     # Enhanced settings with privacy tab
├── main/
│   └── handlers/
│       └── stealth-overlay-handlers.js     # Stealth overlay system
└── visibility.js                           # Visibility utility functions
```

## 🤝 Contributing

To contribute to the privacy control system:

1. **Add new privacy modes**: Extend the privacy levels in the toggle button
2. **Create custom themes**: Add new window themes to the theme system  
3. **Implement platform-specific features**: Add OS-specific privacy enhancements
4. **Improve emergency features**: Enhance panic mode and recovery options

## 📝 License

This privacy control system is part of the Buddy Desktop application and follows the same licensing terms.

---

**⚠️ Security Note**: The privacy controls provide protection against casual observation and basic screen capture tools. For sensitive operations, always verify that your specific security requirements are met by testing the privacy features in your environment.
