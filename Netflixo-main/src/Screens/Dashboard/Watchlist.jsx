import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist as removeWatchlist } from '../../utils/watchlistUtils';
import { FiBookmark, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SideBar from './SideBar';

function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWatchlist();

        // Listen for watchlist updates
        const handleUpdate = () => fetchWatchlist();
        window.addEventListener('watchlistUpdated', handleUpdate);
        return () => window.removeEventListener('watchlistUpdated', handleUpdate);
    }, []);

    const fetchWatchlist = async () => {
        setLoading(true);
        const data = await getWatchlist();
        setWatchlist(data);
        setLoading(false);
    };

    const handleRemove = async (movieId) => {
        const result = await removeWatchlist(movieId);
        if (result.success) {
            setWatchlist(watchlist.filter((item) => item.movie.movieId !== movieId));
            toast.success('Removed from watchlist');
        } else {
            toast.error(result.error);
        }
    };

    const getMoviePoster = (posterPath) => {
        if (!posterPath) return 'https://placehold.co/500x750?text=No+Poster';
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    };

    if (loading) {
        return (
            <SideBar>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-main h-32 rounded-lg" />
                    ))}
                </div>
            </SideBar>
        );
    }

    return (
        <SideBar>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Watchlist</h1>
                <span className="text-text">{watchlist.length} movies</span>
            </div>

            {watchlist.length === 0 ? (
                <div className="bg-main border border-border rounded-lg p-12 text-center">
                    <FiBookmark className="mx-auto text-6xl text-subMain mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
                    <p className="text-text mb-6">
                        Add movies you want to watch later
                    </p>
                    <Link
                        to="/movies"
                        className="bg-subMain text-white px-6 py-3 rounded-lg inline-block hover:bg-opacity-80 transitions"
                    >
                        Browse Movies
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {watchlist.map((item) => (
                        <div
                            key={item._id}
                            className="bg-main border border-border rounded-lg overflow-hidden hover:border-subMain transitions group relative"
                        >
                            <Link to={`/movie/${item.movie.movieId}`}>
                                <img
                                    src={getMoviePoster(item.movie.poster_path)}
                                    alt={item.movie.title}
                                    className="w-full h-64 object-cover"
                                />
                            </Link>

                            {/* Remove Button Overlay */}
                            <button
                                onClick={() => handleRemove(item.movie.movieId)}
                                className="absolute top-2 right-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full transitions"
                                title="Remove from watchlist"
                            >
                                <FiTrash2 />
                            </button>

                            <div className="p-4">
                                <Link to={`/movie/${item.movie.movieId}`}>
                                    <h3 className="font-semibold text-lg mb-2 hover:text-subMain transitions truncate">
                                        {item.movie.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between text-sm text-text">
                                    <span>{item.movie.release_date ? new Date(item.movie.release_date).getFullYear() : 'N/A'}</span>
                                    <span>Rating: {item.movie.vote_average || 'N/A'}/10</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SideBar>
    );
}

export default WatchlistPage;
