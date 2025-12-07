import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaPlus, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { addFavorite, isFavorite, isAuthenticated } from "../utils/authUtils";

function MovieHero({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const currentMovie = movies[currentIndex];

    useEffect(() => {
        if (currentMovie) {
            setIsLiked(isFavorite(String(currentMovie.id)));
        }
    }, [currentMovie]);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
        }, 8000);

        return () => clearInterval(interval);
    }, [movies.length]);

    if (!currentMovie) return null;

    const backdrop = currentMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
        : currentMovie.poster_path
            ? `https://image.tmdb.org/t/p/original${currentMovie.poster_path}`
            : "https://placehold.co/1920x1080?text=No+Image";

    const title = currentMovie.title || currentMovie.name || "Untitled";
    const overview = currentMovie.overview || "No description available.";
    const rating = currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : "N/A";
    const year = currentMovie.release_date
        ? new Date(currentMovie.release_date).getFullYear()
        : currentMovie.first_air_date
            ? new Date(currentMovie.first_air_date).getFullYear()
            : "";

    const handleAddToList = async (e) => {
        e.preventDefault();
        if (!isAuthenticated()) {
            alert("Please login to add to your list");
            return;
        }
        if (!isLiked) {
            await addFavorite(String(currentMovie.id));
            setIsLiked(true);
        }
    };

    return (
        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden mb-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={backdrop}
                            alt={title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        {/* Multiple Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-main via-main/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-main via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-main/20 via-transparent to-main" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="max-w-2xl z-10"
                        >
                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl"
                            >
                                {title}
                            </motion.h1>

                            {/* Meta Info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="flex items-center gap-4 mb-6"
                            >
                                {rating !== "N/A" && (
                                    <div className="flex items-center gap-2 glass-dark backdrop-blur-md px-3 py-1 rounded-full">
                                        <span className="text-star text-lg">★</span>
                                        <span className="text-white font-semibold">{rating}</span>
                                    </div>
                                )}
                                {year && (
                                    <span className="text-text-secondary text-lg font-medium">{year}</span>
                                )}
                                {currentMovie.genre_ids && currentMovie.genre_ids.length > 0 && (
                                    <span className="text-text-secondary text-sm">
                                        {/* Could map genre IDs to names if we have the mapping */}
                                    </span>
                                )}
                            </motion.div>

                            {/* Overview */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="text-white text-base md:text-lg leading-relaxed mb-8 line-clamp-3 drop-shadow-lg max-w-xl"
                            >
                                {overview}
                            </motion.p>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link
                                    to={`/movie/${currentMovie.id}`}
                                    className="flex items-center gap-3 bg-white text-main px-8 py-3 rounded-md font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-glow group"
                                >
                                    <FaPlay className="group-hover:scale-110 transition-transform" />
                                    <span>Play</span>
                                </Link>

                                <button
                                    onClick={handleAddToList}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-md font-bold text-lg transition-all duration-300 ${isLiked
                                            ? "glass-dark backdrop-blur-md text-white border-2 border-white/30"
                                            : "glass-dark backdrop-blur-md text-white hover:bg-white/20 border-2 border-white/30"
                                        }`}
                                >
                                    <FaPlus className={isLiked ? "rotate-45 transition-transform" : ""} />
                                    <span>{isLiked ? "Added" : "My List"}</span>
                                </button>

                                <Link
                                    to={`/movie/${currentMovie.id}`}
                                    className="flex items-center gap-3 glass-dark backdrop-blur-md text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
                                >
                                    <FaInfoCircle />
                                    <span>More Info</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                        {movies.slice(0, 5).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "w-8 bg-subMain"
                                        : "w-4 bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default MovieHero;
