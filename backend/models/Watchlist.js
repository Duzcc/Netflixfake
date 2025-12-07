import mongoose from 'mongoose';

const watchlistSchema = mongoose.Schema(
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
            backdrop_path: {
                type: String,
            },
            vote_average: {
                type: Number,
            },
            release_date: {
                type: String,
            },
            overview: {
                type: String,
            },
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicates and optimize queries
watchlistSchema.index({ user: 1, 'movie.movieId': 1 }, { unique: true });
watchlistSchema.index({ user: 1, addedAt: -1 });

// Static method to add movie to watchlist
watchlistSchema.statics.addToWatchlist = async function (userId, movieData) {
    try {
        return await this.create({
            user: userId,
            movie: movieData
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Movie already in watchlist');
        }
        throw error;
    }
};

// Static method to remove from watchlist
watchlistSchema.statics.removeFromWatchlist = async function (userId, movieId) {
    return await this.deleteOne({ user: userId, 'movie.movieId': movieId });
};

// Static method to get user's watchlist
watchlistSchema.statics.getUserWatchlist = async function (userId) {
    return await this.find({ user: userId })
        .sort({ addedAt: -1 });
};

// Static method to check if movie is in watchlist
watchlistSchema.statics.isInWatchlist = async function (userId, movieId) {
    const item = await this.findOne({ user: userId, 'movie.movieId': movieId });
    return !!item;
};

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
