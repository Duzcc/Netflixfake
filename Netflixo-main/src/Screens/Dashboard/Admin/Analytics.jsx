import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import StatsCard from '../../Components/Dashboard/StatsCard';
import { FiUsers, FiFilm, FiDollarSign, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/analytics/stats');
            setStats(data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-dry h-32 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={FiUsers}
                    color="blue"
                />
                <StatsCard
                    title="Total Movies"
                    value={stats?.totalMovies || 0}
                    icon={FiFilm}
                    color="subMain"
                />
                <StatsCard
                    title="Active Subscriptions"
                    value={stats?.totalSubscriptions || 0}
                    icon={FiDollarSign}
                    color="green"
                />
                <StatsCard
                    title="New Users This Month"
                    value={stats?.newUsersThisMonth || 0}
                    icon={FiUserPlus}
                    color="yellow"
                />
            </div>

            {/* Most Watched Movies */}
            <div className="bg-dry border border-border rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Most Watched Movies</h2>
                <div className="space-y-3">
                    {stats?.mostWatched?.map((item, index) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between p-4 bg-main rounded-lg"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-subMain">
                                    #{index + 1}
                                </span>
                                <div>
                                    <h3 className="font-semibold">
                                        {item.movieDetails?.name}
                                    </h3>
                                    <p className="text-sm text-text">
                                        {item.movieDetails?.year}
                                    </p>
                                </div>
                            </div>
                            <span className="text-text">{item.count} views</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Growth Chart Placeholder */}
            <div className="bg-dry border border-border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">User Growth (Last 6 Months)</h2>
                <div className="h-64 flex items-center justify-center text-text">
                    <p>Chart visualization would go here</p>
                    <p className="text-sm ml-2">(Integrate with Chart.js or Recharts)</p>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;
