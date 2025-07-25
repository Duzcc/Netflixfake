import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "../Components/Filters";
import Layout from "../Layout/Layout";
import Movie from "../Components/Movie";
import { CgSpinner } from "react-icons/cg";
import { fetchPopularMovies, searchMovies } from "../Data/movieAPI";

function MoviesPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    genreId: null,
    yearRange: null,
    timeRange: null,
    rating: null,
  });

  const applyFilters = (movieList) => {
    return movieList.filter((movie) => {
      const {
        genreId,
        yearRange,
        timeRange,
        rating,
      } = filters;

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

  const loadMovies = async () => {
    try {
      setLoading(true);
      let fetchedMovies = [];

      if (query) {
        fetchedMovies = await searchMovies(query);
      } else {
        const newMovies = await fetchPopularMovies(page);
        fetchedMovies = [...(page === 1 ? [] : movies), ...newMovies];
      }

      const filtered = applyFilters(fetchedMovies);
      setMovies(filtered);
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  useEffect(() => {
    loadMovies();
  }, [page, query, filters]);

  const handleLoadMore = () => {
    if (!query) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Layout>
      <div className="min-height-screen container mx-auto px-2 my-6">
        <Filters onFilterChange={setFilters} />
        <p className="text-lg font-medium my-6">
          Total{" "}
          <span className="font-bold text-subMain">{movies.length}</span>{" "}
          items Found
        </p>

        <div className="grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {movies.map((movie, index) => (
            <Movie key={index} movie={movie} />
          ))}
        </div>

        {!query && (
          <div className="w-full flex-colo md:my-20 my-10">
            <button
              onClick={handleLoadMore}
              className="flex-rows gap-3 text-white py-3 px-8 rounded font-semibold border-2 border-subMain"
              disabled={loading}
            >
              {loading ? (
                <>
                  Loading... <CgSpinner className="animate-spin" />
                </>
              ) : (
                <>
                  Load More <CgSpinner />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MoviesPage;
