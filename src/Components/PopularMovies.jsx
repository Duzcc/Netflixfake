import React, { useEffect, useState } from "react";
import { fetchPopularMovies } from "../Components/Data/movieAPI";
import Movie from "../Components/Movie";

function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const results = await fetchPopularMovies();
        setMovies(results);
      } catch (error) {
        console.error("Lỗi khi tải phim phổ biến:", error);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="my-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Popular Movies</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default PopularMovies;
