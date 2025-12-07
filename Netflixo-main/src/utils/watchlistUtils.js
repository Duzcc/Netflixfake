import api from './api';

// Add movie to watchlist
export const addToWatchlist = async (movie) => {
    try {
        // Validate movie object
        if (!movie || !movie.id) {
            console.error('Invalid movie object:', movie);
            return {
                success: false,
                error: 'Invalid movie data',
            };
        }

        // Extract movie data to send to backend
        const movieData = {
            movieId: movie.id,
            title: movie.title || movie.name || 'Unknown',
            poster_path: movie.poster_path || '',
            backdrop_path: movie.backdrop_path || '',
            vote_average: movie.vote_average || 0,
            release_date: movie.release_date || movie.first_air_date || '',
            overview: movie.overview || '',
        };

        const { data } = await api.post('/watchlist', movieData);
        window.dispatchEvent(new Event('watchlistUpdated'));
        return { success: true, data };
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to add to watchlist',
        };
    }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (movieId) => {
    try {
        await api.delete(`/watchlist/${movieId}`);
        window.dispatchEvent(new Event('watchlistUpdated'));
        return { success: true };
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to remove from watchlist',
        };
    }
};

// Get user's watchlist
export const getWatchlist = async () => {
    try {
        const { data } = await api.get('/watchlist');
        return data;
    } catch (error) {
        console.error('Error getting watchlist:', error);
        return [];
    }
};

// Check if movie is in watchlist
export const checkWatchlist = async (movieId) => {
    try {
        const { data } = await api.get(`/watchlist/check/${movieId}`);
        return data.isInWatchlist;
    } catch (error) {
        console.error('Error checking watchlist:', error);
        return false;
    }
};

// Clear entire watchlist
export const clearWatchlist = async () => {
    try {
        await api.delete('/watchlist');
        window.dispatchEvent(new Event('watchlistUpdated'));
        return { success: true };
    } catch (error) {
        console.error('Error clearing watchlist:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to clear watchlist',
        };
    }
};
