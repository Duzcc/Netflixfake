import React, { useEffect, useState } from "react";
import Table from "../../../Components/Table";
import SideBar from "../SideBar";
import { fetchPopularMovies } from "../../../Data/movieAPI";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchPopularMovies();
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-2">
          <h2 className="text-xl font-bold text-white">Popular Movies</h2>
          {/* Nút xóa tạm thời bị vô hiệu hóa vì không có backend riêng */}
          <button
            disabled
            className="bg-gray-500 font-medium border border-gray-700 text-white py-3 px-6 rounded opacity-50 cursor-not-allowed"
          >
            Delete All (disabled)
          </button>
        </div>

        {loading ? (
          <p className="text-white">Loading movies...</p>
        ) : (
          <Table data={movies} admin={true} />
        )}
      </div>
    </SideBar>
  );
}

export default MoviesList;
