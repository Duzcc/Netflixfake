import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Premium Subscription',
                        description: 'Unlock all premium movies and features',
                    },
                    unit_amount: 999, // $9.99
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        customer_email: req.user.email,
        metadata: {
            userId: req.user._id.toString(),
        },
    });

    res.json({ id: session.id });
});

// @desc    Stripe webhook
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        // Update user to premium
        const user = await User.findById(userId);
        if (user) {
            user.isPremium = true; // Assuming we add this field
            await user.save();
        }
    }

    res.json({ received: true });
});

export { createCheckoutSession, handleWebhook };
