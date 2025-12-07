import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilm, FaHeart, FaClock, FaBookmark, FaStar, FaTrophy } from "react-icons/fa";
import { getCurrentUser } from "../../utils/authUtils";
import { getWatchHistory } from "../../utils/historyUtils";
import { getWatchlist } from "../../utils/watchlistUtils";
import { getFavorites } from "../../utils/favoritesUtils";
import MovieRow from "../../Components/MovieRow";
import SideBar from "./SideBar";
import StatsCard from "../../Components/Dashboard/StatsCard";
import DashboardSkeleton from "../../Components/Loading/DashboardSkeleton";

function UserDashboard() {
    const [stats, setStats] = useState({
        watchHistory: 0,
        watchlist: 0,
        favorites: 0,
        totalWatchTime: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentMovies, setRecentMovies] = useState([]);
    const user = getCurrentUser();

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        setLoading(true);
        try {
            console.log('📊 Fetching dashboard stats...');

            const [historyData, watchlistData, favoritesData] = await Promise.all([
                getWatchHistory(20, 1).catch(err => {
                    console.error('History error:', err);
                    return { history: [], total: 0 };
                }),
                getWatchlist().catch(err => {
                    console.error('Watchlist error:', err);
                    return [];
                }),
                getFavorites().catch(err => {
                    console.error('Favorites error:', err);
                    return [];
                }),
            ]);

            console.log('📊 Stats data:', {
                history: historyData,
                watchlist: watchlistData,
                favorites: favoritesData
            });

            // Calculate total watch time (in hours)
            const totalSeconds = (historyData.history || []).reduce((acc, item) => acc + (item.progress || 0), 0);
            const totalHours = Math.round(totalSeconds / 3600);

            setStats({
                watchHistory: historyData.total || 0,
                watchlist: Array.isArray(watchlistData) ? watchlistData.length : 0,
                favorites: Array.isArray(favoritesData) ? favoritesData.length : 0,
                totalWatchTime: totalHours,
            });

            // Convert recent movies to format compatible with MovieRow
            const formattedMovies = (historyData.history || []).slice(0, 10).map(item => ({
                id: item.movie._id,
                title: item.movie.name,
                name: item.movie.name,
                poster_path: item.movie.image,
                vote_average: item.movie.rate || 0,
                release_date: item.movie.year?.toString(),
            })).filter(movie => movie.id); // Filter out invalid movies

            console.log('🎬 Formatted recent movies:', formattedMovies);
            setRecentMovies(formattedMovies);
        } catch (error) {
            console.error("❌ Error fetching user stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: "My Watchlist",
            description: "Movies you want to watch",
            icon: FaBookmark,
            link: "/watchlist",
            color: "yellow",
            count: stats.watchlist,
        },
        {
            title: "Favorites",
            description: "Your liked movies",
            icon: FaHeart,
            link: "/favorites",
            color: "red",
            count: stats.favorites,
        },
        {
            title: "Watch History",
            description: "Recently watched",
            icon: FaClock,
            link: "/history",
            color: "blue",
            count: stats.watchHistory,
        },
    ];

    if (loading) {
        return (
            <SideBar>
                <DashboardSkeleton />
            </SideBar>
        );
    }

    return (
        <SideBar>
            <div className="space-y-8">
                {/* Welcome Header with Gradient */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-subMain/20 via-transparent to-transparent" />
                    <div className="relative z-10 p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-subMain/20 flex items-center justify-center text-3xl">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl md:text-4xl font-bold text-white"
                                >
                                    {getGreeting()}, {user?.name}! 👋
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-text-secondary"
                                >
                                    Welcome back to your entertainment hub
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Your Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            icon={FaClock}
                            title="Watch History"
                            value={stats.watchHistory}
                            subtitle="movies watched"
                            color="blue"
                        />
                        <StatsCard
                            icon={FaBookmark}
                            title="Watchlist"
                            value={stats.watchlist}
                            subtitle="movies to watch"
                            color="yellow"
                        />
                        <StatsCard
                            icon={FaHeart}
                            title="Favorites"
                            value={stats.favorites}
                            subtitle="liked movies"
                            color="red"
                        />
                        <StatsCard
                            icon={FaTrophy}
                            title="Watch Time"
                            value={`${stats.totalWatchTime}h`}
                            subtitle="total hours"
                            color="green"
                        />
                    </div>
                </div>

                {/* Recently Watched - Using MovieRow */}
                {recentMovies.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
                            <Link
                                to="/history"
                                className="text-subMain hover:text-white transition-colors text-sm font-semibold"
                            >
                                View All →
                            </Link>
                        </div>
                        <MovieRow movies={recentMovies} delay={0} />
                    </div>
                )}

                {/* Empty State for No History */}
                {recentMovies.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                    >
                        <FaFilm className="mx-auto text-6xl text-subMain mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Watch History Yet</h3>
                        <p className="text-text-secondary mb-6">
                            Start exploring our vast collection of movies and TV shows
                        </p>
                        <Link
                            to="/movies"
                            className="inline-flex items-center gap-2 bg-subMain text-white px-8 py-3 rounded-full font-semibold hover:bg-subMain/90 transition-colors shadow-glow"
                        >
                            <FaFilm />
                            Browse Movies
                        </Link>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Link key={index} to={action.link}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="glass-card backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-subMain transition-all duration-300 text-center group"
                                    >
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${action.color === "yellow" ? "bg-warning/20 group-hover:bg-warning/30" :
                                            action.color === "red" ? "bg-error/20 group-hover:bg-error/30" :
                                                action.color === "blue" ? "bg-info/20 group-hover:bg-info/30" :
                                                    "bg-subMain/20 group-hover:bg-subMain/30"
                                            }`}>
                                            <Icon className={`text-3xl ${action.color === "yellow" ? "text-warning" :
                                                action.color === "red" ? "text-error" :
                                                    action.color === "blue" ? "text-info" :
                                                        "text-subMain"
                                                }`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                                        <p className="text-text-secondary text-sm mb-3">{action.description}</p>
                                        <div className="text-2xl font-bold text-white">{action.count}</div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Additional CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-subMain/10 to-transparent" />
                    <div className="relative z-10">
                        <FaStar className="mx-auto text-5xl text-warning mb-4" />
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Enjoying Netflixfake?
                        </h3>
                        <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                            Share your favorite movies with friends and help them discover great content!
                        </p>
                        <Link
                            to="/movies"
                            className="inline-flex items-center gap-3 bg-subMain text-white px-8 py-3 rounded-full font-semibold hover:bg-subMain/90 transition-colors shadow-glow"
                        >
                            Explore More
                            <span>→</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </SideBar>
    );
}

export default UserDashboard;
