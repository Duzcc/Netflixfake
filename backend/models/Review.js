import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // Store TMDB movie data directly (not MongoDB reference)
        movie: {
            movieId: {
                type: Number,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            poster_path: {
                type: String,
            },
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        // Moderation fields
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved', // Auto-approve by default, can be changed to 'pending'
        },
        flagged: {
            type: Boolean,
            default: false,
        },
        flagReason: {
            type: String,
        },
        moderatorNotes: {
            type: String,
        },
        moderatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        moderatedAt: {
            type: Date,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index: one review per user per movie
reviewSchema.index({ user: 1, 'movie.movieId': 1 }, { unique: true });
reviewSchema.index({ 'movie.movieId': 1, createdAt: -1 }); // For getting movie reviews sorted by date

// Static method to add or update review
reviewSchema.statics.addOrUpdateReview = async function (userId, movieData, rating, comment) {
    const review = await this.findOneAndUpdate(
        { user: userId, 'movie.movieId': movieData.movieId },
        {
            movie: movieData,
            rating,
            comment,
        },
        { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email image');

    return review;
};

// Static method to get movie reviews
reviewSchema.statics.getMovieReviews = async function (movieId) {
    return await this.find({ 'movie.movieId': Number(movieId) })
        .populate('user', 'name email image')
        .sort({ createdAt: -1 });
};

// Static method to get user's reviews
reviewSchema.statics.getUserReviews = async function (userId) {
    return await this.find({ user: userId })
        .sort({ createdAt: -1 });
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
