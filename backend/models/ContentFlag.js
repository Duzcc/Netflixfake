import mongoose from 'mongoose';

const contentFlagSchema = new mongoose.Schema(
    {
        contentType: {
            type: String,
            enum: ['movie', 'review', 'user'],
            required: true,
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'contentType',
        },
        // For movies (TMDB)
        movieId: {
            type: Number,
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: {
            type: String,
            enum: [
                'inappropriate',
                'spam',
                'copyright',
                'misleading',
                'offensive',
                'violence',
                'adult_content',
                'other',
            ],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'resolved', 'ignored'],
            default: 'pending',
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resolvedAt: {
            type: Date,
        },
        resolution: {
            type: String,
        },
        actionTaken: {
            type: String,
            enum: ['none', 'content_removed', 'user_warned', 'user_banned', 'content_edited'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
contentFlagSchema.index({ contentType: 1, contentId: 1 });
contentFlagSchema.index({ status: 1, createdAt: -1 });
contentFlagSchema.index({ reportedBy: 1 });

const ContentFlag = mongoose.model('ContentFlag', contentFlagSchema);

export default ContentFlag;
