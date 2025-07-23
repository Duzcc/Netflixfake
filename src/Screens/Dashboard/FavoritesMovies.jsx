import React, { useEffect, useState } from "react";
import Table from "../../Components/Table";
import SideBar from "./SideBar";
import { fetchMovieDetails } from "../../Data/movieAPI";

function FavoritesMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

      const promises = favorites.map((id) => fetchMovieDetails(id));
      const results = await Promise.all(promises);

      setMovies(results);
    } catch (error) {
      console.error("Error loading favorite movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleDeleteAll = () => {
    localStorage.removeItem("favoriteMovies");
    setMovies([]);
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-2">
          <h2 className="text-xl font-bold">Favorite Movies</h2>
          <button
            onClick={handleDeleteAll}
            className="bg-main font-medium transitions hover:bg-subMain border border-subMain text-white py-3 px-6 rounded"
          >
            Delete All
          </button>
        </div>

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <Table data={movies} admin={false} />
        )}
      </div>
    </SideBar>
  );
}

export default FavoritesMovies;
