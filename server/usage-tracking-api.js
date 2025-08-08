/**
 * Usage Tracking API for MongoDB
 * Tracks usage statistics for Anupchand-Yadav and other users
 */

const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB connection (you can adjust this based on your existing setup)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buddy';

let db = null;

// Initialize MongoDB connection
async function initDB() {
    try {
        if (!db) {
            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            db = client.db();
            
            // Create indexes for better performance
            await db.collection('usage_tracking').createIndex({ userId: 1, timestamp: -1 });
            await db.collection('usage_tracking').createIndex({ eventType: 1 });
            await db.collection('usage_tracking').createIndex({ sessionId: 1 });
            await db.collection('usage_stats').createIndex({ userId: 1 });
            
            console.log('📊 Usage tracking database initialized');
        }
        return db;
    } catch (error) {
        console.error('❌ Usage tracking database initialization failed:', error);
        throw error;
    }
}

/**
 * Track a single usage event
 */
router.post('/usage-tracking', async (req, res) => {
    try {
        const db = await initDB();
        const usageData = {
            ...req.body,
            timestamp: new Date(req.body.timestamp || new Date()),
            serverTimestamp: new Date(),
            ip: req.ip || req.connection.remoteAddress,
            headers: {
                userAgent: req.get('user-agent'),
                referer: req.get('referer'),
                acceptLanguage: req.get('accept-language')
            }
        };

        // Insert usage event
        await db.collection('usage_tracking').insertOne(usageData);

        // Update user stats
        await updateUserStats(db, usageData.userId, usageData.eventType);

        res.status(200).json({ success: true, message: 'Usage tracked successfully' });
    } catch (error) {
        console.error('❌ Usage tracking failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Track multiple usage events (batch)
 */
router.post('/usage-tracking/batch', async (req, res) => {
    try {
        const db = await initDB();
        const { usageData } = req.body;

        if (!Array.isArray(usageData)) {
            return res.status(400).json({ success: false, error: 'usageData must be an array' });
        }

        // Add server-side data to each event
        const enrichedData = usageData.map(data => ({
            ...data,
            timestamp: new Date(data.timestamp || new Date()),
            serverTimestamp: new Date(),
            ip: req.ip || req.connection.remoteAddress,
            headers: {
                userAgent: req.get('user-agent'),
                referer: req.get('referer'),
                acceptLanguage: req.get('accept-language')
            }
        }));

        // Insert all events
        if (enrichedData.length > 0) {
            await db.collection('usage_tracking').insertMany(enrichedData);

            // Update stats for each unique user
            const uniqueUsers = [...new Set(enrichedData.map(data => data.userId))];
            for (const userId of uniqueUsers) {
                const userEvents = enrichedData.filter(data => data.userId === userId);
                for (const event of userEvents) {
                    await updateUserStats(db, userId, event.eventType);
                }
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `${enrichedData.length} usage events tracked successfully` 
        });
    } catch (error) {
        console.error('❌ Batch usage tracking failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get usage statistics for a specific user
 */
router.get('/usage-tracking/stats/:userId', async (req, res) => {
    try {
        const db = await initDB();
        const { userId } = req.params;

        // Get user stats
        const userStats = await db.collection('usage_stats').findOne({ userId });

        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentActivity = await db.collection('usage_tracking')
            .find({ 
                userId, 
                timestamp: { $gte: thirtyDaysAgo } 
            })
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        // Get daily activity counts for last 30 days
        const dailyActivity = await db.collection('usage_tracking').aggregate([
            {
                $match: { 
                    userId, 
                    timestamp: { $gte: thirtyDaysAgo } 
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 },
                    uniqueSessions: { $addToSet: "$sessionId" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    count: 1,
                    uniqueSessions: { $size: "$uniqueSessions" }
                }
            },
            { $sort: { date: 1 } }
        ]).toArray();

        // Get event type distribution
        const eventTypes = await db.collection('usage_tracking').aggregate([
            { $match: { userId } },
            { $group: { _id: "$eventType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        res.json({
            success: true,
            userId,
            stats: userStats || { userId, totalEvents: 0, firstSeen: null, lastSeen: null },
            recentActivity: recentActivity.length,
            dailyActivity,
            eventTypes,
            summary: {
                totalEvents: userStats?.totalEvents || 0,
                activeDays: dailyActivity.length,
                avgEventsPerDay: dailyActivity.length > 0 ? 
                    Math.round((userStats?.totalEvents || 0) / dailyActivity.length) : 0
            }
        });
    } catch (error) {
        console.error('❌ Failed to get usage stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Get overall usage statistics (all users)
 */
router.get('/usage-tracking/stats', async (req, res) => {
    try {
        const db = await initDB();

        // Get total user count
        const totalUsers = await db.collection('usage_stats').countDocuments();

        // Get Anupchand-Yadav specific stats
        const anupStats = await db.collection('usage_stats').findOne({ userId: 'Anupchand-Yadav' });

        // Get top users by activity
        const topUsers = await db.collection('usage_stats')
            .find({})
            .sort({ totalEvents: -1 })
            .limit(10)
            .toArray();

        // Get recent activity across all users
        const recentActivity = await db.collection('usage_tracking')
            .find({})
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        // Get daily total activity for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyTotals = await db.collection('usage_tracking').aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    totalEvents: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    totalEvents: 1,
                    uniqueUsers: { $size: "$uniqueUsers" }
                }
            },
            { $sort: { date: 1 } }
        ]).toArray();

        res.json({
            success: true,
            overview: {
                totalUsers,
                anupUsageCount: anupStats?.totalEvents || 0,
                anupLastSeen: anupStats?.lastSeen || null
            },
            topUsers,
            recentActivity: recentActivity.slice(0, 10),
            dailyTotals
        });
    } catch (error) {
        console.error('❌ Failed to get overall usage stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Update user statistics
 */
async function updateUserStats(db, userId, eventType) {
    try {
        const update = {
            $inc: { totalEvents: 1 },
            $set: { lastSeen: new Date() },
            $setOnInsert: { userId, firstSeen: new Date() }
        };

        // Increment specific event type counters
        update.$inc[`eventTypes.${eventType}`] = 1;

        await db.collection('usage_stats').updateOne(
            { userId },
            update,
            { upsert: true }
        );
    } catch (error) {
        console.error('❌ Failed to update user stats:', error);
    }
}

/**
 * Clean up old usage data (optional maintenance endpoint)
 */
router.delete('/usage-tracking/cleanup/:days', async (req, res) => {
    try {
        const db = await initDB();
        const days = parseInt(req.params.days) || 90;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await db.collection('usage_tracking').deleteMany({
            timestamp: { $lt: cutoffDate }
        });

        res.json({
            success: true,
            message: `Cleaned up ${result.deletedCount} usage records older than ${days} days`
        });
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
