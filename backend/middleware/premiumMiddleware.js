import Subscription from '../models/Subscription.js';

// Premium access middleware
export const requirePremium = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Check if user has active subscription
        const subscription = await Subscription.getActiveSubscription(userId);

        if (!subscription) {
            res.status(403);
            throw new Error('Premium subscription required to access this content');
        }

        // Attach subscription to request
        req.subscription = subscription;
        next();
    } catch (error) {
        res.status(403);
        throw new Error(error.message || 'Premium subscription required');
    }
};

// Check subscription level
export const requireSubscriptionLevel = (requiredLevel) => {
    const levels = { basic: 1, standard: 2, premium: 3 };

    return async (req, res, next) => {
        try {
            const userId = req.user._id;
            const subscription = await Subscription.getActiveSubscription(userId);

            if (!subscription) {
                res.status(403);
                throw new Error('Subscription required');
            }

            const userLevel = levels[subscription.plan];
            const required = levels[requiredLevel];

            if (userLevel < required) {
                res.status(403);
                throw new Error(`${requiredLevel} subscription or higher required`);
            }

            req.subscription = subscription;
            next();
        } catch (error) {
            res.status(403);
            throw new Error(error.message || 'Insufficient subscription level');
        }
    };
};
