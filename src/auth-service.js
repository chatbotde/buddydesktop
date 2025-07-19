const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv/config');

class AuthService {
    constructor() {
        this.oauth2Client = null;
        this.dbClient = null;
        this.db = null;
        this.JWT_SECRET = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-in-production';
        this.MONGO_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/buddyweb';
        this.initializeAuth();
        this.initializeDatabase();
    }

    async initializeAuth() {
        try {
            // Initialize Google OAuth2 client
            this.oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/desktop-auth'
            );

            // Set up Google Auth scopes
            const scopes = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ];

            this.authUrl = this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });

            console.log('Google Auth initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Google Auth:', error);
        }
    }

    async initializeDatabase() {
        // If already connected, skip.
        if (this.db) return;
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

    // Helper to ensure DB is ready before performing an operation
    async ensureDb() {
        if (!this.db) {
            await this.initializeDatabase();
        }
    }

    getAuthUrl() {
        return this.authUrl;
    }

    async exchangeCodeForTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            
            // Get user info
            const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const userInfo = await oauth2.userinfo.get();
            
            return {
                success: true,
                tokens,
                userInfo: userInfo.data
            };
        } catch (error) {
            console.error('Failed to exchange code for tokens:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createOrUpdateUser(userInfo) {
        try {
            const existingUser = await this.db.collection('users').findOne({ email: userInfo.email });
            
            if (existingUser) {
                // Update existing user
                await this.db.collection('users').updateOne(
                    { email: userInfo.email },
                    { 
                        $set: { 
                            name: userInfo.name,
                            picture: userInfo.picture,
                            lastLogin: new Date()
                        }
                    }
                );
                return existingUser;
            } else {
                // Create new user
                const newUser = {
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    googleId: userInfo.id,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    preferences: {
                        selectedProfile: 'default',
                        selectedLanguage: 'en-US',
                        selectedProvider: 'google',
                        theme: 'dark'
                    }
                };
                
                const result = await this.db.collection('users').insertOne(newUser);
                return { ...newUser, _id: result.insertedId };
            }
        } catch (error) {
            console.error('Failed to create/update user:', error);
            throw error;
        }
    }

    generateJWT(user) {
        return jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                name: user.name
            },
            this.JWT_SECRET,
            { expiresIn: '30d' }
        );
    }

    verifyJWT(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    async getUserById(userId) {
        try {
            await this.ensureDb();
            return await this.db.collection('users').findOne({ _id: new ObjectId(userId) });
        } catch (error) {
            console.error('Failed to get user by ID:', error);
            return null;
        }
    }

    async updateUserPreferences(userId, preferences) {
        try {
            await this.db.collection('users').updateOne(
                { _id: new ObjectId(userId) },
                { $set: { preferences } }
            );
            return true;
        } catch (error) {
            console.error('Failed to update user preferences:', error);
            return false;
        }
    }

    async saveChatSession(userId, sessionData) {
        try {
            const session = {
                userId: new ObjectId(userId),
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

    async getChatHistory(userId, limit = 10) {
        try {
            const sessions = await this.db.collection('sessions')
                .find({ userId: new ObjectId(userId) })
                .sort({ createdAt: -1 })
                .limit(limit)
                .toArray();
            
            return sessions.map(session => ({
                id: session._id,
                messages: session.messages,
                provider: session.provider,
                model: session.model,
                timestamp: session.createdAt.toISOString(),
                metadata: session.metadata
            }));
        } catch (error) {
            console.error('Failed to get chat history:', error);
            return [];
        }
    }

    async deleteChatSession(userId, sessionId) {
        try {
            await this.db.collection('sessions').deleteOne({
                _id: new ObjectId(sessionId),
                userId: new ObjectId(userId)
            });
            return true;
        } catch (error) {
            console.error('Failed to delete chat session:', error);
            return false;
        }
    }

    async close() {
        if (this.dbClient) {
            await this.dbClient.close();
        }
    }
}

module.exports = AuthService;
