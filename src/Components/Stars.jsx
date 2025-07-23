import React from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

function Rating({ value, text, color = "#facc15" }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1 text-sm">
      {stars.map((star) => (
        <span key={star} className="text-yellow-400">
          {value >= star ? (
            <FaStar color={color} />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
      ))}
      {text && <span className="ml-2 text-xs text-white">{text}</span>}
    </div>
  );
}

export default Rating;
