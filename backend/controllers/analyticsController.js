import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import WatchHistory from '../models/WatchHistory.js';
import Watchlist from '../models/Watchlist.js';
import Review from '../models/Review.js';

// @desc    Get comprehensive dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Parallel queries for performance
    const [
        totalUsers,
        activeUsers,
        pendingUsers,
        bannedUsers,
        totalMovies,
        totalViews,
        totalReviews,
        totalWatchlistItems,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ accountStatus: 'active', banned: false }),
        User.countDocuments({ accountStatus: 'pending' }),
        User.countDocuments({ banned: true }),
        Movie.countDocuments(),
        WatchHistory.countDocuments(dateFilter),
        Review.countDocuments(dateFilter),
        Watchlist.countDocuments(dateFilter),
        User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
        User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
    ]);

    // Calculate total watch time
    const watchTimeAgg = await WatchHistory.aggregate([
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
            $group: {
                _id: null,
                totalSeconds: { $sum: '$progress' },
            },
        },
    ]);

    const totalWatchTimeSeconds = watchTimeAgg[0]?.totalSeconds || 0;
    const totalWatchTimeHours = Math.round(totalWatchTimeSeconds / 3600);

    res.json({
        overview: {
            totalUsers,
            activeUsers,
            pendingUsers,
            bannedUsers,
            totalMovies,
            totalViews,
            totalReviews,
            totalWatchlistItems,
            totalWatchTimeHours,
        },
        growth: {
            newUsersToday,
            newUsersThisWeek,
            newUsersThisMonth,
        },
    });
});

// @desc    Get user engagement metrics
// @route   GET /api/analytics/engagement
// @access  Private/Admin
const getUserEngagement = asyncHandler(async (req, res) => {
    const { period = '30' } = req.query;

    const periodDays = parseInt(period) || 30;
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Daily active users
    const dailyActiveUsers = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: startDate } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$watchedAt' },
                },
                uniqueUsers: { $addToSet: '$userId' },
            },
        },
        {
            $project: {
                date: '$_id',
                count: { $size: '$uniqueUsers' },
            },
        },
        { $sort: { date: 1 } },
    ]);

    // Average session duration
    const avgSessionDuration = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: startDate } } },
        {
            $group: {
                _id: null,
                avgDuration: { $avg: '$progress' },
            },
        },
    ]);

    //  Returning users
    const returningUsers = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$userId',
                sessions: { $sum: 1 },
            },
        },
        {
            $match: { sessions: { $gt: 1 } },
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
            },
        },
    ]);

    res.json({
        dailyActiveUsers,
        averageSessionDuration: Math.round(avgSessionDuration[0]?.avgDuration || 0),
        returningUsersCount: returningUsers[0]?.count || 0,
    });
});

// @desc    Get popular content
// @route   GET /api/analytics/popular
// @access  Private/Admin
const getPopularContent = asyncHandler(async (req, res) => {
    const { limit = '10', period = '30' } = req.query;

    const periodDays = parseInt(period) || 30;
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Most watched movies
    const popularMovies = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$movie.movieId',
                title: { $first: '$movie.title' },
                poster: { $first: '$movie.poster_path' },
                viewCount: { $sum: 1 },
                totalWatchTime: { $sum: '$progress' },
                avgWatchTime: { $avg: '$progress' },
            },
        },
        { $sort: { viewCount: -1 } },
        { $limit: parseInt(limit) },
    ]);

    // Most added to watchlist
    const trendingWatchlist = await Watchlist.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$movie.movieId',
                title: { $first: '$movie.title' },
                poster: { $first: '$movie.poster_path' },
                addCount: { $sum: 1 },
            },
        },
        { $sort: { addCount: -1 } },
        { $limit: parseInt(limit) },
    ]);

    // Most reviewed movies
    const mostReviewed = await Review.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: '$movieId',
                reviewCount: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
        { $sort: { reviewCount: -1 } },
        { $limit: parseInt(limit) },
    ]);

    res.json({
        popularMovies,
        trendingWatchlist,
        mostReviewed,
    });
});

// @desc    Get watch time analytics
// @route   GET /api/analytics/watch-time
// @access  Private/Admin
const getWatchTimeAnalytics = asyncHandler(async (req, res) => {
    const { period = '30', groupBy = 'day' } = req.query;

    const periodDays = parseInt(period) || 30;
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Group format based on groupBy parameter
    const groupFormat = {
        day: '%Y-%m-%d',
        week: '%Y-W%U',
        month: '%Y-%m',
    }[groupBy] || '%Y-%m-%d';

    const watchTimeByPeriod = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: startDate } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: groupFormat, date: '$watchedAt' },
                },
                totalSeconds: { $sum: '$progress' },
                viewCount: { $sum: 1 },
                uniqueUsers: { $addToSet: '$userId' },
            },
        },
        {
            $project: {
                period: '$_id',
                totalHours: { $divide: ['$totalSeconds', 3600] },
                viewCount: 1,
                uniqueUserCount: { $size: '$uniqueUsers' },
            },
        },
        { $sort: { period: 1 } },
    ]);

    // Peak viewing hours
    const peakHours = await WatchHistory.aggregate([
        { $match: { watchedAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $hour: '$watchedAt' },
                viewCount: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.json({
        watchTimeByPeriod,
        peakHours,
    });
});

// Legacy endpoint for backward compatibility
const getAnalytics = getDashboardStats;

// @desc    Get detailed user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
    const { period = '30' } = req.query;

    const periodDays = parseInt(period) || 30;
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // User registration trend
    const registrationTrend = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // User distribution by status
    const usersByStatus = await User.aggregate([
        {
            $group: {
                _id: '$accountStatus',
                count: { $sum: 1 },
            },
        },
    ]);

    // User distribution by role
    const usersByRole = await User.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 },
            },
        },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ banned: false });
    const bannedUsers = await User.countDocuments({ banned: true });
    const premiumUsers = await User.countDocuments({ isPremium: true });

    res.json({
        totalUsers,
        activeUsers,
        bannedUsers,
        premiumUsers,
        registrationTrend,
        usersByStatus,
        usersByRole,
    });
});

// Legacy movie analytics
const getMovieAnalytics = asyncHandler(async (req, res) => {
    const totalMovies = await Movie.countDocuments();

    // Movies by category
    const moviesByCategory = await Movie.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    // Top rated movies
    const topRatedMovies = await Movie.find()
        .sort({ rate: -1 })
        .limit(10)
        .select('name image rate numberOfReviews category');

    // Most reviewed movies
    const mostReviewedMovies = await Movie.find()
        .sort({ numberOfReviews: -1 })
        .limit(10)
        .select('name image rate numberOfReviews category');

    res.json({
        totalMovies,
        moviesByCategory,
        topRatedMovies,
        mostReviewedMovies,
    });
});

export {
    getAnalytics,
    getDashboardStats,
    getUserEngagement,
    getPopularContent,
    getWatchTimeAnalytics,
    getUserAnalytics,
    getMovieAnalytics,
};
