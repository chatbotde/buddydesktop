const { MongoClient, ObjectId } = require('mongodb');
require('dotenv/config');

class WebAuthService {
    constructor() {
        this.dbClient = null;
        this.db = null;
        this.WEB_API_URL = process.env.WEB_API_URL || 'http://localhost:5173';
        this.MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/buddyweb';
        this.currentUser = null;
        this.authToken = null;
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            this.dbClient = new MongoClient(this.MONGO_URI);
            await this.dbClient.connect();
            this.db = this.dbClient.db('buddyweb');
            
            // Create indexes
            await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
            await this.db.collection('sessions').createIndex({ userId: 1 });
            await this.db.collection('sessions').createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
            
            console.log('MongoDB connected and indexes created');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }

    // Set the authentication token from web
    setAuthToken(token) {
        this.authToken = token;
        // Store token in localStorage or secure storage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('buddy_auth_token', token);
        }
    }

    // Get stored auth token
    getAuthToken() {
        if (!this.authToken) {
            if (typeof localStorage !== 'undefined') {
                this.authToken = localStorage.getItem('buddy_auth_token');
            }
        }
        return this.authToken;
    }

    // Clear auth token
    clearAuthToken() {
        this.authToken = null;
        this.currentUser = null;
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('buddy_auth_token');
        }
    }

    // Verify token with web backend
    async verifyToken(token = null) {
        try {
            const tokenToVerify = token || this.getAuthToken();
            
            if (!tokenToVerify) {
                return { success: false, error: 'No token provided' };
            }

            const response = await fetch(`${this.WEB_API_URL}/api/verify-desktop-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: tokenToVerify })
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = data.user;
                return { success: true, user: data.user };
            } else {
                this.clearAuthToken();
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Check if user is authenticated
    async isAuthenticated() {
        const result = await this.verifyToken();
        return result.success;
    }

    // Get current user
    async getCurrentUser() {
        if (!this.currentUser) {
            const result = await this.verifyToken();
            if (result.success) {
                this.currentUser = result.user;
            }
        }
        return this.currentUser;
    }

    // Get user preferences
    async getUserPreferences() {
        const user = await this.getCurrentUser();
        return user ? user.preferences : null;
    }

    // Update user preferences
    async updateUserPreferences(preferences) {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            await this.db.collection('users').updateOne(
                { _id: new ObjectId(user.id) },
                { $set: { preferences } }
            );

            // Update local user object
            this.currentUser.preferences = preferences;

            return true;
        } catch (error) {
            console.error('Failed to update user preferences:', error);
            return false;
        }
    }

    // Save chat session
    async saveChatSession(sessionData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const session = {
                userId: new ObjectId(user.id),
                messages: sessionData.messages,
                provider: sessionData.provider,
                model: sessionData.model,
                createdAt: new Date(),
                metadata: {
                    messageCount: sessionData.messages.length,
                    duration: sessionData.duration || 0
                }
            };
            
            const result = await this.db.collection('sessions').insertOne(session);
            return result.insertedId;
        } catch (error) {
            console.error('Failed to save chat session:', error);
            throw error;
        }
    }

    // Get chat history
    async getChatHistory(limit = 10) {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const sessions = await this.db.collection('sessions')
                .find({ userId: new ObjectId(user.id) })
                .sort({ createdAt: -1 })
                .limit(limit)
                .toArray();

            return sessions;
        } catch (error) {
            console.error('Failed to get chat history:', error);
            return [];
        }
    }

    // Delete chat session
    async deleteChatSession(sessionId) {
        try {
            const user = await this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            await this.db.collection('sessions').deleteOne({
                _id: new ObjectId(sessionId),
                userId: new ObjectId(user.id)
            });

            return true;
        } catch (error) {
            console.error('Failed to delete chat session:', error);
            return false;
        }
    }

    // Get desktop auth URL
    getDesktopAuthUrl() {
        return `${this.WEB_API_URL}/desktop-tokens`;
    }

    // Open desktop auth in browser
    openDesktopAuth() {
        const { shell } = require('electron');
        shell.openExternal(this.getDesktopAuthUrl());
    }

    // Close database connection
    async close() {
        if (this.dbClient) {
            await this.dbClient.close();
            console.log('Database connection closed');
        }
    }
}

module.exports = WebAuthService; 