import React, { useEffect, useState } from "react";
import Titles from "../Titles";
import { BsBookmarkStarFill } from "react-icons/bs";
import { Message, Select } from "../UsedInputs";
import Rating from "../Stars";
import { getMovieReviews } from "../../Data/movieAPI";

function MovieRates({ movie }) {
  const Ratings = [
    { title: "0 - Poor", value: 0 },
    { title: "1 - Fair", value: 1 },
    { title: "2 - Good", value: 2 },
    { title: "3 - Very Good", value: 3 },
    { title: "4 - Excellent", value: 4 },
    { title: "5 - Masterpiece", value: 5 },
  ];

  const [rating, setRating] = useState();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMovieReviews(movie?.id);
        setReviews(data?.results || []);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    if (movie?.id) {
      fetchReviews();
    }
  }, [movie?.id]);

  return (
    <div className="my-12">
      <Titles title="Reviews" Icon={BsBookmarkStarFill} />
      <div className="mt-10 xl:grid flex-colo grid-cols-5 gap-12 bg-dry xs:p-10 py-10 px-2 sm:p-20 rounded">
        {/* Write Review */}
        <div className="xl:col-span-2 w-full flex flex-col gap-8">
          <h3 className="text-xl text-text font-semibold">
            Review "{movie?.title || movie?.name}"
          </h3>
          <p className="text-sm leading-7 font-medium text-border">
            Write a review for this movie. It will be posted on this page.
          </p>
          <div className="text-sm w-full">
            <Select
              label="Select Rating"
              options={Ratings}
              onChange={(e) => setRating(e.target.value)}
            />
            <div className="flex mt-4 text-lg gap-2 text-star">
              <Rating value={rating} />
            </div>
          </div>
          <Message label="Message" placeholder="Make it short and sweet...." />
          <button className="bg-subMain text-white py-3 w-full flex-colo rounded">
            Submit
          </button>
        </div>

        {/* Reviewers */}
        <div className="col-span-3 flex flex-col gap-6">
          <h3 className="text-xl text-text font-semibold">
            Reviews ({reviews.length})
          </h3>
          <div className="w-full flex flex-col bg-main gap-6 rounded-lg md:p-12 p-6 h-header overflow-y-scroll">
            {reviews.map((review, i) => {
              const avatarPath = review.author_details.avatar_path;
              const avatarUrl = avatarPath
                ? avatarPath.startsWith("/https")
                  ? avatarPath.slice(1) // remove leading "/" if it's a full URL
                  : `https://image.tmdb.org/t/p/w300${avatarPath}`
                : "/images/user.jpg";

              return (
                <div
                  key={i}
                  className="md:grid flex flex-col w-full grid-cols-12 gap-6 bg-dry p-4 border border-gray-800 rounded-lg"
                >
                  <div className="col-span-2 bg-main hidden md:block">
                    <img
                      src={avatarUrl}
                      alt={review.author}
                      className="w-full h-24 rounded-lg object-cover"
                    />
                  </div>
                  <div className="col-span-7 flex flex-col gap-2">
                    <h2 className="text-base font-semibold text-white">{review.author}</h2>
                    <p className="text-xs leading-6 font-medium text-text">
                      {review.content}
                    </p>
                  </div>
                  <div className="col-span-3 flex-rows border-l border-border text-xs gap-1 text-star">
                    <Rating value={review.author_details.rating || 0} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieRates;
