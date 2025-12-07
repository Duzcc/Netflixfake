import React, { useState, useEffect } from "react";
import { FaPlay, FaShareAlt, FaHeart } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import FlexMovieItems from "../FlexMovieItems";
import { addFavorite, removeFavorite, isFavorite, isAuthenticated, getCurrentUser } from "../../utils/authUtils";

function MovieInfo({ movie, setModalOpen }) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = { user: getCurrentUser() }; // Mock hook usage

  useEffect(() => {
    if (movie && movie.id) {
      setIsLiked(isFavorite(String(movie.id)));
    }

    const handleUpdate = () => {
      if (movie && movie.id) {
        setIsLiked(isFavorite(String(movie.id)));
      }
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, [movie]);

  const toggleFavorite = async () => {
    if (!movie || !movie.id) return;

    if (!isAuthenticated()) {
      alert("Please login to add favorites");
      return;
    }

    const movieId = String(movie.id);
    if (isLiked) {
      await removeFavorite(movieId);
    } else {
      await addFavorite(movieId);
    }
  };

  if (!movie) return null;

  // Detect if data is from MongoDB or TMDb
  const isMongoDBData = movie.hasOwnProperty('name');

  // Get image URLs based on data source
  const backdropImage = isMongoDBData
    ? movie.titleImage
    : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  const posterImage = isMongoDBData
    ? movie.image
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

  const movieTitle = isMongoDBData ? movie.name : movie.title;
  const movieDescription = isMongoDBData ? movie.desc : movie.overview;
  const movieLanguage = isMongoDBData ? movie.language : movie.original_language?.toUpperCase();
  const movieId = isMongoDBData ? movie._id : movie.id;

  return (
    <div className="w-full xl:h-screen relative text-white">
      {/* Background Image */}
      {backdropImage && (
        <img
          src={backdropImage}
          alt={movieTitle}
          className="w-full hidden xl:inline-block h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Overlay Content */}
      <div className="xl:bg-main bg-dry xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center">
        <div className="container mx-auto px-3 2xl:px-32 xl:grid grid-cols-3 gap-8 py-10 lg:py-20">
          {/* Thumbnail */}
          <div className="xl:col-span-1 h-header bg-dry border border-gray-800 rounded-lg overflow-hidden xl:order-none order-last">
            {posterImage ? (
              <img
                src={posterImage}
                alt={movieTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/public/default-avatar.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-sm text-white">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="col-span-2 grid md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 flex flex-col gap-8">
              {/* Title */}
              <h1 className="text-2xl xl:text-4xl font-bold capitalize">
                {movieTitle}
              </h1>

              {/* Tags */}
              <div className="flex items-center gap-4 text-dryGray text-sm font-medium">
                <span className="bg-subMain text-xs px-2 py-1 rounded">HD 4K</span>
                <FlexMovieItems movie={movie} />
              </div>

              {/* Description */}
              <p className="text-sm text-text leading-7">
                {movieDescription || "No description available."}
              </p>

              {/* Detail Section: Share, Language, Watch */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-6 bg-main border border-gray-800 rounded-lg">
                {/* Share Button */}
                <div className="col-span-1 flex-colo border-r border-border">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-10 h-10 flex-colo rounded-lg bg-white bg-opacity-20 hover:bg-subMain transition"
                  >
                    <FaShareAlt />
                  </button>
                </div>

                {/* Language */}
                <div className="col-span-2 flex-colo text-sm font-medium text-white">
                  <p>
                    Language: {" "}
                    <span className="ml-2">{movieLanguage || 'EN'}</span>
                  </p>
                </div>

                {/* Watch Now */}
                <div className="sm:col-span-2 col-span-3 flex justify-end gap-2">
                  <Link
                    to={`/watch/${movieId}?type=movie`}
                    className="w-full py-3 sm:py-3 flex items-center justify-center gap-4 rounded-full bg-dry border-2 border-subMain hover:bg-subMain transition"
                  >
                    <FaPlay className="w-3 h-3" />
                    <span className="text-sm font-medium uppercase">Watch</span>
                  </Link>
                  <Link
                    to={`/watch/${movieId}?type=trailer`}
                    className="w-full py-3 sm:py-3 flex items-center justify-center gap-4 rounded-full bg-white bg-opacity-20 hover:bg-white hover:text-main transition"
                  >
                    <FaPlay className="w-3 h-3" />
                    <span className="text-sm font-medium uppercase">Trailer</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Download Button & Favorites */}
            <div className="md:col-span-2 mt-4 md:mt-0 flex flex-col gap-4 justify-end">
              <button className="w-full md:w-1/2 relative flex-colo h-20 md:h-64 rounded bg-subMain hover:bg-transparent border-2 border-subMain transition">
                <div className="absolute md:rotate-90 flex items-center gap-4 text-md uppercase tracking-widest">
                  Download <FiLogIn className="w-6 h-6" />
                </div>
              </button>

              <button
                onClick={toggleFavorite}
                className={`w-full md:w-1/2 py-3 flex items-center justify-center gap-4 rounded bg-white bg-opacity-20 hover:bg-subMain transition border-2 border-transparent ${isLiked ? "text-subMain" : "text-white"}`}
              >
                <FaHeart className={`w-6 h-6 ${isLiked ? "text-red-600" : "text-white"}`} />
                <span className="text-sm font-medium uppercase">{isLiked ? "Added" : "Add to Favorites"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;
