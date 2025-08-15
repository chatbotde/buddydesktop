# Header Toggle Feature

This feature allows users to hide and show the window header for a cleaner, more focused chat experience.

## How to Use

### Method 1: Button in Chat Messages
- Hover over any assistant message in the chat
- Click the hamburger menu icon (☰) in the top-right corner of the message
- The header will toggle between visible and hidden states

### Method 2: Keyboard Shortcut
- Press `Ctrl+Alt+H` (Windows/Linux) or `Cmd+Alt+H` (macOS)
- The header will toggle between visible and hidden states

## Features

- **Clean Interface**: When the header is hidden, you get a distraction-free chat experience
- **Easy Access**: The toggle button appears on hover for assistant messages
- **Keyboard Shortcut**: Quick toggle with `Ctrl+Alt+H`
- **Persistent State**: The header visibility state is maintained during the session

## Implementation Details

### Components Modified
- `buddy-chat-message.js`: Added header toggle button
- `buddy-element.js`: Added conditional header rendering
- `StateManagementMixin.js`: Added `isHeaderVisible` state
- `EventHandlersMixin.js`: Added toggle event handlers
- `window-manager.js`: Added keyboard shortcut
- `chat-message-css.js`: Added button styling

### CSS Classes Added
- `.header-toggle-btn`: Styling for the toggle button
- Button appears on message hover with smooth transitions

### Events
- `toggle-header`: Custom event dispatched when button is clicked
- `toggle-header-shortcut`: IPC event for keyboard shortcut

## Technical Notes

- The header toggle button only appears on assistant messages
- The button uses a hamburger menu icon for intuitive UX
- The feature integrates seamlessly with existing window management
- No data persistence - state resets on app restart (can be extended if needed)