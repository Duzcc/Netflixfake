import asyncHandler from 'express-async-handler';
import ContentFlag from '../models/ContentFlag.js';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// ==================== CONTENT FLAGGING ====================

// @desc    Report/Flag content
// @route   POST /api/moderation/flag
// @access  Private
export const flagContent = asyncHandler(async (req, res) => {
    const { contentType, contentId, movieId, reason, description } = req.body;

    if (!contentType || !reason || !description) {
        res.status(400);
        throw new Error('Content type, reason, and description are required');
    }

    // Validate content exists
    let contentExists = false;
    if (contentType === 'movie' && movieId) {
        contentExists = await Movie.findOne({ movieId: Number(movieId) });
    } else if (contentType === 'review' && contentId) {
        contentExists = await Review.findById(contentId);
    } else if (contentType === 'user' && contentId) {
        contentExists = await User.findById(contentId);
    }

    if (!contentExists) {
        res.status(404);
        throw new Error('Content not found');
    }

    const flag = await ContentFlag.create({
        contentType,
        contentId: contentId || null,
        movieId: movieId || null,
        reportedBy: req.user._id,
        reason,
        description,
    });

    res.status(201).json({
        message: 'Content flagged successfully',
        flag,
    });
});

// @desc    Get all flagged content
// @route   GET /api/moderation/flags
// @access  Private/Admin
export const getFlaggedContent = asyncHandler(async (req, res) => {
    const { status = 'pending', contentType, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (contentType) query.contentType = contentType;

    const flags = await ContentFlag.find(query)
        .populate('reportedBy', 'name email')
        .populate('resolvedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ContentFlag.countDocuments(query);

    res.json({
        flags,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
    });
});

// @desc    Resolve flag
// @route   PUT /api/moderation/flags/:flagId/resolve
// @access  Private/Admin
export const resolveFlag = asyncHandler(async (req, res) => {
    const { flagId } = req.params;
    const { resolution, actionTaken } = req.body;

    const flag = await ContentFlag.findById(flagId);

    if (!flag) {
        res.status(404);
        throw new Error('Flag not found');
    }

    flag.status = 'resolved';
    flag.resolvedBy = req.user._id;
    flag.resolvedAt = Date.now();
    flag.resolution = resolution;
    flag.actionTaken = actionTaken || 'none';

    await flag.save();

    res.json({
        message: 'Flag resolved',
        flag,
    });
});

// @desc    Ignore flag
// @route   PUT /api/moderation/flags/:flagId/ignore
// @access  Private/Admin
export const ignoreFlag = asyncHandler(async (req, res) => {
    const { flagId } = req.params;

    const flag = await ContentFlag.findById(flagId);

    if (!flag) {
        res.status(404);
        throw new Error('Flag not found');
    }

    flag.status = 'ignored';
    flag.resolvedBy = req.user._id;
    flag.resolvedAt = Date.now();

    await flag.save();

    res.json({
        message: 'Flag ignored',
        flag,
    });
});

// ==================== MOVIE MODERATION ====================

// @desc    Get all movies with filters (admin)
// @route   GET /api/moderation/movies
// @access  Private/Admin
export const getAllMovies = asyncHandler(async (req, res) => {
    const { category, year, page = 1, limit = 20, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (year) query.year = Number(year);
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { desc: { $regex: search, $options: 'i' } },
        ];
    }

    const movies = await Movie.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Movie.countDocuments(query);

    res.json({
        movies,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
    });
});

// @desc    Bulk delete movies
// @route   POST /api/moderation/movies/bulk-delete
// @access  Private/Admin
export const bulkDeleteMovies = asyncHandler(async (req, res) => {
    const { movieIds } = req.body;

    if (!movieIds || !Array.isArray(movieIds) || movieIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of movie IDs');
    }

    const result = await Movie.deleteMany({ _id: { $in: movieIds } });

    res.json({
        message: `${result.deletedCount} movies deleted`,
        deletedCount: result.deletedCount,
    });
});

// @desc    Bulk update movie category
// @route   POST /api/moderation/movies/bulk-category
// @access  Private/Admin
export const bulkUpdateCategory = asyncHandler(async (req, res) => {
    const { movieIds, category } = req.body;

    if (!movieIds || !Array.isArray(movieIds) || !category) {
        res.status(400);
        throw new Error('Please provide movie IDs and category');
    }

    const result = await Movie.updateMany(
        { _id: { $in: movieIds } },
        { $set: { category } }
    );

    res.json({
        message: `${result.modifiedCount} movies updated`,
        modifiedCount: result.modifiedCount,
    });
});

// @desc    Auto-moderate content based on keywords
// @route   POST /api/moderation/auto-moderate
// @access  Private/Admin
export const autoModerate = asyncHandler(async (req, res) => {
    const bannedKeywords = [
        'spam',
        'scam',
        'porn',
        'xxx',
        'explicit',
        // Add more keywords as needed
    ];

    // Check reviews for banned keywords
    const flaggedReviews = await Review.find({
        $or: bannedKeywords.map(keyword => ({
            comment: { $regex: keyword, $options: 'i' },
        })),
        flagged: false,
    });

    let flaggedCount = 0;

    for (const review of flaggedReviews) {
        review.flagged = true;
        review.flagReason = 'Auto-flagged: Contains inappropriate keywords';
        await review.save();

        // Create flag record
        await ContentFlag.create({
            contentType: 'review',
            contentId: review._id,
            reportedBy: req.user._id,
            reason: 'inappropriate',
            description: 'Auto-flagged by keyword filter',
            status: 'pending',
        });

        flaggedCount++;
    }

    res.json({
        message: `Auto-moderation complete`,
        flaggedReviews: flaggedCount,
    });
});

// @desc    Get moderation statistics
// @route   GET /api/moderation/stats
// @access  Private/Admin
export const getModerationStats = asyncHandler(async (req, res) => {
    const totalFlags = await ContentFlag.countDocuments();
    const pendingFlags = await ContentFlag.countDocuments({ status: 'pending' });
    const resolvedFlags = await ContentFlag.countDocuments({ status: 'resolved' });
    const ignoredFlags = await ContentFlag.countDocuments({ status: 'ignored' });

    // Flags by content type
    const flagsByType = await ContentFlag.aggregate([
        { $group: { _id: '$contentType', count: { $sum: 1 } } },
    ]);

    // Flags by reason
    const flagsByReason = await ContentFlag.aggregate([
        { $group: { _id: '$reason', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    // Top reporters
    const topReporters = await ContentFlag.aggregate([
        { $group: { _id: '$reportedBy', count: { $sum: 1 } } },
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
            totalFlags,
            pendingFlags,
            resolvedFlags,
            ignoredFlags,
        },
        flagsByType,
        flagsByReason,
        topReporters,
    });
});

export default {
    flagContent,
    getFlaggedContent,
    resolveFlag,
    ignoreFlag,
    getAllMovies,
    bulkDeleteMovies,
    bulkUpdateCategory,
    autoModerate,
    getModerationStats,
};
