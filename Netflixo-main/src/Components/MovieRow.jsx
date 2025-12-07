import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Movie from "./Movie";

function MovieRow({ title, movies, delay = 0 }) {
    const rowRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction) => {
        if (rowRef.current) {
            const scrollAmount = rowRef.current.offsetWidth * 0.8;
            const newScrollLeft =
                direction === "left"
                    ? rowRef.current.scrollLeft - scrollAmount
                    : rowRef.current.scrollLeft + scrollAmount;

            rowRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    const handleScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            className="relative group mb-12"
        >
            {/* Section Title */}
            <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">
                {title}
            </h2>

            {/* Movie Row Container */}
            <div className="relative px-4 md:px-8">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black text-white p-4 rounded-r-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                        aria-label="Scroll left"
                    >
                        <FaChevronLeft className="text-2xl" />
                    </motion.button>
                )}

                {/* Right Arrow */}
                {showRightArrow && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black text-white p-4 rounded-l-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                        aria-label="Scroll right"
                    >
                        <FaChevronRight className="text-2xl" />
                    </motion.button>
                )}

                {/* Scrollable Movies Container */}
                <div
                    ref={rowRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth pb-4"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {movies.filter(movie => movie && movie.id).map((movie, index) => (
                        <div
                            key={`movie-${movie.id}-${index}`}
                            className="flex-none w-[150px] sm:w-[180px] md:w-[220px] lg:w-[250px] transition-transform duration-300 ease-out hover:scale-105 hover:z-20"
                        >
                            <Movie movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default MovieRow;
