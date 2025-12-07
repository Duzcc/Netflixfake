import express from 'express';
import {
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    checkWatchlist,
    clearWatchlist,
} from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Watchlist routes
router.route('/')
    .get(protect, getWatchlist)
    .post(protect, addToWatchlist)
    .delete(protect, clearWatchlist);

router.get('/check/:movieId', protect, checkWatchlist);

router.delete('/:movieId', protect, removeFromWatchlist);

export default router;
