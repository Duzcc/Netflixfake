import asyncHandler from 'express-async-handler';
import axios from 'axios';
import Movie from '../models/Movie.js';

// Helper to get TMDb API URL
const getTmdbUrl = (endpoint, params = {}) => {
    const queryParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US',
        ...params,
    });
    return `https://api.themoviedb.org/3${endpoint}?${queryParams}`;
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const response = await axios.get(getTmdbUrl('/movie/popular', { page }));
        res.json(response.data.results);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch popular movies from TMDb');
    }
});

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
const getTopRatedMovies = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    try {
        const response = await axios.get(getTmdbUrl('/movie/top_rated', { page }));
        res.json(response.data.results);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch top rated movies from TMDb');
    }
});

// @desc    Get movie details from local MongoDB (with TMDb fallback)
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Try to find by MongoDB _id first
        let movie = await Movie.findById(id);

        // If not found and id is numeric, try finding by tmdbId
        if (!movie && !isNaN(id)) {
            movie = await Movie.findOne({ tmdbId: parseInt(id) });
        }

        if (movie) {
            return res.json(movie);
        }

        // If not found in MongoDB and ID is numeric, fallback to TMDb API
        if (!isNaN(id)) {
            try {
                const response = await axios.get(
                    getTmdbUrl(`/movie/${id}`, { append_to_response: 'credits,videos' })
                );
                // Return TMDb data with a flag indicating it's from TMDb
                return res.json({
                    ...response.data,
                    _fromTMDb: true, // Flag for frontend to know
                });
            } catch (tmdbError) {
                // TMDb also doesn't have it
                res.status(404);
                throw new Error('Movie not found in local database or TMDb');
            }
        }

        res.status(404);
        throw new Error('Movie not found in database');
    } catch (error) {
        // If it's a CastError (invalid ObjectId format), try tmdbId then TMDb API
        if (error.name === 'CastError' && !isNaN(id)) {
            const movie = await Movie.findOne({ tmdbId: parseInt(id) });
            if (movie) {
                return res.json(movie);
            }

            // Last resort: Try TMDb API
            try {
                const response = await axios.get(
                    getTmdbUrl(`/movie/${id}`, { append_to_response: 'credits,videos' })
                );
                return res.json({
                    ...response.data,
                    _fromTMDb: true,
                });
            } catch (tmdbError) {
                // Give up
            }
        }
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = asyncHandler(async (req, res) => {
    const { query, page = 1 } = req.query;
    if (!query) {
        res.status(400);
        throw new Error('Search query is required');
    }
    try {
        const response = await axios.get(
            getTmdbUrl('/search/movie', { query, page })
        );
        res.json(response.data.results);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to search movies');
    }
});

// @desc    Get genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(getTmdbUrl('/genre/movie/list'));
        res.json(response.data.genres);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch genres');
    }
});

// @desc    Get similar movies
// @route   GET /api/movies/:id/similar
// @access  Public
const getSimilarMovies = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(getTmdbUrl(`/movie/${id}/similar`));
        res.json(response.data.results);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch similar movies');
    }
});

// @desc    Import movie from TMDb to local DB (Admin only)
// @route   POST /api/movies/import
// @access  Private/Admin
const importMovie = asyncHandler(async (req, res) => {
    const { tmdbId } = req.body;

    if (!tmdbId) {
        res.status(400);
        throw new Error('TMDb movie ID is required');
    }

    try {
        // Check if movie already exists by TMDb ID
        const existingMovie = await Movie.findOne({ tmdbId });
        if (existingMovie) {
            res.status(400);
            throw new Error(`Movie "${existingMovie.name}" (TMDb ID: ${tmdbId}) already exists in database`);
        }

        // Fetch movie details from TMDb with credits
        const movieResponse = await axios.get(
            getTmdbUrl(`/movie/${tmdbId}`, { append_to_response: 'credits' })
        );
        const tmdbMovie = movieResponse.data;

        // Extract and format movie data
        const movieData = {
            name: tmdbMovie.title,
            desc: tmdbMovie.overview || 'No description available',
            titleImage: `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`,
            image: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`,
            category: tmdbMovie.genres && tmdbMovie.genres.length > 0
                ? tmdbMovie.genres[0].name
                : 'Drama',
            language: tmdbMovie.original_language?.toUpperCase() || 'EN',
            year: tmdbMovie.release_date
                ? new Date(tmdbMovie.release_date).getFullYear()
                : new Date().getFullYear(),
            time: tmdbMovie.runtime || 120, // Default to 120 minutes if not available
            rate: tmdbMovie.vote_average || 0,
            numberOfReviews: tmdbMovie.vote_count || 0,
            userId: req.user._id,

            // TMDb tracking fields
            tmdbId: tmdbMovie.id,
            importSource: 'tmdb',
            lastSyncedAt: new Date(),
        };

        // Extract cast information (top 10 actors)
        if (tmdbMovie.credits && tmdbMovie.credits.cast) {
            movieData.casts = tmdbMovie.credits.cast
                .slice(0, 10)
                .map((actor, index) => ({
                    name: actor.name,
                    image: actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : undefined,
                    character: actor.character,
                    order: index + 1,
                }));
        }

        // Create movie in database
        const movie = new Movie(movieData);
        const savedMovie = await movie.save();

        res.status(201).json({
            success: true,
            message: 'Movie imported successfully from TMDb',
            movie: savedMovie,
            tmdbId: tmdbId,
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404);
            throw new Error(`Movie with TMDb ID ${tmdbId} not found`);
        }
        throw error;
    }
});

// KHỐI EXPORT ĐẦU TIÊN ĐÃ BỊ XÓA BỎ Ở ĐÂY

// @desc    Get movies by genre (ĐƯỢC DI CHUYỂN LÊN TRƯỚC HÀM EXPORT)
// @route   GET /api/movies/discover
// @access  Public
const getMoviesByGenre = asyncHandler(async (req, res) => {
    const { with_genres, page = 1 } = req.query;
    try {
        const response = await axios.get(
            getTmdbUrl('/discover/movie', { with_genres, page })
        );
        res.json(response.data.results);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch movies by genre');
    }
});

// @desc    Get all movies (Admin)
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
    try {
        // Filter by category, language, rate, year, search
        const { category, time, language, rate, year, search, pageNumber } =
            req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (language) {
            query.language = language;
        }
        if (rate) {
            query.rate = { $gte: rate };
        }
        if (year) {
            query.year = year;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const page = Number(pageNumber) || 1;
        const limit = 20; // Movies per page
        const skip = (page - 1) * limit;

        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const count = await Movie.countDocuments(query);

        res.json({
            movies,
            page,
            pages: Math.ceil(count / limit),
            totalMovies: count,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = asyncHandler(async (req, res) => {
    const {
        name,
        desc,
        image,
        titleImage,
        rate,
        numberOfReviews,
        category,
        time,
        language,
        year,
        video,
        casts,
    } = req.body;

    const movie = new Movie({
        name,
        desc,
        image,
        titleImage,
        rate,
        numberOfReviews,
        category,
        time,
        language,
        year,
        video,
        casts,
        userId: req.user._id,
    });

    if (movie) {
        const createdMovie = await movie.save();
        res.status(201).json(createdMovie);
    } else {
        res.status(400);
        throw new Error('Invalid movie data');
    }
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
    const {
        name,
        desc,
        image,
        titleImage,
        rate,
        numberOfReviews,
        category,
        time,
        language,
        year,
        video,
        casts,
    } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (movie) {
        movie.name = name || movie.name;
        movie.desc = desc || movie.desc;
        movie.image = image || movie.image;
        movie.titleImage = titleImage || movie.titleImage;
        movie.rate = rate || movie.rate;
        movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
        movie.category = category || movie.category;
        movie.time = time || movie.time;
        movie.language = language || movie.language;
        movie.year = year || movie.year;
        movie.video = video || movie.video;
        movie.casts = casts || movie.casts;

        const updatedMovie = await movie.save();
        res.status(201).json(updatedMovie);
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
        await movie.deleteOne();
        res.json({ message: 'Movie removed' });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Delete ALL movies (HÀM NÀY ĐÃ ĐƯỢC THÊM VÀO VÌ NÓ ĐƯỢC EXPORT)
// @route   DELETE /api/movies
// @access  Private/Admin
const deleteAllMovies = asyncHandler(async (req, res) => {
    // Xóa tất cả phim trong DB
    await Movie.deleteMany({});
    res.json({ message: 'All movies removed successfully' });
});

// @desc    Get movie reviews
// @route   GET /api/movies/:id/reviews
// @access  Public
const getMovieReviews = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id).select('reviews numberOfReviews');

    if (movie) {
        res.json({
            reviews: movie.reviews || [],
            totalReviews: movie.numberOfReviews || 0,
        });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Create movie review
// @route   POST /api/movies/:id/reviews
// @access  Private
const createMovieReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
        const alreadyReviewed = movie.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Movie already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            userImage: req.user.image,
        };

        movie.reviews.push(review);
        movie.numberOfReviews = movie.reviews.length;
        movie.rate =
            movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
            movie.reviews.length;

        await movie.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Update movie review
// @route   PUT /api/movies/:id/reviews
// @access  Private
const updateMovieReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
        const review = movie.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        review.rating = Number(rating) || review.rating;
        review.comment = comment || review.comment;

        // Recalculate average rating
        movie.rate =
            movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
            movie.reviews.length;

        await movie.save();
        res.json({ message: 'Review updated' });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// @desc    Delete movie review
// @route   DELETE /api/movies/:id/reviews
// @access  Private
const deleteMovieReview = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
        const reviewIndex = movie.reviews.findIndex(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (reviewIndex === -1) {
            res.status(404);
            throw new Error('Review not found');
        }

        movie.reviews.splice(reviewIndex, 1);
        movie.numberOfReviews = movie.reviews.length;

        // Recalculate average rating
        if (movie.reviews.length > 0) {
            movie.rate =
                movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
                movie.reviews.length;
        } else {
            movie.rate = 0;
        }

        await movie.save();
        res.json({ message: 'Review removed' });
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

// KHỐI EXPORT DUY NHẤT VÀ CUỐI CÙNG
export {
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
};