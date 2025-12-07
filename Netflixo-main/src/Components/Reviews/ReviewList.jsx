import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import { FiChevronDown } from 'react-icons/fi';

function ReviewList({ reviews = [], loading = false }) {
    const [sortBy, setSortBy] = useState('newest');
    const [displayCount, setDisplayCount] = useState(5);

    const sortedReviews = [...reviews].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });

    const displayedReviews = sortedReviews.slice(0, displayCount);
    const hasMore = sortedReviews.length > displayCount;

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-dry border border-border rounded-lg p-6 animate-pulse"
                    >
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-border" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-border rounded w-1/4" />
                                <div className="h-3 bg-border rounded w-1/3" />
                                <div className="h-16 bg-border rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-dry border border-border rounded-lg p-12 text-center">
                <p className="text-text">No reviews yet. Be the first to review this movie!</p>
            </div>
        );
    }

    return (
        <div>
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-dry border border-border rounded-lg px-4 py-2 text-sm focus:border-subMain transitions"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                </select>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
                {displayedReviews.map((review) => (
                    <ReviewCard key={review._id || review.id} review={review} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setDisplayCount((prev) => prev + 5)}
                        className="bg-dry border border-border px-6 py-3 rounded-lg font-medium hover:border-subMain transitions inline-flex items-center gap-2"
                    >
                        Load More Reviews
                        <FiChevronDown />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReviewList;
