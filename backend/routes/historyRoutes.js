import express from 'express';
import {
    addWatchHistory,
    getWatchHistory,
    getContinueWatching,
    getMovieProgress,
    deleteWatchHistory,
    clearWatchHistory,
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Watch history routes
router.route('/')
    .get(protect, getWatchHistory)
    .post(protect, addWatchHistory)
    .delete(protect, clearWatchHistory);

router.get('/continue', protect, getContinueWatching);

router.route('/:movieId')
    .get(protect, getMovieProgress)
    .delete(protect, deleteWatchHistory);

export default router;
