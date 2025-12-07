import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaTrash } from "react-icons/fa";
import SideBar from "./SideBar";
import { getFavorites, clearFavorites } from "../../utils/favoritesUtils";
import { toast } from "react-toastify";
import axios from "axios";
import Movie from "../../Components/Movie";

function FavoritesMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // Get list of favorite movie IDs from backend
      const favoriteIds = await getFavorites();
      setFavoriteMovieIds(favoriteIds);

      if (favoriteIds && favoriteIds.length > 0) {
        // Fetch movie details from TMDB for each favorite ID
        const moviePromises = favoriteIds.map(async (id) => {
          try {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
            );
            return response.data;
          } catch (error) {
            console.error(`Error fetching movie ${id}:`, error);
            return null;
          }
        });

        const fetchedMovies = await Promise.all(moviePromises);
        // Filter out null results (failed fetches)
        setMovies(fetchedMovies.filter((movie) => movie !== null));
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error loading favorite movies:", error);
      toast.error("Failed to load favorites");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    // Listen for favorites updates
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all your favorite movies?"
      )
    ) {
      return;
    }

    const result = await clearFavorites();
    if (result.success) {
      setMovies([]);
      setFavoriteMovieIds([]);
      toast.success("All favorites cleared successfully!");
    } else {
      toast.error(result.error || "Failed to clear favorites");
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6 pt-24 px-4
 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaHeart className="text-subMain" />
              My Favorites
            </h2>
            <p className="text-text-secondary mt-2">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  {movies.length} movie{movies.length !== 1 ? "s" : ""} in your
                  favorites
                </>
              )}
            </p>
          </div>
          {movies.length > 0 && (
            <motion.button
              onClick={handleDeleteAll}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass hover:bg-red-500/20 transitions text-red-500 py-3 px-6 rounded-lg font-medium border border-red-500/30 hover:border-red-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTrash />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-subMain border-t-transparent"></div>
              <p className="text-text-secondary">Loading your favorites...</p>
            </div>
          </div>
        ) : movies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Movie movie={movie} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl text-text-secondary">💔</div>
              <h3 className="text-2xl font-semibold text-white">
                No Favorites Yet
              </h3>
              <p className="text-text-secondary max-w-md">
                Start adding movies to your favorites by clicking the heart icon
                on any movie!
              </p>
              <Link
                to="/movies"
                className="mt-4 bg-subMain hover:bg-subMain/80 text-white px-8 py-3 rounded-lg font-medium transitions"
              >
                Browse Movies
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </SideBar>
  );
}

export default FavoritesMovies;
