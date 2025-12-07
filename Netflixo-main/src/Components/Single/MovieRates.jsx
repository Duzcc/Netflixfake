import React, { useEffect, useState } from "react";
import Titles from "../Titles";
import { BsBookmarkStarFill } from "react-icons/bs";
import { getMovieReviews } from "../../Data/movieAPI";
import ReviewForm from "../Reviews/ReviewForm";
import ReviewList from "../Reviews/ReviewList";

function MovieRates({ movie }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get correct ID (MongoDB uses _id, TMDb uses id)
  const movieId = movie?._id || movie?.id;

  const fetchReviews = async () => {
    if (!movieId) return;

    setLoading(true);
    try {
      const data = await getMovieReviews(movieId);

      // Get backend/fake reviews
      const backendReviews = data?.reviews || data?.results || [];

      // Get local reviews from localStorage
      const localReviewsKey = `reviews_${movieId}`;
      const localReviews = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');

      // Merge local reviews with backend reviews (local reviews first)
      const allReviews = [...localReviews, ...backendReviews];

      setReviews(allReviews);
    } catch (error) {
      // Silently handle errors - just show local reviews
      const localReviewsKey = `reviews_${movieId}`;
      const localReviews = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');
      setReviews(localReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const handleReviewSubmitted = () => {
    fetchReviews(); // Reload reviews after submission
  };

  return (
    <div className="my-12">
      <Titles title="Reviews" Icon={BsBookmarkStarFill} />

      {/* Review Form */}
      <div className="mt-10">
        <ReviewForm
          movieId={movieId}
          movieTitle={movie?.name || movie?.title}
          moviePoster={movie?.image || (movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      {/* Review List */}
      <div className="mt-10">
        <ReviewList reviews={reviews} loading={loading} />
      </div>
    </div>
  );
}

export default MovieRates;
