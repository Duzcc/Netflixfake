import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { FaPlay, FaClock } from "react-icons/fa";
import { getContinueWatching } from "../../utils/historyUtils";
import { isAuthenticated } from "../../utils/authUtils";
import "swiper/css";
import "swiper/css/navigation";

const getMoviePoster = (posterPath) => {
    if (!posterPath) return 'https://placehold.co/500x750?text=No+Poster';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

function ContinueWatching() {
    const [continueWatching, setContinueWatching] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only load continue watching if user is authenticated
        if (!isAuthenticated()) {
            setLoading(false);
            return;
        }

        const loadContinueWatching = async () => {
            setLoading(true);
            const data = await getContinueWatching(10);
            setContinueWatching(data);
            setLoading(false);
        };

        loadContinueWatching();

        // Listen for watch history updates
        window.addEventListener("watchHistoryUpdated", loadContinueWatching);
        return () => {
            window.removeEventListener("watchHistoryUpdated", loadContinueWatching);
        };
    }, []);

    if (loading) {
        return (
            <div className="my-16">
                <h2 className="text-xl font-bold mb-6">Continue Watching</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-dry rounded-lg h-64 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (continueWatching.length === 0) {
        return null;
    }

    const getProgressPercentage = (item) => {
        if (!item.movie?.videoDuration || !item.progress) return 0;
        return Math.min((item.progress / item.movie.videoDuration) * 100, 100);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="my-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Continue Watching</h2>
                <Link
                    to="/history"
                    className="text-subMain hover:text-white transitions text-sm"
                >
                    View All
                </Link>
            </div>

            <Swiper
                spaceBetween={20}
                slidesPerView={1}
                loop={false}
                speed={1000}
                modules={[Navigation, Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                navigation={true}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="w-full"
            >
                {continueWatching.map((item) => (
                    <SwiperSlide key={item._id}>
                        <Link
                            to={`/watch/${item.movie?.movieId}`}
                            className="group relative block rounded-lg overflow-hidden bg-dry hover:scale-95 transitions"
                        >
                            {/* Movie Image */}
                            <div className="relative aspect-[2/3]">
                                <img
                                    src={getMoviePoster(item.movie?.poster_path)}
                                    alt={item.movie?.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transitions flex items-center justify-center">
                                    <FaPlay className="text-white text-4xl opacity-0 group-hover:opacity-100 transitions" />
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                    <div
                                        className="h-full bg-subMain transitions"
                                        style={{ width: `${getProgressPercentage(item)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="p-4">
                                <h3 className="text-white font-semibold truncate mb-2">
                                    {item.movie?.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <FaClock />
                                        {Math.floor(item.progress / 60)} min watched
                                    </span>
                                    <span>{Math.round(getProgressPercentage(item))}%</span>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ContinueWatching;
