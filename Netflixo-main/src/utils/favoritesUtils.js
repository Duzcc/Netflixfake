import api from './api';

// Add movie to favorites
export const addToFavorites = async (movieId) => {
    try {
        if (!movieId) {
            console.error('❌ Invalid movie ID');
            return {
                success: false,
                error: 'Invalid movie ID',
            };
        }

        console.log('📡 Calling API to add favorite:', movieId);
        const { data } = await api.post('/users/favorites', { movieId: String(movieId) });
        console.log('✅ API Response:', data);

        window.dispatchEvent(new Event('favoritesUpdated'));
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error adding to favorites:', error);
        console.error('Error response:', error.response?.data);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to add to favorites',
        };
    }
};

// Remove movie from favorites
export const removeFromFavorites = async (movieId) => {
    try {
        await api.delete('/users/favorites', {
            data: { movieId: String(movieId) }
        });
        window.dispatchEvent(new Event('favoritesUpdated'));
        return { success: true };
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to remove from favorites',
        };
    }
};


// Get user's favorites
export const getFavorites = async () => {
    try {
        const { data } = await api.get('/users/favorites');
        return data;
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

// Check if movie is in favorites
export const checkFavorites = async (movieId) => {
    try {
        const favorites = await getFavorites();
        return favorites.includes(String(movieId));
    } catch (error) {
        console.error('Error checking favorites:', error);
        return false;
    }
};

//Clear all favorites
export const clearFavorites = async () => {
    try {
        await api.delete('/users/favorites/all');
        window.dispatchEvent(new Event('favoritesUpdated'));
        return { success: true };
    } catch (error) {
        console.error('Error clearing favorites:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to clear favorites',
        };
    }
};
