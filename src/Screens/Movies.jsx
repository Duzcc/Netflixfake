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

  const loadMovies = async () => {
    try {
      setLoading(true);
      if (query) {
        const searchResults = await searchMovies(query);
        setMovies(searchResults);
      } else {
        const newMovies = await fetchPopularMovies(page);
        setMovies((prev) => [...prev, ...newMovies]);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMovies([]); // reset movie list if query changes
    setPage(1);
  }, [query]);

  useEffect(() => {
    loadMovies();
  }, [page, query]);

  const handleLoadMore = () => {
    if (!query) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Layout>
      <div className="min-height-screen container mx-auto px-2 my-6">
        <Filters />
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

        {/* Load More: only for popular movies, not search results */}
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
