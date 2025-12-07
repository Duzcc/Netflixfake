import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import MovieHero from "../Components/MovieHero";
import MovieRow from "../Components/MovieRow";
import SearchBar from "../Components/SearchBar";
import Filters from "../Components/Filters";
import Movie from "../Components/Movie";
import MovieCardSkeleton from "../Components/Loading/MovieCardSkeleton";
import { motion } from "framer-motion";
import { FaFilter, FaTh, FaList } from "react-icons/fa";
import { fetchPopularMovies, searchMovies, getGenres } from "../Data/movieAPI";

function MoviesPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("rows"); // 'rows' or 'grid'

  const [filters, setFilters] = useState({
    genreId: null,
    yearRange: null,
    timeRange: null,
    rating: null,
  });

  // Load genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    loadGenres();
  }, []);

  // Apply filters
  const applyFilters = (movieList) => {
    return movieList.filter((movie) => {
      const { genreId, yearRange, timeRange, rating } = filters;

      if (genreId && !movie.genre_ids?.includes(genreId)) return false;

      if (
        yearRange &&
        (!movie.release_date ||
          +movie.release_date.slice(0, 4) < yearRange[0] ||
          +movie.release_date.slice(0, 4) > yearRange[1])
      )
        return false;

      if (
        timeRange &&
        movie.runtime !== undefined &&
        (movie.runtime < timeRange[0] || movie.runtime > timeRange[1])
      )
        return false;

      if (rating && Math.floor(movie.vote_average / 2) < rating) return false;

      return true;
    });
  };

  // Organize movies by genre
  const organizeMoviesByGenre = (movies) => {
    const organized = {};

    genres.forEach((genre) => {
      const genreMovies = movies.filter((movie) =>
        movie.genre_ids?.includes(genre.id)
      );
      if (genreMovies.length > 0) {
        organized[genre.name] = genreMovies.slice(0, 20); // Limit to 20 per genre
      }
    });

    return organized;
  };

  // Load movies
  const loadMovies = async () => {
    try {
      setLoading(true);
      let fetchedMovies = [];

      if (query) {
        // Search mode
        fetchedMovies = await searchMovies(query);
        setViewMode("grid"); // Switch to grid for search results
      } else {
        // Browse mode - load multiple pages for variety
        const promises = [1, 2, 3].map((page) => fetchPopularMovies(page));
        const results = await Promise.all(promises);
        fetchedMovies = results.flat();
      }

      setAllMovies(fetchedMovies);
      const filtered = applyFilters(fetchedMovies);
      setFilteredMovies(filtered);

      if (!query && genres.length > 0) {
        const organized = organizeMoviesByGenre(filtered);
        setMoviesByGenre(organized);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genres.length > 0) {
      loadMovies();
    }
  }, [query, genres]);

  useEffect(() => {
    if (allMovies.length > 0) {
      const filtered = applyFilters(allMovies);
      setFilteredMovies(filtered);
      if (!query && genres.length > 0) {
        const organized = organizeMoviesByGenre(filtered);
        setMoviesByGenre(organized);
      }
    }
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  return (
    <Layout>
      <div className="min-h-screen bg-main">
        {/* Hero Section - Only show in browse mode */}
        {!query && !loading && filteredMovies.length > 0 && (
          <MovieHero movies={filteredMovies.slice(0, 5)} />
        )}

        {/* Search Bar */}
        <div className="container mx-auto px-4 md:px-8">
          <SearchBar defaultQuery={query || ""} />
        </div>

        {/* Filter Toggle & View Mode */}
        <div className="container mx-auto px-4 md:px-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${showFilters || hasActiveFilters
                  ? "bg-subMain text-white shadow-glow"
                  : "glass-dark backdrop-blur-md text-white border-2 border-white/20 hover:border-white/40"
                }`}
            >
              <FaFilter />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-subMain rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {Object.values(filters).filter((v) => v !== null).length}
                </span>
              )}
            </motion.button>

            {/* View Mode Toggle */}
            {query && (
              <div className="flex gap-2 glass-dark backdrop-blur-md rounded-full p-1 border border-white/20">
                <button
                  onClick={() => setViewMode("rows")}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${viewMode === "rows"
                      ? "bg-subMain text-white"
                      : "text-text-secondary hover:text-white"
                    }`}
                >
                  <FaList />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${viewMode === "grid"
                      ? "bg-subMain text-white"
                      : "text-text-secondary hover:text-white"
                    }`}
                >
                  <FaTh />
                </button>
              </div>
            )}

            {/* Results Count */}
            {query && (
              <p className="text-text-secondary">
                <span className="font-bold text-white">{filteredMovies.length}</span>{" "}
                results for "{query}"
              </p>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 md:px-8"
          >
            <Filters onFilterChange={setFilters} />
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="container mx-auto px-4 md:px-8 mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <MovieCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Search Results or Filtered Grid View */}
            {(query || viewMode === "grid") && filteredMovies.length > 0 ? (
              <div className="container mx-auto px-4 md:px-8 mb-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {filteredMovies.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Movie movie={movie} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              /* Category Rows View */
              !query && viewMode === "rows" && (
                <div className="mb-12">
                  {/* Trending Now - All filtered movies */}
                  {filteredMovies.length > 0 && (
                    <MovieRow
                      title="Trending Now"
                      movies={filteredMovies.slice(0, 20)}
                      delay={0}
                    />
                  )}

                  {/* Top Rated */}
                  {filteredMovies.length > 0 && (
                    <MovieRow
                      title="Top Rated"
                      movies={[...filteredMovies]
                        .sort((a, b) => b.vote_average - a.vote_average)
                        .slice(0, 20)}
                      delay={0.1}
                    />
                  )}

                  {/* Genre-based rows */}
                  {Object.entries(moviesByGenre).map(([genre, movies], index) => (
                    <MovieRow
                      key={genre}
                      title={genre}
                      movies={movies}
                      delay={0.1 * (index + 2)}
                    />
                  ))}
                </div>
              )
            )}

            {/* No Results */}
            {filteredMovies.length === 0 && !loading && (
              <div className="container mx-auto px-4 md:px-8 text-center py-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto"
                >
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    No movies found
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {query
                      ? `No results for "${query}"`
                      : "Try adjusting your filters"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={() =>
                        setFilters({
                          genreId: null,
                          yearRange: null,
                          timeRange: null,
                          rating: null,
                        })
                      }
                      className="bg-subMain text-white px-6 py-3 rounded-full font-semibold hover:bg-subMain/90 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default MoviesPage;
