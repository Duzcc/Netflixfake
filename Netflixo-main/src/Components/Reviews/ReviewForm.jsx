import React, { useState } from 'react';
import { toast } from 'react-toastify';
import StarRating from '../Rating/StarRating';
import api from '../../utils/api';
import { getCurrentUser } from '../../utils/authUtils';

function ReviewForm({ movieId, movieTitle, moviePoster, onReviewSubmitted }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const currentUser = getCurrentUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setSubmitting(true);

        try {
            // Try to submit to backend first
            await api.post(`/movies/${movieId}/reviews`, {
                rating,
                comment: comment.trim(),
                title: movieTitle,
                poster_path: moviePoster,
            });

            toast.success('Review submitted successfully!');
        } catch (error) {
            // If backend fails (TMDB movie not in DB), save to localStorage instead
            console.log('Backend save failed, saving to localStorage...');

            const localReview = {
                _id: `local-${movieId}-${Date.now()}`,
                user: {
                    _id: currentUser._id,
                    name: currentUser.name,
                    image: currentUser.image || `https://i.pravatar.cc/150?u=${currentUser.email}`,
                },
                movie: {
                    movieId: parseInt(movieId),
                    title: movieTitle,
                },
                rating,
                comment: comment.trim(),
                status: 'approved',
                flagged: false,
                featured: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isLocal: true, // Mark as local review
            };

            // Get existing local reviews
            const localReviewsKey = `reviews_${movieId}`;
            const existingReviews = JSON.parse(localStorage.getItem(localReviewsKey) || '[]');

            // Add new review
            existingReviews.unshift(localReview);

            // Save back to localStorage
            localStorage.setItem(localReviewsKey, JSON.stringify(existingReviews));

            toast.success('Review added! (Saved locally)');
        } finally {
            setSubmitting(false);
            setRating(0);
            setComment('');

            // Notify parent to reload reviews
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        }
    };

    // Block admins from submitting reviews
    if (currentUser?.isAdmin) {
        return (
            <div className="bg-main border border-border rounded-lg p-6">
                <div className="text-center py-8">
                    <p className="text-yellow-500 font-semibold mb-2">Admin Access Restricted</p>
                    <p className="text-sm text-gray-400">
                        Admins cannot submit reviews to maintain objectivity.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-main border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Your Rating</label>
                    <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this movie..."
                        className="w-full h-32 bg-dry border border-border rounded-lg p-4 text-sm resize-none focus:border-subMain transitions"
                        disabled={submitting}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-subMain text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-80 transitions disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;
