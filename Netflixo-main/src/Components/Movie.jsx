import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import FavoriteButton from "./Social/FavoriteButton";
import WatchlistButton from "./Social/WatchlistButton";

function Movie({ movie }) {
  if (!movie || !movie.id) return null;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750?text=No+Poster";

  const title = movie.title || movie.name || "Untitled";
  const movieId = movie.id;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() :
    movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : "";

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative rounded-lg overflow-hidden bg-dry shadow-card hover:shadow-card-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link to={`/movie/${movie.id}`} className="block relative">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Rating Badge - Top Right */}
          {rating !== "N/A" && (
            <div className="absolute top-2 right-2 glass-dark backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 z-10">
              <FaStar className="text-star text-xs" />
              <span className="text-white text-xs font-semibold">{rating}</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-subMain rounded-full p-4 shadow-glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="text-white text-2xl ml-1" />
            </motion.div>
          </motion.div>
        </div>

        {/* Movie Info - Visible on Hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 glass-dark backdrop-blur-lg"
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? 0 : "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {title}
          </h3>
          {year && (
            <p className="text-text-secondary text-xs">
              {year}
            </p>
          )}
        </motion.div>
      </Link>

      {/* Action Buttons - Top Left */}
      <div className="absolute top-2 left-2 flex gap-2 z-20">
        {/* Favorite Button */}
        <FavoriteButton movieId={movieId} iconOnly size="sm" />

        {/* Watchlist Button */}
        <WatchlistButton movieId={movieId} movie={movie} iconOnly size="sm" />
      </div>
    </motion.div>
  );
}

export default Movie;