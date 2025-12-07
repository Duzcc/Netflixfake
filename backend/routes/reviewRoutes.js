import express from 'express';
import {
    createReview,
    getMovieReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    // Admin moderation
    getAllReviews,
    approveReview,
    rejectReview,
    flagReview,
    unflagReview,
    adminDeleteReview,
    bulkDeleteReviews,
    toggleFeatured,
    getReviewStats,
} from '../controllers/reviewController.js';
import { protect, userOnly, admin } from '../middleware/authMiddleware.js';
import { validateReview, sanitizeInput } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply sanitization
router.use(sanitizeInput);

// Create a review for a movie (user-only)
router.post('/movies/:movieId/reviews', protect, userOnly, validateReview, createReview);

// Get all reviews for a specific movie (public)
router.get('/movies/:movieId/reviews', getMovieReviews);

// Get all reviews by the logged-in user
router.get('/my-reviews', protect, getUserReviews);

// Update a review (user-only, owner only)
router.put('/:reviewId', protect, userOnly, validateReview, updateReview);

// Delete a review (owner or admin)
router.delete('/:reviewId', protect, deleteReview);

// ==================== ADMIN MODERATION ROUTES ====================

// Get all reviews with filters
router.get('/admin/all', protect, admin, getAllReviews);

// Get review statistics
router.get('/admin/stats', protect, admin, getReviewStats);

// Bulk delete reviews
router.post('/admin/bulk-delete', protect, admin, bulkDeleteReviews);

// Approve review
router.put('/:reviewId/approve', protect, admin, approveReview);

// Reject review
router.put('/:reviewId/reject', protect, admin, rejectReview);

// Flag review
router.put('/:reviewId/flag', protect, admin, flagReview);

// Unflag review
router.put('/:reviewId/unflag', protect, admin, unflagReview);

// Toggle featured status
router.put('/:reviewId/featured', protect, admin, toggleFeatured);

// Admin delete review (with optional user ban)
router.delete('/:reviewId/admin', protect, admin, adminDeleteReview);

export default router;
