import asyncHandler from 'express-async-handler';
import WatchHistory from '../models/WatchHistory.js';

// @desc    Add or update watch history
// @route   POST /api/history
// @access  Private
export const addWatchHistory = asyncHandler(async (req, res) => {
    const { movieId, title, poster_path, backdrop_path, vote_average, release_date, overview, progress, completed } = req.body;

    if (!movieId || !title) {
        res.status(400);
        throw new Error('Movie ID and title are required');
    }

    const movieData = {
        movieId: Number(movieId),
        title,
        poster_path: poster_path || null,
        backdrop_path: backdrop_path || null,
        vote_average: vote_average || 0,
        release_date: release_date || '',
        overview: overview || '',
    };

    const history = await WatchHistory.addOrUpdate(
        req.user._id,
        movieData,
        progress || 0,
        completed || false
    );

    res.status(201).json(history);
});

// @desc    Get user's watch history
// @route   GET /api/history
// @access  Private
export const getWatchHistory = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const history = await WatchHistory.getUserHistory(
        req.user._id,
        limit ? parseInt(limit) : 20
    );
    res.json(history);
});

// @desc    Get watch progress for a specific movie
// @route   GET /api/history/:movieId
// @access  Private
export const getMovieProgress = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const history = await WatchHistory.findOne({
        user: req.user._id,
        'movie.movieId': Number(movieId),
    });

    if (!history) {
        res.json({ progress: 0, completed: false });
        return;
    }

    res.json({
        progress: history.progress,
        completed: history.completed,
        watchedAt: history.watchedAt,
    });
});

// @desc    Delete watch history item
// @route   DELETE /api/history/:movieId
// @access  Private
export const deleteWatchHistory = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const result = await WatchHistory.deleteOne({
        user: req.user._id,
        'movie.movieId': Number(movieId),
    });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('History item not found');
    }

    res.json({ message: 'History item removed' });
});

// @desc    Get continue watching (incomplete movies)
// @route   GET /api/history/continue
// @access  Private
export const getContinueWatching = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const history = await WatchHistory.find({
        user: req.user._id,
        completed: false,
        progress: { $gt: 0 }, // Only movies with some progress
    })
        .sort({ watchedAt: -1 })
        .limit(limit);

    res.json(history);
});

// @desc    Clear all watch history
// @route   DELETE /api/history
// @access  Private
export const clearWatchHistory = asyncHandler(async (req, res) => {
    await WatchHistory.deleteMany({ user: req.user._id });
    res.json({ message: 'Watch history cleared' });
});
