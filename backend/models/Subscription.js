import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        plan: {
            type: String,
            required: true,
            enum: ['basic', 'standard', 'premium'],
            default: 'basic',
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'cancelled', 'expired', 'past_due'],
            default: 'active',
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        stripeSubscriptionId: {
            type: String,
        },
        stripeCustomerId: {
            type: String,
        },
        stripePriceId: {
            type: String,
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },
        cancelledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function () {
    return this.status === 'active' && this.endDate > new Date();
};

// Static method to get active subscription for user
subscriptionSchema.statics.getActiveSubscription = async function (userId) {
    return await this.findOne({
        user: userId,
        status: 'active',
        endDate: { $gt: new Date() },
    });
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
