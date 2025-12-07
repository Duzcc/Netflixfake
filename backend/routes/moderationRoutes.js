import express from 'express';
import {
    flagContent,
    getFlaggedContent,
    resolveFlag,
    ignoreFlag,
    getAllMovies,
    bulkDeleteMovies,
    bulkUpdateCategory,
    autoModerate,
    getModerationStats,
} from '../controllers/moderationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== CONTENT FLAGGING ====================

// Flag content (any logged-in user can flag)
router.post('/flag', protect, flagContent);

// Get all flags (admin only)
router.get('/flags', protect, admin, getFlaggedContent);

// Resolve flag
router.put('/flags/:flagId/resolve', protect, admin, resolveFlag);

// Ignore flag
router.put('/flags/:flagId/ignore', protect, admin, ignoreFlag);

// ==================== MOVIE MODERATION ====================

// Get all movies with filters
router.get('/movies', protect, admin, getAllMovies);

// Bulk delete movies
router.post('/movies/bulk-delete', protect, admin, bulkDeleteMovies);

// Bulk update category
router.post('/movies/bulk-category', protect, admin, bulkUpdateCategory);

// ==================== AUTO-MODERATION ====================

// Run auto-moderation
router.post('/auto-moderate', protect, admin, autoModerate);

// ==================== STATISTICS ====================

// Get moderation stats
router.get('/stats', protect, admin, getModerationStats);

export default router;
