import express from 'express';
import {
    getAnalytics,
    getDashboardStats,
    getUserEngagement,
    getPopularContent,
    getWatchTimeAnalytics,
    getUserAnalytics,
    getMovieAnalytics,
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes require admin access
router.get('/', protect, admin, getAnalytics); // Legacy
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/engagement', protect, admin, getUserEngagement);
router.get('/popular', protect, admin, getPopularContent);
router.get('/watch-time', protect, admin, getWatchTimeAnalytics);
router.get('/users', protect, admin, getUserAnalytics);
router.get('/movies', protect, admin, getMovieAnalytics);

export default router;
