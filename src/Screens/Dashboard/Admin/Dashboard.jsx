import React, { useEffect, useState } from "react";
import { FaRegListAlt, FaUser } from "react-icons/fa";
import { HiViewGridAdd } from "react-icons/hi";
import SideBar from "../SideBar";
import Table from "../../../Components/Table";

import { fetchPopularMovies, getGenres } from "../../../Data/movieAPI";

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [totalUsers, setTotalUsers] = useState(120); 
  const [totalCategories, setTotalCategories] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const [moviesData, genresData] = await Promise.all([
        fetchPopularMovies(),
        getGenres(), 
      ]);

      setMovies(moviesData);
      setTotalCategories(genresData.length);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
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
      total: movies.length,
    },
    {
      bg: "bg-blue-700",
      icon: HiViewGridAdd,
      title: "Total Categories",
      total: totalCategories,
    },
    {
      bg: "bg-green-600",
      icon: FaUser,
      title: "Total Users",
      total: totalUsers,
    },
  ];

  return (
    <SideBar>
      <h2 className="text-xl font-bold">Dashboard</h2>

      {/* Box thống kê */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {DashboardData.map((data, index) => (
          <div
            key={index}
            className="p-4 rounded bg-main border-border grid grid-cols-4 gap-2"
          >
            <div
              className={`col-span-1 rounded-full h-12 w-12 flex-colo ${data.bg}`}
            >
              <data.icon />
            </div>
            <div className="col-span-3">
              <h2>{data.title}</h2>
              <p className="mt-2 font-bold">{data.total}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Movies mới nhất */}
      <h3 className="text-md font-medium my-6 text-border">Recent Movies</h3>
      <Table data={movies.slice(0, 5)} admin={true} />
    </SideBar>
  );
}

export default Dashboard;
