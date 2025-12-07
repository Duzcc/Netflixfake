import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { fetchMovieDetails, fetchMovieTrailer } from "../Data/movieAPI";
import { addWatchHistory, getMovieProgress } from "../utils/historyUtils";
import { FaPlay, FaYoutube, FaCalendarAlt, FaClock } from "react-icons/fa";

function WatchPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playType, setPlayType] = useState(typeParam || "movie");
  const [savedProgress, setSavedProgress] = useState(0);
  const [isReleased, setIsReleased] = useState(true);
  const [restartFromBeginning, setRestartFromBeginning] = useState(false);

  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Check if movie is released
  const checkReleaseStatus = (releaseDate) => {
    if (!releaseDate) return true; // If no date, assume released
    const today = new Date();
    const release = new Date(releaseDate);
    return release <= today;
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (typeParam) {
      setPlayType(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    // Don't load if no id
    if (!id) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [movieData, trailerData, progressData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieTrailer(id),
          getMovieProgress(id),
        ]);
        setMovie(movieData);
        setTrailerKey(trailerData);
        setSavedProgress(progressData.progress || 0);

        // Check release status
        const released = checkReleaseStatus(movieData.release_date || movieData.first_air_date);
        setIsReleased(released);

        // If not released, force trailer mode
        if (!released) {
          setPlayType("trailer");
        }
      } catch (error) {
        console.error("Error loading movie data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Track watch progress
  useEffect(() => {
    if (!movie || playType !== "movie" || !isReleased) return;

    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('❌ User not authenticated, skipping watch history');
      return;
    }

    console.log('▶️ Starting watch history tracking for:', movie.title || movie.name);

    // Record initial watch immediately
    const saveProgress = async (progress, completed = false) => {
      console.log(`💾 Saving watch progress: ${progress}s (${completed ? 'completed' : 'in progress'})`);
      const result = await addWatchHistory(movie, progress, completed);
      if (result.success) {
        console.log('✅ Watch history saved successfully');
      } else {
        console.error('❌ Failed to save watch history:', result.error);
      }
    };

    // Save initial progress
    saveProgress(savedProgress, false);
    startTimeRef.current = Date.now();

    // Update progress every 10 seconds (more frequent for better tracking)
    progressIntervalRef.current = setInterval(() => {
      const watchedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const totalProgress = savedProgress + watchedSeconds;

      // Estimate if movie is completed (watched > 90% or > movie duration - 5 min)
      const movieDuration = movie.runtime ? movie.runtime * 60 : 7200; // Default 2 hours
      const isCompleted = totalProgress > movieDuration * 0.9 || totalProgress > movieDuration - 300;

      saveProgress(totalProgress, isCompleted);

      if (isCompleted) {
        console.log('🎬 Movie marked as completed!');
        window.dispatchEvent(new Event("watchHistoryUpdated"));
      }
    }, 10000); // Every 10 seconds

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);

        // Save final progress on unmount
        const watchedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const totalProgress = savedProgress + watchedSeconds;
        console.log('⏸️ Stopping playback, saving final progress:', totalProgress);
        saveProgress(totalProgress, false);
        window.dispatchEvent(new Event("watchHistoryUpdated"));
      }
    };
  }, [movie, id, playType, savedProgress, isReleased]);

  return (
    <Layout>
      <div className="container mx-auto min-h-screen px-2 my-6">
        {loading ? (
          <p className="text-center text-white py-10">Loading...</p>
        ) : (
          <div className="w-full flex-colo px-4 lg:py-12 py-6">
            <h1 className="text-xl font-bold text-white text-center mb-6">
              {movie?.title || movie?.name || "Untitled"}
            </h1>

            {/* Release Status Message */}
            {!isReleased && (
              <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4 mb-6 flex items-center gap-3">
                <FaCalendarAlt className="text-yellow-500 text-2xl" />
                <div>
                  <p className="text-yellow-500 font-semibold">Coming Soon!</p>
                  <p className="text-sm text-yellow-400">
                    This movie will be released on {formatReleaseDate(movie?.release_date || movie?.first_air_date)}
                  </p>
                  <p className="text-xs text-yellow-300 mt-1">
                    You can watch the trailer now. Full movie will be available after release.
                  </p>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4 mb-6">
              {isReleased && (
                <button
                  onClick={() => setPlayType("movie")}
                  className={`flex items-center gap-2 px-6 py-3 rounded font-medium transition ${playType === "movie"
                    ? "bg-subMain text-white"
                    : "bg-dryGray text-white hover:bg-subMain"
                    }`}
                >
                  <FaPlay /> Watch Movie
                </button>
              )}
              <button
                onClick={() => setPlayType("trailer")}
                className={`flex items-center gap-2 px-6 py-3 rounded font-medium transition ${playType === "trailer"
                  ? "bg-subMain text-white"
                  : "bg-dryGray text-white hover:bg-subMain"
                  }`}
              >
                <FaYoutube /> Watch Trailer
              </button>
            </div>

            {/* Resume Notification */}
            {savedProgress > 60 && playType === "movie" && isReleased && !restartFromBeginning && (
              <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaClock className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-blue-400 font-semibold">
                      Continue watching from {Math.floor(savedProgress / 60)} min {savedProgress % 60} sec
                    </p>
                    <p className="text-xs text-blue-300">
                      You were {Math.floor((savedProgress / (movie.runtime * 60 || 7200)) * 100)}% through this movie
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRestartFromBeginning(true)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transitions"
                >
                  Start from Beginning
                </button>
              </div>
            )}

            {/* Video Player */}
            <div className="w-full aspect-video bg-black rounded overflow-hidden relative">
              {playType === "movie" && isReleased ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://vidsrc.xyz/embed/movie/${id}${!restartFromBeginning && savedProgress > 0 ? `#t=${savedProgress}` : ''}`}
                  title="Full Movie"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : trailerKey ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="YouTube Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <FaYoutube className="text-6xl mb-4 mx-auto text-red-500" />
                    <p>Trailer not available for this movie.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default WatchPage;
