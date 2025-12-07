import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        userImage: { type: String },
    },
    {
        timestamps: true,
    }
);

const movieSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        titleImage: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
        video: {
            type: String,
        },
        videoUrl: {
            type: String,
        },
        videoPublicId: {
            type: String,
        },
        videoDuration: {
            type: Number, // Duration in seconds
        },
        videoQuality: {
            type: String,
            enum: ['720p', '1080p', '4K'],
            default: '1080p',
        },
        rate: {
            type: Number,
            required: true,
            default: 0,
        },
        numberOfReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        reviews: [reviewSchema],
        casts: [
            {
                name: { type: String, required: true },
                image: { type: String },
                character: { type: String }, // Character name in the movie
                order: { type: Number }, // Order of appearance
            },
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        // TMDb Integration Fields
        tmdbId: {
            type: Number,
            unique: true,
            sparse: true, // Allows null for manually added movies
        },
        importSource: {
            type: String,
            enum: ['manual', 'tmdb'],
            default: 'manual',
        },
        lastSyncedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// ============================================
// DATABASE INDEXES FOR PERFORMANCE
// ============================================

// Text search index on name and description
movieSchema.index({ name: 'text', desc: 'text' });

// Category filter index
movieSchema.index({ category: 1 });

// Sort by date index
movieSchema.index({ createdAt: -1 });

// Sort by rating index
movieSchema.index({ rate: -1 });

// Year filter index
movieSchema.index({ year: -1 });

// Compound index for category + rating (common query)
movieSchema.index({ category: 1, rate: -1 });

// User's movies index
movieSchema.index({ userId: 1, createdAt: -1 });

// TMDb tracking indexes
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ importSource: 1, createdAt: -1 });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
