import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';

// @desc    Create or update review
// @route   POST /api/movies/:movieId/reviews
// @access  Private (User only, not admin)
export const createReview = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { rating, comment, title, poster_path } = req.body;

    // Title is required for movie association
    if (!title) {
        res.status(400);
        throw new Error('Movie title is required');
    }

    // Note: rating and comment validation is handled by validateReview middleware
    // Rating should be 1-10 (matching validation middleware)

    const movieData = {
        movieId: Number(movieId),
        title,
        poster_path: poster_path || null,
    };

    const review = await Review.addOrUpdateReview(
        req.user._id,
        movieData,
        rating,
        comment.trim()
    );

    res.status(201).json(review);
});

// @desc    Get movie reviews
// @route   GET /api/movies/:movieId/reviews
// @access  Public
export const getMovieReviews = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    // Try to get real reviews from DB
    const reviews = await Review.getMovieReviews(movieId);

    // If no reviews found, return fake reviews for TMDB movies
    if (!reviews || reviews.length === 0) {
        // Import fake review generator
        const { getFakeReviews } = await import('../utils/fakeReviews.js');
        const fakeReviews = getFakeReviews(movieId);

        return res.json({
            success: true,
            isFake: true,
            message: 'Showing sample reviews (movie not in database)',
            reviews: fakeReviews,
            totalReviews: fakeReviews.length,
        });
    }

    res.json({
        success: true,
        isFake: false,
        reviews,
        totalReviews: reviews.length,
    });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.getUserReviews(req.user._id);
    res.json(reviews);
});

// @desc    Update review
// @route   PUT /api/reviews/:reviewId
// @access  Private (User only, own review)
export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this review');
    }

    if (rating) {
        if (rating < 1 || rating > 5) {
            res.status(400);
            throw new Error('Rating must be between 1 and 5');
        }
        review.rating = rating;
    }

    if (comment) {
        review.comment = comment.trim();
    }

    await review.save();
    const updatedReview = await Review.findById(reviewId).populate('user', 'name email image');

    res.json(updatedReview);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (User own review or Admin)
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
});

// ==================== ADMIN MODERATION ENDPOINTS ====================

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
    const { status, flagged, page = 1, limit = 20, movieId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (flagged === 'true') query.flagged = true;
    if (movieId) query['movie.movieId'] = Number(movieId);

    const reviews = await Review.find(query)
        .populate('user', 'name email image')
        .populate('moderatedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments(query);

    res.json({
        reviews,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
    });
});

// @desc    Approve review
// @route   PUT /api/reviews/:reviewId/approve
// @access  Private/Admin
export const approveReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { notes } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    review.status = 'approved';
    review.flagged = false;
    review.moderatedBy = req.user._id;
    review.moderatedAt = Date.now();
    if (notes) review.moderatorNotes = notes;

    await review.save();

    const updatedReview = await Review.findById(reviewId)
        .populate('user', 'name email image')
        .populate('moderatedBy', 'name email');

    res.json(updatedReview);
});

// @desc    Reject review
// @route   PUT /api/reviews/:reviewId/reject
// @access  Private/Admin
export const rejectReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    review.status = 'rejected';
    review.flagged = false;
    review.moderatedBy = req.user._id;
    review.moderatedAt = Date.now();
    if (reason) review.moderatorNotes = reason;

    await review.save();

    res.json({ message: 'Review rejected', review });
});

// @desc    Flag review
// @route   PUT /api/reviews/:reviewId/flag
// @access  Private/Admin
export const flagReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    review.flagged = true;
    review.flagReason = reason || 'Flagged by admin';
    review.moderatedBy = req.user._id;
    review.moderatedAt = Date.now();

    await review.save();

    res.json({ message: 'Review flagged', review });
});

// @desc    Unflag review
// @route   PUT /api/reviews/:reviewId/unflag
// @access  Private/Admin
export const unflagReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    review.flagged = false;
    review.flagReason = undefined;

    await review.save();

    res.json({ message: 'Review unflagged', review });
});

// @desc    Delete review (admin)
// @route   DELETE /api/reviews/:reviewId/admin
// @access  Private/Admin
export const adminDeleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { banUser } = req.query;

    const review = await Review.findById(reviewId).populate('user');

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    // Optionally ban the user who created the review
    if (banUser === 'true' && review.user) {
        const User = (await import('../models/User.js')).default;
        await User.findByIdAndUpdate(review.user._id, {
            banned: true,
            bannedReason: 'Spam/inappropriate reviews',
            bannedAt: Date.now(),
        });
    }

    await review.deleteOne();

    res.json({
        message: 'Review deleted',
        userBanned: banUser === 'true',
    });
});

// @desc    Bulk delete reviews
// @route   POST /api/reviews/admin/bulk-delete
// @access  Private/Admin
export const bulkDeleteReviews = asyncHandler(async (req, res) => {
    const { reviewIds } = req.body;

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of review IDs');
    }

    const result = await Review.deleteMany({ _id: { $in: reviewIds } });

    res.json({
        message: `${result.deletedCount} reviews deleted`,
        deletedCount: result.deletedCount,
    });
});

// @desc    Toggle featured status
// @route   PUT /api/reviews/:reviewId/featured
// @access  Private/Admin
export const toggleFeatured = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    review.featured = !review.featured;
    await review.save();

    res.json({
        message: review.featured ? 'Review featured' : 'Review unfeatured',
        review,
    });
});

// @desc    Get review statistics
// @route   GET /api/reviews/admin/stats
// @access  Private/Admin
export const getReviewStats = asyncHandler(async (req, res) => {
    const total = await Review.countDocuments();
    const pending = await Review.countDocuments({ status: 'pending' });
    const approved = await Review.countDocuments({ status: 'approved' });
    const rejected = await Review.countDocuments({ status: 'rejected' });
    const flagged = await Review.countDocuments({ flagged: true });
    const featured = await Review.countDocuments({ featured: true });

    // Average rating
    const avgRatingResult = await Review.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    // Reviews by rating
    const byRating = await Review.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // Top reviewers
    const topReviewers = await Review.aggregate([
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        { $unwind: '$userDetails' },
        {
            $project: {
                userId: '$_id',
                count: 1,
                name: '$userDetails.name',
                email: '$userDetails.email',
            },
        },
    ]);

    res.json({
        overview: {
            total,
            pending,
            approved,
            rejected,
            flagged,
            featured,
            averageRating: avgRatingResult[0]?.avgRating?.toFixed(2) || 0,
        },
        byRating,
        topReviewers,
    });
});
