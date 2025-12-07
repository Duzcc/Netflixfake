import express from 'express';
import {
    getPopularMovies,
    getTopRatedMovies,
    getMovieDetails,
    searchMovies,
    getGenres,
    getSimilarMovies,
    getMoviesByGenre,
    importMovie,
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    deleteAllMovies,
    getMovieReviews,
    createMovieReview,
    updateMovieReview,
    deleteMovieReview,
} from '../controllers/movieController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateMovie, validateReview, validateTmdbId, sanitizeInput } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.get('/', getMovies);
router.get('/popular', getPopularMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/search', searchMovies);
router.get('/genres', getGenres);
router.get('/discover', getMoviesByGenre);
router.get('/:id', getMovieDetails);
router.get('/:id/similar', getSimilarMovies);

// Private routes - Reviews
router.route('/:id/reviews')
    .get(getMovieReviews)  // Public GET
    .post(protect, validateReview, createMovieReview)
    .put(protect, validateReview, updateMovieReview)
    .delete(protect, deleteMovieReview);

// Admin routes
router.post('/import', protect, admin, validateTmdbId, importMovie);
router.post('/', protect, admin, validateMovie, createMovie);
router.put('/:id', protect, admin, validateMovie, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);
router.delete('/', protect, admin, deleteAllMovies);

export default router;
