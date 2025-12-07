import React, { useState, useEffect } from 'react';
import { FiBookmark, FiCheck } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../../utils/watchlistUtils';

function WatchlistButton({ movieId, movie, size = 'md', iconOnly = false }) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);
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
        checkWatchlistStatus();

        // Listen for watchlist updates
        const handleWatchlistUpdate = () => checkWatchlistStatus();
        window.addEventListener('watchlistUpdated', handleWatchlistUpdate);

        return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    }, [movieId]);

    const checkWatchlistStatus = async () => {
        if (!movieId) return;
        const isIn = await checkWatchlist(movieId);
        setIsInWatchlist(isIn);
    };

    const toggleWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!movieId) {
            toast.error('Invalid movie');
            return;
        }

        setLoading(true);
        try {
            if (isInWatchlist) {
                const result = await removeFromWatchlist(movieId);
                if (result.success) {
                    setIsInWatchlist(false);
                    toast.success('Removed from watchlist');
                } else {
                    toast.error(result.error);
                }
            } else {
                // Use movie object if provided, otherwise use minimal data
                const movieData = movie || {
                    id: movieId,
                    title: 'Unknown Movie',
                };

                const result = await addToWatchlist(movieData);
                if (result.success) {
                    setIsInWatchlist(true);
                    toast.success('Added to watchlist');
                } else {
                    toast.error(result.error);
                }
            }
        } catch (error) {
            toast.error('Failed to update watchlist');
        } finally {
            setLoading(false);
        }
    };

    if (iconOnly) {
        return (
            <motion.button
                onClick={toggleWatchlist}
                disabled={loading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`${sizeClasses[size]} rounded-full transitions disabled:opacity-50 disabled:cursor-not-allowed ${isInWatchlist
                        ? 'bg-subMain text-white'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
                {isInWatchlist ? (
                    <FaBookmark className={iconSizes[size]} />
                ) : (
                    <FiBookmark className={iconSizes[size]} />
                )}
            </motion.button>
        );
    }

    return (
        <button
            onClick={toggleWatchlist}
            disabled={loading}
            className={`${sizeClasses[size]} rounded-lg font-medium transitions disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isInWatchlist
                    ? 'bg-subMain text-white hover:bg-opacity-80'
                    : 'bg-dry border border-border hover:border-subMain'
                }`}
        >
            {isInWatchlist ? (
                <>
                    <FiCheck className={iconSizes[size]} />
                    {!iconOnly && <span>In Watchlist</span>}
                </>
            ) : (
                <>
                    <FiBookmark className={iconSizes[size]} />
                    {!iconOnly && <span>Add to Watchlist</span>}
                </>
            )}
        </button>
    );
}

export default WatchlistButton;
