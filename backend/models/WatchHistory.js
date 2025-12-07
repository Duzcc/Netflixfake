import mongoose from 'mongoose';

const watchHistorySchema = mongoose.Schema(
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
        watchedAt: {
            type: Date,
            default: Date.now,
        },
        progress: {
            type: Number, // Progress in seconds
            default: 0,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
watchHistorySchema.index({ user: 1, watchedAt: -1 });
watchHistorySchema.index({ user: 1, 'movie.movieId': 1 });

// Static method to add or update watch history
watchHistorySchema.statics.addOrUpdate = async function (userId, movieData, progress, completed = false) {
    const existing = await this.findOne({ user: userId, 'movie.movieId': movieData.movieId });

    if (existing) {
        existing.progress = progress;
        existing.completed = completed;
        existing.watchedAt = new Date();
        // Update movie data in case it changed
        existing.movie = movieData;
        return await existing.save();
    } else {
        return await this.create({
            user: userId,
            movie: movieData,
            progress,
            completed,
        });
    }
};

// Static method to get user's watch history
watchHistorySchema.statics.getUserHistory = async function (userId, limit = 20) {
    return await this.find({ user: userId })
        .sort({ watchedAt: -1 })
        .limit(limit);
};

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

export default WatchHistory;
