import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCloudDownloadAlt, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { Link } from "react-router-dom";
import SideBar from "../SideBar";
import Rating from "../../../Components/Rating";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Head = "text-xs text-left text-main font-semibold px-6 py-2 uppercase";
const Text = "text-sm text-left leading-6 whitespace-nowrap px-5 py-3";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Get auth token
  const getAuthToken = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.token;
    }
    return null;
  };

  // Load movies from local MongoDB
  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/movies`);
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Delete single movie
  const handleDelete = async (movieId, movieName) => {
    if (!window.confirm(`Are you sure you want to delete "${movieName}"?`)) {
      return;
    }

    setDeleting(movieId);
    try {
      await axios.delete(`${API_URL}/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      toast.success(`"${movieName}" deleted successfully`);
      loadMovies(); // Reload list
    } catch (error) {
      console.error("Failed to delete movie:", error);
      toast.error(error.response?.data?.message || "Failed to delete movie");
    } finally {
      setDeleting(null);
    }
  };

  // Delete all movies
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL movies? This cannot be undone!")) {
      return;
    }

    if (!window.confirm("This will delete ALL movies in the database. Are you ABSOLUTELY sure?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      toast.success("All movies deleted successfully");
      setMovies([]);
    } catch (error) {
      console.error("Failed to delete all movies:", error);
      toast.error(error.response?.data?.message || "Failed to delete all movies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-2">
          <h2 className="text-xl font-bold text-white">
            Movies List ({movies.length} movies)
          </h2>
          <div className="flex gap-2">
            <Link
              to="/tmdb-import"
              className="bg-green-600 hover:bg-green-700 transitions font-medium text-white py-3 px-6 rounded"
            >
              Import from TMDb
            </Link>
            <button
              onClick={handleDeleteAll}
              disabled={loading || movies.length === 0}
              className="bg-red-600 hover:bg-red-700 transitions font-medium text-white py-3 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete All
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-white">Loading movies...</p>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No movies in database</p>
            <Link
              to="/tmdb-import"
              className="inline-block bg-subMain hover:bg-subMain/80 transitions text-white py-3 px-6 rounded"
            >
              Import Movies from TMDb
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border border-border divide-y divide-border">
              <thead className="bg-dryGray">
                <tr>
                  <th className={Head}>Poster</th>
                  <th className={Head}>Title</th>
                  <th className={Head}>Category</th>
                  <th className={Head}>Language</th>
                  <th className={Head}>Year</th>
                  <th className={Head}>Rating</th>
                  <th className={Head}>Source</th>
                  <th className={`${Head} text-end`}>Actions</th>
                </tr>
              </thead>

              <tbody className="bg-main divide-y divide-border">
                {movies.map((movie) => (
                  <tr key={movie._id}>
                    <td className={Text}>
                      <div className="w-12 h-12 p-1 bg-dry border border-border rounded overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={movie.image}
                          alt={movie.name}
                          onError={(e) => {
                            e.target.src = "/public/default-avatar.png";
                          }}
                        />
                      </div>
                    </td>

                    <td className={`${Text} truncate max-w-xs`}>
                      {movie.name}
                    </td>

                    <td className={Text}>
                      {movie.category || "N/A"}
                    </td>

                    <td className={Text}>
                      {movie.language?.toUpperCase() || "N/A"}
                    </td>

                    <td className={Text}>
                      {movie.year || "N/A"}
                    </td>

                    <td className={Text}>
                      <Rating value={movie.rate / 2} />
                    </td>

                    <td className={Text}>
                      <span className={`px-2 py-1 rounded text-xs ${movie.importSource === 'tmdb'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                        }`}>
                        {movie.importSource === 'tmdb' ? 'TMDb' : 'Manual'}
                      </span>
                    </td>

                    <td className={`${Text} float-right flex gap-2 items-center`}>
                      <Link
                        to={`/movie/${movie._id}`}
                        className="border border-border bg-dry text-gray-400 hover:text-white transitions rounded px-2 py-1 flex items-center gap-1"
                      >
                        View <GoEye className="text-subMain" />
                      </Link>
                      <button
                        onClick={() => handleDelete(movie._id, movie.name)}
                        disabled={deleting === movie._id}
                        className="bg-red-600 hover:bg-red-700 transitions text-white rounded px-3 py-1 flex items-center gap-1 disabled:opacity-50"
                      >
                        {deleting === movie._id ? 'Deleting...' : 'Delete'}
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SideBar>
  );
}

export default MoviesList;
