import asyncHandler from 'express-async-handler';
import Watchlist from '../models/Watchlist.js';

// @desc    Add movie to watchlist
// @route   POST /api/watchlist
// @access  Private
export const addToWatchlist = asyncHandler(async (req, res) => {
    const { movieId, title, poster_path, backdrop_path, vote_average, release_date, overview } = req.body;

    // Validate required fields
    if (!movieId || !title) {
        res.status(400);
        throw new Error('Movie ID and title are required');
    }

    // Create movie data object
    const movieData = {
        movieId: Number(movieId),
        title,
        poster_path: poster_path || null,
        backdrop_path: backdrop_path || null,
        vote_average: vote_average || 0,
        release_date: release_date || '',
        overview: overview || '',
    };

    try {
        const watchlistItem = await Watchlist.addToWatchlist(req.user._id, movieData);
        res.status(201).json(watchlistItem);
    } catch (error) {
        if (error.message === 'Movie already in watchlist') {
            res.status(400);
        } else {
            res.status(500);
        }
        throw error;
    }
});

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
export const removeFromWatchlist = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const result = await Watchlist.removeFromWatchlist(req.user._id, movieId);

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('Movie not found in watchlist');
    }

    res.json({ message: 'Movie removed from watchlist' });
});

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
export const getWatchlist = asyncHandler(async (req, res) => {
    const watchlist = await Watchlist.getUserWatchlist(req.user._id);
    res.json(watchlist);
});

// @desc    Check if movie is in watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Private
export const checkWatchlist = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const isInWatchlist = await Watchlist.isInWatchlist(req.user._id, movieId);
    res.json({ isInWatchlist });
});

// @desc    Clear entire watchlist
// @route   DELETE /api/watchlist
// @access  Private
export const clearWatchlist = asyncHandler(async (req, res) => {
    await Watchlist.deleteMany({ user: req.user._id });
    res.json({ message: 'Watchlist cleared' });
});
