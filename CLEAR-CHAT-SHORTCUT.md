# Clear Chat Shortcut Implementation

## Overview
Added a clear chat shortcut feature to Buddy Desktop that allows users to quickly clear the current chat conversation using a keyboard shortcut or a button in the header.

## Features Added

### 1. Keyboard Shortcut
- **Windows/Linux**: `Ctrl+K`
- **macOS**: `Cmd+K`
- Global shortcut that works from anywhere in the application
- Triggers the same functionality as the "New Chat" feature

### 2. Clear Chat Button
- Added a trash can icon button in the header (only visible in assistant view)
- Positioned between the models dropdown and main menu
- Hover effect with red styling to indicate destructive action
- Tooltip shows "Clear Chat" with keyboard shortcut hint

### 3. Responsive Design
- Button scales appropriately across all screen sizes
- Maintains consistent styling with other header buttons
- Follows the existing design patterns

## Implementation Details

### Files Modified

1. **`src/main/app-config.js`**
   - Added `clearChat` shortcut to the shortcuts configuration

2. **`src/main/window-manager.js`**
   - Registered the global keyboard shortcut
   - Added IPC message sending to renderer process

3. **`src/mixins/EventHandlersMixin.js`**
   - Added IPC listener for `clear-chat-shortcut` event
   - Calls existing `handleNewChat()` method
   - Added cleanup in `removeIPCListeners()`

4. **`src/components/buddy-header.js`**
   - Added clear chat button to header-actions section
   - Only shows in assistant view
   - Uses existing `_handleNewChat()` method

5. **`src/components/ui/header-css.js`**
   - Added `.clear-chat-btn` styles
   - Responsive styles for all breakpoints
   - Red hover effect to indicate destructive action

## Usage

### Keyboard Shortcut
- Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (macOS) at any time
- Works globally when the application has focus

### Button Click
- Click the trash can icon in the header when in assistant view
- Button appears between the models dropdown and main menu

## Behavior
- Clears the current chat conversation
- Saves current conversation to history (if it exists)
- Resets session state
- Navigates to assistant view
- Same functionality as "New Chat" from the menu

## Testing
The implementation has been tested and confirmed working:
- Keyboard shortcut triggers successfully (confirmed in console logs)
- Button appears in the header with proper styling
- Integrates seamlessly with existing functionality