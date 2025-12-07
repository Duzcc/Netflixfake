import asyncHandler from 'express-async-handler';
import Movie from '../models/Movie.js';
import * as tmdbService from '../services/tmdbService.js';

/**
 * @desc    Import multiple movies by TMDb IDs
 * @route   POST /api/tmdb/batch-import
 * @access  Private/Admin
 */
export const batchImportMovies = asyncHandler(async (req, res) => {
    const { tmdbIds, overwrite = false } = req.body;

    if (!tmdbIds || !Array.isArray(tmdbIds) || tmdbIds.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of TMDb IDs');
    }

    if (tmdbIds.length > 50) {
        res.status(400);
        throw new Error('Maximum 50 movies per batch request');
    }

    const results = {
        total: tmdbIds.length,
        imported: 0,
        skipped: 0,
        failed: 0,
        movies: [],
        errors: [],
    };

    for (const tmdbId of tmdbIds) {
        try {
            // Check if already exists
            const existing = await Movie.findOne({ tmdbId });

            if (existing && !overwrite) {
                results.skipped++;
                results.errors.push({
                    tmdbId,
                    error: `Movie already exists: ${existing.name}`,
                });
                continue;
            }

            // Fetch from TMDb
            const tmdbMovie = await tmdbService.fetchMovieById(tmdbId);
            const movieData = tmdbService.transformTmdbToMovie(tmdbMovie, req.user._id);

            let savedMovie;
            if (existing && overwrite) {
                // Update existing movie
                Object.assign(existing, movieData);
                savedMovie = await existing.save();
                results.imported++;
            } else {
                // Create new movie
                const movie = new Movie(movieData);
                savedMovie = await movie.save();
                results.imported++;
            }

            results.movies.push({
                _id: savedMovie._id,
                tmdbId: savedMovie.tmdbId,
                name: savedMovie.name,
            });

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 250));
        } catch (error) {
            results.failed++;
            results.errors.push({
                tmdbId,
                error: error.message,
            });
        }
    }

    res.status(200).json({
        success: true,
        message: `Batch import completed: ${results.imported} imported, ${results.skipped} skipped, ${results.failed} failed`,
        results,
    });
});

/**
 * @desc    Import popular movies from TMDb
 * @route   POST /api/tmdb/import-popular
 * @access  Private/Admin
 */
export const importPopularMovies = asyncHandler(async (req, res) => {
    const {
        limit = 20,
        minRating = 6.0,
        minVoteCount = 100,
        overwrite = false
    } = req.body;

    if (limit > 100) {
        res.status(400);
        throw new Error('Maximum limit is 100 movies');
    }

    try {
        // Fetch popular movies with filters
        const movies = await tmdbService.fetchMoviesWithPagination(
            tmdbService.fetchPopularMovies,
            limit,
            { minRating, minVoteCount }
        );

        const results = {
            total: movies.length,
            imported: 0,
            skipped: 0,
            failed: 0,
            movies: [],
            errors: [],
        };

        for (const tmdbMovie of movies) {
            try {
                const existing = await Movie.findOne({ tmdbId: tmdbMovie.id });

                if (existing && !overwrite) {
                    results.skipped++;
                    continue;
                }

                // Fetch full details (need credits)
                const fullMovie = await tmdbService.fetchMovieById(tmdbMovie.id);
                const movieData = tmdbService.transformTmdbToMovie(fullMovie, req.user._id);

                let savedMovie;
                if (existing && overwrite) {
                    Object.assign(existing, movieData);
                    savedMovie = await existing.save();
                } else {
                    const movie = new Movie(movieData);
                    savedMovie = await movie.save();
                }

                results.imported++;
                results.movies.push({
                    _id: savedMovie._id,
                    tmdbId: savedMovie.tmdbId,
                    name: savedMovie.name,
                    rating: savedMovie.rate,
                });

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 250));
            } catch (error) {
                results.failed++;
                results.errors.push({
                    tmdbId: tmdbMovie.id,
                    name: tmdbMovie.title,
                    error: error.message,
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Popular movies import completed: ${results.imported} imported, ${results.skipped} skipped, ${results.failed} failed`,
            results,
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to import popular movies: ${error.message}`);
    }
});

/**
 * @desc    Import top-rated movies from TMDb
 * @route   POST /api/tmdb/import-top-rated
 * @access  Private/Admin
 */
export const importTopRatedMovies = asyncHandler(async (req, res) => {
    const {
        limit = 20,
        minRating = 7.0,
        overwrite = false
    } = req.body;

    if (limit > 100) {
        res.status(400);
        throw new Error('Maximum limit is 100 movies');
    }

    try {
        const movies = await tmdbService.fetchMoviesWithPagination(
            tmdbService.fetchTopRatedMovies,
            limit,
            { minRating }
        );

        const results = {
            total: movies.length,
            imported: 0,
            skipped: 0,
            failed: 0,
            movies: [],
            errors: [],
        };

        for (const tmdbMovie of movies) {
            try {
                const existing = await Movie.findOne({ tmdbId: tmdbMovie.id });

                if (existing && !overwrite) {
                    results.skipped++;
                    continue;
                }

                const fullMovie = await tmdbService.fetchMovieById(tmdbMovie.id);
                const movieData = tmdbService.transformTmdbToMovie(fullMovie, req.user._id);

                let savedMovie;
                if (existing && overwrite) {
                    Object.assign(existing, movieData);
                    savedMovie = await existing.save();
                } else {
                    const movie = new Movie(movieData);
                    savedMovie = await movie.save();
                }

                results.imported++;
                results.movies.push({
                    _id: savedMovie._id,
                    tmdbId: savedMovie.tmdbId,
                    name: savedMovie.name,
                    rating: savedMovie.rate,
                });

                await new Promise(resolve => setTimeout(resolve, 250));
            } catch (error) {
                results.failed++;
                results.errors.push({
                    tmdbId: tmdbMovie.id,
                    name: tmdbMovie.title,
                    error: error.message,
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Top-rated movies import completed: ${results.imported} imported, ${results.skipped} skipped, ${results.failed} failed`,
            results,
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to import top-rated movies: ${error.message}`);
    }
});

/**
 * @desc    Import movies by category/genre
 * @route   POST /api/tmdb/import-category
 * @access  Private/Admin
 */
export const importMoviesByCategory = asyncHandler(async (req, res) => {
    const {
        genreId,
        limit = 20,
        minRating = 6.0,
        minVoteCount = 100,
        overwrite = false
    } = req.body;

    if (!genreId) {
        res.status(400);
        throw new Error('Genre ID is required');
    }

    if (limit > 100) {
        res.status(400);
        throw new Error('Maximum limit is 100 movies');
    }

    try {
        const movies = await tmdbService.fetchMoviesWithPagination(
            (page) => tmdbService.fetchMoviesByGenre(genreId, page),
            limit,
            { minRating, minVoteCount }
        );

        const results = {
            total: movies.length,
            imported: 0,
            skipped: 0,
            failed: 0,
            movies: [],
            errors: [],
        };

        for (const tmdbMovie of movies) {
            try {
                const existing = await Movie.findOne({ tmdbId: tmdbMovie.id });

                if (existing && !overwrite) {
                    results.skipped++;
                    continue;
                }

                const fullMovie = await tmdbService.fetchMovieById(tmdbMovie.id);
                const movieData = tmdbService.transformTmdbToMovie(fullMovie, req.user._id);

                let savedMovie;
                if (existing && overwrite) {
                    Object.assign(existing, movieData);
                    savedMovie = await existing.save();
                } else {
                    const movie = new Movie(movieData);
                    savedMovie = await movie.save();
                }

                results.imported++;
                results.movies.push({
                    _id: savedMovie._id,
                    tmdbId: savedMovie.tmdbId,
                    name: savedMovie.name,
                    rating: savedMovie.rate,
                });

                await new Promise(resolve => setTimeout(resolve, 250));
            } catch (error) {
                results.failed++;
                results.errors.push({
                    tmdbId: tmdbMovie.id,
                    name: tmdbMovie.title,
                    error: error.message,
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Category import completed: ${results.imported} imported, ${results.skipped} skipped, ${results.failed} failed`,
            results,
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to import movies by category: ${error.message}`);
    }
});

/**
 * @desc    Get list of all TMDb-imported movies
 * @route   GET /api/tmdb/imported-movies
 * @access  Public
 */
export const getImportedMovies = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, sortBy = 'createdAt' } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const movies = await Movie.find({ importSource: 'tmdb' })
        .sort({ [sortBy]: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('name image tmdbId rate year category createdAt lastSyncedAt');

    const total = await Movie.countDocuments({ importSource: 'tmdb' });

    res.json({
        success: true,
        movies,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
    });
});

/**
 * @desc    Get TMDb genres list
 * @route   GET /api/tmdb/genres
 * @access  Public
 */
export const getTmdbGenres = asyncHandler(async (req, res) => {
    try {
        const genres = await tmdbService.fetchGenres();
        res.json({
            success: true,
            genres,
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to fetch genres: ${error.message}`);
    }
});

/**
 * @desc    Delete all TMDb-imported movies
 * @route   DELETE /api/tmdb/remove-imported
 * @access  Private/Admin
 */
export const removeImportedMovies = asyncHandler(async (req, res) => {
    const result = await Movie.deleteMany({ importSource: 'tmdb' });

    res.json({
        success: true,
        message: `${result.deletedCount} TMDb-imported movies removed`,
        deletedCount: result.deletedCount,
    });
});

/**
 * @desc    Get import statistics
 * @route   GET /api/tmdb/stats
 * @access  Private/Admin
 */
export const getImportStats = asyncHandler(async (req, res) => {
    const totalMovies = await Movie.countDocuments();
    const tmdbMovies = await Movie.countDocuments({ importSource: 'tmdb' });
    const manualMovies = await Movie.countDocuments({ importSource: 'manual' });

    // Get top categories
    const categoryStats = await Movie.aggregate([
        { $match: { importSource: 'tmdb' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    // Get recent imports
    const recentImports = await Movie.find({ importSource: 'tmdb' })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name tmdbId rate year createdAt');

    res.json({
        success: true,
        stats: {
            totalMovies,
            tmdbMovies,
            manualMovies,
            tmdbPercentage: ((tmdbMovies / totalMovies) * 100).toFixed(2),
        },
        categoryStats,
        recentImports,
    });
});
