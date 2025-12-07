import axios from 'axios';

/**
 * TMDb Service Module
 * Centralized service for all TMDb API interactions
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Helper to construct TMDb API URL with query parameters
 */
const getTmdbUrl = (endpoint, params = {}) => {
    const queryParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US',
        ...params,
    });
    return `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
};

/**
 * Get full image URL from TMDb path
 */
const getImageUrl = (path, size = 'original') => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Fetch single movie by TMDb ID
 */
export const fetchMovieById = async (tmdbId) => {
    try {
        const response = await axios.get(
            getTmdbUrl(`/movie/${tmdbId}`, { append_to_response: 'credits,videos,reviews' })
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error(`Movie with TMDb ID ${tmdbId} not found`);
        }
        throw new Error(`Failed to fetch movie from TMDb: ${error.message}`);
    }
};

/**
 * Fetch popular movies
 */
export const fetchPopularMovies = async (page = 1) => {
    try {
        const response = await axios.get(getTmdbUrl('/movie/popular', { page }));
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch popular movies: ${error.message}`);
    }
};

/**
 * Fetch top-rated movies
 */
export const fetchTopRatedMovies = async (page = 1) => {
    try {
        const response = await axios.get(getTmdbUrl('/movie/top_rated', { page }));
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch top-rated movies: ${error.message}`);
    }
};

/**
 * Fetch movies by genre
 */
export const fetchMoviesByGenre = async (genreId, page = 1, additionalParams = {}) => {
    try {
        const response = await axios.get(
            getTmdbUrl('/discover/movie', {
                with_genres: genreId,
                page,
                sort_by: 'popularity.desc',
                ...additionalParams,
            })
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch movies by genre: ${error.message}`);
    }
};

/**
 * Fetch trending movies
 */
export const fetchTrendingMovies = async (timeWindow = 'week', page = 1) => {
    try {
        const response = await axios.get(
            getTmdbUrl(`/trending/movie/${timeWindow}`, { page })
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch trending movies: ${error.message}`);
    }
};

/**
 * Fetch now playing movies (in theaters)
 */
export const fetchNowPlayingMovies = async (page = 1) => {
    try {
        const response = await axios.get(getTmdbUrl('/movie/now_playing', { page }));
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch now playing movies: ${error.message}`);
    }
};

/**
 * Search movies
 */
export const searchMovies = async (query, page = 1) => {
    try {
        const response = await axios.get(getTmdbUrl('/search/movie', { query, page }));
        return response.data;
    } catch (error) {
        throw new Error(`Failed to search movies: ${error.message}`);
    }
};

/**
 * Get list of genres
 */
export const fetchGenres = async () => {
    try {
        const response = await axios.get(getTmdbUrl('/genre/movie/list'));
        return response.data.genres;
    } catch (error) {
        throw new Error(`Failed to fetch genres: ${error.message}`);
    }
};

/**
 * Transform TMDb movie data to our Movie schema format
 */
export const transformTmdbToMovie = (tmdbMovie, userId = null) => {
    const movieData = {
        name: tmdbMovie.title,
        desc: tmdbMovie.overview || 'No description available',
        titleImage: getImageUrl(tmdbMovie.backdrop_path, 'original'),
        image: getImageUrl(tmdbMovie.poster_path, 'w500'),
        category: tmdbMovie.genres && tmdbMovie.genres.length > 0
            ? tmdbMovie.genres[0].name
            : 'Drama',
        language: tmdbMovie.original_language?.toUpperCase() || 'EN',
        year: tmdbMovie.release_date
            ? new Date(tmdbMovie.release_date).getFullYear()
            : new Date().getFullYear(),
        time: tmdbMovie.runtime || 120,
        rate: tmdbMovie.vote_average || 0,
        numberOfReviews: tmdbMovie.vote_count || 0,

        // TMDb specific fields
        tmdbId: tmdbMovie.id,
        importSource: 'tmdb',
        lastSyncedAt: new Date(),
        userId: userId,
    };

    // Extract trailer/video from TMDb videos
    if (tmdbMovie.videos && tmdbMovie.videos.results) {
        // Find official trailer or first YouTube video
        const trailer = tmdbMovie.videos.results.find(
            v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
        ) || tmdbMovie.videos.results.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
        ) || tmdbMovie.videos.results.find(
            v => v.site === 'YouTube'
        );

        if (trailer) {
            movieData.video = trailer.key; // YouTube video key
            movieData.videoUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        }
    }

    // Extract cast information (top 10 actors)
    if (tmdbMovie.credits && tmdbMovie.credits.cast) {
        movieData.casts = tmdbMovie.credits.cast
            .slice(0, 10)
            .map((actor, index) => ({
                name: actor.name,
                image: actor.profile_path
                    ? getImageUrl(actor.profile_path, 'w185')
                    : undefined,
                character: actor.character,
                order: index + 1,
            }));
    }

    // Extract reviews from TMDb (up to 5 reviews)
    if (tmdbMovie.reviews && tmdbMovie.reviews.results) {
        const tmdbReviews = tmdbMovie.reviews.results.slice(0, 5);

        if (tmdbReviews.length > 0) {
            movieData.reviews = tmdbReviews.map(review => {
                // Generate fake user data
                const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava'];
                const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
                const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
                const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fakeName = `${randomFirst} ${randomLast}`;

                return {
                    name: review.author || fakeName,
                    rating: review.author_details?.rating
                        ? review.author_details.rating / 2
                        : Math.floor(Math.random() * 3) + 3, // 3-5 stars
                    comment: review.content.length > 500
                        ? review.content.substring(0, 497) + '...'
                        : review.content,
                    userImage: review.author_details?.avatar_path
                        ? getImageUrl(review.author_details.avatar_path, 'w100')
                        : `https://i.pravatar.cc/150?u=${fakeName.replace(' ', '')}`,
                    // user field will be set by controller
                };
            });

            movieData.numberOfReviews = movieData.reviews.length;
        }
    }

    return movieData;
};

/**
 * Fetch multiple movies with rate limiting
 * @param {Array} tmdbIds - Array of TMDb IDs
 * @param {Number} delayMs - Delay between requests in milliseconds (default: 250ms)
 * @returns {Promise<Array>} Array of {tmdbId, data, error}
 */
export const fetchMultipleMovies = async (tmdbIds, delayMs = 250) => {
    const results = [];

    for (const tmdbId of tmdbIds) {
        try {
            const movieData = await fetchMovieById(tmdbId);
            results.push({
                tmdbId,
                data: movieData,
                success: true,
            });
        } catch (error) {
            results.push({
                tmdbId,
                error: error.message,
                success: false,
            });
        }

        // Rate limiting delay
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results;
};

/**
 * Fetch movies from a specific endpoint with pagination
 * @param {Function} fetchFunction - Function to fetch movies (e.g., fetchPopularMovies)
 * @param {Number} totalLimit - Total number of movies to fetch
 * @param {Object} filters - Additional filters (minRating, minVoteCount, etc.)
 * @returns {Promise<Array>} Array of movie objects
 */
export const fetchMoviesWithPagination = async (
    fetchFunction,
    totalLimit = 100,
    filters = {}
) => {
    const movies = [];
    const moviesPerPage = 20; // TMDb returns 20 per page
    const maxPages = Math.ceil(totalLimit / moviesPerPage);

    for (let page = 1; page <= maxPages && movies.length < totalLimit; page++) {
        try {
            const response = await fetchFunction(page);
            let pageMovies = response.results || [];

            // Apply filters
            if (filters.minRating) {
                pageMovies = pageMovies.filter(m => m.vote_average >= filters.minRating);
            }
            if (filters.minVoteCount) {
                pageMovies = pageMovies.filter(m => m.vote_count >= filters.minVoteCount);
            }

            movies.push(...pageMovies);

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 250));
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
            break;
        }
    }

    return movies.slice(0, totalLimit);
};

export default {
    fetchMovieById,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchMoviesByGenre,
    fetchTrendingMovies,
    fetchNowPlayingMovies,
    searchMovies,
    fetchGenres,
    transformTmdbToMovie,
    fetchMultipleMovies,
    fetchMoviesWithPagination,
};
