import api from './api';

// Add or update watch history
export const addWatchHistory = async (movie, progress, completed = false) => {
    try {
        const movieData = {
            movieId: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date || movie.first_air_date,
            overview: movie.overview,
            progress,
            completed,
        };

        const { data } = await api.post('/history', movieData);
        return { success: true, data };
    } catch (error) {
        console.error('Error adding watch history:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to add watch history',
        };
    }
};

// Get user's watch history
export const getWatchHistory = async (limit = 20, page = 1) => {
    try {
        const { data } = await api.get(`/history?limit=${limit}&page=${page}`);
        // Ensure consistent structure
        return {
            history: Array.isArray(data) ? data : [],
            page: 1,
            pages: 1,
            total: Array.isArray(data) ? data.length : 0
        };
    } catch (error) {
        console.error('Error getting watch history:', error);
        return { history: [], page: 1, pages: 0, total: 0 };
    }
};

// Get continue watching
export const getContinueWatching = async (limit = 10) => {
    try {
        const { data } = await api.get(`/history/continue?limit=${limit}`);
        return data;
    } catch (error) {
        console.error('Error getting continue watching:', error);
        return [];
    }
};

// Get movie progress
export const getMovieProgress = async (movieId) => {
    try {
        const { data } = await api.get(`/history/${movieId}`);
        return data;
    } catch (error) {
        console.error('Error getting movie progress:', error);
        return { progress: 0, completed: false };
    }
};

// Delete watch history item
export const deleteWatchHistory = async (movieId) => {
    try {
        await api.delete(`/history/${movieId}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting watch history:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to delete watch history',
        };
    }
};

// Clear all watch history
export const clearWatchHistory = async () => {
    try {
        await api.delete('/history');
        return { success: true };
    } catch (error) {
        console.error('Error clearing watch history:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to clear watch history',
        };
    }
};
