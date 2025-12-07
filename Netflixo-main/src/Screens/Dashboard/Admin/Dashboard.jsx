import React, { useEffect, useState } from "react";
import { FaRegListAlt, FaUser } from "react-icons/fa";
import { FiEye, FiStar } from "react-icons/fi";
import { HiViewGridAdd } from "react-icons/hi";
import SideBar from "../SideBar";
import Table from "../../../Components/Table";
import api from "../../../utils/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch analytics dashboard stats from backend
      const { data: analyticsData } = await api.get('/analytics/dashboard');
      setStats(analyticsData);

      // Fetch recent movies from local DB
      const { data: moviesData } = await api.get('/movies?pageNumber=1&limit=5');
      setRecentMovies(moviesData.movies || []);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const DashboardData = [
    {
      bg: "bg-orange-600",
      icon: FaRegListAlt,
      title: "Total Movies",
      total: stats?.overview?.totalMovies || 0,
    },
    {
      bg: "bg-blue-700",
      icon: HiViewGridAdd,
      title: "Total Categories",
      total: stats?.overview?.totalCategories || 0,
    },
    {
      bg: "bg-green-600",
      icon: FaUser,
      title: "Total Users",
      total: stats?.overview?.totalUsers || 0,
    },
    {
      bg: "bg-purple-600",
      icon: FiEye,
      title: "Total Views",
      total: stats?.overview?.totalViews || 0,
    },
    {
      bg: "bg-yellow-600",
      icon: FiStar,
      title: "Total Reviews",
      total: stats?.overview?.totalReviews || 0,
    },
  ];

  if (loading) {
    return (
      <SideBar>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-subMain"></div>
        </div>
      </SideBar>
    );
  }

  if (error) {
    return (
      <SideBar>
        <div className="bg-error/20 border border-error/50 rounded-lg p-4 text-error">
          {error}
        </div>
      </SideBar>
    );
  }

  return (
    <SideBar>
      <h2 className="text-xl font-bold">Admin Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-4">
        {DashboardData.map((data, index) => (
          <div
            key={index}
            className="p-4 rounded bg-main border border-border hover:border-subMain transition-all"
          >
            <div className={`rounded-full h-12 w-12 flex items-center justify-center ${data.bg} mb-3`}>
              <data.icon className="text-white" />
            </div>
            <h3 className="text-md font-medium text-border">{data.title}</h3>
            <p className="mt-2 text-2xl font-bold text-subMain">{data.total}</p>
          </div>
        ))}
      </div>

      {/* User Growth Stats */}
      {stats?.userGrowth && (
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-main border border-border rounded p-4">
            <h4 className="text-sm text-border">Today's Signups</h4>
            <p className="text-xl font-bold text-green-500 mt-2">
              +{stats.userGrowth.daily || 0}
            </p>
          </div>
          <div className="bg-main border border-border rounded p-4">
            <h4 className="text-sm text-border">This Week</h4>
            <p className="text-xl font-bold text-blue-500 mt-2">
              +{stats.userGrowth.weekly || 0}
            </p>
          </div>
          <div className="bg-main border border-border rounded p-4">
            <h4 className="text-sm text-border">This Month</h4>
            <p className="text-xl font-bold text-purple-500 mt-2">
              +{stats.userGrowth.monthly || 0}
            </p>
          </div>
        </div>
      )}

      {/* Recent Movies */}
      <h3 className="text-md font-medium my-6 text-border">Recent Movies</h3>
      {recentMovies.length > 0 ? (
        <Table data={recentMovies} admin={true} />
      ) : (
        <div className="text-center text-border py-8">
          No movies yet. Add your first movie!
        </div>
      )}
    </SideBar>
  );
}

export default Dashboard;
