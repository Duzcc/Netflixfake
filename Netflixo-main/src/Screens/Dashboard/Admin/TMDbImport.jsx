import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getTmdbGenres,
    batchImportMovies,
    importPopularMovies,
    importTopRatedMovies,
    importMoviesByCategory,
    getImportedMovies,
    getImportStats,
    removeImportedMovies,
} from '../../../utils/tmdbApi';

const TMDbImport = () => {
    // State
    const [genres, setGenres] = useState([]);
    const [stats, setStats] = useState(null);
    const [importedMovies, setImportedMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);

    // Form states
    const [selectedGenre, setSelectedGenre] = useState('');
    const [limit, setLimit] = useState(20);
    const [minRating, setMinRating] = useState(6.0);
    const [minVoteCount, setMinVoteCount] = useState(100);
    const [tmdbIds, setTmdbIds] = useState('');
    const [overwrite, setOverwrite] = useState(false);

    // Progress state
    const [importProgress, setImportProgress] = useState(null);

    // Load data on mount
    useEffect(() => {
        loadGenres();
        loadStats();
        loadImportedMovies();
    }, []);

    const loadGenres = async () => {
        try {
            const data = await getTmdbGenres();
            setGenres(data.genres || []);
        } catch (error) {
            console.error('Failed to load genres:', error);
            toast.error('Failed to load genres');
        }
    };

    const loadStats = async () => {
        try {
            const data = await getImportStats();
            setStats(data.stats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const loadImportedMovies = async () => {
        try {
            setLoading(true);
            const data = await getImportedMovies(1, 10);
            setImportedMovies(data.movies || []);
        } catch (error) {
            console.error('Failed to load imported movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchImport = async () => {
        if (!tmdbIds.trim()) {
            toast.error('Please enter TMDb IDs');
            return;
        }

        const ids = tmdbIds
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        if (ids.length === 0) {
            toast.error('Please enter valid TMDb IDs');
            return;
        }

        if (ids.length > 50) {
            toast.error('Maximum 50 movies per batch');
            return;
        }

        setImporting(true);
        setImportProgress({ type: 'Batch Import', total: ids.length, current: 0 });

        try {
            const result = await batchImportMovies(ids, overwrite);
            setImportProgress(null);

            toast.success(result.message);
            setTmdbIds('');
            loadStats();
            loadImportedMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Import failed');
        } finally {
            setImporting(false);
        }
    };

    const handleImportPopular = async () => {
        setImporting(true);
        setImportProgress({ type: 'Popular Movies', total: limit, current: 0 });

        try {
            const result = await importPopularMovies(limit, minRating, minVoteCount, overwrite);
            setImportProgress(null);

            toast.success(result.message);
            loadStats();
            loadImportedMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Import failed');
        } finally {
            setImporting(false);
        }
    };

    const handleImportTopRated = async () => {
        setImporting(true);
        setImportProgress({ type: 'Top Rated Movies', total: limit, current: 0 });

        try {
            const result = await importTopRatedMovies(limit, minRating, overwrite);
            setImportProgress(null);

            toast.success(result.message);
            loadStats();
            loadImportedMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Import failed');
        } finally {
            setImporting(false);
        }
    };

    const handleImportByCategory = async () => {
        if (!selectedGenre) {
            toast.error('Please select a genre');
            return;
        }

        setImporting(true);
        setImportProgress({ type: 'Category Import', total: limit, current: 0 });

        try {
            const result = await importMoviesByCategory(
                selectedGenre,
                limit,
                minRating,
                minVoteCount,
                overwrite
            );
            setImportProgress(null);

            toast.success(result.message);
            loadStats();
            loadImportedMovies();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Import failed');
        } finally {
            setImporting(false);
        }
    };

    const handleRemoveAll = async () => {
        if (!window.confirm('Are you sure you want to remove ALL imported movies from TMDb? This action cannot be undone!')) {
            return;
        }

        setLoading(true);
        try {
            const result = await removeImportedMovies();
            toast.success(result.message);
            loadStats();
            setImportedMovies([]);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove movies');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-2 my-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">TMDb Movie Import</h1>
                <p className="text-gray-400 mt-2">Import movies from The Movie Database (TMDb)</p>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-dry border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total Movies</p>
                        <p className="text-2xl font-bold text-white">{stats.totalMovies}</p>
                    </div>
                    <div className="bg-dry border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">TMDb Imported</p>
                        <p className="text-2xl font-bold text-subMain">{stats.tmdbMovies}</p>
                    </div>
                    <div className="bg-dry border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Manual Added</p>
                        <p className="text-2xl font-bold text-green-500">{stats.manualMovies}</p>
                    </div>
                    <div className="bg-dry border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">TMDb Percentage</p>
                        <p className="text-2xl font-bold text-star">{stats.tmdbPercentage}%</p>
                    </div>
                </div>
            )}

            {/* Import Progress */}
            {importProgress && (
                <div className="bg-dry border border-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Importing {importProgress.type}...
                    </h3>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                        <div
                            className="bg-subMain h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs text-white font-semibold"
                            style={{ width: '50%' }}
                        >
                            In Progress...
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                        This may take a few minutes. Please wait...
                    </p>
                </div>
            )}

            {/* Import Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Batch Import by IDs */}
                <div className="bg-dry border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Batch Import by TMDb IDs</h2>
                    <textarea
                        className="w-full bg-main border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 h-32"
                        placeholder="Enter TMDb IDs separated by commas (e.g., 550, 551, 552)
Maximum 50 movies per batch"
                        value={tmdbIds}
                        onChange={(e) => setTmdbIds(e.target.value)}
                        disabled={importing}
                    />
                    <button
                        onClick={handleBatchImport}
                        disabled={importing || !tmdbIds.trim()}
                        className="mt-4 w-full bg-subMain hover:bg-subMain/80 transitions text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {importing ? 'Importing...' : 'Import Movies'}
                    </button>
                </div>

                {/* Import by Category */}
                <div className="bg-dry border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Import by Genre/Category</h2>
                    <select
                        className="w-full bg-main border border-gray-800 rounded-lg p-3 text-white mb-3"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        disabled={importing}
                    >
                        <option value="">Select Genre</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleImportByCategory}
                        disabled={importing || !selectedGenre}
                        className="w-full bg-subMain hover:bg-subMain/80 transitions text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {importing ? 'Importing...' : 'Import by Genre'}
                    </button>
                </div>

                {/* Import Popular */}
                <div className="bg-dry border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Import Popular Movies</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Import currently popular movies from TMDb
                    </p>
                    <button
                        onClick={handleImportPopular}
                        disabled={importing}
                        className="w-full bg-subMain hover:bg-subMain/80 transitions text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {importing ? 'Importing...' : 'Import Popular Movies'}
                    </button>
                </div>

                {/* Import Top Rated */}
                <div className="bg-dry border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Import Top Rated Movies</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Import highest rated movies from TMDb
                    </p>
                    <button
                        onClick={handleImportTopRated}
                        disabled={importing}
                        className="w-full bg-subMain hover:bg-subMain/80 transitions text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {importing ? 'Importing...' : 'Import Top Rated'}
                    </button>
                </div>
            </div>

            {/* Import Settings */}
            <div className="bg-dry border border-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Import Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-gray-400 text-sm">Limit</label>
                        <input
                            type="number"
                            className="w-full bg-main border border-gray-800 rounded-lg p-3 text-white mt-1"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
                            min="1"
                            max="100"
                            disabled={importing}
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Min Rating</label>
                        <input
                            type="number"
                            className="w-full bg-main border border-gray-800 rounded-lg p-3 text-white mt-1"
                            value={minRating}
                            onChange={(e) => setMinRating(parseFloat(e.target.value) || 6.0)}
                            min="0"
                            max="10"
                            step="0.1"
                            disabled={importing}
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm">Min Vote Count</label>
                        <input
                            type="number"
                            className="w-full bg-main border border-gray-800 rounded-lg p-3 text-white mt-1"
                            value={minVoteCount}
                            onChange={(e) => setMinVoteCount(parseInt(e.target.value) || 100)}
                            min="0"
                            disabled={importing}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="flex items-center text-white cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={overwrite}
                            onChange={(e) => setOverwrite(e.target.checked)}
                            disabled={importing}
                        />
                        <span>Overwrite existing movies</span>
                    </label>
                </div>
            </div>

            {/* Recently Imported Movies */}
            <div className="bg-dry border border-gray-800 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Recently Imported Movies</h2>
                    <button
                        onClick={handleRemoveAll}
                        disabled={loading || importing}
                        className="bg-red-600 hover:bg-red-700 transitions text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Remove All TMDb Movies
                    </button>
                </div>
                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : importedMovies.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left text-gray-400 py-2">TMDb ID</th>
                                    <th className="text-left text-gray-400 py-2">Name</th>
                                    <th className="text-left text-gray-400 py-2">Year</th>
                                    <th className="text-left text-gray-400 py-2">Rating</th>
                                    <th className="text-left text-gray-400 py-2">Category</th>
                                    <th className="text-left text-gray-400 py-2">Imported At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {importedMovies.map((movie) => (
                                    <tr key={movie._id} className="border-b border-gray-800/50">
                                        <td className="py-3 text-subMain">{movie.tmdbId}</td>
                                        <td className="py-3 text-white">{movie.name}</td>
                                        <td className="py-3 text-gray-400">{movie.year}</td>
                                        <td className="py-3 text-star">{movie.rate?.toFixed(1)}</td>
                                        <td className="py-3 text-gray-400">{movie.category}</td>
                                        <td className="py-3 text-gray-400">
                                            {new Date(movie.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400">No movies imported yet</p>
                )}
            </div>
        </div>
    );
};

export default TMDbImport;
