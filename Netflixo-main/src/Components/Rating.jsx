
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Rating({ value }) {
  return (
    <div className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map((i) =>
        value >= i ? (
          <FaStar key={i} />
        ) : value >= i - 0.5 ? (
          <FaStarHalfAlt key={i} />
        ) : (
          <FaRegStar key={i} />
        )
      )}
    </div>
  );
}

export default Rating;
