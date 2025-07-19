import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "30b47161062a3e6b81f7060289df3481";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: API_KEY,
          language: "en-US",
          page: 1,
        },
      })
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error("Lỗi gọi API TMDB:", err));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-black text-white rounded overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto"
          />
          <div className="p-2">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p className="text-sm opacity-70">⭐ {movie.vote_average}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
