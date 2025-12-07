import React, { useEffect, useState } from "react";
import Titles from "../Titles";
import { BsBookmarkStarFill } from "react-icons/bs";
import { getMovieReviews } from "../../Data/movieAPI";
import ReviewForm from "../Reviews/ReviewForm";
import ReviewList from "../Reviews/ReviewList";

function MovieRates({ movie }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (!movie?.id) return;

    setLoading(true);
    try {
      const data = await getMovieReviews(movie.id);

      // Get backend/fake reviews
      const backendReviews = data?.reviews || data?.results || [];

      // Get local reviews from localStorage
      const localReviewsKey = `reviews_${movie.id}`;
      const localReviews = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');

      // Merge local reviews with backend reviews (local reviews first)
      const allReviews = [...localReviews, ...backendReviews];

      setReviews(allReviews);
    } catch (error) {
      console.error("Failed to fetch reviews", error);

      // On error, still show local reviews
      const localReviewsKey = `reviews_${movie.id}`;
      const localReviews = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');
      setReviews(localReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movie?.id]);

  const handleReviewSubmitted = () => {
    fetchReviews(); // Reload reviews after submission
  };

  return (
    <div className="my-12">
      <Titles title="Reviews" Icon={BsBookmarkStarFill} />

      {/* Review Form */}
      <div className="mt-10">
        <ReviewForm
          movieId={movie?.id}
          movieTitle={movie?.title || movie?.name}
          moviePoster={movie?.poster_path}
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
