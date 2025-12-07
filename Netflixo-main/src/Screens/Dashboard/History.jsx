import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWatchHistory, deleteWatchHistory as deleteHistory, clearWatchHistory } from '../../utils/historyUtils';
import { FiClock, FiTrash2, FiPlay } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SideBar from './SideBar';

function HistoryPage() {
    const [historyData, setHistoryData] = useState({ history: [], page: 1, pages: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchHistory(currentPage);
    }, [currentPage]);

    const fetchHistory = async (page) => {
        setLoading(true);
        const data = await getWatchHistory(20, page);
        setHistoryData(data);
        setLoading(false);
    };

    const removeFromHistory = async (movieId) => {
        const result = await deleteHistory(movieId);
        if (result.success) {
            setHistoryData({
                ...historyData,
                history: historyData.history.filter((item) => item.movie.movieId !== movieId),
            });
            toast.success('Removed from history');
        } else {
            toast.error(result.error);
        }
    };

    const clearAllHistory = async () => {
        if (!window.confirm('Are you sure you want to clear all watch history?')) {
            return;
        }

        const result = await clearWatchHistory();
        if (result.success) {
            setHistoryData({ history: [], page: 1, pages: 0, total: 0 });
            toast.success('Watch history cleared');
        } else {
            toast.error(result.error);
        }
    };

    const formatProgress = (progress, duration) => {
        if (!duration) return '0%';
        const percentage = Math.round((progress / duration) * 100);
        return `${percentage}%`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
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
                <h1 className="text-3xl font-bold">Watch History</h1>
                {historyData.history.length > 0 && (
                    <button
                        onClick={clearAllHistory}
                        className="text-red-500 hover:text-red-400 transitions flex items-center gap-2"
                    >
                        <FiTrash2 />
                        Clear All
                    </button>
                )}
            </div>

            {historyData.history.length === 0 ? (
                <div className="bg-main border border-border rounded-lg p-12 text-center">
                    <FiClock className="mx-auto text-6xl text-subMain mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No watch history yet</h3>
                    <p className="text-text mb-6">
                        Start watching movies to see them here
                    </p>
                    <Link
                        to="/movies"
                        className="bg-subMain text-white px-6 py-3 rounded-lg inline-block hover:bg-opacity-80 transitions"
                    >
                        Browse Movies
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyData.history.map((item) => (
                        <div
                            key={item._id}
                            className="bg-main border border-border rounded-lg p-4 hover:border-subMain transitions"
                        >
                            <div className="flex gap-4">
                                <Link
                                    to={`/movie/${item.movie.movieId}`}
                                    className="flex-shrink-0"
                                >
                                    <img
                                        src={getMoviePoster(item.movie.poster_path)}
                                        alt={item.movie.title}
                                        className="w-32 h-48 object-cover rounded-lg"
                                    />
                                </Link>

                                <div className="flex-1">
                                    <Link to={`/movie/${item.movie.movieId}`}>
                                        <h3 className="text-xl font-semibold mb-2 hover:text-subMain transitions">
                                            {item.movie.title}
                                        </h3>
                                    </Link>

                                    <p className="text-sm text-text mb-3 line-clamp-2">
                                        {item.movie.overview || 'No description available'}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-text mb-3">
                                        <span>{item.movie.release_date ? new Date(item.movie.release_date).getFullYear() : 'N/A'}</span>
                                        <span>•</span>
                                        <span>Rating: {item.movie.vote_average || 'N/A'}/10</span>
                                        <span>•</span>
                                        <span>Watched {formatDate(item.watchedAt)}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    {item.progress > 0 && (
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs text-text mb-1">
                                                <span>
                                                    {item.completed ? 'Completed' : 'In Progress'}
                                                </span>
                                                <span>
                                                    {Math.floor(item.progress / 60)} min
                                                </span>
                                            </div>
                                            <div className="w-full bg-border rounded-full h-1">
                                                <div
                                                    className="bg-subMain h-1 rounded-full"
                                                    style={{
                                                        width: item.completed ? '100%' : '50%',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Link
                                            to={`/watch/${item.movie.movieId}`}
                                            className="bg-subMain text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-80 transitions"
                                        >
                                            <FiPlay />
                                            {item.completed ? 'Watch Again' : 'Continue Watching'}
                                        </Link>

                                        <button
                                            onClick={() => removeFromHistory(item.movie.movieId)}
                                            className="text-red-500 hover:text-red-400 transitions"
                                            title="Remove from history"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SideBar>
    );
}

export default HistoryPage;
