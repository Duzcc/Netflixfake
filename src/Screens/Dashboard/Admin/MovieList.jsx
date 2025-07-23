import React, { useEffect, useState } from "react";
import Table from "../../../Components/Table";
import SideBar from "../SideBar";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies từ API
  const fetchMovies = async () => {
    try {
      const res = await fetch("https://your-api.com/api/movies"); // thay URL phù hợp
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Hàm xoá toàn bộ movie
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all movies?")) return;

    try {
      await fetch("https://your-api.com/api/movies", {
        method: "DELETE",
      });
      setMovies([]); // Cập nhật lại UI
    } catch (err) {
      console.error("Failed to delete all movies:", err);
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-2">
          <h2 className="text-xl font-bold">Movies List</h2>
          <button
            onClick={handleDeleteAll}
            className="bg-main font-medium transitions hover:bg-subMain border border-subMain text-white py-3 px-6 rounded"
          >
            Delete All
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
