import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import MovieCasts from "../Components/Single/MovieCasts";
import MovieInfo from "../Components/Single/MovieInfo";
import MovieRates from "../Components/Single/MovieRates";
import Titles from "../Components/Titles";
import Layout from "../Layout/Layout";
import { BsCollectionFill } from "react-icons/bs";
import Movie from "../Components/Movie";
import ShareMovieModal from "../Components/Modals/ShareModal";
import MovieInfoSkeleton from "../Components/Loading/MovieInfoSkeleton";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function SingleMovie() {
  const [modalOpen, setModalOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        // Fetch from local MongoDB
        const response = await axios.get(`${API_URL}/movies/${id}`);
        setMovie(response.data);

        // Fetch related movies from local DB (same category)
        if (response.data.category) {
          const relatedResponse = await axios.get(
            `${API_URL}/movies?category=${response.data.category}&pageNumber=1&limit=10`
          );
          // Filter out current movie
          const related = (relatedResponse.data.movies || []).filter(
            m => m._id !== id
          );
          setRelatedMovies(related.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading || !movie) {
    return (
      <Layout>
        <MovieInfoSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Modal chia sẻ phim */}
      <ShareMovieModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        movie={movie}
      />

      {/* Thông tin chi tiết phim */}
      <MovieInfo movie={movie} setModalOpen={setModalOpen} />

      <div className="container mx-auto min-h-screen px-2 my-6">
        {/* Trailer Section */}
        {(() => {
          // Extract trailer video key from different formats
          let trailerKey = null;

          // MongoDB format (imported movies)
          if (movie.video) {
            trailerKey = movie.video;
          }
          // TMDb API format (fallback movies)
          else if (movie.videos?.results) {
            const trailer = movie.videos.results.find(
              v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
            ) || movie.videos.results.find(
              v => v.type === 'Trailer' && v.site === 'YouTube'
            ) || movie.videos.results.find(
              v => v.site === 'YouTube'
            );
            if (trailer) {
              trailerKey = trailer.key;
            }
          }

          return trailerKey ? (
            <div className="mb-10">
              <Titles title="Watch Trailer" Icon={BsCollectionFill} />
              <div className="mt-6 w-full">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`${movie.name || movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Dàn diễn viên */}
        {(() => {
          // Extract casts from different formats
          let castsToDisplay = null;

          // MongoDB format (imported movies)
          if (movie.casts && movie.casts.length > 0) {
            castsToDisplay = movie.casts;
          }
          // TMDb API format (fallback movies)
          else if (movie.credits?.cast) {
            castsToDisplay = movie.credits.cast;
          }

          return castsToDisplay && castsToDisplay.length > 0 ? (
            <MovieCasts movie={{ casts: castsToDisplay }} />
          ) : null;
        })()}

        {/* Đánh giá người dùng */}
        <MovieRates movie={movie} />

        {/* Phim liên quan */}
        {relatedMovies.length > 0 && (
          <div className="my-16">
            <Titles title="Related Movies" Icon={BsCollectionFill} />
            <div className="grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6">
              {relatedMovies.map((related, index) => (
                <Movie key={related._id || index} movie={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SingleMovie;
