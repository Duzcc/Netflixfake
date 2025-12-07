import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { addToWatchlist, removeFromWatchlist, checkWatchlist } from '../../utils/watchlistUtils';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../utils/authUtils';

function WatchlistButton({ movie, movieId: propMovieId, size = 'md', className = '' }) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [loading, setLoading] = useState(false);

    // Support both movie object and movieId prop
    const movieId = propMovieId || movie?.id;

    useEffect(() => {
        if (!isAuthenticated() || !movieId) return;

        const checkStatus = async () => {
            const status = await checkWatchlist(movieId);
            setIsInWatchlist(status);
        };
        checkStatus();

        // Listen for watchlist updates
        const handleUpdate = () => checkStatus();
        window.addEventListener('watchlistUpdated', handleUpdate);
        return () => window.removeEventListener('watchlistUpdated', handleUpdate);
    }, [movieId]);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated()) {
            toast.error('Please login to use watchlist');
            return;
        }

        setLoading(true);

        if (isInWatchlist) {
            const result = await removeFromWatchlist(movieId);
            if (result.success) {
                setIsInWatchlist(false);
                toast.success('Removed from watchlist');
            } else {
                toast.error(result.error);
            }
        } else {
            // Pass full movie object for adding
            const result = await addToWatchlist(movie);
            if (result.success) {
                setIsInWatchlist(true);
                toast.success('Added to watchlist');
            } else {
                toast.error(result.error);
            }
        }

        setLoading(false);
    };

    if (!isAuthenticated()) {
        return null;
    }

    // Size variants
    const sizeClasses = {
        sm: 'p-2',
        md: 'h-9 w-9',
        lg: 'p-4'
    };

    return (
        <motion.button
            onClick={handleToggle}
            disabled={loading}
            className={`glass backdrop-blur-md rounded-full transition-colors duration-200 hover:bg-white/20 ${sizeClasses[size]} ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            whileHover={{ scale: loading ? 1 : 1.1 }}
            whileTap={{ scale: loading ? 1 : 0.9 }}
            title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
            {isInWatchlist ? (
                <FaBookmark className="text-subMain text-sm" />
            ) : (
                <FaRegBookmark className="text-white text-sm" />
            )}
        </motion.button>
    );
}

export default WatchlistButton;
