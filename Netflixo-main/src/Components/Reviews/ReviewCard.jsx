import React from 'react';
import StarRating from '../Rating/StarRating';

function ReviewCard({ review }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-dry border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    {review.userImage ? (
                        <img
                            src={review.userImage}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-border"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-subMain flex items-center justify-center text-white font-bold text-lg">
                            {review.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="font-semibold text-lg">{review.name}</h4>
                            <p className="text-xs text-text">
                                {formatDate(review.createdAt || new Date())}
                            </p>
                        </div>
                        <StarRating rating={review.rating} readonly size="sm" />
                    </div>

                    <p className="text-sm text-text leading-relaxed mt-3">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ReviewCard;
