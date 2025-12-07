import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { searchMovies } from "../Data/movieAPI";

function SearchBar({ onSearchResults, defaultQuery = "" }) {
    const [query, setQuery] = useState(defaultQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await searchMovies(query);
                setSuggestions(results.slice(0, 5)); // Show top 5 suggestions
                if (onSearchResults) {
                    onSearchResults(results);
                }
            } catch (error) {
                console.error("Search error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/movies?query=${encodeURIComponent(query)}`);
            setIsFocused(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions([]);
        if (onSearchResults) {
            onSearchResults([]);
        }
    };

    const handleSuggestionClick = (movie) => {
        navigate(`/movie/${movie.id}`);
        setIsFocused(false);
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (!suggestions.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
        }
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative">
                {/* Search Input */}
                <div
                    className={`relative flex items-center glass-dark backdrop-blur-lg border-2 rounded-full overflow-hidden transition-all duration-300 ${isFocused
                            ? "border-subMain shadow-glow"
                            : "border-white/20 hover:border-white/40"
                        }`}
                >
                    <FaSearch className="absolute left-5 text-text-secondary text-lg" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search movies, TV shows..."
                        className="w-full bg-transparent text-white pl-14 pr-14 py-4 outline-none placeholder-text-secondary"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-5 text-text-secondary hover:text-white transition-colors"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    )}
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="absolute right-14 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-subMain border-t-transparent" />
                    </div>
                )}
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {isFocused && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 w-full glass-dark backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl z-50"
                    >
                        {suggestions.map((movie, index) => {
                            const poster = movie.poster_path
                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                : "https://placehold.co/92x138?text=No+Image";
                            const title = movie.title || movie.name || "Untitled";
                            const year = movie.release_date
                                ? new Date(movie.release_date).getFullYear()
                                : movie.first_air_date
                                    ? new Date(movie.first_air_date).getFullYear()
                                    : "";

                            return (
                                <button
                                    key={movie.id}
                                    onClick={() => handleSuggestionClick(movie)}
                                    className={`w-full flex items-center gap-4 p-3 transition-colors ${selectedIndex === index
                                            ? "bg-subMain/30"
                                            : "hover:bg-white/10"
                                        }`}
                                >
                                    <img
                                        src={poster}
                                        alt={title}
                                        className="w-12 h-16 object-cover rounded"
                                        loading="lazy"
                                    />
                                    <div className="flex-1 text-left">
                                        <p className="text-white font-semibold line-clamp-1">
                                            {title}
                                        </p>
                                        {year && (
                                            <p className="text-text-secondary text-sm">{year}</p>
                                        )}
                                    </div>
                                    {movie.vote_average && (
                                        <div className="flex items-center gap-1 text-star">
                                            <span className="text-sm">★</span>
                                            <span className="text-white text-sm font-semibold">
                                                {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SearchBar;
