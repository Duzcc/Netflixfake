import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'register',
            'profile_update',
            'password_change',
            'movie_view',
            'movie_favorite',
            'movie_unfavorite',
            'watchlist_add',
            'watchlist_remove',
            'review_create',
            'review_update',
            'review_delete',
            'subscription_start',
            'subscription_cancel',
            'payment',
        ],
    },
    details: {
        type: mongoose.Schema.Mixed, // Flexible for different action types
    },
    ipAddress: String,
    userAgent: String,
    metadata: {
        type: mongoose.Schema.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Compound index for efficient queries
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ action: 1, createdAt: -1 });

// Auto-delete old activities after 90 days (optional)
userActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;
