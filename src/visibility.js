// Visibility controls for window content protection and workspace visibility
const { dialog } = require('electron');

// Function to prompt user for true/false using a dialog with buttons
async function promptBooleanOption(title, message, defaultValue = true) {
    const result = await dialog.showMessageBox({
        type: 'question',
        buttons: ['True', 'False'],
        defaultId: defaultValue ? 0 : 1,
        title: title,
        message: message,
        cancelId: 1
    });
    return result.response === 0; // 0 = True, 1 = False
}

// Function to toggle content protection
async function toggleContentProtection(window, currentState) {
    const newState = await promptBooleanOption(
        'Content Protection',
        `Content protection is currently ${currentState ? 'enabled' : 'disabled'}. Would you like to ${currentState ? 'disable' : 'enable'} it?`,
        !currentState
    );
    window.setContentProtection(newState);
    return newState;
}

// Function to toggle visibility on all workspaces
async function toggleVisibilityOnWorkspaces(window, currentState) {
    const newState = await promptBooleanOption(
        'Visible On All Workspaces',
        `Window visibility on all workspaces is currently ${currentState ? 'enabled' : 'disabled'}. Would you like to ${currentState ? 'disable' : 'enable'} it?`,
        !currentState
    );
    window.setVisibleOnAllWorkspaces(newState, { visibleOnFullScreen: true });
    return newState;
}

// Function to set content protection without prompting
function setContentProtection(window, enabled) {
    window.setContentProtection(enabled);
}

// Function to set workspace visibility without prompting
function setVisibilityOnWorkspaces(window, enabled) {
    window.setVisibleOnAllWorkspaces(enabled, { visibleOnFullScreen: true });
}

module.exports = {
    promptBooleanOption,
    toggleContentProtection,
    toggleVisibilityOnWorkspaces,
    setContentProtection,
    setVisibilityOnWorkspaces
};