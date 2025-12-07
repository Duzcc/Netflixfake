import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                'announcement',
                'system',
                'content_update',
                'account',
                'moderation',
                'promotion',
                'info',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String, // Optional link to navigate to
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        expiresAt: {
            type: Date, // Optional expiry for temporary notifications
        },
        metadata: mongoose.Schema.Types.Mixed, // Additional data without nested type
    },
    {
        timestamps: true,
    }
);

// Indexes
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

// Methods
notificationSchema.methods.markAsRead = async function () {
    this.read = true;
    this.readAt = Date.now();
    await this.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
