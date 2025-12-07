import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// ==================== USER NOTIFICATION ENDPOINTS ====================

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {
    const { unreadOnly, limit = 20, page = 1 } = req.query;

    const query = { userId: req.user._id };
    if (unreadOnly === 'true') {
        query.read = false;
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
        userId: req.user._id,
        read: false,
    });

    res.json({
        notifications,
        unreadCount,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
        _id: notificationId,
        userId: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await notification.markAsRead();

    res.json({ message: 'Notification marked as read', notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { userId: req.user._id, read: false },
        { $set: { read: true, readAt: Date.now() } }
    );

    res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:notificationId
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
        _id: notificationId,
        userId: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await notification.deleteOne();

    res.json({ message: 'Notification deleted' });
});

// ==================== ADMIN NOTIFICATION ENDPOINTS ====================

// @desc    Send announcement to all users
// @route   POST /api/notifications/admin/broadcast
// @access  Private/Admin
export const broadcastAnnouncement = asyncHandler(async (req, res) => {
    const { title, message, type = 'announcement', priority = 'medium', link, sendEmail: shouldSendEmail } = req.body;

    if (!title || !message) {
        res.status(400);
        throw new Error('Title and message are required');
    }

    // Get all active users
    const users = await User.find({ banned: false }).select('_id email name');

    if (users.length === 0) {
        res.status(404);
        throw new Error('No active users found');
    }

    // Create notifications for all users
    const notifications = users.map(user => ({
        userId: user._id,
        type,
        title,
        message,
        link,
        priority,
    }));

    await Notification.insertMany(notifications);

    // Optionally send emails
    if (shouldSendEmail) {
        const emailPromises = users.map(user =>
            sendEmail({
                email: user.email,
                subject: `📢 ${title}`,
                html: `
                    <h2>${title}</h2>
                    <p>${message}</p>
                    ${link ? `<p><a href="${link}">View Details</a></p>` : ''}
                    <hr>
                    <p style="color: #666; font-size: 12px;">You received this because you're a member of Netflixfake.</p>
                `,
            }).catch(err => console.error(`Failed to send email to ${user.email}:`, err))
        );

        await Promise.allSettled(emailPromises);
    }

    res.json({
        message: `Announcement sent to ${users.length} users`,
        recipientCount: users.length,
        emailSent: shouldSendEmail,
    });
});

// @desc    Send notification to specific users
// @route   POST /api/notifications/admin/send
// @access  Private/Admin
export const sendToUsers = asyncHandler(async (req, res) => {
    const { userIds, title, message, type = 'system', priority = 'medium', link } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of user IDs');
    }

    if (!title || !message) {
        res.status(400);
        throw new Error('Title and message are required');
    }

    // Create notifications
    const notifications = userIds.map(userId => ({
        userId,
        type,
        title,
        message,
        link,
        priority,
    }));

    await Notification.insertMany(notifications);

    res.json({
        message: `Notification sent to ${userIds.length} users`,
        recipientCount: userIds.length,
    });
});

// @desc    Get all notifications (admin)
// @route   GET /api/notifications/admin/all
// @access  Private/Admin
export const getAllNotifications = asyncHandler(async (req, res) => {
    const { type, read, page = 1, limit = 50 } = req.query;

    const query = {};
    if (type) query.type = type;
    if (read !== undefined) query.read = read === 'true';

    const notifications = await Notification.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.json({
        notifications,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
    });
});

// @desc    Delete old notifications
// @route   DELETE /api/notifications/admin/cleanup
// @access  Private/Admin
export const cleanupNotifications = asyncHandler(async (req, res) => {
    const { daysOld = 30 } = req.query;

    const cutoffDate = new Date(Date.now() - parseInt(daysOld) * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        read: true,
    });

    res.json({
        message: `Deleted ${result.deletedCount} old notifications`,
        deletedCount: result.deletedCount,
    });
});

// @desc    Get notification statistics
// @route   GET /api/notifications/admin/stats
// @access  Private/Admin
export const getNotificationStats = asyncHandler(async (req, res) => {
    const total = await Notification.countDocuments();
    const unread = await Notification.countDocuments({ read: false });
    const read = await Notification.countDocuments({ read: true });

    // By type
    const byType = await Notification.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    // By priority
    const byPriority = await Notification.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await Notification.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
        overview: {
            total,
            unread,
            read,
            recentCount,
        },
        byType,
        byPriority,
    });
});

export default {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    broadcastAnnouncement,
    sendToUsers,
    getAllNotifications,
    cleanupNotifications,
    getNotificationStats,
};
