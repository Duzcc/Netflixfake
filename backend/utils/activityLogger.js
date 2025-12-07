import UserActivity from '../models/UserActivity.js';

/**
 * Log user activity
 * @param {Object} params - Activity parameters
 * @param {String} params.userId - User ID
 * @param {String} params.action - Action type
 * @param {Object} params.details - Action details
 * @param {Object} params.req - Express request object (optional)
 */
export const logActivity = async ({ userId, action, details = {}, req = null }) => {
    try {
        const activityData = {
            userId,
            action,
            details,
        };

        // Extract IP and user agent from request if available
        if (req) {
            activityData.ipAddress = req.ip || req.connection.remoteAddress;
            activityData.userAgent = req.get('user-agent');
        }

        await UserActivity.create(activityData);
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't throw - activity logging shouldn't break the main flow
    }
};

/**
 * Get user activity history
 * @param {String} userId - User ID
 * @param {Object} options - Query options
 */
export const getUserActivities = async (userId, options = {}) => {
    const {
        limit = 50,
        page = 1,
        action = null,
        startDate = null,
        endDate = null,
    } = options;

    const query = { userId };

    if (action) {
        query.action = action;
    }

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const activities = await UserActivity.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    const total = await UserActivity.countDocuments(query);

    return {
        activities,
        total,
        page,
        pages: Math.ceil(total / limit),
    };
};

/**
 * Get activity statistics for a user
 * @param {String} userId - User ID
 */
export const getUserActivityStats = async (userId) => {
    const stats = await UserActivity.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$action',
                count: { $sum: 1 },
            },
        },
    ]);

    return stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
    }, {});
};

export default {
    logActivity,
    getUserActivities,
    getUserActivityStats,
};
