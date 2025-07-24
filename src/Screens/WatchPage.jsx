import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { fetchMovieDetails, fetchMovieTrailer } from "../Data/movieAPI";

function WatchPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [movieData, trailerData] = await Promise.all([
        fetchMovieDetails(id),
        fetchMovieTrailer(id)
      ]);
      setMovie(movieData);
      setTrailer(trailerData);
      setLoading(false);
    };
    loadData();
  }, [id]);

  return (
    <Layout>
      <div className="container mx-auto min-h-screen px-2 my-6">
        {loading ? (
          <p className="text-center text-white py-10">Loading...</p>
        ) : (
          trailer ? (
            <div className="w-full flex-colo px-4 lg:py-12 py-6">
              <h1 className="text-xl font-bold text-white text-center mb-6">
                {movie?.title || movie?.name || "Untitled"}
              </h1>
              <div className="w-full aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
            <p className="text-center text-white py-10">
              No trailer available for this movie.
            </p>
          )
        )}
      </div>
    </Layout>
  );
}

export default WatchPage;
