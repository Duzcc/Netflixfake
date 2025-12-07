import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Get auth token from localStorage
const getAuthToken = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const parsed = JSON.parse(userInfo);
        return parsed.token;
    }
    return null;
};

// Create axios instance with auth header
const createAxiosConfig = () => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
    },
});

/**
 * Get TMDb genres list
 */
export const getTmdbGenres = async () => {
    const response = await axios.get(`${API_URL}/tmdb/genres`);
    return response.data;
};

/**
 * Batch import movies by TMDb IDs
 */
export const batchImportMovies = async (tmdbIds, overwrite = false) => {
    const response = await axios.post(
        `${API_URL}/tmdb/batch-import`,
        { tmdbIds, overwrite },
        createAxiosConfig()
    );
    return response.data;
};

/**
 * Import popular movies
 */
export const importPopularMovies = async (limit = 20, minRating = 6.0, minVoteCount = 100, overwrite = false) => {
    const response = await axios.post(
        `${API_URL}/tmdb/import-popular`,
        { limit, minRating, minVoteCount, overwrite },
        createAxiosConfig()
    );
    return response.data;
};

/**
 * Import top-rated movies
 */
export const importTopRatedMovies = async (limit = 20, minRating = 7.0, overwrite = false) => {
    const response = await axios.post(
        `${API_URL}/tmdb/import-top-rated`,
        { limit, minRating, overwrite },
        createAxiosConfig()
    );
    return response.data;
};

/**
 * Import movies by category/genre
 */
export const importMoviesByCategory = async (genreId, limit = 20, minRating = 6.0, minVoteCount = 100, overwrite = false) => {
    const response = await axios.post(
        `${API_URL}/tmdb/import-category`,
        { genreId, limit, minRating, minVoteCount, overwrite },
        createAxiosConfig()
    );
    return response.data;
};

/**
 * Get list of imported movies
 */
export const getImportedMovies = async (page = 1, limit = 20, sortBy = 'createdAt') => {
    const response = await axios.get(
        `${API_URL}/tmdb/imported-movies?page=${page}&limit=${limit}&sortBy=${sortBy}`
    );
    return response.data;
};

/**
 * Get import statistics
 */
export const getImportStats = async () => {
    const response = await axios.get(
        `${API_URL}/tmdb/stats`,
        createAxiosConfig()
    );
    return response.data;
};

/**
 * Remove all imported movies
 */
export const removeImportedMovies = async () => {
    const response = await axios.delete(
        `${API_URL}/tmdb/remove-imported`,
        createAxiosConfig()
    );
    return response.data;
};
