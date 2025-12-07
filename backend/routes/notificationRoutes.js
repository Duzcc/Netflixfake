import express from 'express';
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    broadcastAnnouncement,
    sendToUsers,
    getAllNotifications,
    cleanupNotifications,
    getNotificationStats,
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== USER ROUTES ====================

// Get user's notifications
router.get('/', protect, getUserNotifications);

// Mark all as read
router.put('/mark-all-read', protect, markAllAsRead);

// Mark single notification as read
router.put('/:notificationId/read', protect, markAsRead);

// Delete notification
router.delete('/:notificationId', protect, deleteNotification);

// ==================== ADMIN ROUTES ====================

// Broadcast announcement to all users
router.post('/admin/broadcast', protect, admin, broadcastAnnouncement);

// Send to specific users
router.post('/admin/send', protect, admin, sendToUsers);

// Get all notifications
router.get('/admin/all', protect, admin, getAllNotifications);

// Cleanup old notifications
router.delete('/admin/cleanup', protect, admin, cleanupNotifications);

// Get statistics
router.get('/admin/stats', protect, admin, getNotificationStats);

export default router;
