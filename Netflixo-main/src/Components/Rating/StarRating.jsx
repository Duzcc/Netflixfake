import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

function StarRating({ rating = 0, onRatingChange, readonly = false, size = 'md' }) {
    const [hover, setHover] = useState(0);

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-3xl',
    };

    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className={`${sizeClasses[size]} transitions ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            }`}
                        onClick={() => !readonly && onRatingChange && onRatingChange(ratingValue)}
                        onMouseEnter={() => !readonly && setHover(ratingValue)}
                        onMouseLeave={() => !readonly && setHover(0)}
                        disabled={readonly}
                    >
                        <FaStar
                            className={
                                ratingValue <= (hover || rating)
                                    ? 'text-yellow-500'
                                    : 'text-gray-600'
                            }
                        />
                    </button>
                );
            })}
        </div>
    );
}

export default StarRating;
