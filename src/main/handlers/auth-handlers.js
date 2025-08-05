/**
 * Authentication-related IPC Handlers
 * Handles user authentication, preferences, and chat history
 */

const { ipcMain } = require('electron');
const { AppState } = require('../app-config');

/**
 * Register all authentication-related IPC handlers
 */
function registerAuthHandlers() {
    // Get Google auth URL
    ipcMain.handle('get-google-auth-url', async (event) => {
        try {
            const authService = AppState.get('authService');
            if (!authService) {
                throw new Error('Authentication service not initialized');
            }
            return { success: true, url: authService.getAuthUrl() };
        } catch (error) {
            console.error('Failed to get Google auth URL:', error);
            return { success: false, error: error.message };
        }
    });

    // Handle Google auth callback
    ipcMain.handle('handle-google-auth-callback', async (event, code) => {
        try {
            const authService = AppState.get('authService');
            if (!authService) {
                throw new Error('Authentication service not initialized');
            }

            const tokenResult = await authService.exchangeCodeForTokens(code);
            if (!tokenResult.success) {
                return { success: false, error: tokenResult.error };
            }

            const user = await authService.createOrUpdateUser(tokenResult.userInfo);
            const token = authService.generateJWT(user);

            // Store current user
            AppState.set('currentUser', user);

            return {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                },
                token,
            };
        } catch (error) {
            console.error('Failed to handle Google auth callback:', error);
            return { success: false, error: error.message };
        }
    });

    // Verify auth token
    ipcMain.handle('verify-auth-token', async (event, token) => {
        try {
            const authService = AppState.get('authService');
            if (!authService) {
                throw new Error('Authentication service not initialized');
            }

            // Ensure the database connection is established before we try to use it.
            if (!authService.db) {
                try {
                    await authService.initializeDatabase?.();
                } catch (dbErr) {
                    console.error('Failed to (re)initialize database:', dbErr);
                }
            }

            const decoded = authService.verifyJWT(token);
            if (!decoded) {
                return { success: false, error: 'Invalid token' };
            }

            const user = await authService.getUserById(decoded.userId);
            if (!user) {
                return { success: false, error: 'User not found' };
            }

            AppState.set('currentUser', user);
            return {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    preferences: user.preferences,
                },
            };
        } catch (error) {
            console.error('Failed to verify auth token:', error);
            return { success: false, error: error.message };
        }
    });

    // Update user preferences
    ipcMain.handle('update-user-preferences', async (event, preferences) => {
        try {
            const authService = AppState.get('authService');
            const currentUser = AppState.get('currentUser');
            
            if (!authService || !currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            const success = await authService.updateUserPreferences(currentUser._id, preferences);
            return { success };
        } catch (error) {
            console.error('Failed to update user preferences:', error);
            return { success: false, error: error.message };
        }
    });

    // Save chat session
    ipcMain.handle('save-chat-session', async (event, sessionData) => {
        try {
            const authService = AppState.get('authService');
            const currentUser = AppState.get('currentUser');
            
            if (!authService || !currentUser) {
                // If not authenticated, return success but don't save
                return { success: true, message: 'Session not saved (guest mode)' };
            }

            const sessionId = await authService.saveChatSession(currentUser._id, sessionData);
            return { success: true, sessionId };
        } catch (error) {
            console.error('Failed to save chat session:', error);
            return { success: false, error: error.message };
        }
    });

    // Get chat history
    ipcMain.handle('get-chat-history', async (event, limit = 10) => {
        try {
            const authService = AppState.get('authService');
            const currentUser = AppState.get('currentUser');
            
            if (!authService || !currentUser) {
                return { success: true, history: [] };
            }

            const history = await authService.getChatHistory(currentUser._id, limit);
            return { success: true, history };
        } catch (error) {
            console.error('Failed to get chat history:', error);
            return { success: false, error: error.message };
        }
    });

    // Delete chat session
    ipcMain.handle('delete-chat-session', async (event, sessionId) => {
        try {
            const authService = AppState.get('authService');
            const currentUser = AppState.get('currentUser');
            
            if (!authService || !currentUser) {
                return { success: false, error: 'User not authenticated' };
            }

            const success = await authService.deleteChatSession(currentUser._id, sessionId);
            return { success };
        } catch (error) {
            console.error('Failed to delete chat session:', error);
            return { success: false, error: error.message };
        }
    });

    // Logout
    ipcMain.handle('logout', async (event) => {
        try {
            AppState.set('currentUser', null);
            return { success: true };
        } catch (error) {
            console.error('Failed to logout:', error);
            return { success: false, error: error.message };
        }
    });

    // Start guest session
    ipcMain.handle('start-guest-session', async (event) => {
        try {
            // Guest mode - no authentication required
            AppState.set('currentUser', null);
            return { success: true };
        } catch (error) {
            console.error('Failed to start guest session:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    registerAuthHandlers
};
