import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { fetchMovieDetails, fetchMovieTrailer } from "../Data/movieAPI";

function WatchPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [movieData, trailerData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieTrailer(id),
        ]);
        setMovie(movieData);
        setTrailerKey(trailerData); // trailerData giờ là key
      } catch (error) {
        console.error("Error loading movie data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  return (
    <Layout>
      <div className="container mx-auto min-h-screen px-2 my-6">
        {loading ? (
          <p className="text-center text-white py-10">Loading...</p>
        ) : trailerKey ? (
          <div className="w-full flex-colo px-4 lg:py-12 py-6">
            <h1 className="text-xl font-bold text-white text-center mb-6">
              {movie?.title || movie?.name || "Untitled"}
            </h1>
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-white py-10">
            Trailer hiện không khả dụng cho phim này.
          </div>
        )}
      </div>
    </Layout>
  );
}

export default WatchPage;
