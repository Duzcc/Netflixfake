import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Movie({ movie }) {
  if (!movie || !movie.id) return null;

  const poster = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const title = movie?.title || movie?.name || "Untitled";

  return (
    <div className="border border-border p-1 hover:scale-95 transitions relative rounded overflow-hidden">
      <Link to={`/movie/${movie.id}`} className="w-full block">
        <img
          src={poster}
          alt={title}
          title={title}
          className="w-full h-64 object-cover"
        />
      </Link>

      <div className="absolute flex flex-col gap-2 bottom-0 right-0 left-0 bg-main bg-opacity-60 text-white px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold truncate">{title}</h3>
          <button className="h-9 w-9 text-sm flex-colo transitions hover:bg-transparent border-2 border-subMain rounded-md bg-subMain text-white">
            <FaHeart />
          </button>
        </div>

        {/* Nút xem phim */}
        <Link
          to={`/watch/${movie.id}`}
          className="text-xs text-subMain hover:underline text-right"
        >
          ▶ Watch Now
        </Link>
      </div>
    </div>
  );
}

export default Movie;
