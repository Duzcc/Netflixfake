import express from 'express';
import {
    batchImportMovies,
    importPopularMovies,
    importTopRatedMovies,
    importMoviesByCategory,
    getImportedMovies,
    getTmdbGenres,
    removeImportedMovies,
    getImportStats,
} from '../controllers/tmdbImportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get TMDb genres list
router.get('/genres', getTmdbGenres);

// Get list of imported movies
router.get('/imported-movies', getImportedMovies);

// Batch import by TMDb IDs
router.post('/batch-import', protect, admin, batchImportMovies);

// Import popular movies
router.post('/import-popular', protect, admin, importPopularMovies);

// Import top-rated movies
router.post('/import-top-rated', protect, admin, importTopRatedMovies);

// Import by category/genre
router.post('/import-category', protect, admin, importMoviesByCategory);

// Get import statistics
router.get('/stats', protect, admin, getImportStats);

// Remove all imported movies
router.delete('/remove-imported', protect, admin, removeImportedMovies);

export default router;
