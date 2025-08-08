/**
 * User Access Tracking API
 * Simple API to track how many users are using the app with "Anupchand-Yadav" access code
 */

const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buddy';
const ACCESS_CODE = 'Anupchand-Yadav';

let db = null;

// Initialize MongoDB connection
async function initDB() {
    try {
        if (!db) {
            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            db = client.db();
            
            // Create indexes for better performance
            await db.collection('user_access').createIndex({ userFingerprint: 1 }, { unique: true });
            await db.collection('user_access').createIndex({ timestamp: -1 });
            await db.collection('user_stats').createIndex({ type: 1 });
            
            console.log('📊 User access database initialized');
        }
        return db;
    } catch (error) {
        console.error('❌ User access database initialization failed:', error);
        throw error;
    }
}

/**
 * Track a single user access
 */
router.post('/track-access', async (req, res) => {
    try {
        const db = await initDB();
        const { userFingerprint, accessCode, systemInfo, timestamp } = req.body;

        // Verify access code
        if (accessCode !== ACCESS_CODE) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid access code' 
            });
        }

        // Create access record
        const accessData = {
            userFingerprint,
            accessCode,
            timestamp: new Date(timestamp || new Date()),
            systemInfo,
            ip: req.ip || req.connection.remoteAddress,
            headers: {
                userAgent: req.get('user-agent'),
                acceptLanguage: req.get('accept-language')
            },
            firstAccess: new Date(),
            lastAccess: new Date()
        };

        // Try to insert or update user access
        try {
            // Check if user already exists
            const existingUser = await db.collection('user_access').findOne({ 
                userFingerprint 
            });

            if (existingUser) {
                // Update last access time
                await db.collection('user_access').updateOne(
                    { userFingerprint },
                    { 
                        $set: { 
                            lastAccess: new Date(),
                            systemInfo: systemInfo // Update system info
                        },
                        $inc: { accessCount: 1 }
                    }
                );
                
                console.log(`📊 Updated existing user: ${userFingerprint.substring(0, 8)}...`);
            } else {
                // Insert new user
                accessData.accessCount = 1;
                await db.collection('user_access').insertOne(accessData);
                
                // Update total user count
                await updateUserStats(db);
                
                console.log(`📊 New user registered: ${userFingerprint.substring(0, 8)}...`);
            }

            res.status(200).json({ 
                success: true, 
                message: 'Access tracked successfully',
                isNewUser: !existingUser
            });

        } catch (insertError) {
            if (insertError.code === 11000) {
                // Duplicate key error (user already exists)
                console.log(`📊 User already exists: ${userFingerprint.substring(0, 8)}...`);
                res.status(200).json({ 
                    success: true, 
                    message: 'Access tracked (existing user)',
                    isNewUser: false
                });
            } else {
                throw insertError;
            }
        }

    } catch (error) {
        console.error('❌ Access tracking failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Track multiple user access (batch)
 */
router.post('/track-access-batch', async (req, res) => {
    try {
        const db = await initDB();
        const { accessData } = req.body;

        if (!Array.isArray(accessData)) {
            return res.status(400).json({ 
                success: false, 
                error: 'accessData must be an array' 
            });
        }

        let newUsers = 0;
        let existingUsers = 0;

        for (const access of accessData) {
            if (access.accessCode !== ACCESS_CODE) {
                continue; // Skip invalid access codes
            }

            try {
                const existingUser = await db.collection('user_access').findOne({ 
                    userFingerprint: access.userFingerprint 
                });

                if (existingUser) {
                    await db.collection('user_access').updateOne(
                        { userFingerprint: access.userFingerprint },
                        { 
                            $set: { lastAccess: new Date() },
                            $inc: { accessCount: 1 }
                        }
                    );
                    existingUsers++;
                } else {
                    const accessRecord = {
                        ...access,
                        timestamp: new Date(access.timestamp),
                        firstAccess: new Date(),
                        lastAccess: new Date(),
                        accessCount: 1,
                        ip: req.ip || req.connection.remoteAddress
                    };

                    await db.collection('user_access').insertOne(accessRecord);
                    newUsers++;
                }
            } catch (error) {
                console.error('❌ Error processing access record:', error);
            }
        }

        if (newUsers > 0) {
            await updateUserStats(db);
        }

        res.status(200).json({ 
            success: true, 
            message: `Processed ${accessData.length} access records`,
            newUsers,
            existingUsers
        });

    } catch (error) {
        console.error('❌ Batch access tracking failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get user statistics
 */
router.get('/user-stats', async (req, res) => {
    try {
        const db = await initDB();

        // Get total unique users
        const totalUsers = await db.collection('user_access').countDocuments();

        // Get users from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeUsers = await db.collection('user_access').countDocuments({
            lastAccess: { $gte: thirtyDaysAgo }
        });

        // Get users from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyUsers = await db.collection('user_access').countDocuments({
            lastAccess: { $gte: sevenDaysAgo }
        });

        // Get new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayUsers = await db.collection('user_access').countDocuments({
            firstAccess: { $gte: today }
        });

        // Get daily user registration for last 30 days
        const dailyStats = await db.collection('user_access').aggregate([
            {
                $match: { 
                    firstAccess: { $gte: thirtyDaysAgo } 
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$firstAccess" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        // Get platform distribution
        const platformStats = await db.collection('user_access').aggregate([
            {
                $group: {
                    _id: "$systemInfo.platform",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]).toArray();

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers, // Last 30 days
                weeklyUsers, // Last 7 days
                todayUsers,  // New today
                dailyStats,
                platformStats
            },
            generated: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to get user stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get detailed user list (for admin)
 */
router.get('/user-list', async (req, res) => {
    try {
        const db = await initDB();
        
        const users = await db.collection('user_access')
            .find({}, { 
                projection: { 
                    userFingerprint: 1, 
                    firstAccess: 1, 
                    lastAccess: 1, 
                    accessCount: 1,
                    'systemInfo.platform': 1,
                    'systemInfo.language': 1,
                    'systemInfo.timezone': 1
                } 
            })
            .sort({ firstAccess: -1 })
            .limit(100)
            .toArray();

        res.json({
            success: true,
            users: users.map(user => ({
                id: user.userFingerprint.substring(0, 8) + '...',
                firstAccess: user.firstAccess,
                lastAccess: user.lastAccess,
                accessCount: user.accessCount,
                platform: user.systemInfo?.platform || 'Unknown',
                language: user.systemInfo?.language || 'Unknown',
                timezone: user.systemInfo?.timezone || 'Unknown'
            })),
            total: users.length
        });

    } catch (error) {
        console.error('❌ Failed to get user list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Update user statistics
 */
async function updateUserStats(db) {
    try {
        const totalUsers = await db.collection('user_access').countDocuments();
        
        await db.collection('user_stats').updateOne(
            { type: 'total_users' },
            { 
                $set: { 
                    count: totalUsers, 
                    lastUpdated: new Date() 
                } 
            },
            { upsert: true }
        );
        
        console.log(`📊 Updated user stats: ${totalUsers} total users`);
    } catch (error) {
        console.error('❌ Failed to update user stats:', error);
    }
}

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'User access API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
