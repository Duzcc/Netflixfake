import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { addToFavorites, removeFromFavorites, checkFavorites } from '../../utils/favoritesUtils';

function FavoriteButton({ movieId, size = 'md', iconOnly = false }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const sizeClasses = {
        sm: iconOnly ? 'p-2' : 'px-3 py-2 text-sm',
        md: iconOnly ? 'p-3' : 'px-4 py-2',
        lg: iconOnly ? 'p-4' : 'px-6 py-3 text-lg',
    };

    const iconSizes = {
        sm: 'text-base',
        md: 'text-xl',
        lg: 'text-2xl',
    };

    useEffect(() => {
        checkFavoriteStatus();

        // Listen for favorites updates
        const handleFavoritesUpdate = () => checkFavoriteStatus();
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    }, [movieId]);

    const checkFavoriteStatus = async () => {
        if (!movieId) return;
        const isInFavorites = await checkFavorites(movieId);
        setIsFavorite(isInFavorites);
    };

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!movieId) {
            toast.error('Invalid movie');
            return;
        }

        console.log('🎬 Toggling favorite for movie:', movieId);
        setLoading(true);
        try {
            if (isFavorite) {
                console.log('❌ Removing from favorites...');
                const result = await removeFromFavorites(movieId);
                console.log('Remove result:', result);
                if (result.success) {
                    setIsFavorite(false);
                    toast.success('Removed from favorites');
                } else {
                    toast.error(result.error);
                }
            } else {
                console.log('❤️ Adding to favorites...');
                const result = await addToFavorites(movieId);
                console.log('Add result:', result);
                if (result.success) {
                    setIsFavorite(true);
                    toast.success('Added to favorites');
                } else {
                    toast.error(result.error);
                }
            }
        } catch (error) {
            console.error('Error in toggleFavorite:', error);
            toast.error('Failed to update favorites');
        } finally {
            setLoading(false);
        }
    };

    if (iconOnly) {
        return (
            <motion.button
                onClick={toggleFavorite}
                disabled={loading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${sizeClasses[size]} rounded-full transitions disabled:opacity-50 disabled:cursor-not-allowed ${isFavorite
                    ? 'bg-subMain text-white'
                    : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                {isFavorite ? (
                    <FaHeart className={iconSizes[size]} />
                ) : (
                    <FiHeart className={iconSizes[size]} />
                )}
            </motion.button>
        );
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`${sizeClasses[size]} rounded-lg font-medium transitions disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isFavorite
                ? 'bg-subMain text-white hover:bg-opacity-80'
                : 'bg-dry border border-border hover:border-subMain'
                }`}
        >
            {isFavorite ? (
                <>
                    <FaHeart className={iconSizes[size]} />
                    {!iconOnly && <span>Favorited</span>}
                </>
            ) : (
                <>
                    <FiHeart className={iconSizes[size]} />
                    {!iconOnly && <span>Add to Favorites</span>}
                </>
            )}
        </button>
    );
}

export default FavoriteButton;
